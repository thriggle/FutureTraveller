"""
Skill data models and taxonomy for Traveller 5 Character Generation.
"""
from __future__ import annotations
import json
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, field


DEFAULT_SKILLS = [
    "Actor", "Artist", "Athlete", "Author", "Comms",
    "Driver", "Fighter", "Mechanic", "Steward", "Vacc Suit"
]


class SkillEntry(dict):
    """Skill entry supporting dictionary indexing ('Skill', 'Knowledge') and object properties (.level, .knowledges)."""
    def __init__(self, level: int = 0, knowledges: Optional[Dict[str, int]] = None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if "Skill" not in self:
            self["Skill"] = level
        if "Knowledge" not in self:
            self["Knowledge"] = knowledges if knowledges is not None else {}

    @property
    def level(self) -> int:
        return self.get("Skill", 0)

    @level.setter
    def level(self, val: int):
        self["Skill"] = val

    @property
    def knowledges(self) -> Dict[str, int]:
        if "Knowledge" not in self:
            self["Knowledge"] = {}
        return self["Knowledge"]

    @knowledges.setter
    def knowledges(self, val: Dict[str, int]):
        self["Knowledge"] = val

    def to_dict(self) -> dict:
        return {
            "Skill": self.level,
            "Knowledge": dict(self.knowledges)
        }

    @classmethod
    def from_dict(cls, d: dict) -> SkillEntry:
        level = d.get("Skill", d.get("level", 0))
        knowledges = d.get("Knowledge", d.get("knowledges", {}))
        return cls(level=level, knowledges=dict(knowledges))


class SkillCatalog:
    """Catalog of T5 skills, categories, and knowledge specialties."""
    def __init__(self, skills_path: Optional[Path] = None):
        if skills_path is None:
            skills_path = Path(__file__).parent.parent.parent / "data" / "skills.json"
        self.skills_path = skills_path
        self.skills: List[str] = []
        self.skill_map: Dict[str, str] = {}
        self.categories: Dict[str, List[str]] = {}
        self.knowledges: Dict[str, List[str]] = {}
        self.load()

    def load(self):
        if not self.skills_path.exists():
            return
        with open(self.skills_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            self.skills = data.get("skills", [])
            self.skill_map = data.get("skillMap", {})
            self.categories = data.get("categories", {})
            self.knowledges = data.get("knowledges", {})

    def canonicalize(self, skill_name: str) -> str:
        return self.skill_map.get(skill_name, skill_name)

    def get_category_skills(self, category_name: str) -> List[str]:
        # Handle variations like "One Art", "Art", "ArtSkills"
        clean_name = category_name.replace("One ", "").strip()
        if not clean_name.endswith("Skills"):
            clean_name = clean_name + "Skills"
        return self.categories.get(clean_name, self.categories.get(category_name, []))

    def get_knowledges(self, skill_name: str) -> List[str]:
        canon = self.canonicalize(skill_name)
        return self.knowledges.get(canon, [])

    def has_knowledges(self, skill_name: str) -> bool:
        canon = self.canonicalize(skill_name)
        return canon in self.knowledges and len(self.knowledges[canon]) > 0


_skill_catalog: Optional[SkillCatalog] = None

def get_skill_catalog() -> SkillCatalog:
    global _skill_catalog
    if _skill_catalog is None:
        _skill_catalog = SkillCatalog()
    return _skill_catalog
