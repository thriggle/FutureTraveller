"""
UI test ensuring rapid species switching in WizardView and CharacterStatsPanel does not crash.
"""
import unittest
import sys
from PySide6.QtWidgets import QApplication
from character_gen.engine.character_engine import CharacterEngine
from character_gen.ui.wizard_view import WizardView
from character_gen.ui.character_stats_panel import CharacterStatsPanel
from character_gen.ui.sheet_view import SheetView
from character_gen.models.species import get_species_catalog

app = QApplication.instance() or QApplication(sys.argv)


class TestUISpeciesSwitch(unittest.TestCase):
    def test_rapid_species_switching(self):
        engine = CharacterEngine(seed="ui_switch_test")
        stats_panel = CharacterStatsPanel()
        sheet_view = SheetView()
        wizard_view = WizardView(engine)

        def sync():
            stats_panel.update_character(engine.character)
            sheet_view.update_character(engine.character)
            wizard_view.refresh_state()

        wizard_view.character_changed.connect(sync)
        sync()

        species_list = ["human", "aslan", "bwap", "ursa", "vargr", "zhodani"]
        for sp in species_list:
            idx = wizard_view.species_combo.findData(sp)
            self.assertGreaterEqual(idx, 0, f"Species {sp} not found in combo")
            wizard_view.species_combo.setCurrentIndex(idx)
            app.processEvents()
            self.assertEqual(engine.character.species_id, sp)

        # Switch back and forth multiple times
        for _ in range(3):
            for sp in species_list:
                idx = wizard_view.species_combo.findData(sp)
                wizard_view.species_combo.setCurrentIndex(idx)
                app.processEvents()

        # Check Ursa specific
        idx = wizard_view.species_combo.findData("ursa")
        wizard_view.species_combo.setCurrentIndex(idx)
        app.processEvents()
        self.assertEqual(engine.character.talent.get("name"), "Rage")
        self.assertFalse(stats_panel.talent_info.isHidden())
        self.assertIn("Rage", stats_panel.talent_info.text())


if __name__ == "__main__":
    unittest.main()
