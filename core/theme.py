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
    font_family = "Segoe UI"
    bahnschrift_path = FONTS_DIR / "BAHNSCHRIFT.TTF"
    if bahnschrift_path.exists():
        font_id = QFontDatabase.addApplicationFont(str(bahnschrift_path))
        if font_id != -1:
            families = QFontDatabase.applicationFontFamilies(font_id)
            if families:
                font_family = families[0]

    optima_path = FONTS_DIR / "OPTIMA.TTF"
    if optima_path.exists():
        QFontDatabase.addApplicationFont(str(optima_path))

    # Set base font with valid point size
    base_font = QFont(font_family, 10)
    base_font.setPointSize(10)
    app.setFont(base_font)

    # Apply style with absolute icon paths
    qss_path = RESOURCES_DIR / "styles" / "dark_traveller.qss"
    if qss_path.exists():
        icons_dir = (RESOURCES_DIR / "icons").as_posix()
        with open(qss_path, "r", encoding="utf-8") as f:
            style = f.read().replace("{{ICONS_DIR}}", icons_dir)
            app.setStyleSheet(style)

