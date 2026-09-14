"""
Generic selection dialog for T5 Character choices.
"""
from typing import List, Optional
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QListWidget,
    QListWidgetItem, QPushButton, QLineEdit
)
from PySide6.QtCore import Qt


class ChoiceDialog(QDialog):
    """Modal dialog allowing the user to select an option from a list."""
    def __init__(self, title: str, prompt: str, options: List[str], parent=None):
        super().__init__(parent)
        self.setWindowTitle(title)
        self.resize(420, 360)
        self.selected_option: Optional[str] = None
        self.options = options
        self.setStyleSheet("""
            QDialog {
                background-color: #0d1117;
                color: #c9d1d9;
            }
            QLabel {
                color: #f0f6fc;
                font-size: 13px;
            }
            QLineEdit {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #f0f6fc;
                padding: 6px;
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
                background-color: #1f6feb;
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
            QPushButton#primaryBtn:hover {
                background-color: #2ea043;
            }
        """)

        layout = QVBoxLayout(self)
        layout.setSpacing(10)
        layout.setContentsMargins(14, 14, 14, 14)

        prompt_lbl = QLabel(prompt)
        prompt_lbl.setWordWrap(True)
        layout.addWidget(prompt_lbl)

        self.filter_input = QLineEdit()
        self.filter_input.setPlaceholderText("Filter options...")
        self.filter_input.textChanged.connect(self._filter_items)
        layout.addWidget(self.filter_input)

        self.list_widget = QListWidget()
        self.list_widget.itemDoubleClicked.connect(self.accept)
        layout.addWidget(self.list_widget)

        self._populate_list(options)

        btn_layout = QHBoxLayout()
        btn_layout.addStretch()
        
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_layout.addWidget(cancel_btn)

        self.ok_btn = QPushButton("Select")
        self.ok_btn.setObjectName("primaryBtn")
        self.ok_btn.clicked.connect(self._on_accept)
        btn_layout.addWidget(self.ok_btn)

        layout.addLayout(btn_layout)

    def _populate_list(self, items: List[str]):
        self.list_widget.clear()
        for item in items:
            it = QListWidgetItem(item)
            self.list_widget.addItem(it)
        if self.list_widget.count() > 0:
            self.list_widget.setCurrentRow(0)

    def _filter_items(self, text: str):
        search = text.lower()
        filtered = [opt for opt in self.options if search in opt.lower()]
        self._populate_list(filtered)

    def _on_accept(self):
        curr = self.list_widget.currentItem()
        if curr:
            self.selected_option = curr.text()
            self.accept()
        else:
            self.reject()
