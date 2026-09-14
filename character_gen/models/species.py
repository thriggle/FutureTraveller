"""
Species data models and loader for Traveller 5 Character Generation.
"""
from __future__ import annotations
import json
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, field


@dataclass
class CharacteristicFormula:
    name: str
    nD: int = 2
    mod: int = 0


@dataclass
class Species:
    id: str
    species_name: str
    native_language: str = "Anglic"
    stat_profile: str = "SDEIES"
    height: str = "1.8m"
    weight: str = "100kg"
    notes: str = ""
    base_senses: List[str] = field(default_factory=list)
    characteristics: List[CharacteristicFormula] = field(default_factory=list)
    gender_table: List[str] = field(default_factory=list)
    caste_table: List[str] = field(default_factory=list)
    genders: Dict[str, Dict] = field(default_factory=dict)
    castes: Dict[str, Dict] = field(default_factory=dict)
    life_stage_terms: List[float] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: dict) -> Species:
        chars = []
        for c in data.get("characteristics", []):
            chars.append(CharacteristicFormula(
                name=c.get("name", ""),
                nD=c.get("nD", 2),
                mod=c.get("mod", 0)
            ))
        return cls(
            id=data.get("id", ""),
            species_name=data.get("speciesName", data.get("name", "")),
            native_language=data.get("nativeLanguage", "Anglic"),
            stat_profile=data.get("statProfile", "SDEIES"),
            height=data.get("height", "1.8m"),
            weight=data.get("weight", "100kg"),
            notes=data.get("notes", ""),
            base_senses=data.get("baseSenses", []),
            characteristics=chars,
            gender_table=data.get("genderTable", ["F", "M"]),
            caste_table=data.get("casteTable", ["N/A"]),
            genders=data.get("genders", {}),
            castes=data.get("castes", {}),
            life_stage_terms=data.get("lifeStageTerms", [])
        )


class SpeciesCatalog:
    """Catalog of loaded species."""
    def __init__(self, species_dir: Optional[Path] = None):
        self.species: Dict[str, Species] = {}
        if species_dir is None:
            species_dir = Path(__file__).parent.parent.parent / "data" / "species"
        self.species_dir = species_dir
        self.load_all()

    def load_all(self):
        if not self.species_dir.exists():
            return
        for json_file in self.species_dir.glob("*.json"):
            if json_file.name == "index.json":
                continue
            try:
                with open(json_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    sp = Species.from_dict(data)
                    self.species[sp.id.lower()] = sp
            except Exception as e:
                print(f"Warning: Failed to load species file {json_file}: {e}")

    def get(self, species_id: str) -> Optional[Species]:
        return self.species.get(species_id.lower())

    def list_species(self) -> List[Species]:
        return list(self.species.values())


# Global singleton catalog instance
_catalog: Optional[SpeciesCatalog] = None

def get_species_catalog() -> SpeciesCatalog:
    global _catalog
    if _catalog is None:
        _catalog = SpeciesCatalog()
    return _catalog
