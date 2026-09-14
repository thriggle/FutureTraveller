"""
Mustering out allocation dialog for T5 Character Creator.
"""
from typing import Optional
from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QSpinBox, QGroupBox, QFormLayout
)
from character_gen.models.character import Character
from character_gen.engine.muster_out import calculate_muster_rolls


class MusteringDialog(QDialog):
    """Modal dialog allowing the player to choose how many Cash vs Material rolls to take."""
    def __init__(self, character: Character, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Mustering Out Allocation")
        self.resize(360, 260)
        self.character = character
        
        self.total_rolls = calculate_muster_rolls(character)
        self.cash_rolls = min(3, self.total_rolls // 2 + 1)
        self.benefit_rolls = self.total_rolls - self.cash_rolls
        
        self.setStyleSheet("""
            QDialog {
                background-color: #0d1117;
                color: #c9d1d9;
            }
            QLabel {
                color: #f0f6fc;
                font-size: 13px;
            }
            QGroupBox {
                border: 1px solid #30363d;
                border-radius: 6px;
                margin-top: 10px;
                padding-top: 12px;
                color: #58a6ff;
                font-weight: bold;
            }
            QSpinBox {
                background-color: #161b22;
                border: 1px solid #30363d;
                border-radius: 4px;
                color: #f0f6fc;
                padding: 4px 8px;
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
        """)

        layout = QVBoxLayout(self)
        layout.setSpacing(12)
        layout.setContentsMargins(14, 14, 14, 14)

        info_lbl = QLabel(f"You have earned <b>{self.total_rolls}</b> mustering out rolls from your service.")
        info_lbl.setWordWrap(True)
        layout.addWidget(info_lbl)

        rule_lbl = QLabel("<small style='color:#8b949e;'>Note: T5 rules allow a maximum of 3 Cash table rolls.</small>")
        layout.addWidget(rule_lbl)

        gb = QGroupBox("Roll Allocation")
        form = QFormLayout(gb)

        self.cash_spin = QSpinBox()
        self.cash_spin.setRange(0, min(3, self.total_rolls))
        self.cash_spin.setValue(self.cash_rolls)
        self.cash_spin.valueChanged.connect(self._on_cash_changed)
        form.addRow("Cash Table Rolls (Max 3):", self.cash_spin)

        self.benefit_spin = QSpinBox()
        self.benefit_spin.setRange(0, self.total_rolls)
        self.benefit_spin.setValue(self.benefit_rolls)
        self.benefit_spin.valueChanged.connect(self._on_benefit_changed)
        form.addRow("Benefits Table Rolls:", self.benefit_spin)

        layout.addWidget(gb)

        btn_box = QHBoxLayout()
        btn_box.addStretch()
        
        ok_btn = QPushButton("Roll Muster Out")
        ok_btn.setObjectName("primaryBtn")
        ok_btn.clicked.connect(self.accept)
        btn_box.addWidget(ok_btn)

        layout.addLayout(btn_box)

    def _on_cash_changed(self, val: int):
        self.cash_rolls = val
        self.benefit_rolls = max(0, self.total_rolls - val)
        self.benefit_spin.blockSignals(True)
        self.benefit_spin.setValue(self.benefit_rolls)
        self.benefit_spin.blockSignals(False)

    def _on_benefit_changed(self, val: int):
        self.benefit_rolls = val
        self.cash_rolls = min(3, max(0, self.total_rolls - val))
        self.cash_spin.blockSignals(True)
        self.cash_spin.setValue(self.cash_rolls)
        self.cash_spin.blockSignals(False)
