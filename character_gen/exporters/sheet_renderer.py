"""
Rich HTML and document renderer for T5 Character Sheet.
"""
from __future__ import annotations
from typing import Dict, Any
from character_gen.models.character import T5Character


def render_character_html(c: T5Character) -> str:
    """Generate modern dark sci-fi HTML representation of character sheet matching web tool."""
    score = c.get_playability_score()
    
    # Characteristic rows
    char_cells_header = []
    char_cells_data = []
    for stat in c.characteristics:
        name = stat.get("name", "")
        val = stat.get("value", 7)
        char_cells_header.append(f"<th>{name}</th>")
        char_cells_data.append(f"<td><strong>{val}</strong> ({stat.get('mod', 0):+d})</td>")

    if c.psi is not None:
        char_cells_header.append("<th>Psionics</th>")
        char_cells_data.append(f"<td><strong>{c.psi}</strong></td>")
    if c.sanity is not None:
        char_cells_header.append("<th>Sanity</th>")
        char_cells_data.append(f"<td><strong>{c.sanity}</strong></td>")

    # Skills list (matching web character_renderer.js skillBlock)
    skill_items = []
    for s_name in sorted(c.skills.keys()):
        s_entry = c.skills[s_name]
        lvl = s_entry.get("Skill", -1) if isinstance(s_entry, dict) else getattr(s_entry, "level", -1)
        k_dict = s_entry.get("Knowledge", {}) if isinstance(s_entry, dict) else getattr(s_entry, "knowledges", {})
        
        lvl_str = str(lvl) if lvl >= 0 else "n/a"
        is_trained = (lvl >= 1)
        trained_style = "color: #58a6ff; font-weight: bold;" if is_trained else "color: #c9d1d9;"
        
        item_html = f"<li><span style='{trained_style}'>{s_name}: {lvl_str}</span>"
        if k_dict:
            item_html += "<ul style='margin-top: 2px; margin-bottom: 4px; padding-left: 18px; list-style-type: circle;'>"
            for k_name in sorted(k_dict.keys()):
                k_lvl = k_dict[k_name]
                k_trained = (k_lvl > 0)
                k_style = "color: #3fb950; font-weight: bold;" if k_trained else "color: #8b949e;"
                item_html += f"<li><span style='{k_style}'>{k_name}: {k_lvl}</span></li>"
            item_html += "</ul>"
        item_html += "</li>"
        skill_items.append(item_html)

    skills_html = f"<ul class='skill-list'>{''.join(skill_items)}</ul>" if skill_items else "<em>No trained skills</em>"

    # Careers list
    careers_html = []
    for car in c.careers:
        c_name = car.get("career", "")
        c_terms = car.get("terms", 0)
        c_rank = car.get("rank", {})
        rank_str = ""
        if c_rank:
            if c_rank.get("officer", 0) > 0:
                rank_str = f" (Officer {c_rank['officer']})"
            elif c_rank.get("enlisted", 0) > 0:
                rank_str = f" (Enlisted {c_rank['enlisted']})"
            elif c_rank.get("label"):
                rank_str = f" ({c_rank['label']})"
        
        awards_list = car.get("awards", [])
        awards_str = f"<div class='term-skills'>Awards: {', '.join(awards_list)}</div>" if awards_list else ""
        
        careers_html.append(f"""
        <div class="term-row">
            <span class="term-title">{c_name}{rank_str}</span>
            <span class="term-status" style="color: #58a6ff;">{c_terms} Terms</span>
            {awards_str}
        </div>
        """)

    hw_info = "Homeworld: None specified"
    if c.homeworld:
        hw_name = c.homeworld.get("name", "Terra")
        hw_uwp = c.homeworld.get("uwp", "A867974-C")
        hw_sec = c.homeworld.get("sector")
        hw_hex = c.homeworld.get("hex")
        hw_loc = f" ({hw_sec} {hw_hex})" if hw_sec and hw_hex else (f" ({hw_sec})" if hw_sec else "")
        hw_tc = ", ".join(c.homeworld.get("trade_codes", []))
        hw_info = f"Homeworld: <strong>{hw_name}</strong>{hw_loc} [{hw_uwp}] ({hw_tc})"

    degrees_html = ""
    if c.majors or c.minors:
        deg_items = []
        for d in (c.majors + c.minors):
            lbl = d.get("label") or f"{d.get('skill', '')} ({d.get('knowledge', '')})"
            deg_items.append(f"<li>{lbl}</li>")
        degrees_html = f"<h3>Academic Degrees</h3><ul class='skill-list'>{''.join(deg_items)}</ul>"

    awards_html = ""
    if c.awards:
        aw_items = [f"<li>{award}</li>" for award in c.awards]
        awards_html = f"<h3>Awards & Honors</h3><ul class='skill-list'>{''.join(aw_items)}</ul>"

    history_html = ""
    if c.history:
        hist_items = [f"<li>{msg}</li>" for msg in c.history]
        history_html = f"<h3>Career Chronicle & History</h3><ul class='history-list'>{''.join(hist_items)}</ul>"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0d1117;
            color: #c9d1d9;
            padding: 16px;
            font-size: 13px;
            line-height: 1.5;
        }}
        h3 {{
            color: #58a6ff;
            margin-top: 14px;
            margin-bottom: 8px;
            border-bottom: 1px solid #30363d;
            padding-bottom: 4px;
        }}
        .header-card {{
            background-color: #161b22;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 14px;
        }}
        .char-name {{
            font-size: 18px;
            font-weight: bold;
            color: #58a6ff;
        }}
        .char-upp {{
            font-family: monospace;
            font-size: 16px;
            font-weight: bold;
            color: #3fb950;
            background: #21262d;
            padding: 2px 8px;
            border-radius: 4px;
        }}
        .stat-table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }}
        .stat-table th, .stat-table td {{
            border: 1px solid #30363d;
            padding: 6px 10px;
            text-align: center;
        }}
        .stat-table th {{
            background-color: #161b22;
            color: #8b949e;
        }}
        ul.skill-list {{
            margin: 4px 0 12px 20px;
            padding-left: 0;
            list-style-type: square;
        }}
        ul.skill-list li {{
            margin-bottom: 3px;
            font-size: 13px;
            color: #c9d1d9;
        }}
        ul.history-list {{
            margin: 4px 0 12px 20px;
            padding-left: 0;
            list-style-type: disc;
        }}
        ul.history-list li {{
            margin-bottom: 4px;
            font-size: 12px;
            color: #8b949e;
            font-family: monospace;
        }}
        .term-row {{
            background-color: #161b22;
            border-left: 3px solid #58a6ff;
            padding: 6px 10px;
            margin-bottom: 6px;
            border-radius: 0 4px 4px 0;
        }}
        .term-title {{
            font-weight: bold;
            color: #f0883e;
        }}
        .term-skills {{
            font-size: 12px;
            color: #8b949e;
        }}
        .score-pill {{
            background-color: #21262d;
            border: 1px solid #30363d;
            padding: 2px 8px;
            border-radius: 12px;
            color: #58a6ff;
            font-weight: bold;
        }}
    </style>
    </head>
    <body>
        <div class="header-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="char-name">{c.name}</span>
                <div>
                    <span class="score-pill">Score: {score['score']}</span>
                    <span class="char-upp">UPP: {c.upp}</span>
                </div>
            </div>
            <div style="margin-top: 6px; color: #8b949e;">
                {c.species} ({c.gender}) &bull; Age {c.age} &bull; Native Lang: <strong>{c.native_language}</strong> &bull; {hw_info}
            </div>
            <div style="margin-top: 4px; color: #8b949e;">
                Credits: <strong>Cr{c.credits:,}</strong> &bull; Ship Shares: <strong>{c.ship_shares}</strong> &bull; Fame: <strong>{c.fame}</strong>
            </div>
        </div>

        <h3>Characteristics</h3>
        <table class="stat-table">
            <tr>{''.join(char_cells_header)}</tr>
            <tr>{''.join(char_cells_data)}</tr>
        </table>

        <h3>Skills & Knowledges</h3>
        <div>
            {skills_html}
        </div>

        {degrees_html}

        <h3>Career Record</h3>
        <div>
            {''.join(careers_html) if careers_html else '<em>No careers pursued</em>'}
        </div>

        {awards_html}

        {history_html}
    </body>
    </html>
    """
    return html
