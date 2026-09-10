"""
Pydantic / Dataclass Models for T5 Starship construction matching data/main_hull_data.json and ShipHelper.js.
"""
from dataclasses import dataclass, field
import json
from typing import Any, Dict, List, Optional

# --- Master T5 Mission Classification Database ---
ENUM_MISSION_LIST = [
    { "id": 1, "service": "Naval", "activity": "Combat", "type": "Offensive", "qualifier": "Principal", "mission": "Cruiser", "code": "C" },
    { "id": 2, "service": "Naval", "activity": "Combat", "type": "Offensive", "qualifier": "Major", "mission": "Frigate", "code": "G" },
    { "id": 3, "service": "Naval", "activity": "Combat", "type": "Offensive", "qualifier": "Special", "mission": "Destroyer", "code": "V" },
    { "id": 4, "service": "Naval", "activity": "Combat", "type": "Offensive", "qualifier": "Minor", "mission": "Corvette", "code": "T" },
    { "id": 5, "service": "Naval", "activity": "Combat", "type": "Siege", "qualifier": "Attack", "mission": "Ortillery", "code": "H" },
    { "id": 6, "service": "Naval", "activity": "Combat", "type": "Siege", "qualifier": "Invasion", "mission": "Assault", "code": "T" },
    { "id": 7, "service": "Naval", "activity": "Combat", "type": "Siege", "qualifier": "Defender", "mission": "Sentinel", "code": "S" },
    { "id": 8, "service": "Naval", "activity": "Combat", "type": "Defensive", "qualifier": "Minor", "mission": "Escort", "code": "E" },
    { "id": 9, "service": "Naval", "activity": "Combat", "type": "Defensive", "qualifier": "Special", "mission": "Special Boat", "code": "B" },
    { "id": 10, "service": "Naval", "activity": "Combat", "type": "Defensive", "qualifier": "Major", "mission": "Defender", "code": "D" },
    { "id": 11, "service": "Naval", "activity": "Combat", "type": "Defensive", "qualifier": "Principal", "mission": "Monitor", "code": "N" },
    { "id": 12, "service": "Naval", "activity": "Combat", "type": "Independent", "qualifier": "Anti-Shipping", "mission": "Corsair", "code": "P" },
    { "id": 13, "service": "Naval", "activity": "Combat", "type": "Independent", "qualifier": "Anti-Commerce", "mission": "Raider", "code": "R" },
    { "id": 14, "service": "Naval", "activity": "Combat", "type": "Independent", "qualifier": "Anti-Port", "mission": "Marauder", "code": "P" },
    { "id": 15, "service": "Naval", "activity": "Auxiliary", "type": "Supply", "qualifier": "Major", "mission": "Transport", "code": "T" },
    { "id": 16, "service": "Naval", "activity": "Auxiliary", "type": "Supply", "qualifier": "Minor", "mission": "Barge", "code": "W" },
    { "id": 17, "service": "Naval", "activity": "Auxiliary", "type": "Supply", "qualifier": "Resupply", "mission": "Tender/Tug", "code": "T" },
    { "id": 18, "service": "Naval", "activity": "Auxiliary", "type": "Supply", "qualifier": "Information", "mission": "Corvette", "code": "E" },
    { "id": 19, "service": "Commerce", "activity": "Merchant", "type": "Scheduled", "qualifier": "Passenger", "mission": "Liner", "code": "M" },
    { "id": 20, "service": "Commerce", "activity": "Merchant", "type": "Scheduled", "qualifier": "Cargo", "mission": "Merchant", "code": "R" },
    { "id": 21, "service": "Commerce", "activity": "Merchant", "type": "Scheduled", "qualifier": "Freight", "mission": "Freighter", "code": "F" },
    { "id": 22, "service": "Commerce", "activity": "Merchant", "type": "UnScheduled", "qualifier": "Freight", "mission": "Transport", "code": "T" },
    { "id": 23, "service": "Commerce", "activity": "Merchant", "type": "UnScheduled", "qualifier": "Cargo", "mission": "Trader", "code": "A" },
    { "id": 24, "service": "Commerce", "activity": "Merchant", "type": "UnScheduled", "qualifier": "Passenger", "mission": "Packet", "code": "U" },
    { "id": 25, "service": "Commerce", "activity": "", "type": "Charter", "qualifier": "Recreation", "mission": "Safari", "code": "K" },
    { "id": 26, "service": "Commerce", "activity": "", "type": "Charter", "qualifier": "Active", "mission": "Expedition", "code": "K" },
    { "id": 27, "service": "Commerce", "activity": "", "type": "Charter", "qualifier": "Luxury", "mission": "Yacht", "code": "Y" },
    { "id": 28, "service": "Government/NGO/Private", "activity": "", "type": "Information", "qualifier": "Small Goods", "mission": "Courier", "code": "S" },
    { "id": 29, "service": "Government/NGO/Private", "activity": "", "type": "Information", "qualifier": "Data Files", "mission": "Messenger", "code": "S" },
    { "id": 30, "service": "Government/NGO/Private", "activity": "", "type": "Information", "qualifier": "Goods and Files", "mission": "Express", "code": "X" },
    { "id": 31, "service": "Government/NGO/Private", "activity": "", "type": "Exploration", "qualifier": "First Look", "mission": "Scout", "code": "S" },
    { "id": 32, "service": "Government/NGO/Private", "activity": "", "type": "Exploration", "qualifier": "Re-Look", "mission": "Survey", "code": "N" },
    { "id": 33, "service": "Government/NGO/Private", "activity": "", "type": "Exploration", "qualifier": "Data Collection", "mission": "Beagle", "code": "B" },
    { "id": 34, "service": "Government/NGO/Private", "activity": "", "type": "Exploration", "qualifier": "Medical Data", "mission": "Med", "code": "N" },
    { "id": 35, "service": "Government/NGO/Private", "activity": "", "type": "Exploration", "qualifier": "Data Analysis", "mission": "Lab", "code": "L" },
    { "id": 36, "service": "Government/NGO/Private", "activity": "", "type": "Exploration", "qualifier": "Resource Search", "mission": "Prospector", "code": "J" },
    { "id": 37, "service": "Government/NGO/Private", "activity": "", "type": "Bureaucratic", "qualifier": "Inspection", "mission": "Picket", "code": "P" },
    { "id": 38, "service": "Government/NGO/Private", "activity": "", "type": "Bureaucratic", "qualifier": "Enforcement", "mission": "Patrol", "code": "P" },
    { "id": 39, "service": "Government/NGO/Private", "activity": "", "type": "", "qualifier": "", "mission": "Privateer", "code": "P" },
    { "id": 40, "service": "Unclassified", "activity": "", "type": "", "qualifier": "", "mission": "Unassigned", "code": "Z" }
]

ENUM_MODIFIERS_LIST = [
    { "code": "A", "words": ["Alternate", "Improved", "Armored", "Attack"] },
    { "code": "B", "words": ["Boat", "Bulk", "Battle", "Big"] },
    { "code": "C", "words": ["Close", "Carrier", "Communications"] },
    { "code": "D", "words": ["Defense", "Defending", "Interceptor"] },
    { "code": "E", "words": ["Escort", "Essential", "Electronic Warfare"] },
    { "code": "F", "words": ["Fast", "Fat", "Frontier", "Far", "Flag", "Free"] },
    { "code": "G", "words": ["Gunned", "Upgunned", "Gas"] },
    { "code": "H", "words": ["Fuel", "Tanker", "Hydrogen"] },
    { "code": "J", "words": ["Survey", "Prospector", "Interface", "Intruder"] },
    { "code": "K", "words": ["Subsidized", "Fast", "Diplomatic"] },
    { "code": "L", "words": ["LR", "Lifeboat", "Exploratory", "Light"] },
    { "code": "M", "words": ["Military", "Militia", "Mercenary", "Motivator", "Tug"] },
    { "code": "N", "words": ["Naval", "Nuclear", "Fleet"] },
    { "code": "P", "words": ["Patrol", "Plus", "Passenger", "Mercenary"] },
    { "code": "Q", "words": ["Disguised", "Decoy", "Quarantine", "Mother"] },
    { "code": "R", "words": ["Recon", "Rescue", "Rider"] },
    { "code": "S", "words": ["Slow", "System", "Special", "Luxury", "Small"] },
    { "code": "T", "words": ["Tramp", "Tender", "Transport"] },
    { "code": "U", "words": ["Unarmed", "Hulk", "De-activated", "Inop"] },
    { "code": "V", "words": ["Vehicle Carrier", "Drone", "Remote"] },
    { "code": "W", "words": ["Unpowered", "Non-Jump"] },
    { "code": "X", "words": ["Experimental", "Special", "Express"] },
    { "code": "Y", "words": ["Hull", "Subhull", "Pod", "Rider", "Modular"] },
    { "code": "Z", "words": ["Unassigned"] }
]

ENUM_MODIFIER_WORD_OPTIONS: List[Dict[str, str]] = []
for _mod in ENUM_MODIFIERS_LIST:
    for _w in _mod["words"]:
        ENUM_MODIFIER_WORD_OPTIONS.append({
            "word": _w,
            "code": _mod["code"],
            "label": f"{_w} [{_mod['code']}]"
        })
ENUM_MODIFIER_WORD_OPTIONS.sort(key=lambda x: x["word"])

ENUM_JUMP_FIELDS = {
    "Bubble": {
        "key": "Bubble",
        "name": "Bubble Jump Field (Default)",
        "strength": 100,
        "mult": 1.0,
        "armorMod": "std",
        "flash": "std",
        "comment": "Bubble produces the standard value for D (Table 07G)."
    },
    "Grid": {
        "key": "Grid",
        "name": "Grid (Embedded in Hull)",
        "strength": 80,
        "mult": 0.8,
        "armorMod": "-1D",
        "flash": "+1",
        "comment": "Embedded in the Hull. Grid reduces safe jump distance D."
    },
    "Plates": {
        "key": "Plates",
        "name": "Plates (1 Plate / 10t)",
        "strength": 140,
        "mult": 1.4,
        "armorMod": "/2",
        "flash": "+1",
        "comment": "1 Plate Per 10 Hull Tons. Plates produce the greatest value for D."
    }
}

@dataclass
class DriveItem:
    ep: float
    tons: float
    cost: float
    stage: str
    driveClass: str
    driveType: str
    tl: int
    importFee: bool = False
    maxDrivePotential: int = 0
    nexus: int = 1

@dataclass
class ComponentItem:
    name: str
    tons: float
    cost: float
    tl: int = 12
    isWeapon: bool = False
    isDefense: bool = False
    isSensor: bool = False
    isConsole: bool = False
    isComputer: bool = False
    isAccommodation: bool = False
    isFacility: bool = False
    isLifeSupport: bool = False
    isHullFitting: bool = False
    isFuel: bool = False
    isGeneric: bool = False
    extra: Dict[str, Any] = field(default_factory=dict)

@dataclass
class SubhullItem:
    name: str
    tons: float
    tl: int
    config: str
    isHull: bool = True
    isPod: bool = False
    armorType: str = "Polymer"
    armorLayers: int = 1
    importFee: bool = False
    drives: List[DriveItem] = field(default_factory=list)
    components: List[ComponentItem] = field(default_factory=list)

@dataclass
class ShipDesign:
    version: int = 2
    baseTL: int = 13
    shipName: str = "Starship"
    registration: str = "REG-0101"
    missionId: int = 23
    missionService: str = "Commerce"
    missionActivity: str = "Merchant"
    missionType: str = "UnScheduled"
    missionQualifier: str = "Cargo"
    missionName: str = "Trader"
    missionCodeKey: str = "A"
    modifier1Word: str = "Far"
    modifier1Code: str = "F"
    modifier2Word: str = ""
    modifier2Code: str = ""
    jumpFieldKey: str = "Bubble"
    engineerSkill: int = 0
    jumpDriveSpecialty: int = 0
    jumpDiameters: Optional[float] = None
    subhulls: List[SubhullItem] = field(default_factory=list)

    @property
    def missionObject(self) -> Dict[str, Any]:
        for m in ENUM_MISSION_LIST:
            if m["id"] == self.missionId:
                return m
        for m in ENUM_MISSION_LIST:
            if m["mission"] == self.missionName:
                return m
        return ENUM_MISSION_LIST[22]  # Default Trader [A]

    @property
    def missionCode(self) -> str:
        obj = self.missionObject
        base = self.missionCodeKey or obj.get("code", "A")
        m1 = self.modifier1Code
        if not m1 and self.modifier1Word:
            for item in ENUM_MODIFIERS_LIST:
                if self.modifier1Word in item["words"]:
                    m1 = item["code"]
                    break
        m2 = self.modifier2Code
        if not m2 and self.modifier2Word:
            for item in ENUM_MODIFIERS_LIST:
                if self.modifier2Word in item["words"]:
                    m2 = item["code"]
                    break
        return f"{base}{m1}{m2}"

    @property
    def missionFullTitle(self) -> str:
        words = []
        if self.modifier1Word:
            words.append(self.modifier1Word)
        if self.modifier2Word and self.modifier2Word != self.modifier1Word:
            words.append(self.modifier2Word)
        m_name = self.missionName or self.missionObject.get("mission", "Trader")
        words.append(m_name)
        return " ".join(words)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "version": self.version,
            "baseTL": self.baseTL,
            "shipName": self.shipName,
            "registration": self.registration,
            "missionId": self.missionId,
            "missionService": self.missionService,
            "missionActivity": self.missionActivity,
            "missionType": self.missionType,
            "missionQualifier": self.missionQualifier,
            "missionName": self.missionName,
            "missionCodeKey": self.missionCodeKey,
            "modifier1Word": self.modifier1Word,
            "modifier1Code": self.modifier1Code,
            "modifier2Word": self.modifier2Word,
            "modifier2Code": self.modifier2Code,
            "jumpFieldKey": self.jumpFieldKey,
            "engineerSkill": self.engineerSkill,
            "jumpDriveSpecialty": self.jumpDriveSpecialty,
            "jumpDiameters": self.jumpDiameters,
            "subhulls": [
                {
                    "isHull": h.isHull,
                    "isPod": h.isPod,
                    "name": h.name,
                    "tons": h.tons,
                    "tl": h.tl,
                    "config": h.config,
                    "armorType": h.armorType,
                    "armorLayers": h.armorLayers,
                    "importFee": h.importFee,
                    "drives": [
                        {
                            "ep": d.ep,
                            "tons": d.tons,
                            "cost": d.cost,
                            "stage": d.stage,
                            "driveClass": d.driveClass,
                            "driveType": d.driveType,
                            "tl": d.tl,
                            "importFee": d.importFee,
                            "maxDrivePotential": d.maxDrivePotential,
                            "nexus": d.nexus
                        }
                        for d in h.drives
                    ],
                    "components": [
                        {
                            "name": c.name,
                            "tons": c.tons,
                            "cost": c.cost,
                            "tl": c.tl,
                            "isWeapon": c.isWeapon,
                            "isDefense": c.isDefense,
                            "isSensor": c.isSensor,
                            "isConsole": c.isConsole,
                            "isComputer": c.isComputer,
                            "isAccommodation": c.isAccommodation,
                            "isFacility": c.isFacility,
                            "isLifeSupport": c.isLifeSupport,
                            "isHullFitting": c.isHullFitting,
                            "isFuel": c.isFuel,
                            "isGeneric": c.isGeneric,
                            **c.extra
                        }
                        for c in h.components
                    ]
                }
                for h in self.subhulls
            ]
        }

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ShipDesign":
        subhulls = []
        for h_data in data.get("subhulls", []):
            drives = [
                DriveItem(
                    ep=d.get("ep", 0),
                    tons=d.get("tons", 0),
                    cost=d.get("cost", 0),
                    stage=d.get("stage", "Standard"),
                    driveClass=d.get("driveClass", "A"),
                    driveType=d.get("driveType", "M-Drive"),
                    tl=d.get("tl", 12),
                    importFee=d.get("importFee", False),
                    maxDrivePotential=d.get("maxDrivePotential", 0),
                    nexus=d.get("nexus", 1)
                )
                for d in h_data.get("drives", [])
            ]
            components = []
            for c_data in h_data.get("components", []):
                extra = {k: v for k, v in c_data.items() if k not in (
                    "name", "tons", "cost", "tl", "isWeapon", "isDefense", "isSensor",
                    "isConsole", "isComputer", "isAccommodation", "isFacility",
                    "isLifeSupport", "isHullFitting", "isFuel", "isGeneric"
                )}
                components.append(ComponentItem(
                    name=c_data.get("name", "Component"),
                    tons=c_data.get("tons", 0),
                    cost=c_data.get("cost", 0),
                    tl=c_data.get("tl", 12),
                    isWeapon=c_data.get("isWeapon", False),
                    isDefense=c_data.get("isDefense", False),
                    isSensor=c_data.get("isSensor", False),
                    isConsole=c_data.get("isConsole", False),
                    isComputer=c_data.get("isComputer", False),
                    isAccommodation=c_data.get("isAccommodation", False),
                    isFacility=c_data.get("isFacility", False),
                    isLifeSupport=c_data.get("isLifeSupport", False),
                    isHullFitting=c_data.get("isHullFitting", False),
                    isFuel=c_data.get("isFuel", False),
                    isGeneric=c_data.get("isGeneric", False),
                    extra=extra
                ))
            subhulls.append(SubhullItem(
                name=h_data.get("name", "Main Hull"),
                tons=h_data.get("tons", 100),
                tl=h_data.get("tl", 12),
                config=h_data.get("config", "Unstreamlined"),
                isHull=h_data.get("isHull", True),
                isPod=h_data.get("isPod", False),
                armorType=h_data.get("armorType", "Polymer"),
                armorLayers=h_data.get("armorLayers", 1),
                importFee=h_data.get("importFee", False),
                drives=drives,
                components=components
            ))
        return cls(
            version=data.get("version", 2),
            baseTL=data.get("baseTL", 13),
            shipName=data.get("shipName", "Starship"),
            registration=data.get("registration", "REG-0101"),
            missionId=data.get("missionId", 23),
            missionService=data.get("missionService", "Commerce"),
            missionActivity=data.get("missionActivity", "Merchant"),
            missionType=data.get("missionType", "UnScheduled"),
            missionQualifier=data.get("missionQualifier", "Cargo"),
            missionName=data.get("missionName", "Trader"),
            missionCodeKey=data.get("missionCodeKey", "A"),
            modifier1Word=data.get("modifier1Word", "Far"),
            modifier1Code=data.get("modifier1Code", "F"),
            modifier2Word=data.get("modifier2Word", ""),
            modifier2Code=data.get("modifier2Code", ""),
            jumpFieldKey=data.get("jumpFieldKey", "Bubble"),
            engineerSkill=data.get("engineerSkill", 0),
            jumpDriveSpecialty=data.get("jumpDriveSpecialty", 0),
            jumpDiameters=data.get("jumpDiameters"),
            subhulls=subhulls
        )
