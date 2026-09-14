"""
Interactive Character Creation Controls (Education & Career Action Panels).
Matches the exact mechanism, qualification rules, and tooltips of T5Character.html.
"""
from typing import Optional, Dict, Any, List
from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QFrame, QComboBox, QLineEdit, QCheckBox, QGroupBox, QGridLayout,
    QScrollArea
)
from character_gen.engine.character_engine import CharacterEngine
from character_gen.models.species import get_species_catalog
from character_gen.ui.dialogs.homeworld_dialog import HomeworldDialog


CAREER_TOOLTIPS = {
    "Craftsman": "Begin: Auto (if 2x Skill-6 and Craftsman-1)\nControlling Characteristics: C1, C2, C3, C4\nMasterpiece: 9D < Master Points (min 40)\nContinue: Craftsman x2",
    "Scholar": "Begin: Auto if Edu 8+, otherwise check Edu/Tra\nControlling Characteristics: C1, C2, C3, C4\nPromotion: Int (only if Edu 8+)\nContinue: Check Edu or Tra",
    "Entertainer": "Begin: Check C2, C3, Int, or C5\nInitial Fame/Talent: 2D\nFame changes by 1-3 Flux rolls every subsequent term\nContinue: Check Fame",
    "Citizen": "Begin: Automatic (1st career only)\nControlling Characteristics: C1, C2, C3, C4\n100-Job Citizen Life roll\nContinue: 10-",
    "Scout": "Begin: C1, C2, or C3 (Retry vs C5)\nControlling Characteristics: C1, C2, C3\nMissions & Discoveries\nContinue: Int",
    "Merchant": "Begin: 4th Officer (Int), Spacehand (Dex), or Temp (Auto)\nControlling Characteristics: C1, C2, C3, C4\nPromotion: Dex / Int / Terms x2\nFree Trader Ship Shares\nContinue: Str",
    "Spacer": "Begin: Int (Select Branch: Soc)\nControlling Characteristics: C1, C2, C4\nRating Promotion: C2 | Officer Commission: C2 | Officer Promotion: Soc\nContinue: Str",
    "Soldier": "Begin: Str (Select Branch: Soc)\nControlling Characteristics: C1, C3, C4\nEnlisted Promotion: C3 | Officer Commission: C3 | Officer Promotion: Soc\nContinue: C3",
    "Marine": "Begin: Str (Select Branch: Soc)\nControlling Characteristics: C1, C4\nEnlisted Promotion: Str | Officer Commission: C3 | Officer Promotion: Int\nContinue: Str",
    "Agent": "Begin: C3\nControlling Characteristics: C1, C2, C3, C4\nUndercover missions\nContinue: Str + Terms",
    "Rogue": "Begin: Check chosen CC (12 is auto failure)\nControlling Characteristic: Select 1 fixed CC (C1-C6)\nContinue: Roll vs CC + Terms",
    "Noble": "Begin: Automatic if Soc 11+ (B+)\nControlling Characteristics: C2, C3, C4, C5\nElevation: Roll >= Soc\nIntrigue & Exile checks\nContinue: 7+",
    "Functionary": "Pre Req: Prior Career (Non-Noble)\nBegin: 2D <= Terms x 3\nControlling Characteristics: C2, C3, C4, C5\nOffice Politics: Risk & Reward (F0-F8)\nContinue: Office Politics"
}

EDUCATION_TOOLTIPS = {
    "Apprenticeship": "Begin: Automatic (Age <= 18)\nPass/Fail: Check Tra (or Edu/2)\nProvides: Trade Skill/Knowledge +4",
    "ED5": "Education: Increases EDU to 5 if less than 5.\nAge: +1 Year",
    "Trade School": "Pass/Fail: Check Edu\nProvides: Trade Skill +2, +1 EDU\nAge: +1 Year",
    "Training Course": "Pass/Fail: Check Int\nProvides: Any Service/Trade Skill +1\nAge: +1 Year",
    "College": "BA Program (Min Start EDU 5, Min End EDU 8)\nOffers OTC/NOTC (Army/Navy Commission)\nProvides: Major +3, Minor +2, +1 EDU (Honors BA)\nAge: +4 Years",
    "University": "BA Program (Min Start EDU 7, Min End EDU 9)\nOffers OTC/NOTC\nProvides: Major +3, Minor +2, +1 EDU (Honors BA)\nAge: +4 Years",
    "Naval Academy": "Service Academy (Min Start EDU 6, Min End EDU 8)\nProvides: Major +3, Minor +2, Commission as Navy Officer1 & Navy Reserves\nAge: +4 Years",
    "Military Academy": "Service Academy (Min Start EDU 6, Min End EDU 8)\nProvides: Major +3, Minor +2, Commission as Army Officer1 & Army Reserves\nAge: +4 Years",
    "Masters": "Prerequisite: BA Degree (Min Start EDU 9)\nProvides: Major +2, +1 EDU, MA Degree\nAge: +2 Years",
    "Professors": "Prerequisite: MA Degree (Min Start EDU 10)\nProvides: Major +2, +1 EDU, PhD / Professor Title\nAge: +2 Years",
    "Medical School": "Prerequisite: BA Degree (Min Start EDU 9)\nProvides: Medic +4, +1 EDU, MD Degree (Doctor)\nAge: +4 Years",
    "Law School": "Prerequisite: BA Degree (Min Start EDU 8)\nProvides: Advocate +4, +1 EDU, Law Degree (Attorney)\nAge: +2 Years"
}


class WizardView(QWidget):
    """Action center with interactive Education & Career triggers matching T5Character.html."""
    character_changed = Signal()

    def __init__(self, engine: CharacterEngine, parent=None):
        super().__init__(parent)
        self.engine = engine
        self.career_buttons: Dict[str, QPushButton] = {}
        self.education_buttons: Dict[str, QPushButton] = {}
        self.init_ui()
        self.refresh_state()

    def init_ui(self):
        scroll = QScrollArea(self)
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { border: none; background: transparent; }")

        container = QWidget()
        layout = QVBoxLayout(container)
        layout.setContentsMargins(10, 10, 10, 10)
        layout.setSpacing(12)

        # 1. Background / Origin Group
        orig_box = QGroupBox("1. Origin & Character Setup")
        orig_box.setStyleSheet(self._group_box_style())
        orig_layout = QGridLayout(orig_box)
        orig_layout.setSpacing(8)

        # Species
        orig_layout.addWidget(QLabel("Species:"), 0, 0)
        self.species_combo = QComboBox()
        cat = get_species_catalog()
        for sp in cat.list_species():
            self.species_combo.addItem(sp.species_name, sp.id)
        self.species_combo.currentIndexChanged.connect(self._on_species_changed)
        orig_layout.addWidget(self.species_combo, 0, 1)

        # Sex
        orig_layout.addWidget(QLabel("Sex:"), 0, 2)
        self.gender_combo = QComboBox()
        self.gender_combo.addItems(["Random", "M", "F"])
        self.gender_combo.currentIndexChanged.connect(self._on_gender_changed)
        orig_layout.addWidget(self.gender_combo, 0, 3)

        # Name
        orig_layout.addWidget(QLabel("Name:"), 1, 0)
        self.name_edit = QLineEdit()
        self.name_edit.setPlaceholderText("Random Name")
        orig_layout.addWidget(self.name_edit, 1, 1)

        # Native Lang
        orig_layout.addWidget(QLabel("Native Lang:"), 1, 2)
        self.lang_combo = QComboBox()
        self.lang_combo.addItems(["Anglic", "Vilani", "Trokh", "Gvegh", "Zdetl", "!kee", "Oynprith", "Sagamaal", "Tezapet"])
        orig_layout.addWidget(self.lang_combo, 1, 3)

        # Checkboxes
        chk_layout = QHBoxLayout()
        self.sanity_chk = QCheckBox("Roll Sanity Immediately")
        self.clone_chk = QCheckBox("Forced Growth Clone")
        chk_layout.addWidget(self.sanity_chk)
        chk_layout.addWidget(self.clone_chk)
        orig_layout.addLayout(chk_layout, 2, 0, 1, 4)

        # Action Buttons for Setup
        setup_btn_bar = QHBoxLayout()
        self.hw_btn = QPushButton("🪐 Select from Traveller Map...")
        self.hw_btn.setToolTip("Browse and search 143,000+ worlds from the local Traveller Map database")
        self.hw_btn.clicked.connect(self._on_config_homeworld)
        setup_btn_bar.addWidget(self.hw_btn)

        self.rnd_hw_btn = QPushButton("🎲 Random World")
        self.rnd_hw_btn.setToolTip("Pick a random homeworld from Traveller Map")
        self.rnd_hw_btn.clicked.connect(self._on_random_homeworld)
        setup_btn_bar.addWidget(self.rnd_hw_btn)

        self.roll_char_btn = QPushButton("🚀 Roll New Character")
        self.roll_char_btn.setStyleSheet("""
            QPushButton {
                background-color: #238636;
                color: #ffffff;
                font-weight: bold;
                padding: 6px 14px;
                border-radius: 4px;
                border: none;
            }
            QPushButton:hover { background-color: #2ea043; }
        """)
        self.roll_char_btn.clicked.connect(self._on_roll_character)
        setup_btn_bar.addWidget(self.roll_char_btn)

        orig_layout.addLayout(setup_btn_bar, 3, 0, 1, 4)
        layout.addWidget(orig_box)

        self.stage_title = QLabel("T5 Character Creation")
        self.stage_title.setStyleSheet("font-weight: bold; font-size: 16px; color: #58a6ff;")
        self.btn_action = self.roll_char_btn

        # 2. Education Programs Group
        edu_box = QGroupBox("2. Education & Training")
        edu_box.setStyleSheet(self._group_box_style())
        edu_layout = QGridLayout(edu_box)
        edu_layout.setSpacing(6)

        edu_programs = [
            "Apprenticeship", "ED5", "Trade School", "Training Course",
            "College", "University", "Naval Academy", "Military Academy",
            "Masters", "Professors", "Medical School", "Law School"
        ]

        for i, prog in enumerate(edu_programs):
            btn = QPushButton(prog)
            btn.setToolTip(EDUCATION_TOOLTIPS.get(prog, ""))
            btn.setStyleSheet(self._button_style())
            btn.clicked.connect(lambda checked=False, p=prog: self._on_education_clicked(p))
            self.education_buttons[prog] = btn
            edu_layout.addWidget(btn, i // 4, i % 4)

        layout.addWidget(edu_box)

        # 3. Career Programs Group
        career_box = QGroupBox("3. Careers of Service")
        career_box.setStyleSheet(self._group_box_style())
        career_layout = QGridLayout(career_box)
        career_layout.setSpacing(6)

        careers_list = [
            "Craftsman", "Scholar", "Entertainer", "Citizen",
            "Scout", "Merchant", "Spacer", "Soldier",
            "Agent", "Rogue", "Noble", "Marine", "Functionary"
        ]

        for i, car in enumerate(careers_list):
            btn = QPushButton(car)
            btn.setToolTip(CAREER_TOOLTIPS.get(car, ""))
            btn.setStyleSheet(self._button_style())
            btn.clicked.connect(lambda checked=False, c=car: self._on_career_clicked(c))
            self.career_buttons[car] = btn
            career_layout.addWidget(btn, i // 4, i % 4)

        layout.addWidget(career_box)

        # 4. Lifecycle Actions Group
        action_box = QGroupBox("4. Lifecycle Actions")
        action_box.setStyleSheet(self._group_box_style())
        act_layout = QHBoxLayout(action_box)
        act_layout.setSpacing(8)

        self.muster_btn = QPushButton("🎖️ Muster Out")
        self.muster_btn.setToolTip("Mustering out of active career service and claim cash & benefits.")
        self.muster_btn.setStyleSheet(self._button_style("#8957e5"))
        self.muster_btn.clicked.connect(self._on_muster_out)
        act_layout.addWidget(self.muster_btn)

        self.fame_btn = QPushButton("✨ Fame Flux Event")
        self.fame_btn.setToolTip("Roll Fame Flux (+/- 1d6 - 1d6).")
        self.fame_btn.setStyleSheet(self._button_style("#d29922"))
        self.fame_btn.clicked.connect(self._on_fame_flux)
        act_layout.addWidget(self.fame_btn)

        self.resign_btn = QPushButton("🚪 Resign Reserves")
        self.resign_btn.setToolTip("Attempt to resign from armed forces reserves (Check 11 on 2D).")
        self.resign_btn.setStyleSheet(self._button_style("#f85149"))
        self.resign_btn.clicked.connect(self._on_resign_reserves)
        act_layout.addWidget(self.resign_btn)

        self.npc_btn = QPushButton("⚡ Instant NPC (4 Terms)")
        self.npc_btn.setStyleSheet(self._button_style("#1f6feb"))
        self.npc_btn.clicked.connect(self._on_instant_npc)
        act_layout.addWidget(self.npc_btn)

        layout.addWidget(action_box)
        layout.addStretch()

        scroll.setWidget(container)

        scroll_layout = QVBoxLayout(self)
        scroll_layout.setContentsMargins(0, 0, 0, 0)
        scroll_layout.addWidget(scroll)

    def refresh_state(self):
        """Update button enabled/disabled states according to get_qualifications()."""
        c = self.engine.character
        quals = c.get_qualifications()

        # Update career buttons
        for car, btn in self.career_buttons.items():
            is_enabled = quals.get(car, False)
            btn.setEnabled(is_enabled)
            if is_enabled:
                btn.setStyleSheet(self._button_style("#1f6feb"))
            else:
                btn.setStyleSheet(self._disabled_button_style())

        # Update education buttons
        ba_eligible = quals.get("BA", True) and not c.mustered_out
        for prog, btn in self.education_buttons.items():
            if prog in ["College", "University", "Naval Academy", "Military Academy"]:
                btn.setEnabled(ba_eligible)
                btn.setStyleSheet(self._button_style() if ba_eligible else self._disabled_button_style())
            elif prog in ["Masters", "Professors", "Medical School", "Law School"]:
                has_ba = any("BA" in a for a in c.awards)
                btn.setEnabled(has_ba and not c.mustered_out)
                btn.setStyleSheet(self._button_style() if has_ba else self._disabled_button_style())
            elif prog == "Apprenticeship":
                app_ok = (c.age <= 18) and not c.mustered_out
                btn.setEnabled(app_ok)
                btn.setStyleSheet(self._button_style() if app_ok else self._disabled_button_style())
            else:
                btn.setEnabled(not c.mustered_out)
                btn.setStyleSheet(self._button_style() if not c.mustered_out else self._disabled_button_style())

        # Update action buttons
        self.muster_btn.setEnabled(quals.get("MusterOut", False))
        self.fame_btn.setEnabled(quals.get("fameEvent", False))
        self.resign_btn.setEnabled(quals.get("resignReserves", False))

    def _on_species_changed(self):
        sp_id = self.species_combo.currentData() or "human"
        cat = get_species_catalog()
        sp = cat.get(sp_id)
        if not sp:
            return

        # Update language combo to species native language
        self.lang_combo.blockSignals(True)
        lang_idx = self.lang_combo.findText(sp.native_language)
        if lang_idx >= 0:
            self.lang_combo.setCurrentIndex(lang_idx)
        else:
            self.lang_combo.addItem(sp.native_language)
            self.lang_combo.setCurrentText(sp.native_language)
        self.lang_combo.blockSignals(False)

        # Update gender options based on species gender table
        self.gender_combo.blockSignals(True)
        self.gender_combo.clear()
        self.gender_combo.addItem("Random")
        genders = sp.genders.keys() if sp.genders else ["M", "F"]
        for g in genders:
            self.gender_combo.addItem(g)
        self.gender_combo.blockSignals(False)

        # Re-roll / live-update stats with new species characteristics and stat profile
        self._on_roll_character()

    def _on_gender_changed(self):
        # Update character stats if gender modifiers apply
        if self.gender_combo.signalsBlocked():
            return
        if self.engine.character and self.engine.character.species:
            sp_id = self.species_combo.currentData() or "human"
            cat = get_species_catalog()
            sp = cat.get(sp_id)
            if sp and sp.genders:
                self._on_roll_character()

    def _on_roll_character(self):
        sp_id = self.species_combo.currentData() or "human"
        gender = self.gender_combo.currentText()
        name = self.name_edit.text().strip() or None
        roll_san = self.sanity_chk.isChecked()
        is_clone = self.clone_chk.isChecked()

        self.engine.start_new_character(
            species_id=sp_id,
            gender=gender,
            name=name,
            roll_sanity_immediately=roll_san
        )
        self.engine.character.is_forced_growth_clone = is_clone
        self.engine.character.native_language = self.lang_combo.currentText()
        self.engine.person.gain_skill_or_knowledge("Language", self.engine.character.native_language, False)
        
        # Preserve homeworld if already set, else default
        hw = getattr(self.engine.character, "homeworld", None)
        if not hw:
            self.engine.setup_homeworld("Terra", "A867974-C", ["Ga", "Hi", "Ri"], sector="Solomani Rim", hex_coord="1827")
        
        self.refresh_state()
        self.character_changed.emit()

    def _on_config_homeworld(self):
        hw = self.engine.character.homeworld or {}
        dlg = HomeworldDialog(
            current_name=hw.get("name", "Terra"),
            current_uwp=hw.get("uwp", "A867974-C"),
            current_codes=hw.get("trade_codes", ["Ga", "Hi", "Ri"]),
            current_sector=hw.get("sector", "Solomani Rim"),
            current_hex=hw.get("hex", "1827"),
            parent=self
        )
        if dlg.exec():
            data = dlg.get_homeworld_data()
            self.engine.setup_homeworld(
                name=data["name"],
                uwp=data["uwp"],
                trade_codes=data["trade_codes"],
                sector=data.get("sector"),
                hex_coord=data.get("hex")
            )
            self.refresh_state()
            self.character_changed.emit()

    def _on_random_homeworld(self):
        from core.traveller_map_db import get_traveller_map_db
        db = get_traveller_map_db()
        world = db.get_random_world(milieu="M1105")
        if world:
            self.engine.setup_homeworld(
                name=world.get("name", "Terra"),
                uwp=world.get("uwp", "A867974-C"),
                trade_codes=world.get("trade_codes", ["Ga", "Hi", "Ri"]),
                sector=world.get("sector_name"),
                hex_coord=world.get("hex")
            )
            self.refresh_state()
            self.character_changed.emit()

    def _on_education_clicked(self, prog: str):
        choice = self.engine.dialog.pick_option(
            ["Begin", "Nevermind"],
            f"<div><strong>Enroll in {prog}?</strong></div>{EDUCATION_TOOLTIPS.get(prog, '')}",
            no_cancel=True,
            default_selection="Begin"
        )
        if choice != "Begin":
            return
        method_map = {
            "Apprenticeship": self.engine.person.Apprenticeship,
            "ED5": self.engine.person.ED5,
            "Trade School": self.engine.person.TradeSchool,
            "Training Course": self.engine.person.TrainingCourse,
            "College": self.engine.person.College,
            "University": self.engine.person.University,
            "Naval Academy": self.engine.person.NavalAcademy,
            "Military Academy": self.engine.person.MilitaryAcademy,
            "Masters": self.engine.person.Masters,
            "Professors": self.engine.person.Professors,
            "Medical School": self.engine.person.MedicalSchool,
            "Law School": self.engine.person.LawSchool
        }
        func = method_map.get(prog)
        if func:
            func()
            self.refresh_state()
            self.character_changed.emit()

    def _on_career_clicked(self, career: str):
        choice = self.engine.dialog.pick_option(
            ["Begin", "Nevermind"],
            f"<div><strong>Begin a {career} career?</strong></div>{CAREER_TOOLTIPS.get(career, '')}",
            no_cancel=True,
            default_selection="Begin"
        )
        if choice == "Begin":
            self.engine.person.resolve_career(career)
            self.refresh_state()
            self.character_changed.emit()

    def _on_muster_out(self):
        choice = self.engine.dialog.pick_option(
            ["Muster Out", "Nevermind"],
            "Muster out of active career service and claim accumulated benefits?",
            no_cancel=True,
            default_selection="Muster Out"
        )
        if choice == "Muster Out":
            self.engine.person.muster_out()
            self.refresh_state()
            self.character_changed.emit()

    def _on_fame_flux(self):
        self.engine.person.fame_flux_event()
        self.refresh_state()
        self.character_changed.emit()

    def _on_resign_reserves(self):
        self.engine.person.resign_from_reserves()
        self.refresh_state()
        self.character_changed.emit()

    def _on_instant_npc(self):
        sp_id = self.species_combo.currentData() or "human"
        self.engine.generate_full_character_automatically(species_id=sp_id, terms=4)
        self.refresh_state()
        self.character_changed.emit()

    def _group_box_style(self) -> str:
        return """
            QGroupBox {
                border: 1px solid #30363d;
                border-radius: 6px;
                margin-top: 10px;
                padding-top: 14px;
                color: #58a6ff;
                font-weight: bold;
                font-size: 12px;
            }
        """

    def _button_style(self, bg_color: str = "#21262d") -> str:
        return f"""
            QPushButton {{
                background-color: {bg_color};
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #f0f6fc;
                font-weight: bold;
                padding: 6px 10px;
                font-size: 12px;
            }}
            QPushButton:hover {{
                background-color: #30363d;
                border-color: #58a6ff;
            }}
        """

    def _disabled_button_style(self) -> str:
        return """
            QPushButton {
                background-color: #161b22;
                border: 1px solid #21262d;
                border-radius: 4px;
                color: #484f58;
                padding: 6px 10px;
                font-size: 12px;
            }
        """
