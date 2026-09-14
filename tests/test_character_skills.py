"""
Unit tests for T5 Character Skill Tree & Cascades.
"""
import unittest
from character_gen.models.skill import get_skill_catalog, DEFAULT_SKILLS
from character_gen.models.character import Character


class TestCharacterSkills(unittest.TestCase):
    def test_default_skills_initialization(self):
        c = Character()
        c.init_default_skills()
        for sk in DEFAULT_SKILLS:
            self.assertIn(sk, c.skills)
            self.assertGreaterEqual(c.skills[sk].level, 0)
        # Check Turrets default
        self.assertIn("Gunner", c.skills)
        self.assertIn("Turrets", c.skills["Gunner"].knowledges)
        # Check Native Language
        self.assertIn("Language", c.skills)
        self.assertIn("Anglic", c.skills["Language"].knowledges)

    def test_skill_stacking(self):
        c = Character()
        c.init_default_skills()
        c.add_skill("Medic", level=1)
        self.assertEqual(c.skills["Medic"].level, 1)

        c.add_skill("Medic", level=2)
        self.assertEqual(c.skills["Medic"].level, 3)

    def test_cascade_knowledge_stacking(self):
        c = Character()
        c.init_default_skills()
        c.add_skill("Science", level=1, knowledge="Physics")
        self.assertEqual(c.skills["Science"].knowledges["Physics"], 1)

        c.add_skill("Science", level=1, knowledge="Physics")
        self.assertEqual(c.skills["Science"].knowledges["Physics"], 2)

        c.add_skill("Science", level=1, knowledge="Chemistry")
        self.assertEqual(c.skills["Science"].knowledges["Chemistry"], 1)
        self.assertEqual(c.skills["Science"].knowledges["Physics"], 2)


if __name__ == "__main__":
    unittest.main()
