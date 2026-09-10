"""
Unit test suite for T5 Mission Codes and Jump Field Astrogation.
"""
import unittest
from ship_helper.models.ship import (
    ShipDesign, SubhullItem, DriveItem, ENUM_MISSION_LIST, ENUM_MODIFIERS_LIST,
    ENUM_MODIFIER_WORD_OPTIONS, ENUM_JUMP_FIELDS
)
from ship_helper.engine.ship_engine import ShipCalculator

class TestMissionAndAstrogation(unittest.TestCase):
    def test_mission_classification_and_modifiers(self):
        # Far Trader (Commerce -> Merchant -> UnScheduled -> Cargo -> Trader [A], Modifier 1: Far [F])
        ship = ShipDesign(
            missionId=23,
            missionService="Commerce",
            missionActivity="Merchant",
            missionType="UnScheduled",
            missionQualifier="Cargo",
            missionName="Trader",
            missionCodeKey="A",
            modifier1Word="Far",
            modifier1Code="F"
        )
        self.assertEqual(ship.missionCode, "AF")
        self.assertEqual(ship.missionFullTitle, "Far Trader")

        # Armed Far Trader (Modifier 1: Far [F], Modifier 2: Armored [A])
        ship.modifier2Word = "Armored"
        ship.modifier2Code = "A"
        self.assertEqual(ship.missionCode, "AFA")
        self.assertEqual(ship.missionFullTitle, "Far Armored Trader")

    def test_jump_fields_table_07g(self):
        ship = ShipDesign(baseTL=13, jumpFieldKey="Bubble")
        hull = SubhullItem(name="Main Hull", tons=200.0, tl=13, config="Streamlined")
        hull.drives.append(DriveItem(ep=2.0, tons=10.0, cost=20.0, stage="Standard", driveClass="B", driveType="Jump", tl=13))
        ship.subhulls.append(hull)

        calc = ShipCalculator(ship)

        # Bubble (Strength 100, Standard Stage Eff 1.0) with Engineer 3 + Jump Spec 1 (Total 4)
        safe_bubble = calc.safe_jump_distance(engineer_skill=3, jump_specialty=1)
        self.assertEqual(safe_bubble["strength"], 100)
        self.assertEqual(safe_bubble["totalEngineerSkill"], 4)
        self.assertEqual(safe_bubble["D"], 96.0)

        # Grid Field (Strength 80)
        ship.jumpFieldKey = "Grid"
        safe_grid = calc.safe_jump_distance(engineer_skill=3, jump_specialty=1)
        self.assertEqual(safe_grid["strength"], 80)
        self.assertEqual(safe_grid["D"], 76.0)

        # Plates Field (Strength 140)
        ship.jumpFieldKey = "Plates"
        safe_plates = calc.safe_jump_distance(engineer_skill=3, jump_specialty=1)
        self.assertEqual(safe_plates["strength"], 140)
        self.assertEqual(safe_plates["D"], 136.0)

    def test_misjump_risk_interference(self):
        ship = ShipDesign(baseTL=13, jumpFieldKey="Bubble")
        hull = SubhullItem(name="Main Hull", tons=200.0, tl=13, config="Streamlined")
        hull.drives.append(DriveItem(ep=2.0, tons=10.0, cost=20.0, stage="Standard", driveClass="B", driveType="Jump", tl=13))
        ship.subhulls.append(hull)
        calc = ShipCalculator(ship)

        # Jumping at safe distance (D=100) -> X = 0.0
        intf_safe = calc.jump_interference(engineer_skill=0, jump_specialty=0, actual_diameters=100.0, gravity_flux=0.0)
        self.assertEqual(intf_safe["X"], 0.0)
        self.assertEqual(intf_safe["riskClass"], "good")

        # Jumping dangerously close (e.g. 10 Diameters when safe is 100) -> X = 90.0 (Critical Hazard)
        intf_danger = calc.jump_interference(engineer_skill=0, jump_specialty=0, actual_diameters=10.0, gravity_flux=0.0)
        self.assertEqual(intf_danger["X"], 90.0)
        self.assertEqual(intf_danger["riskClass"], "warning")
        self.assertIn("Critical Hazard", intf_danger["misjumpRisk"])

if __name__ == "__main__":
    unittest.main()
