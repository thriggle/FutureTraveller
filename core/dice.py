"""
Traveller 5 Dice Roller Engine.
Provides d6, Nd6, Flux, PosFlux, NegFlux, and Target Difficulty checks.
Matches rnd.js methods and roll algorithms.
"""
from dataclasses import dataclass
import random
import time
from typing import List, Optional
from core.prng import create_prng, Xoshiro128SS

@dataclass
class RollResult:
    result: int
    rolls: List[int]

    def __int__(self) -> int:
        return self.result

    def __index__(self) -> int:
        return self.result

    def __add__(self, other):
        return self.result + int(other)

    def __radd__(self, other):
        return int(other) + self.result

    def __sub__(self, other):
        return self.result - int(other)

    def __rsub__(self, other):
        return int(other) - self.result

    def __lt__(self, other):
        return self.result < int(other)

    def __le__(self, other):
        return self.result <= int(other)

    def __gt__(self, other):
        return self.result > int(other)

    def __ge__(self, other):
        return self.result >= int(other)

    def __eq__(self, other):
        if isinstance(other, (int, float)):
            return self.result == int(other)
        if isinstance(other, RollResult):
            return self.result == other.result
        return False

    def __hash__(self) -> int:
        return hash(self.result)

    def __mod__(self, other):
        return self.result % int(other)

    def __rmod__(self, other):
        return int(other) % self.result

    def __str__(self) -> str:
        return str(self.result)

class DiceRoller:
    def __init__(self, seed: Optional[str] = None):
        if seed is None:
            seed = str(random.random() * 1000000)
        self.seed = seed
        self.prng = create_prng(seed)

    def random(self) -> float:
        return self.prng.random()

    def d6(self, num: int = 1) -> RollResult:
        """Roll N 6-sided dice (matches JS MathRandom()*6 >>> 0 + 1)."""
        rolls = []
        total = 0
        for _ in range(num):
            val = int(self.prng.random() * 6) + 1
            total += val
            rolls.append(val)
        return RollResult(result=total, rolls=rolls)

    def flux(self) -> RollResult:
        """Standard Flux: 1d6 - 1d6 (range -5 to +5)."""
        r1 = self.d6(1)
        r2 = self.d6(1)
        return RollResult(result=r1.result - r2.result, rolls=r1.rolls + r2.rolls)

    def pos_flux(self) -> RollResult:
        """Positive Flux (higher roll minus lower roll)."""
        r1 = self.d6(1)
        r2 = self.d6(1)
        if r2.result > r1.result:
            r1, r2 = r2, r1
        return RollResult(result=r1.result - r2.result, rolls=r1.rolls + r2.rolls)

    def neg_flux(self) -> RollResult:
        """Negative Flux (lower roll minus higher roll)."""
        r1 = self.d6(1)
        r2 = self.d6(1)
        if r2.result < r1.result:
            r1, r2 = r2, r1
        return RollResult(result=r1.result - r2.result, rolls=r1.rolls + r2.rolls)

    def check_target(self, dice_count: int, target: int, mod: int = 0) -> bool:
        """Check if roll of Nd6 + mod is <= target (T5 Task Check)."""
        roll = self.d6(dice_count)
        return (roll.result + mod) <= target

def get_roller(seed: Optional[str] = None) -> DiceRoller:
    return DiceRoller(seed)
