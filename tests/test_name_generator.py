"""
Unit tests for core/name_generator.py.
"""
import unittest
from core.name_generator import NameGenerator, add_caps

class TestNameGenerator(unittest.TestCase):
    def test_add_caps(self):
        self.assertEqual(add_caps("john doe"), "John Doe")
        self.assertEqual(add_caps("solomani-vilani"), "Solomani-Vilani")

    def test_name_generation(self):
        gen = NameGenerator(seed="test_name_seed")
        human_male = gen.get_random_name("human.male")
        self.assertTrue(len(human_male) > 0)
        
        aslan_name = gen.get_random_name("aslan.male")
        self.assertTrue(len(aslan_name) > 0)

        starship_name = gen.get_random_name("ship")
        self.assertTrue(len(starship_name) > 0)

if __name__ == "__main__":
    unittest.main()
