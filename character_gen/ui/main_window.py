"""
Main Window for Traveller 5 Character Creator (PySide6).
"""
import sys
from pathlib import Path
from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QMainWindow, QWidget, QHBoxLayout, QVBoxLayout, QSplitter,
    QToolBar, QStatusBar, QFileDialog, QMessageBox, QInputDialog
)
from PySide6.QtGui import QAction, QIcon

from character_gen.engine.character_engine import CharacterEngine, GenerationState
from character_gen.ui.character_stats_panel import CharacterStatsPanel
from character_gen.ui.wizard_view import WizardView
from character_gen.ui.sheet_view import SheetView
from character_gen.ui.career_log_widget import CareerLogWidget
from character_gen.exporters.json_exporter import export_character_json, import_character_json
from character_gen.exporters.text_exporter import export_character_markdown


from character_gen.engine.dialog_handler import DialogHandler


class CharacterMainWindow(QMainWindow):
    """Main Application Window for T5 Character Creator."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Traveller 5 — Character Creator")
        self.resize(1280, 800)
        
        self.engine = CharacterEngine(dialog_handler=DialogHandler(parent_widget=self, headless=False))
        self.init_ui()
        self.init_engine_bindings()
        
        # Start fresh
        self.engine.start_new_character()

    def init_ui(self):
        # Central Widget & Splitter
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Vertical Splitter: Top (3-Pane Workspace) and Bottom (Chronicle Drawer)
        v_splitter = QSplitter(Qt.Vertical)

        # Horizontal Splitter for 3 Panes: Left Stats (280px), Center Wizard (400px), Right Sheet (600px)
        h_splitter = QSplitter(Qt.Horizontal)

        # Left Stats Panel
        self.stats_panel = CharacterStatsPanel()
        h_splitter.addWidget(self.stats_panel)

        # Center Wizard View
        self.wizard_view = WizardView(self.engine)
        self.wizard_view.character_changed.connect(self._sync_all_views)
        h_splitter.addWidget(self.wizard_view)

        # Right Live Sheet View
        self.sheet_view = SheetView()
        h_splitter.addWidget(self.sheet_view)

        h_splitter.setStretchFactor(0, 2)
        h_splitter.setStretchFactor(1, 3)
        h_splitter.setStretchFactor(2, 4)

        v_splitter.addWidget(h_splitter)

        # Bottom Chronicle Log
        self.log_widget = CareerLogWidget()
        v_splitter.addWidget(self.log_widget)
        v_splitter.setStretchFactor(0, 5)
        v_splitter.setStretchFactor(1, 1)

        main_layout.addWidget(v_splitter)

        # Menus & Toolbar
        self._init_menu_and_toolbar()
        
        # Status Bar
        self.status_bar = QStatusBar()
        self.setStatusBar(self.status_bar)
        self.status_bar.showMessage("Ready. T5 Character Creation initialized.")

    def _init_menu_and_toolbar(self):
        menubar = self.menuBar()

        # File Menu
        file_menu = menubar.addMenu("&File")

        new_act = QAction("&New Character", self)
        new_act.setShortcut("Ctrl+N")
        new_act.triggered.connect(self._on_new_character)
        file_menu.addAction(new_act)

        open_act = QAction("&Open JSON...", self)
        open_act.setShortcut("Ctrl+O")
        open_act.triggered.connect(self._on_open_json)
        file_menu.addAction(open_act)

        save_act = QAction("&Save JSON...", self)
        save_act.setShortcut("Ctrl+S")
        save_act.triggered.connect(self._on_save_json)
        file_menu.addAction(save_act)

        file_menu.addSeparator()

        export_md_act = QAction("Export Markdown...", self)
        export_md_act.triggered.connect(self._on_export_markdown)
        file_menu.addAction(export_md_act)

        file_menu.addSeparator()

        exit_act = QAction("E&xit", self)
        exit_act.setShortcut("Ctrl+Q")
        exit_act.triggered.connect(self.close)
        file_menu.addAction(exit_act)

        # Actions Menu
        act_menu = menubar.addMenu("&Actions")
        
        seed_act = QAction("Set PRNG &Seed...", self)
        seed_act.triggered.connect(self._on_set_seed)
        act_menu.addAction(seed_act)

        npc_act = QAction("Generate &Instant 4-Term NPC", self)
        npc_act.setShortcut("Ctrl+I")
        npc_act.triggered.connect(self._on_instant_npc)
        act_menu.addAction(npc_act)

        # Toolbar
        tb = QToolBar("Main Toolbar")
        tb.setMovable(False)
        self.addToolBar(tb)

        tb.addAction(new_act)
        tb.addAction(open_act)
        tb.addAction(save_act)
        tb.addSeparator()
        tb.addAction(npc_act)

    def init_engine_bindings(self):
        self.engine.on_character_updated = self._sync_all_views
        self.engine.on_log_message = self.log_widget.add_log

    def _sync_all_views(self, character=None):
        if character is None:
            character = self.engine.character
        self.stats_panel.update_character(character)
        self.sheet_view.update_character(character)
        self.wizard_view.refresh_state()
        self.log_widget.set_logs(character.history)
        self.status_bar.showMessage(f"Character: {character.name} | UPP: {character.upp} | Age: {character.age}")

    def _on_new_character(self):
        self.log_widget.clear_logs()
        self.engine.start_new_character()
        self._sync_all_views()

    def _on_instant_npc(self):
        self.log_widget.clear_logs()
        self.engine.generate_full_character_automatically(species_id="human", terms=4)
        self._sync_all_views()

    def _on_set_seed(self):
        seed_str, ok = QInputDialog.getText(self, "Set Seed", "Enter PRNG Seed String:")
        if ok and seed_str:
            self.engine = CharacterEngine(seed=seed_str, dialog_handler=DialogHandler(parent_widget=self, headless=False))
            self.init_engine_bindings()
            self.wizard_view.engine = self.engine
            self.engine.start_new_character()
            self._sync_all_views()

    def _on_save_json(self):
        path, _ = QFileDialog.getSaveFileName(self, "Save Character JSON", f"{self.engine.character.name.replace(' ', '_')}.json", "JSON Files (*.json)")
        if path:
            try:
                export_character_json(self.engine.character, Path(path))
                QMessageBox.information(self, "Export Successful", f"Character saved to {path}")
            except Exception as e:
                QMessageBox.critical(self, "Save Error", f"Failed to save character: {e}")

    def _on_open_json(self):
        path, _ = QFileDialog.getOpenFileName(self, "Open Character JSON", "", "JSON Files (*.json)")
        if path:
            try:
                char = import_character_json(Path(path))
                self.engine.character = char
                self.engine.state = GenerationState.FINALIZED
                self.log_widget.clear_logs()
                self.log_widget.set_logs(char.chronicle)
                self._sync_all_views(char)
                QMessageBox.information(self, "Load Successful", f"Loaded character {char.name}")
            except Exception as e:
                QMessageBox.critical(self, "Load Error", f"Failed to load character: {e}")

    def _on_export_markdown(self):
        path, _ = QFileDialog.getSaveFileName(self, "Export Markdown", f"{self.engine.character.name.replace(' ', '_')}.md", "Markdown Files (*.md)")
        if path:
            try:
                md = export_character_markdown(self.engine.character)
                with open(path, "w", encoding="utf-8") as f:
                    f.write(md)
                QMessageBox.information(self, "Export Successful", f"Markdown exported to {path}")
            except Exception as e:
                QMessageBox.critical(self, "Export Error", f"Failed to export markdown: {e}")
