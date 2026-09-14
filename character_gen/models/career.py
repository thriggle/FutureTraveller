"""
Career data models and tables for Traveller 5 Character Generation.
"""
from __future__ import annotations
import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field


CAREER_LIST = [
    "Craftsman", "Scholar", "Entertainer", "Citizen",
    "Scout", "Merchant", "Spacer", "Soldier",
    "Agent", "Rogue", "Noble", "Marine", "Functionary"
]


@dataclass
class BenefitItem:
    label: str
    type: str  # "cash", "characteristic", "award", "skill", "knowledge", "ship_shares"
    value: int = 0
    characteristic: Optional[str] = None
    skill: Optional[str] = None
    knowledge: Optional[str] = None

    @classmethod
    def from_dict(cls, d: dict) -> BenefitItem:
        if isinstance(d, (int, str)):
            # If plain cash integer or string
            if isinstance(d, int):
                return cls(label=f"Cr{d:,}", type="cash", value=d)
            return cls(label=str(d), type="award")
        return cls(
            label=d.get("label", ""),
            type=d.get("type", "award"),
            value=d.get("value", 0),
            characteristic=d.get("characteristic"),
            skill=d.get("skill"),
            knowledge=d.get("knowledge")
        )


class CareerCatalog:
    """Catalog of T5 Careers, Skill Tables, Benefits, and Citizen Jobs."""
    def __init__(self, careers_path: Optional[Path] = None, jobs_path: Optional[Path] = None):
        base_dir = Path(__file__).parent.parent.parent / "data"
        if careers_path is None:
            careers_path = base_dir / "careers.json"
        if jobs_path is None:
            jobs_path = base_dir / "citizen_jobs.json"
        self.careers_path = careers_path
        self.jobs_path = jobs_path
        self.career_list: List[str] = list(CAREER_LIST)
        self.career_map: Dict[str, str] = {}
        self.career_characteristics: Dict[str, List[str]] = {}
        self.service_branch_mods: Dict[str, Dict[str, int]] = {}
        self.career_skill_tables: Dict[str, Dict[str, Any]] = {}
        self.career_benefit_tables: Dict[str, Dict[str, List[Any]]] = {}
        self.citizen_jobs: List[List[List[dict]]] = []
        self.load()

    def load(self):
        if self.careers_path.exists():
            with open(self.careers_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.career_list = data.get("careerList", self.career_list)
                self.career_map = data.get("careerMap", {})
                self.career_characteristics = data.get("careerCharacteristics", {})
                self.service_branch_mods = data.get("serviceBranchMods", {})
                self.career_skill_tables = data.get("careerSkillTables", {})
                self.career_benefit_tables = data.get("careerBenefitTables", {})
        if self.jobs_path.exists():
            with open(self.jobs_path, "r", encoding="utf-8") as f:
                self.citizen_jobs = json.load(f)

    def get_ccs(self, career: str) -> List[str]:
        return self.career_characteristics.get(career, ["C1", "C2", "C3", "C4"])

    def get_skill_tables(self, career: str) -> Dict[str, Any]:
        return self.career_skill_tables.get(career, {})

    def get_benefit_tables(self, career: str) -> Dict[str, List[BenefitItem]]:
        raw_tables = self.career_benefit_tables.get(career, {})
        result = {}
        for table_name, items in raw_tables.items():
            result[table_name] = [BenefitItem.from_dict(item) if isinstance(item, dict) else BenefitItem.from_dict({"label": str(item)}) for item in items]
        return result

    def get_citizen_job(self, r1: int, r2: int, r3: int) -> Optional[dict]:
        """Lookup job from 3d6 rolls (r1: 1-3, r2: 1-6, r3: 1-6)."""
        try:
            return self.citizen_jobs[r1 - 1][r2 - 1][r3 - 1]
        except (IndexError, TypeError):
            return None


_career_catalog: Optional[CareerCatalog] = None

def get_career_catalog() -> CareerCatalog:
    global _career_catalog
    if _career_catalog is None:
        _career_catalog = CareerCatalog()
    return _career_catalog
