"""
Data models and loaders for Traveller 5 datasets.
Can be imported by both Python CLI/GUI applications and automated test suites.
"""
from dataclasses import dataclass, field
import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_json(filepath: Path | str) -> Any:
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@dataclass
class SkillsData:
    version: int
    skills: List[str]
    categories: Dict[str, List[str]]
    knowledges: Dict[str, List[str]]

    @classmethod
    def load(cls, data_dir: Path = DATA_DIR) -> "SkillsData":
        raw = load_json(data_dir / "skills.json")
        return cls(
            version=raw.get("version", 1),
            skills=raw["skills"],
            categories=raw["categories"],
            knowledges=raw["knowledges"]
        )

@dataclass
class SpeciesProfile:
    id: str
    species_name: str
    native_language: str
    stat_profile: str
    height: str
    weight: str
    notes: str
    base_senses: List[str]
    characteristics: List[Dict[str, Any]]
    genders: Dict[str, Any]
    castes: Dict[str, Any]
    gender_table: List[str]
    caste_table: List[str]
    life_stage_terms: List[float]

    @classmethod
    def load(cls, species_id: str, data_dir: Path = DATA_DIR) -> "SpeciesProfile":
        raw = load_json(data_dir / "species" / f"{species_id}.json")
        return cls(
            id=raw["id"],
            species_name=raw["speciesName"],
            native_language=raw["nativeLanguage"],
            stat_profile=raw["statProfile"],
            height=raw["height"],
            weight=raw["weight"],
            notes=raw["notes"],
            base_senses=raw["baseSenses"],
            characteristics=raw["characteristics"],
            genders=raw["genders"],
            castes=raw["castes"],
            gender_table=raw["genderTable"],
            caste_table=raw["casteTable"],
            life_stage_terms=raw["lifeStageTerms"]
        )

@dataclass
class CareersData:
    version: int
    career_list: List[str]
    career_characteristics: Dict[str, List[str]]
    service_branch_mods: Dict[str, Dict[str, int]]
    career_skill_tables: Dict[str, Any]
    career_benefit_tables: Dict[str, Any]

    @classmethod
    def load(cls, data_dir: Path = DATA_DIR) -> "CareersData":
        raw = load_json(data_dir / "careers.json")
        return cls(
            version=raw.get("version", 1),
            career_list=raw["careerList"],
            career_characteristics=raw["careerCharacteristics"],
            service_branch_mods=raw["serviceBranchMods"],
            career_skill_tables=raw["careerSkillTables"],
            career_benefit_tables=raw["careerBenefitTables"]
        )

@dataclass
class StarshipDrivesData:
    drive_classes: Dict[str, Dict[str, Any]]
    drive_types: List[str]
    drive_stages: Dict[str, Dict[str, Any]]

    @classmethod
    def load(cls, data_dir: Path = DATA_DIR) -> "StarshipDrivesData":
        raw = load_json(data_dir / "starships" / "drives.json")
        return cls(
            drive_classes=raw["driveClasses"],
            drive_types=raw["driveTypes"],
            drive_stages=raw["driveStages"]
        )

@dataclass
class StarshipHullsData:
    hull_types: List[str]
    hull_configs: Dict[str, Dict[str, Any]]
    hull_fittings: Dict[str, Dict[str, Any]]
    hull_armor: Dict[str, Dict[str, Any]]
    stage_effects: Dict[str, Dict[str, Any]]
    space_ranges: Dict[str, Any]

    @classmethod
    def load(cls, data_dir: Path = DATA_DIR) -> "StarshipHullsData":
        raw = load_json(data_dir / "starships" / "hulls.json")
        return cls(
            hull_types=raw["hullTypes"],
            hull_configs=raw["hullConfigs"],
            hull_fittings=raw["hullFittings"],
            hull_armor=raw["hullArmor"],
            stage_effects=raw["stageEffects"],
            space_ranges=raw["spaceRanges"]
        )
