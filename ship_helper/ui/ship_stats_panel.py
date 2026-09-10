"""
T5 Starship Construction: Right Panel Ship Stats & System Diagnostics.
Faithful reproduction of renderRightPanel() from Traveller/js/ShipHelperView.js.
"""
from typing import Optional
from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QScrollArea, QFrame, QGroupBox
)
from ship_helper.models.ship import ShipDesign
from ship_helper.engine.ship_engine import ShipCalculator
from core.data_models import StarshipHullsData

_hulls_data = StarshipHullsData.load()

class ShipStatsPanel(QWidget):
    """Right workspace panel displaying live starship diagnostics, performance, and evaluations."""
    mission_dialog_requested = Signal()
    jump_dialog_requested = Signal()

    def __init__(self, ship: ShipDesign, parent=None):
        super().__init__(parent)
        self.ship = ship
        self.init_ui()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(4, 4, 4, 4)
        main_layout.setSpacing(6)

        title = QLabel("<b>Ship Stats & Diagnostics</b>")
        title.setStyleSheet("color: #79c0ff; font-size: 15px; font-weight: bold;")
        main_layout.addWidget(title)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("background: #0b0e14; border: 1px solid #30363d; border-radius: 6px;")

        self.container = QWidget()
        self.container_layout = QVBoxLayout(self.container)
        self.container_layout.setContentsMargins(8, 8, 8, 8)
        self.container_layout.setSpacing(12)
        scroll.setWidget(self.container)

        main_layout.addWidget(scroll, 1)
        self.refresh()

    def set_ship(self, ship: ShipDesign):
        self.ship = ship
        self.refresh()

    def refresh(self):
        # Clear existing
        while self.container_layout.count():
            item = self.container_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        calc = ShipCalculator(self.ship)
        qual = calc.get_quality_evaluations()
        jump_res = calc.safe_jump_distance(self.ship.engineerSkill, self.ship.jumpDriveSpecialty)

        # 1. Mission Classification
        m_group = self._create_section("Mission Classification (Sec 02)")
        m_layout = QVBoxLayout(m_group)
        m_layout.setSpacing(4)
        self._add_stat_row(m_layout, "Vessel:", f"{self.ship.shipName} ({self.ship.registration})")
        self._add_stat_row(m_layout, "Classification Code:", self.ship.missionCode, value_color="#3fb950")
        self._add_stat_row(m_layout, "Designation:", self.ship.missionFullTitle)
        
        m_btn = QPushButton("Configure Mission & Code...")
        m_btn.setStyleSheet("padding: 5px 10px; font-size: 12px; font-weight: 600; margin-top: 4px;")
        m_btn.clicked.connect(self.mission_dialog_requested.emit)
        m_layout.addWidget(m_btn)
        self.container_layout.addWidget(m_group)

        # 2. Hull Configuration
        h_group = self._create_section("Hull Configuration & Dynamics")
        h_layout = QVBoxLayout(h_group)
        h_layout.setSpacing(4)
        conf_def = _hulls_data.hull_configs.get(calc.configuration_type, {})
        self._add_stat_row(h_layout, "Type:", calc.configuration_type, value_color="#58a6ff")
        self._add_stat_row(h_layout, "Friction:", str(conf_def.get("friction", 0.5)))
        self._add_stat_row(h_layout, "Agility:", f"{conf_def.get('agility', 0):+d}")
        self._add_stat_row(h_layout, "Max Hull G:", f"{conf_def.get('maxG', 9)} G")
        self.container_layout.addWidget(h_group)

        # 3. Drive Performance
        d_group = self._create_section("Drive Performance & Propulsion")
        d_layout = QVBoxLayout(d_group)
        d_layout.setSpacing(4)
        total_d_tons = sum(d.tons for d in calc.all_drives)
        self._add_stat_row(d_layout, "Total Drive Volume:", f"{total_d_tons:.1f} tons")
        if calc.maneuver_drive:
            self._add_stat_row(d_layout, "Maneuver Drive:", f"{calc.maneuver_rating} G Thrust", value_color="#3fb950")
        if calc.jump_drive:
            self._add_stat_row(d_layout, "Jump Drive:", f"Jump-{calc.jump_rating}", value_color="#3fb950")
        if calc.power_plant:
            self._add_stat_row(d_layout, "Power Generation:", f"{calc.power_output:.0f} EP Output", value_color="#58a6ff")
        self.container_layout.addWidget(d_group)

        # 4. Accommodations & Berthing
        a_group = self._create_section("Accommodations & Berthing (Sec 19/23)")
        a_layout = QVBoxLayout(a_group)
        a_layout.setSpacing(4)
        self._add_stat_row(a_layout, "Crew Berths:", f"{calc.total_crew_berths} Berths")
        self._add_stat_row(a_layout, "Passenger Berths:", f"{calc.total_passenger_berths} Pax")
        self._add_stat_row(a_layout, "Cryo Low Berths:", f"{calc.total_low_berths} Low")
        cargo_tons = sum(c.tons for c in calc.all_components if c.isFacility and c.extra.get("isCargo"))
        self._add_stat_row(a_layout, "Cargo Capacity:", f"{cargo_tons:.1f} tons")
        self.container_layout.addWidget(a_group)

        # 5. Quality & Livability
        q_group = self._create_section("Quality & Livability (Sec 26)")
        q_layout = QVBoxLayout(q_group)
        q_layout.setSpacing(4)
        d_color = "#3fb950" if qual["demand"] >= 0 else "#f85149"
        self._add_stat_row(q_layout, "Passenger Demand (D):", f"D = {qual['demand']:+.1f} ({qual['demandRating']})", value_color=d_color)
        self._add_stat_row(q_layout, "Crew Comfort (C):", f"C = {qual['comfort']:.2f} ({qual['comfortRating']})", value_color="#58a6ff")
        self._add_stat_row(q_layout, "Control Ergonomics (E):", f"E = {qual['ergonomics']:.2f} ({qual['ergoRating']})", value_color="#f0883e")
        self.container_layout.addWidget(q_group)

        # 6. Jump Fields
        j_group = self._create_section("Astrogation & Jump Fields (Sec 07)")
        j_layout = QVBoxLayout(j_group)
        j_layout.setSpacing(4)
        if jump_res["hasJumpDrive"]:
            self._add_stat_row(j_layout, "Jump Field:", jump_res["fieldName"])
            self._add_stat_row(j_layout, "Safe Distance (D):", f"{jump_res['safeDiameters']} Diameters", value_color="#3fb950")
            self._add_stat_row(j_layout, "Chief Engineer:", f"Rank {self.ship.engineerSkill}")
        else:
            self._add_stat_row(j_layout, "Status:", "No Jump Drive Fitted", value_color="#8b949e")
        
        j_btn = QPushButton("Configure Jump Fields...")
        j_btn.setStyleSheet("padding: 5px 10px; font-size: 12px; font-weight: 600; margin-top: 4px;")
        j_btn.clicked.connect(self.jump_dialog_requested.emit)
        j_layout.addWidget(j_btn)
        self.container_layout.addWidget(j_group)

        # 7. Valuation & Costs
        val_group = self._create_section("Financial Summary & Valuation")
        val_layout = QVBoxLayout(val_group)
        val_layout.setSpacing(4)
        self._add_stat_row(val_layout, "Base Hull Cost:", f"MCr {calc.base_cost:.3f}")
        self._add_stat_row(val_layout, "Total Ship Valuation:", f"MCr {calc.total_cost:.3f}", value_color="#3fb950")
        self.container_layout.addWidget(val_group)

        self.container_layout.addStretch()

    def _create_section(self, title: str) -> QGroupBox:
        box = QGroupBox(title)
        box.setStyleSheet("""
            QGroupBox {
                border: 1px solid #30363d;
                border-radius: 6px;
                margin-top: 10px;
                padding-top: 14px;
                padding-bottom: 8px;
                padding-left: 8px;
                padding-right: 8px;
                font-size: 12px;
                font-weight: bold;
                color: #79c0ff;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 8px;
                padding: 2px 6px;
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #79c0ff;
                font-weight: bold;
                font-size: 11px;
            }
        """)
        return box

    def _add_stat_row(self, layout: QVBoxLayout, label: str, val: str, value_color: str = "#c9d1d9"):
        row = QHBoxLayout()
        row.setContentsMargins(0, 1, 0, 1)
        lbl = QLabel(label)
        lbl.setStyleSheet("color: #8b949e; font-size: 12px;")
        val_lbl = QLabel(val)
        val_lbl.setStyleSheet(f"color: {value_color}; font-size: 12px; font-weight: bold;")
        row.addWidget(lbl)
        row.addStretch()
        row.addWidget(val_lbl)
        layout.addLayout(row)
