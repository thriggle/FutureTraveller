"""
Traveller 5 Starship Construction Calculation Engine.
Faithful Python port of calculations in Traveller/js/ShipHelper.js.
"""
from dataclasses import dataclass, field
import math
from typing import Any, Dict, List, Optional, Tuple
from core.data_models import StarshipDrivesData, StarshipHullsData
from ship_helper.models.ship import ShipDesign, SubhullItem, DriveItem, ComponentItem, ENUM_JUMP_FIELDS

_drives_data = StarshipDrivesData.load()
_hulls_data = StarshipHullsData.load()

CONFIG_RANKS = [
    "Lifting Body",
    "Airframe",
    "Streamlined",
    "Unstreamlined",
    "Planetoid",
    "Braced",
    "Cluster"
]

def get_available_tech_stages(tl: int, drive_type: str) -> List[Dict[str, Any]]:
    """Determine available drive tech stages for a given TL and drive type."""
    min_tl_map = {
        "Jump": 11,
        "Hop": 17,
        "Skip": 20,
        "Power Plant": 8,
        "M-Drive": 9,
        "G-Drive": 9,
        "Fission": 6,
        "Anti-Matter": 19,
        "Collector": 14,
        "Rocket": 7,
        "NAFAL": 9,
        "HEPlaR": 8
    }
    base_min = min_tl_map.get(drive_type, 9)
    diff = tl - base_min
    available = []

    for stage_name, stage_def in _drives_data.drive_stages.items():
        req_mod = stage_def.get("mod", 0)
        if diff >= req_mod:
            available.append({
                "stage": stage_name,
                "mod": req_mod,
                "eff": stage_def.get("eff", 1.0),
                "fuel": stage_def.get("fuel", 1.0),
                "tons": stage_def.get("tons", 1.0),
                "cost": stage_def.get("cost", 1.0)
            })
    return available

def build_drive(stage: str, nexus: int, drive_class: str, drive_type: str, tl: int, import_fee: bool = False) -> DriveItem:
    """Construct a drive item with calculated EP, tons, and cost."""
    stages = get_available_tech_stages(tl, drive_type)
    matched_stage = next((s for s in stages if s["stage"] == stage), None)
    if not matched_stage:
        eff = _drives_data.drive_stages.get(stage, {}).get("eff", 1.0)
    else:
        eff = matched_stage["eff"]

    base_ep = _drives_data.drive_classes.get(drive_class, {}).get("ep", 100)
    ep = round(base_ep * eff * nexus)

    class_val = base_ep / 100.0
    tons = 0.0
    cost = 0.0

    if drive_type == "Jump":
        base_tons = (class_val * 5) + 5
        base_cost = 1.0 * base_tons
    elif drive_type == "G-Drive":
        base_tons = 9 if class_val == 1 else (class_val * 9)
        base_cost = 0.5 * base_tons
    elif drive_type == "NAFAL":
        base_tons = class_val * 2
        base_cost = 2.0 * base_tons
    elif drive_type == "Rocket":
        base_tons = class_val * 2
        base_cost = 0.5 * base_tons
    elif drive_type == "HEPlaR":
        base_tons = class_val
        base_cost = 1.0 * base_tons
    elif drive_type == "M-Drive":
        base_tons = 2 if class_val == 1 else (class_val * 2) - 1
        base_cost = 2.0 * base_tons
    elif drive_type == "Power Plant":
        base_tons = (class_val * 3) + 1
        base_cost = 1.0 * base_tons
    elif drive_type == "Fission":
        base_tons = (class_val * 5) + 10
        base_cost = 1.5 * base_tons
    elif drive_type == "Hop":
        base_tons = (class_val * 5) + 10
        base_cost = 2.0 * base_tons
    elif drive_type == "Skip":
        base_tons = (class_val * 5) + 15
        base_cost = 3.0 * base_tons
    elif drive_type == "Anti-Matter":
        base_tons = (class_val * 2) + 2
        base_cost = 5.0 * base_tons
    elif drive_type == "Collector":
        base_tons = (class_val * 10) + 10
        base_cost = 1.0 * base_tons
    else:
        base_tons = class_val * 2
        base_cost = 1.0 * base_tons

    stg_def = _drives_data.drive_stages.get(stage, {})
    tons = base_tons * stg_def.get("tons", 1.0) * nexus
    cost = base_cost * stg_def.get("cost", 1.0) * nexus
    if import_fee:
        cost *= 1.1

    return DriveItem(
        ep=ep,
        tons=tons,
        cost=cost,
        stage=stage,
        driveClass=drive_class,
        driveType=drive_type,
        tl=tl,
        importFee=import_fee,
        maxDrivePotential=int(eff),
        nexus=nexus
    )

class ShipCalculator:
    """Calculates all metrics, power balances, and quality evaluations for a ShipDesign."""
    def __init__(self, ship: ShipDesign):
        self.ship = ship

    @property
    def total_tonnage(self) -> float:
        if not self.ship.subhulls:
            return 0.0
        return sum(h.tons for h in self.ship.subhulls)

    @property
    def configuration_type(self) -> str:
        if not self.ship.subhulls:
            return "Unstreamlined"
        worst_rank = -1
        chosen_name = "Streamlined"
        has_airframe_hull = any(not h.isPod and h.config == "Airframe" for h in self.ship.subhulls)

        for h in self.ship.subhulls:
            rank = CONFIG_RANKS.index(h.config) if h.config in CONFIG_RANKS else 3
            if h.isPod and h.config == "Streamlined" and has_airframe_hull:
                rank = CONFIG_RANKS.index("Airframe")
            if rank > worst_rank:
                worst_rank = rank
                chosen_name = CONFIG_RANKS[worst_rank]
        return chosen_name

    def get_subhull_armor_tons(self, h: SubhullItem) -> float:
        if not h.armorType or h.armorLayers <= 1:
            return 0.0
        armor_def = _hulls_data.hull_armor.get(h.armorType, {})
        mult = armor_def.get("ton_Mult", 1.0)
        return (h.armorLayers - 1) * 0.04 * h.tons * mult

    def get_subhull_av(self, h: SubhullItem) -> int:
        if not h.armorType:
            return 0
        armor_def = _hulls_data.hull_armor.get(h.armorType, {})
        av_mult = armor_def.get("AV_Mult", 1.0)
        flat_bonus = armor_def.get("AV_FlatBonus", 0)
        return int((h.tl * av_mult) + flat_bonus)

    @property
    def base_cost(self) -> float:
        total = 0.0
        for h in self.ship.subhulls:
            conf = _hulls_data.hull_configs.get(h.config, {})
            cost_rate = conf.get("cost", 0.03)
            flat = conf.get("podflatcost", 0.5) if h.isPod else conf.get("flatcost", 2.0)
            sub_cost = (h.tons * cost_rate) + flat
            if h.importFee:
                sub_cost *= 1.1
            total += sub_cost
        return total

    @property
    def total_cost(self) -> float:
        cost = self.base_cost
        for h in self.ship.subhulls:
            for d in h.drives:
                cost += d.cost
            for c in h.components:
                cost += c.cost
        return round(cost, 3)

    @property
    def all_drives(self) -> List[DriveItem]:
        return [d for h in self.ship.subhulls for d in h.drives]

    @property
    def all_components(self) -> List[ComponentItem]:
        return [c for h in self.ship.subhulls for c in h.components]

    @property
    def jump_drive(self) -> Optional[DriveItem]:
        return next((d for d in self.all_drives if d.driveType in ("Jump", "Hop", "Skip")), None)

    @property
    def maneuver_drive(self) -> Optional[DriveItem]:
        return next((d for d in self.all_drives if d.driveType in ("M-Drive", "G-Drive", "HEPlaR", "Rocket", "NAFAL")), None)

    @property
    def power_plant(self) -> Optional[DriveItem]:
        return next((d for d in self.all_drives if d.driveType in ("Power Plant", "Fission", "Anti-Matter", "Collector")), None)

    @property
    def jump_rating(self) -> int:
        if not self.jump_drive or self.total_tonnage <= 0:
            return 0
        return int(self.jump_drive.ep // self.total_tonnage)

    @property
    def maneuver_rating(self) -> int:
        if not self.maneuver_drive or self.total_tonnage <= 0:
            return 0
        return int(self.maneuver_drive.ep // self.total_tonnage)

    @property
    def power_output(self) -> float:
        if not self.power_plant:
            return 0.0
        return self.power_plant.ep

    @property
    def max_hardpoints(self) -> int:
        return max(0, int(self.total_tonnage // 100))

    @property
    def hardpoints_used(self) -> int:
        return sum(c.extra.get("hardpointReq", 0) for c in self.all_components if c.isWeapon or c.isDefense)

    @property
    def total_control_panels(self) -> int:
        return sum(c.extra.get("cp", 1) for c in self.all_components if c.isWeapon or c.isDefense or c.isConsole)

    @property
    def total_console_count(self) -> int:
        return sum(1 for c in self.all_components if c.isConsole)

    @property
    def total_console_tons(self) -> float:
        return sum(c.tons for c in self.all_components if c.isConsole)

    @property
    def control_ergonomics(self) -> float:
        cp = self.total_control_panels
        if cp <= 0:
            return 0.0
        return round(self.total_console_tons / cp, 2)

    @property
    def total_computer_cells(self) -> int:
        return sum(c.extra.get("cells", 0) for c in self.all_components if c.isComputer)

    @property
    def total_crew_berths(self) -> int:
        return sum(c.extra.get("occupants", 0) for c in self.all_components if c.isAccommodation and c.extra.get("assignment") == "Crew")

    @property
    def total_passenger_berths(self) -> int:
        return sum(c.extra.get("occupants", 0) for c in self.all_components if c.isAccommodation and c.extra.get("assignment") != "Crew" and not c.extra.get("isCryo"))

    @property
    def total_low_berths(self) -> int:
        return sum(c.extra.get("occupants", 0) for c in self.all_components if c.isAccommodation and c.extra.get("isCryo"))

    def safe_jump_distance(self, engineer_skill: Optional[int] = None, jump_specialty: Optional[int] = None) -> Dict[str, Any]:
        """Calculate Section 07 safe jump distance D and jump field metrics matching T5 Table 07G."""
        j_drive = self.jump_drive
        has_jump_drive = j_drive is not None
        stg_def = _drives_data.drive_stages.get(j_drive.stage, {}) if j_drive else {}
        eff = stg_def.get("eff", 1.0)
        
        field_def = ENUM_JUMP_FIELDS.get(self.ship.jumpFieldKey, ENUM_JUMP_FIELDS["Bubble"])
        strength = field_def["strength"]  # 100 for Bubble, 80 for Grid, 140 for Plates
        
        eng_rank = min(15, max(0, engineer_skill if engineer_skill is not None else self.ship.engineerSkill))
        jd_rank = min(6, max(0, jump_specialty if jump_specialty is not None else self.ship.jumpDriveSpecialty))
        total_eng = eng_rank + jd_rank
        
        # Safe Jump Distance D = (Field Strength / Drive Efficiency) - Engineer Skill
        raw_d = (strength / eff) - total_eng
        d_val = max(0.0, round(raw_d, 1))
        
        return {
            "hasJumpDrive": has_jump_drive,
            "strength": strength,
            "E": eff,
            "engineerRank": eng_rank,
            "jumpDriveSpecialty": jd_rank,
            "totalEngineerSkill": total_eng,
            "D": d_val,
            "safeDiameters": d_val,
            "fieldName": field_def["name"],
            "fieldKey": field_def["key"],
            "armorMod": field_def["armorMod"],
            "flash": field_def["flash"],
            "comment": field_def["comment"],
            "driveStage": j_drive.stage if j_drive else "None"
        }

    def jump_interference(self, engineer_skill: Optional[int] = None, jump_specialty: Optional[int] = None, actual_diameters: Optional[float] = None, gravity_flux: float = 0.0) -> Dict[str, Any]:
        """Calculate Section 07 Jump Interference and Misjump Risk."""
        safe = self.safe_jump_distance(engineer_skill, jump_specialty)
        if not safe["hasJumpDrive"]:
            return {
                "hasJumpDrive": False,
                "X": 0.0,
                "jumpDistance": 0.0,
                "gravityFlux": 0.0,
                "misjumpRisk": "No Jump Drive Fitted",
                "riskClass": "warning",
                "safetyMargin": 0.0
            }
        
        flux = float(gravity_flux or 0.0)
        jump_dist = float(actual_diameters) if (actual_diameters is not None and not math.isnan(float(actual_diameters))) else safe["D"]
        
        # X = Field Str / Efficiency - (Engineer + Diameters) (+ flux)
        x_val = round(((safe["strength"] / safe["E"]) - (safe["totalEngineerSkill"] + jump_dist) + flux), 1)
        
        misjump_risk = "Nominal / Safe (0% Misjump Risk)"
        risk_class = "good"
        if x_val > 2.0:
            misjump_risk = "Critical Hazard (Severe Misjump / Field Collapse)"
            risk_class = "warning"
        elif x_val > 0.5:
            misjump_risk = "Caution (Minor Flux / +1 Jump Difficulty)"
            risk_class = "warning"
        elif x_val > 0.0:
            misjump_risk = "Acceptable Standard"
            risk_class = "good"
            
        return {
            "hasJumpDrive": True,
            "X": x_val,
            "jumpDistance": jump_dist,
            "gravityFlux": flux,
            "misjumpRisk": misjump_risk,
            "riskClass": risk_class,
            "safetyMargin": max(0.0, round(10.0 - x_val, 1))
        }

    def get_quality_evaluations(self) -> Dict[str, Any]:
        """Compute Section 26 Livability & Operator Quality evaluations."""
        pax_berths = self.total_passenger_berths
        pax_tons = sum(c.tons for c in self.all_components if c.isAccommodation and c.extra.get("assignment") != "Crew" and not c.extra.get("isCommons"))
        crew_berths = self.total_crew_berths
        crew_tons = sum(c.tons for c in self.all_components if c.isAccommodation and c.extra.get("assignment") == "Crew")
        panels = self.total_control_panels
        console_tons = self.total_console_tons

        # Demand D = (T / P) - 5
        d_val = round(((pax_tons / pax_berths) - 5), 1) if pax_berths > 0 else 0.0
        # Comfort C = Q / M
        effective_crew = max(1, crew_berths)
        c_val = round((crew_tons / effective_crew), 2)
        # Ergonomics E = Console Tons / Total CP
        e_val = self.control_ergonomics

        return {
            "demand": d_val,
            "comfort": c_val,
            "ergonomics": e_val,
            "demandRating": "Luxury" if d_val >= 3.0 else ("Standard" if d_val >= 0 else "Cramped"),
            "comfortRating": "Spacious" if c_val >= 2.0 else ("Standard" if c_val >= 1.0 else "Cramped"),
            "ergoRating": "Superior" if e_val >= 1.0 else ("Standard" if e_val >= 0.5 else "Deficient")
        }
