"""
UI widget instantiation and signal tests for T5 Character Creator.
"""
import unittest
from PySide6.QtWidgets import QApplication
from character_gen.engine.character_engine import CharacterEngine
from character_gen.ui.character_stats_panel import CharacterStatsPanel
from character_gen.ui.wizard_view import WizardView
from character_gen.ui.sheet_view import SheetView
from character_gen.ui.career_log_widget import CareerLogWidget
from character_gen.ui.main_window import CharacterMainWindow


class TestCharacterUI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = QApplication.instance()
        if cls.app is None:
            cls.app = QApplication([])

    def test_character_stats_panel(self):
        panel = CharacterStatsPanel()
        engine = CharacterEngine()
        char = engine.start_new_character()
        panel.update_character(char)
        self.assertNotEqual(panel.name_label.text(), "")
        self.assertEqual(panel.upp_label.text(), char.upp)

    def test_wizard_view(self):
        engine = CharacterEngine()
        view = WizardView(engine)
        self.assertNotEqual(view.stage_title.text(), "")
        self.assertNotEqual(view.btn_action.text(), "")

    def test_sheet_view(self):
        view = SheetView()
        engine = CharacterEngine()
        char = engine.generate_full_character_automatically(terms=2)
        view.update_character(char)
        html = view.browser.toHtml()
        self.assertIn(char.name, html)
        self.assertIn(char.upp, html)

    def test_main_window(self):
        win = CharacterMainWindow()
        self.assertEqual(win.windowTitle(), "Traveller 5 — Character Creator")
        self.assertIsNotNone(win.stats_panel)
        self.assertIsNotNone(win.wizard_view)
        self.assertIsNotNone(win.sheet_view)
        self.assertIsNotNone(win.log_widget)
        win.close()


if __name__ == "__main__":
    unittest.main()
