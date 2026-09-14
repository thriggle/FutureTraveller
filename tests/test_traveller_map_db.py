"""
Unit tests for Traveller Map SQLite Database integration and Homeworld Dialog.
"""
import unittest
from core.traveller_map_db import get_traveller_map_db, parse_trade_codes, STANDARD_T5_TRADE_CODES
from PySide6.QtWidgets import QApplication
from character_gen.ui.dialogs.homeworld_dialog import HomeworldDialog


class TestTravellerMapDB(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = QApplication.instance()
        if cls.app is None:
            cls.app = QApplication([])
        cls.db = get_traveller_map_db()

    def test_database_connection_and_stats(self):
        self.assertTrue(self.db.is_available())
        milieux = self.db.get_milieux()
        self.assertIn("M1105", milieux)
        self.assertIn("M0", milieux)
        self.assertIn("M1900", milieux)

    def test_get_sectors(self):
        sectors = self.db.get_sectors("M1105")
        self.assertGreater(len(sectors), 200)
        sec_names = [s["name"] for s in sectors]
        self.assertIn("Spinward Marches", sec_names)
        self.assertIn("Solomani Rim", sec_names)

    def test_get_worlds_in_sector(self):
        worlds = self.db.get_worlds_in_sector("Spinward Marches", "M1105")
        self.assertGreater(len(worlds), 400)
        regina = next((w for w in worlds if w["name"] == "Regina"), None)
        self.assertIsNotNone(regina)
        self.assertEqual(regina["hex"], "1910")
        self.assertEqual(regina["uwp"], "A788899-C")
        self.assertIn("Ri", regina["trade_codes"])

    def test_search_worlds(self):
        results = self.db.search_worlds("Terra", "M1105")
        self.assertGreater(len(results), 0)
        terra = next((w for w in results if w["name"] == "Terra" and w["sector_name"] == "Solomani Rim"), None)
        self.assertIsNotNone(terra)
        self.assertEqual(terra["hex"], "1827")

    def test_get_random_world(self):
        world = self.db.get_random_world("M1105")
        self.assertIsNotNone(world)
        self.assertIn("name", world)
        self.assertIn("uwp", world)
        self.assertIn("trade_codes", world)

    def test_parse_trade_codes(self):
        remarks = "Ri Pa Ph An Cp (Amindii)2 Varg0 Asla0 Sa Ht"
        codes = parse_trade_codes(remarks)
        self.assertIn("Ri", codes)
        self.assertIn("Ht", codes)

    def test_homeworld_dialog_instantiation(self):
        dlg = HomeworldDialog(
            current_name="Regina",
            current_uwp="A788899-C",
            current_codes=["Ri", "Ht"],
            current_sector="Spinward Marches",
            current_hex="1910"
        )
        self.assertEqual(dlg.homeworld_name, "Regina")
        self.assertEqual(dlg.homeworld_hex, "1910")
        data = dlg.get_homeworld_data()
        self.assertEqual(data["name"], "Regina")
        self.assertEqual(data["hex"], "1910")
        dlg.close()


if __name__ == "__main__":
    unittest.main()
