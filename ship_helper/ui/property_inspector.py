"""
T5 Starship Construction: Property Inspector Widget.
Context-sensitive form editor for modifying selected subhulls, drives, and components.
"""
from typing import Optional
from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QComboBox,
    QDoubleSpinBox, QSpinBox, QCheckBox, QPushButton, QGroupBox, QFormLayout, QScrollArea, QFrame
)
from core.data_models import StarshipDrivesData, StarshipHullsData
from ship_helper.models.ship import SubhullItem, DriveItem, ComponentItem
from ship_helper.engine.ship_engine import build_drive, get_available_tech_stages, ShipCalculator

_drives_data = StarshipDrivesData.load()
_hulls_data = StarshipHullsData.load()

class PropertyInspectorWidget(QWidget):
    """Dynamic inspector panel for editing selected starship elements."""
    property_changed = Signal()
    item_deleted = Signal(str, int, int)  # (item_type, s_idx, i_idx)

    def __init__(self, parent=None):
        super().__init__(parent)
        self.current_type: Optional[str] = None
        self.current_s_idx: int = -1
        self.current_i_idx: int = -1
        self.current_obj: Optional[object] = None
        self._is_updating = False
        self.init_ui()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(4, 4, 4, 4)
        main_layout.setSpacing(6)

        # Header Title
        self.header_label = QLabel("<b>Property Inspector</b>")
        self.header_label.setStyleSheet("color: #79c0ff; font-size: 15px; font-weight: bold;")
        main_layout.addWidget(self.header_label)

        # Scroll Area for Form
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("background: transparent; border: none;")
        self.container = QWidget()
        self.form_layout = QVBoxLayout(self.container)
        self.form_layout.setContentsMargins(0, 0, 0, 0)
        self.form_layout.setSpacing(10)
        scroll.setWidget(self.container)
        main_layout.addWidget(scroll)

        # Empty placeholder
        self.empty_label = QLabel("Select an item in the tree to edit properties.")
        self.empty_label.setStyleSheet("color: #8b949e; font-style: italic; padding: 20px; font-size: 13px;")
        self.form_layout.addWidget(self.empty_label)

    def inspect(self, item_type: str, s_idx: int, i_idx: int, obj: object):
        self.current_type = item_type
        self.current_s_idx = s_idx
        self.current_i_idx = i_idx
        self.current_obj = obj

        # Clear existing fields
        while self.form_layout.count():
            item = self.form_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        if item_type == "subhull" and isinstance(obj, SubhullItem):
            self._build_subhull_inspector(obj)
        elif item_type == "drive" and isinstance(obj, DriveItem):
            self._build_drive_inspector(obj)
        elif item_type == "component" and isinstance(obj, ComponentItem):
            self._build_component_inspector(obj)
        else:
            self.empty_label = QLabel("No selection.")
            self.empty_label.setStyleSheet("color: #8b949e; font-style: italic; padding: 20px; font-size: 13px;")
            self.form_layout.addWidget(self.empty_label)

    def _build_subhull_inspector(self, sub: SubhullItem):
        self._is_updating = True

        # Header Banner
        banner = QLabel(f"<b>Subhull: {sub.name}</b>")
        banner.setStyleSheet("background: #161b22; color: #79c0ff; padding: 8px; border-radius: 4px; font-size: 14px; font-weight: bold; border: 1px solid #30363d;")
        self.form_layout.addWidget(banner)

        # Basic Info Group
        info_group = QGroupBox("Hull Structure & Geometry")
        info_layout = QFormLayout(info_group)

        name_edit = QLineEdit(sub.name)
        name_edit.textChanged.connect(lambda t: self._update_attr(sub, "name", t))
        info_layout.addRow("Name:", name_edit)

        tons_spin = QDoubleSpinBox()
        tons_spin.setRange(10, 100000)
        tons_spin.setValue(sub.tons)
        tons_spin.setSuffix(" tons")
        tons_spin.valueChanged.connect(lambda v: self._update_attr(sub, "tons", v))
        info_layout.addRow("Displacement:", tons_spin)

        tl_spin = QSpinBox()
        tl_spin.setRange(1, 33)
        tl_spin.setValue(sub.tl)
        tl_spin.setPrefix("TL-")
        tl_spin.valueChanged.connect(lambda v: self._update_attr(sub, "tl", v))
        info_layout.addRow("Tech Level:", tl_spin)

        config_combo = QComboBox()
        configs = list(_hulls_data.hull_configs.keys())
        for c in configs:
            config_combo.addItem(c, c)
        config_combo.setCurrentText(sub.config)
        config_combo.currentTextChanged.connect(lambda c: self._update_attr(sub, "config", c))
        info_layout.addRow("Configuration:", config_combo)

        self.form_layout.addWidget(info_group)

        # Armor Group
        armor_group = QGroupBox("Armor Protection")
        armor_layout = QFormLayout(armor_group)

        armor_combo = QComboBox()
        armors = list(_hulls_data.hull_armor.keys())
        for a in armors:
            armor_combo.addItem(a, a)
        armor_combo.setCurrentText(sub.armorType)
        armor_combo.currentTextChanged.connect(lambda a: self._update_attr(sub, "armorType", a))
        armor_layout.addRow("Material:", armor_combo)

        layers_spin = QSpinBox()
        layers_spin.setRange(0, 20)
        layers_spin.setValue(sub.armorLayers)
        layers_spin.setSuffix(" layers")
        layers_spin.valueChanged.connect(lambda v: self._update_attr(sub, "armorLayers", v))
        armor_layout.addRow("Layers:", layers_spin)

        pod_check = QCheckBox("Is External Pod Structure")
        pod_check.setChecked(sub.isPod)
        pod_check.toggled.connect(lambda b: self._update_attr(sub, "isPod", b))
        armor_layout.addRow(pod_check)

        tariff_check = QCheckBox("Apply Import Tariff (+10% cost)")
        tariff_check.setChecked(sub.importFee)
        tariff_check.toggled.connect(lambda b: self._update_attr(sub, "importFee", b))
        armor_layout.addRow(tariff_check)

        self.form_layout.addWidget(armor_group)
        self.form_layout.addStretch()
        self._is_updating = False

    def _build_drive_inspector(self, drive: DriveItem):
        self._is_updating = True

        # Header Banner
        banner = QLabel(f"<b>Drive: {drive.driveType} Type {drive.driveClass}</b>")
        banner.setStyleSheet("background: #161b22; color: #79c0ff; padding: 8px; border-radius: 4px; font-size: 14px; font-weight: bold; border: 1px solid #30363d;")
        self.form_layout.addWidget(banner)

        drive_group = QGroupBox("Drive Specifications")
        layout = QFormLayout(drive_group)

        # Drive Type
        type_combo = QComboBox()
        drive_types = ["Jump", "M-Drive", "Power Plant", "G-Drive", "Fission", "Anti-Matter", "Collector", "Hop", "Skip", "Rocket", "NAFAL", "HEPlaR"]
        for dt in drive_types:
            type_combo.addItem(dt, dt)
        type_combo.setCurrentText(drive.driveType)
        type_combo.currentTextChanged.connect(lambda dt: self._recalculate_drive(drive, "driveType", dt))
        layout.addRow("Drive Type:", type_combo)

        # Drive Class
        class_combo = QComboBox()
        for cl in list(_drives_data.drive_classes.keys()):
            class_combo.addItem(f"Class {cl}", cl)
        base_cl = drive.driveClass[0] if drive.driveClass else "A"
        class_combo.setCurrentIndex(class_combo.findData(base_cl))
        class_combo.currentIndexChanged.connect(lambda: self._recalculate_drive(drive, "driveClass", class_combo.currentData()))
        layout.addRow("Drive Class (A-Z):", class_combo)

        # Tech Stage
        stage_combo = QComboBox()
        for stg in list(_drives_data.drive_stages.keys()):
            stage_combo.addItem(stg, stg)
        stage_combo.setCurrentText(drive.stage)
        stage_combo.currentTextChanged.connect(lambda stg: self._recalculate_drive(drive, "stage", stg))
        layout.addRow("Tech Stage:", stage_combo)

        # Nexus
        nexus_spin = QSpinBox()
        nexus_spin.setRange(1, 20)
        nexus_spin.setValue(drive.nexus)
        nexus_spin.setSuffix("x")
        nexus_spin.valueChanged.connect(lambda n: self._recalculate_drive(drive, "nexus", n))
        layout.addRow("Nexus Multiplier:", nexus_spin)

        # TL
        tl_spin = QSpinBox()
        tl_spin.setRange(1, 33)
        tl_spin.setValue(drive.tl)
        tl_spin.setPrefix("TL-")
        tl_spin.valueChanged.connect(lambda tl: self._recalculate_drive(drive, "tl", tl))
        layout.addRow("Tech Level:", tl_spin)

        # Tariff
        tariff_check = QCheckBox("Apply Import Tariff (+10% cost)")
        tariff_check.setChecked(drive.importFee)
        tariff_check.toggled.connect(lambda b: self._recalculate_drive(drive, "importFee", b))
        layout.addRow(tariff_check)

        self.form_layout.addWidget(drive_group)

        # Live Metrics Callout Box
        metric_box = QLabel(
            f"<b>Output / Rating:</b> <span style='color: #58a6ff; font-weight: bold;'>{drive.ep} EP</span><br>"
            f"<b>Displacement:</b> <span style='color: #3fb950; font-weight: bold;'>{drive.tons:.1f} Tons</span><br>"
            f"<b>Valuation:</b> <span style='color: #f0883e; font-weight: bold;'>MCr {drive.cost:.3f}</span>"
        )
        metric_box.setStyleSheet("background: #161b22; padding: 10px; border-radius: 5px; border: 1px solid #30363d; font-size: 13px;")
        self.form_layout.addWidget(metric_box)

        # Delete Button
        del_btn = QPushButton("Remove This Drive")
        del_btn.setStyleSheet("background: #da3633; color: white; font-weight: bold; font-size: 13px; padding: 6px 12px;")
        del_btn.clicked.connect(lambda: self.item_deleted.emit("drive", self.current_s_idx, self.current_i_idx))
        self.form_layout.addWidget(del_btn)

        self.form_layout.addStretch()
        self._is_updating = False

    def _build_component_inspector(self, comp: ComponentItem):
        self._is_updating = True

        # Header Banner
        banner = QLabel(f"<b>Component: {comp.name}</b>")
        banner.setStyleSheet("background: #161b22; color: #79c0ff; padding: 8px; border-radius: 4px; font-size: 14px; font-weight: bold; border: 1px solid #30363d;")
        self.form_layout.addWidget(banner)

        comp_group = QGroupBox("Component Attributes")
        layout = QFormLayout(comp_group)

        name_edit = QLineEdit(comp.name)
        name_edit.textChanged.connect(lambda t: self._update_attr(comp, "name", t))
        layout.addRow("Description / Name:", name_edit)

        tons_spin = QDoubleSpinBox()
        tons_spin.setRange(0, 100000)
        tons_spin.setValue(comp.tons)
        tons_spin.setSuffix(" tons")
        tons_spin.valueChanged.connect(lambda v: self._update_attr(comp, "tons", v))
        layout.addRow("Displacement:", tons_spin)

        cost_spin = QDoubleSpinBox()
        cost_spin.setRange(0, 100000)
        cost_spin.setDecimals(3)
        cost_spin.setValue(comp.cost)
        cost_spin.setPrefix("MCr ")
        cost_spin.valueChanged.connect(lambda v: self._update_attr(comp, "cost", v))
        layout.addRow("Cost (MCr):", cost_spin)

        tl_spin = QSpinBox()
        tl_spin.setRange(1, 33)
        tl_spin.setValue(comp.tl)
        tl_spin.setPrefix("TL-")
        tl_spin.valueChanged.connect(lambda v: self._update_attr(comp, "tl", v))
        layout.addRow("Tech Level:", tl_spin)

        if comp.isAccommodation:
            role_combo = QComboBox()
            for r in ["Crew", "HighPax", "MidPax", "Passenger", "LowPax"]:
                role_combo.addItem(r, r)
            role_combo.setCurrentText(comp.extra.get("assignment", "Crew"))
            role_combo.currentTextChanged.connect(lambda r: self._update_extra(comp, "assignment", r))
            layout.addRow("Berth Assignment:", role_combo)

        self.form_layout.addWidget(comp_group)

        # Delete Button
        del_btn = QPushButton("Remove This Component")
        del_btn.setStyleSheet("background: #da3633; color: white; font-weight: bold; font-size: 13px; padding: 6px 12px;")
        del_btn.clicked.connect(lambda: self.item_deleted.emit("component", self.current_s_idx, self.current_i_idx))
        self.form_layout.addWidget(del_btn)

        self.form_layout.addStretch()
        self._is_updating = False

    def _update_attr(self, obj, attr_name, value):
        if self._is_updating:
            return
        setattr(obj, attr_name, value)
        self.property_changed.emit()

    def _update_extra(self, comp: ComponentItem, key: str, value):
        if self._is_updating:
            return
        comp.extra[key] = value
        self.property_changed.emit()

    def _recalculate_drive(self, drive: DriveItem, modified_field: str, value):
        if self._is_updating:
            return
        setattr(drive, modified_field, value)
        new_d = build_drive(
            stage=drive.stage,
            nexus=drive.nexus,
            drive_class=drive.driveClass[0] if drive.driveClass else "A",
            drive_type=drive.driveType,
            tl=drive.tl,
            import_fee=drive.importFee
        )
        drive.ep = new_d.ep
        drive.tons = new_d.tons
        drive.cost = new_d.cost
        drive.maxDrivePotential = new_d.maxDrivePotential
        self.inspect("drive", self.current_s_idx, self.current_i_idx, drive)
        self.property_changed.emit()
