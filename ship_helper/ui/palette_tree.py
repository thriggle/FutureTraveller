"""
T5 Starship Construction: Component Palette Tree Widget.
Presents categorized components ready to be installed into subhulls.
"""
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QFont, QColor, QBrush
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QTreeWidget, QTreeWidgetItem,
    QLineEdit, QPushButton, QLabel, QHeaderView
)
from ship_helper.engine.catalog import (
    ACCOMMODATION_CATALOG, FACILITY_CATALOG, LIFE_SUPPORT_CATALOG,
    WEAPON_CATALOG, DEFENSE_CATALOG, SENSOR_CATALOG
)

class PaletteTreeWidget(QWidget):
    """Component library tree allowing users to browse and add starship systems."""
    component_requested = Signal(str, str, dict)  # (category, item_key, extra_defaults)

    def __init__(self, parent=None):
        super().__init__(parent)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(4, 4, 4, 4)
        layout.setSpacing(6)

        # Title & Filter
        title_label = QLabel("<b>Component Library</b>")
        title_label.setStyleSheet("color: #79c0ff; font-size: 15px; font-weight: bold;")
        layout.addWidget(title_label)

        self.filter_edit = QLineEdit()
        self.filter_edit.setPlaceholderText("Filter components...")
        self.filter_edit.setStyleSheet("padding: 5px 8px; font-size: 13px;")
        self.filter_edit.textChanged.connect(self._filter_tree)
        layout.addWidget(self.filter_edit)

        # Tree Widget
        self.tree = QTreeWidget()
        self.tree.setHeaderHidden(True)
        self.tree.setAnimated(True)
        self.tree.itemDoubleClicked.connect(self._on_item_double_clicked)
        layout.addWidget(self.tree)

        # Action Buttons
        btn_bar = QHBoxLayout()
        self.add_btn = QPushButton("+ Install to Selected Subhull")
        self.add_btn.setStyleSheet("background: #238636; color: white; font-weight: bold; font-size: 13px; padding: 7px 12px;")
        self.add_btn.clicked.connect(self._on_add_clicked)
        btn_bar.addWidget(self.add_btn)
        layout.addLayout(btn_bar)

        self._populate_tree()

    def _create_category(self, name: str) -> QTreeWidgetItem:
        cat = QTreeWidgetItem(self.tree, [name])
        font = QFont()
        font.setBold(True)
        font.setPointSize(10)
        cat.setFont(0, font)
        cat.setForeground(0, QBrush(QColor("#79c0ff")))
        return cat

    def _populate_tree(self):
        self.tree.clear()

        # 1. Hulls & Pods
        hull_cat = self._create_category("Hull & Pod Structures")
        QTreeWidgetItem(hull_cat, ["+ New Subhull"]).setData(0, Qt.UserRole, ("hull", "subhull", {}))
        QTreeWidgetItem(hull_cat, ["+ New External Pod"]).setData(0, Qt.UserRole, ("hull", "pod", {}))

        # 2. Drives & Power
        drives_cat = self._create_category("Drives & Power Plants")
        drive_types = [
            ("Jump", "Jump Drive"),
            ("M-Drive", "Maneuver Drive (M-Drive)"),
            ("Power Plant", "Fusion Power Plant"),
            ("G-Drive", "Gravitic Drive (G-Drive)"),
            ("Fission", "Fission Reactor"),
            ("Anti-Matter", "Anti-Matter Power Plant"),
            ("Collector", "Collector Drive"),
            ("Hop", "Hop Drive (H-Drive)"),
            ("Skip", "Skip Drive"),
            ("Rocket", "Rocket Engine"),
            ("NAFAL", "NAFAL Sublight Drive"),
            ("HEPlaR", "HEPlaR Plasma Drive")
        ]
        for dtype, dname in drive_types:
            item = QTreeWidgetItem(drives_cat, [dname])
            item.setData(0, Qt.UserRole, ("drive", dtype, {"driveType": dtype}))

        # 3. Accommodations
        accom_cat = self._create_category("Accommodations & Berths")
        for key, defn in ACCOMMODATION_CATALOG.items():
            item = QTreeWidgetItem(accom_cat, [f"{defn['name']}"])
            item.setData(0, Qt.UserRole, ("accommodation", key, defn))

        # 4. Facilities & Cargo
        fac_cat = self._create_category("Facilities & Cargo")
        for key, defn in FACILITY_CATALOG.items():
            item = QTreeWidgetItem(fac_cat, [f"{defn['name']}"])
            item.setData(0, Qt.UserRole, ("facility", key, defn))

        # 5. Life Support
        ls_cat = self._create_category("Life Support Systems")
        for key, defn in LIFE_SUPPORT_CATALOG.items():
            item = QTreeWidgetItem(ls_cat, [f"{defn['name']}"])
            item.setData(0, Qt.UserRole, ("life_support", key, defn))

        # 6. Weaponry
        wpn_cat = self._create_category("Weaponry & Turrets")
        for key, defn in WEAPON_CATALOG.items():
            item = QTreeWidgetItem(wpn_cat, [f"{defn['name']} [TL-{defn['baseTL']}]"])
            item.setData(0, Qt.UserRole, ("weapon", key, defn))

        # 7. Defenses & Screens
        def_cat = self._create_category("Defenses & Screens")
        for key, defn in DEFENSE_CATALOG.items():
            item = QTreeWidgetItem(def_cat, [f"{defn['name']} [TL-{defn['baseTL']}]"])
            item.setData(0, Qt.UserRole, ("defense", key, defn))

        # 8. Sensors
        sens_cat = self._create_category("Sensors & Avionics")
        for key, defn in SENSOR_CATALOG.items():
            item = QTreeWidgetItem(sens_cat, [f"{defn['name']} [TL-{defn['baseTL']}]"])
            item.setData(0, Qt.UserRole, ("sensor", key, defn))

        # 9. Consoles & Computers
        comp_cat = self._create_category("Consoles & Computers")
        QTreeWidgetItem(comp_cat, ["Standard Console (1t, 1 CP)"]).setData(0, Qt.UserRole, ("console", "Standard Console", {"tons": 1.0, "cost": 0.1, "cp": 1}))
        QTreeWidgetItem(comp_cat, ["Command Bridge Console (2t, 2 CP)"]).setData(0, Qt.UserRole, ("console", "Bridge Console", {"tons": 2.0, "cost": 0.5, "cp": 2}))
        computers = [
            ("Model/1", 1, 1.0, 2.0, 7),
            ("Model/2", 2, 2.0, 4.0, 9),
            ("Model/3bis", 3, 3.0, 6.0, 11),
            ("Model/4", 4, 4.0, 8.0, 13),
            ("Model/5bis", 5, 5.0, 12.0, 15),
            ("Model/7", 7, 7.0, 20.0, 17)
        ]
        for cname, cells, tons, cost, tl in computers:
            c_item = QTreeWidgetItem(comp_cat, [f"Computer {cname} (Cells: {cells}, {tons}t)"])
            c_item.setData(0, Qt.UserRole, ("computer", cname, {"model": cname, "cells": cells, "tons": tons, "cost": cost, "tl": tl}))

        # 10. Hull Fittings
        fittings_cat = self._create_category("Hull Fittings")
        fittings = [
            ("Flotation Hull", 1.0, 1.0, 5, "Allows water landing and takeoff"),
            ("Submergence Hull", 2.0, 2.0, 6, "Submersible operation and water landing"),
            ("Fins", 2.0, 0.5, 5, "Increases Agility +1 in atmosphere"),
            ("Folding Fins", 0.0, 0.5, 8, "Retractable atmospheric fins"),
            ("Wings", 5.0, 1.0, 7, "Increases Speed by 1G in atmosphere"),
            ("Landing Skids", 0.0, 0.0, 7, "Retractable skid landing gear"),
            ("Landing Legs with Pads", 1.0, 1.0, 8, "Wilderness terrain landing legs"),
            ("Landing Wheels", 3.0, 1.5, 5, "Runway glide landing wheels")
        ]
        for fname, tons, cost, tl, cmt in fittings:
            f_item = QTreeWidgetItem(fittings_cat, [f"{fname} ({tons}t)"])
            f_item.setData(0, Qt.UserRole, ("fitting", fname, {"tons": tons, "cost": cost, "tl": tl, "comment": cmt}))

        self.tree.expandToDepth(0)

    def _filter_tree(self, text: str):
        query = text.strip().lower()
        for i in range(self.tree.topLevelItemCount()):
            top = self.tree.topLevelItem(i)
            match_in_group = False
            for j in range(top.childCount()):
                child = top.child(j)
                if not query or query in child.text(0).lower():
                    child.setHidden(False)
                    match_in_group = True
                else:
                    child.setHidden(True)
            top.setHidden(not match_in_group and bool(query))
            if query and match_in_group:
                top.setExpanded(True)

    def _on_item_double_clicked(self, item, column):
        data = item.data(0, Qt.UserRole)
        if data:
            category, item_key, extra = data
            self.component_requested.emit(category, item_key, extra)

    def _on_add_clicked(self):
        curr = self.tree.currentItem()
        if curr:
            self._on_item_double_clicked(curr, 0)
