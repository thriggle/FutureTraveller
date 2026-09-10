"""
Unit tests for Starship Catalog & Builder functions.
"""
import unittest
from ship_helper.engine.catalog import (
    build_accommodation, build_facility, build_life_support,
    build_weapon, build_defense, build_sensor, build_console, build_computer, build_hull_fitting
)
from ship_helper.engine.ship_engine import build_drive, ShipCalculator
from ship_helper.models.ship import ShipDesign, SubhullItem

class TestShipCatalog(unittest.TestCase):
    def test_build_accommodation(self):
        stateroom = build_accommodation("StandardStateroom", count=4, tl=13, assignment="Crew")
        self.assertTrue(stateroom.isAccommodation)
        self.assertEqual(stateroom.tons, 16.0)
        self.assertEqual(stateroom.cost, 2.0)
        self.assertEqual(stateroom.extra.get("occupants"), 4)

    def test_build_weapon(self):
        laser = build_weapon("BeamLaser", mount_key="T1", stage="Standard", count=2, tl=12)
        self.assertTrue(laser.isWeapon)
        self.assertEqual(laser.extra.get("count"), 2)
        self.assertEqual(laser.extra.get("hardpointReq"), 2)
        self.assertEqual(laser.extra.get("cp"), 2)

    def test_build_defense(self):
        damper = build_defense("NuclearDamper", mount_key="Bo", stage="Standard", count=1, tl=12)
        self.assertTrue(damper.isDefense)
        self.assertEqual(damper.extra.get("code"), "N")

    def test_build_facility_and_life_support(self):
        cargo = build_facility("StandardCargo", amount=120.0, tl=12)
        self.assertTrue(cargo.isFacility)
        self.assertEqual(cargo.tons, 120.0)

        ls = build_life_support("ExtendedLifeSupport", amount=5.0, tl=12)
        self.assertTrue(ls.isLifeSupport)
        self.assertEqual(ls.tons, 5.0)
        self.assertEqual(ls.extra.get("personDays"), 500)

    def test_full_ship_design_calculations(self):
        ship = ShipDesign(
            baseTL=13,
            shipName="Test Scout",
            missionId=31,
            missionName="Scout",
            missionCodeKey="S",
            modifier1Word="Express",
            modifier1Code="X"
        )
        hull = SubhullItem(name="Main Hull", tons=100.0, tl=13, config="Streamlined", armorType="Polymer", armorLayers=1)
        hull.drives.append(build_drive("Standard", 1, "A", "Jump", 13))
        hull.drives.append(build_drive("Standard", 1, "A", "M-Drive", 13))
        hull.drives.append(build_drive("Standard", 1, "A", "Power Plant", 13))
        hull.components.append(build_accommodation("StandardStateroom", 2, 13, "Crew"))
        hull.components.append(build_console("Bridge Console", 2.0, 0.5, 13, cp=2))
        hull.components.append(build_computer("Model/1", 1, 1.0, 2.0, 13))
        hull.components.append(build_facility("StandardCargo", 30.0, 13))
        ship.subhulls.append(hull)

        calc = ShipCalculator(ship)
        self.assertEqual(calc.total_tonnage, 100.0)
        self.assertEqual(calc.configuration_type, "Streamlined")
        self.assertEqual(calc.jump_rating, 1)
        self.assertGreater(calc.total_cost, 0.0)
        self.assertEqual(calc.total_crew_berths, 2)
        self.assertEqual(ship.missionCode, "SX")
        self.assertEqual(ship.missionFullTitle, "Express Scout")

        # Test Astrogation
        safe = calc.safe_jump_distance(engineer_skill=2, jump_specialty=1)
        self.assertTrue(safe["hasJumpDrive"])
        self.assertEqual(safe["strength"], 100)
        self.assertEqual(safe["totalEngineerSkill"], 3)
        self.assertEqual(safe["D"], 97.0)

        intf = calc.jump_interference(engineer_skill=2, jump_specialty=1, actual_diameters=97.0, gravity_flux=0.0)
        self.assertEqual(intf["X"], 0.0)
        self.assertEqual(intf["riskClass"], "good")

        # JSON Roundtrip
        json_str = ship.to_json()
        import json
        rebuilt = ShipDesign.from_dict(json.loads(json_str))
        self.assertEqual(rebuilt.shipName, "Test Scout")
        self.assertEqual(len(rebuilt.subhulls), 1)
        self.assertEqual(len(rebuilt.subhulls[0].drives), 3)

if __name__ == "__main__":
    unittest.main()
