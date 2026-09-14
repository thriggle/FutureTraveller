"""
Term lifecycle resolution engine for T5 Character Generation.
"""
from __future__ import annotations
from typing import Tuple, Optional, List, Dict, Any
from core.dice import DiceRoller
from character_gen.models.character import Character, TermRecord
from character_gen.models.career import get_career_catalog, CareerCatalog
from character_gen.models.skill import get_skill_catalog, SkillCatalog


# Rank titles by career
CAREER_RANKS: Dict[str, Dict[int, str]] = {
    "Spacer": {
        0: "Spacehand Recruit", 1: "Spacehand Apprentice", 2: "Able Spacehand",
        3: "Petty Officer 3rd Class", 4: "Petty Officer 2nd Class", 5: "Petty Officer 1st Class",
        6: "Chief Petty Officer", 7: "Senior Chief Petty Officer", 8: "Master Chief Petty Officer",
        11: "Ensign", 12: "Sublieutenant", 13: "Lieutenant",
        14: "Lt Commander", 15: "Commander", 16: "Captain",
        17: "Commodore", 18: "Fleet Admiral"
    },
    "Soldier": {
        0: "Private", 1: "Lance Corporal", 2: "Corporal",
        3: "Lance Sergeant", 4: "Sergeant", 5: "Gunnery Sergeant",
        6: "Master Sergeant", 7: "First Sergeant", 8: "Sergeant Major",
        11: "2nd Lieutenant", 12: "1st Lieutenant", 13: "Captain",
        14: "Major", 15: "Lt Colonel", 16: "Colonel",
        17: "Brigadier", 18: "General"
    },
    "Marine": {
        0: "Marine", 1: "Lance Corporal", 2: "Corporal",
        3: "Lance Sergeant", 4: "Sergeant", 5: "Gunnery Sergeant",
        6: "Master Sergeant", 7: "First Sergeant", 8: "Sergeant Major",
        11: "2nd Lieutenant", 12: "1st Lieutenant", 13: "Captain",
        14: "Major", 15: "Lt Colonel", 16: "Colonel",
        17: "Brigadier", 18: "General"
    },
    "Merchant": {
        0: "Deckhand", 1: "Senior Deckhand", 2: "4th Officer",
        3: "3rd Officer", 4: "2nd Officer", 5: "1st Officer",
        6: "Captain", 7: "Senior Captain", 8: "Master"
    },
    "Scout": {
        0: "Trainee", 1: "Scout", 2: "Senior Scout",
        3: "Surveyor", 4: "Senior Surveyor", 5: "Explorer",
        6: "Senior Explorer", 7: "Specialist", 8: "Director"
    },
    "Agent": {
        0: "Operative", 1: "Field Agent", 2: "Special Agent",
        3: "Senior Agent", 4: "Case Officer", 5: "Station Chief",
        6: "Director"
    },
    "Scholar": {
        0: "Student", 1: "Researcher", 2: "Fellow",
        3: "Assistant Professor", 4: "Associate Professor", 5: "Professor",
        6: "Dean", 7: "Chancellor"
    },
    "Noble": {
        0: "Gentleman", 1: "Knight", 2: "Baron",
        3: "Marquis", 4: "Count", 5: "Duke",
        6: "Archduke", 7: "Grand Duke"
    },
    "Citizen": {
        0: "Citizen", 1: "Senior Citizen", 2: "Master Citizen",
        3: "Supervisor", 4: "Manager", 5: "Director"
    },
    "Craftsman": {
        0: "Apprentice", 1: "Journeyman", 2: "Craftsman",
        3: "Master Craftsman", 4: "Guildmaster"
    },
    "Entertainer": {
        0: "Performer", 1: "Artist", 2: "Celebrity",
        3: "Star", 4: "Icon", 5: "Legend"
    },
    "Rogue": {
        0: "Street Runner", 1: "Thief", 2: "Enforcer",
        3: "Fixer", 4: "Boss", 5: "Kingpin"
    },
    "Functionary": {
        0: "Clerk", 1: "Officer", 2: "Administrator",
        3: "Director", 4: "Minister"
    }
}


def get_rank_title(career: str, rank_num: int) -> str:
    ranks = CAREER_RANKS.get(career, {})
    return ranks.get(rank_num, f"Rank {rank_num}")


class TermResolver:
    """Executes a single 4-year term of service for a character."""
    def __init__(self, character: Character, roller: DiceRoller):
        self.character = character
        self.roller = roller
        self.career_catalog = get_career_catalog()
        self.skill_catalog = get_skill_catalog()

    def execute_term(self, career: str, branch: Optional[str] = None) -> TermRecord:
        self.character.age += 4
        term_num = len(self.character.history) + 1
        
        record = TermRecord(
            term_number=term_num,
            career=career,
            branch=branch or "",
            rank=self.character.current_rank,
            rank_title=self.character.rank_title or get_rank_title(career, self.character.current_rank),
            age=self.character.age
        )

        # 1. Survival Check
        survived, survival_notes = self._check_survival(career)
        record.survived = survived
        record.events.append(survival_notes)
        self.character.log_event(f"Term {term_num} ({career}): {survival_notes}")

        if not survived:
            # Injury Resolution
            injury_desc = self._resolve_injury()
            record.injury = injury_desc
            self.character.log_event(f"Term {term_num} Injury: {injury_desc}")
            self.character.history.append(record)
            return record

        # 2. Commission Check (if military & uncommissioned)
        if career in ["Spacer", "Soldier", "Marine"] and self.character.current_rank < 10:
            comm_roll = self.roller.d6(2)
            if comm_roll >= 8:
                self.character.current_rank = 11  # Officer Rank O-1 (11)
                record.commissioned = True
                record.rank = self.character.current_rank
                record.rank_title = get_rank_title(career, self.character.current_rank)
                self.character.rank_title = record.rank_title
                msg = f"Commissioned as {record.rank_title} (Roll: {comm_roll})"
                record.events.append(msg)
                self.character.log_event(f"Term {term_num}: {msg}")

        # 3. Promotion Check
        prom_roll = self.roller.d6(2)
        if prom_roll >= 7:
            self.character.current_rank += 1
            record.promoted = True
            record.rank = self.character.current_rank
            record.rank_title = get_rank_title(career, self.character.current_rank)
            self.character.rank_title = record.rank_title
            msg = f"Promoted to {record.rank_title} (Roll: {prom_roll})"
            record.events.append(msg)
            self.character.log_event(f"Term {term_num}: {msg}")

        # 4. Skill Gain (2 rolls per term or 1 standard + 1 rank/bonus)
        skill_gain = self._gain_career_skill(career)
        if skill_gain:
            record.skills_gained.append(skill_gain)

        # 5. Aging Check (Starting at Term 4 / Age 34)
        if self.character.age >= 34:
            aging_msgs = self._resolve_aging(self.character.age)
            record.aging_effects.extend(aging_msgs)

        self.character.history.append(record)
        return record

    def _check_survival(self, career: str) -> Tuple[bool, str]:
        """Survival check: 2D >= 5 (or career specific)."""
        roll = self.roller.d6(2)
        # Apply Career Characteristic (CC) DM if high
        ccs = self.career_catalog.get_ccs(career)
        dm = 0
        for cc in ccs:
            stat = self.character.get_characteristic(cc)
            if stat and stat.total >= 9:
                dm = 1
                break
        total = roll + dm
        if total >= 5:
            return True, f"Survived term of service (Roll {roll} + DM {dm} = {total} vs 5+)"
        return False, f"Failed survival check (Roll {roll} + DM {dm} = {total} vs 5+)"

    def _resolve_injury(self) -> str:
        """Roll on T5 injury table."""
        inj_roll = int(self.roller.d6(1))
        injuries = {
            1: "Nearly killed; -2 to Strength, -2 to Endurance, permanent scars.",
            2: "Severely injured; -1 to Strength, -1 to Dexterity, -1 to Endurance.",
            3: "Missing eye or limb; replaced with cybernetic prosthesis.",
            4: "Minor injury; -1 to physical characteristic of choice.",
            5: "Light wound; recovered after medical treatment.",
            6: "Superficial scratch; no lasting damage."
        }
        desc = injuries.get(inj_roll, "Minor wound.")
        if inj_roll == 1:
            self.character.c1_str.mod -= 2
            self.character.c3_end.mod -= 2
        elif inj_roll == 2:
            self.character.c1_str.mod -= 1
            self.character.c2_dex.mod -= 1
            self.character.c3_end.mod -= 1
        elif inj_roll == 4:
            self.character.c1_str.mod -= 1
        return f"{desc} (Roll: {inj_roll})"

    def _gain_career_skill(self, career: str) -> Optional[str]:
        """Roll on career skill tables."""
        tables_data = self.career_catalog.get_skill_tables(career)
        table_names = tables_data.get("Tables", ["Personal", "Service", "Specialist"])
        
        # Pick table
        t_idx = (self.roller.d6(1) - 1) % len(table_names)
        chosen_table_name = table_names[t_idx]
        skills_in_table = tables_data.get(chosen_table_name, [])
        if not skills_in_table:
            return None

        # Pick skill in table
        s_idx = (self.roller.d6(1) - 1) % len(skills_in_table)
        picked = skills_in_table[s_idx]

        # Handle characteristic bonus like "C1", "C2", etc.
        if picked in ["C1", "C2", "C3", "C4", "C5", "C6"]:
            stat = self.character.get_characteristic(picked)
            if stat:
                stat.value += 1
                msg = f"+1 to {stat.name} ({picked})"
                self.character.log_event(f"Skill Table ({chosen_table_name}): {msg}")
                return msg

        # Handle category expansions like "Starship Skill", "Trade", "Art"
        if "Starship" in picked:
            opts = self.skill_catalog.get_category_skills("StarshipSkills")
            picked = opts[self.roller.d6(1) % len(opts)]
        elif "Trade" in picked:
            opts = self.skill_catalog.get_category_skills("TradeSkills")
            picked = opts[self.roller.d6(1) % len(opts)]
        elif "Art" in picked:
            opts = self.skill_catalog.get_category_skills("ArtSkills")
            picked = opts[self.roller.d6(1) % len(opts)]

        canon_skill = self.skill_catalog.canonicalize(picked)
        if self.skill_catalog.has_knowledges(canon_skill):
            knowledges = self.skill_catalog.get_knowledges(canon_skill)
            k_spec = knowledges[self.roller.d6(1) % len(knowledges)]
            self.character.add_skill(canon_skill, level=1, knowledge=k_spec)
            msg = f"{canon_skill} ({k_spec})+1"
        else:
            self.character.add_skill(canon_skill, level=1)
            msg = f"{canon_skill}+1"

        self.character.log_event(f"Skill Table ({chosen_table_name}): Gained {msg}")
        return msg

    def _resolve_aging(self, age: int) -> List[str]:
        """Aging checks starting at age 34."""
        target = 8 if age < 50 else (9 if age < 66 else 10)
        loss_amount = 1 if age < 66 else 2
        results = []

        for stat in [self.character.c1_str, self.character.c2_dex, self.character.c3_end]:
            roll = self.roller.d6(2)
            if roll < target:
                stat.mod -= loss_amount
                msg = f"Aging check failed for {stat.name} (Roll {roll} vs {target}+): -{loss_amount} {stat.short_name}"
                results.append(msg)
                self.character.log_event(f"Aging (Age {age}): {msg}")
        return results
