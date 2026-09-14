"""
Plaintext and Markdown stat block exporters for T5 Character.
"""
from __future__ import annotations
from character_gen.models.character import Character


def export_character_markdown(c: Character) -> str:
    """Generate clean Markdown character sheet."""
    lines = []
    lines.append(f"# {c.name}")
    lines.append(f"**Species**: {c.species} | **Gender**: {c.gender} | **Age**: {c.age}")
    lines.append(f"**UPP**: `{c.upp}` | **UAP**: `{c.uap}`")
    lines.append(f"**Homeworld**: {c.homeworld_name} [{c.homeworld_uwp}] ({', '.join(c.homeworld_trade_codes)})")
    lines.append(f"**Career**: {c.current_career or 'None'} (Rank: {c.rank_title or 'None'})")
    lines.append(f"**Finances**: Cr{c.credits:,} | **Pension**: Cr{c.pension:,}/yr | **Ship Shares**: {c.ship_shares}")
    lines.append("")
    
    # Characteristics Table
    lines.append("## Characteristics")
    lines.append("| Stat | Score | Hex | Genetic | Notes |")
    lines.append("| :--- | :---: | :---: | :---: | :--- |")
    for stat in [c.c1_str, c.c2_dex, c.c3_end, c.c4_int, c.c5_edu, c.c6_soc]:
        mod_str = f" ({stat.mod:+d})" if stat.mod != 0 else ""
        lines.append(f"| {stat.name} ({stat.short_name}) | {stat.total}{mod_str} | `{stat.hex}` | {stat.gene} | |")
    if c.c7_psi:
        lines.append(f"| Psionics (Psi) | {c.c7_psi.total} | `{c.c7_psi.hex}` | {c.c7_psi.gene} | |")
    if c.c8_san:
        lines.append(f"| Sanity (San) | {c.c8_san.total} | `{c.c8_san.hex}` | {c.c8_san.gene} | |")
    lines.append("")

    # Skills List
    lines.append("## Skills & Knowledges")
    skill_items = []
    for s_name, s_entry in sorted(c.skills.items()):
        if s_entry.level > 0:
            skill_items.append(f"**{s_name}-{s_entry.level}**")
        for k_name, k_lvl in sorted(s_entry.knowledges.items()):
            if k_lvl >= 0:
                skill_items.append(f"{s_name} (*{k_name}*)-{k_lvl}")
    lines.append(", ".join(skill_items) if skill_items else "None")
    lines.append("")

    # Career Terms
    if c.history:
        lines.append("## Career Terms")
        for t in c.history:
            surv_str = "Survived" if t.survived else "Injured"
            skills_str = ", ".join(t.skills_gained) if t.skills_gained else "None"
            lines.append(f"* **Term {t.term_number}** ({t.career}, {t.rank_title}, Age {t.age}): {surv_str}. Skills: {skills_str}")
        lines.append("")

    # Equipment & Awards
    if c.awards:
        lines.append("## Awards & Memberships")
        for award in c.awards:
            lines.append(f"* {award}")
        lines.append("")

    if c.equipment:
        lines.append("## Equipment & Possessions")
        for eq in c.equipment:
            lines.append(f"* {eq}")
        lines.append("")

    return "\n".join(lines)
