"""
Traveller 5 Starship Construction Component Catalog & Factory Builders.
Provides full definitions and builders for all starship components matching ShipHelper.js.
"""
from typing import Any, Dict, List, Optional
from core.data_models import StarshipDrivesData, StarshipHullsData
from ship_helper.models.ship import ComponentItem, DriveItem, SubhullItem
from ship_helper.engine.ship_engine import build_drive, get_available_tech_stages

_drives_data = StarshipDrivesData.load()
_hulls_data = StarshipHullsData.load()

# --- Catalogs & Definitions ---

ACCOMMODATION_CATALOG = {
    "StandardStateroom": {
        "key": "StandardStateroom",
        "name": "Standard Stateroom (4t)",
        "tons": 4.0,
        "cost": 0.5,
        "occupants": 1,
        "fresher": True,
        "comfort": 1.0,
        "defaultRole": "Crew",
        "isCryo": False,
        "isCommons": False,
        "comment": "Standard single-occupancy stateroom with private fresher."
    },
    "DoubleStateroom": {
        "key": "DoubleStateroom",
        "name": "Double Stateroom (4t)",
        "tons": 4.0,
        "cost": 0.5,
        "occupants": 2,
        "fresher": True,
        "comfort": 0.5,
        "defaultRole": "Crew",
        "isCryo": False,
        "isCommons": False,
        "comment": "Double-occupancy stateroom for paired crew or standard passengers."
    },
    "Suite": {
        "key": "Suite",
        "name": "Luxury Suite (10t)",
        "tons": 10.0,
        "cost": 1.5,
        "occupants": 1,
        "fresher": True,
        "comfort": 3.0,
        "defaultRole": "HighPax",
        "isCryo": False,
        "isCommons": False,
        "comment": "Spacious luxury accommodation with private lounge and amenities."
    },
    "CrampedStateroom": {
        "key": "CrampedStateroom",
        "name": "Cramped Stateroom (2t)",
        "tons": 2.0,
        "cost": 0.25,
        "occupants": 1,
        "fresher": False,
        "comfort": 0.25,
        "defaultRole": "Crew",
        "isCryo": False,
        "isCommons": False,
        "comment": "Spartan mini-berth for scouts, escorts, or short hauls."
    },
    "Bunk": {
        "key": "Bunk",
        "name": "Barracks Bunk (1t)",
        "tons": 1.0,
        "cost": 0.1,
        "occupants": 1,
        "fresher": False,
        "comfort": 0.1,
        "defaultRole": "Crew",
        "isCryo": False,
        "isCommons": False,
        "comment": "Shared bunkhouse or marine troop billet."
    },
    "LowBerth": {
        "key": "LowBerth",
        "name": "Cryogenic Low Berth (0.5t)",
        "tons": 0.5,
        "cost": 0.1,
        "occupants": 1,
        "fresher": False,
        "comfort": 0.0,
        "defaultRole": "LowPax",
        "isCryo": True,
        "isCommons": False,
        "comment": "Suspended animation capsule for frozen low passengers."
    },
    "PassengerCommons": {
        "key": "PassengerCommons",
        "name": "Passenger Lounge / Commons",
        "tons": 10.0,
        "cost": 0.5,
        "occupants": 0,
        "fresher": False,
        "comfort": 1.0,
        "defaultRole": "Passenger",
        "isCryo": False,
        "isCommons": True,
        "comment": "Recreational lounge, observation deck, and communal dining."
    }
}

FACILITY_CATALOG = {
    "StandardCargo": {
        "key": "StandardCargo",
        "name": "Cargo Hold",
        "category": "Cargo",
        "fixedSize": False,
        "unitTons": 1.0,
        "unitCost": 0.0,
        "isCargo": True,
        "comment": "Standard secured freight cargo space."
    },
    "Armory": {
        "key": "Armory",
        "name": "Ship Armory",
        "category": "Security",
        "fixedSize": True,
        "unitTons": 2.0,
        "unitCost": 0.5,
        "isArmory": True,
        "comment": "Secured locker with reinforced bulkheads for weapons and armor."
    },
    "MedicalBay": {
        "key": "MedicalBay",
        "name": "Medical Sickbay",
        "category": "Medical",
        "fixedSize": True,
        "unitTons": 4.0,
        "unitCost": 2.0,
        "isMedical": True,
        "comment": "Fully equipped trauma care and surgery suite with autodoc."
    },
    "ScienceLab": {
        "key": "ScienceLab",
        "name": "Laboratory Suite",
        "category": "Science",
        "fixedSize": True,
        "unitTons": 4.0,
        "unitCost": 1.0,
        "isLab": True,
        "comment": "Modular research station with analysis sensors and containment."
    },
    "Workshop": {
        "key": "Workshop",
        "name": "Machine Workshop",
        "category": "Engineering",
        "fixedSize": True,
        "unitTons": 4.0,
        "unitCost": 1.0,
        "isWorkshop": True,
        "comment": "Fabrication tools and parts storage for starship repairs."
    }
}

LIFE_SUPPORT_CATALOG = {
    "ExtendedLifeSupport": {
        "key": "ExtendedLifeSupport",
        "name": "Extended Life Support Consumables",
        "costPerTon": 0.01,
        "personDaysPerTon": 100,
        "comment": "Oxygen, water, and food stores (1 ton = 100 person-days)."
    },
    "RecyclerUnit": {
        "key": "RecyclerUnit",
        "name": "Closed-Loop Life Support Recycler",
        "tons": 2.0,
        "cost": 1.0,
        "efficiencyBonus": 50,
        "comment": "Atmosphere and water reclamation unit extending consumables."
    }
}

WEAPON_CATALOG = {
    "BeamLaser": {"name": "Beam Laser", "code": "L", "category": "Beams", "baseTL": 10, "defaultMount": "T1", "baseCost": 0.5, "comment": "Continuous beam weapon offering high precision targeting."},
    "PulseLaser": {"name": "Pulse Laser", "code": "K", "category": "Beams", "baseTL": 9, "defaultMount": "T1", "baseCost": 0.3, "comment": "High-energy burst laser optimized for armor ablation."},
    "MiningLaser": {"name": "Mining Laser", "code": "J", "category": "Beams", "baseTL": 8, "defaultMount": "T1", "baseCost": 0.5, "comment": "Short pulsed industrial laser with high thermal output."},
    "PlasmaGun": {"name": "Plasma Gun", "code": "P", "category": "Beams", "baseTL": 11, "defaultMount": "B1", "baseCost": 1.0, "comment": "Superheated magnetically-contained plasma packet projector."},
    "FusionGun": {"name": "Fusion Gun", "code": "F", "category": "Beams", "baseTL": 12, "defaultMount": "B1", "baseCost": 1.5, "comment": "High-yield thermonuclear fusion bolt projector."},
    "Missile": {"name": "Missile Rack", "code": "M", "category": "Missiles", "baseTL": 7, "defaultMount": "T1", "baseCost": 2.0, "comment": "Standard space-combat guided missile launcher."},
    "SalvoRack": {"name": "Salvo Rack", "code": "V", "category": "Missiles", "baseTL": 10, "defaultMount": "Bay", "baseCost": 10.0, "comment": "High-density multi-missile saturation battery."},
    "RailGun": {"name": "Rail Gun", "code": "R", "category": "Kinetic", "baseTL": 12, "defaultMount": "Bay", "baseCost": 12.0, "comment": "Linear electromagnetic mass accelerator."},
    "SandCaster": {"name": "SandCaster", "code": "S", "category": "Special", "baseTL": 9, "defaultMount": "T1", "baseCost": 0.1, "comment": "Refractory sand canister launcher to diffuse laser beams."},
    "ParticleAccel": {"name": "Particle Accelerator (PA)", "code": "A", "category": "Heavy", "baseTL": 11, "defaultMount": "B1", "baseCost": 2.5, "comment": "Relativistic subatomic particle cannon."},
    "MesonGun": {"name": "Meson Gun", "code": "G", "category": "Heavy", "baseTL": 13, "defaultMount": "M", "baseCost": 5.0, "comment": "Meson beam bypassing conventional hull armor."}
}

DEFENSE_CATALOG = {
    "NuclearDamper": {"name": "Nuclear Damper", "code": "N", "category": "Screens", "baseTL": 12, "defaultMount": "Bo", "baseCost": 1.0, "comment": "Suppresses strong nuclear force; neutralizes warheads."},
    "MesonScreen": {"name": "Meson Screen", "code": "G", "category": "Screens", "baseTL": 13, "defaultMount": "Bo", "baseCost": 3.0, "comment": "Deflects and decays hostile meson beams."},
    "ProtonScreen": {"name": "Proton Screen", "code": "R", "category": "Screens", "baseTL": 19, "defaultMount": "Bo", "baseCost": 1.0, "comment": "High-energy charged particle screen."},
    "BlackGlobe": {"name": "Black Globe Generator", "code": "T", "category": "Globes", "baseTL": 16, "defaultMount": "Bo", "baseCost": 10.0, "comment": "Absorbs incoming energy into force field."},
    "StealthMask": {"name": "Stealth Mask System", "code": "Q", "category": "EW", "baseTL": 12, "defaultMount": "Surf", "baseCost": 1.0, "comment": "Signature reduction masking array."},
    "Jammer": {"name": "EW Jammer", "code": "J", "category": "EW", "baseTL": 8, "defaultMount": "Surf", "baseCost": 1.0, "comment": "Active radar and radio frequency jammer."}
}

SENSOR_CATALOG = {
    "Communicator": {"name": "Communicator Array", "code": "C", "category": "Comms", "baseTL": 8, "defaultMount": "Surf", "baseCost": 1.0, "comment": "Subspace and radio transceiver."},
    "Radar": {"name": "Radar Suite", "code": "R", "category": "Active", "baseTL": 9, "defaultMount": "Surf", "baseCost": 1.0, "comment": "Active radar pulse detection."},
    "Lidar": {"name": "Lidar Suite", "code": "L", "category": "Active", "baseTL": 11, "defaultMount": "Surf", "baseCost": 1.0, "comment": "Laser ranging and imaging array."},
    "Densitometer": {"name": "Densitometer", "code": "D", "category": "Gravitic", "baseTL": 14, "defaultMount": "Surf", "baseCost": 1.0, "comment": "Measures density variations through solid structures."},
    "Neutrino": {"name": "Neutrino Sensor", "code": "N", "category": "Nuclear", "baseTL": 10, "defaultMount": "Surf", "baseCost": 1.0, "comment": "Detects power plant neutrino emissions."},
    "Scanner": {"name": "Deep Scanner", "code": "S", "category": "Active", "baseTL": 12, "defaultMount": "Surf", "baseCost": 1.0, "comment": "High-penetration active search scanner."}
}

MOUNTS_DEF = {
    "Surf": {"name": "Surface Mount", "tons": 0.0, "cost": 1.0, "hardpointReq": 0, "cp": 1},
    "T1": {"name": "Single Turret (T1)", "tons": 1.0, "cost": 0.2, "hardpointReq": 1, "cp": 1},
    "T2": {"name": "Dual Turret (T2)", "tons": 1.0, "cost": 0.5, "hardpointReq": 1, "cp": 1},
    "T3": {"name": "Triple Turret (T3)", "tons": 1.0, "cost": 1.0, "hardpointReq": 1, "cp": 1},
    "T4": {"name": "Quad Turret (T4)", "tons": 1.0, "cost": 1.5, "hardpointReq": 1, "cp": 1},
    "B1": {"name": "Single Barbette (B1)", "tons": 3.0, "cost": 3.0, "hardpointReq": 1, "cp": 1},
    "B2": {"name": "Dual Barbette (B2)", "tons": 5.0, "cost": 4.0, "hardpointReq": 1, "cp": 1},
    "Bay": {"name": "Small Bay (50t)", "tons": 50.0, "cost": 5.0, "hardpointReq": 5, "cp": 2},
    "LBay": {"name": "Large Bay (100t)", "tons": 100.0, "cost": 10.0, "hardpointReq": 10, "cp": 3},
    "M": {"name": "Spinal / Main Mount (200t)", "tons": 200.0, "cost": 20.0, "hardpointReq": 20, "cp": 4},
    "Bo": {"name": "Internal / Barbette Mount", "tons": 1.0, "cost": 1.0, "hardpointReq": 1, "cp": 1}
}

# --- Builder Functions ---

def build_accommodation(type_key: str, count: int = 1, tl: int = 12, assignment: Optional[str] = None, custom_tons: Optional[float] = None, import_fee: bool = False) -> ComponentItem:
    a_def = ACCOMMODATION_CATALOG.get(type_key, ACCOMMODATION_CATALOG["StandardStateroom"])
    cnt = max(1, count)
    role = assignment or a_def["defaultRole"]
    
    single_tons = custom_tons if (a_def["isCommons"] and custom_tons is not None) else a_def["tons"]
    total_tons = single_tons * (1 if a_def["isCommons"] else cnt)
    single_cost = a_def["cost"] * (1.1 if import_fee else 1.0)
    total_cost = single_cost * cnt
    total_occupants = a_def["occupants"] * cnt

    return ComponentItem(
        name=f"{cnt}x {a_def['name']}" if cnt > 1 and not a_def['isCommons'] else a_def['name'],
        tons=round(total_tons, 2),
        cost=round(total_cost, 3),
        tl=tl,
        isAccommodation=True,
        extra={
            "accommodationKey": type_key,
            "count": cnt,
            "assignment": role,
            "occupants": total_occupants,
            "comfort": a_def["comfort"],
            "fresher": a_def["fresher"],
            "isCryo": a_def["isCryo"],
            "isCommons": a_def["isCommons"],
            "comment": a_def["comment"]
        }
    )

def build_facility(type_key: str, amount: float = 1.0, tl: int = 12, import_fee: bool = False) -> ComponentItem:
    f_def = FACILITY_CATALOG.get(type_key, FACILITY_CATALOG["StandardCargo"])
    amt = max(1.0, float(amount))
    
    if f_def["fixedSize"]:
        cnt = max(1, round(amt))
        total_tons = f_def["unitTons"] * cnt
        total_cost = f_def["unitCost"] * cnt * (1.1 if import_fee else 1.0)
    else:
        cnt = round(amt)
        total_tons = amt
        total_cost = f_def["unitCost"] * amt * (1.1 if import_fee else 1.0)

    return ComponentItem(
        name=f"{f_def['name']} ({round(total_tons, 1)}t)",
        tons=round(total_tons, 2),
        cost=round(total_cost, 3),
        tl=tl,
        isFacility=True,
        extra={
            "facilityKey": type_key,
            "category": f_def["category"],
            "count": cnt,
            "isCargo": f_def.get("isCargo", False),
            "isArmory": f_def.get("isArmory", False),
            "isMedical": f_def.get("isMedical", False),
            "isLab": f_def.get("isLab", False),
            "isWorkshop": f_def.get("isWorkshop", False),
            "comment": f_def["comment"]
        }
    )

def build_life_support(type_key: str, amount: float = 1.0, tl: int = 12, import_fee: bool = False) -> ComponentItem:
    ls_def = LIFE_SUPPORT_CATALOG.get(type_key, LIFE_SUPPORT_CATALOG["ExtendedLifeSupport"])
    amt = max(1.0, float(amount))

    if type_key == "RecyclerUnit":
        cnt = max(1, round(amt))
        total_tons = ls_def["tons"] * cnt
        total_cost = ls_def["cost"] * cnt * (1.1 if import_fee else 1.0)
        person_days = 0
    else:
        cnt = round(amt)
        total_tons = amt
        total_cost = ls_def["costPerTon"] * amt * (1.1 if import_fee else 1.0)
        person_days = round(amt * ls_def["personDaysPerTon"])

    return ComponentItem(
        name=f"{ls_def['name']} ({round(total_tons, 1)}t)",
        tons=round(total_tons, 2),
        cost=round(total_cost, 3),
        tl=tl,
        isLifeSupport=True,
        extra={
            "lifeSupportKey": type_key,
            "count": cnt,
            "personDays": person_days,
            "efficiencyBonus": ls_def.get("efficiencyBonus", 0),
            "comment": ls_def["comment"]
        }
    )

def build_weapon(weapon_key: str, mount_key: str = "T1", stage: str = "Standard", count: int = 1, tl: int = 12, import_fee: bool = False) -> ComponentItem:
    w_def = WEAPON_CATALOG.get(weapon_key, WEAPON_CATALOG["BeamLaser"])
    m_def = MOUNTS_DEF.get(mount_key, MOUNTS_DEF["T1"])
    stg_def = _drives_data.drive_stages.get(stage, {})
    cost_mult = stg_def.get("cost", 1.0)
    
    cnt = max(1, count)
    single_cost = (w_def["baseCost"] * cost_mult + m_def["cost"]) * (1.1 if import_fee else 1.0)
    total_cost = single_cost * cnt
    single_tons = m_def["tons"]
    total_tons = single_tons * cnt
    hardpoints = m_def["hardpointReq"] * cnt
    cp = m_def["cp"] * cnt

    return ComponentItem(
        name=f"{cnt}x {w_def['name']} ({m_def['name']})" if cnt > 1 else f"{w_def['name']} ({m_def['name']})",
        tons=round(total_tons, 2),
        cost=round(total_cost, 3),
        tl=tl,
        isWeapon=True,
        extra={
            "weaponKey": weapon_key,
            "mountKey": mount_key,
            "mountName": m_def["name"],
            "stage": stage,
            "count": cnt,
            "hardpointReq": hardpoints,
            "cp": cp,
            "code": w_def["code"],
            "category": w_def["category"],
            "comment": w_def["comment"]
        }
    )

def build_defense(defense_key: str, mount_key: str = "Bo", stage: str = "Standard", count: int = 1, tl: int = 12, import_fee: bool = False) -> ComponentItem:
    d_def = DEFENSE_CATALOG.get(defense_key, DEFENSE_CATALOG["NuclearDamper"])
    m_def = MOUNTS_DEF.get(mount_key, MOUNTS_DEF["Bo"])
    stg_def = _drives_data.drive_stages.get(stage, {})
    cost_mult = stg_def.get("cost", 1.0)
    
    cnt = max(1, count)
    single_cost = (d_def["baseCost"] * cost_mult + m_def["cost"]) * (1.1 if import_fee else 1.0)
    total_cost = single_cost * cnt
    single_tons = m_def["tons"]
    total_tons = single_tons * cnt
    hardpoints = m_def["hardpointReq"] * cnt
    cp = m_def["cp"] * cnt

    return ComponentItem(
        name=f"{cnt}x {d_def['name']}" if cnt > 1 else d_def["name"],
        tons=round(total_tons, 2),
        cost=round(total_cost, 3),
        tl=tl,
        isDefense=True,
        extra={
            "defenseKey": defense_key,
            "mountKey": mount_key,
            "mountName": m_def["name"],
            "stage": stage,
            "count": cnt,
            "hardpointReq": hardpoints,
            "cp": cp,
            "code": d_def["code"],
            "category": d_def["category"],
            "comment": d_def["comment"]
        }
    )

def build_sensor(sensor_key: str, mount_key: str = "Surf", count: int = 1, tl: int = 12, import_fee: bool = False) -> ComponentItem:
    s_def = SENSOR_CATALOG.get(sensor_key, SENSOR_CATALOG["Communicator"])
    m_def = MOUNTS_DEF.get(mount_key, MOUNTS_DEF["Surf"])
    
    cnt = max(1, count)
    single_cost = (s_def["baseCost"] + m_def["cost"]) * (1.1 if import_fee else 1.0)
    total_cost = single_cost * cnt
    single_tons = m_def["tons"]
    total_tons = single_tons * cnt
    cp = m_def["cp"] * cnt

    return ComponentItem(
        name=f"{cnt}x {s_def['name']}" if cnt > 1 else s_def["name"],
        tons=round(total_tons, 2),
        cost=round(total_cost, 3),
        tl=tl,
        isSensor=True,
        extra={
            "sensorKey": sensor_key,
            "mountKey": mount_key,
            "count": cnt,
            "cp": cp,
            "code": s_def["code"],
            "category": s_def["category"],
            "comment": s_def["comment"]
        }
    )

def build_console(name: str = "Standard Console", tons: float = 1.0, cost: float = 0.1, tl: int = 12, cp: int = 1) -> ComponentItem:
    return ComponentItem(
        name=name,
        tons=round(tons, 2),
        cost=round(cost, 3),
        tl=tl,
        isConsole=True,
        extra={"cp": cp}
    )

def build_computer(model: str = "Model/3bis", cells: int = 3, tons: float = 3.0, cost: float = 6.0, tl: int = 12) -> ComponentItem:
    return ComponentItem(
        name=f"Computer {model}",
        tons=round(tons, 2),
        cost=round(cost, 3),
        tl=tl,
        isComputer=True,
        extra={"model": model, "cells": cells}
    )

def build_hull_fitting(name: str, tons: float = 1.0, cost: float = 1.0, tl: int = 12, comment: str = "") -> ComponentItem:
    return ComponentItem(
        name=name,
        tons=round(tons, 2),
        cost=round(cost, 3),
        tl=tl,
        isHullFitting=True,
        extra={"comment": comment}
    )
