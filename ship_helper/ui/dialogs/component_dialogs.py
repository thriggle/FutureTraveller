"""
T5 Starship Construction: Dedicated Component Configuration Modal Dialogs.
Matches the modal dialogs in Traveller/js/ShipHelperView.js.
"""
from typing import Optional, Dict, Any
from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QComboBox,
    QSpinBox, QDoubleSpinBox, QCheckBox, QPushButton, QGroupBox, QFormLayout
)
from core.data_models import StarshipDrivesData, StarshipHullsData
from ship_helper.models.ship import SubhullItem, DriveItem, ComponentItem
from ship_helper.engine.ship_engine import build_drive, get_available_tech_stages
from ship_helper.engine.catalog import (
    ACCOMMODATION_CATALOG, FACILITY_CATALOG, LIFE_SUPPORT_CATALOG,
    WEAPON_CATALOG, DEFENSE_CATALOG, SENSOR_CATALOG, MOUNTS_DEF
)

_drives_data = StarshipDrivesData.load()
_hulls_data = StarshipHullsData.load()

class HullDialog(QDialog):
    """Dialog for creating or editing a Subhull or External Pod."""
    def __init__(self, subhull: Optional[SubhullItem] = None, base_tl: int = 13, is_pod_default: bool = False, parent=None):
        super().__init__(parent)
        self.subhull = subhull
        self.base_tl = base_tl
        self.is_pod_default = is_pod_default
        self.result_subhull: Optional[SubhullItem] = None
        self.setWindowTitle("Edit Subhull" if subhull else ("Add External Pod" if is_pod_default else "Add Subhull"))
        self.setMinimumWidth(440)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(12)

        form_group = QGroupBox("Hull Geometry & Structure")
        form_layout = QFormLayout(form_group)

        self.name_edit = QLineEdit(self.subhull.name if self.subhull else ("External Pod" if self.is_pod_default else "Main Hull"))
        form_layout.addRow("Subhull Name:", self.name_edit)

        self.tons_spin = QDoubleSpinBox()
        self.tons_spin.setRange(10, 1000000)
        self.tons_spin.setValue(self.subhull.tons if self.subhull else (20.0 if self.is_pod_default else 400.0))
        self.tons_spin.setSuffix(" tons")
        form_layout.addRow("Displacement:", self.tons_spin)

        self.tl_spin = QSpinBox()
        self.tl_spin.setRange(1, 33)
        self.tl_spin.setValue(self.subhull.tl if self.subhull else self.base_tl)
        self.tl_spin.setPrefix("TL-")
        form_layout.addRow("Tech Level:", self.tl_spin)

        self.config_combo = QComboBox()
        for c in list(_hulls_data.hull_configs.keys()):
            self.config_combo.addItem(c, c)
        if self.subhull:
            self.config_combo.setCurrentText(self.subhull.config)
        else:
            self.config_combo.setCurrentText("Streamlined")
        form_layout.addRow("Configuration:", self.config_combo)

        self.armor_combo = QComboBox()
        for a in list(_hulls_data.hull_armor.keys()):
            self.armor_combo.addItem(a, a)
        if self.subhull:
            self.armor_combo.setCurrentText(self.subhull.armorType)
        else:
            self.armor_combo.setCurrentText("Polymer")
        form_layout.addRow("Armor Material:", self.armor_combo)

        self.layers_spin = QSpinBox()
        self.layers_spin.setRange(0, 20)
        self.layers_spin.setValue(self.subhull.armorLayers if self.subhull else 1)
        self.layers_spin.setSuffix(" layers")
        form_layout.addRow("Armor Layers:", self.layers_spin)

        self.pod_check = QCheckBox("Is External Pod")
        self.pod_check.setChecked(self.subhull.isPod if self.subhull else self.is_pod_default)
        form_layout.addRow(self.pod_check)

        self.tariff_check = QCheckBox("Import Tariff (+10% cost)")
        self.tariff_check.setChecked(self.subhull.importFee if self.subhull else False)
        form_layout.addRow(self.tariff_check)

        layout.addWidget(form_group)

        # Buttons
        btn_box = QHBoxLayout()
        btn_box.addStretch()
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_box.addWidget(cancel_btn)

        save_btn = QPushButton("Save Subhull" if self.subhull else "Add Subhull")
        save_btn.setStyleSheet("background: #238636; color: white; font-weight: bold; padding: 6px 14px;")
        save_btn.clicked.connect(self._apply)
        btn_box.addWidget(save_btn)
        layout.addLayout(btn_box)

    def _apply(self):
        name = self.name_edit.text().strip() or "Subhull"
        tons = self.tons_spin.value()
        tl = self.tl_spin.value()
        config = self.config_combo.currentData()
        armor = self.armor_combo.currentData()
        layers = self.layers_spin.value()
        is_pod = self.pod_check.isChecked()
        tariff = self.tariff_check.isChecked()

        if self.subhull:
            self.subhull.name = name
            self.subhull.tons = tons
            self.subhull.tl = tl
            self.subhull.config = config
            self.subhull.armorType = armor
            self.subhull.armorLayers = layers
            self.subhull.isPod = is_pod
            self.subhull.isHull = not is_pod
            self.subhull.importFee = tariff
            self.result_subhull = self.subhull
        else:
            self.result_subhull = SubhullItem(
                name=name,
                tons=tons,
                tl=tl,
                config=config,
                isHull=not is_pod,
                isPod=is_pod,
                armorType=armor,
                armorLayers=layers,
                importFee=tariff
            )
        self.accept()


class DriveDialog(QDialog):
    """Dialog for creating or editing a Starship Drive."""
    def __init__(self, drive_type: str = "Jump", drive: Optional[DriveItem] = None, base_tl: int = 13, parent=None):
        super().__init__(parent)
        self.drive = drive
        self.drive_type = drive.driveType if drive else drive_type
        self.base_tl = base_tl
        self.result_drive: Optional[DriveItem] = None
        self.setWindowTitle(f"Edit {self.drive_type}" if drive else f"Install {self.drive_type}")
        self.setMinimumWidth(460)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(12)

        form_group = QGroupBox(f"{self.drive_type} Specifications")
        form_layout = QFormLayout(form_group)

        # Drive Type
        self.type_combo = QComboBox()
        types = ["Jump", "M-Drive", "Power Plant", "G-Drive", "Fission", "Anti-Matter", "Collector", "Hop", "Skip", "Rocket", "NAFAL", "HEPlaR"]
        for dt in types:
            self.type_combo.addItem(dt, dt)
        self.type_combo.setCurrentText(self.drive_type)
        self.type_combo.currentTextChanged.connect(self._on_type_changed)
        form_layout.addRow("Drive Type:", self.type_combo)

        # Drive Class
        self.class_combo = QComboBox()
        for cl in list(_drives_data.drive_classes.keys()):
            self.class_combo.addItem(f"Class {cl} (100x{cl} EP)", cl)
        base_cl = self.drive.driveClass[0] if self.drive and self.drive.driveClass else "A"
        idx = self.class_combo.findData(base_cl)
        if idx >= 0:
            self.class_combo.setCurrentIndex(idx)
        self.class_combo.currentIndexChanged.connect(self._recalculate)
        form_layout.addRow("Drive Class (A-Z):", self.class_combo)

        # Tech Stage
        self.stage_combo = QComboBox()
        for stg in list(_drives_data.drive_stages.keys()):
            self.stage_combo.addItem(stg, stg)
        self.stage_combo.setCurrentText(self.drive.stage if self.drive else "Standard")
        self.stage_combo.currentTextChanged.connect(self._recalculate)
        form_layout.addRow("Tech Stage:", self.stage_combo)

        # Nexus Multiplier
        self.nexus_spin = QSpinBox()
        self.nexus_spin.setRange(1, 50)
        self.nexus_spin.setValue(self.drive.nexus if self.drive else 1)
        self.nexus_spin.setSuffix("x")
        self.nexus_spin.valueChanged.connect(self._recalculate)
        form_layout.addRow("Nexus Multiplier:", self.nexus_spin)

        # TL
        self.tl_spin = QSpinBox()
        self.tl_spin.setRange(1, 33)
        self.tl_spin.setValue(self.drive.tl if self.drive else self.base_tl)
        self.tl_spin.setPrefix("TL-")
        self.tl_spin.valueChanged.connect(self._recalculate)
        form_layout.addRow("Tech Level:", self.tl_spin)

        # Tariff
        self.tariff_check = QCheckBox("Apply Import Tariff (+10% cost)")
        self.tariff_check.setChecked(self.drive.importFee if self.drive else False)
        self.tariff_check.toggled.connect(self._recalculate)
        form_layout.addRow(self.tariff_check)

        layout.addWidget(form_group)

        # Live Metrics Callout Box
        self.preview_box = QLabel()
        self.preview_box.setStyleSheet("background: #161b22; border: 1px solid #30363d; border-radius: 5px; padding: 10px; font-size: 12px;")
        layout.addWidget(self.preview_box)
        self._recalculate()

        # Buttons
        btn_box = QHBoxLayout()
        btn_box.addStretch()
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_box.addWidget(cancel_btn)

        save_btn = QPushButton("Apply" if self.drive else "Install Drive")
        save_btn.setStyleSheet("background: #238636; color: white; font-weight: bold; padding: 6px 14px;")
        save_btn.clicked.connect(self._apply)
        btn_box.addWidget(save_btn)
        layout.addLayout(btn_box)

    def _on_type_changed(self, new_type: str):
        self.drive_type = new_type
        self._recalculate()

    def _recalculate(self):
        dt = self.type_combo.currentData() or "Jump"
        cl = self.class_combo.currentData() or "A"
        stg = self.stage_combo.currentText() or "Standard"
        nexus = self.nexus_spin.value()
        tl = self.tl_spin.value()
        tariff = self.tariff_check.isChecked()

        calc_d = build_drive(stg, nexus, cl, dt, tl, tariff)
        self.preview_box.setText(
            f"<b>Output / Rating:</b> <span style='color: #58a6ff; font-weight: bold;'>{calc_d.ep} EP</span><br>"
            f"<b>Displacement:</b> <span style='color: #3fb950; font-weight: bold;'>{calc_d.tons:.1f} Tons</span><br>"
            f"<b>Cost:</b> <span style='color: #f0883e; font-weight: bold;'>MCr {calc_d.cost:.3f}</span>"
        )

    def _apply(self):
        dt = self.type_combo.currentData() or "Jump"
        cl = self.class_combo.currentData() or "A"
        stg = self.stage_combo.currentText() or "Standard"
        nexus = self.nexus_spin.value()
        tl = self.tl_spin.value()
        tariff = self.tariff_check.isChecked()

        calc_d = build_drive(stg, nexus, cl, dt, tl, tariff)
        if self.drive:
            self.drive.driveType = dt
            self.drive.driveClass = calc_d.driveClass
            self.drive.stage = stg
            self.drive.nexus = nexus
            self.drive.tl = tl
            self.drive.importFee = tariff
            self.drive.ep = calc_d.ep
            self.drive.tons = calc_d.tons
            self.drive.cost = calc_d.cost
            self.drive.maxDrivePotential = calc_d.maxDrivePotential
            self.result_drive = self.drive
        else:
            self.result_drive = calc_d
        self.accept()


class WeaponDialog(QDialog):
    """Dialog for configuring Weaponry."""
    def __init__(self, weapon_key: str, comp: Optional[ComponentItem] = None, base_tl: int = 13, parent=None):
        super().__init__(parent)
        self.weapon_key = weapon_key
        self.comp = comp
        self.base_tl = base_tl
        self.result_comp: Optional[ComponentItem] = None
        w_def = WEAPON_CATALOG.get(weapon_key, {"name": "Weapon"})
        self.setWindowTitle(f"Configure {w_def['name']}")
        self.setMinimumWidth(440)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(12)

        w_def = WEAPON_CATALOG.get(self.weapon_key, WEAPON_CATALOG["BeamLaser"])
        form_group = QGroupBox(f"{w_def['name']} Parameters")
        form_layout = QFormLayout(form_group)

        self.mount_combo = QComboBox()
        for mk, mv in MOUNTS_DEF.items():
            self.mount_combo.addItem(f"{mv['name']} ({mv['tons']}t, MCr {mv['cost']})", mk)
        cur_mount = self.comp.extra.get("mountKey", w_def.get("defaultMount", "T1")) if self.comp else w_def.get("defaultMount", "T1")
        idx = self.mount_combo.findData(cur_mount)
        if idx >= 0: self.mount_combo.setCurrentIndex(idx)
        form_layout.addRow("Mount Type:", self.mount_combo)

        self.stage_combo = QComboBox()
        for stg in list(_drives_data.drive_stages.keys()):
            self.stage_combo.addItem(stg, stg)
        cur_stg = self.comp.extra.get("stage", "Standard") if self.comp else "Standard"
        self.stage_combo.setCurrentText(cur_stg)
        form_layout.addRow("Tech Stage:", self.stage_combo)

        self.count_spin = QSpinBox()
        self.count_spin.setRange(1, 100)
        self.count_spin.setValue(self.comp.extra.get("count", 1) if self.comp else 1)
        form_layout.addRow("Weapon Count / Tubes:", self.count_spin)

        self.tl_spin = QSpinBox()
        self.tl_spin.setRange(1, 33)
        self.tl_spin.setValue(self.comp.tl if self.comp else max(self.base_tl, w_def["baseTL"]))
        self.tl_spin.setPrefix("TL-")
        form_layout.addRow("Tech Level:", self.tl_spin)

        self.tariff_check = QCheckBox("Import Tariff (+10% cost)")
        self.tariff_check.setChecked(self.comp.extra.get("importFee", False) if self.comp else False)
        form_layout.addRow(self.tariff_check)

        layout.addWidget(form_group)

        # Buttons
        btn_box = QHBoxLayout()
        btn_box.addStretch()
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_box.addWidget(cancel_btn)

        save_btn = QPushButton("Apply" if self.comp else "Install Weapon")
        save_btn.setStyleSheet("background: #238636; color: white; font-weight: bold; padding: 6px 14px;")
        save_btn.clicked.connect(self._apply)
        btn_box.addWidget(save_btn)
        layout.addLayout(btn_box)

    def _apply(self):
        from ship_helper.engine.catalog import build_weapon
        mk = self.mount_combo.currentData() or "T1"
        stg = self.stage_combo.currentText() or "Standard"
        cnt = self.count_spin.value()
        tl = self.tl_spin.value()
        tariff = self.tariff_check.isChecked()

        new_c = build_weapon(self.weapon_key, mount_key=mk, stage=stg, count=cnt, tl=tl, import_fee=tariff)
        if self.comp:
            self.comp.name = new_c.name
            self.comp.tons = new_c.tons
            self.comp.cost = new_c.cost
            self.comp.tl = new_c.tl
            self.comp.extra = new_c.extra
            self.result_comp = self.comp
        else:
            self.result_comp = new_c
        self.accept()


class GenericComponentDialog(QDialog):
    """Universal dialog for configuring Accommodations, Facilities, Life Support, Consoles, Computers, and Fittings."""
    def __init__(self, category: str, item_key: str, comp: Optional[ComponentItem] = None, base_tl: int = 13, parent=None):
        super().__init__(parent)
        self.category = category
        self.item_key = item_key
        self.comp = comp
        self.base_tl = base_tl
        self.result_comp: Optional[ComponentItem] = None
        self.setWindowTitle(f"Configure {item_key}")
        self.setMinimumWidth(440)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(12)

        form_group = QGroupBox(f"{self.item_key} Parameters")
        form_layout = QFormLayout(form_group)

        # Quantity / Units
        self.count_spin = QSpinBox()
        self.count_spin.setRange(1, 1000)
        self.count_spin.setValue(self.comp.extra.get("count", 1) if self.comp else 1)
        form_layout.addRow("Quantity / Count:", self.count_spin)

        # Tonnage / Amount
        self.tons_spin = QDoubleSpinBox()
        self.tons_spin.setRange(0, 100000)
        self.tons_spin.setDecimals(1)
        self.tons_spin.setValue(self.comp.tons if self.comp else 10.0)
        self.tons_spin.setSuffix(" tons")
        form_layout.addRow("Total Volume / Tons:", self.tons_spin)

        # Role assignment for Accommodations
        if self.category == "accommodation":
            self.role_combo = QComboBox()
            for r in ["Crew", "HighPax", "MidPax", "Passenger", "LowPax"]:
                self.role_combo.addItem(r, r)
            if self.comp:
                self.role_combo.setCurrentText(self.comp.extra.get("assignment", "Crew"))
            form_layout.addRow("Assignment / Role:", self.role_combo)

        # Tech Level
        self.tl_spin = QSpinBox()
        self.tl_spin.setRange(1, 33)
        self.tl_spin.setValue(self.comp.tl if self.comp else self.base_tl)
        self.tl_spin.setPrefix("TL-")
        form_layout.addRow("Tech Level:", self.tl_spin)

        self.tariff_check = QCheckBox("Apply Import Tariff (+10% cost)")
        self.tariff_check.setChecked(self.comp.extra.get("importFee", False) if self.comp else False)
        form_layout.addRow(self.tariff_check)

        layout.addWidget(form_group)

        # Buttons
        btn_box = QHBoxLayout()
        btn_box.addStretch()
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_box.addWidget(cancel_btn)

        save_btn = QPushButton("Apply" if self.comp else "Install Component")
        save_btn.setStyleSheet("background: #238636; color: white; font-weight: bold; padding: 6px 14px;")
        save_btn.clicked.connect(self._apply)
        btn_box.addWidget(save_btn)
        layout.addLayout(btn_box)

    def _apply(self):
        from ship_helper.engine.catalog import (
            build_accommodation, build_facility, build_life_support,
            build_console, build_computer, build_hull_fitting
        )
        cnt = self.count_spin.value()
        tons = self.tons_spin.value()
        tl = self.tl_spin.value()
        tariff = self.tariff_check.isChecked()

        if self.category == "accommodation":
            role = self.role_combo.currentData() if hasattr(self, "role_combo") else "Crew"
            new_c = build_accommodation(self.item_key, count=cnt, tl=tl, assignment=role, custom_tons=tons, import_fee=tariff)
        elif self.category == "facility":
            new_c = build_facility(self.item_key, amount=tons, tl=tl, import_fee=tariff)
        elif self.category == "life_support":
            new_c = build_life_support(self.item_key, amount=tons if self.item_key == "ExtendedLifeSupport" else float(cnt), tl=tl, import_fee=tariff)
        elif self.category == "console":
            new_c = build_console(name=self.item_key, tons=tons, cost=0.1 * cnt, tl=tl, cp=cnt)
        elif self.category == "computer":
            new_c = build_computer(model=self.item_key, cells=cnt, tons=tons, cost=2.0 * cnt, tl=tl)
        else:
            new_c = build_hull_fitting(name=self.item_key, tons=tons, cost=1.0 * cnt, tl=tl)

        if self.comp:
            self.comp.name = new_c.name
            self.comp.tons = new_c.tons
            self.comp.cost = new_c.cost
            self.comp.tl = new_c.tl
            self.comp.extra = new_c.extra
            self.result_comp = self.comp
        else:
            self.result_comp = new_c
        self.accept()
