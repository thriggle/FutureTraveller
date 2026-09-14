"""
Left Sidebar Stats and Profile Panel for T5 Character Creator.
"""
from typing import Optional
from PySide6.QtCore import Qt
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QFrame,
    QGridLayout, QScrollArea
)
from character_gen.models.character import T5Character, to_hex_char


class StatTile(QFrame):
    """Small card displaying a single characteristic."""
    def __init__(self, name: str, value: int, mod: int = 0, gene: int = 3, short_name: str = "", parent=None):
        super().__init__(parent)
        self.setFrameShape(QFrame.StyledPanel)
        self.setStyleSheet("""
            QFrame {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 6px;
                padding: 6px;
            }
        """)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(4, 4, 4, 4)
        layout.setSpacing(2)

        header = QHBoxLayout()
        name_lbl = QLabel(f"<b>{name}</b>")
        name_lbl.setStyleSheet("color: #8b949e; font-size: 11px;")
        name_lbl.setToolTip(f"{name} ({short_name})")
        header.addWidget(name_lbl)

        hex_digit = to_hex_char(value)
        hex_lbl = QLabel(f"[{hex_digit}]")
        hex_lbl.setStyleSheet("color: #58a6ff; font-family: monospace; font-size: 11px; font-weight: bold;")
        header.addStretch()
        header.addWidget(hex_lbl)
        layout.addLayout(header)

        val_box = QHBoxLayout()
        val_lbl = QLabel(str(value))
        val_lbl.setStyleSheet("color: #f0f6fc; font-size: 18px; font-weight: bold;")
        val_box.addWidget(val_lbl)

        if mod != 0:
            mod_color = "#3fb950" if mod > 0 else "#f85149"
            mod_lbl = QLabel(f"{mod:+d}")
            mod_lbl.setStyleSheet(f"color: {mod_color}; font-size: 12px; font-weight: bold;")
            val_box.addWidget(mod_lbl)

        val_box.addStretch()
        layout.addLayout(val_box)

        gene_lbl = QLabel(f"Gene: {gene}")
        gene_lbl.setStyleSheet("color: #8b949e; font-size: 10px;")
        layout.addWidget(gene_lbl)


class CharacterStatsPanel(QWidget):
    """Left side profile and characteristics panel."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.character: Optional[T5Character] = None
        self.init_ui()

    def init_ui(self):
        self.main_layout = QVBoxLayout(self)
        self.main_layout.setContentsMargins(10, 10, 10, 10)
        self.main_layout.setSpacing(12)

        # Profile Card
        self.profile_frame = QFrame()
        self.profile_frame.setStyleSheet("""
            QFrame {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 8px;
                padding: 10px;
            }
        """)
        pf_layout = QVBoxLayout(self.profile_frame)
        pf_layout.setSpacing(6)

        self.name_label = QLabel("<b>J. Doe</b>")
        self.name_label.setStyleSheet("color: #58a6ff; font-size: 16px;")
        pf_layout.addWidget(self.name_label)

        self.species_label = QLabel("Humaniti (M) &bull; Age 18")
        self.species_label.setStyleSheet("color: #c9d1d9; font-size: 12px;")
        pf_layout.addWidget(self.species_label)

        # Score & UPP Card
        upp_box = QHBoxLayout()
        self.score_label = QLabel("Score: 0.0")
        self.score_label.setStyleSheet("color: #58a6ff; font-weight: bold; font-size: 12px;")
        upp_box.addWidget(self.score_label)
        upp_box.addStretch()

        self.upp_label = QLabel("777777")
        self.upp_label.setStyleSheet("""
            background-color: #21262d;
            color: #3fb950;
            font-family: monospace;
            font-size: 14px;
            font-weight: bold;
            padding: 3px 8px;
            border-radius: 4px;
        """)
        upp_box.addWidget(self.upp_label)
        pf_layout.addLayout(upp_box)

        self.homeworld_label = QLabel("Homeworld: None")
        self.homeworld_label.setStyleSheet("color: #8b949e; font-size: 11px;")
        pf_layout.addWidget(self.homeworld_label)

        self.main_layout.addWidget(self.profile_frame)

        # Stats Grid Section
        stats_title = QLabel("<b>CHARACTERISTICS</b>")
        stats_title.setStyleSheet("color: #8b949e; font-size: 11px; letter-spacing: 1px;")
        self.main_layout.addWidget(stats_title)

        self.stats_grid = QGridLayout()
        self.stats_grid.setSpacing(6)
        self.main_layout.addLayout(self.stats_grid)

        # Career & Finances Card
        self.career_frame = QFrame()
        self.career_frame.setStyleSheet("""
            QFrame {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 6px;
                padding: 8px;
            }
        """)
        cf_layout = QVBoxLayout(self.career_frame)
        cf_layout.setSpacing(4)

        cf_title = QLabel("<b>FINANCES & CAREER</b>")
        cf_title.setStyleSheet("color: #8b949e; font-size: 11px; letter-spacing: 1px;")
        cf_layout.addWidget(cf_title)

        self.career_info = QLabel("Career: None")
        self.career_info.setStyleSheet("color: #f0883e; font-weight: bold; font-size: 12px;")
        cf_layout.addWidget(self.career_info)

        self.credits_info = QLabel("Credits: Cr0")
        self.credits_info.setStyleSheet("color: #c9d1d9; font-size: 12px;")
        cf_layout.addWidget(self.credits_info)

        self.shares_info = QLabel("Ship Shares: 0")
        self.shares_info.setStyleSheet("color: #c9d1d9; font-size: 12px;")
        cf_layout.addWidget(self.shares_info)

        self.fame_info = QLabel("Fame: 0")
        self.fame_info.setStyleSheet("color: #c9d1d9; font-size: 12px;")
        cf_layout.addWidget(self.fame_info)

        self.talent_info = QLabel("Talent: None")
        self.talent_info.setStyleSheet("color: #d29922; font-size: 12px; font-weight: bold;")
        self.talent_info.setVisible(False)
        cf_layout.addWidget(self.talent_info)

        self.main_layout.addWidget(self.career_frame)
        self.main_layout.addStretch()

    def update_character(self, c: T5Character):
        self.character = c
        self.name_label.setText(f"<b>{c.name}</b>")
        self.species_label.setText(f"{c.species} ({c.gender}) &bull; Age {c.age}")
        self.upp_label.setText(c.upp)
        
        score = c.get_playability_score()
        self.score_label.setText(f"Score: {score['score']}")

        hw = c.homeworld
        if hw:
            hw_sec = hw.get('sector')
            hw_loc = f" ({hw_sec})" if hw_sec else ""
            self.homeworld_label.setText(f"Homeworld: {hw.get('name', 'Terra')}{hw_loc} [{hw.get('uwp', 'A867974-C')}]")
        else:
            self.homeworld_label.setText("Homeworld: None")

        # Safely detach and clear stats grid
        while self.stats_grid.count():
            item = self.stats_grid.takeAt(0)
            if item:
                w = item.widget()
                if w:
                    w.setParent(None)
                    w.deleteLater()

        # Rebuild stat tiles
        genes = c.genetics or [3, 3, 3, 3]
        for idx, stat in enumerate(c.characteristics):
            gene_val = genes[idx] if idx < len(genes) else stat.get("gene", 3)
            stat_name = stat.get("name", f"C{idx+1}")
            short_name = stat.get("short_name", "")
            tile = StatTile(stat_name, stat.get("value", 7), stat.get("mod", 0), gene_val, short_name)
            self.stats_grid.addWidget(tile, idx // 2, idx % 2)

        # Career & Finances
        active_career = next((car["career"] for car in c.careers if car.get("active")), None)
        self.career_info.setText(f"Active Career: {active_career or 'None'}")
        self.credits_info.setText(f"Credits: Cr{c.credits:,}")
        self.shares_info.setText(f"Ship Shares: {c.ship_shares}")
        self.fame_info.setText(f"Fame: {c.fame}")

        # Talent (e.g. Rage)
        if c.talent and c.talent.get("name") and c.talent.get("name") != "Undefined" and c.talent.get("name") != "undefined":
            t_name = c.talent.get("name")
            t_val = c.talent.get("value", 1)
            self.talent_info.setText(f"Talent: {t_name} ({t_val})")
            self.talent_info.setVisible(True)
        else:
            self.talent_info.setVisible(False)
