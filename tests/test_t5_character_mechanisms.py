"""
Comprehensive verification tests for T5 Character Creator rules and mechanisms,
matching Traveller/T5Character.html and Traveller/js/character.js.
"""
import unittest
from core.dice import get_roller
from character_gen.models.character import T5Character
from character_gen.models.career import get_career_catalog, CAREER_LIST
from character_gen.engine.dialog_handler import DialogHandler
from character_gen.engine.person import PersonEngine


class TestT5CharacterMechanisms(unittest.TestCase):
    def setUp(self):
        self.roller = get_roller(seed="t5_mech_test_seed")
        self.dialog = DialogHandler(headless=True, roller=self.roller)

    def test_initial_qualifications(self):
        char = T5Character()
        char.characteristics = [
            {"name": "Strength", "value": 7, "mod": 0},
            {"name": "Dexterity", "value": 7, "mod": 0},
            {"name": "Endurance", "value": 7, "mod": 0},
            {"name": "Intellect", "value": 7, "mod": 0},
            {"name": "Education", "value": 7, "mod": 0},
            {"name": "Social Standing", "value": 7, "mod": 0}
        ]
        quals = char.get_qualifications()

        # Citizen allowed on term 1
        self.assertTrue(quals["Citizen"])
        # Craftsman not allowed without 2x Skill-6 and Craftsman-1
        self.assertFalse(quals["Craftsman"])
        # Noble not allowed with Soc 7 (needs Soc 11+)
        self.assertFalse(quals["Noble"])
        # Functionary not allowed on term 1 (requires prior career)
        self.assertFalse(quals["Functionary"])
        # Standard service careers allowed
        self.assertTrue(quals["Scout"])
        self.assertTrue(quals["Merchant"])
        self.assertTrue(quals["Spacer"])
        self.assertTrue(quals["Soldier"])
        self.assertTrue(quals["Marine"])
        self.assertTrue(quals["Agent"])
        self.assertTrue(quals["Rogue"])

    def test_craftsman_qualification_rules(self):
        char = T5Character()
        char.careers = [{"career": "Citizen", "terms": 1}]
        char.characteristics = [{"name": "Strength", "value": 7} for _ in range(6)]

        # No skills -> fails
        self.assertFalse(char.get_qualifications()["Craftsman"])

        # Add 1 Skill-6 -> still fails
        char.add_skill("Electronics", level=6)
        char.add_skill("Craftsman", level=1)
        self.assertFalse(char.get_qualifications()["Craftsman"])

        # Add 2nd Skill-6 -> qualifies!
        char.add_skill("Mechanic", level=6)
        self.assertTrue(char.get_qualifications()["Craftsman"])

    def test_noble_social_standing_threshold(self):
        char = T5Character()
        char.characteristics[5]["value"] = 10
        self.assertFalse(char.get_qualifications()["Noble"])

        char.characteristics[5]["value"] = 11
        self.assertTrue(char.get_qualifications()["Noble"])

    def test_military_commission_lockout(self):
        char = T5Character()
        char.awards.append("Navy Officer1")
        quals = char.get_qualifications()

        # Only Spacer should be allowed among service careers
        self.assertTrue(quals["Spacer"])
        self.assertFalse(quals["Soldier"])
        self.assertFalse(quals["Marine"])
        self.assertFalse(quals["Scout"])
        self.assertFalse(quals["Merchant"])
        self.assertFalse(quals["Citizen"])
        self.assertFalse(quals["Agent"])

    def test_education_ed5_and_apprenticeship(self):
        char = T5Character()
        char.characteristics[4]["value"] = 3  # EDU = 3
        char.age = 18
        engine = PersonEngine(char, self.roller, self.dialog)

        # ED5 increases EDU to 5 and age to 19
        engine.resolve_education("ED5")
        self.assertEqual(char.characteristics[4]["value"], 5)
        self.assertEqual(char.age, 19)

    def test_college_and_ba_degree(self):
        char = T5Character()
        char.characteristics = [{"name": f"C{i+1}", "value": 11, "mod": 0} for i in range(6)]
        char.age = 18
        engine = PersonEngine(char, self.roller, self.dialog)

        engine.resolve_education("College")
        self.assertEqual(char.age, 22)
        self.assertTrue(any("BA" in a for a in char.awards))
        self.assertGreater(len(char.majors), 0)
        self.assertGreater(len(char.minors), 0)

    def test_merchant_ship_shares(self):
        char = T5Character()
        char.characteristics = [{"name": f"C{i}", "value": 10, "mod": 0} for i in range(6)]
        engine = PersonEngine(char, self.roller, self.dialog)

        # Run 3 terms of Merchant
        for _ in range(3):
            engine.resolve_career("Merchant")

        # Mustering out gives benefits
        engine.muster_out()
        self.assertTrue(char.mustered_out)
        self.assertGreaterEqual(char.ship_shares, 0)
        self.assertGreaterEqual(char.credits, 0)

    def test_aging_and_pension(self):
        char = T5Character()
        char.age = 62
        char.careers = [{"career": "Spacer", "terms": 10}]
        engine = PersonEngine(char, self.roller, self.dialog)

        # Advance terms to age 66
        engine.resolve_career("Spacer")
        self.assertGreaterEqual(char.age, 66)

        # Muster out at age 66+ should grant pension
        engine.muster_out()
        self.assertTrue(any("Pension" in a for a in char.awards))

    def test_web_json_export_import_fidelity(self):
        char = T5Character(name="Commodore Brand", age=42)
        char.init_default_skills()
        char.add_skill("Gunner", level=2, knowledge="Turrets")
        char.add_skill("Leadership", level=3)
        char.credits = 120000
        char.ship_shares = 4
        char.awards = ["Navy Officer4", "MCUF", "Pension Cr20000"]

        data = char.to_dict()
        self.assertEqual(data["name"], "Commodore Brand")
        self.assertEqual(data["credits"], 120000)
        self.assertEqual(data["shipShares"], 4)
        self.assertEqual(data["skills"]["Leadership"]["Skill"], 3)
        self.assertEqual(data["skills"]["Gunner"]["Knowledge"]["Turrets"], 2)

        restored = T5Character.from_dict(data)
        self.assertEqual(restored.name, char.name)
        self.assertEqual(restored.credits, 120000)
        self.assertEqual(restored.ship_shares, 4)
        self.assertEqual(restored.skills["Leadership"].level, 3)
        self.assertEqual(restored.skills["Gunner"].knowledges["Turrets"], 2)


    def test_all_13_careers_execution(self):
        """Verify that all 13 careers can run and muster out without error."""
        all_careers = [
            "Craftsman", "Scholar", "Entertainer", "Citizen",
            "Scout", "Merchant", "Spacer", "Soldier",
            "Marine", "Agent", "Rogue", "Noble", "Functionary"
        ]
        for car_name in all_careers:
            char = T5Character(name=f"Tester {car_name}")
            char.characteristics = [{"name": f"C{i+1}", "value": 11, "mod": 0} for i in range(6)]
            if car_name == "Craftsman":
                char.add_skill("Electronics", level=6)
                char.add_skill("Mechanic", level=6)
                char.add_skill("Craftsman", level=1)
            elif car_name == "Functionary":
                char.careers = [{"career": "Citizen", "terms": 1}]

            engine = PersonEngine(char, self.roller, self.dialog)
            success = engine.resolve_career(car_name)
            self.assertGreater(len(char.careers), 0)
            engine.muster_out()
            self.assertTrue(char.mustered_out)

    def test_homeworld_trade_code_skills(self):
        """Verify homeworld trade codes award appropriate background skills."""
        char = T5Character()
        char.homeworld_trade_codes = ["Ag", "Ri", "Va"]
        engine = PersonEngine(char, self.roller, self.dialog)
        engine.gain_skills_from_homeworld_trade_codes(["Ag", "Ri", "Va"])
        # Should have received skills
        self.assertGreater(len(char.skills), 0)

    def test_all_education_programs(self):
        """Verify all youth education programs run properly."""
        programs = [
            "Apprenticeship", "Trade School", "Training Course",
            "College", "University", "Military Academy", "Naval Academy",
            "Masters", "Professors", "Medical School", "Law School"
        ]
        for prog in programs:
            char = T5Character()
            char.characteristics = [{"name": f"C{i+1}", "value": 12, "mod": 0} for i in range(6)]
            char.age = 18
            if prog in ["Masters", "Professors"]:
                char.awards.append("BA")
            elif prog == "Medical School":
                char.majors.append({"skill": "Biologics", "knowledge": None})
            elif prog == "Law School":
                char.majors.append({"skill": "Advocate", "knowledge": None})

            engine = PersonEngine(char, self.roller, self.dialog)
            engine.resolve_education(prog)
            self.assertGreaterEqual(char.age, 18)


if __name__ == "__main__":
    unittest.main()
