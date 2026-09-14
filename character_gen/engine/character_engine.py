"""
Core lifecycle state machine for Traveller 5 Character Generation.
Wraps PersonEngine for unified UI interaction and headless generation.
"""
from __future__ import annotations
from enum import Enum, auto
from typing import Optional, Callable, Dict, Any, List
from core.dice import DiceRoller, get_roller
from character_gen.models.character import T5Character, Character
from character_gen.models.species import Species, get_species_catalog
from character_gen.models.career import get_career_catalog, CAREER_LIST
from character_gen.engine.dialog_handler import DialogHandler
from character_gen.engine.person import PersonEngine
from character_gen.engine.generators import roll_stats_for_species, generate_name, assign_background_skills


class GenerationState(Enum):
    INITIAL = auto()
    BACKGROUND = auto()
    CAREER_SELECT = auto()
    TERM_ACTIVE = auto()
    RE_ENLIST = auto()
    ACTIVE = auto()
    FINALIZED = auto()


class CharacterEngine:
    """State machine managing the entire lifecycle of T5 Character creation."""
    def __init__(self, seed: Optional[str] = None, dialog_handler: Optional[DialogHandler] = None):
        self.roller = get_roller(seed)
        self.dialog = dialog_handler or DialogHandler(headless=True, roller=self.roller)
        self.species_catalog = get_species_catalog()
        self.career_catalog = get_career_catalog()
        
        self.character = T5Character()
        self.person = PersonEngine(self.character, self.roller, self.dialog)
        self.state = GenerationState.INITIAL
        self.selected_career: Optional[str] = None
        
        # Callbacks
        self.on_state_changed: Optional[Callable[[GenerationState], None]] = None
        self.on_character_updated: Optional[Callable[[T5Character], None]] = None
        self.on_log_message: Optional[Callable[[str], None]] = None

        self.person.on_update = self._notify_update

    def _notify_update(self):
        if self.on_character_updated:
            self.on_character_updated(self.character)

    def log(self, message: str):
        self.person.record(message)
        if self.on_log_message:
            self.on_log_message(message)

    def _set_state(self, new_state: GenerationState):
        self.state = new_state
        if self.on_state_changed:
            self.on_state_changed(new_state)
        self._notify_update()

    def start_new_character(
        self,
        species_id: str = "human",
        gender: str = "random",
        name: Optional[str] = None,
        roll_sanity_immediately: bool = False
    ) -> T5Character:
        """Step 1: Initialize identity, species, gender, caste, and roll characteristics."""
        sp = self.species_catalog.get(species_id)
        if not sp:
            sp = self.species_catalog.get("human") or Species(id="human", species_name="Humaniti")

        if gender == "random" or not gender:
            g_table = sp.gender_table if sp.gender_table else ["F", "M"]
            chosen_gender = g_table[int(self.roller.d6(2)) - 2] if len(g_table) >= 11 else g_table[int(self.roller.d6(1)) % len(g_table)]
        else:
            chosen_gender = gender

        c_table = sp.caste_table if sp.caste_table else ["N/A"]
        chosen_caste = c_table[int(self.roller.d6(2)) - 2] if len(c_table) >= 11 else c_table[0]

        chars, psi, san = roll_stats_for_species(sp, self.roller, chosen_gender)
        final_name = name if name and name.strip() else generate_name(sp.id, chosen_gender, self.roller)

        self.character = T5Character(
            name=final_name,
            species=sp.species_name,
            gender=chosen_gender,
            caste=chosen_caste,
            age=18,
            native_language=sp.native_language,
            characteristics=[
                {"name": c.name, "value": c.value, "short_name": c.short_name, "mod": 0, "gene": c.gene} for c in chars
            ],
            genetics=[c.gene for c in chars[:4]],
            sanity=san.value if san and roll_sanity_immediately else None,
            sanity_gene=san.gene if san else None,
            psi=psi.value if psi else None,
            psi_gene=psi.gene if psi else None
        )
        self.character.init_default_skills()
        self.person = PersonEngine(self.character, self.roller, self.dialog)
        self.person.apply_racial_traits(sp)
        self.person.on_update = self._notify_update

        self.log(f"Generated Character: {self.character.name} ({self.character.species} {self.character.gender}), UPP: {self.character.upp}")
        self._set_state(GenerationState.BACKGROUND)
        return self.character

    def setup_homeworld(
        self,
        name: str = "Terra",
        uwp: str = "A867974-C",
        trade_codes: Optional[List[str]] = None,
        is_low_tech: bool = False,
        sector: Optional[str] = None,
        hex_coord: Optional[str] = None
    ):
        """Step 2: Assign homeworld details and background skills."""
        trade_codes = trade_codes or []
        self.character.homeworld = {
            "name": name,
            "uwp": uwp,
            "sector": sector,
            "hex": hex_coord,
            "trade_codes": list(trade_codes)
        }
        self.person.gain_skills_from_homeworld_trade_codes(trade_codes, is_low_tech=is_low_tech)
        sec_str = f" in {sector} ({hex_coord})" if sector and hex_coord else ""
        self.log(f"Homeworld set to {name}{sec_str} [{uwp}] ({', '.join(trade_codes)})")
        self._set_state(GenerationState.CAREER_SELECT)

    def select_career(self, career: str):
        self.selected_career = career
        self.character._active_career = career
        self._set_state(GenerationState.TERM_ACTIVE)

    def execute_next_term(self):
        career = self.selected_career
        if not career:
            career = "Citizen" if len(self.character.careers) == 0 else "Spacer"
        self.person.resolve_career(career)
        self._set_state(GenerationState.TERM_ACTIVE)

    def finish_career_and_muster_out(self):
        self.person.muster_out()
        self._set_state(GenerationState.FINALIZED)

    def generate_full_character_automatically(
        self,
        species_id: str = "human",
        career: Optional[str] = None,
        terms: int = 4
    ) -> T5Character:
        """Instant NPC fast-forward generator."""
        prev_headless = self.dialog.headless
        self.dialog.headless = True
        try:
            self.start_new_character(species_id=species_id)
            self.setup_homeworld(name="Regina", uwp="A788899-C", trade_codes=["Ri", "Pa", "Ph"])
            
            chosen_career = career or "Spacer"
            for _ in range(terms):
                self.person._get_or_create_career_record(chosen_career)
                rec = next(c for c in self.character.careers if c["career"] == chosen_career)
                rec["terms"] += 1
                term_num = rec["terms"]
                self.person.gain_term_skills(chosen_career, term_num, picks_count=4)
                
            self.person.muster_out()
            self._set_state(GenerationState.FINALIZED)
            return self.character
        finally:
            self.dialog.headless = prev_headless
