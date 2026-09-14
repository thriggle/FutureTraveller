"""
JSON export and import routines for T5 Character.
"""
from __future__ import annotations
import json
from pathlib import Path
from character_gen.models.character import Character


def export_character_json(character: Character, file_path: Path):
    """Save Character to JSON file."""
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(character.to_dict(), f, indent=2)


def import_character_json(file_path: Path) -> Character:
    """Load Character from JSON file."""
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        return Character.from_dict(data)
