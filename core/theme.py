"""
Theme and font loader for PySide6 application.
"""
from pathlib import Path
from PySide6.QtGui import QFontDatabase, QFont
from PySide6.QtWidgets import QApplication

RESOURCES_DIR = Path(__file__).resolve().parent.parent / "resources"
FONTS_DIR = Path(__file__).resolve().parent.parent / "Traveller" / "fonts"

def apply_theme(app: QApplication):
    """Load Bahnschrift/Optima fonts and apply dark stylesheet with icon resolution."""
    # Load fonts
    bahnschrift_path = FONTS_DIR / "BAHNSCHRIFT.TTF"
    if bahnschrift_path.exists():
        QFontDatabase.addApplicationFont(str(bahnschrift_path))

    optima_path = FONTS_DIR / "OPTIMA.TTF"
    if optima_path.exists():
        QFontDatabase.addApplicationFont(str(optima_path))

    # Apply style with absolute icon paths
    qss_path = RESOURCES_DIR / "styles" / "dark_traveller.qss"
    if qss_path.exists():
        icons_dir = (RESOURCES_DIR / "icons").as_posix()
        with open(qss_path, "r", encoding="utf-8") as f:
            style = f.read().replace("{{ICONS_DIR}}", icons_dir)
            app.setStyleSheet(style)
