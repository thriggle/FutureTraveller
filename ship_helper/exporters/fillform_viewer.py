"""
T5 Starship Construction: Official 3-Page Fillform Sheet Viewer & Vector PDF Exporter.
Renders the complete 3-page Traveller 5 Starship Design Specification sheet.
"""
import os
from PySide6.QtCore import Qt, QMarginsF
from PySide6.QtGui import QTextDocument, QPageSize, QPageLayout, QPdfWriter, QPainter, QFont
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QTabWidget, QTextBrowser,
    QPushButton, QFileDialog, QMessageBox, QLabel
)
from ship_helper.models.ship import ShipDesign
from ship_helper.engine.ship_engine import ShipCalculator

class FillformViewer(QDialog):
    """3-Page T5 Starship Construction Fillform previewer and PDF generator."""
    def __init__(self, ship: ShipDesign, parent=None):
        super().__init__(parent)
        self.ship = ship
        self.calc = ShipCalculator(ship)
        self.setWindowTitle(f"T5 Starship Design Specification: {ship.shipName}")
        self.resize(850, 750)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(12, 12, 12, 12)
        layout.setSpacing(10)

        # Header Bar
        hdr_layout = QHBoxLayout()
        title = QLabel(f"<h3>Traveller 5 Starship Design Sheets — {self.ship.shipName} [{self.ship.missionCode}]</h3>")
        title.setStyleSheet("color: #58a6ff;")
        hdr_layout.addWidget(title)
        hdr_layout.addStretch()

        pdf_btn = QPushButton("Export to PDF...")
        pdf_btn.setStyleSheet("background: #238636; color: white; font-weight: bold; padding: 6px 14px;")
        pdf_btn.clicked.connect(self._export_to_pdf)
        hdr_layout.addWidget(pdf_btn)

        layout.addLayout(hdr_layout)

        # 3-Page Tabs
        self.tabs = QTabWidget()
        
        # Page 1: Hull & Mission Specs
        self.page1_view = QTextBrowser()
        self.page1_view.setHtml(self._render_page_1())
        self.tabs.addTab(self.page1_view, "Page 1: Hull & Mission Specs")

        # Page 2: Drives & Controls
        self.page2_view = QTextBrowser()
        self.page2_view.setHtml(self._render_page_2())
        self.tabs.addTab(self.page2_view, "Page 2: Drives & Systems")

        # Page 3: Accommodations & Armament
        self.page3_view = QTextBrowser()
        self.page3_view.setHtml(self._render_page_3())
        self.tabs.addTab(self.page3_view, "Page 3: Accommodations & Armament")

        layout.addWidget(self.tabs)

        # Footer close button
        btn_box = QHBoxLayout()
        btn_box.addStretch()
        close_btn = QPushButton("Close")
        close_btn.clicked.connect(self.accept)
        btn_box.addWidget(close_btn)
        layout.addLayout(btn_box)

    def _get_css(self) -> str:
        return """
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0d1117; color: #c9d1d9; font-size: 13px; line-height: 1.4; }
            h2 { color: #58a6ff; border-bottom: 2px solid #30363d; padding-bottom: 4px; margin-top: 10px; margin-bottom: 8px; font-size: 17px; }
            h3 { color: #f0883e; margin-top: 12px; margin-bottom: 6px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 12px; }
            th { background-color: #161b22; color: #58a6ff; border: 1px solid #30363d; padding: 6px 8px; text-align: left; }
            td { border: 1px solid #21262d; padding: 5px 8px; }
            .badge { background-color: #21262d; color: #3fb950; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
            .badge-warn { background-color: #382414; color: #d29922; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
            .section-box { background-color: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 10px; margin-bottom: 12px; }
        </style>
        """

    def _render_page_1(self) -> str:
        jump_info = self.calc.safe_jump_distance(self.ship.engineerSkill, self.ship.jumpDriveSpecialty)
        subhull_rows = ""
        for s in self.ship.subhulls:
            av = self.calc.get_subhull_av(s)
            a_tons = self.calc.get_subhull_armor_tons(s)
            pod_tag = " (Pod)" if s.isPod else ""
            subhull_rows += f"""
            <tr>
                <td><b>{s.name}{pod_tag}</b></td>
                <td>{s.tons:.1f}t</td>
                <td>{s.config}</td>
                <td>TL-{s.tl}</td>
                <td>{s.armorType} ({s.armorLayers} Layers)</td>
                <td>AV {av} ({a_tons:.1f}t)</td>
            </tr>
            """

        return f"""
        <html><head>{self._get_css()}</head><body>
            <h2>Traveller 5 Starship Construction — Page 1: Hull & Mission Specifications</h2>
            
            <div class="section-box">
                <table style="border: none;">
                    <tr>
                        <td style="border:none; width:50%;"><b>Ship Name:</b> <span style="color:#58a6ff; font-size:15px;">{self.ship.shipName}</span></td>
                        <td style="border:none; width:50%;"><b>Registration:</b> <span style="color:#f0883e;">{self.ship.registration}</span></td>
                    </tr>
                    <tr>
                        <td style="border:none;"><b>Mission Code:</b> <span class="badge">{self.ship.missionCode}</span></td>
                        <td style="border:none;"><b>Classification:</b> {self.ship.missionFullTitle}</td>
                    </tr>
                    <tr>
                        <td style="border:none;"><b>Base Tech Level:</b> TL-{self.ship.baseTL}</td>
                        <td style="border:none;"><b>Total Displacement:</b> {self.calc.total_tonnage:.1f} Tons ({self.calc.configuration_type})</td>
                    </tr>
                </table>
            </div>

            <h3>Subhull & Armor Architecture</h3>
            <table>
                <tr>
                    <th>Subhull Name</th>
                    <th>Displacement</th>
                    <th>Configuration</th>
                    <th>TL</th>
                    <th>Armor Material</th>
                    <th>Armor Value & Tonnage</th>
                </tr>
                {subhull_rows}
            </table>

            <h3>Section 07: Astrogation & Safe Jump Metrics</h3>
            <div class="section-box">
                <table>
                    <tr>
                        <th>Jump Field Emitter</th>
                        <th>Field Factor (S)</th>
                        <th>Chief Engineer (K)</th>
                        <th>Drive Rating (E)</th>
                        <th>Safe Jump Distance (D)</th>
                    </tr>
                    <tr>
                        <td>{jump_info.get('fieldName', 'Bubble')}</td>
                        <td>{jump_info.get('strength', 0)}</td>
                        <td>Rank {jump_info.get('totalEngineerSkill', 0)}</td>
                        <td>{jump_info.get('E', 1.0):.1f}</td>
                        <td><b>{jump_info.get('D', 100)} Diameters</b></td>
                    </tr>
                </table>
            </div>
        </body></html>
        """

    def _render_page_2(self) -> str:
        drives_rows = ""
        for d in self.calc.all_drives:
            drives_rows += f"""
            <tr>
                <td><b>{d.driveType}</b></td>
                <td>Type {d.driveClass}</td>
                <td>{d.stage}</td>
                <td>{d.nexus}x</td>
                <td>{d.ep} EP</td>
                <td>{d.tons:.1f}t</td>
                <td>MCr {d.cost:.3f}</td>
            </tr>
            """
        if not drives_rows:
            drives_rows = "<tr><td colspan='7' style='text-align:center;'>No drives installed</td></tr>"

        return f"""
        <html><head>{self._get_css()}</head><body>
            <h2>Traveller 5 Starship Construction — Page 2: Drives, Controls & Avionics</h2>
            
            <h3>Installed Drives & Power Generation</h3>
            <table>
                <tr>
                    <th>Drive System</th>
                    <th>Class</th>
                    <th>Tech Stage</th>
                    <th>Nexus</th>
                    <th>Output / EP</th>
                    <th>Volume</th>
                    <th>Cost</th>
                </tr>
                {drives_rows}
            </table>

            <div class="section-box">
                <table style="border:none;">
                    <tr>
                        <td style="border:none;"><b>Jump Rating:</b> Jump-{self.calc.jump_rating}</td>
                        <td style="border:none;"><b>Maneuver Rating:</b> {self.calc.maneuver_rating} G</td>
                        <td style="border:none;"><b>Power Output:</b> {self.calc.power_output:.0f} EP</td>
                    </tr>
                </table>
            </div>

            <h3>Controls, Consoles & Ergonomics</h3>
            <table>
                <tr>
                    <th>Control Panels (CP)</th>
                    <th>Console Stations</th>
                    <th>Console Volume</th>
                    <th>Ergonomics (E-Rating)</th>
                    <th>Computer Cells</th>
                </tr>
                <tr>
                    <td>{self.calc.total_control_panels} CP</td>
                    <td>{self.calc.total_console_count} Consoles</td>
                    <td>{self.calc.total_console_tons:.1f} Tons</td>
                    <td>{self.calc.control_ergonomics:.2f} (Console Tons / CP)</td>
                    <td>{self.calc.total_computer_cells} Processing Cells</td>
                </tr>
            </table>
        </body></html>
        """

    def _render_page_3(self) -> str:
        qual = self.calc.get_quality_evaluations()
        accom_rows = ""
        for c in self.calc.all_components:
            if c.isAccommodation:
                accom_rows += f"""
                <tr>
                    <td><b>{c.name}</b></td>
                    <td>{c.extra.get('assignment', 'Crew')}</td>
                    <td>{c.extra.get('occupants', 1)}</td>
                    <td>{c.tons:.1f}t</td>
                    <td>MCr {c.cost:.3f}</td>
                </tr>
                """
        if not accom_rows:
            accom_rows = "<tr><td colspan='5' style='text-align:center;'>No accommodations installed</td></tr>"

        armament_rows = ""
        for c in self.calc.all_components:
            if c.isWeapon or c.isDefense or c.isSensor:
                cat = "Weapon" if c.isWeapon else ("Defense" if c.isDefense else "Sensor")
                armament_rows += f"""
                <tr>
                    <td><b>{c.name}</b></td>
                    <td>{cat}</td>
                    <td>{c.tons:.1f}t</td>
                    <td>MCr {c.cost:.3f}</td>
                    <td>{c.extra.get('comment', '-')}</td>
                </tr>
                """
        if not armament_rows:
            armament_rows = "<tr><td colspan='5' style='text-align:center;'>No weaponry or screens installed</td></tr>"

        return f"""
        <html><head>{self._get_css()}</head><body>
            <h2>Traveller 5 Starship Construction — Page 3: Accommodations & Mission Payload</h2>
            
            <h3>Accommodations, Berths & Livability Quality</h3>
            <table>
                <tr>
                    <th>Accommodation Item</th>
                    <th>Role</th>
                    <th>Berths</th>
                    <th>Volume</th>
                    <th>Cost</th>
                </tr>
                {accom_rows}
            </table>

            <div class="section-box">
                <table style="border:none;">
                    <tr>
                        <td style="border:none;"><b>Crew Berths:</b> {self.calc.total_crew_berths}</td>
                        <td style="border:none;"><b>Passenger Berths:</b> {self.calc.total_passenger_berths}</td>
                        <td style="border:none;"><b>Low Berths:</b> {self.calc.total_low_berths}</td>
                        <td style="border:none;"><b>Demand (D):</b> {qual['demand']} ({qual['demandRating']})</td>
                        <td style="border:none;"><b>Comfort (C):</b> {qual['comfort']} ({qual['comfortRating']})</td>
                    </tr>
                </table>
            </div>

            <h3>Weaponry, Defenses & Sensors</h3>
            <table>
                <tr>
                    <th>System Name</th>
                    <th>Category</th>
                    <th>Volume</th>
                    <th>Cost</th>
                    <th>Specification Notes</th>
                </tr>
                {armament_rows}
            </table>

            <h3>Financial Summary & Total Valuation</h3>
            <div class="section-box">
                <table style="border:none;">
                    <tr>
                        <td style="border:none; font-size:15px;"><b>Base Hull Cost:</b> MCr {self.calc.base_cost:.3f}</td>
                        <td style="border:none; font-size:16px;"><b>Total Ship Valuation:</b> <span style="color:#3fb950; font-weight:bold;">MCr {self.calc.total_cost:.3f}</span></td>
                    </tr>
                </table>
            </div>
        </body></html>
        """

    def _export_to_pdf(self):
        default_name = f"{self.ship.shipName.replace(' ', '_')}_T5_Fillform.pdf"
        file_path, _ = QFileDialog.getSaveFileName(self, "Export T5 Starship Fillforms to PDF", default_name, "PDF Files (*.pdf)")
        if not file_path:
            return

        try:
            full_html = (
                self._render_page_1() +
                "<div style='page-break-before: always;'></div>" +
                self._render_page_2() +
                "<div style='page-break-before: always;'></div>" +
                self._render_page_3()
            )
            doc = QTextDocument()
            doc.setHtml(full_html)

            writer = QPdfWriter(file_path)
            writer.setPageSize(QPageSize(QPageSize.A4))
            writer.setPageMargins(QMarginsF(15, 15, 15, 15))
            
            doc.print_(writer)
            QMessageBox.information(self, "PDF Export Complete", f"Successfully exported starship fillforms to:\n{file_path}")
        except Exception as e:
            QMessageBox.critical(self, "Export Error", f"Failed to export PDF:\n{str(e)}")
