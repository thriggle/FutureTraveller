"""
Homeworld and Trade Codes configuration dialog for T5.
Integrates local Traveller Map SQLite Database (143,000+ worlds) matching CharacterView.js.
"""
from typing import List, Tuple, Optional, Dict, Any
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
    QPushButton, QCheckBox, QGridLayout, QGroupBox, QTabWidget,
    QWidget, QComboBox, QListWidget, QListWidgetItem, QTextBrowser,
    QSplitter, QHeaderView, QTableWidget, QTableWidgetItem, QAbstractItemView
)
from PySide6.QtCore import Qt
from core.traveller_map_db import get_traveller_map_db, STANDARD_T5_TRADE_CODES, parse_trade_codes

TRADE_CODES_LIST = list(STANDARD_T5_TRADE_CODES.items())


class HomeworldDialog(QDialog):
    """Dialog for browsing Traveller Map worlds and configuring homeworld and trade codes."""
    def __init__(
        self,
        current_name: str = "Terra",
        current_uwp: str = "A867974-C",
        current_codes: Optional[List[str]] = None,
        current_sector: str = "Solomani Rim",
        current_hex: str = "1827",
        parent=None
    ):
        super().__init__(parent)
        self.setWindowTitle("Select Homeworld — Traveller Map Database")
        self.resize(800, 560)
        
        self.db = get_traveller_map_db()
        self.homeworld_name = current_name
        self.homeworld_uwp = current_uwp
        self.homeworld_sector = current_sector
        self.homeworld_hex = current_hex
        self.selected_trade_codes = list(current_codes or ["Ag", "Ri"])
        
        self.selected_world_data: Optional[Dict[str, Any]] = None
        self._cached_worlds: List[Dict[str, Any]] = []
        
        self.setStyleSheet("""
            QDialog {
                background-color: #0d1117;
                color: #c9d1d9;
            }
            QLabel {
                color: #f0f6fc;
                font-size: 13px;
            }
            QLineEdit, QComboBox {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #f0f6fc;
                padding: 6px;
                font-size: 13px;
            }
            QTableWidget, QListWidget {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #f0f6fc;
                font-size: 12px;
                gridline-color: #21262d;
            }
            QTableWidget::item:selected, QListWidget::item:selected {
                background-color: #1f6feb;
                color: #ffffff;
            }
            QHeaderView::section {
                background-color: #161b22;
                color: #8b949e;
                padding: 4px 6px;
                border: 1px solid #30363d;
                font-weight: bold;
                font-size: 11px;
            }
            QGroupBox {
                border: 1px solid #30363d;
                border-radius: 6px;
                margin-top: 10px;
                padding-top: 12px;
                color: #58a6ff;
                font-weight: bold;
            }
            QTabWidget::pane {
                border: 1px solid #30363d;
                background-color: #0d1117;
                border-radius: 4px;
            }
            QTabBar::tab {
                background: #161b22;
                color: #8b949e;
                padding: 8px 16px;
                font-weight: bold;
            }
            QTabBar::tab:selected {
                background: #0d1117;
                color: #58a6ff;
                border-bottom: 2px solid #58a6ff;
            }
            QCheckBox {
                color: #c9d1d9;
            }
            QPushButton {
                background-color: #21262d;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #c9d1d9;
                padding: 6px 14px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #30363d;
            }
            QPushButton#primaryBtn {
                background-color: #238636;
                color: #ffffff;
                border: none;
            }
            QPushButton#primaryBtn:hover {
                background-color: #2ea043;
            }
        """)

        self.init_ui()
        self._load_initial_data()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(12, 12, 12, 12)
        main_layout.setSpacing(10)

        self.tabs = QTabWidget()
        main_layout.addWidget(self.tabs)

        # Tab 1: Traveller Map Database Browser
        map_tab = QWidget()
        map_layout = QVBoxLayout(map_tab)
        map_layout.setContentsMargins(8, 8, 8, 8)
        map_layout.setSpacing(8)

        # Top Bar: Milieu, Sector, Search, Random
        top_bar = QHBoxLayout()
        top_bar.addWidget(QLabel("Milieu:"))
        self.milieu_combo = QComboBox()
        self.milieu_combo.currentIndexChanged.connect(self._on_milieu_changed)
        top_bar.addWidget(self.milieu_combo)

        top_bar.addWidget(QLabel("Sector:"))
        self.sector_combo = QComboBox()
        self.sector_combo.setMinimumWidth(180)
        self.sector_combo.currentIndexChanged.connect(self._on_sector_changed)
        top_bar.addWidget(self.sector_combo)

        top_bar.addWidget(QLabel("Search:"))
        self.search_edit = QLineEdit()
        self.search_edit.setPlaceholderText("Filter world name or hex...")
        self.search_edit.textChanged.connect(self._filter_worlds)
        top_bar.addWidget(self.search_edit)

        rnd_btn = QPushButton("🎲 Random World")
        rnd_btn.clicked.connect(self._pick_random_world)
        top_bar.addWidget(rnd_btn)

        map_layout.addLayout(top_bar)

        # Main Area: Splitter between World Table and Details Panel
        splitter = QSplitter(Qt.Horizontal)

        # World Table
        self.world_table = QTableWidget()
        self.world_table.setColumnCount(5)
        self.world_table.setHorizontalHeaderLabels(["Name", "Hex", "UWP", "Trade Codes", "Subsector"])
        self.world_table.horizontalHeader().setSectionResizeMode(0, QHeaderView.Stretch)
        self.world_table.horizontalHeader().setSectionResizeMode(1, QHeaderView.ResizeToContents)
        self.world_table.horizontalHeader().setSectionResizeMode(2, QHeaderView.ResizeToContents)
        self.world_table.horizontalHeader().setSectionResizeMode(3, QHeaderView.Stretch)
        self.world_table.horizontalHeader().setSectionResizeMode(4, QHeaderView.ResizeToContents)
        self.world_table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.world_table.setSelectionMode(QAbstractItemView.SingleSelection)
        self.world_table.itemSelectionChanged.connect(self._on_world_selected)
        self.world_table.itemDoubleClicked.connect(self._on_accept)
        splitter.addWidget(self.world_table)

        # Details Panel
        self.details_browser = QTextBrowser()
        self.details_browser.setOpenExternalLinks(False)
        self.details_browser.setStyleSheet("background-color: #161b22; border: 1px solid #30363d; border-radius: 4px; padding: 6px;")
        splitter.addWidget(self.details_browser)
        splitter.setStretchFactor(0, 3)
        splitter.setStretchFactor(1, 2)

        map_layout.addWidget(splitter)
        self.tabs.addTab(map_tab, "🪐 Traveller Map Browser")

        # Tab 2: Custom / Manual Homeworld
        custom_tab = QWidget()
        custom_layout = QVBoxLayout(custom_tab)
        custom_layout.setContentsMargins(10, 10, 10, 10)
        custom_layout.setSpacing(10)

        grid_top = QGridLayout()
        grid_top.addWidget(QLabel("Homeworld Name:"), 0, 0)
        self.manual_name_edit = QLineEdit(self.homeworld_name)
        grid_top.addWidget(self.manual_name_edit, 0, 1)

        grid_top.addWidget(QLabel("Universal World Profile (UWP):"), 1, 0)
        self.manual_uwp_edit = QLineEdit(self.homeworld_uwp)
        grid_top.addWidget(self.manual_uwp_edit, 1, 1)

        grid_top.addWidget(QLabel("Sector:"), 2, 0)
        self.manual_sector_edit = QLineEdit(self.homeworld_sector)
        grid_top.addWidget(self.manual_sector_edit, 2, 1)

        grid_top.addWidget(QLabel("Hex:"), 3, 0)
        self.manual_hex_edit = QLineEdit(self.homeworld_hex)
        grid_top.addWidget(self.manual_hex_edit, 3, 1)

        custom_layout.addLayout(grid_top)

        # Trade codes checkboxes
        tc_box = QGroupBox("Custom Trade Codes")
        tc_layout = QGridLayout(tc_box)
        self.checkboxes = {}
        for i, (code, label) in enumerate(TRADE_CODES_LIST):
            cb = QCheckBox(f"{code} ({label})")
            if code in self.selected_trade_codes:
                cb.setChecked(True)
            self.checkboxes[code] = cb
            tc_layout.addWidget(cb, i // 3, i % 3)
        custom_layout.addWidget(tc_box)
        custom_layout.addStretch()

        self.tabs.addTab(custom_tab, "✏️ Custom World")

        # Bottom Button Bar
        btn_bar = QHBoxLayout()
        self.status_label = QLabel(f"Selected: <strong>{self.homeworld_name}</strong> [{self.homeworld_uwp}] ({', '.join(self.selected_trade_codes)})")
        btn_bar.addWidget(self.status_label)
        btn_bar.addStretch()

        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_bar.addWidget(cancel_btn)

        ok_btn = QPushButton("Confirm Homeworld")
        ok_btn.setObjectName("primaryBtn")
        ok_btn.clicked.connect(self._on_accept)
        btn_bar.addWidget(ok_btn)

        main_layout.addLayout(btn_bar)

    def _load_initial_data(self):
        milieux = self.db.get_milieux()
        self.milieu_combo.blockSignals(True)
        self.milieu_combo.clear()
        self.milieu_combo.addItems(milieux)
        if "M1105" in milieux:
            self.milieu_combo.setCurrentText("M1105")
        self.milieu_combo.blockSignals(False)

        self._load_sectors()

    def _load_sectors(self):
        milieu = self.milieu_combo.currentText() or "M1105"
        sectors = self.db.get_sectors(milieu)
        self.sector_combo.blockSignals(True)
        self.sector_combo.clear()
        for s in sectors:
            self.sector_combo.addItem(s["name"], s)
        
        # Try finding current sector
        found_idx = -1
        if self.homeworld_sector:
            found_idx = self.sector_combo.findText(self.homeworld_sector)
        if found_idx < 0:
            found_idx = self.sector_combo.findText("Spinward Marches")
        if found_idx < 0:
            found_idx = self.sector_combo.findText("Solomani Rim")
        if found_idx >= 0:
            self.sector_combo.setCurrentIndex(found_idx)
        self.sector_combo.blockSignals(False)

        self._load_worlds()

    def _load_worlds(self):
        sector_name = self.sector_combo.currentText()
        milieu = self.milieu_combo.currentText() or "M1105"
        if not sector_name:
            return
        self._cached_worlds = self.db.get_worlds_in_sector(sector_name, milieu)
        self._populate_world_table(self._cached_worlds)

    def _populate_world_table(self, worlds: List[Dict[str, Any]]):
        self.world_table.blockSignals(True)
        self.world_table.setRowCount(len(worlds))
        target_row = 0
        for row, w in enumerate(worlds):
            name_item = QTableWidgetItem(w.get("name", ""))
            name_item.setData(Qt.UserRole, w)
            hex_item = QTableWidgetItem(w.get("hex", ""))
            uwp_item = QTableWidgetItem(w.get("uwp", ""))
            tc_item = QTableWidgetItem(", ".join(w.get("trade_codes", [])))
            sub_item = QTableWidgetItem(w.get("subsector_name", ""))

            if self.homeworld_name and w.get("name") == self.homeworld_name:
                target_row = row

            self.world_table.setItem(row, 0, name_item)
            self.world_table.setItem(row, 1, hex_item)
            self.world_table.setItem(row, 2, uwp_item)
            self.world_table.setItem(row, 3, tc_item)
            self.world_table.setItem(row, 4, sub_item)

        self.world_table.blockSignals(False)
        if len(worlds) > 0:
            self.world_table.selectRow(target_row)
            self._on_world_selected()

    def _filter_worlds(self, text: str):
        query = text.strip().lower()
        if not query:
            self._populate_world_table(self._cached_worlds)
            return
        
        # If searching across sector
        filtered = [w for w in self._cached_worlds if query in w.get("name", "").lower() or query in w.get("hex", "").lower()]
        if not filtered and len(query) >= 3:
            # Global search fallback across entire milieu
            milieu = self.milieu_combo.currentText() or "M1105"
            filtered = self.db.search_worlds(query, milieu, limit=50)
        self._populate_world_table(filtered)

    def _on_milieu_changed(self):
        self._load_sectors()

    def _on_sector_changed(self):
        self._load_worlds()

    def _on_world_selected(self):
        sel = self.world_table.selectedItems()
        if not sel:
            return
        first_item = self.world_table.item(sel[0].row(), 0)
        if not first_item:
            return
        world = first_item.data(Qt.UserRole)
        if not world:
            return
        self.selected_world_data = world
        self.homeworld_name = world.get("name", "")
        self.homeworld_uwp = world.get("uwp", "")
        self.homeworld_sector = world.get("sector_name", self.sector_combo.currentText())
        self.homeworld_hex = world.get("hex", "")
        self.selected_trade_codes = list(world.get("trade_codes", []))

        # Update status label
        self.status_label.setText(
            f"Selected: <strong>{self.homeworld_name}</strong> [{self.homeworld_uwp}] ({', '.join(self.selected_trade_codes)}) &bull; {self.homeworld_sector} {self.homeworld_hex}"
        )

        # Update details card
        tc_badges = "".join(f"<span style='background: #21262d; border: 1px solid #30363d; border-radius: 4px; padding: 2px 6px; margin-right: 4px; color: #58a6ff;'>{tc}</span>" for tc in self.selected_trade_codes)
        
        html = f"""
        <div style='font-family: sans-serif; color: #c9d1d9;'>
            <h3 style='color: #58a6ff; margin: 0 0 4px 0;'>{self.homeworld_name} ({self.homeworld_hex})</h3>
            <div style='color: #8b949e; font-size: 11px; margin-bottom: 8px;'>
                {self.homeworld_sector} Sector &bull; Subsector {world.get('subsector_name', 'N/A')}
            </div>
            <div style='background: #21262d; padding: 6px 10px; border-radius: 4px; font-family: monospace; font-size: 14px; font-weight: bold; color: #3fb950; margin-bottom: 8px;'>
                UWP: {self.homeworld_uwp}
            </div>
            <div style='margin-bottom: 6px;'>
                <strong>Trade Codes:</strong> {tc_badges if tc_badges else '<em>None</em>'}
            </div>
            <div style='font-size: 11px; color: #8b949e;'>
                <strong>Remarks:</strong> {world.get('remarks', 'None')}<br/>
                <strong>Allegiance:</strong> {world.get('allegiance', 'Im')}<br/>
                <strong>Stars:</strong> {world.get('stars', 'Unknown')}<br/>
                <strong>Tech Level:</strong> {world.get('tech_level', 0)} &bull; <strong>Pop:</strong> 10^{world.get('population', 0)}
            </div>
        </div>
        """
        self.details_browser.setHtml(html)

    def _pick_random_world(self):
        milieu = self.milieu_combo.currentText() or "M1105"
        sector = self.sector_combo.currentText()
        rand_world = self.db.get_random_world(milieu, sector)
        if rand_world:
            # Find and select in table
            for row in range(self.world_table.rowCount()):
                item = self.world_table.item(row, 0)
                if item and item.text() == rand_world.get("name") and self.world_table.item(row, 1).text() == rand_world.get("hex"):
                    self.world_table.selectRow(row)
                    self._on_world_selected()
                    return
            self._populate_world_table([rand_world])

    def _on_accept(self):
        if self.tabs.currentIndex() == 1:
            # Custom world tab
            self.homeworld_name = self.manual_name_edit.text().strip() or "Custom World"
            self.homeworld_uwp = self.manual_uwp_edit.text().strip() or "C788755-9"
            self.homeworld_sector = self.manual_sector_edit.text().strip() or "Unknown"
            self.homeworld_hex = self.manual_hex_edit.text().strip() or "0101"
            self.selected_trade_codes = [code for code, cb in self.checkboxes.items() if cb.isChecked()]
        self.accept()

    def get_homeworld_data(self) -> Dict[str, Any]:
        return {
            "name": self.homeworld_name,
            "uwp": self.homeworld_uwp,
            "sector": self.homeworld_sector,
            "hex": self.homeworld_hex,
            "trade_codes": list(self.selected_trade_codes)
        }
