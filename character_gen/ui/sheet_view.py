"""
Live Character Sheet Preview View (Right Panel).
"""
from PySide6.QtWidgets import QWidget, QVBoxLayout, QTextBrowser
from character_gen.models.character import Character
from character_gen.exporters.sheet_renderer import render_character_html


class SheetView(QWidget):
    """Right panel showing a live updated rendered character sheet."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(4, 4, 4, 4)

        self.browser = QTextBrowser()
        self.browser.setOpenExternalLinks(False)
        self.browser.setStyleSheet("""
            QTextBrowser {
                background-color: #0d1117;
                border: 1px solid #30363d;
                border-radius: 6px;
            }
        """)
        layout.addWidget(self.browser)

    def update_character(self, character: Character):
        html = render_character_html(character)
        self.browser.setHtml(html)
