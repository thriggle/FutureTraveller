"""
Unit test verifying that ship_helper/engine matches reference main_hull_data.json.
"""
import json
import unittest
from pathlib import Path
from core.data_models import DATA_DIR
from ship_helper.models.ship import ShipDesign
from ship_helper.engine.ship_engine import ShipCalculator

class TestShipEngine(unittest.TestCase):
    def test_load_and_calculate_main_hull(self):
        with open(DATA_DIR / "main_hull_data.json", "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        
        ship = ShipDesign.from_dict(raw_data)
        calc = ShipCalculator(ship)

        self.assertEqual(calc.total_tonnage, 400.0)
        self.assertEqual(calc.configuration_type, "Airframe")
        self.assertEqual(calc.jump_rating, 1) # 720 EP // 400 = 1 (or derived)
        self.assertEqual(calc.maneuver_rating, 1) # 780 EP // 400 = 1
        self.assertGreater(calc.total_cost, 100.0)
        
        # Test JSON roundtrip
        exported = ship.to_dict()
        self.assertEqual(len(exported["subhulls"]), len(raw_data["subhulls"]))

if __name__ == "__main__":
    unittest.main()
