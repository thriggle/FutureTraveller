"""
T5 Starship Construction: Main Application Window.
Faithful reproduction of the 3-pane Traveller T5 Ship Helper workspace:
Left: Available Components | Center: Current Components (Cards) | Right: Ship Stats & Diagnostics
"""
import os
import json
from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QSplitter,
    QLabel, QLineEdit, QSpinBox, QPushButton, QFileDialog, QMessageBox,
    QApplication
)
from core.theme import apply_theme
from core.data_models import StarshipDrivesData, StarshipHullsData
from ship_helper.models.ship import ShipDesign, SubhullItem, DriveItem, ComponentItem
from ship_helper.engine.ship_engine import ShipCalculator, build_drive
from ship_helper.engine.catalog import (
    build_accommodation, build_facility, build_life_support,
    build_weapon, build_defense, build_sensor, build_console, build_computer, build_hull_fitting
)
from ship_helper.ui.summary_ribbon import SummaryRibbonWidget
from ship_helper.ui.palette_tree import PaletteTreeWidget
from ship_helper.ui.current_components_view import CurrentComponentsView
from ship_helper.ui.ship_stats_panel import ShipStatsPanel
from ship_helper.ui.dialogs.mission_code_dialog import MissionCodeDialog
from ship_helper.ui.dialogs.jump_field_dialog import JumpFieldDialog
from ship_helper.ui.dialogs.component_dialogs import (
    HullDialog, DriveDialog, WeaponDialog, GenericComponentDialog
)
from ship_helper.exporters.fillform_viewer import FillformViewer

class ShipHelperMainWindow(QMainWindow):
    """Primary application window for the T5 Starship Construction Helper."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Traveller T5 Ship Helper")
        self.resize(1340, 880)
        self.current_filepath: str = ""
        self.ship = self._create_default_ship()
        self.init_ui()

    def _create_default_ship(self) -> ShipDesign:
        main_json = os.path.join(os.path.dirname(__file__), "..", "..", "data", "main_hull_data.json")
        if os.path.exists(main_json):
            try:
                with open(main_json, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return ShipDesign.from_dict(data)
            except Exception as e:
                print(f"Warning loading default main_hull_data.json: {e}")
        
        # Fallback default 400t Merchant Trader
        ship = ShipDesign(
            baseTL=13,
            shipName="Far Trader",
            registration="FT-400-A",
            missionId=23,
            missionService="Commerce",
            missionActivity="Merchant",
            missionType="UnScheduled",
            missionQualifier="Cargo",
            missionName="Trader",
            missionCodeKey="A",
            modifier1Word="Far",
            modifier1Code="F",
            modifier2Word="",
            modifier2Code=""
        )
        hull = SubhullItem(
            name="Main Hull",
            tons=400.0,
            tl=13,
            config="Airframe",
            armorType="Polymer",
            armorLayers=2
        )
        hull.drives.append(build_drive("Standard", 1, "F", "Jump", 13))
        hull.drives.append(build_drive("Standard", 1, "F", "M-Drive", 13))
        hull.drives.append(build_drive("Standard", 1, "F", "Power Plant", 13))
        hull.components.append(build_accommodation("StandardStateroom", 6, 13, "Crew"))
        hull.components.append(build_accommodation("StandardStateroom", 4, 13, "Passenger"))
        hull.components.append(build_accommodation("LowBerth", 4, 13, "LowPax"))
        hull.components.append(build_console("Bridge Command Console", 2.0, 0.5, 13, cp=2))
        hull.components.append(build_computer("Model/3bis", 3, 3.0, 6.0, 13))
        hull.components.append(build_facility("StandardCargo", 150.0, 13))
        ship.subhulls.append(hull)
        return ship

    def init_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QVBoxLayout(central)
        main_layout.setContentsMargins(6, 6, 6, 6)
        main_layout.setSpacing(6)

        # 1. Top Control Bar
        top_bar = QHBoxLayout()
        top_bar.setSpacing(8)

        # Base TL
        top_bar.addWidget(QLabel("<b>Base Tech Level:</b>"))
        self.tl_spin = QSpinBox()
        self.tl_spin.setRange(0, 33)
        self.tl_spin.setValue(self.ship.baseTL)
        self.tl_spin.valueChanged.connect(self._on_tl_changed)
        top_bar.addWidget(self.tl_spin)

        top_bar.addSpacing(10)

        # Action Buttons
        code_btn = QPushButton("Mission Code")
        code_btn.setToolTip("Configure 6-Character Mission Code & Classification")
        code_btn.clicked.connect(self._open_mission_code_dialog)
        top_bar.addWidget(code_btn)

        jump_btn = QPushButton("Jump Fields")
        jump_btn.setToolTip("Configure Jump Fields & Safe Jump Distance (D, X)")
        jump_btn.clicked.connect(self._open_jump_field_dialog)
        top_bar.addWidget(jump_btn)

        fillform_btn = QPushButton("Fillform Sheets")
        fillform_btn.setStyleSheet("background: #9e6a03; color: white; font-weight: bold; padding: 4px 12px;")
        fillform_btn.setToolTip("View Official 3-Page T5 Fillform & Print/Export Sheets")
        fillform_btn.clicked.connect(self._open_fillform_viewer)
        top_bar.addWidget(fillform_btn)

        top_bar.addStretch()

        # File Operations
        new_btn = QPushButton("New Ship")
        new_btn.clicked.connect(self._on_new_ship)
        top_bar.addWidget(new_btn)

        import_btn = QPushButton("Import Ship")
        import_btn.clicked.connect(self._on_open_json)
        top_bar.addWidget(import_btn)

        export_btn = QPushButton("Export Ship")
        export_btn.setStyleSheet("background: #238636; color: white; font-weight: bold;")
        export_btn.clicked.connect(self._on_save_json)
        top_bar.addWidget(export_btn)

        main_layout.addLayout(top_bar)

        # 2. Summary Ribbon Widget
        self.ribbon = SummaryRibbonWidget()
        main_layout.addWidget(self.ribbon, 0)

        # 3. 3-Pane Central Workspace Splitter
        splitter = QSplitter(Qt.Horizontal)
        
        # Left Pane: Available Components (Palette)
        self.palette = PaletteTreeWidget()
        self.palette.component_requested.connect(self._on_component_requested_from_palette)
        splitter.addWidget(self.palette)

        # Center Pane: Current Components (Cards)
        self.current_view = CurrentComponentsView(self.ship)
        self.current_view.ship_modified.connect(self._on_ship_modified)
        splitter.addWidget(self.current_view)

        # Right Pane: Ship Stats & Diagnostics
        self.stats_panel = ShipStatsPanel(self.ship)
        self.stats_panel.mission_dialog_requested.connect(self._open_mission_code_dialog)
        self.stats_panel.jump_dialog_requested.connect(self._open_jump_field_dialog)
        splitter.addWidget(self.stats_panel)

        # Splitter ratios (24% Palette, 46% Center, 30% Stats)
        splitter.setSizes([290, 560, 360])
        main_layout.addWidget(splitter, 1)

        self._refresh_all()

    def _on_tl_changed(self, val: int):
        self.ship.baseTL = val
        self._on_ship_modified()

    def _on_component_requested_from_palette(self, category: str, item_key: str, data: dict):
        s_idx = self.current_view.get_selected_subhull_index()
        if s_idx < 0 or s_idx >= len(self.ship.subhulls):
            if not self.ship.subhulls:
                self.ship.subhulls.append(SubhullItem(name="Main Hull", tons=400.0, tl=self.ship.baseTL, config="Streamlined"))
            s_idx = 0

        sub = self.ship.subhulls[s_idx]
        tl = self.ship.baseTL

        if category == "hull":
            is_pod = (item_key == "pod")
            dlg = HullDialog(base_tl=tl, is_pod_default=is_pod, parent=self)
            if dlg.exec() and dlg.result_subhull:
                self.ship.subhulls.append(dlg.result_subhull)
                self._on_ship_modified()
            return
        elif category == "drive":
            dlg = DriveDialog(drive_type=item_key, base_tl=tl, parent=self)
            if dlg.exec() and dlg.result_drive:
                sub.drives.append(dlg.result_drive)
                self._on_ship_modified()
            return
        elif category == "weapon":
            dlg = WeaponDialog(weapon_key=item_key, base_tl=tl, parent=self)
            if dlg.exec() and dlg.result_comp:
                sub.components.append(dlg.result_comp)
                self._on_ship_modified()
            return
        else:
            dlg = GenericComponentDialog(category=category, item_key=item_key, base_tl=tl, parent=self)
            if dlg.exec() and dlg.result_comp:
                sub.components.append(dlg.result_comp)
                self._on_ship_modified()

    def _on_ship_modified(self):
        self._refresh_all()

    def _refresh_all(self):
        calc = ShipCalculator(self.ship)
        self.ribbon.update_metrics(calc)
        self.current_view.refresh()
        self.stats_panel.refresh()

    def _open_mission_code_dialog(self):
        dlg = MissionCodeDialog(self.ship, self)
        if dlg.exec():
            self._on_ship_modified()

    def _open_jump_field_dialog(self):
        dlg = JumpFieldDialog(self.ship, self)
        if dlg.exec():
            self._on_ship_modified()

    def _open_fillform_viewer(self):
        dlg = FillformViewer(self.ship, self)
        dlg.exec()

    def _on_new_ship(self):
        reply = QMessageBox.question(self, "New Starship", "Create a new default starship design?", QMessageBox.Yes | QMessageBox.No)
        if reply == QMessageBox.Yes:
            self.ship = self._create_default_ship()
            self.tl_spin.setValue(self.ship.baseTL)
            self.current_view.set_ship(self.ship)
            self.stats_panel.set_ship(self.ship)
            self._on_ship_modified()

    def _on_open_json(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Import T5 Starship JSON", "", "JSON Files (*.json *.jsonc)")
        if not file_path:
            return
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            self.ship = ShipDesign.from_dict(data)
            self.current_filepath = file_path
            self.tl_spin.setValue(self.ship.baseTL)
            self.current_view.set_ship(self.ship)
            self.stats_panel.set_ship(self.ship)
            self._on_ship_modified()
            QMessageBox.information(self, "Import Successful", f"Loaded starship from:\n{file_path}")
        except Exception as e:
            QMessageBox.critical(self, "Import Error", f"Failed to import JSON:\n{str(e)}")

    def _on_save_json(self):
        if not self.current_filepath:
            file_path, _ = QFileDialog.getSaveFileName(self, "Export T5 Starship JSON", f"{self.ship.shipName.replace(' ', '_')}.json", "JSON Files (*.json)")
            if not file_path:
                return
            self.current_filepath = file_path

        try:
            with open(self.current_filepath, "w", encoding="utf-8") as f:
                f.write(self.ship.to_json(indent=2))
            QMessageBox.information(self, "Export Successful", f"Saved starship to:\n{self.current_filepath}")
        except Exception as e:
            QMessageBox.critical(self, "Export Error", f"Failed to export JSON:\n{str(e)}")

def main():
    import sys
    app = QApplication(sys.argv)
    apply_theme(app)
    win = ShipHelperMainWindow()
    win.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
