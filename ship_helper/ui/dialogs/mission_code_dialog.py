"""
T5 Starship Construction: Mission Code & Classification Builder Dialog.
Faithful 1:1 port of openMissionCodeDialog from Traveller/js/ShipHelperView.js.
Provides 5-level cascading hierarchy (Service > Activity > Type > Qualifier > Mission)
plus two customizable Mission Modifiers with real-time preview.
"""
from typing import Any, Dict, List, Optional
from PySide6.QtCore import Qt, QSignalBlocker
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QGridLayout, QLabel, QComboBox,
    QLineEdit, QPushButton, QGroupBox, QFrame
)
from ship_helper.models.ship import (
    ShipDesign, ENUM_MISSION_LIST, ENUM_MODIFIERS_LIST, ENUM_MODIFIER_WORD_OPTIONS
)

class MissionCodeDialog(QDialog):
    """Modal dialog for building or selecting a T5 Mission Code and Modifiers."""
    def __init__(self, ship: ShipDesign, parent=None):
        super().__init__(parent)
        self.ship = ship
        self.setWindowTitle("Configure Mission Classification & Modifiers")
        self.setMinimumWidth(580)
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(12)

        # 1. Ship Identity Fields
        ident_layout = QGridLayout()
        ident_layout.setHorizontalSpacing(10)
        ident_layout.setVerticalSpacing(4)

        lbl_name = QLabel("Vessel Name:")
        lbl_name.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.name_edit = QLineEdit(self.ship.shipName or "Starship")
        self.name_edit.textChanged.connect(self._update_preview)

        lbl_reg = QLabel("Registration Number:")
        lbl_reg.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.reg_edit = QLineEdit(self.ship.registration or "REG-0101")
        self.reg_edit.textChanged.connect(self._update_preview)

        ident_layout.addWidget(lbl_name, 0, 0)
        ident_layout.addWidget(lbl_reg, 0, 1)
        ident_layout.addWidget(self.name_edit, 1, 0)
        ident_layout.addWidget(self.reg_edit, 1, 1)
        layout.addLayout(ident_layout)

        # 2. Primary Mission Hierarchy (Narrowing Selection)
        hier_group = QGroupBox("1. Primary Mission Hierarchy (Narrowing Selection)")
        hier_group.setStyleSheet("""
            QGroupBox {
                border: 1px solid #30363d;
                border-radius: 6px;
                margin-top: 10px;
                padding-top: 14px;
                font-weight: bold;
                font-size: 13px;
                color: #79c0ff;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 8px;
                padding: 2px 6px;
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
            }
        """)
        hier_layout = QVBoxLayout(hier_group)
        hier_layout.setSpacing(8)

        grid = QGridLayout()
        grid.setHorizontalSpacing(10)
        grid.setVerticalSpacing(6)

        # A. Service
        lbl_srv = QLabel("A. Service:")
        lbl_srv.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.service_combo = QComboBox()
        grid.addWidget(lbl_srv, 0, 0)
        grid.addWidget(self.service_combo, 1, 0)

        # B. Activity
        lbl_act = QLabel("B. Activity:")
        lbl_act.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.activity_combo = QComboBox()
        grid.addWidget(lbl_act, 0, 1)
        grid.addWidget(self.activity_combo, 1, 1)

        # C. Type
        lbl_typ = QLabel("C. Type:")
        lbl_typ.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.type_combo = QComboBox()
        grid.addWidget(lbl_typ, 2, 0)
        grid.addWidget(self.type_combo, 3, 0)

        # D. Qualifier
        lbl_qual = QLabel("D. Qualifier:")
        lbl_qual.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.qualifier_combo = QComboBox()
        grid.addWidget(lbl_qual, 2, 1)
        grid.addWidget(self.qualifier_combo, 3, 1)

        hier_layout.addLayout(grid)

        # E. Mission & Code
        lbl_entry = QLabel("E. Mission & Classification Code:")
        lbl_entry.setStyleSheet("color: #8b949e; font-size: 12px; margin-top: 4px;")
        self.entry_combo = QComboBox()
        self.entry_combo.setStyleSheet("font-weight: bold; color: #58a6ff; font-size: 13px;")
        hier_layout.addWidget(lbl_entry)
        hier_layout.addWidget(self.entry_combo)

        layout.addWidget(hier_group)

        # 3. Mission Modifiers
        mod_group = QGroupBox("2. Mission Modifiers (Up to Two)")
        mod_group.setStyleSheet("""
            QGroupBox {
                border: 1px solid #30363d;
                border-radius: 6px;
                margin-top: 10px;
                padding-top: 14px;
                font-weight: bold;
                font-size: 13px;
                color: #79c0ff;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 8px;
                padding: 2px 6px;
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
            }
        """)
        mod_layout = QGridLayout(mod_group)
        mod_layout.setHorizontalSpacing(10)
        mod_layout.setVerticalSpacing(4)

        lbl_m1 = QLabel("Modifier 1:")
        lbl_m1.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.mod1_combo = QComboBox()
        self.mod1_combo.addItem("(None)", "")
        for opt in ENUM_MODIFIER_WORD_OPTIONS:
            self.mod1_combo.addItem(opt["label"], opt["word"])

        lbl_m2 = QLabel("Modifier 2:")
        lbl_m2.setStyleSheet("color: #8b949e; font-size: 12px;")
        self.mod2_combo = QComboBox()
        self.mod2_combo.addItem("(None)", "")
        for opt in ENUM_MODIFIER_WORD_OPTIONS:
            self.mod2_combo.addItem(opt["label"], opt["word"])

        mod_layout.addWidget(lbl_m1, 0, 0)
        mod_layout.addWidget(lbl_m2, 0, 1)
        mod_layout.addWidget(self.mod1_combo, 1, 0)
        mod_layout.addWidget(self.mod2_combo, 1, 1)

        layout.addWidget(mod_group)

        # 4. Live Preview Box
        self.preview_box = QFrame()
        self.preview_box.setStyleSheet("""
            QFrame {
                background: rgba(0, 229, 255, 0.08);
                border: 1px solid #58a6ff;
                border-radius: 6px;
                padding: 10px;
            }
        """)
        preview_layout = QVBoxLayout(self.preview_box)
        preview_layout.setContentsMargins(10, 8, 10, 8)
        preview_layout.setSpacing(4)

        top_prev_row = QHBoxLayout()
        self.prev_code = QLabel()
        self.prev_code.setStyleSheet("font-weight: bold; color: #58a6ff; font-size: 16px;")
        self.prev_title = QLabel()
        self.prev_title.setStyleSheet("font-weight: bold; color: #f0f6fc; font-size: 15px;")
        top_prev_row.addWidget(self.prev_code)
        top_prev_row.addStretch()
        top_prev_row.addWidget(self.prev_title)
        preview_layout.addLayout(top_prev_row)

        self.prev_desc = QLabel()
        self.prev_desc.setStyleSheet("color: #c9d1d9; font-size: 12px;")
        preview_layout.addWidget(self.prev_desc)

        layout.addWidget(self.preview_box)

        # 5. Dialog Buttons
        btn_box = QHBoxLayout()
        btn_box.addStretch()

        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_box.addWidget(cancel_btn)

        save_btn = QPushButton("Apply Classification")
        save_btn.setDefault(True)
        save_btn.setStyleSheet("background: #238636; color: white; font-weight: bold; padding: 6px 16px;")
        save_btn.clicked.connect(self._apply_and_close)
        btn_box.addWidget(save_btn)

        layout.addLayout(btn_box)

        # Connect signals
        self.service_combo.currentIndexChanged.connect(lambda: self._populate_activities())
        self.activity_combo.currentIndexChanged.connect(lambda: self._populate_types())
        self.type_combo.currentIndexChanged.connect(lambda: self._populate_qualifiers())
        self.qualifier_combo.currentIndexChanged.connect(lambda: self._populate_entries())
        self.entry_combo.currentIndexChanged.connect(self._update_preview)
        self.mod1_combo.currentIndexChanged.connect(self._update_preview)
        self.mod2_combo.currentIndexChanged.connect(self._update_preview)

        # Populate initial hierarchy
        self._init_hierarchy_selection()

    def _init_hierarchy_selection(self):
        # 1. Populate Services
        services = []
        for m in ENUM_MISSION_LIST:
            if m["service"] not in services:
                services.append(m["service"])
        
        with QSignalBlocker(self.service_combo):
            self.service_combo.clear()
            for s in services:
                self.service_combo.addItem(s, s)
            target_srv = self.ship.missionService or "Commerce"
            idx = self.service_combo.findData(target_srv)
            if idx >= 0:
                self.service_combo.setCurrentIndex(idx)

        # 2. Populate Cascades with current ship properties
        self._populate_activities(preserve_val=self.ship.missionActivity)
        self._populate_types(preserve_val=self.ship.missionType)
        self._populate_qualifiers(preserve_val=self.ship.missionQualifier)
        self._populate_entries(preserve_id=self.ship.missionId)

        # 3. Set Modifiers
        if self.ship.modifier1Word:
            idx1 = self.mod1_combo.findData(self.ship.modifier1Word)
            if idx1 >= 0:
                self.mod1_combo.setCurrentIndex(idx1)
        if self.ship.modifier2Word:
            idx2 = self.mod2_combo.findData(self.ship.modifier2Word)
            if idx2 >= 0:
                self.mod2_combo.setCurrentIndex(idx2)

        self._update_preview()

    def _populate_activities(self, preserve_val: Optional[str] = None):
        s = self.service_combo.currentData()
        matches = [m for m in ENUM_MISSION_LIST if m["service"] == s]
        acts = []
        for m in matches:
            if m["activity"] not in acts:
                acts.append(m["activity"])

        with QSignalBlocker(self.activity_combo):
            self.activity_combo.clear()
            for a in acts:
                label = "(Direct / None)" if a == "" else a
                self.activity_combo.addItem(label, a)
            if preserve_val is not None:
                idx = self.activity_combo.findData(preserve_val)
                if idx >= 0:
                    self.activity_combo.setCurrentIndex(idx)
        
        self._populate_types(preserve_val=preserve_val if preserve_val == self.ship.missionActivity else None)

    def _populate_types(self, preserve_val: Optional[str] = None):
        s = self.service_combo.currentData()
        a = self.activity_combo.currentData()
        matches = [m for m in ENUM_MISSION_LIST if m["service"] == s and m["activity"] == a]
        types = []
        for m in matches:
            if m["type"] not in types:
                types.append(m["type"])

        with QSignalBlocker(self.type_combo):
            self.type_combo.clear()
            for t in types:
                label = "(Direct / None)" if t == "" else t
                self.type_combo.addItem(label, t)
            if preserve_val is not None:
                idx = self.type_combo.findData(preserve_val)
                if idx >= 0:
                    self.type_combo.setCurrentIndex(idx)

        self._populate_qualifiers(preserve_val=preserve_val if preserve_val == self.ship.missionType else None)

    def _populate_qualifiers(self, preserve_val: Optional[str] = None):
        s = self.service_combo.currentData()
        a = self.activity_combo.currentData()
        t = self.type_combo.currentData()
        matches = [m for m in ENUM_MISSION_LIST if m["service"] == s and m["activity"] == a and m["type"] == t]
        quals = []
        for m in matches:
            if m["qualifier"] not in quals:
                quals.append(m["qualifier"])

        with QSignalBlocker(self.qualifier_combo):
            self.qualifier_combo.clear()
            for q in quals:
                label = "(Direct / None)" if q == "" else q
                self.qualifier_combo.addItem(label, q)
            if preserve_val is not None:
                idx = self.qualifier_combo.findData(preserve_val)
                if idx >= 0:
                    self.qualifier_combo.setCurrentIndex(idx)

        self._populate_entries(preserve_id=preserve_val if preserve_val == self.ship.missionQualifier else None)

    def _populate_entries(self, preserve_id: Optional[int] = None):
        s = self.service_combo.currentData()
        a = self.activity_combo.currentData()
        t = self.type_combo.currentData()
        q = self.qualifier_combo.currentData()
        matches = [m for m in ENUM_MISSION_LIST if m["service"] == s and m["activity"] == a and m["type"] == t and m["qualifier"] == q]

        with QSignalBlocker(self.entry_combo):
            self.entry_combo.clear()
            for m in matches:
                self.entry_combo.addItem(f"{m['mission']} [Code: {m['code']}]", m["id"])
            if preserve_id is not None:
                idx = self.entry_combo.findData(preserve_id)
                if idx >= 0:
                    self.entry_combo.setCurrentIndex(idx)

        self._update_preview()

    def _get_current_mission_object(self) -> Dict[str, Any]:
        m_id = self.entry_combo.currentData()
        if m_id is not None:
            for m in ENUM_MISSION_LIST:
                if m["id"] == m_id:
                    return m
        return ENUM_MISSION_LIST[22]  # Default Trader [A]

    def _update_preview(self):
        m_obj = self._get_current_mission_object()
        mod1_word = self.mod1_combo.currentData() or ""
        mod2_word = self.mod2_combo.currentData() or ""

        mod1_code = ""
        if mod1_word:
            for item in ENUM_MODIFIERS_LIST:
                if mod1_word in item["words"]:
                    mod1_code = item["code"]
                    break

        mod2_code = ""
        if mod2_word:
            for item in ENUM_MODIFIERS_LIST:
                if mod2_word in item["words"]:
                    mod2_code = item["code"]
                    break

        code = f"{m_obj['code']}{mod1_code}{mod2_code}"
        
        title_words = []
        if mod1_word:
            title_words.append(mod1_word)
        if mod2_word and mod2_word != mod1_word:
            title_words.append(mod2_word)
        title_words.append(m_obj["mission"])
        title = " ".join(title_words)

        act_str = f" > {m_obj['activity']}" if m_obj['activity'] else ""
        type_str = f" > {m_obj['type']}" if m_obj['type'] else ""
        qual_str = f" > {m_obj['qualifier']}" if m_obj['qualifier'] else ""
        hierarchy_str = f"Hierarchy: {m_obj['service']}{act_str}{type_str}{qual_str} > {m_obj['mission']} [{m_obj['code']}]"

        self.prev_code.setText(f"Classification Code: {code}")
        self.prev_title.setText(title)
        self.prev_desc.setText(hierarchy_str)

    def _apply_and_close(self):
        m_obj = self._get_current_mission_object()
        mod1_word = self.mod1_combo.currentData() or ""
        mod2_word = self.mod2_combo.currentData() or ""

        mod1_code = ""
        if mod1_word:
            for item in ENUM_MODIFIERS_LIST:
                if mod1_word in item["words"]:
                    mod1_code = item["code"]
                    break

        mod2_code = ""
        if mod2_word:
            for item in ENUM_MODIFIERS_LIST:
                if mod2_word in item["words"]:
                    mod2_code = item["code"]
                    break

        self.ship.shipName = self.name_edit.text().strip() or "Starship"
        self.ship.registration = self.reg_edit.text().strip() or "REG-0101"
        self.ship.missionId = m_obj["id"]
        self.ship.missionService = m_obj["service"]
        self.ship.missionActivity = m_obj["activity"]
        self.ship.missionType = m_obj["type"]
        self.ship.missionQualifier = m_obj["qualifier"]
        self.ship.missionName = m_obj["mission"]
        self.ship.missionCodeKey = m_obj["code"]
        self.ship.modifier1Word = mod1_word
        self.ship.modifier1Code = mod1_code
        self.ship.modifier2Word = mod2_word
        self.ship.modifier2Code = mod2_code

        self.accept()
