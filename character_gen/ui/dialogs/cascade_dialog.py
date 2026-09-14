"""
Cascade skill & knowledge specialty selector for T5.
"""
from typing import List, Optional, Tuple
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QListWidget,
    QListWidgetItem, QPushButton, QComboBox
)
from character_gen.models.skill import get_skill_catalog


class CascadeDialog(QDialog):
    """Dialog for choosing a specific knowledge specialty for a cascade skill."""
    def __init__(self, skill_name: str, parent=None):
        super().__init__(parent)
        self.setWindowTitle(f"Select Knowledge: {skill_name}")
        self.resize(380, 320)
        self.skill_name = skill_name
        self.selected_knowledge: Optional[str] = None
        
        catalog = get_skill_catalog()
        self.options = catalog.get_knowledges(skill_name)
        
        self.setStyleSheet("""
            QDialog {
                background-color: #0d1117;
                color: #c9d1d9;
            }
            QLabel {
                color: #f0f6fc;
                font-size: 13px;
            }
            QListWidget {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #f0f6fc;
                padding: 4px;
            }
            QListWidget::item {
                padding: 6px 10px;
                border-radius: 4px;
            }
            QListWidget::item:selected {
                background-color: #238636;
                color: #ffffff;
            }
            QPushButton {
                background-color: #21262d;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #c9d1d9;
                padding: 6px 14px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #30363d;
            }
            QPushButton#primaryBtn {
                background-color: #238636;
                color: #ffffff;
                border: none;
            }
        """)

        layout = QVBoxLayout(self)
        layout.setSpacing(10)
        layout.setContentsMargins(14, 14, 14, 14)

        layout.addWidget(QLabel(f"Choose a specific knowledge / specialty for <b>{skill_name}</b>:"))

        self.list_widget = QListWidget()
        for opt in self.options:
            self.list_widget.addItem(QListWidgetItem(opt))
        if self.list_widget.count() > 0:
            self.list_widget.setCurrentRow(0)
        self.list_widget.itemDoubleClicked.connect(self._on_accept)
        layout.addWidget(self.list_widget)

        btn_box = QHBoxLayout()
        btn_box.addStretch()
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_box.addWidget(cancel_btn)

        ok_btn = QPushButton("Select")
        ok_btn.setObjectName("primaryBtn")
        ok_btn.clicked.connect(self._on_accept)
        btn_box.addWidget(ok_btn)

        layout.addLayout(btn_box)

    def _on_accept(self):
        item = self.list_widget.currentItem()
        if item:
            self.selected_knowledge = item.text()
            self.accept()
        else:
            self.reject()
