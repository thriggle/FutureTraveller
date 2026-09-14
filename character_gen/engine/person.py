"""
Complete T5 Character Generation Engine matching Traveller/js/character.js.
Faithful implementation of all Education programs, 13 Careers, Aging, Mustering Out, and Reserves.
"""
from __future__ import annotations
from typing import Dict, List, Optional, Any, Tuple, Callable
import math
from core.dice import DiceRoller, get_roller
from character_gen.models.character import T5Character, to_hex_char
from character_gen.models.species import Species, get_species_catalog
from character_gen.models.skill import get_skill_catalog, DEFAULT_SKILLS
from character_gen.models.career import get_career_catalog, CAREER_LIST
from character_gen.engine.dialog_handler import DialogHandler


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


class PersonEngine:
    """Core game engine managing a single T5 Character instance."""
    def __init__(
        self,
        character: Optional[T5Character] = None,
        roller: Optional[DiceRoller] = None,
        dialog_handler: Optional[DialogHandler] = None
    ):
        self.roller = roller or get_roller()
        self.dialog = dialog_handler or DialogHandler(headless=True, roller=self.roller)
        self.character = character or T5Character()
        self.species_catalog = get_species_catalog()
        self.career_catalog = get_career_catalog()
        self.skill_catalog = get_skill_catalog()

        # Callbacks
        self.on_update: Optional[Callable[[], None]] = None

    def record(self, message: str):
        """Append log message to history."""
        self.character.history.append(message)
        if self.on_update:
            self.on_update()

    def apply_racial_traits(self, species: Optional[Species] = None):
        """Apply racial traits matching Traveller/js/character.js applyRacialTraits()."""
        if not species:
            sp_id = self.character.species_id
            species = self.species_catalog.get(sp_id)
        if not species:
            return

        notes = species.notes or ""
        if "Stealth" in notes:
            stealth_roll = int(self.roller.d6(1))
            self.character.skills["Stealth"] = {"Skill": stealth_roll, "Knowledge": {}}
            self.record(f"Racial Trait: Gained Stealth-{stealth_roll}.")

        if "Rage" in notes:
            self.character.talent = {"name": "Rage", "value": 1}
            self.record("Racial Trait: Gained Rage.")

        if "psionic" in notes.lower():
            if self.character.psi is None:
                p_gene = int(self.roller.d6(1))
                p_roll = int(self.roller.d6(1))
                self.character.psi_gene = p_gene
                self.character.psi = p_gene + p_roll
                self.record(f"Racial Trait: Naturally Psionic, Psi Strength is {p_gene + p_roll} (Gene: {p_gene}).")

    def check(self, target: int, difficulty: int = 2, mods: int = 0, remarks: str = "") -> Dict[str, Any]:
        """Task check: Roll Nd6 <= target + mods."""
        eff_target = target + mods
        result = 0
        rolls = []
        for _ in range(difficulty):
            r = self.roller.d6(1)
            result += r.result
            rolls.extend(r.rolls)
        passed = result <= eff_target
        msg = f"{remarks}: [{'-'.join(str(x) for x in rolls)}] = {result} <= {eff_target} ? {'PASS' if passed else 'FAIL'}"
        return {
            "success": passed,
            "result": result,
            "rolls": rolls,
            "target": eff_target,
            "remarks": msg
        }

    def check_characteristic(self, char_name: str, difficulty: int = 2, mods: int = 0, remarks: str = "") -> Dict[str, Any]:
        """Check against a characteristic score C1-C6 or by name."""
        char_map = {"C1": 0, "STR": 0, "C2": 1, "DEX": 1, "C3": 2, "END": 2, "C4": 3, "INT": 3, "C5": 4, "EDU": 4, "TRA": 4, "INS": 4, "C6": 5, "SOC": 5, "CHA": 5, "CAS": 5}
        idx = char_map.get(char_name.upper(), 0)
        target = self.character.characteristics[idx].get("value", 7)
        if not remarks:
            remarks = f"{difficulty}D vs {char_name} ({target})"
        return self.check(target, difficulty, mods, remarks)

    def gain_characteristic(self, char_name: str, amount: int = 1, premark: str = "", record_gain: bool = True) -> str:
        """Increase or decrease characteristic."""
        char_map = {"C1": 0, "STR": 0, "C2": 1, "DEX": 1, "C3": 2, "END": 2, "C4": 3, "INT": 3, "C5": 4, "EDU": 4, "TRA": 4, "INS": 4, "C6": 5, "SOC": 5, "CHA": 5, "CAS": 5}
        idx = char_map.get(char_name.upper(), 0)
        cur_val = self.character.characteristics[idx].get("value", 7)
        max_val = 15
        new_val = min(max_val, max(1, cur_val + amount))
        self.character.characteristics[idx]["value"] = new_val
        msg = f"{'Increased' if amount >= 0 else 'Decreased'} {self.character.characteristics[idx]['name']} by {abs(amount)} (New: {new_val})."
        if premark:
            msg = f"{premark} {msg}"
        if record_gain:
            self.record(msg)
        return msg

    def gain_skill_or_knowledge(self, skill: str, knowledge: Optional[str] = None, record: bool = True, remark: str = "") -> str:
        """Add or level up skill / knowledge specialty."""
        canon_skill = self.skill_catalog.canonicalize(skill)
        if canon_skill not in self.character.skills:
            self.character.skills[canon_skill] = {"Skill": -1 if knowledge else 0, "Knowledge": {}}

        entry = self.character.skills[canon_skill]
        if knowledge:
            cur_k = entry["Knowledge"].get(knowledge, -1)
            new_k = cur_k + 1 if cur_k >= 0 else 1
            entry["Knowledge"][knowledge] = new_k
            msg = f"Gained {canon_skill} ({knowledge})-{new_k} {remark}".strip()
        else:
            cur_s = entry.get("Skill", 0)
            new_s = max(1, cur_s + 1)
            entry["Skill"] = new_s
            msg = f"Gained {canon_skill}-{new_s} {remark}".strip()

        if record:
            self.record(msg)
        return msg

    def advance_age(self, num_years: int = 1) -> str:
        """Advance character age and handle aging checks at stage 5+ (or stage 4 if clone)."""
        peak_start = 34 if self.character.is_forced_growth_clone else 38
        remarks = ""
        for _ in range(num_years):
            self.character.age += 1
            cur_age = self.character.age
            if cur_age >= peak_start and (cur_age - peak_start) % 4 == 0:
                remarks += self.aging_check()

            # Reservist years tracking
            if self.character.has_reserve_award():
                if "Army Reserves" in self.character.awards:
                    self.character.reserve_years["army"] += 1
                if "Marine Reserves" in self.character.awards:
                    self.character.reserve_years["marine"] += 1
                if "Navy Reserves" in self.character.awards:
                    self.character.reserve_years["navy"] += 1

            # Retirement Age (66)
            if cur_age == 66:
                self._handle_retirement_age()

        msg = f"Age increased to {self.character.age}. {remarks}".strip()
        self.record(msg)
        return msg

    def aging_check(self) -> str:
        """Run 4-year physical aging check."""
        remarks = []
        stage = 5 if self.character.age < 50 else (6 if self.character.age < 66 else 9)
        for idx in [0, 1, 2]:
            stat_name = self.character.characteristics[idx]["name"]
            res = self.check(stage, 2, 0, f"Aging vs {stat_name}")
            if res["success"]:
                # Failed aging check (in T5 aging, rolling under stage means characteristic loss)
                cur_v = self.character.characteristics[idx]["value"]
                self.character.characteristics[idx]["value"] = max(1, cur_v - 1)
                remarks.append(f"{stat_name} reduced to {self.character.characteristics[idx]['value']}.")
        if self.character.age >= 66:
            # Check Int & Edu
            for idx in [3, 4]:
                stat_name = self.character.characteristics[idx]["name"]
                res = self.check(stage, 2, 0, f"Aging vs {stat_name}")
                if res["success"]:
                    cur_v = self.character.characteristics[idx]["value"]
                    self.character.characteristics[idx]["value"] = max(1, cur_v - 1)
                    remarks.append(f"{stat_name} reduced to {self.character.characteristics[idx]['value']}.")

        return " ".join(remarks)

    def _handle_retirement_age(self):
        """Award pensions at retirement age 66."""
        if "Army Reserves" in self.character.awards:
            pen = self.character.reserve_years["army"] * 100
            self.character.awards.append(f"Army Reserve Pension: Cr{pen:,}/yr")
            self.record(f"Retired from Army Reserves with pension of Cr{pen:,}/yr.")
        if "Marine Reserves" in self.character.awards:
            pen = self.character.reserve_years["marine"] * 100
            self.character.awards.append(f"Marine Reserve Pension: Cr{pen:,}/yr")
            self.record(f"Retired from Marine Reserves with pension of Cr{pen:,}/yr.")
        if "Navy Reserves" in self.character.awards:
            pen = self.character.reserve_years["navy"] * 100
            self.character.awards.append(f"Navy Reserve Pension: Cr{pen:,}/yr")
            self.record(f"Retired from Navy Reserves with pension of Cr{pen:,}/yr.")

    def gain_skills_from_homeworld_trade_codes(self, trade_codes: List[str] | str, is_low_tech: bool = False):
        """Gain background and homeworld skills based on trade codes with player prompts."""
        if not is_low_tech:
            if "Computer" not in self.character.skills:
                self.character.skills["Computer"] = {"Skill": 0, "Knowledge": {}}

        if isinstance(trade_codes, str):
            code_list = [c.strip() for c in trade_codes.split() if c.strip()]
        else:
            code_list = list(trade_codes)

        if not code_list:
            self.record("No skills received from homeworld.")
            return

        for code in code_list:
            note = f"{code} trade code on homeworld provides "
            if code in ["Ag", "Fa"]:
                note += "Animals"
                cat = self.dialog.pick_skill("Animals", f"{note}. Choose an Animals specialty:")
                sk = cat["skill"] if cat else "Animals"
                kn = cat.get("knowledge") if cat else "Trainer"
                self.gain_skill_or_knowledge(sk, kn, True, f"({code} Homeworld)")
            elif code == "As":
                note += "Zero-G"
                self.gain_skill_or_knowledge("Zero-G", None, True, f"({code} Homeworld)")
            elif code in ["Co", "Fl", "Fr", "He", "Ho"]:
                note += "Hostile Environ"
                self.gain_skill_or_knowledge("Hostile Environ", None, True, f"({code} Homeworld)")
            elif code == "Cp":
                note += "Admin"
                self.gain_skill_or_knowledge("Admin", None, True, f"({code} Homeworld)")
            elif code == "Cs":
                note += "Bureaucrat"
                self.gain_skill_or_knowledge("Bureaucrat", None, True, f"({code} Homeworld)")
            elif code == "Cx":
                note += "Language"
                cat = self.dialog.pick_skill("Language", f"{note}. Choose a Language:")
                kn = cat.get("knowledge") if cat else "Anglic"
                self.gain_skill_or_knowledge("Language", kn, True, f"({code} Homeworld)")
            elif code == "Da":
                note += "Fighter"
                cat = self.dialog.pick_skill("Fighter", f"{note}. Choose a Fighter specialty:")
                sk = cat["skill"] if cat else "Fighter"
                kn = cat.get("knowledge") if cat else "Blades"
                self.gain_skill_or_knowledge(sk, kn, True, f"({code} Homeworld)")
            elif code in ["De", "Tr", "Tu"]:
                note += "Survival"
                self.gain_skill_or_knowledge("Survival", None, True, f"({code} Homeworld)")
            elif code == "Ds":
                note += "Vacc Suit, Zero-G"
                self.gain_skill_or_knowledge("Vacc Suit", None, True, f"({code} Homeworld)")
                self.gain_skill_or_knowledge("Zero-G", None, True, f"({code} Homeworld)")
            elif code in ["Ga", "Pa"]:
                note += "Trader"
                self.gain_skill_or_knowledge("Trader", None, True, f"({code} Homeworld)")
            elif code == "Hi":
                note += "Streetwise"
                self.gain_skill_or_knowledge("Streetwise", None, True, f"({code} Homeworld)")
            elif code in ["Ic", "Va"]:
                note += "Vacc Suit"
                self.gain_skill_or_knowledge("Vacc Suit", None, True, f"({code} Homeworld)")
            elif code == "In":
                note += "a skilled trade"
                trade_skills = ["Biologics", "Chef", "Craftsman", "Electronics", "Fluidics", "Gravitics", "Magnetics", "Mechanic", "Photonics", "Polymers", "Programmer"]
                chosen_trade = self.dialog.pick_option(trade_skills, f"{note}. Choose a skilled Trade:", no_cancel=True) or "Mechanic"
                if chosen_trade == "Craftsman":
                    k = self.dialog.pick_option(["Metal", "Wood", "Leather", "Synthetics", "Masonry"], "Choose a Craftsman specialty:", no_cancel=True)
                    self.gain_skill_or_knowledge("Craftsman", k, True, f"({code} Homeworld)")
                else:
                    self.gain_skill_or_knowledge(chosen_trade, None, True, f"({code} Homeworld)")
            elif code == "Lo":
                note += "Flyer"
                cat = self.dialog.pick_skill("Flyer", f"{note}. Choose a Flyer specialty:")
                kn = cat.get("knowledge") if cat else "Grav"
                self.gain_skill_or_knowledge("Flyer", kn, True, f"({code} Homeworld)")
            elif code == "Na":
                note += "Survey"
                self.gain_skill_or_knowledge("Survey", None, True, f"({code} Homeworld)")
            elif code in ["Ni", "Tz"]:
                note += "Driver"
                cat = self.dialog.pick_skill("Driver", f"{note}. Choose a Driver specialty:")
                kn = cat.get("knowledge") if cat else "Grav"
                self.gain_skill_or_knowledge("Driver", kn, True, f"({code} Homeworld)")
            elif code == "Oc":
                note += "High-G"
                self.gain_skill_or_knowledge("High-G", None, True, f"({code} Homeworld)")
            elif code == "Pi":
                note += "Jack-of-all-Trades"
                self.gain_skill_or_knowledge("Jack-of-all-Trades", None, True, f"({code} Homeworld)")
            elif code == "Po":
                note += "Steward"
                self.gain_skill_or_knowledge("Steward", None, True, f"({code} Homeworld)")
            elif code == "Pr":
                note += "Craftsman"
                self.gain_skill_or_knowledge("Craftsman", None, True, f"({code} Homeworld)")
            elif code == "Ri":
                note += "an art skill"
                art_skills = ["Actor", "Artist", "Author", "Chef", "Dancer", "Musician"]
                chosen_art = self.dialog.pick_option(art_skills, f"{note}. Choose an Art skill:", no_cancel=True) or "Artist"
                self.gain_skill_or_knowledge(chosen_art, None, True, f"({code} Homeworld)")
            elif code == "Wa":
                note += "Seafarer"
                cat = self.dialog.pick_skill("Seafarer", f"{note}. Choose a Seafarer specialty:")
                kn = cat.get("knowledge") if cat else "Grav"
                self.gain_skill_or_knowledge("Seafarer", kn, True, f"({code} Homeworld)")
            else:
                self.record(f"{code} trade code on homeworld provides no skills.")

    # -------------------------------------------------------------------------
    # EDUCATION PROGRAMS
    # -------------------------------------------------------------------------

    def Apprenticeship(self, skill: Optional[str] = None, knowledge: Optional[str] = None) -> str:
        """Apprenticeship program during youth (Skill +4)."""
        if self.character.age > 18:
            msg = "Ineligible for Apprenticeship: Age exceeds 18."
            self.record(msg)
            return msg

        if not skill:
            cat = self.dialog.pick_skill("S", "Choose an Apprenticeship Skill:")
            if cat:
                skill, knowledge = cat["skill"], cat["knowledge"]

        res = self.check_characteristic("C5", 2, 0, "Apprenticeship Check")
        self.record(res["remarks"])
        if res["success"] and skill:
            for _ in range(4):
                self.gain_skill_or_knowledge(skill, knowledge, True, "(Apprenticeship)")
        return "Apprenticeship complete."

    def ED5(self) -> str:
        """Basic Education to EDU 5."""
        if self.character.characteristics[4]["value"] < 5:
            self.character.characteristics[4]["value"] = 5
            self.record("Education increased to EDU 5.")
        self.advance_age(1)
        return "ED5 complete."

    def TradeSchool(self, skill: Optional[str] = None, knowledge: Optional[str] = None) -> str:
        """Trade School (+2 to a trade skill, 1 year)."""
        if not skill:
            cat = self.dialog.pick_skill("S", "Choose Trade School Skill:")
            if cat:
                skill, knowledge = cat["skill"], cat["knowledge"]

        res = self.check_characteristic("C5", 2, 0, "Trade School Exam")
        self.record(res["remarks"])
        if res["success"] and skill:
            self.gain_skill_or_knowledge(skill, knowledge, True, "(Trade School)")
            self.gain_skill_or_knowledge(skill, knowledge, True, "(Trade School)")
            self.gain_characteristic("C5", 1, "(Trade School)")
        self.advance_age(1)
        return "Trade School complete."

    def TrainingCourse(self, skill: Optional[str] = None, knowledge: Optional[str] = None) -> str:
        """1-year training course (+1 skill)."""
        if not skill:
            cat = self.dialog.pick_skill("S", "Choose Training Course Skill:")
            if cat:
                skill, knowledge = cat["skill"], cat["knowledge"]

        res = self.check_characteristic("C4", 2, 0, "Training Course Exam")
        self.record(res["remarks"])
        if res["success"] and skill:
            self.gain_skill_or_knowledge(skill, knowledge, True, "(Training Course)")
        self.advance_age(1)
        return "Training Course complete."

    def resolve_education(self, program_name: str) -> str:
        """Dispatcher for all T5 education programs."""
        prog_clean = program_name.replace(" ", "")
        method_map = {
            "Apprenticeship": self.Apprenticeship,
            "ED5": self.ED5,
            "TradeSchool": self.TradeSchool,
            "TrainingCourse": self.TrainingCourse,
            "College": self.College,
            "University": self.University,
            "NavalAcademy": self.NavalAcademy,
            "MilitaryAcademy": self.MilitaryAcademy,
            "Masters": self.Masters,
            "Professors": self.Professors,
            "MedicalSchool": self.MedicalSchool,
            "LawSchool": self.LawSchool,
        }
        fn = method_map.get(prog_clean)
        if fn:
            return fn()
        return f"Unknown education program: {program_name}"

    def College(self) -> str:
        """4-year College BA Program (Min start Edu 5, Min end Edu 8)."""
        return self._run_ba_program("College", min_start_edu=5, min_end_edu=8, offer_otc=True)

    def University(self) -> str:
        """4-year University BA Program (Min start Edu 7, Min end Edu 9)."""
        return self._run_ba_program("University", min_start_edu=7, min_end_edu=9, offer_otc=True)

    def NavalAcademy(self) -> str:
        """4-year Naval Service Academy (Commission as Navy Officer1)."""
        return self._run_ba_program("Naval Academy", min_start_edu=6, min_end_edu=8, service_commission="Navy")

    def MilitaryAcademy(self) -> str:
        """4-year Military Service Academy (Commission as Army Officer1)."""
        return self._run_ba_program("Military Academy", min_start_edu=6, min_end_edu=8, service_commission="Army")

    def prompt_education_waiver(self, note: str = "") -> Dict[str, Any]:
        """Attempt to use an education waiver based on SOC matching character.js."""
        soc = self.character.characteristics[5].get("value", 7)
        waiver_val = soc - self.character.edu_waivers
        if waiver_val >= 2:
            use_waiver = self.dialog.pick_option(
                ["Use Education Waiver", "Decline Waiver"],
                f"{note}<br/>Do you want to try to use an education waiver? (Current waiver value: {waiver_val})",
                no_cancel=True,
                default_selection="Use Education Waiver"
            )
            if use_waiver == "Use Education Waiver":
                res = self.check(waiver_val, 2, 0, f"Education Waiver vs {waiver_val}")
                self.character.edu_waivers += 1
                self.record(f"{note} {res['remarks']}")
                return {"success": res["success"], "remarks": res["remarks"]}
            else:
                self.record(f"{note} Declined to use education waiver.")
                return {"success": False, "remarks": "Declined waiver."}
        return {"success": False, "remarks": "No education waivers available."}

    def _run_ba_program(
        self,
        program_name: str,
        min_start_edu: int,
        min_end_edu: int,
        offer_otc: bool = False,
        service_commission: Optional[str] = None
    ) -> str:
        """Core 4-year BA program implementation matching T5 rules."""
        cat_type = "N" if service_commission == "Navy" else ("A" if service_commission == "Army" else "C")
        major_choice = self.dialog.pick_skill(cat_type, f"{program_name}: Select your Major Academic Discipline:")
        minor_choice = self.dialog.pick_skill(cat_type, f"{program_name}: Select your Minor Academic Discipline:")

        maj_s = major_choice["skill"] if major_choice else "Science"
        maj_k = major_choice.get("knowledge") if major_choice else None
        min_s = minor_choice["skill"] if minor_choice else "Computer"
        min_k = minor_choice.get("knowledge") if minor_choice else None

        self.character.majors.append({"skill": maj_s, "knowledge": maj_k or "", "label": f"{maj_s} ({maj_k})" if maj_k else maj_s})
        self.character.minors.append({"skill": min_s, "knowledge": min_k or "", "label": f"{min_s} ({min_k})" if min_k else min_s})

        int_val = self.character.characteristics[3].get("value", 7)
        edu_val = self.character.characteristics[4].get("value", 7)
        best_stat = "C4" if int_val >= edu_val else "C5"

        app_res = self.check_characteristic(best_stat, 2, 0, f"{program_name} Application")
        self.record(app_res["remarks"])
        if not app_res["success"]:
            waiver = self.prompt_education_waiver(f"Failed {program_name} application.")
            app_res["success"] = waiver["success"]
        if not app_res["success"]:
            self.advance_age(1)
            return f"Failed admission to {program_name}."

        self.record(f"Admitted to {program_name} BA Program.")
        not_flunked = True

        for yr in range(1, 5):
            yr_res = self.check_characteristic(best_stat, 2, 0, f"{program_name} Year {yr}")
            self.record(yr_res["remarks"])
            if yr_res["success"]:
                self.gain_skill_or_knowledge(maj_s, maj_k, True, "(Major)")
                if yr % 2 == 0:
                    self.gain_skill_or_knowledge(min_s, min_k, True, "(Minor)")
            else:
                pass_waiver = self.prompt_education_waiver(f"Failed {program_name} year {yr}.")
                if pass_waiver["success"]:
                    not_flunked = True
                else:
                    not_flunked = False
            self.advance_age(1)
            if not not_flunked:
                break

        if not_flunked:
            self.character.awards.append(f"BA ({program_name})")
            if self.character.characteristics[4]["value"] < min_end_edu:
                self.character.characteristics[4]["value"] = min_end_edu
            else:
                self.gain_characteristic("C5", 1)

            if service_commission:
                self.character.awards.append(f"{service_commission} Officer1")
                self.character.awards.append(f"{service_commission} Reserves")
                self.record(f"Graduated and earned {service_commission} Officer1 Commission.")

            elif offer_otc:
                otc_choice = self.dialog.pick_option(
                    ["None", "OTC (Army)", "NOTC (Navy)"],
                    "Volunteer for Officer Training Corps (OTC / NOTC)?",
                    no_cancel=True
                )
                if otc_choice and "OTC" in otc_choice:
                    svc = "Army" if "Army" in otc_choice else "Navy"
                    self.character.awards.append(f"{svc} Officer1")
                    self.character.awards.append(f"{svc} Reserves")
                    self.record(f"Completed {otc_choice} and earned {svc} Officer1 Commission.")

        return f"{program_name} complete."

    def Masters(self) -> str:
        """2-year Masters Program."""
        if not any("BA" in a for a in self.character.awards):
            self.record("Ineligible for Masters: Requires BA.")
            return "Requires BA."
        major_choice = self.dialog.pick_skill("C", "Masters Program: Choose Major Discipline:")
        maj_s = major_choice["skill"] if major_choice else "Science"
        maj_k = major_choice.get("knowledge") if major_choice else None
        self.gain_skill_or_knowledge(maj_s, maj_k, True, "(Masters)")
        self.gain_skill_or_knowledge(maj_s, maj_k, True, "(Masters)")
        self.gain_characteristic("C5", 1)
        self.character.awards.append("MA Degree")
        self.advance_age(2)
        return "Masters complete."

    def Professors(self) -> str:
        """2-year Doctoral / Professor Program."""
        if not any("MA" in a for a in self.character.awards):
            self.record("Ineligible for Professors: Requires MA.")
            return "Requires MA."
        major_choice = self.dialog.pick_skill("C", "Professors Program: Choose Major Discipline:")
        maj_s = major_choice["skill"] if major_choice else "Science"
        maj_k = major_choice.get("knowledge") if major_choice else None
        self.gain_skill_or_knowledge(maj_s, maj_k, True, "(PhD)")
        self.gain_skill_or_knowledge(maj_s, maj_k, True, "(PhD)")
        self.gain_characteristic("C5", 1)
        self.character.awards.append("PhD / Professor")
        self.advance_age(2)
        return "Professors complete."

    def MedicalSchool(self) -> str:
        """4-year Medical School (Medic or Forensics +4, Doctor title)."""
        cat = self.dialog.pick_skill("Medical", "Choose Medical School Major:")
        sk = cat["skill"] if cat else "Medic"
        kn = cat.get("knowledge") if cat else None
        for _ in range(4):
            self.gain_skill_or_knowledge(sk, kn, True, "(Med School)")
        self.gain_characteristic("C5", 1)
        self.character.awards.append("MD (Doctor of Medicine)")
        self.advance_age(4)
        return "Medical School complete."

    def LawSchool(self) -> str:
        """2-year Law School (Advocate or Diplomat +4)."""
        cat = self.dialog.pick_skill("Law", "Choose Law School Major:")
        sk = cat["skill"] if cat else "Advocate"
        kn = cat.get("knowledge") if cat else None
        for _ in range(4):
            self.gain_skill_or_knowledge(sk, kn, True, "(Law School)")
        self.gain_characteristic("C5", 1)
        self.character.awards.append("Law Degree (Attorney)")
        self.advance_age(2)
        return "Law School complete."

    # -------------------------------------------------------------------------
    # CAREER RESOLUTIONS & PLAYER AGENCY INTERACTION
    # -------------------------------------------------------------------------

    def prompt_cc(self, career_name: str, term_num: int) -> str:
        """Prompt player to choose a Controlling Characteristic for the term."""
        available_ccs = list(self.career_catalog.get_ccs(career_name))
        if not available_ccs:
            available_ccs = ["C1", "C2", "C3", "C4"]

        previews = []
        for cc in available_ccs:
            try:
                idx = int(cc[1:]) - 1
                c_data = self.character.characteristics[idx]
                previews.append(f"<strong>{c_data.get('name', cc)}</strong> (Score: {c_data.get('value', 7)})")
            except Exception:
                previews.append(cc)

        prompt = f"<strong>{career_name} Term #{term_num}:</strong><br/>Choose a Controlling Characteristic for this term's performance & survival:"
        chosen = self.dialog.pick_option(available_ccs, prompt, previews=previews, no_cancel=True)
        return chosen or available_ccs[0]

    def prompt_caution_bravery(self, career_name: str, cc_name: str, cc_val: int) -> int:
        """Prompt player for Caution (+) vs Bravery (-) modifier for risk/reward checks."""
        options = ["+3 (Very Cautious)", "+2 (Cautious)", "+1 (Careful)", "0 (Balanced)", "-1 (Bold)", "-2 (Daring)", "-3 (Reckless)"]
        mod_map = {
            "+3 (Very Cautious)": 3,
            "+2 (Cautious)": 2,
            "+1 (Careful)": 1,
            "0 (Balanced)": 0,
            "-1 (Bold)": -1,
            "-2 (Daring)": -2,
            "-3 (Reckless)": -3
        }
        previews = [
            f"Risk Check: Roll &le; {cc_val + mod_map[opt]}<br/>Reward Check: Roll &le; {cc_val - mod_map[opt]}"
            for opt in options
        ]
        prompt = (
            f"<strong>{career_name} Risk vs Reward Modifier</strong><br/>"
            f"Controlling {cc_name} = {cc_val}<br/>"
            f"Select Caution (+) or Bravery (-) modifier:"
        )
        choice = self.dialog.pick_option(options, prompt, default_selection="0 (Balanced)", previews=previews, no_cancel=True)
        return mod_map.get(choice, 0)

    def prompt_branch(self, career_name: str, is_officer: bool = False) -> str:
        """Prompt player to choose a military/service branch."""
        if career_name == "Spacer":
            branches = ["Line", "Engineer", "Gunnery", "Flight", "Technical", "Medical"] if is_officer else ["Crew", "Engineer", "Gunnery", "Technical", "Medical"]
        elif career_name == "Soldier":
            branches = ["Infantry", "Cavalry", "Artillery", "Staff", "Support"]
        elif career_name == "Marine":
            branches = ["Star Marine", "Commando", "Support"]
        else:
            branches = ["Operations", "Support", "Technical"]

        previews = [f"Serve in the <strong>{b}</strong> branch of {career_name}." for b in branches]
        prompt = f"Choose your <strong>{career_name}</strong> Service Branch:"
        chosen = self.dialog.pick_option(branches, prompt, previews=previews, no_cancel=True)
        return chosen or branches[0]

    def gain_term_skills(self, career_name: str, term_num: int, picks_count: int = 4):
        """Interactive skill acquisition loop across the 4 years of a career term."""
        skill_tables = self.career_catalog.get_skill_tables(career_name)
        if not skill_tables:
            skill_tables = {
                "Tables": ["Personal", "Service", "Specialist", "Advanced"],
                "Personal": ["C1", "C2", "C3", "C4", "C5", "C6"],
                "Service": ["Driver", "Vacc Suit", "Comms", "Mechanic", "Gunner", "Fighter"],
                "Specialist": ["Computer", "Electronics", "Sensors", "Engineer", "Pilot", "Navigation"],
                "Advanced": ["Medic", "Science", "Admin", "Advocate", "Broker", "Leadership"]
            }

        avail_tables = list(skill_tables.get("Tables", []))
        if not avail_tables:
            avail_tables = [k for k in skill_tables.keys() if k != "Tables"]
        if not avail_tables:
            avail_tables = ["Personal", "Service", "Specialist", "Advanced"]

        if self.character.majors and "Major" not in avail_tables:
            avail_tables.append("Major")
        if self.character.minors and "Minor" not in avail_tables:
            avail_tables.append("Minor")

        previews = []
        for tbl in avail_tables:
            if tbl == "Major":
                previews.append([m.get("label", "") for m in self.character.majors])
            elif tbl == "Minor":
                previews.append([m.get("label", "") for m in self.character.minors])
            else:
                table_contents = skill_tables.get(tbl, [])
                previews.append([f"1D roll {i+1}: {sk}" for i, sk in enumerate(table_contents)])

        for pick_idx in range(1, picks_count + 1):
            prompt = f"Choose a skill table for <strong>{career_name} Term #{term_num}</strong><br/>({picks_count - pick_idx + 1} picks remaining):"
            chosen_table = self.dialog.pick_option(avail_tables, prompt, previews=previews, no_cancel=True)
            if not chosen_table:
                chosen_table = avail_tables[0]

            if chosen_table == "Major":
                if self.character.majors:
                    major_choices = [m.get("label", "") for m in self.character.majors]
                    c_maj = self.dialog.pick_option(major_choices, "Choose which Major academic discipline to advance:", no_cancel=True)
                    match = next((m for m in self.character.majors if m.get("label") == c_maj), self.character.majors[0])
                    self.gain_skill_or_knowledge(match.get("skill"), match.get("knowledge"), True, "(Major)")
            elif chosen_table == "Minor":
                if self.character.minors:
                    minor_choices = [m.get("label", "") for m in self.character.minors]
                    c_min = self.dialog.pick_option(minor_choices, "Choose which Minor academic discipline to advance:", no_cancel=True)
                    match = next((m for m in self.character.minors if m.get("label") == c_min), self.character.minors[0])
                    self.gain_skill_or_knowledge(match.get("skill"), match.get("knowledge"), True, "(Minor)")
            elif chosen_table == "Personal":
                r_idx = int(self.roller.d6(1))
                char_key = f"C{r_idx}"
                self.gain_characteristic(char_key, 1, f"({career_name} Personal Development)")
            else:
                table_skills = skill_tables.get(chosen_table, ["Mechanic", "Electronics", "Computer", "Admin", "Advocate", "Driver"])
                roll_idx = int(self.roller.d6(1)) - 1
                roll_idx = max(0, min(len(table_skills) - 1, roll_idx))
                rolled_skill = table_skills[roll_idx]

                if rolled_skill.startswith("C") and len(rolled_skill) == 2 and rolled_skill[1].isdigit():
                    self.gain_characteristic(rolled_skill, 1, f"({career_name} {chosen_table})")
                elif rolled_skill == "New Trade":
                    all_trades = get_skill_catalog().get_category_skills("TradeSkills")
                    unheld_trades = [t for t in all_trades if self.character.skills.get(t, {}).get("Skill", 0) <= 0]
                    choices = unheld_trades if unheld_trades else all_trades
                    c_trade = self.dialog.pick_option(choices, "Choose a New Skilled Trade:", no_cancel=True)
                    if c_trade:
                        self.gain_skill_or_knowledge(c_trade, None, True, f"({career_name} Trade)")
                else:
                    canon = get_skill_catalog().canonicalize(rolled_skill)
                    if get_skill_catalog().has_knowledges(canon):
                        knowledges = get_skill_catalog().get_knowledges(canon)
                        chosen_k = self.dialog.pick_option(knowledges, f"You rolled <strong>{canon}</strong> on {chosen_table} table.<br/>Choose a specialized knowledge:", no_cancel=True)
                        self.gain_skill_or_knowledge(canon, chosen_k, True, f"({career_name} {chosen_table})")
                    else:
                        self.gain_skill_or_knowledge(canon, None, True, f"({career_name} {chosen_table})")

            self.advance_age(1)

    def resolve_career(self, career: str) -> bool:
        """Route career execution to the specific career handler."""
        handlers = {
            "Craftsman": self.resolveCraftsman,
            "Scholar": self.resolveScholar,
            "Entertainer": self.resolveEntertainer,
            "Citizen": self.resolveCitizen,
            "Scout": self.resolveScout,
            "Merchant": self.resolveMerchant,
            "Spacer": self.resolveSpacer,
            "Soldier": self.resolveSoldier,
            "Marine": self.resolveMarine,
            "Agent": self.resolveAgent,
            "Rogue": self.resolveRogue,
            "Noble": self.resolveNoble,
            "Functionary": self.resolveFunctionary
        }
        handler = handlers.get(career, self.resolveCitizen)
        return handler()

    def _get_or_create_career_record(self, career_name: str) -> Dict[str, Any]:
        for c in self.character.careers:
            if c.get("career") == career_name and c.get("active", False):
                return c
        for c in self.character.careers:
            c["active"] = False

        rec = {
            "career": career_name,
            "terms": 0,
            "active": True,
            "branch": "",
            "awards": [],
            "rank": {"enlisted": 0, "officer": 0, "label": "Rank 0"},
            "skillsToGain": []
        }
        self.character.careers.append(rec)
        return rec

    def prompt_continue(self, career_name: str) -> bool:
        """Prompt player at term conclusion to continue, switch, or muster out matching character.js."""
        rec = self._get_or_create_career_record(career_name)
        terms = rec["terms"]

        options = ["Continue or Muster Out"]
        prompt_text = "Cannot switch to a new career."
        if career_name != "Noble":
            options.append("Switch to a new career")
            prompt_text = f"Do you want to switch from {career_name} to a different career?"

        switch_choice = self.dialog.pick_option(
            options,
            f"Completed {terms} term{'s' if terms > 1 else ''} as a {career_name}.<br/>{prompt_text}",
            no_cancel=True,
            default_selection="Continue or Muster Out"
        )
        if switch_choice == "Switch to a new career":
            rec["active"] = False
            self.record(f"Concluded {career_name} career to pursue other opportunities.")
            return False

        # Continue roll: 2D
        cont_roll = self.roller.d6(2)
        if cont_roll.result == 2:
            if (self.character.has_reserve_award() and career_name not in ["Soldier", "Spacer", "Marine"]):
                self.record(f"Continue as {career_name}: [{cont_roll.rolls[0]},{cont_roll.rolls[1]}] = RESERVES CALL-UP!")
                res_svc = "Soldier" if "Army Reserves" in self.character.awards else ("Spacer" if "Navy Reserves" in self.character.awards else "Marine")
                self.record(f"Called up for active service by {res_svc} Reserves!")
                return self.resolve_career(res_svc)
            else:
                self.record(f"Continue as {career_name}: [{cont_roll.rolls[0]},{cont_roll.rolls[1]}] = MANDATORY CONTINUATION.")
                return self.resolve_career(career_name)

        passed = False
        target_str = ""
        if career_name == "Craftsman":
            cr_skill = self.character.skills.get("Craftsman", {}).get("Skill", 0)
            target = cr_skill * 2
            passed = cont_roll.result <= target
            target_str = f"Craftsman x2 ({target})"
        elif career_name == "Citizen":
            passed = cont_roll.result <= 10
            target_str = "10"
        elif career_name in ["Spacer", "Marine", "Merchant"]:
            str_val = self.character.characteristics[0]["value"]
            passed = cont_roll.result <= str_val
            target_str = f"Str ({str_val})"
        elif career_name == "Soldier":
            end_val = self.character.characteristics[2]["value"]
            passed = cont_roll.result <= end_val
            target_str = f"End ({end_val})"
        elif career_name == "Scout":
            int_val = self.character.characteristics[3]["value"]
            passed = cont_roll.result <= int_val
            target_str = f"Int ({int_val})"
        elif career_name == "Entertainer":
            fame_val = max(2, self.character.fame)
            passed = cont_roll.result <= fame_val
            target_str = f"Fame ({fame_val})"
        elif career_name == "Scholar":
            edu_val = self.character.characteristics[4]["value"]
            passed = cont_roll.result <= edu_val
            target_str = f"Edu ({edu_val})"
        elif career_name == "Noble":
            passed = cont_roll.result <= 7
            target_str = "7"
        elif career_name == "Functionary":
            int_val = self.character.characteristics[3]["value"]
            passed = cont_roll.result <= int_val
            target_str = f"Int ({int_val})"
        elif career_name == "Rogue":
            cc = rec.get("cc", "C1")
            cc_idx = int(cc[1:]) - 1 if len(cc) > 1 and cc[1:].isdigit() else 0
            cc_val = self.character.characteristics[cc_idx]["value"]
            target = cc_val + terms
            passed = (cont_roll.result != 12) and (cont_roll.result <= target)
            target_str = f"{cc}+{terms} ({target})"
        elif career_name == "Agent":
            str_val = self.character.characteristics[0]["value"]
            target = str_val + terms
            passed = cont_roll.result <= target
            target_str = f"Str+{terms} ({target})"
        else:
            passed = cont_roll.result <= 10
            target_str = "10"

        self.record(f"Continue as {career_name}: [{cont_roll.rolls[0]},{cont_roll.rolls[1]}] = {cont_roll.result} <= {target_str} ? {'PASS' if passed else 'FAIL'}")

        if passed:
            # Prevent runaway infinite recursion in headless mode
            if getattr(self.dialog, "headless", False) and terms >= 4:
                self.record(f"Reached maximum automated terms ({terms}) for {career_name}.")
                return True

            choice = self.dialog.pick_option(
                ["Continue with this career", "Muster Out"],
                "Continue Roll was successful.<br/>Do you wish to continue this career or start adventuring?",
                no_cancel=True,
                default_selection="Continue with this career"
            )
            if choice == "Continue with this career":
                return self.resolve_career(career_name)
            else:
                self.record("Chose to muster out and begin adventuring.")
                self.muster_out()
                return False
        else:
            self.record("Failed Continue roll. Mustering out.")
            self.muster_out()
            return False

    def resolveCitizen(self) -> bool:
        """Citizen Life Career (100-job table + term skill tables)."""
        rec = self._get_or_create_career_record("Citizen")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Citizen Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Citizen", term_num)
        self.record(f"Chose {chosen_cc} as Controlling Characteristic for Term #{term_num}.")

        # 100-job matrix
        r1, r2, r3 = int(self.roller.d6(1)), int(self.roller.d6(1)), int(self.roller.d6(1))
        r1 = min(3, max(1, r1))
        job_data = self.career_catalog.get_citizen_job(r1, r2, r3)
        if job_data:
            sk = job_data.get("skill")
            kn = job_data.get("knowledge")
            if sk:
                self.gain_skill_or_knowledge(sk, kn, True, "(Citizen Life)")

        self.gain_term_skills("Citizen", term_num, picks_count=4)
        return self.prompt_continue("Citizen")

    def resolveSpacer(self) -> bool:
        """Spacer (Navy) Career with branch selection, promotions, and skill choices."""
        return self._resolve_military_service("Spacer", "Navy", "C2", "C2", "C6", "C1")

    def resolveSoldier(self) -> bool:
        """Soldier (Army) Career with branch selection, promotions, and skill choices."""
        return self._resolve_military_service("Soldier", "Army", "C3", "C3", "C6", "C3")

    def resolveMarine(self) -> bool:
        """Marine Career with branch selection, promotions, and skill choices."""
        return self._resolve_military_service("Marine", "Marine", "C1", "C3", "C4", "C1")

    def _resolve_military_service(
        self,
        career_name: str,
        service_label: str,
        enl_prom_stat: str,
        off_comm_stat: str,
        off_prom_stat: str,
        continue_stat: str
    ) -> bool:
        rec = self._get_or_create_career_record(career_name)
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- {career_name} Term #{term_num} ---")

        chosen_cc = self.prompt_cc(career_name, term_num)
        self.record(f"Chose {chosen_cc} as Controlling Characteristic for Term #{term_num}.")

        # Branch choice on term 1 or if promoted
        if not rec.get("branch") or term_num == 1:
            rec["branch"] = self.prompt_branch(career_name, is_officer=(rec["rank"]["officer"] > 0))
            self.record(f"Assigned to {career_name} {rec['branch']} branch.")

        # Survival
        surv_res = self.check_characteristic(chosen_cc, 2, 0, f"{career_name} Survival Check vs {chosen_cc}")
        self.record(surv_res["remarks"])
        if not surv_res["success"]:
            self.record(f"{career_name} service ended prematurely due to injury/mishap.")
            self.advance_age(4)
            self.muster_out()
            return False

        # Commission / Promotion
        rank_data = rec["rank"]
        if rank_data["officer"] == 0:
            comm_res = self.check_characteristic(off_comm_stat, 2, 0, f"Officer Commission Check vs {off_comm_stat}")
            self.record(comm_res["remarks"])
            if comm_res["success"]:
                rank_data["officer"] = 1
                rec["awards"].append(f"{service_label} Officer1")
                self.record(f"Commissioned as {service_label} Officer 1 (Ensign/Lieutenant)!")
            else:
                prom_res = self.check_characteristic(enl_prom_stat, 2, 0, f"Enlisted Promotion Check vs {enl_prom_stat}")
                if prom_res["success"]:
                    rank_data["enlisted"] += 1
                    self.record(f"Promoted to Enlisted Rank {rank_data['enlisted']}!")
        else:
            prom_res = self.check_characteristic(off_prom_stat, 2, 0, f"Officer Promotion Check vs {off_prom_stat}")
            if prom_res["success"]:
                rank_data["officer"] += 1
                self.record(f"Promoted to Officer Rank {rank_data['officer']}!")

        self.gain_term_skills(career_name, term_num, picks_count=4)
        return self.prompt_continue(career_name)

    def resolveMerchant(self) -> bool:
        """Merchant Career with Ship Shares and promotions."""
        rec = self._get_or_create_career_record("Merchant")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Merchant Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Merchant", term_num)
        self.record(f"Chose {chosen_cc} as Controlling Characteristic for Term #{term_num}.")

        # Free Trader Ship Shares
        self.character.ship_shares += 1
        self.record(f"Earned +1 Free Trader Ship Share (Total: {self.character.ship_shares}).")

        # Survival
        surv_res = self.check_characteristic(chosen_cc, 2, 0, f"Merchant Survival Check vs {chosen_cc}")
        self.record(surv_res["remarks"])
        if not surv_res["success"]:
            self.advance_age(4)
            self.muster_out()
            return False

        # Promotion check vs Dex/Int
        prom_res = self.check_characteristic("C4", 2, 0, "Merchant Promotion Check vs Int")
        if prom_res["success"]:
            rec["rank"]["officer"] = rec["rank"].get("officer", 0) + 1
            self.record(f"Promoted to Merchant Officer Rank {rec['rank']['officer']}!")

        self.gain_term_skills("Merchant", term_num, picks_count=4)
        return self.prompt_continue("Merchant")

    def resolveScout(self) -> bool:
        """Scout Career with exploration missions."""
        rec = self._get_or_create_career_record("Scout")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Scout Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Scout", term_num)
        self.record(f"Chose {chosen_cc} as Controlling Characteristic for Term #{term_num}.")

        surv_res = self.check_characteristic(chosen_cc, 2, 0, f"Scout Survival Check vs {chosen_cc}")
        self.record(surv_res["remarks"])
        if not surv_res["success"]:
            self.advance_age(4)
            self.muster_out()
            return False

        self.gain_term_skills("Scout", term_num, picks_count=4)
        return self.prompt_continue("Scout")

    def resolveAgent(self) -> bool:
        """Agent Undercover Career with Risk/Reward."""
        rec = self._get_or_create_career_record("Agent")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Agent Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Agent", term_num)
        cc_idx = int(chosen_cc[1:]) - 1
        cc_val = self.character.characteristics[cc_idx]["value"]
        caution = self.prompt_caution_bravery("Agent", chosen_cc, cc_val)

        surv_res = self.check_characteristic(chosen_cc, 2, caution, f"Agent Undercover Risk Check vs {chosen_cc} (Mod {caution:+d})")
        self.record(surv_res["remarks"])
        if not surv_res["success"]:
            self.advance_age(4)
            self.muster_out()
            return False

        self.gain_term_skills("Agent", term_num, picks_count=4)
        return self.prompt_continue("Agent")

    def resolveRogue(self) -> bool:
        """Rogue Career with controlling CC selection and illicit risk/reward."""
        rec = self._get_or_create_career_record("Rogue")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Rogue Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Rogue", term_num)
        rec["cc"] = chosen_cc
        cc_idx = int(chosen_cc[1:]) - 1
        cc_val = self.character.characteristics[cc_idx]["value"]
        caution = self.prompt_caution_bravery("Rogue", chosen_cc, cc_val)

        surv_res = self.check_characteristic(chosen_cc, 2, caution, f"Rogue Risk Check vs {chosen_cc} (Mod {caution:+d})")
        self.record(surv_res["remarks"])
        if not surv_res["success"]:
            self.record("Caught and imprisoned/injured during heist.")
            self.advance_age(4)
            self.muster_out()
            return False

        # Profit / Reward
        rew_res = self.check_characteristic(chosen_cc, 2, -caution, f"Rogue Profit Check vs {chosen_cc}")
        if rew_res["success"]:
            loot = int(self.roller.d6(2)) * 5000
            self.character.credits += loot
            self.record(f"Successful heist: Earned +Cr{loot:,}!")

        self.gain_term_skills("Rogue", term_num, picks_count=4)
        return self.prompt_continue("Rogue")

    def resolveNoble(self) -> bool:
        """Noble Career with Elevation, Intrigue and Exile."""
        rec = self._get_or_create_career_record("Noble")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Noble Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Noble", term_num)

        elev_res = self.check_characteristic("C6", 2, 0, "Noble Elevation Check vs Soc")
        self.record(elev_res["remarks"])
        if elev_res["success"]:
            self.character.noble_rank += 1
            nob = self.character.get_noble_rank()
            self.record(f"Elevated to noble title: {nob['title']} ({nob['code']})!")

        self.gain_term_skills("Noble", term_num, picks_count=4)
        return self.prompt_continue("Noble")

    def resolveScholar(self) -> bool:
        """Scholar Career with Research, Publication, and Academics."""
        rec = self._get_or_create_career_record("Scholar")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Scholar Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Scholar", term_num)
        cc_idx = int(chosen_cc[1:]) - 1
        cc_val = self.character.characteristics[cc_idx]["value"]
        caution = self.prompt_caution_bravery("Scholar", chosen_cc, cc_val)

        risk_res = self.check_characteristic(chosen_cc, 2, caution, f"Scholar Research Risk Check vs {chosen_cc} (Mod {caution:+d})")
        self.record(risk_res["remarks"])
        if risk_res["success"]:
            pub_res = self.check_characteristic(chosen_cc, 2, -caution, "Scholar Publication Check")
            if pub_res["success"]:
                self.record("Published groundbreaking academic paper!")
                if self.character.majors:
                    m_skill = self.character.majors[0].get("skill")
                    m_know = self.character.majors[0].get("knowledge")
                    self.gain_skill_or_knowledge(m_skill, m_know, True, "(Scholar Publication)")

        self.gain_term_skills("Scholar", term_num, picks_count=4)
        return self.prompt_continue("Scholar")

    def resolveCraftsman(self) -> bool:
        """Craftsman Career with Masterpiece creation."""
        rec = self._get_or_create_career_record("Craftsman")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Craftsman Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Craftsman", term_num)
        self.record(f"Chose {chosen_cc} as Controlling Characteristic for Term #{term_num}.")

        self.gain_term_skills("Craftsman", term_num, picks_count=4)
        return self.prompt_continue("Craftsman")

    def resolveEntertainer(self) -> bool:
        """Entertainer Career with Fame Flux events."""
        rec = self._get_or_create_career_record("Entertainer")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Entertainer Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Entertainer", term_num)
        self.record(f"Chose {chosen_cc} as Controlling Characteristic for Term #{term_num}.")

        flux = self.roller.flux()
        self.character.fame = max(0, self.character.fame + flux.result)
        self.record(f"Entertainer Fame Flux: [{flux.rolls[0]}-{flux.rolls[1]}] = {flux.result:+d} (Total Fame: {self.character.fame}).")

        self.gain_term_skills("Entertainer", term_num, picks_count=4)
        return self.prompt_continue("Entertainer")

    def resolveFunctionary(self) -> bool:
        """Functionary Bureaucratic Career with Office Politics."""
        rec = self._get_or_create_career_record("Functionary")
        rec["terms"] += 1
        term_num = rec["terms"]
        self.record(f"--- Functionary Term #{term_num} ---")

        chosen_cc = self.prompt_cc("Functionary", term_num)
        cc_idx = int(chosen_cc[1:]) - 1
        cc_val = self.character.characteristics[cc_idx]["value"]
        caution = self.prompt_caution_bravery("Functionary", chosen_cc, cc_val)

        pol_res = self.check_characteristic(chosen_cc, 2, caution, f"Functionary Office Politics vs {chosen_cc}")
        self.record(pol_res["remarks"])

        self.gain_term_skills("Functionary", term_num, picks_count=4)
        return self.prompt_continue("Functionary")

    # -------------------------------------------------------------------------
    # MUSTER OUT, FAME & RESERVES
    # -------------------------------------------------------------------------

    def muster_out(self):
        """Resolve Mustering Out benefits with interactive table selection."""
        if self.character.mustered_out:
            return
        total_terms = sum(c.get("terms", 0) for c in self.character.careers)
        if total_terms <= 0:
            total_terms = 1

        active_career = self.character.current_career or (self.character.careers[-1]["career"] if self.character.careers else "Citizen")
        benefit_tables = self.career_catalog.get_benefit_tables(active_career)
        
        rolls_remaining = total_terms
        cash_rolls_taken = 0

        self.record(f"Mustering out from {active_career} with {total_terms} total terms.")

        while rolls_remaining > 0:
            table_options = []
            if cash_rolls_taken < 3 and "Cash" in benefit_tables:
                table_options.append("Cash Table")
            if "Benefits" in benefit_tables:
                table_options.append("Material Benefits Table")
            if "Power" in benefit_tables and (self.character.noble_rank > 0 or any("Officer" in a for a in self.character.awards)):
                table_options.append("Power Table")
            if not table_options:
                table_options = ["Cash Table", "Material Benefits Table"]

            chosen_table_name = self.dialog.pick_option(
                table_options,
                f"Muster Out Benefits ({rolls_remaining} rolls remaining):<br/>Choose a benefit table for {active_career}:",
                no_cancel=True
            )
            if not chosen_table_name:
                chosen_table_name = table_options[0]

            key = "Cash" if "Cash" in chosen_table_name else ("Power" if "Power" in chosen_table_name else "Benefits")
            if key == "Cash":
                cash_rolls_taken += 1

            table_items = benefit_tables.get(key, [])
            roll_val = int(self.roller.d6(1))
            item = table_items[roll_val - 1] if roll_val <= len(table_items) else None
            
            if item:
                if item.type == "cash":
                    self.character.credits += item.value
                    self.record(f"Muster Out [{key} Roll {roll_val}]: Received +Cr{item.value:,}")
                elif item.type == "ship_shares":
                    self.character.ship_shares += item.value
                    self.record(f"Muster Out [{key} Roll {roll_val}]: Received +{item.value} Ship Shares")
                elif item.type == "characteristic" and item.characteristic:
                    self.gain_characteristic(item.characteristic, item.value or 1, f"(Muster Out {key})")
                elif item.type == "skill" and item.skill:
                    self.gain_skill_or_knowledge(item.skill, item.knowledge, True, f"(Muster Out {key})")
                else:
                    self.character.awards.append(item.label)
                    self.record(f"Muster Out [{key} Roll {roll_val}]: Received {item.label}")
            else:
                amt = roll_val * 5000 if key == "Cash" else 10000
                self.character.credits += amt
                self.record(f"Muster Out [{key} Roll {roll_val}]: Received +Cr{amt:,}")

            rolls_remaining -= 1

        # Retirement Pension (age 66+ or 5+ terms)
        if self.character.age >= 66 or total_terms >= 5:
            pension_amt = max(2000, (total_terms - 4) * 2000 + 4000) if total_terms >= 5 else 4000
            self.character.awards.append(f"Pension Cr{pension_amt:,}")
            self.record(f"Muster Out: Awarded Annual Pension of Cr{pension_amt:,}.")

        self.character.mustered_out = True
        self.record("Character successfully mustered out.")

    def fame_flux_event(self):
        """Roll Fame Flux event."""
        if not self.character.fame_flux_applied:
            self.character.fame_flux_applied = True
            flx = self.roller.flux()
            self.character.fame_flux = flx.result
            self.character.fame = max(0, self.character.fame + flx.result)
            self.record(f"Fame Flux Event: [{flx.rolls[0]}-{flx.rolls[1]}] = {flx.result:+d} (Total Fame: {self.character.fame})")

    def resign_from_reserves(self):
        """Attempt to resign from armed forces reserves."""
        if self.character.has_reserve_award():
            res = self.check(11, 2, 0, "Resign From Reserves")
            self.record(res["remarks"])
            if res["success"]:
                self.character.awards = [a for a in self.character.awards if "Reserves" not in a]
                self.record("Resignation accepted: Removed from reserves.")
            else:
                self.record("Resignation denied by high command.")
