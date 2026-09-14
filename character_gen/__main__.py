"""
Executable entrypoint for T5 Character Creator.
"""
import sys
from PySide6.QtWidgets import QApplication
from character_gen.ui.main_window import CharacterMainWindow
from core.theme import apply_theme


def main():
    app = QApplication(sys.argv)
    apply_theme(app)
    
    window = CharacterMainWindow()
    window.show()
    
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
