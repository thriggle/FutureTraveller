"""
Complete T5 Character Data Model matching Traveller/js/character.js.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
import json
from character_gen.models.skill import DEFAULT_SKILLS, SkillEntry


def to_hex_char(val: int) -> str:
    """Convert integer to Traveller Pseudo-Hexadecimal digit (0-9, A-Z)."""
    if val < 0:
        return "0"
    if val < 10:
        return str(val)
    if val < 34:
        return chr(ord('A') + (val - 10))
    return "?"


def from_hex_char(ch: str) -> int:
    """Convert single hex digit to integer."""
    ch = ch.upper()
    if '0' <= ch <= '9':
        return int(ch)
    if 'A' <= ch <= 'Z':
        return 10 + ord(ch) - ord('A')
    return 0


@dataclass
class Characteristic:
    name: str
    short_name: str = ""
    value: int = 7
    gene: int = 3
    mod: int = 0

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "short_name": self.short_name,
            "value": self.value,
            "gene": self.gene,
            "mod": self.mod
        }


@dataclass
class TermRecord:
    term_number: int = 1
    career: str = ""
    branch: Optional[str] = None
    rank: int = 0
    rank_title: str = ""
    age: int = 18
    events: List[str] = field(default_factory=list)
    skills_acquired: List[str] = field(default_factory=list)
    promoted: bool = False
    commissioned: bool = False
    reenlisted: bool = True
    details: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "term_number": self.term_number,
            "career": self.career,
            "branch": self.branch,
            "rank": self.rank,
            "rank_title": self.rank_title,
            "age": self.age,
            "events": self.events,
            "skills_acquired": self.skills_acquired,
            "promoted": self.promoted,
            "commissioned": self.commissioned,
            "reenlisted": self.reenlisted,
            "details": self.details,
        }


class T5Character:
    """Full T5 Character entity matching web export format."""
    def __init__(
        self,
        name: str = "J. Doe",
        species: str = "Humaniti",
        gender: str = "M",
        caste: str = "N/A",
        age: int = 18,
        native_language: str = "Anglic",
        is_forced_growth_clone: bool = False,
        characteristics: Optional[List[Dict[str, Any]]] = None,
        genetics: Optional[List[int]] = None,
        sanity: Optional[int] = None,
        sanity_gene: Optional[int] = None,
        psi: Optional[int] = None,
        psi_gene: Optional[int] = None,
        skills: Optional[Dict[str, Any]] = None,
        majors: Optional[List[Dict[str, str]]] = None,
        minors: Optional[List[Dict[str, str]]] = None,
        edu_waivers: int = 0,
        language_receipts: int = 0,
        careers: Optional[List[Dict[str, Any]]] = None,
        CCs: Optional[List[str]] = None,
        credits: int = 0,
        ship_shares: int = 0,
        merchant_ship_share_receipt_level: int = 1,
        awards: Optional[List[str]] = None,
        land_grants: Optional[List[str]] = None,
        fame: int = 0,
        fame_flux: int = 0,
        fame_flux_applied: bool = False,
        fame_muster_out_bonus: bool = False,
        final_fame_roll: bool = False,
        talent: Optional[Dict[str, Any]] = None,
        resignation_declined: bool = False,
        reserve_years: Optional[Dict[str, int]] = None,
        aging_crises: int = 0,
        mustered_out: bool = False,
        homeworld: Optional[Dict[str, Any]] = None,
        job: Optional[Dict[str, Any]] = None,
        hobby: Optional[Dict[str, Any]] = None,
        last_cit_life_receipt: Optional[str] = None,
        successful_intrigues: int = 0,
        times_exiled: int = 0,
        proxies: int = 0,
        noble_rank: int = 0,
        is_in_exile: bool = False,
        elevation_flux_used: bool = False,
        history: Optional[List[Any]] = None,
        c1_str: Optional[Characteristic] = None,
        c2_dex: Optional[Characteristic] = None,
        c3_end: Optional[Characteristic] = None,
        c4_int: Optional[Characteristic] = None,
        c5_edu: Optional[Characteristic] = None,
        c6_soc: Optional[Characteristic] = None,
        c7_psi: Optional[Characteristic] = None,
        c8_san: Optional[Characteristic] = None,
    ):
        self.name = name
        self.species = species
        self.gender = gender
        self.caste = caste
        self.age = age
        self.native_language = native_language
        self.is_forced_growth_clone = is_forced_growth_clone

        if characteristics is not None:
            self.characteristics = characteristics
        elif c1_str is not None:
            c_list = [c1_str, c2_dex, c3_end, c4_int, c5_edu, c6_soc]
            self.characteristics = [
                {"name": c.name, "value": c.value, "mod": c.mod} if isinstance(c, Characteristic) else c
                for c in c_list if c is not None
            ]
        else:
            self.characteristics = [
                {"name": "Strength", "value": 7},
                {"name": "Dexterity", "value": 7},
                {"name": "Endurance", "value": 7},
                {"name": "Intellect", "value": 7},
                {"name": "Education", "value": 7},
                {"name": "Social Standing", "value": 7}
            ]

        self.genetics = genetics if genetics is not None else [3, 3, 3, 3]
        self.sanity = sanity if sanity is not None else (c8_san.value if c8_san else None)
        self.sanity_gene = sanity_gene if sanity_gene is not None else (c8_san.gene if c8_san else None)
        self.psi = psi if psi is not None else (c7_psi.value if c7_psi else None)
        self.psi_gene = psi_gene if psi_gene is not None else (c7_psi.gene if c7_psi else None)

        self.skills: Dict[str, SkillEntry] = {}
        if skills:
            for k, v in skills.items():
                if isinstance(v, SkillEntry):
                    self.skills[k] = v
                elif isinstance(v, dict):
                    self.skills[k] = SkillEntry.from_dict(v)
                else:
                    self.skills[k] = SkillEntry(level=int(v))

        self.majors = majors if majors is not None else []
        self.minors = minors if minors is not None else []
        self.edu_waivers = edu_waivers
        self.language_receipts = language_receipts
        self.careers = careers if careers is not None else []
        self.CCs = CCs if CCs is not None else []
        self.credits = credits
        self.ship_shares = ship_shares
        self.merchant_ship_share_receipt_level = merchant_ship_share_receipt_level
        self.awards = awards if awards is not None else []
        self.land_grants = land_grants if land_grants is not None else []
        self.fame = fame
        self.fame_flux = fame_flux
        self.fame_flux_applied = fame_flux_applied
        self.fame_muster_out_bonus = fame_muster_out_bonus
        self.final_fame_roll = final_fame_roll
        self.talent = talent if talent is not None else {"name": "Undefined", "value": 0}
        self.resignation_declined = resignation_declined
        self.reserve_years = reserve_years if reserve_years is not None else {"army": 0, "marine": 0, "navy": 0}
        self.aging_crises = aging_crises
        self.mustered_out = mustered_out
        self.homeworld = homeworld
        self.job = job if job is not None else {"skill": None, "knowledge": None}
        self.hobby = hobby if hobby is not None else {"skill": None, "knowledge": None}
        self.last_cit_life_receipt = last_cit_life_receipt
        self.successful_intrigues = successful_intrigues
        self.times_exiled = times_exiled
        self.proxies = proxies
        self.noble_rank = noble_rank
        self.is_in_exile = is_in_exile
        self.elevation_flux_used = elevation_flux_used
        self.history = history if history is not None else []

    @property
    def species_id(self) -> str:
        if not self.species:
            return "human"
        sp = self.species.lower()
        if sp in ["human", "humaniti"]:
            return "human"
        return sp

    @property
    def homeworld_name(self) -> Optional[str]:
        if isinstance(self.homeworld, dict):
            return self.homeworld.get("name")
        return str(self.homeworld) if self.homeworld else None

    @property
    def homeworld_trade_codes(self) -> List[str]:
        if isinstance(self.homeworld, dict):
            return self.homeworld.get("trade_codes", [])
        return []

    @homeworld_trade_codes.setter
    def homeworld_trade_codes(self, val: List[str]):
        if not isinstance(self.homeworld, dict):
            self.homeworld = {"name": "Homeworld", "trade_codes": list(val)}
        else:
            self.homeworld["trade_codes"] = list(val)

    @property
    def current_career(self) -> Optional[str]:
        if self.careers and len(self.careers) > 0:
            last = self.careers[-1]
            if isinstance(last, dict):
                return last.get("career", last.get("name"))
            return str(last)
        for entry in reversed(self.history):
            if isinstance(entry, TermRecord):
                return entry.career
            if isinstance(entry, dict) and "career" in entry:
                return entry["career"]
        return getattr(self, "_active_career", None)

    @property
    def chronicle(self) -> List[Any]:
        return self.history

    def log_event(self, event: str):
        """Append an event to character history log."""
        self.history.append(event)

    def add_history(self, event: str):
        """Append an event to character history log."""
        self.history.append(event)

    def add_skill(self, name: str, level: int = 1, knowledge: Optional[str] = None):
        """Add or increment skill/knowledge level."""
        if name not in self.skills:
            self.skills[name] = SkillEntry(level=0, knowledges={})
        entry = self.skills[name]
        if not isinstance(entry, SkillEntry):
            entry = SkillEntry.from_dict(entry)
            self.skills[name] = entry

        if knowledge:
            curr_k = entry.knowledges.get(knowledge, 0)
            entry.knowledges[knowledge] = curr_k + level
        else:
            entry.level = entry.level + level

    def init_default_skills(self):
        """Set standard T5 default skills."""
        for sk in DEFAULT_SKILLS:
            if sk not in self.skills:
                self.skills[sk] = SkillEntry(level=0, knowledges={})
        if "Gunner" not in self.skills:
            self.skills["Gunner"] = SkillEntry(level=-1, knowledges={"Turrets": 0})
        if "Language" not in self.skills:
            self.skills["Language"] = SkillEntry(level=-1, knowledges={self.native_language: 0})
        else:
            self.skills["Language"].knowledges[self.native_language] = 0

    @property
    def upp(self) -> str:
        """Universal Personality Profile (6 hex characters: C1-C6)."""
        chars = self.characteristics
        return "".join(to_hex_char(chars[i].get("value", 7)) for i in range(min(6, len(chars))))

    @property
    def uap(self) -> str:
        """Universal Actual Profile (UPP + Sanity + Psi)."""
        san_str = to_hex_char(self.sanity) if self.sanity is not None else "-"
        psi_str = to_hex_char(self.psi) if self.psi is not None else "-"
        return f"{self.upp}-{san_str}{psi_str}"

    def get_playability_score(self) -> Dict[str, Any]:
        """Calculate playability score matching JS getPlayabilityScore()."""
        char_comp = sum(c.get("value", 0) for c in self.characteristics) / 6.0
        skill_comp = 0
        know_comp = 0
        lang_comp = 0
        jot_comp = 0

        for s_name, s_data in self.skills.items():
            base_skill = s_data.get("Skill", -1)
            if base_skill >= 0:
                if s_name == "JOT":
                    jot_comp += base_skill * 2
                else:
                    skill_comp += base_skill

            k_dict = s_data.get("Knowledge", {})
            if s_name == "Language":
                lang_comp += len(k_dict)
            else:
                for k_val in k_dict.values():
                    know_comp += k_val

        know_comp = know_comp / 2.0
        total_score = char_comp + skill_comp + know_comp + lang_comp + jot_comp
        return {
            "score": round(total_score, 1),
            "characteristicScore": round(char_comp, 1),
            "skillScore": int(skill_comp),
            "knowledgeScore": round(know_comp, 1),
            "JOTScore": int(jot_comp),
            "languageScore": int(lang_comp)
        }

    def get_noble_rank(self) -> Dict[str, str]:
        """Get Noble title and code according to nobleRank and Soc."""
        soc = self.characteristics[5].get("value", 7) if len(self.characteristics) > 5 else 7
        rank_idx = self.noble_rank
        titles = [
            ("N0", "Knight", 11),
            ("N1", "Baron", 12),
            ("N2", "Marquis", 12),
            ("N3", "Count", 13),
            ("N4", "Duke", 14),
            ("N5", "Archduke", 15),
            ("N6", "Grand Duke", 16)
        ]
        if 0 <= rank_idx < len(titles):
            code, title, _ = titles[rank_idx]
            return {"code": code, "title": title}
        return {"code": f"N{rank_idx}", "title": "Noble"}

    def get_craftsman_qualifications(self) -> Dict[str, Any]:
        """Calculate Craftsman career entry qualifications."""
        master_points = 0
        qualifying_skills = []
        qualifying_skill_count = 0
        craftsman_skill = self.skills.get("Craftsman", {}).get("Skill", 0)

        if craftsman_skill > 0:
            master_points = craftsman_skill
            for s_name, s_data in self.skills.items():
                if s_name != "Language":
                    base_skill = s_data.get("Skill", 0)
                    if base_skill >= 6:
                        qualifying_skill_count += 1
                        if s_name != "Craftsman":
                            qualifying_skills.append({"Skill": s_name, "Level": base_skill})

                    for k_name, k_lvl in s_data.get("Knowledge", {}).items():
                        total_lvl = k_lvl + (base_skill if base_skill > 0 else 0)
                        if total_lvl >= 6:
                            qualifying_skill_count += 1
                            qualifying_skills.append({"Skill": k_name, "Level": total_lvl})

            if qualifying_skill_count >= 2:
                qualifying_skills.sort(key=lambda x: x["Level"], reverse=True)
                for item in qualifying_skills[:5]:
                    if item["Skill"] != "Craftsman":
                        master_points += item["Level"]
                return {"qualifies": True, "qualifyingSkills": qualifying_skills, "masterPoints": master_points}

        return {"qualifies": False, "qualifyingSkills": qualifying_skills, "masterPoints": master_points}

    def has_reserve_award(self) -> bool:
        return any(r in self.awards for r in ["Army Reserves", "Navy Reserves", "Marine Reserves"])

    def get_qualifications(self) -> Dict[str, bool]:
        """Check qualification for all Careers and Education programs matching getQualifications()."""
        q = {}
        is_dead = any(c.get("value", 0) <= 0 for c in self.characteristics)
        has_been = {c["career"]: True for c in self.careers if "career" in c}
        is_now = {c["career"]: c.get("active", False) for c in self.careers if "career" in c}
        
        availability = not (self.mustered_out or is_dead)
        if has_been.get("Noble"):
            availability = False

        q["MusterOut"] = not is_dead and (len(self.careers) > 0 and not self.mustered_out)
        q["Citizen"] = availability and (len(self.careers) == 0)
        q["Soldier"] = availability and (len(self.careers) == 0 or not has_been.get("Soldier") or is_now.get("Soldier", False))
        q["Agent"] = availability and (len(self.careers) == 0 or not has_been.get("Agent") or is_now.get("Agent", False))
        q["Merchant"] = availability and (len(self.careers) == 0 or not has_been.get("Merchant") or is_now.get("Merchant", False))
        q["Spacer"] = availability and (len(self.careers) == 0 or not has_been.get("Spacer") or is_now.get("Spacer", False))
        q["Marine"] = availability and (len(self.careers) == 0 or not has_been.get("Marine") or is_now.get("Marine", False))
        q["Scout"] = availability and (len(self.careers) == 0 or not has_been.get("Scout") or is_now.get("Scout", False))
        q["Entertainer"] = availability and (len(self.careers) == 0 or not has_been.get("Entertainer") or is_now.get("Entertainer", False))
        q["Scholar"] = availability and (len(self.careers) == 0 or not has_been.get("Scholar") or is_now.get("Scholar", False))
        
        soc_val = self.characteristics[5].get("value", 7) if len(self.characteristics) > 5 else 7
        q["Noble"] = not (self.mustered_out or is_dead) and (soc_val >= 11) and (not has_been.get("Noble") or is_now.get("Noble", False))
        q["Functionary"] = availability and (len(self.careers) > 0) and not has_been.get("Noble") and (not has_been.get("Functionary") or is_now.get("Functionary", False))
        q["Rogue"] = availability and (len(self.careers) == 0 or not has_been.get("Rogue") or is_now.get("Rogue", False))

        navy_comm = "Navy Officer1" in self.awards
        army_comm = "Army Officer1" in self.awards
        marine_comm = "Marine Officer1" in self.awards

        if navy_comm or army_comm or marine_comm:
            for k in ["Citizen", "Spacer", "Soldier", "Marine", "Merchant", "Scout", "Craftsman", "Entertainer", "Scholar", "Noble", "Agent", "Rogue", "Functionary", "BA"]:
                q[k] = False
            if navy_comm:
                q["Spacer"] = True
            if army_comm:
                q["Soldier"] = True
            if marine_comm:
                q["Marine"] = True
        else:
            q["BA"] = True

        craftsman_q = self.get_craftsman_qualifications()
        q["Craftsman"] = availability and (len(self.careers) >= 1) and (not has_been.get("Craftsman") or is_now.get("Craftsman", False)) and craftsman_q["qualifies"]

        q["fameEvent"] = not self.fame_flux_applied
        q["fameBonus"] = not self.fame_muster_out_bonus and (self.fame >= 19)
        q["resignReserves"] = not self.resignation_declined and not self.mustered_out and not is_dead and self.has_reserve_award()

        return q

    def to_dict(self) -> dict:
        """Export to exact JSON format used by web export."""
        hist_serialized = []
        for h in self.history:
            if hasattr(h, "to_dict"):
                hist_serialized.append(h.to_dict())
            else:
                hist_serialized.append(h)

        skills_serialized = {}
        for k, v in self.skills.items():
            if hasattr(v, "to_dict"):
                skills_serialized[k] = v.to_dict()
            elif isinstance(v, dict):
                skills_serialized[k] = v
            else:
                skills_serialized[k] = {"Skill": int(v), "Knowledge": {}}

        return {
            "name": self.name,
            "species": self.species,
            "gender": self.gender,
            "caste": self.caste,
            "age": self.age,
            "nativeLanguage": self.native_language,
            "native_language": self.native_language,
            "isForcedGrowthClone": self.is_forced_growth_clone,
            "characteristics": self.characteristics,
            "genetics": self.genetics,
            "sanity": self.sanity,
            "sanityGene": self.sanity_gene,
            "psi": self.psi,
            "psiGene": self.psi_gene,
            "skills": skills_serialized,
            "majors": self.majors,
            "minors": self.minors,
            "edu_waivers": self.edu_waivers,
            "languageReceipts": self.language_receipts,
            "careers": self.careers,
            "CCs": self.CCs,
            "credits": self.credits,
            "shipShares": self.ship_shares,
            "ship_shares": self.ship_shares,
            "merchantShipShareReceiptLevel": self.merchant_ship_share_receipt_level,
            "awards": self.awards,
            "landGrants": self.land_grants,
            "fame": self.fame,
            "fameFlux": self.fame_flux,
            "fameFluxApplied": self.fame_flux_applied,
            "fameMusterOutBonus": self.fame_muster_out_bonus,
            "finalFameRoll": self.final_fame_roll,
            "talent": self.talent,
            "resignationDeclined": self.resignation_declined,
            "reserveYears": self.reserve_years,
            "agingCrises": self.aging_crises,
            "musteredOut": self.mustered_out,
            "homeworld": self.homeworld,
            "job": self.job,
            "hobby": self.hobby,
            "lastCitLifeReceipt": self.last_cit_life_receipt,
            "successfulIntrigues": self.successful_intrigues,
            "timesExiled": self.times_exiled,
            "proxies": self.proxies,
            "nobleRank": self.noble_rank,
            "isInExile": self.is_in_exile,
            "elevationFluxUsed": self.elevation_flux_used,
            "history": hist_serialized
        }

    @classmethod
    def from_dict(cls, d: dict) -> T5Character:
        raw_hist = d.get("history", [])
        hist = []
        for item in raw_hist:
            if isinstance(item, dict) and "term_number" in item:
                hist.append(TermRecord(**item))
            else:
                hist.append(item)

        raw_skills = d.get("skills", {})
        parsed_skills = {}
        for k, v in raw_skills.items():
            if isinstance(v, dict):
                parsed_skills[k] = SkillEntry.from_dict(v)
            else:
                parsed_skills[k] = SkillEntry(level=int(v))

        return cls(
            name=d.get("name", "J. Doe"),
            species=d.get("species", "Humaniti"),
            gender=d.get("gender", "M"),
            caste=d.get("caste", "N/A"),
            age=d.get("age", 18),
            native_language=d.get("nativeLanguage", "Anglic"),
            is_forced_growth_clone=d.get("isForcedGrowthClone", False),
            characteristics=d.get("characteristics", [
                {"name": "Strength", "value": 7},
                {"name": "Dexterity", "value": 7},
                {"name": "Endurance", "value": 7},
                {"name": "Intellect", "value": 7},
                {"name": "Education", "value": 7},
                {"name": "Social Standing", "value": 7}
            ]),
            genetics=d.get("genetics", [3, 3, 3, 3]),
            sanity=d.get("sanity"),
            sanity_gene=d.get("sanityGene"),
            psi=d.get("psi"),
            psi_gene=d.get("psiGene"),
            skills=parsed_skills,
            majors=d.get("majors", []),
            minors=d.get("minors", []),
            edu_waivers=d.get("edu_waivers", 0),
            language_receipts=d.get("languageReceipts", 0),
            careers=d.get("careers", []),
            CCs=d.get("CCs", []),
            credits=d.get("credits", 0),
            ship_shares=d.get("shipShares", 0),
            merchant_ship_share_receipt_level=d.get("merchantShipShareReceiptLevel", 1),
            awards=d.get("awards", []),
            land_grants=d.get("landGrants", []),
            fame=d.get("fame", 0),
            fame_flux=d.get("fameFlux", 0),
            fame_flux_applied=d.get("fameFluxApplied", False),
            fame_muster_out_bonus=d.get("fameMusterOutBonus", False),
            final_fame_roll=d.get("finalFameRoll", False),
            talent=d.get("talent", {"name": "Undefined", "value": 0}),
            resignation_declined=d.get("resignationDeclined", False),
            reserve_years=d.get("reserveYears", {"army": 0, "marine": 0, "navy": 0}),
            aging_crises=d.get("agingCrises", 0),
            mustered_out=d.get("musteredOut", False),
            homeworld=d.get("homeworld"),
            job=d.get("job", {"skill": None, "knowledge": None}),
            hobby=d.get("hobby", {"skill": None, "knowledge": None}),
            last_cit_life_receipt=d.get("lastCitLifeReceipt"),
            successful_intrigues=d.get("successfulIntrigues", 0),
            times_exiled=d.get("timesExiled", 0),
            proxies=d.get("proxies", 0),
            noble_rank=d.get("nobleRank", 0),
            is_in_exile=d.get("isInExile", False),
            elevation_flux_used=d.get("elevationFluxUsed", False),
            history=hist
        )


# Backward compatibility alias
Character = T5Character

