"""
Dialog interaction bridge for T5 Character Creator.
Provides pick_option, pick_skill, and pick_knowledge with automatic fallback for headless mode.
"""
from typing import List, Optional, Callable, Any, Dict
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QListWidget,
    QListWidgetItem, QPushButton, QLineEdit, QTextEdit
)
from PySide6.QtCore import Qt
from character_gen.models.skill import get_skill_catalog


class OptionDialog(QDialog):
    """Modal dialog reproducing pickOption() from dialog.js."""
    def __init__(
        self,
        choices: List[str],
        prompt: str,
        no_cancel: bool = False,
        default_selection: Optional[str] = None,
        previews: Optional[List[Any]] = None,
        numbered_previews: bool = False,
        parent=None
    ):
        super().__init__(parent)
        self.setWindowTitle("Choice Required")
        self.resize(500, 420)
        self.choices = list(choices)
        self.previews = previews or []
        self.numbered_previews = numbered_previews
        self.selected_value: Optional[str] = None

        self.setStyleSheet("""
            QDialog {
                background-color: #0d1117;
                color: #c9d1d9;
            }
            QLabel {
                color: #f0f6fc;
                font-size: 13px;
            }
            QLineEdit {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #f0f6fc;
                padding: 6px;
            }
            QListWidget {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #f0f6fc;
                padding: 4px;
            }
            QListWidget::item {
                padding: 6px 10px;
                border-radius: 4px;
            }
            QListWidget::item:selected {
                background-color: #1f6feb;
                color: #ffffff;
            }
            QTextEdit {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #8b949e;
                font-size: 12px;
            }
            QPushButton {
                background-color: #21262d;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #c9d1d9;
                padding: 6px 14px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #30363d;
            }
            QPushButton#primaryBtn {
                background-color: #238636;
                color: #ffffff;
                border: none;
            }
            QPushButton#primaryBtn:hover {
                background-color: #2ea043;
            }
        """)

        layout = QVBoxLayout(self)
        layout.setSpacing(10)
        layout.setContentsMargins(14, 14, 14, 14)

        prompt_lbl = QLabel(prompt)
        prompt_lbl.setWordWrap(True)
        layout.addWidget(prompt_lbl)

        # Filter box + Random button
        top_bar = QHBoxLayout()
        self.filter_edit = QLineEdit()
        self.filter_edit.setPlaceholderText("Filter options...")
        self.filter_edit.textChanged.connect(self._filter_items)
        top_bar.addWidget(self.filter_edit)

        rnd_btn = QPushButton("🎲")
        rnd_btn.setToolTip("Pick Random Option")
        rnd_btn.clicked.connect(self._pick_random)
        top_bar.addWidget(rnd_btn)
        layout.addLayout(top_bar)

        # List Widget
        self.list_widget = QListWidget()
        self.list_widget.currentRowChanged.connect(self._on_row_changed)
        self.list_widget.itemDoubleClicked.connect(self._on_accept)
        layout.addWidget(self.list_widget)

        # Preview Area
        self.preview_box = QTextEdit()
        self.preview_box.setReadOnly(True)
        self.preview_box.setMaximumHeight(90)
        layout.addWidget(self.preview_box)

        self._populate_list(self.choices)

        # Pre-select default
        if default_selection and default_selection in self.choices:
            idx = self.choices.index(default_selection)
            self.list_widget.setCurrentRow(idx)

        # Buttons
        btn_bar = QHBoxLayout()
        btn_bar.addStretch()

        if not no_cancel:
            cancel_btn = QPushButton("Cancel")
            cancel_btn.clicked.connect(self.reject)
            btn_bar.addWidget(cancel_btn)

        ok_btn = QPushButton("OK")
        ok_btn.setObjectName("primaryBtn")
        ok_btn.clicked.connect(self._on_accept)
        btn_bar.addWidget(ok_btn)

        layout.addLayout(btn_bar)

    def _populate_list(self, items: List[str]):
        self.list_widget.clear()
        for item in items:
            it = QListWidgetItem(item)
            self.list_widget.addItem(it)
        if self.list_widget.count() > 0 and self.list_widget.currentRow() < 0:
            self.list_widget.setCurrentRow(0)

    def _filter_items(self, text: str):
        search = text.lower()
        filtered = [opt for opt in self.choices if search in opt.lower()]
        self._populate_list(filtered)

    def _on_row_changed(self, row: int):
        if row < 0 or row >= len(self.choices):
            self.preview_box.clear()
            return
        item_text = self.list_widget.item(row).text()
        if item_text in self.choices:
            orig_idx = self.choices.index(item_text)
            if orig_idx < len(self.previews):
                preview_data = self.previews[orig_idx]
                if isinstance(preview_data, list):
                    html = "<ul>" + "".join(f"<li>{x}</li>" for x in preview_data) + "</ul>"
                    self.preview_box.setHtml(html)
                elif isinstance(preview_data, str):
                    self.preview_box.setHtml(preview_data)
                else:
                    self.preview_box.clear()
            else:
                self.preview_box.clear()

    def _pick_random(self):
        import random
        if self.list_widget.count() > 0:
            rnd_row = random.randint(0, self.list_widget.count() - 1)
            self.list_widget.setCurrentRow(rnd_row)

    def _on_accept(self):
        item = self.list_widget.currentItem()
        if item:
            self.selected_value = item.text()
            self.accept()
        else:
            self.reject()


# Skill catalogs matching dialog.js pickSkill categories
SKILL_CATEGORIES_DATA: Dict[str, List[Dict[str, Optional[str]]]] = {
    "S": [
        {"name": "Actor", "skill": "Actor", "knowledge": None},
        {"name": "Admin", "skill": "Admin", "knowledge": None},
        {"name": "Animals(Rider)", "skill": "Animals", "knowledge": "Rider"},
        {"name": "Animals(Teamster)", "skill": "Animals", "knowledge": "Teamster"},
        {"name": "Animals(Trainer)", "skill": "Animals", "knowledge": "Trainer"},
        {"name": "Artist", "skill": "Artist", "knowledge": None},
        {"name": "Author", "skill": "Author", "knowledge": None},
        {"name": "Biologics", "skill": "Biologics", "knowledge": None},
        {"name": "Chef", "skill": "Chef", "knowledge": None},
        {"name": "Comms", "skill": "Comms", "knowledge": None},
        {"name": "Computer", "skill": "Computer", "knowledge": None},
        {"name": "Craftsman", "skill": "Craftsman", "knowledge": None},
        {"name": "Dancer", "skill": "Dancer", "knowledge": None},
        {"name": "Driver(ACV)", "skill": "Driver", "knowledge": "ACV"},
        {"name": "Driver(Automotive)", "skill": "Driver", "knowledge": "Automotive"},
        {"name": "Driver(Grav)", "skill": "Driver", "knowledge": "Grav"},
        {"name": "Driver(Legged)", "skill": "Driver", "knowledge": "Legged"},
        {"name": "Driver(Mole)", "skill": "Driver", "knowledge": "Mole"},
        {"name": "Driver(Tracked)", "skill": "Driver", "knowledge": "Tracked"},
        {"name": "Driver(Wheeled)", "skill": "Driver", "knowledge": "Wheeled"},
        {"name": "Electronics", "skill": "Electronics", "knowledge": None},
        {"name": "Engineer(Jump Drives)", "skill": "Engineer", "knowledge": "Jump Drives"},
        {"name": "Engineer(Life Support)", "skill": "Engineer", "knowledge": "Life Support"},
        {"name": "Engineer(Maneuver Drive)", "skill": "Engineer", "knowledge": "Maneuver Drive"},
        {"name": "Engineer(Power Systems)", "skill": "Engineer", "knowledge": "Power Systems"},
        {"name": "Explosives", "skill": "Explosives", "knowledge": None},
        {"name": "Fighter(Blades)", "skill": "Fighter", "knowledge": "Blades"},
        {"name": "Fighter(Slug Throwers)", "skill": "Fighter", "knowledge": "Slug Throwers"},
        {"name": "Fighter(Unarmed)", "skill": "Fighter", "knowledge": "Unarmed"},
        {"name": "Fluidics", "skill": "Fluidics", "knowledge": None},
        {"name": "Flyer(Aeronautics)", "skill": "Flyer", "knowledge": "Aeronautics"},
        {"name": "Flyer(Grav)", "skill": "Flyer", "knowledge": "Grav"},
        {"name": "Flyer(LTA)", "skill": "Flyer", "knowledge": "LTA"},
        {"name": "Flyer(Rotor)", "skill": "Flyer", "knowledge": "Rotor"},
        {"name": "Flyer(Winged)", "skill": "Flyer", "knowledge": "Winged"},
        {"name": "Forward Observer", "skill": "Forward Observer", "knowledge": None},
        {"name": "Gravitics", "skill": "Gravitics", "knowledge": None},
        {"name": "High-G", "skill": "High-G", "knowledge": None},
        {"name": "Hostile Environ", "skill": "Hostile Environ", "knowledge": None},
        {"name": "Language", "skill": "Language", "knowledge": None},
        {"name": "Magnetics", "skill": "Magnetics", "knowledge": None},
        {"name": "Mechanic", "skill": "Mechanic", "knowledge": None},
        {"name": "Medic", "skill": "Medic", "knowledge": None},
        {"name": "Musician", "skill": "Musician", "knowledge": None},
        {"name": "Navigator", "skill": "Navigator", "knowledge": None},
        {"name": "Photonics", "skill": "Photonics", "knowledge": None},
        {"name": "Pilot(Small Craft)", "skill": "Pilot", "knowledge": "Small Craft"},
        {"name": "Polymers", "skill": "Polymers", "knowledge": None},
        {"name": "Programmer", "skill": "Programmer", "knowledge": None},
        {"name": "Recon", "skill": "Recon", "knowledge": None},
        {"name": "Sapper", "skill": "Sapper", "knowledge": None},
        {"name": "Science(Linguistics)", "skill": "Science", "knowledge": "Linguistics"},
        {"name": "Science(Robotics)", "skill": "Science", "knowledge": "Robotics"},
        {"name": "Seafarer(Aquanautics)", "skill": "Seafarer", "knowledge": "Aquanautics"},
        {"name": "Seafarer(Boat)", "skill": "Seafarer", "knowledge": "Boat"},
        {"name": "Seafarer(Grav)", "skill": "Seafarer", "knowledge": "Grav"},
        {"name": "Seafarer(Ship)", "skill": "Seafarer", "knowledge": "Ship"},
        {"name": "Seafarer(Sub)", "skill": "Seafarer", "knowledge": "Sub"},
        {"name": "Sensors", "skill": "Sensors", "knowledge": None},
        {"name": "Steward", "skill": "Steward", "knowledge": None},
        {"name": "Survey", "skill": "Survey", "knowledge": None},
        {"name": "Survival", "skill": "Survival", "knowledge": None},
        {"name": "Tactics", "skill": "Tactics", "knowledge": None},
        {"name": "Trader", "skill": "Trader", "knowledge": None},
        {"name": "Vacc Suit", "skill": "Vacc Suit", "knowledge": None},
        {"name": "Zero-G", "skill": "Zero-G", "knowledge": None}
    ],
    "C": [
        {"name": "Actor", "skill": "Actor", "knowledge": None},
        {"name": "Artist", "skill": "Artist", "knowledge": None},
        {"name": "Astrogator", "skill": "Astrogator", "knowledge": None},
        {"name": "Athlete", "skill": "Athlete", "knowledge": None},
        {"name": "Author", "skill": "Author", "knowledge": None},
        {"name": "Biologics", "skill": "Biologics", "knowledge": None},
        {"name": "Broker", "skill": "Broker", "knowledge": None},
        {"name": "Bureaucrat", "skill": "Bureaucrat", "knowledge": None},
        {"name": "Chef", "skill": "Chef", "knowledge": None},
        {"name": "Counsellor", "skill": "Counsellor", "knowledge": None},
        {"name": "Craftsman", "skill": "Craftsman", "knowledge": None},
        {"name": "Dancer", "skill": "Dancer", "knowledge": None},
        {"name": "Designer", "skill": "Designer", "knowledge": None},
        {"name": "Driver(Automotive)", "skill": "Driver", "knowledge": "Automotive"},
        {"name": "Electronics", "skill": "Electronics", "knowledge": None},
        {"name": "Flyer(Aeronautics)", "skill": "Flyer", "knowledge": "Aeronautics"},
        {"name": "Fluidics", "skill": "Fluidics", "knowledge": None},
        {"name": "Gravitics", "skill": "Gravitics", "knowledge": None},
        {"name": "Language", "skill": "Language", "knowledge": None},
        {"name": "Magnetics", "skill": "Magnetics", "knowledge": None},
        {"name": "Mechanic", "skill": "Mechanic", "knowledge": None},
        {"name": "Musician", "skill": "Musician", "knowledge": None},
        {"name": "Photonics", "skill": "Photonics", "knowledge": None},
        {"name": "Polymers", "skill": "Polymers", "knowledge": None},
        {"name": "Programmer", "skill": "Programmer", "knowledge": None},
        {"name": "Seafarer(Aquanautics)", "skill": "Seafarer", "knowledge": "Aquanautics"},
        {"name": "Science(Archeology)", "skill": "Science", "knowledge": "Archeology"},
        {"name": "Science(Biology)", "skill": "Science", "knowledge": "Biology"},
        {"name": "Science(Chemistry)", "skill": "Science", "knowledge": "Chemistry"},
        {"name": "Science(History)", "skill": "Science", "knowledge": "History"},
        {"name": "Science(Linguistics)", "skill": "Science", "knowledge": "Linguistics"},
        {"name": "Science(Philosophy)", "skill": "Science", "knowledge": "Philosophy"},
        {"name": "Science(Physics)", "skill": "Science", "knowledge": "Physics"},
        {"name": "Science(Planetology)", "skill": "Science", "knowledge": "Planetology"},
        {"name": "Science(Psionicology)", "skill": "Science", "knowledge": "Psionicology"},
        {"name": "Science(Psychohistory)", "skill": "Science", "knowledge": "Psychohistory"},
        {"name": "Science(Psychology)", "skill": "Science", "knowledge": "Psychology"},
        {"name": "Science(Robotics)", "skill": "Science", "knowledge": "Robotics"},
        {"name": "Science(Sophontology)", "skill": "Science", "knowledge": "Sophontology"},
        {"name": "Teacher", "skill": "Teacher", "knowledge": None}
    ],
    "N": [
        {"name": "Animals(Trainer)", "skill": "Animals", "knowledge": "Trainer"},
        {"name": "Astrogator", "skill": "Astrogator", "knowledge": None},
        {"name": "Driver(Grav)", "skill": "Driver", "knowledge": "Grav"},
        {"name": "Driver(Wheeled)", "skill": "Driver", "knowledge": "Wheeled"},
        {"name": "Engineer(Jump Drives)", "skill": "Engineer", "knowledge": "Jump Drives"},
        {"name": "Engineer(Life Support)", "skill": "Engineer", "knowledge": "Life Support"},
        {"name": "Engineer(Maneuver Drive)", "skill": "Engineer", "knowledge": "Maneuver Drive"},
        {"name": "Engineer(Power Systems)", "skill": "Engineer", "knowledge": "Power Systems"},
        {"name": "Fighter(Battle Dress)", "skill": "Fighter", "knowledge": "Battle Dress"},
        {"name": "Fighter(Slug Throwers)", "skill": "Fighter", "knowledge": "Slug Throwers"},
        {"name": "Fleet Tactics", "skill": "Fleet Tactics", "knowledge": None},
        {"name": "Flyer(Aeronautics)", "skill": "Flyer", "knowledge": "Aeronautics"},
        {"name": "Flyer(Grav)", "skill": "Flyer", "knowledge": "Grav"},
        {"name": "Gunner(Bay Weapons)", "skill": "Gunner", "knowledge": "Bay Weapons"},
        {"name": "Gunner(Ortillery)", "skill": "Gunner", "knowledge": "Ortillery"},
        {"name": "Gunner(Screens)", "skill": "Gunner", "knowledge": "Screens"},
        {"name": "Gunner(Turrets)", "skill": "Gunner", "knowledge": "Turrets"},
        {"name": "Heavy Weapons(WMD)", "skill": "Heavy Weapons", "knowledge": "WMD"},
        {"name": "Language", "skill": "Language", "knowledge": None},
        {"name": "Leader", "skill": "Leader", "knowledge": None},
        {"name": "Liaison", "skill": "Liaison", "knowledge": None},
        {"name": "Medic", "skill": "Medic", "knowledge": None},
        {"name": "Naval Architect", "skill": "Naval Architect", "knowledge": None},
        {"name": "Pilot(ACS)", "skill": "Pilot", "knowledge": "ACS"},
        {"name": "Pilot(BCS)", "skill": "Pilot", "knowledge": "BCS"},
        {"name": "Science(Robotics)", "skill": "Science", "knowledge": "Robotics"},
        {"name": "Seafarer(Grav)", "skill": "Seafarer", "knowledge": "Grav"},
        {"name": "Sensors", "skill": "Sensors", "knowledge": None},
        {"name": "Steward", "skill": "Steward", "knowledge": None},
        {"name": "Strategy", "skill": "Strategy", "knowledge": None},
        {"name": "Tactics", "skill": "Tactics", "knowledge": None}
    ],
    "A": [
        {"name": "Animals(Rider)", "skill": "Animals", "knowledge": "Rider"},
        {"name": "Animals(Teamster)", "skill": "Animals", "knowledge": "Teamster"},
        {"name": "Animals(Trainer)", "skill": "Animals", "knowledge": "Trainer"},
        {"name": "Driver(ACV)", "skill": "Driver", "knowledge": "ACV"},
        {"name": "Driver(Automotive)", "skill": "Driver", "knowledge": "Automotive"},
        {"name": "Driver(Grav)", "skill": "Driver", "knowledge": "Grav"},
        {"name": "Driver(Legged)", "skill": "Driver", "knowledge": "Legged"},
        {"name": "Driver(Mole)", "skill": "Driver", "knowledge": "Mole"},
        {"name": "Driver(Tracked)", "skill": "Driver", "knowledge": "Tracked"},
        {"name": "Driver(Wheeled)", "skill": "Driver", "knowledge": "Wheeled"},
        {"name": "Engineer(Life Support)", "skill": "Engineer", "knowledge": "Life Support"},
        {"name": "Engineer(Power Systems)", "skill": "Engineer", "knowledge": "Power Systems"},
        {"name": "Fighter(Battle Dress)", "skill": "Fighter", "knowledge": "Battle Dress"},
        {"name": "Fighter(Beams)", "skill": "Fighter", "knowledge": "Beams"},
        {"name": "Fighter(Blades)", "skill": "Fighter", "knowledge": "Blades"},
        {"name": "Fighter(Exotics)", "skill": "Fighter", "knowledge": "Exotics"},
        {"name": "Fighter(Slug Throwers)", "skill": "Fighter", "knowledge": "Slug Throwers"},
        {"name": "Fighter(Sprays)", "skill": "Fighter", "knowledge": "Sprays"},
        {"name": "Fighter(Unarmed)", "skill": "Fighter", "knowledge": "Unarmed"},
        {"name": "Flyer(Aeronautics)", "skill": "Flyer", "knowledge": "Aeronautics"},
        {"name": "Flyer(Grav)", "skill": "Flyer", "knowledge": "Grav"},
        {"name": "Flyer(Rotor)", "skill": "Flyer", "knowledge": "Rotor"},
        {"name": "Flyer(Winged)", "skill": "Flyer", "knowledge": "Winged"},
        {"name": "Forward Observer", "skill": "Forward Observer", "knowledge": None},
        {"name": "Gunner(Screens)", "skill": "Gunner", "knowledge": "Screens"},
        {"name": "Heavy Weapons(Artillery)", "skill": "Heavy Weapons", "knowledge": "Artillery"},
        {"name": "Heavy Weapons(Launcher)", "skill": "Heavy Weapons", "knowledge": "Launcher"},
        {"name": "Heavy Weapons(Ordnance)", "skill": "Heavy Weapons", "knowledge": "Ordnance"},
        {"name": "Heavy Weapons(WMD)", "skill": "Heavy Weapons", "knowledge": "WMD"},
        {"name": "Language", "skill": "Language", "knowledge": None},
        {"name": "Leader", "skill": "Leader", "knowledge": None},
        {"name": "Liaison", "skill": "Liaison", "knowledge": None},
        {"name": "Medic", "skill": "Medic", "knowledge": None},
        {"name": "Navigator", "skill": "Navigator", "knowledge": None},
        {"name": "Pilot(Small Craft)", "skill": "Pilot", "knowledge": "Small Craft"},
        {"name": "Recon", "skill": "Recon", "knowledge": None},
        {"name": "Sapper", "skill": "Sapper", "knowledge": None},
        {"name": "Science(Robotics)", "skill": "Science", "knowledge": "Robotics"},
        {"name": "Seafarer(Grav)", "skill": "Seafarer", "knowledge": "Grav"},
        {"name": "Strategy", "skill": "Strategy", "knowledge": None},
        {"name": "Tactics", "skill": "Tactics", "knowledge": None}
    ],
    "Medical": [
        {"name": "Forensics", "skill": "Forensics", "knowledge": None},
        {"name": "Medic", "skill": "Medic", "knowledge": None}
    ],
    "Law": [
        {"name": "Advocate", "skill": "Advocate", "knowledge": None},
        {"name": "Diplomat", "skill": "Diplomat", "knowledge": None}
    ]
}


class DialogHandler:
    """Manages prompt interactions between the engine and the user interface."""
    def __init__(self, parent_widget=None, headless: bool = False, roller=None):
        self.parent_widget = parent_widget
        self.headless = headless
        self.roller = roller

    def pick_option(
        self,
        choices: List[str],
        prompt: str,
        no_cancel: bool = False,
        default_selection: Optional[str] = None,
        previews: Optional[List[Any]] = None,
        numbered_previews: bool = False
    ) -> Optional[str]:
        if not choices:
            return None

        if self.headless:
            if default_selection and default_selection in choices:
                return default_selection
            if self.roller:
                idx = int(self.roller.d6(1)) % len(choices)
                return choices[idx]
            return choices[0]

        from PySide6.QtWidgets import QApplication
        parent = self.parent_widget
        if parent is None and QApplication.instance() is not None:
            parent = QApplication.activeWindow()
            if parent is None and QApplication.topLevelWidgets():
                parent = QApplication.topLevelWidgets()[0]

        if parent is None and QApplication.instance() is None:
            if default_selection and default_selection in choices:
                return default_selection
            if self.roller:
                idx = int(self.roller.d6(1)) % len(choices)
                return choices[idx]
            return choices[0]

        dlg = OptionDialog(
            choices=choices,
            prompt=prompt,
            no_cancel=no_cancel,
            default_selection=default_selection,
            previews=previews,
            numbered_previews=numbered_previews,
            parent=parent
        )
        if dlg.exec():
            return dlg.selected_value
        return default_selection if no_cancel else None

    def pick_skill(
        self,
        school_type: str,
        prompt: str,
        excluded_choice: Optional[str] = None,
        preferred_choice: Optional[str] = None,
        no_cancel: bool = True
    ) -> Optional[Dict[str, Optional[str]]]:
        """Pick a skill/knowledge according to category (S, C, N, A, Medical, Law, Any, etc.) or specific skill name."""
        catalog = get_skill_catalog()
        canon_type = catalog.canonicalize(school_type)

        # Check if school_type is a specific skill with knowledges (e.g. Seafarer, Animals, Driver, Flyer, etc.)
        if catalog.has_knowledges(canon_type):
            k_list = catalog.get_knowledges(canon_type)
            entries = [{"name": k, "skill": canon_type, "knowledge": k} for k in k_list]
        elif school_type in SKILL_CATEGORIES_DATA:
            entries = SKILL_CATEGORIES_DATA[school_type]
        elif school_type.upper() in ["ANY", "ALL"]:
            entries = SKILL_CATEGORIES_DATA.get("S", [])
        else:
            if school_type in ["A", "Soldier", "SoldierSkills"]:
                skills = catalog.get_category_skills("SoldierSkills")
            elif school_type in ["N", "Starship", "StarshipSkills", "M"]:
                skills = catalog.get_category_skills("StarshipSkills")
            elif school_type in ["Trade", "TradeSkills"]:
                skills = catalog.get_category_skills("TradeSkills")
            elif school_type in ["Art", "ArtSkills"]:
                skills = catalog.get_category_skills("ArtSkills")
            elif canon_type in catalog.skills:
                return {"name": canon_type, "skill": canon_type, "knowledge": None}
            else:
                skills = catalog.skills
            entries = [{"name": s, "skill": s, "knowledge": None} for s in skills]

        if excluded_choice:
            entries = [e for e in entries if e["name"] != excluded_choice and e["skill"] != excluded_choice]

        names = [e["name"] for e in entries]
        def_sel = preferred_choice if preferred_choice in names else (names[0] if names else None)
        chosen_name = self.pick_option(names, prompt, no_cancel=no_cancel, default_selection=def_sel)
        if not chosen_name:
            return None

        # Find matching entry
        matched = next((e for e in entries if e["name"] == chosen_name), None)
        if matched:
            sk = matched["skill"]
            kn = matched["knowledge"]
            if sk == "Language" and not kn:
                # Prompt language
                langs = ["Anglic", "Vilani", "Trokh", "Gvegh", "Zdetl", "!kee", "Oynprith", "Sagamaal", "Tezapet"]
                kn = self.pick_option(langs, "Choose a language:", no_cancel=True)
            return {"name": chosen_name, "skill": sk, "knowledge": kn}

        return {"name": chosen_name, "skill": chosen_name, "knowledge": None}

