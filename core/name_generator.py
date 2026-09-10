"""
Procedural Name Generator for Traveller cultures and starships.
Loads template dictionaries from data/names.jsonc and evaluates token templates.
"""
from pathlib import Path
import re
from typing import Any, Callable, Dict, List, Optional
import json5
from core.dice import DiceRoller, get_roller

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def add_caps(text: str) -> str:
    """Capitalize words separated by spaces or hyphens."""
    result = []
    last_char = " "
    for char in text:
        if last_char in (" ", "-"):
            result.append(char.upper())
        else:
            result.append(char)
        last_char = char
    return "".join(result)

class NameGenerator:
    def __init__(self, data_path: Optional[Path] = None, seed: Optional[str] = None):
        if data_path is None:
            data_path = DATA_DIR / "names.jsonc"
        with open(data_path, "r", encoding="utf-8") as f:
            raw_data = json5.load(f)
        
        self.roller = get_roller(seed)
        self.templates: Dict[str, List[str]] = {}
        self._build_templates(raw_data)
        self.forbidden_words = ["bitch", "anus", "ass"]

    def set_seed(self, seed: str):
        self.roller = get_roller(seed)

    def _build_templates(self, obj: Dict[str, Any]):
        for key, collection in obj.items():
            if key == "patterns":
                continue
            self.templates[key] = self._extract_weighted_patterns(collection)
            if isinstance(collection, dict):
                for subkey, subcollection in collection.items():
                    if subkey == "patterns":
                        continue
                    self.templates[f"{key}.{subkey}"] = self._extract_weighted_patterns(subcollection)
                    if isinstance(subcollection, dict):
                        for subsubkey, subsubcollection in subcollection.items():
                            if subsubkey == "patterns":
                                continue
                            self.templates[f"{key}.{subkey}.{subsubkey}"] = self._extract_weighted_patterns(subsubcollection)

    def _extract_weighted_patterns(self, collection: Any) -> List[str]:
        weighted: List[str] = []
        patterns = []
        if isinstance(collection, dict) and "patterns" in collection:
            patterns = collection["patterns"]
        elif isinstance(collection, list):
            patterns = collection

        for pattern in patterns:
            weight = 1
            pattern_text = ""
            if isinstance(pattern, dict):
                weight = pattern.get("weight", 1)
                pattern_text = pattern.get("format", "")
            elif isinstance(pattern, str):
                if ":" in pattern:
                    parts = pattern.split(":", 1)
                    try:
                        weight = int(parts[0])
                        pattern_text = parts[1]
                    except ValueError:
                        pattern_text = pattern
                else:
                    pattern_text = pattern
            
            for _ in range(max(1, weight)):
                weighted.append(pattern_text)
        return weighted

    def unpack_string_template(self, template: str) -> List[List[Dict[str, Any]]]:
        if not template:
            return [[{"text": ""}]]
        
        # Split top level choices on '|'
        bracket_depth = 0
        phrase_strings = []
        curr = []
        for char in template:
            if char == "{":
                bracket_depth += 1
                curr.append(char)
            elif char == "}":
                bracket_depth -= 1
                curr.append(char)
            elif char == "|" and bracket_depth == 0:
                phrase_strings.append("".join(curr))
                curr = []
            else:
                curr.append(char)
        if curr:
            phrase_strings.append("".join(curr))

        # For each phrase, extract segments
        phrases: List[List[Dict[str, Any]]] = []
        for phrase_str in phrase_strings:
            segments: List[Dict[str, Any]] = []
            is_text = True
            is_ref = False
            is_ref_array = False
            curr_str = []
            ref_arr = []

            for char in phrase_str:
                if char == "{":
                    if curr_str and is_text:
                        segments.append({"text": "".join(curr_str)})
                    is_text = False
                    is_ref = True
                    curr_str = []
                elif char == "}":
                    if is_ref:
                        segments.append({"reference": "".join(curr_str)})
                        is_ref = False
                        curr_str = []
                    elif is_ref_array:
                        ref_arr.append("".join(curr_str))
                        segments.append({"references": list(ref_arr)})
                        is_ref_array = False
                        ref_arr = []
                        curr_str = []
                elif char == "|":
                    if is_ref:
                        is_ref_array = True
                        is_ref = False
                        ref_arr.append("".join(curr_str))
                        curr_str = []
                    elif is_ref_array:
                        ref_arr.append("".join(curr_str))
                        curr_str = []
                else:
                    if not is_ref and not is_ref_array:
                        is_text = True
                    curr_str.append(char)
            if curr_str and is_text:
                segments.append({"text": "".join(curr_str)})
            phrases.append(segments)
        return phrases

    def get_random_name(self, key: str, banned_words: Optional[List[str]] = None, top_level: bool = True) -> str:
        if banned_words is None:
            banned_words = self.forbidden_words
        
        templates = self.templates.get(key)
        if not templates:
            return f"Invalid Key='{key}'"

        template_roll = int(len(templates) * self.roller.random())
        template = templates[template_roll]
        phrases = self.unpack_string_template(template)
        
        phrase_roll = int(len(phrases) * self.roller.random())
        phrase = phrases[phrase_roll]

        current_text = []
        references = []
        check_not = -1

        for segment in phrase:
            if "text" in segment:
                piece = segment["text"]
                if piece.endswith(">") and references:
                    matches = re.findall(r"<!\d>", piece)
                    if matches:
                        check_not = int(re.search(r"\d", matches[-1]).group(0))
                        piece = re.sub(rf"<!{check_not}>", "", piece)
                    else:
                        check_not = -1
                else:
                    check_not = -1
                current_text.append(piece)
            elif "reference" in segment:
                ref_key = segment["reference"]
                piece = self.get_random_name(ref_key, banned_words, top_level=False)
                if check_not >= 0 and references:
                    while piece == references[min(check_not, len(references) - 1)]:
                        piece = self.get_random_name(ref_key, banned_words, top_level=False)
                current_text.append(piece)
                references.append(piece)
            elif "references" in segment:
                ref_choices = segment["references"]
                ref_key = ref_choices[int(len(ref_choices) * self.roller.random())]
                piece = self.get_random_name(ref_key, banned_words, top_level=False)
                if check_not >= 0 and references:
                    while piece == references[min(check_not, len(references) - 1)]:
                        piece = self.get_random_name(ref_key, banned_words, top_level=False)
                current_text.append(piece)
                references.append(piece)

        result_str = "".join(current_text)
        if "<" in result_str and "&" in result_str and ">" in result_str:
            for i, ref in enumerate(references):
                result_str = re.sub(rf"<&{i}>", ref, result_str)

        if result_str in banned_words and top_level:
            return self.get_random_name(key, banned_words, top_level=True)

        return add_caps(re.sub(r"\s+", " ", result_str).strip())
