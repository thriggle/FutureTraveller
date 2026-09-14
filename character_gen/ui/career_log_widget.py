"""
Chronicle / Roll Log Widget (Bottom Drawer).
"""
from PySide6.QtWidgets import QWidget, QVBoxLayout, QListWidget, QListWidgetItem, QLabel
from PySide6.QtCore import Qt


class CareerLogWidget(QWidget):
    """Bottom log displaying chronological events and dice rolls."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(6, 4, 6, 4)
        layout.setSpacing(4)

        header = QLabel("<b>Generation Chronicle & Roll Audit</b>")
        header.setStyleSheet("color: #8b949e; font-size: 11px; letter-spacing: 1px;")
        layout.addWidget(header)

        self.list_widget = QListWidget()
        self.list_widget.setStyleSheet("""
            QListWidget {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #c9d1d9;
                font-family: monospace;
                font-size: 11px;
                padding: 4px;
            }
            QListWidget::item {
                padding: 2px 4px;
            }
        """)
        layout.addWidget(self.list_widget)

    def add_log(self, text: str):
        item = QListWidgetItem(f"• {text}")
        self.list_widget.addItem(item)
        self.list_widget.scrollToBottom()

    def clear_logs(self):
        self.list_widget.clear()

    def set_logs(self, logs: list):
        self.list_widget.clear()
        for l in logs:
            self.list_widget.addItem(QListWidgetItem(f"• {l}"))
        self.list_widget.scrollToBottom()
