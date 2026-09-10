"""
Module entry point for launching the T5 Starship Construction Helper standalone.
Run via: python -m ship_helper
"""
import sys
from PySide6.QtWidgets import QApplication
from core.theme import apply_theme
from ship_helper.ui.main_window import ShipHelperMainWindow

def main():
    app = QApplication(sys.argv)
    apply_theme(app)
    win = ShipHelperMainWindow()
    win.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
