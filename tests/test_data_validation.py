"""
Unit tests validating that all extracted JSON datasets in data/ are valid and complete.
"""
import unittest
from pathlib import Path
from core.data_models import (
    DATA_DIR,
    SkillsData,
    SpeciesProfile,
    CareersData,
    StarshipDrivesData,
    StarshipHullsData,
    load_json
)

class TestDataValidation(unittest.TestCase):
    def test_skills_json(self):
        skills = SkillsData.load()
        self.assertGreater(len(skills.skills), 50)
        self.assertIn("Pilot", skills.skills)
        self.assertIn("Admin", skills.skills)
        self.assertIn("StarshipSkills", skills.categories)
        self.assertIn("TradeSkills", skills.categories)
        self.assertIn("ArtSkills", skills.categories)
        self.assertIn("SoldierSkills", skills.categories)
        self.assertIn("Driver", skills.knowledges)
        self.assertIn("Grav", skills.knowledges["Driver"])

    def test_species_json(self):
        index = load_json(DATA_DIR / "species" / "index.json")
        self.assertEqual(len(index), 6)
        expected_species = ["human", "aslan", "bwap", "ursa", "vargr", "zhodani"]
        for sp_id in expected_species:
            sp = SpeciesProfile.load(sp_id)
            self.assertEqual(sp.id, sp_id)
            self.assertEqual(len(sp.characteristics), 6)
            self.assertEqual(len(sp.gender_table), 11)
            self.assertEqual(len(sp.caste_table), 11)

    def test_careers_json(self):
        careers = CareersData.load()
        self.assertEqual(len(careers.career_list), 13)
        for car in careers.career_list:
            self.assertIn(car, careers.career_characteristics)
            self.assertIn(car, careers.career_skill_tables)
            self.assertIn(car, careers.career_benefit_tables)
            self.assertIn("Money", careers.career_benefit_tables[car])
            self.assertIn("Benefits", careers.career_benefit_tables[car])

    def test_starship_data(self):
        drives = StarshipDrivesData.load()
        self.assertIn("A", drives.drive_classes)
        self.assertIn("Z", drives.drive_classes)
        self.assertIn("Jump", drives.drive_types)
        self.assertIn("Ultimate", drives.drive_stages)

        hulls = StarshipHullsData.load()
        self.assertIn("Streamlined", hulls.hull_types)
        self.assertIn("Airframe", hulls.hull_configs)
        self.assertIn("FlotationHull", hulls.hull_fittings)
        self.assertIn("Plate", hulls.hull_armor)

if __name__ == "__main__":
    unittest.main()
