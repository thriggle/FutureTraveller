"""
Unit test verifying PRNG bit-for-bit mathematical parity between Python and JS rnd.js.
"""
import subprocess
import json
import unittest
from core.dice import get_roller

class TestPRNGParity(unittest.TestCase):
    def test_prng_matches_js(self):
        seed = "test_seed_12345"
        roller = get_roller(seed)
        py_d6_rolls = [roller.d6(1).result for _ in range(100)]
        py_flux_rolls = [roller.flux().result for _ in range(50)]

        # Generate JS rolls using Node
        js_code = f"""
        import {{ getRollerFromSeed }} from 'file:///C:/code/FutureTraveller/Traveller/js/rnd.js';
        const roller = getRollerFromSeed("{seed}");
        const d6Rolls = [];
        for (let i = 0; i < 100; i++) d6Rolls.push(roller.d6(1).result);
        const fluxRolls = [];
        for (let i = 0; i < 50; i++) fluxRolls.push(roller.flux().result);
        console.log(JSON.stringify({{ d6: d6Rolls, flux: fluxRolls }}));
        """
        proc = subprocess.run(
            ["node", "--input-type=module", "-e", js_code],
            capture_output=True,
            text=True,
            check=True
        )
        js_results = json.loads(proc.stdout.strip())
        
        self.assertEqual(py_d6_rolls, js_results["d6"])
        self.assertEqual(py_flux_rolls, js_results["flux"])

if __name__ == "__main__":
    unittest.main()
