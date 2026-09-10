"""
T5 Starship Construction: Hierarchy Tree Editor Widget.
Visualizes the starship structure (Subhulls, Pods, Drives, Equipment) with context actions.
"""
from typing import Optional
from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QTreeWidget, QTreeWidgetItem,
    QPushButton, QLabel, QHeaderView, QMenu, QInputDialog, QMessageBox
)
from ship_helper.models.ship import ShipDesign, SubhullItem, DriveItem, ComponentItem

class ShipTreeEditorWidget(QWidget):
    """Interactive hierarchy tree showing installed subhulls and starship systems."""
    selection_changed = Signal(str, int, int, object)  # (item_type: 'subhull'|'drive'|'component', subhull_idx, item_idx, obj)
    ship_modified = Signal()

    def __init__(self, ship: ShipDesign, parent=None):
        super().__init__(parent)
        self.ship = ship
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(4, 4, 4, 4)
        layout.setSpacing(6)

        # Header Bar
        hdr_layout = QHBoxLayout()
        hdr_layout.setContentsMargins(0, 0, 0, 0)
        hdr_layout.setSpacing(6)

        title_label = QLabel("<b>Installed Systems</b>")
        title_label.setStyleSheet("color: #58a6ff; font-size: 12px;")
        hdr_layout.addWidget(title_label)
        hdr_layout.addStretch()

        self.add_subhull_btn = QPushButton("+ Subhull")
        self.add_subhull_btn.setStyleSheet("padding: 3px 8px; font-size: 11px;")
        self.add_subhull_btn.clicked.connect(self._on_add_subhull)
        hdr_layout.addWidget(self.add_subhull_btn)

        self.add_pod_btn = QPushButton("+ Pod")
        self.add_pod_btn.setStyleSheet("padding: 3px 8px; font-size: 11px;")
        self.add_pod_btn.clicked.connect(self._on_add_pod)
        hdr_layout.addWidget(self.add_pod_btn)

        layout.addLayout(hdr_layout)

        # Tree View
        self.tree = QTreeWidget()
        self.tree.setHeaderLabels(["Component / System", "Tons", "Cost (MCr)", "Details", "TL"])
        self.tree.setContextMenuPolicy(Qt.CustomContextMenu)
        self.tree.customContextMenuRequested.connect(self._show_context_menu)
        self.tree.currentItemChanged.connect(self._on_current_item_changed)
        self.tree.setAlternatingRowColors(True)
        
        # Header sizing & column default widths
        header = self.tree.header()
        header.setStretchLastSection(False)
        header.setSectionResizeMode(0, QHeaderView.Interactive)
        header.setSectionResizeMode(1, QHeaderView.Interactive)
        header.setSectionResizeMode(2, QHeaderView.Interactive)
        header.setSectionResizeMode(3, QHeaderView.Interactive)
        header.setSectionResizeMode(4, QHeaderView.Interactive)
        
        self.tree.setColumnWidth(0, 240)
        self.tree.setColumnWidth(1, 65)
        self.tree.setColumnWidth(2, 75)
        self.tree.setColumnWidth(3, 130)
        self.tree.setColumnWidth(4, 50)

        layout.addWidget(self.tree)
        self.refresh()

    def set_ship(self, ship: ShipDesign):
        self.ship = ship
        self.refresh()

    def refresh(self):
        self.tree.blockSignals(True)
        self.tree.clear()

        for s_idx, subhull in enumerate(self.ship.subhulls):
            pod_label = " [Pod]" if subhull.isPod else ""
            armor_label = f" | {subhull.armorType} ({subhull.armorLayers}L)" if subhull.armorLayers > 0 else ""
            sub_item = QTreeWidgetItem(self.tree, [
                f"{subhull.name}{pod_label} ({subhull.config})",
                f"{subhull.tons:.1f}t",
                "-",
                f"Armor: {subhull.armorType}{armor_label}",
                f"TL-{subhull.tl}"
            ])
            sub_item.setData(0, Qt.UserRole, ("subhull", s_idx, -1, subhull))
            sub_item.setExpanded(True)

            # Drives Group
            if subhull.drives:
                drives_group = QTreeWidgetItem(sub_item, ["Drives & Power Systems", "", "", "", ""])
                drives_group.setExpanded(True)
                for d_idx, drive in enumerate(subhull.drives):
                    d_item = QTreeWidgetItem(drives_group, [
                        f"{drive.driveType} Type {drive.driveClass} ({drive.stage})",
                        f"{drive.tons:.1f}t",
                        f"{drive.cost:.2f}",
                        f"EP: {drive.ep}",
                        f"TL-{drive.tl}"
                    ])
                    d_item.setData(0, Qt.UserRole, ("drive", s_idx, d_idx, drive))

            # Components Group
            if subhull.components:
                comps_group = QTreeWidgetItem(sub_item, ["Installed Equipment", "", "", "", ""])
                comps_group.setExpanded(True)
                for c_idx, comp in enumerate(subhull.components):
                    tag = "Weapon" if comp.isWeapon else ("Defense" if comp.isDefense else ("Sensor" if comp.isSensor else ("Accom" if comp.isAccommodation else ("Facility" if comp.isFacility else "Fitting"))))
                    c_item = QTreeWidgetItem(comps_group, [
                        comp.name,
                        f"{comp.tons:.1f}t",
                        f"{comp.cost:.3f}",
                        f"[{tag}]",
                        f"TL-{comp.tl}"
                    ])
                    c_item.setData(0, Qt.UserRole, ("component", s_idx, c_idx, comp))

        self.tree.blockSignals(False)

    def get_selected_subhull_index(self) -> int:
        curr = self.tree.currentItem()
        if not curr:
            return 0 if self.ship.subhulls else -1
        data = curr.data(0, Qt.UserRole)
        if data:
            return data[1]
        return 0 if self.ship.subhulls else -1

    def _on_current_item_changed(self, current, previous):
        if not current:
            return
        data = current.data(0, Qt.UserRole)
        if data:
            item_type, s_idx, i_idx, obj = data
            self.selection_changed.emit(item_type, s_idx, i_idx, obj)

    def _show_context_menu(self, pos):
        item = self.tree.itemAt(pos)
        menu = QMenu(self)

        if item:
            data = item.data(0, Qt.UserRole)
            if data:
                item_type, s_idx, i_idx, obj = data
                if item_type == "subhull":
                    menu.addAction("Rename Subhull...", lambda: self._rename_subhull(s_idx))
                    menu.addAction("Duplicate Subhull", lambda: self._duplicate_subhull(s_idx))
                    menu.addSeparator()
                    if len(self.ship.subhulls) > 1:
                        menu.addAction("Delete Subhull", lambda: self._delete_subhull(s_idx))
                elif item_type in ("drive", "component"):
                    menu.addAction("Duplicate Item", lambda: self._duplicate_item(item_type, s_idx, i_idx))
                    menu.addAction("Move Up", lambda: self._move_item(item_type, s_idx, i_idx, -1))
                    menu.addAction("Move Down", lambda: self._move_item(item_type, s_idx, i_idx, 1))
                    menu.addSeparator()
                    menu.addAction("Delete Item", lambda: self._delete_item(item_type, s_idx, i_idx))

        menu.addSeparator()
        menu.addAction("+ Add New Subhull", self._on_add_subhull)
        menu.addAction("+ Add New External Pod", self._on_add_pod)
        menu.exec(self.tree.viewport().mapToGlobal(pos))

    def _on_add_subhull(self):
        new_h = SubhullItem(
            name=f"Subhull {len(self.ship.subhulls) + 1}",
            tons=100.0,
            tl=self.ship.baseTL,
            config="Streamlined",
            isHull=True,
            isPod=False,
            armorType="Polymer",
            armorLayers=1
        )
        self.ship.subhulls.append(new_h)
        self.refresh()
        self.ship_modified.emit()

    def _on_add_pod(self):
        new_p = SubhullItem(
            name=f"External Pod {len(self.ship.subhulls) + 1}",
            tons=20.0,
            tl=self.ship.baseTL,
            config="Streamlined",
            isHull=False,
            isPod=True,
            armorType="Polymer",
            armorLayers=1
        )
        self.ship.subhulls.append(new_p)
        self.refresh()
        self.ship_modified.emit()

    def _rename_subhull(self, s_idx: int):
        sub = self.ship.subhulls[s_idx]
        text, ok = QInputDialog.getText(self, "Rename Subhull", "Enter subhull name:", text=sub.name)
        if ok and text.strip():
            sub.name = text.strip()
            self.refresh()
            self.ship_modified.emit()

    def _duplicate_subhull(self, s_idx: int):
        sub = self.ship.subhulls[s_idx]
        import copy
        new_sub = copy.deepcopy(sub)
        new_sub.name = f"{sub.name} (Copy)"
        self.ship.subhulls.append(new_sub)
        self.refresh()
        self.ship_modified.emit()

    def _delete_subhull(self, s_idx: int):
        if len(self.ship.subhulls) <= 1:
            QMessageBox.warning(self, "Cannot Delete", "Ship must have at least one subhull.")
            return
        del self.ship.subhulls[s_idx]
        self.refresh()
        self.ship_modified.emit()

    def _duplicate_item(self, item_type: str, s_idx: int, i_idx: int):
        sub = self.ship.subhulls[s_idx]
        import copy
        if item_type == "drive":
            sub.drives.append(copy.deepcopy(sub.drives[i_idx]))
        elif item_type == "component":
            sub.components.append(copy.deepcopy(sub.components[i_idx]))
        self.refresh()
        self.ship_modified.emit()

    def _move_item(self, item_type: str, s_idx: int, i_idx: int, direction: int):
        sub = self.ship.subhulls[s_idx]
        target_list = sub.drives if item_type == "drive" else sub.components
        new_idx = i_idx + direction
        if 0 <= new_idx < len(target_list):
            target_list[i_idx], target_list[new_idx] = target_list[new_idx], target_list[i_idx]
            self.refresh()
            self.ship_modified.emit()

    def _delete_item(self, item_type: str, s_idx: int, i_idx: int):
        sub = self.ship.subhulls[s_idx]
        if item_type == "drive":
            del sub.drives[i_idx]
        elif item_type == "component":
            del sub.components[i_idx]
        self.refresh()
        self.ship_modified.emit()
