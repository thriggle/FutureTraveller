"""
Unit tests for T5 Character Data Models.
"""
import unittest
from character_gen.models.character import Character, Characteristic, TermRecord, to_hex_char, from_hex_char
from character_gen.models.species import get_species_catalog
from character_gen.models.skill import get_skill_catalog, DEFAULT_SKILLS
from character_gen.models.career import get_career_catalog, CAREER_LIST


class TestCharacterModels(unittest.TestCase):
    def test_hex_conversion(self):
        self.assertEqual(to_hex_char(0), "0")
        self.assertEqual(to_hex_char(7), "7")
        self.assertEqual(to_hex_char(10), "A")
        self.assertEqual(to_hex_char(15), "F")
        self.assertEqual(to_hex_char(16), "G")

        self.assertEqual(from_hex_char("0"), 0)
        self.assertEqual(from_hex_char("9"), 9)
        self.assertEqual(from_hex_char("A"), 10)
        self.assertEqual(from_hex_char("f"), 15)

    def test_character_upp(self):
        c = Character(
            c1_str=Characteristic("Strength", "Str", 7),
            c2_dex=Characteristic("Dexterity", "Dex", 8),
            c3_end=Characteristic("Endurance", "End", 9),
            c4_int=Characteristic("Intellect", "Int", 10),
            c5_edu=Characteristic("Education", "Edu", 11),
            c6_soc=Characteristic("Social Standing", "Soc", 12),
        )
        self.assertEqual(c.upp, "789ABC")

    def test_character_serialization(self):
        c = Character(name="Test Scout", age=26)
        c.init_default_skills()
        c.add_skill("Pilot", level=1, knowledge="Small Craft")
        c.add_skill("Survival", level=2)
        c.credits = 25000
        c.ship_shares = 2
        c.history.append(TermRecord(term_number=1, career="Scout", rank=1, rank_title="Scout", age=22))

        data = c.to_dict()
        self.assertEqual(data["name"], "Test Scout")
        self.assertEqual(data["credits"], 25000)
        self.assertEqual(data["ship_shares"], 2)
        self.assertIn("Pilot", data["skills"])
        self.assertEqual(data["skills"]["Pilot"]["Knowledge"]["Small Craft"], 1)

        # Roundtrip
        c2 = Character.from_dict(data)
        self.assertEqual(c2.name, c.name)
        self.assertEqual(c2.age, c.age)
        self.assertEqual(c2.upp, c.upp)
        self.assertEqual(c2.skills["Pilot"].knowledges["Small Craft"], 1)
        self.assertEqual(len(c2.history), 1)

    def test_species_catalog(self):
        cat = get_species_catalog()
        species = cat.list_species()
        self.assertGreaterEqual(len(species), 5)
        human = cat.get("human")
        self.assertIsNotNone(human)
        self.assertEqual(human.species_name, "Humaniti")
        self.assertEqual(human.native_language, "Anglic")

    def test_skill_catalog(self):
        cat = get_skill_catalog()
        self.assertGreater(len(cat.skills), 30)
        self.assertTrue(cat.has_knowledges("Driver"))
        self.assertIn("ACV", cat.get_knowledges("Driver"))
        self.assertIn("Physics", cat.get_knowledges("Science"))

    def test_career_catalog(self):
        cat = get_career_catalog()
        self.assertGreaterEqual(len(cat.career_list), 13)
        self.assertIn("Spacer", cat.career_list)
        self.assertGreater(len(cat.get_ccs("Spacer")), 0)
        benefit_tables = cat.get_benefit_tables("Spacer")
        self.assertTrue("Cash" in benefit_tables or "Benefits" in benefit_tables)


    def test_species_characteristic_names(self):
        from character_gen.engine.generators import roll_stats_for_species
        from core.dice import get_roller
        cat = get_species_catalog()
        roller = get_roller("stat_name_test")

        # Vargr: Vigor & Charisma
        vargr = cat.get("vargr")
        chars, _, _ = roll_stats_for_species(vargr, roller)
        names = [c.name for c in chars]
        self.assertIn("Vigor", names)
        self.assertIn("Charisma", names)

        # Aslan: Stamina
        aslan = cat.get("aslan")
        chars, _, _ = roll_stats_for_species(aslan, roller)
        names = [c.name for c in chars]
        self.assertIn("Stamina", names)

        # Bwap: Agility & Vigor
        bwap = cat.get("bwap")
        chars, _, _ = roll_stats_for_species(bwap, roller)
        names = [c.name for c in chars]
        self.assertIn("Agility", names)
        self.assertIn("Vigor", names)

        # Ursa: Training
        ursa = cat.get("ursa")
        chars, _, _ = roll_stats_for_species(ursa, roller)
        names = [c.name for c in chars]
        self.assertIn("Training", names)


    def test_racial_traits(self):
        from character_gen.engine.character_engine import CharacterEngine
        engine = CharacterEngine(seed="trait_test")

        # Ursa should have Rage talent
        c_ursa = engine.start_new_character(species_id="ursa")
        self.assertEqual(c_ursa.talent.get("name"), "Rage")
        self.assertEqual(c_ursa.talent.get("value"), 1)
        self.assertIn("Training", [ch["name"] for ch in c_ursa.characteristics])

        # Bwap should have Stealth skill
        c_bwap = engine.start_new_character(species_id="bwap")
        self.assertIn("Stealth", c_bwap.skills)
        self.assertGreaterEqual(c_bwap.skills["Stealth"]["Skill"], 1)

        # Zhodani should be naturally Psionic
        c_zhodani = engine.start_new_character(species_id="zhodani")
        self.assertIsNotNone(c_zhodani.psi)
        self.assertGreaterEqual(c_zhodani.psi, 2)


    def test_pick_skill_specialties(self):
        from character_gen.engine.dialog_handler import DialogHandler
        handler = DialogHandler(headless=True)

        # Seafarer should return a Seafarer specialty (e.g. Aquanautics, Boat, Grav, Ship, Sub)
        res = handler.pick_skill("Seafarer", "Choose a Seafarer specialty:", preferred_choice="Boat")
        self.assertEqual(res["skill"], "Seafarer")
        self.assertEqual(res["knowledge"], "Boat")

        # Animals should return Animals specialty
        res_anim = handler.pick_skill("Animals", "Choose Animals specialty:", preferred_choice="Trainer")
        self.assertEqual(res_anim["skill"], "Animals")
        self.assertEqual(res_anim["knowledge"], "Trainer")

        # Flyer should return Flyer specialty
        res_fly = handler.pick_skill("Flyer", "Choose Flyer specialty:", preferred_choice="Rotor")
        self.assertEqual(res_fly["skill"], "Flyer")
        self.assertEqual(res_fly["knowledge"], "Rotor")


if __name__ == "__main__":
    unittest.main()
