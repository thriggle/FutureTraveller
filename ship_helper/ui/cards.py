"""
T5 Starship Construction: Card Widgets for Subhulls and Installed Equipment.
Faithful reproduction of the component cards in the web version.
"""
from typing import Optional, Callable
from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QRadioButton, QFrame
)
from ship_helper.models.ship import SubhullItem, DriveItem, ComponentItem

class ComponentCardWidget(QFrame):
    """Interactive card widget representing an installed equipment item."""
    clicked = Signal()
    removed = Signal()

    def __init__(self, comp: ComponentItem, parent=None):
        super().__init__(parent)
        self.comp = comp
        self.setFrameShape(QFrame.StyledPanel)
        self.setCursor(Qt.PointingHandCursor)
        self.setStyleSheet("""
            QFrame {
                background-color: #161b22;
                border: none;
                border-radius: 5px;
                padding: 4px 8px;
            }
            QFrame:hover {
                background-color: #1f242c;
            }
        """)
        self.init_ui()

    def init_ui(self):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(8, 6, 8, 6)
        layout.setSpacing(8)

        # Info Layout
        info_layout = QVBoxLayout()
        info_layout.setSpacing(2)

        # Title + Badges
        title_box = QHBoxLayout()
        title_box.setSpacing(6)

        title_lbl = QLabel(f"<b>{self.comp.name}</b>")
        title_lbl.setStyleSheet("color: #f0f6fc; font-size: 13px;")
        title_box.addWidget(title_lbl)

        # Category/Role Badge
        tag = "Weapon" if self.comp.isWeapon else ("Defense" if self.comp.isDefense else ("Sensor" if self.comp.isSensor else ("Accommodation" if self.comp.isAccommodation else ("Facility" if self.comp.isFacility else "Fitting"))))
        tag_badge = QLabel(tag)
        tag_badge.setStyleSheet("background: #21262d; color: #58a6ff; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 3px; border: none;")
        title_box.addWidget(tag_badge)

        tl_badge = QLabel(f"TL-{self.comp.tl}")
        tl_badge.setStyleSheet("background: #21262d; color: #8b949e; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 3px; border: none;")
        title_box.addWidget(tl_badge)

        title_box.addStretch()
        info_layout.addLayout(title_box)

        # Details Row
        details_lbl = QLabel(f"MCr {self.comp.cost:.3f} &bull; {self.comp.tons:.1f} tons")
        details_lbl.setStyleSheet("color: #8b949e; font-size: 12px;")
        info_layout.addWidget(details_lbl)

        comment = self.comp.extra.get("comment", "")
        if comment:
            cmt_lbl = QLabel(f"<i>{comment}</i>")
            cmt_lbl.setStyleSheet("color: #8b949e; font-size: 11px;")
            info_layout.addWidget(cmt_lbl)

        layout.addLayout(info_layout, stretch=1)

        # Remove Button
        rm_btn = QPushButton("Remove")
        rm_btn.setStyleSheet("""
            QPushButton {
                background: #21262d;
                color: #f85149;
                border: none;
                border-radius: 3px;
                padding: 4px 10px;
                font-size: 12px;
                font-weight: bold;
            }
            QPushButton:hover {
                background: #da3633;
                color: white;
            }
        """)
        rm_btn.clicked.connect(self._on_remove_clicked)
        layout.addWidget(rm_btn)

    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            self.clicked.emit()
        super().mousePressEvent(event)

    def _on_remove_clicked(self):
        self.removed.emit()


class DriveCardWidget(QFrame):
    """Interactive card widget representing an installed Drive system."""
    clicked = Signal()
    removed = Signal()

    def __init__(self, drive: DriveItem, parent=None):
        super().__init__(parent)
        self.drive = drive
        self.setFrameShape(QFrame.StyledPanel)
        self.setCursor(Qt.PointingHandCursor)
        self.setStyleSheet("""
            QFrame {
                background-color: #161b22;
                border: none;
                border-radius: 5px;
                padding: 4px 8px;
            }
            QFrame:hover {
                background-color: #1f242c;
            }
        """)
        self.init_ui()

    def init_ui(self):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(8, 6, 8, 6)
        layout.setSpacing(8)

        info_layout = QVBoxLayout()
        info_layout.setSpacing(2)

        # Title Row
        title_box = QHBoxLayout()
        title_box.setSpacing(6)

        title_lbl = QLabel(f"<b>{self.drive.driveType} (Class {self.drive.driveClass})</b>")
        title_lbl.setStyleSheet("color: #f0f6fc; font-size: 13px;")
        title_box.addWidget(title_lbl)

        stg_badge = QLabel(self.drive.stage)
        stg_badge.setStyleSheet("background: #21262d; color: #3fb950; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 3px; border: none;")
        title_box.addWidget(stg_badge)

        tl_badge = QLabel(f"TL-{self.drive.tl}")
        tl_badge.setStyleSheet("background: #21262d; color: #8b949e; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 3px; border: none;")
        title_box.addWidget(tl_badge)

        title_box.addStretch()
        info_layout.addLayout(title_box)

        # Details
        details_lbl = QLabel(f"EP: {self.drive.ep} &bull; MCr {self.drive.cost:.3f} &bull; {self.drive.tons:.1f} tons")
        details_lbl.setStyleSheet("color: #8b949e; font-size: 12px;")
        info_layout.addWidget(details_lbl)

        layout.addLayout(info_layout, stretch=1)

        # Remove Button
        rm_btn = QPushButton("Remove")
        rm_btn.setStyleSheet("""
            QPushButton {
                background: #21262d;
                color: #f85149;
                border: none;
                border-radius: 3px;
                padding: 4px 10px;
                font-size: 12px;
                font-weight: bold;
            }
            QPushButton:hover {
                background: #da3633;
                color: white;
            }
        """)
        rm_btn.clicked.connect(self._on_remove_clicked)
        layout.addWidget(rm_btn)

    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            self.clicked.emit()
        super().mousePressEvent(event)

    def _on_remove_clicked(self):
        self.removed.emit()
