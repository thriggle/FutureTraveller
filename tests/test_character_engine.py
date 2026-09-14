"""
Headless simulation tests for T5 Character Creation Engine.
"""
import unittest
from character_gen.engine.character_engine import CharacterEngine, GenerationState
from character_gen.models.career import CAREER_LIST
from character_gen.models.species import get_species_catalog


class TestCharacterEngine(unittest.TestCase):
    def test_interactive_step_by_step_lifecycle(self):
        engine = CharacterEngine(seed="test_seed_42")
        
        # Step 1: Start identity
        char = engine.start_new_character(species_id="human", gender="M", name="Alexander Vance")
        self.assertEqual(char.name, "Alexander Vance")
        self.assertEqual(char.species_id, "human")
        self.assertEqual(engine.state, GenerationState.BACKGROUND)

        # Step 2: Setup homeworld
        engine.setup_homeworld(name="Regina", uwp="A788899-C", trade_codes=["Ri", "Hi"])
        self.assertEqual(char.homeworld_name, "Regina")
        self.assertEqual(engine.state, GenerationState.CAREER_SELECT)

        # Step 3: Enlist in career
        engine.select_career("Scout")
        self.assertEqual(char.current_career, "Scout")
        self.assertEqual(engine.state, GenerationState.TERM_ACTIVE)

        # Step 4: Execute 4 terms
        for _ in range(4):
            if engine.state in [GenerationState.TERM_ACTIVE, GenerationState.RE_ENLIST]:
                engine.execute_next_term()

        self.assertGreater(len(char.history), 0)
        self.assertGreaterEqual(char.age, 22)

        # Step 5: Mustering out
        engine.finish_career_and_muster_out()
        self.assertTrue(char.mustered_out)
        self.assertEqual(engine.state, GenerationState.FINALIZED)

    def test_automated_full_character_generation(self):
        engine = CharacterEngine(seed="auto_gen_123")
        char = engine.generate_full_character_automatically(species_id="human", career="Spacer", terms=5)
        
        self.assertEqual(char.species_id, "human")
        self.assertEqual(char.current_career, "Spacer")
        self.assertGreaterEqual(len(char.history), 1)
        self.assertTrue(char.mustered_out)
        self.assertIsNotNone(char.upp)
        self.assertEqual(len(char.upp), 6)

    def test_all_careers_headless_runs(self):
        """Ensure every career can generate without errors or deadlocks."""
        for career in CAREER_LIST:
            for i in range(3):
                engine = CharacterEngine(seed=f"seed_{career}_{i}")
                char = engine.generate_full_character_automatically(career=career, terms=4)
                self.assertTrue(char.mustered_out)
                self.assertGreater(len(char.chronicle), 0)

    def test_massive_simulation_runs(self):
        """Simulate 50 fast characters across all species and random careers."""
        species_catalog = get_species_catalog()
        species_ids = [s.id for s in species_catalog.list_species()]

        for seed_idx in range(50):
            sp_id = species_ids[seed_idx % len(species_ids)]
            engine = CharacterEngine(seed=f"sim_{seed_idx}")
            char = engine.generate_full_character_automatically(species_id=sp_id, terms=4)
            self.assertGreaterEqual(char.age, 18)
            self.assertIsNotNone(char.upp)
            self.assertGreaterEqual(len(char.history), 1)


if __name__ == "__main__":
    unittest.main()
