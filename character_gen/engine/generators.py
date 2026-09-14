"""
Generators for homeworld, background skills, genetics, and names.
"""
from __future__ import annotations
from typing import List, Tuple, Optional
from core.dice import DiceRoller
from core.name_generator import get_name_generator
from character_gen.models.character import Character, Characteristic
from character_gen.models.species import Species, get_species_catalog
from character_gen.models.skill import get_skill_catalog


TRADE_CODE_SKILLS = {
    "Ag": ["Animals", "Survival", "Seafarer"],
    "As": ["Vacc Suit", "Zero-G", "Prospecting"],
    "Ba": ["Survival", "Stealth"],
    "De": ["Survival", "Hostile Environ"],
    "Fl": ["Seafarer", "Vacc Suit"],
    "Ga": ["Animals", "Survival"],
    "Hi": ["Streetwise", "Comms", "Advocate"],
    "Ht": ["Computer", "Electronics"],
    "Ic": ["Survival", "Vacc Suit"],
    "In": ["Mechanic", "Electronics", "Craftsman"],
    "Lo": ["Survival", "Flyer"],
    "Lt": ["Animals", "Survival", "Mechanic"],
    "Na": ["Vacc Suit", "Hostile Environ"],
    "Ni": ["Craftsman", "Mechanic"],
    "Po": ["Streetwise", "Survival"],
    "Ri": ["Admin", "Advocate", "Broker"],
    "Va": ["Vacc Suit", "Zero-G"],
    "Wa": ["Seafarer", "Survival"]
}


def roll_stats_for_species(
    species: Species,
    roller: DiceRoller,
    gender_key: Optional[str] = None
) -> Tuple[List[Characteristic], Optional[Characteristic], Optional[Characteristic]]:
    """Roll C1-C6 and optionally C7(Psi)/C8(San) using the species-specific characteristic names and dice."""
    chars: List[Characteristic] = []
    
    # Check for gender modifiers if defined in species
    gender_mods = []
    if gender_key and gender_key in species.genders:
        gender_mods = species.genders[gender_key].get("Characteristics", [])

    for i in range(6):
        formula = species.characteristics[i] if i < len(species.characteristics) else None
        full_name = formula.name if formula and formula.name else f"C{i+1}"
        
        # Determine 3-letter abbreviation / short code
        if i < len(species.stat_profile):
            short_name = species.stat_profile[i]
        else:
            short_name = full_name[:3].title()
            
        nd = formula.nD if formula else 2
        mod = formula.mod if formula else 0
        
        # Apply gender adjustments if present
        if i < len(gender_mods):
            g_char = gender_mods[i]
            nd += g_char.get("nD", 0)
            mod += g_char.get("Mod", 0)

        nd = max(1, nd)
        
        # Roll genetics and value
        gene = int(roller.d6(1))
        score = int(roller.d6(nd)) + mod
        chars.append(Characteristic(
            name=full_name,
            short_name=short_name,
            value=max(1, score),
            gene=gene
        ))
        
    # Psionics check (natural or latent)
    psi = None
    if "psionic" in species.notes.lower():
        p_gene = int(roller.d6(1))
        p_roll = int(roller.d6(1))
        psi = Characteristic("Psionics", "Psi", p_gene + p_roll, gene=p_gene)
        
    # Sanity
    san_gene = int(roller.d6(1))
    san_score = int(roller.d6(2))
    san = Characteristic("Sanity", "San", san_score, gene=san_gene)
    
    return chars, psi, san


def generate_name(species_id: str, gender: str, roller: DiceRoller) -> str:
    """Generate a culture/species-appropriate name matching CharacterView.js."""
    gen = get_name_generator()
    gen.roller = roller
    return gen.get_random_name_for_character(species_id, gender)


def assign_background_skills(character: Character, roller: DiceRoller, count: int = 3):
    """Assign background skills based on homeworld trade codes and education."""
    skill_catalog = get_skill_catalog()
    candidate_skills = []
    
    for tc in character.homeworld_trade_codes:
        if tc in TRADE_CODE_SKILLS:
            candidate_skills.extend(TRADE_CODE_SKILLS[tc])
            
    if not candidate_skills:
        candidate_skills = ["Driver", "Vacc Suit", "Computer", "Streetwise", "Admin"]
        
    for _ in range(count):
        chosen = candidate_skills[roller.d6(1) % len(candidate_skills)]
        chosen = skill_catalog.canonicalize(chosen)
        
        # If knowledge skill, pick specialty
        if skill_catalog.has_knowledges(chosen):
            k_list = skill_catalog.get_knowledges(chosen)
            spec = k_list[roller.d6(1) % len(k_list)]
            character.add_skill(chosen, level=1, knowledge=spec)
            character.log_event(f"Background Skill: Gained {chosen} ({spec})-1")
        else:
            character.add_skill(chosen, level=1)
            character.log_event(f"Background Skill: Gained {chosen}-1")
