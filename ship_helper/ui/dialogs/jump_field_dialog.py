"""
T5 Starship Construction: Astrogation & Jump Fields Dialog (Table 07G).
Faithful 1:1 port of openJumpFieldsDialog from Traveller/js/ShipHelperView.js.
Simulates field strength, tech efficiency, engineering skill ranks,
gravitational flux, safe distance (D), and misjump interference risk (X).
"""
from typing import Optional
from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QGridLayout, QLabel, QComboBox,
    QSpinBox, QDoubleSpinBox, QPushButton, QGroupBox, QFrame
)
from ship_helper.models.ship import ShipDesign, ENUM_JUMP_FIELDS
from ship_helper.engine.ship_engine import ShipCalculator

class JumpFieldDialog(QDialog):
    """Modal dialog for configuring Jump Fields, Astrogation, and Misjump Risk."""
    def __init__(self, ship: ShipDesign, parent=None):
        super().__init__(parent)
        self.ship = ship
        self.calc = ShipCalculator(ship)
        self.setWindowTitle("Jump Fields & Physics (Table 07G)")
        self.setMinimumWidth(560)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(12)

        j_drive = self.calc.jump_drive
        eff = 1.0
        if j_drive:
            from core.data_models import StarshipDrivesData
            d_data = StarshipDrivesData.load()
            stg = d_data.drive_stages.get(j_drive.stage, {})
            eff = stg.get("eff", 1.0)

        # 1. Installed Drive Status Banner
        status_frame = QFrame()
        status_frame.setStyleSheet("""
            QFrame {
                background: rgba(0, 229, 255, 0.08);
                border: 1px solid #58a6ff;
                border-radius: 4px;
                padding: 6px 10px;
            }
        """)
        status_layout = QHBoxLayout(status_frame)
        status_layout.setContentsMargins(6, 4, 6, 4)
        
        if j_drive:
            status_text = (
                f"<b>Installed Drive:</b> {j_drive.driveType} "
                f"({j_drive.stage} Stage — Tech Efficiency: {int(eff * 100)}%)"
            )
            status_lbl = QLabel(status_text)
            status_lbl.setStyleSheet("color: #58a6ff; font-size: 12px;")
        else:
            status_lbl = QLabel("⚠️ <b>No Jump, Hop, or Skip Drive Installed:</b> Standard astrogation calculations disabled.")
            status_lbl.setStyleSheet("color: #f85149; font-size: 12px;")
        status_layout.addWidget(status_lbl)
        layout.addWidget(status_frame)

        # 2. Jump Field Configuration Group
        param_group = QGroupBox("Astrogation & Field Parameters")
        param_group.setStyleSheet("""
            QGroupBox {
                border: 1px solid #30363d;
                border-radius: 6px;
                margin-top: 10px;
                padding-top: 14px;
                font-weight: bold;
                font-size: 13px;
                color: #79c0ff;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 8px;
                padding: 2px 6px;
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
            }
        """)
        param_layout = QVBoxLayout(param_group)
        param_layout.setSpacing(8)

        # Jump Field Type Dropdown
        lbl_field = QLabel("Jump Field Type (Section 07 / Table 07G):")
        lbl_field.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.field_combo = QComboBox()
        for k, f_def in ENUM_JUMP_FIELDS.items():
            self.field_combo.addItem(
                f"{f_def['name']} — Strength: {f_def['strength']}, Armor Mod: {f_def['armorMod']}, Flash: {f_def['flash']}",
                k
            )
        
        cur_k = self.ship.jumpFieldKey or "Bubble"
        idx = self.field_combo.findData(cur_k)
        if idx >= 0:
            self.field_combo.setCurrentIndex(idx)
        
        self.field_desc_lbl = QLabel()
        self.field_desc_lbl.setStyleSheet("color: #c9d1d9; font-size: 12px; margin-top: 2px;")
        
        param_layout.addWidget(lbl_field)
        param_layout.addWidget(self.field_combo)
        param_layout.addWidget(self.field_desc_lbl)

        # Skills and Distances Grid
        grid = QGridLayout()
        grid.setHorizontalSpacing(10)
        grid.setVerticalSpacing(6)

        # Engineer Skill
        lbl_eng = QLabel("Engineer Skill Rank (0–15):")
        lbl_eng.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.eng_spin = QSpinBox()
        self.eng_spin.setRange(0, 15)
        self.eng_spin.setValue(self.ship.engineerSkill)

        # Jump Drives Specialty
        lbl_jd = QLabel("Jump Drives Specialty Rank (0–6):")
        lbl_jd.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.jd_spin = QSpinBox()
        self.jd_spin.setRange(0, 6)
        self.jd_spin.setValue(self.ship.jumpDriveSpecialty)

        grid.addWidget(lbl_eng, 0, 0)
        grid.addWidget(lbl_jd, 0, 1)
        grid.addWidget(self.eng_spin, 1, 0)
        grid.addWidget(self.jd_spin, 1, 1)

        # Initiation Distance (Diameters)
        lbl_dist = QLabel("Initiation Distance (Diameters):")
        lbl_dist.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.dist_spin = QDoubleSpinBox()
        self.dist_spin.setRange(0.0, 2000.0)
        self.dist_spin.setDecimals(1)
        self.dist_spin.setSingleStep(1.0)
        self.dist_spin.setSpecialValueText("Auto (Safe Distance D)")
        if self.ship.jumpDiameters is not None:
            self.dist_spin.setValue(float(self.ship.jumpDiameters))
        else:
            self.dist_spin.setValue(0.0)

        # Gravity Well Flux
        lbl_flux = QLabel("Gravity Well Flux (Mass Variance):")
        lbl_flux.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.flux_spin = QDoubleSpinBox()
        self.flux_spin.setRange(0.0, 10.0)
        self.flux_spin.setDecimals(1)
        self.flux_spin.setSingleStep(0.5)
        self.flux_spin.setValue(0.0)

        grid.addWidget(lbl_dist, 2, 0)
        grid.addWidget(lbl_flux, 2, 1)
        grid.addWidget(self.dist_spin, 3, 0)
        grid.addWidget(self.flux_spin, 3, 1)

        param_layout.addLayout(grid)
        layout.addWidget(param_group)

        # 3. Live Simulation Card
        self.sim_card = QFrame()
        self.sim_card.setStyleSheet("""
            QFrame {
                background: #161b22;
                border: 1px solid #30363d;
                border-radius: 6px;
                padding: 10px;
            }
        """)
        sim_layout = QVBoxLayout(self.sim_card)
        sim_layout.setContentsMargins(10, 8, 10, 8)
        sim_layout.setSpacing(4)

        title_lbl = QLabel("Jump Field & Interference Simulation:")
        title_lbl.setStyleSheet("font-weight: bold; color: #58a6ff; font-size: 14px; margin-bottom: 4px;")
        sim_layout.addWidget(title_lbl)

        self.row_s = self._create_sim_row(sim_layout, "Field Strength:")
        self.row_e = self._create_sim_row(sim_layout, "Drive Efficiency (E):")
        self.row_skill = self._create_sim_row(sim_layout, "Total Engineer Skill:")
        self.row_d = self._create_sim_row(sim_layout, "Safe Jump Distance (D):", val_color="#3fb950")
        self.row_act = self._create_sim_row(sim_layout, "Initiation Distance:")
        self.row_armor = self._create_sim_row(sim_layout, "Armor Modifier / Flash:")
        self.row_x = self._create_sim_row(sim_layout, "Interference & Misjump Risk (X):", val_color="#3fb950")

        layout.addWidget(self.sim_card)

        # 4. Buttons
        btn_box = QHBoxLayout()
        btn_box.addStretch()

        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_box.addWidget(cancel_btn)

        save_btn = QPushButton("Apply Settings")
        save_btn.setDefault(True)
        save_btn.setStyleSheet("background: #238636; color: white; font-weight: bold; font-size: 13px; padding: 6px 16px;")
        save_btn.clicked.connect(self._apply_and_close)
        btn_box.addWidget(save_btn)

        layout.addLayout(btn_box)

        # Connect change listeners
        self.field_combo.currentIndexChanged.connect(self._recalculate)
        self.eng_spin.valueChanged.connect(self._recalculate)
        self.jd_spin.valueChanged.connect(self._recalculate)
        self.dist_spin.valueChanged.connect(self._recalculate)
        self.flux_spin.valueChanged.connect(self._recalculate)

        self._recalculate()

    def _create_sim_row(self, parent_layout: QVBoxLayout, label: str, val_color: str = "#c9d1d9") -> QLabel:
        row = QHBoxLayout()
        row.setContentsMargins(0, 1, 0, 1)
        lbl = QLabel(label)
        lbl.setStyleSheet("color: #8b949e; font-size: 12px;")
        val_lbl = QLabel()
        val_lbl.setStyleSheet(f"color: {val_color}; font-size: 12px; font-weight: bold;")
        row.addWidget(lbl)
        row.addStretch()
        row.addWidget(val_lbl)
        parent_layout.addLayout(row)
        return val_lbl

    def _recalculate(self):
        f_key = self.field_combo.currentData() or "Bubble"
        f_def = ENUM_JUMP_FIELDS.get(f_key, ENUM_JUMP_FIELDS["Bubble"])
        self.field_desc_lbl.setText(f_def.get("comment", ""))

        eng_skill = self.eng_spin.value()
        jd_skill = self.jd_spin.value()
        dist_val = self.dist_spin.value()
        actual_dist = dist_val if dist_val > 0.0 else None
        flux = self.flux_spin.value()

        # Temporary assign to ship for calculation
        prev_f = self.ship.jumpFieldKey
        self.ship.jumpFieldKey = f_key
        safe = self.calc.safe_jump_distance(eng_skill, jd_skill)
        intf = self.calc.jump_interference(eng_skill, jd_skill, actual_dist, flux)
        self.ship.jumpFieldKey = prev_f

        self.row_s.setText(str(safe["strength"]))
        self.row_e.setText(f"E = {safe['E']} ({int(safe['E'] * 100)}%)")
        self.row_skill.setText(f"Engineer {safe['engineerRank']} + Jump Drives {safe['jumpDriveSpecialty']} = Skill {safe['totalEngineerSkill']}")
        self.row_d.setText(f"D = {safe['D']} Planetary Diameters")
        self.row_act.setText(f"{intf['jumpDistance']} Planetary Diameters")
        self.row_armor.setText(f"Armor: {safe['armorMod']} | Flash: {safe['flash']}")
        
        # Misjump color coding
        x_val = intf["X"]
        if x_val > 2.0:
            x_color = "#f85149"
        elif x_val > 0.5:
            x_color = "#f0883e"
        else:
            x_color = "#3fb950"

        self.row_x.setText(f"X = {x_val} ({intf['misjumpRisk']})")
        self.row_x.setStyleSheet(f"color: {x_color}; font-size: 12px; font-weight: bold;")

    def _apply_and_close(self):
        f_key = self.field_combo.currentData() or "Bubble"
        self.ship.jumpFieldKey = f_key
        self.ship.engineerSkill = self.eng_spin.value()
        self.ship.jumpDriveSpecialty = self.jd_spin.value()
        
        dist_val = self.dist_spin.value()
        self.ship.jumpDiameters = dist_val if dist_val > 0.0 else None
        
        self.accept()
