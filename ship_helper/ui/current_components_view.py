"""
T5 Starship Construction: Current Components Center View.
Presents Subhulls as modular containers with grouped interactive component cards.
"""
from typing import Optional
from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QRadioButton,
    QScrollArea, QFrame, QMessageBox, QGroupBox
)
from ship_helper.models.ship import ShipDesign, SubhullItem, DriveItem, ComponentItem
from ship_helper.engine.ship_engine import ShipCalculator
from ship_helper.ui.cards import ComponentCardWidget, DriveCardWidget
from ship_helper.ui.dialogs.component_dialogs import (
    HullDialog, DriveDialog, WeaponDialog, GenericComponentDialog
)

class CurrentComponentsView(QWidget):
    """Center workspace panel showing installed subhulls and grouped equipment cards."""
    ship_modified = Signal()
    subhull_selected = Signal(int)

    def __init__(self, ship: ShipDesign, parent=None):
        super().__init__(parent)
        self.ship = ship
        self.selected_hull_idx: int = 0
        self.init_ui()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(4, 4, 4, 4)
        main_layout.setSpacing(6)

        # Header
        hdr = QHBoxLayout()
        title = QLabel("<b>Current Components & Architecture</b>")
        title.setStyleSheet("color: #79c0ff; font-size: 15px; font-weight: bold;")
        hdr.addWidget(title)
        hdr.addStretch()

        add_hull_btn = QPushButton("+ Add Subhull")
        add_hull_btn.setStyleSheet("padding: 5px 12px; font-size: 12px; font-weight: 600;")
        add_hull_btn.clicked.connect(self._on_add_subhull)
        hdr.addWidget(add_hull_btn)

        add_pod_btn = QPushButton("+ Add Pod")
        add_pod_btn.setStyleSheet("padding: 5px 12px; font-size: 12px; font-weight: 600;")
        add_pod_btn.clicked.connect(self._on_add_pod)
        hdr.addWidget(add_pod_btn)

        main_layout.addLayout(hdr)

        # Scroll Area for Subhulls
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("background: #0b0e14; border: none;")

        self.container = QWidget()
        self.container_layout = QVBoxLayout(self.container)
        self.container_layout.setContentsMargins(4, 4, 4, 4)
        self.container_layout.setSpacing(14)
        scroll.setWidget(self.container)

        main_layout.addWidget(scroll, 1)
        self.refresh()

    def set_ship(self, ship: ShipDesign):
        self.ship = ship
        self.selected_hull_idx = 0
        self.refresh()

    def get_selected_subhull_index(self) -> int:
        if 0 <= self.selected_hull_idx < len(self.ship.subhulls):
            return self.selected_hull_idx
        return 0 if self.ship.subhulls else -1

    def refresh(self):
        # Clear existing
        while self.container_layout.count():
            item = self.container_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        if not self.ship.subhulls:
            empty_lbl = QLabel("No subhulls installed. Click '+ Add Subhull' to begin.")
            empty_lbl.setStyleSheet("color: #8b949e; font-style: italic; padding: 20px; text-align: center; font-size: 13px;")
            self.container_layout.addWidget(empty_lbl)
            return

        calc = ShipCalculator(self.ship)

        for h_idx, hull in enumerate(self.ship.subhulls):
            hull_box = QFrame()
            is_selected = (h_idx == self.selected_hull_idx)
            bg_color = "#0d1117" if is_selected else "#0b0e14"
            hull_box.setStyleSheet(f"""
                QFrame {{
                    background-color: {bg_color};
                    border: none;
                    border-radius: 6px;
                }}
            """)
            h_layout = QVBoxLayout(hull_box)
            h_layout.setContentsMargins(6, 6, 6, 6)
            h_layout.setSpacing(8)

            # Subhull Header Row
            hdr_frame = QFrame()
            hdr_frame.setStyleSheet("background: #161b22; border: none; border-radius: 4px; padding: 6px 8px;")
            hdr_layout = QHBoxLayout(hdr_frame)
            hdr_layout.setContentsMargins(8, 6, 8, 6)
            hdr_layout.setSpacing(8)

            # Radio button
            radio = QRadioButton()
            radio.setChecked(is_selected)
            radio.toggled.connect(lambda chk, idx=h_idx: self._select_hull(idx) if chk else None)
            hdr_layout.addWidget(radio)

            # Name & Pod Label
            pod_str = " [Pod]" if hull.isPod else ""
            title_lbl = QLabel(f"<b>{hull.name}{pod_str}</b>")
            title_lbl.setStyleSheet("color: #79c0ff; font-size: 16px; font-weight: bold;")
            hdr_layout.addWidget(title_lbl)

            # Metrics
            armor_tons = calc.get_subhull_armor_tons(hull)
            consumed = sum(d.tons for d in hull.drives) + sum(c.tons for c in hull.components) + armor_tons
            av_val = calc.get_subhull_av(hull)

            tons_color = "#f85149" if consumed > hull.tons else "#3fb950"
            metrics_lbl = QLabel(
                f"TL-{hull.tl} &bull; "
                f"<span style='color:{tons_color}; font-weight:bold;'>{consumed:.1f} / {hull.tons:.0f} tons</span> &bull; "
                f"{hull.config} {hull.armorType} &bull; "
                f"AV: {av_val} ({hull.armorLayers}L)"
            )
            metrics_lbl.setStyleSheet("color: #c9d1d9; font-size: 13px;")
            hdr_layout.addWidget(metrics_lbl)

            hdr_layout.addStretch()

            # Edit Button
            edit_btn = QPushButton("Edit")
            edit_btn.setStyleSheet("padding: 4px 12px; font-size: 12px; border: none; background: #21262d; border-radius: 3px;")
            edit_btn.clicked.connect(lambda _, idx=h_idx: self._edit_hull(idx))
            hdr_layout.addWidget(edit_btn)

            # Remove Button
            rm_btn = QPushButton("Remove")
            rm_btn.setStyleSheet("padding: 4px 12px; font-size: 12px; color: #f85149; border: none; background: #21262d; border-radius: 3px; font-weight: bold;")
            rm_btn.clicked.connect(lambda _, idx=h_idx: self._remove_hull(idx))
            hdr_layout.addWidget(rm_btn)

            h_layout.addWidget(hdr_frame)

            # Installed Items List
            items_layout = QVBoxLayout()
            items_layout.setSpacing(6)

            # Drives
            if hull.drives:
                lbl = QLabel("<b style='color:#f0883e; font-size:15px; font-weight:bold; letter-spacing:0.8px;'>&#9656; DRIVES & PROPULSION</b>")
                lbl.setStyleSheet("margin-top: 10px; margin-bottom: 4px; padding-left: 2px;")
                items_layout.addWidget(lbl)
                for d_idx, d in enumerate(hull.drives):
                    card = DriveCardWidget(d)
                    card.clicked.connect(lambda idx=h_idx, didx=d_idx: self._edit_drive(idx, didx))
                    card.removed.connect(lambda idx=h_idx, didx=d_idx: self._remove_drive(idx, didx))
                    items_layout.addWidget(card)

            # Accommodations
            accoms = [c for c in hull.components if c.isAccommodation]
            if accoms:
                lbl = QLabel("<b style='color:#58a6ff; font-size:15px; font-weight:bold; letter-spacing:0.8px;'>&#9656; ACCOMMODATIONS & STATEROOMS</b>")
                lbl.setStyleSheet("margin-top: 10px; margin-bottom: 4px; padding-left: 2px;")
                items_layout.addWidget(lbl)
                for c in accoms:
                    card = ComponentCardWidget(c)
                    card.clicked.connect(lambda comp=c, idx=h_idx: self._edit_component(comp, idx))
                    card.removed.connect(lambda comp=c, idx=h_idx: self._remove_component(comp, idx))
                    items_layout.addWidget(card)

            # Weapons
            weapons = [c for c in hull.components if c.isWeapon]
            if weapons:
                lbl = QLabel("<b style='color:#f85149; font-size:15px; font-weight:bold; letter-spacing:0.8px;'>&#9656; WEAPONRY & TURRETS</b>")
                lbl.setStyleSheet("margin-top: 10px; margin-bottom: 4px; padding-left: 2px;")
                items_layout.addWidget(lbl)
                for c in weapons:
                    card = ComponentCardWidget(c)
                    card.clicked.connect(lambda comp=c, idx=h_idx: self._edit_component(comp, idx))
                    card.removed.connect(lambda comp=c, idx=h_idx: self._remove_component(comp, idx))
                    items_layout.addWidget(card)

            # Defenses & Screens
            defenses = [c for c in hull.components if c.isDefense]
            if defenses:
                lbl = QLabel("<b style='color:#3fb950; font-size:15px; font-weight:bold; letter-spacing:0.8px;'>&#9656; DEFENSES & SCREENS</b>")
                lbl.setStyleSheet("margin-top: 10px; margin-bottom: 4px; padding-left: 2px;")
                items_layout.addWidget(lbl)
                for c in defenses:
                    card = ComponentCardWidget(c)
                    card.clicked.connect(lambda comp=c, idx=h_idx: self._edit_component(comp, idx))
                    card.removed.connect(lambda comp=c, idx=h_idx: self._remove_component(comp, idx))
                    items_layout.addWidget(card)

            # Other Components (Sensors, Consoles, Facilities, Life Support, Fittings)
            others = [c for c in hull.components if not c.isAccommodation and not c.isWeapon and not c.isDefense]
            if others:
                lbl = QLabel("<b style='color:#a371f7; font-size:15px; font-weight:bold; letter-spacing:0.8px;'>&#9656; EQUIPMENT & FITTINGS</b>")
                lbl.setStyleSheet("margin-top: 10px; margin-bottom: 4px; padding-left: 2px;")
                items_layout.addWidget(lbl)
                for c in others:
                    card = ComponentCardWidget(c)
                    card.clicked.connect(lambda comp=c, idx=h_idx: self._edit_component(comp, idx))
                    card.removed.connect(lambda comp=c, idx=h_idx: self._remove_component(comp, idx))
                    items_layout.addWidget(card)

            if not hull.drives and not hull.components:
                empty_sub = QLabel("<i>Subhull is empty. Select components from the left palette to install.</i>")
                empty_sub.setStyleSheet("color: #6e7681; font-size: 13px; padding: 8px;")
                items_layout.addWidget(empty_sub)

            h_layout.addLayout(items_layout)
            self.container_layout.addWidget(hull_box)

        self.container_layout.addStretch()

    def _select_hull(self, idx: int):
        self.selected_hull_idx = idx
        self.subhull_selected.emit(idx)
        self.refresh()

    def _on_add_subhull(self):
        dlg = HullDialog(base_tl=self.ship.baseTL, is_pod_default=False, parent=self)
        if dlg.exec() and dlg.result_subhull:
            self.ship.subhulls.append(dlg.result_subhull)
            self.refresh()
            self.ship_modified.emit()

    def _on_add_pod(self):
        dlg = HullDialog(base_tl=self.ship.baseTL, is_pod_default=True, parent=self)
        if dlg.exec() and dlg.result_subhull:
            self.ship.subhulls.append(dlg.result_subhull)
            self.refresh()
            self.ship_modified.emit()

    def _edit_hull(self, idx: int):
        sub = self.ship.subhulls[idx]
        dlg = HullDialog(subhull=sub, base_tl=self.ship.baseTL, parent=self)
        if dlg.exec():
            self.refresh()
            self.ship_modified.emit()

    def _remove_hull(self, idx: int):
        if len(self.ship.subhulls) <= 1:
            QMessageBox.warning(self, "Cannot Remove", "Starship must have at least one subhull.")
            return
        del self.ship.subhulls[idx]
        if self.selected_hull_idx >= len(self.ship.subhulls):
            self.selected_hull_idx = max(0, len(self.ship.subhulls) - 1)
        self.refresh()
        self.ship_modified.emit()

    def _edit_drive(self, h_idx: int, d_idx: int):
        drive = self.ship.subhulls[h_idx].drives[d_idx]
        dlg = DriveDialog(drive=drive, base_tl=self.ship.baseTL, parent=self)
        if dlg.exec():
            self.refresh()
            self.ship_modified.emit()

    def _remove_drive(self, h_idx: int, d_idx: int):
        del self.ship.subhulls[h_idx].drives[d_idx]
        self.refresh()
        self.ship_modified.emit()

    def _edit_component(self, comp: ComponentItem, h_idx: int):
        if comp.isWeapon:
            dlg = WeaponDialog(comp.extra.get("weaponKey", "BeamLaser"), comp=comp, base_tl=self.ship.baseTL, parent=self)
        else:
            cat = "accommodation" if comp.isAccommodation else ("facility" if comp.isFacility else ("life_support" if comp.isLifeSupport else "fitting"))
            key = comp.extra.get("accommodationKey") or comp.extra.get("facilityKey") or comp.extra.get("lifeSupportKey") or comp.name
            dlg = GenericComponentDialog(category=cat, item_key=key, comp=comp, base_tl=self.ship.baseTL, parent=self)
        
        if dlg.exec():
            self.refresh()
            self.ship_modified.emit()

    def _remove_component(self, comp: ComponentItem, h_idx: int):
        sub = self.ship.subhulls[h_idx]
        if comp in sub.components:
            sub.components.remove(comp)
            self.refresh()
            self.ship_modified.emit()
