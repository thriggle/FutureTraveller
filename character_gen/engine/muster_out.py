"""
Mustering out resolution engine for T5 Character Generation.
"""
from __future__ import annotations
from typing import List, Dict, Any, Tuple
from core.dice import DiceRoller
from character_gen.models.character import Character
from character_gen.models.career import get_career_catalog, BenefitItem


def calculate_muster_rolls(character: Character) -> int:
    """Calculate total muster out roll budget."""
    terms = len(character.history)
    rank = character.current_rank
    
    # 1 roll per term
    total = terms
    
    # Rank bonuses
    if rank >= 5:
        total += 3
    elif rank >= 3:
        total += 2
    elif rank >= 1:
        total += 1
        
    return max(1, total)


def calculate_pension(terms: int) -> int:
    """Calculate annual retirement pension for 5+ terms."""
    if terms < 5:
        return 0
    pension_table = {
        5: 4000,
        6: 6000,
        7: 8000,
        8: 10000,
        9: 12000,
        10: 14000
    }
    if terms in pension_table:
        return pension_table[terms]
    return 14000 + (terms - 10) * 2000


class MusterOutResolver:
    """Resolves mustering out benefits for a character."""
    def __init__(self, character: Character, roller: DiceRoller):
        self.character = character
        self.roller = roller
        self.career_catalog = get_career_catalog()

    def resolve_all_automatically(self, career: Optional[str] = None):
        """Automatically allocate rolls between cash (up to 3) and benefits."""
        if career is None:
            career = self.character.current_career or "Citizen"

        total_rolls = calculate_muster_rolls(self.character)
        cash_rolls_to_take = min(3, total_rolls // 2 + 1)
        benefit_rolls_to_take = total_rolls - cash_rolls_to_take

        # Cash rolls
        for _ in range(cash_rolls_to_take):
            self.roll_cash(career)

        # Benefit rolls
        for _ in range(benefit_rolls_to_take):
            self.roll_benefit(career)

        # Pension
        terms_count = len(self.character.history)
        self.character.pension = calculate_pension(terms_count)
        if self.character.pension > 0:
            self.character.log_event(f"Retirement: Qualified for annual pension of Cr{self.character.pension:,}/yr")

        self.character.mustered_out = True

    def roll_cash(self, career: str) -> str:
        """Roll on career Cash table."""
        benefit_tables = self.career_catalog.get_benefit_tables(career)
        cash_table = benefit_tables.get("Cash", [])
        if not cash_table:
            # Fallback cash amounts
            cash_amounts = [1000, 5000, 10000, 10000, 20000, 50000, 100000]
            r = min(len(cash_amounts) - 1, self.roller.d6(1) - 1)
            amt = cash_amounts[r]
            self.character.credits += amt
            msg = f"Mustered Out (Cash): +Cr{amt:,}"
            self.character.log_event(msg)
            return msg

        r_idx = min(len(cash_table) - 1, self.roller.d6(1) - 1)
        item = cash_table[r_idx]
        val = item.value if item.value > 0 else 5000
        self.character.credits += val
        msg = f"Mustered Out (Cash): +Cr{val:,}"
        self.character.log_event(msg)
        return msg

    def roll_benefit(self, career: str) -> str:
        """Roll on career Benefits table."""
        benefit_tables = self.career_catalog.get_benefit_tables(career)
        benefits_table = benefit_tables.get("Benefits", benefit_tables.get("Special", []))
        
        if not benefits_table:
            # Generic benefits
            generic_items = ["Low Passage", "Middle Passage", "High Passage", "Weapon", "TAS Membership", "+1 Edu"]
            idx = min(len(generic_items) - 1, self.roller.d6(1) - 1)
            chosen = generic_items[idx]
            self.character.equipment.append(chosen)
            msg = f"Mustered Out (Benefit): Gained {chosen}"
            self.character.log_event(msg)
            return msg

        idx = min(len(benefits_table) - 1, self.roller.d6(1) - 1)
        item: BenefitItem = benefits_table[idx]
        
        # Apply item
        if item.characteristic:
            stat = self.character.get_characteristic(item.characteristic)
            if stat:
                stat.value += 1
                msg = f"Mustered Out (Benefit): +1 to {stat.name} ({item.characteristic})"
                self.character.log_event(msg)
                return msg

        if "Ship Share" in item.label or "Share" in item.label:
            self.character.ship_shares += 1
            msg = f"Mustered Out (Benefit): +1 Free Trader Ship Share (Total: {self.character.ship_shares})"
            self.character.log_event(msg)
            return msg

        if "TAS" in item.label or "Travellers" in item.label:
            self.character.awards.append("Travellers' Aid Society (TAS) Fellowship")
            msg = "Mustered Out (Benefit): Inducted into Travellers' Aid Society (TAS)"
            self.character.log_event(msg)
            return msg

        self.character.equipment.append(item.label)
        msg = f"Mustered Out (Benefit): Received {item.label}"
        self.character.log_event(msg)
        return msg
