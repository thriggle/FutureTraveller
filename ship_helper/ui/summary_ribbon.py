"""
Ship Summary Ribbon Widget for PySide6.
Displays compact live metrics (Mission, Tonnage, Config, Hardpoints, Jump Dist, CP, Ergonomics, Computers, Crew/Berths, Life Support).
"""
from typing import Optional
from PySide6.QtCore import Qt
from PySide6.QtWidgets import QFrame, QHBoxLayout, QLabel, QVBoxLayout, QWidget, QSizePolicy
from ship_helper.engine.ship_engine import ShipCalculator

class SummaryChip(QFrame):
    def __init__(self, label: str, default_val: str, tooltip: str = "", parent: Optional[QWidget] = None):
        super().__init__(parent)
        self.setFrameShape(QFrame.StyledPanel)
        self.setFixedHeight(58)
        self.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Fixed)
        self.setStyleSheet("""
            QFrame {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 5px;
                padding: 2px 4px;
            }
            QFrame:hover {
                border-color: #58a6ff;
            }
        """)
        if tooltip:
            self.setToolTip(tooltip)
        
        layout = QVBoxLayout(self)
        layout.setContentsMargins(4, 4, 4, 4)
        layout.setSpacing(2)

        self.lbl_title = QLabel(label)
        self.lbl_title.setAlignment(Qt.AlignCenter)
        self.lbl_title.setStyleSheet("color: #8b949e; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;")
        
        self.lbl_val = QLabel(default_val)
        self.lbl_val.setAlignment(Qt.AlignCenter)
        self.lbl_val.setStyleSheet("color: #58a6ff; font-size: 15px; font-weight: bold;")

        layout.addWidget(self.lbl_title)
        layout.addWidget(self.lbl_val)

    def set_value(self, val: str, is_warning: bool = False):
        self.lbl_val.setText(val)
        if is_warning:
            self.lbl_val.setStyleSheet("color: #f85149; font-size: 15px; font-weight: bold;")
        else:
            self.lbl_val.setStyleSheet("color: #58a6ff; font-size: 15px; font-weight: bold;")

class ShipSummaryRibbon(QWidget):
    def __init__(self, parent: Optional[QWidget] = None):
        super().__init__(parent)
        self.setFixedHeight(64)
        self.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
        
        self.layout = QHBoxLayout(self)
        self.layout.setContentsMargins(0, 2, 0, 2)
        self.layout.setSpacing(4)

        self.chip_mission = SummaryChip("Mission", "MT-A-I-T", "Mission Classification Code")
        self.chip_tonnage = SummaryChip("Tonnage", "0t", "Total Displacement Tonnage")
        self.chip_config = SummaryChip("Config", "Unstreamlined", "Hull Streamlining")
        self.chip_hardpoints = SummaryChip("Hardpoints", "0 / 0", "Hardpoints Used / Max")
        self.chip_safejump = SummaryChip("Safe Jump", "100D", "Safe Jump Distance (Diameters)")
        self.chip_cp = SummaryChip("Panels", "0 CP", "Total Control Panels")
        self.chip_ergo = SummaryChip("Ergonomics", "0.0 (E)", "Consoles & Control Ergonomics")
        self.chip_computer = SummaryChip("Computers", "0 Cells", "Computer Bandwidth Cells")
        self.chip_crew = SummaryChip("Crew / Berths", "0 / 0", "Crew Required vs Allocated Berths")
        self.chip_lifesupport = SummaryChip("Life Support", "30 Days", "Mission Life Support Endurance")

        self.layout.addWidget(self.chip_mission)
        self.layout.addWidget(self.chip_tonnage)
        self.layout.addWidget(self.chip_config)
        self.layout.addWidget(self.chip_hardpoints)
        self.layout.addWidget(self.chip_safejump)
        self.layout.addWidget(self.chip_cp)
        self.layout.addWidget(self.chip_ergo)
        self.layout.addWidget(self.chip_computer)
        self.layout.addWidget(self.chip_crew)
        self.layout.addWidget(self.chip_lifesupport)

    def update_metrics(self, calc_or_tonnage=None, **kwargs):
        if isinstance(calc_or_tonnage, ShipCalculator):
            calc = calc_or_tonnage
            self.chip_mission.set_value(calc.ship.missionCode)
            self.chip_mission.setToolTip(f"Mission: {calc.ship.missionCode} ({calc.ship.missionFullTitle})")
            self.chip_tonnage.set_value(f"{int(calc.total_tonnage):,}t")
            self.chip_config.set_value(calc.configuration_type)
            self.chip_hardpoints.set_value(
                f"{calc.hardpoints_used} / {calc.max_hardpoints}",
                is_warning=(calc.hardpoints_used > calc.max_hardpoints)
            )
            safe_jump = calc.safe_jump_distance(calc.ship.engineerSkill, calc.ship.jumpDriveSpecialty)
            self.chip_safejump.set_value(f"{safe_jump['D']}D" if safe_jump['hasJumpDrive'] else "No Jump")
            self.chip_cp.set_value(f"{calc.total_control_panels} CP")
            self.chip_ergo.set_value(f"E: {calc.control_ergonomics:.2f}")
            self.chip_computer.set_value(f"{calc.total_computer_cells} Cells")
            self.chip_crew.set_value(f"{calc.total_crew_berths} Berths")
            self.chip_lifesupport.set_value("30 Days")
        else:
            if "mission" in kwargs:
                self.chip_mission.set_value(str(kwargs["mission"]))
            if "tonnage" in kwargs:
                self.chip_tonnage.set_value(f"{int(kwargs['tonnage']):,}t")
            if "config" in kwargs:
                self.chip_config.set_value(str(kwargs['config']))
            if "hardpoints" in kwargs:
                self.chip_hardpoints.set_value(f"{kwargs['hardpoints']} HP")
            if "jump_dist" in kwargs:
                self.chip_safejump.set_value(f"{kwargs['jump_dist']}D")
            if "cp" in kwargs:
                self.chip_cp.set_value(f"{kwargs['cp']} CP")
            if "ergo" in kwargs:
                self.chip_ergo.set_value(f"E: {kwargs['ergo']:.2f}")
            if "computers" in kwargs:
                self.chip_computer.set_value(f"{kwargs['computers']} Cells")
            if "crew" in kwargs:
                self.chip_crew.set_value(f"{kwargs['crew']} Berths")

# Alias for backwards compatibility
SummaryRibbonWidget = ShipSummaryRibbon
