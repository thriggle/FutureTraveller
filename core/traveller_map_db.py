"""
Traveller Map SQLite Database Accessor and Search Engine.
Connects to data/traveller_map.db for local sector and world queries.
"""
from __future__ import annotations
import sqlite3
from pathlib import Path
from typing import List, Dict, Optional, Any
import random


STANDARD_T5_TRADE_CODES = {
    "Ag": "Agricultural", "As": "Asteroid", "Ba": "Barren",
    "De": "Desert", "Fl": "Fluid Hydro", "Ga": "Garden",
    "Hi": "High Population", "Ht": "High Tech", "Ic": "Ice-Capped",
    "In": "Industrial", "Lo": "Low Population", "Lt": "Low Tech",
    "Na": "Non-Agricultural", "Ni": "Non-Industrial", "Po": "Poor",
    "Ri": "Rich", "Va": "Vacuum", "Wa": "Water World"
}


def parse_trade_codes(remarks: Optional[str]) -> List[str]:
    """Extract standard T5 trade codes from world remarks string."""
    if not remarks:
        return []
    tokens = remarks.replace(",", " ").split()
    matched = []
    for tok in tokens:
        clean = tok.strip("()[]{}")
        if clean in STANDARD_T5_TRADE_CODES and clean not in matched:
            matched.append(clean)
    return matched


class TravellerMapDB:
    """Interface to local traveller_map.db."""
    def __init__(self, db_path: Optional[Path] = None):
        if db_path is None:
            db_path = Path(__file__).resolve().parent.parent / "data" / "traveller_map.db"
        self.db_path = db_path

    def _get_connection(self) -> sqlite3.Connection:
        if not self.db_path.exists():
            raise FileNotFoundError(f"Database not found at {self.db_path}")
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def is_available(self) -> bool:
        return self.db_path.exists()

    def get_milieux(self) -> List[str]:
        """Get all available milestones/eras."""
        if not self.is_available():
            return ["M1105"]
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute("SELECT name FROM MILIEU ORDER BY name ASC")
            return [row["name"] for row in cur.fetchall()]
        finally:
            conn.close()

    def get_sectors(self, milieu: str = "M1105") -> List[Dict[str, Any]]:
        """Get all sectors in a given milieu."""
        if not self.is_available():
            return []
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT S.id, S.name, S.abbreviation, S.x, S.y
                FROM SECTOR S
                JOIN MILIEU M ON S.milieu_id = M.id
                WHERE M.name = ?
                ORDER BY S.name ASC
            """, (milieu,))
            return [dict(row) for row in cur.fetchall()]
        finally:
            conn.close()

    def get_worlds_in_sector(self, sector_name: str, milieu: str = "M1105") -> List[Dict[str, Any]]:
        """Get all worlds within a specific sector and milieu."""
        if not self.is_available():
            return []
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT 
                    W.id, W.hex, W.name, W.uwp, W.starport, W.size,
                    W.atmosphere, W.hydrographics, W.population, W.government,
                    W.law, W.tech_level, W.bases, W.remarks, W.allegiance,
                    W.stars, W.ix, W.ex, W.cx,
                    SS.name as subsector_name, SS."index" as subsector_index,
                    S.name as sector_name
                FROM WORLD W
                JOIN SUBSECTOR SS ON W.subsector_id = SS.id
                JOIN SECTOR S ON SS.sector_id = S.id
                JOIN MILIEU M ON S.milieu_id = M.id
                WHERE M.name = ? AND (S.name = ? OR S.abbreviation = ?)
                ORDER BY W.name ASC, W.hex ASC
            """, (milieu, sector_name, sector_name))
            
            worlds = []
            for row in cur.fetchall():
                d = dict(row)
                d["trade_codes"] = parse_trade_codes(d.get("remarks"))
                worlds.append(d)
            return worlds
        finally:
            conn.close()

    def search_worlds(self, query: str, milieu: str = "M1105", limit: int = 100) -> List[Dict[str, Any]]:
        """Search worlds across all sectors in a milieu by name or hex."""
        if not self.is_available() or not query.strip():
            return []
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute("""
                SELECT 
                    W.id, W.hex, W.name, W.uwp, W.remarks, W.tech_level,
                    SS.name as subsector_name, S.name as sector_name
                FROM WORLD W
                JOIN SUBSECTOR SS ON W.subsector_id = SS.id
                JOIN SECTOR S ON SS.sector_id = S.id
                JOIN MILIEU M ON S.milieu_id = M.id
                WHERE M.name = ? AND (W.name LIKE ? OR W.hex = ?)
                ORDER BY CASE WHEN W.name = ? THEN 0 ELSE 1 END, W.name ASC
                LIMIT ?
            """, (milieu, f"%{query.strip()}%", query.strip(), query.strip(), limit))
            
            worlds = []
            for row in cur.fetchall():
                d = dict(row)
                d["trade_codes"] = parse_trade_codes(d.get("remarks"))
                worlds.append(d)
            return worlds
        finally:
            conn.close()

    def get_random_world(self, milieu: str = "M1105", sector_name: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Select a random world from the database."""
        if not self.is_available():
            return None
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            if sector_name:
                cur.execute("""
                    SELECT 
                        W.id, W.hex, W.name, W.uwp, W.starport, W.size,
                        W.atmosphere, W.hydrographics, W.population, W.government,
                        W.law, W.tech_level, W.bases, W.remarks, W.allegiance,
                        SS.name as subsector_name, S.name as sector_name
                    FROM WORLD W
                    JOIN SUBSECTOR SS ON W.subsector_id = SS.id
                    JOIN SECTOR S ON SS.sector_id = S.id
                    JOIN MILIEU M ON S.milieu_id = M.id
                    WHERE M.name = ? AND S.name = ?
                    ORDER BY RANDOM()
                    LIMIT 1
                """, (milieu, sector_name))
            else:
                cur.execute("""
                    SELECT 
                        W.id, W.hex, W.name, W.uwp, W.starport, W.size,
                        W.atmosphere, W.hydrographics, W.population, W.government,
                        W.law, W.tech_level, W.bases, W.remarks, W.allegiance,
                        SS.name as subsector_name, S.name as sector_name
                    FROM WORLD W
                    JOIN SUBSECTOR SS ON W.subsector_id = SS.id
                    JOIN SECTOR S ON SS.sector_id = S.id
                    JOIN MILIEU M ON S.milieu_id = M.id
                    WHERE M.name = ?
                    ORDER BY RANDOM()
                    LIMIT 1
                """, (milieu,))
                
            row = cur.fetchone()
            if row:
                d = dict(row)
                d["trade_codes"] = parse_trade_codes(d.get("remarks"))
                return d
            return None
        finally:
            conn.close()


_traveller_map_db: Optional[TravellerMapDB] = None

def get_traveller_map_db() -> TravellerMapDB:
    global _traveller_map_db
    if _traveller_map_db is None:
        _traveller_map_db = TravellerMapDB()
    return _traveller_map_db
