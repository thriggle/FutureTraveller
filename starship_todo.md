# T5 Ship Helper — Starship Construction Upgrade & Roadmap

This document outlines the upgrade path and feature roadmap for the **T5 Ship Helper** based on the official rules in `StarshipConstruction.pdf` (Traveller 5th Edition).

---

## 1. Current State vs. T5 Rulebook Coverage

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           T5 STARSHIP CONSTRUCTION                          │
│                                                                             │
│  [02] Mission & Classification       ──► ❌ Not yet implemented            │
│  [04-06] Hulls, Pods & Fittings      ──► ✅ Fully implemented (7 configs)  │
│  [07] Jump Fields & Astrogation      ──► ❌ Not yet implemented            │
│  [08-09] Armor Layers & Coatings     ──► 🟡 Partial (Layers in place;       │
│                                            Coatings/Anti-threats missing)   │
│  [10-13] Drives, Power & Fuel        ──► ✅ Comprehensive (A-Z, Stages)    │
│  [14-16] Sensors, Weapons, Defenses  ──► ❌ Not yet implemented            │
│  [17, 21] Operations, Life Support   ──► ❌ Not yet implemented            │
│  [18, 22] Controls, Consoles, Model/ ──► 🟡 Partial (CP counts tracked,    │
│                                            Consoles & Computers missing)    │
│  [19, 23] Accommodations & Payload   ──► 🟡 Partial (Cargo in place;        │
│                                            Staterooms/Berths missing)       │
│  [20, 24-25] Crew Hierarchy & Roster ──► ❌ Not yet implemented            │
│  [26] Evaluations & Ergonomics       ──► ❌ Not yet implemented (Comfort,   │
│                                            Demand, Ergonomics, Mishaps)     │
│  Fillforms 1, 2, 3 Sheet Generation  ──► ❌ Not yet implemented            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Breakdown by T5 Construction Section

### Section 02: Mission Classification & Identification
- **T5 6-Character Mission Code**: Add mission configuration builder in the header:
  - `[Service]`: Navy (`N`), Scout (`S`), Merchant (`M`), Private (`P`), Other (`O`).
  - `[Activity]`: Patrol (`P`), Exploration (`E`), Trade (`T`), Combat (`C`), Courier (`X`), etc.
  - `[Type]`: Line (`L`), Heavy (`H`), Light (`L`), Escort (`E`), Free Trader (`A`), etc.
  - `[Qualifier]`: System (`S`), Interstellar (`I`), Deep Space (`D`).
  - `[E-Mission]` / `[Modifier]`: Cruiser, Carrier, Transport, Scout, Messenger, Express, etc.
- **Hull Classification Code**: Auto-derive standard naval/merchant abbreviation (e.g., `CA` Heavy Cruiser, `ACS` Adventure Class, `A2` Far Trader, `BB` Battleship).

---

### Sections 04–06: Hull Geometry, Fittings & Structure
- **Current Support**: Subhulls (100+ tons) and Pods (10–90 tons), 7 Configurations (*Cluster, Braced, Planetoid, Unstreamlined, Streamlined, Airframe, Lifting Body*), 10 Hull Fittings, auto-grappling.
- **Enhancements Needed**:
  - Hull Form / Geometry selection (Sphere, Cylinder, Wedge, Cone, Box, Flattened Sphere, Dispersed).
  - Hull Construction Techniques (Light, Standard, Heavy, Reinforced, Asteroid/Planetoid types: Iron, Nickel-Iron, Carbonaceous, Ice).
  - Surface Area / Square Meter calculation for sensor/mount coverage.

---

### Section 07: Jump Fields & Astrogation Physics
- **Jump Field Types**: Standard, Bubble, Cannibalized, Hollow, Encapsulated, Grid, Co-Axial.
- **Safe Jump Distance Formula**:
  $$D = \left(\frac{S}{E}\right) - K$$
  *(Where $S = \text{Field Strength}$, $E = \text{Drive Efficiency}$, $K = \text{Astrogator/Engineer Skill})*
- **Jump Initiation Interference**:
  $$X = \left(\frac{S}{E}\right) - (D + K) + \text{Flux}$$
  *(Calculates the risk of misjump or field collapse near gravitational bodies)*

---

### Sections 08–09: Armor Layers & Specialized Coatings
- **Current Support**: Plate, Charged, Shell, Polymer, Organic, FeN (Asteroid) with config-specific compatibility and AV formula (`TL * Mult + Bonus`).
- **Enhancements Needed**:
  - Specialized Surface Treatments & Coatings:
    - *Reflec* (Anti-Laser protection)
    - *Stealth* (Anti-Sensor / Radar-absorbing)
    - *Chameleon* (Visual camouflage)
    - *Ablative* (Anti-Kinetic sacrificial plating)
    - *Radiation Shielding* (Crew/Electronics protection)
    - *Thermal Dissipation* (Heat masking)
  - Threat-specific Armor Values (Kinetic vs. Energy vs. Radiation).

---

### Sections 10–13: Drives, Power & Fuel
- **Current Support**: Comprehensive drive system (Jump, Hop, Skip, M-Drive, G-Drive, NAFAL, HEPlaR, Rocket, Power Plant, Fission, Anti-Matter, Collector; Classes A–Z, Nexus 1–9, 10 Tech Stages, output capping, fuel auto-linking).
- **Enhancements Needed**:
  - Power Grid balance tracking (allocating generated MW / EP directly to Drives, Weapons, Defenses, Sensors, and Life Support).
  - Emergency / Auxiliary power plants and capacitor banks.

---

### Sections 14–16: Sensors, Weapons & Defenses Suite

#### Hardpoint & Mount Budgeting
- Hardpoint allocation: 1 Hardpoint per 100 displacement tons.
- Mount Types:
  - **Fixed Mount** (Tonnage: 0)
  - **Turrets**: T1 (Single, 1t), T2 (Double, 1t), T3 (Triple, 1t), T4 (Quad, 1t)
  - **Bays**: Barbette (5t), Small Bay (50t), Medium Bay (100t), Large Bay (1,000t)
  - **Spinal / Capital Mounts**: Main Guns and Spinal Mounts

#### Weapons (Weapons2)
- **Energy**: Beam Lasers, Pulse Lasers, Plasma Guns, Fusion Guns, Particle Accelerators, Meson Guns.
- **Kinetic / Projectile**: Sandcasters, Railguns, Gauss Cannons.
- **Missiles & Torpedoes**: Missile Racks, Torpedo Launchers, Smart Mines.

#### Active Defenses (Defenses2)
- Sandcasters & Canister Launchers
- Point Defense Lasers (PDL)
- Nuclear Dampers
- Meson Screens
- Force Screens / Deflector Shields
- Black Globe Generators
- Electronic Warfare (ECM/ECCM, Decoys)

#### Sensors (Sensors2)
- Standard T/S/M/L Scale Sensor Suites:
  - Passive: Visual, Thermal, EM, Densitometer, Neutrino, Activity Detectors.
  - Active: Radar, Lidar, Gravitic, Active Sonar (submergence hulls).

---

### Sections 17 & 21: Operations, Vehicles & Life Support
- **Life Support Systems**:
  - Short-Term vs. Long-Term life support calculation.
  - Person-day capacity tracking and recycling units.
  - Freshers, grav-compensators, and atmospheric scrubbers.
- **Vehicles & Carried Craft**:
  - Hangars, Launch Tubes, External Docking Clamps, Vehicle bays (Air/Raft, G-Carrier, Ship's Boat, Pinnace, Fighters, Drones).

---

### Sections 18 & 22: Controls, Consoles & Ship's Computers
- **Control Panel (CP) Footprint**:
  - Each mechanism, drive, mount, sensor, and facility generates Control Panels.
- **Consoles System**:
  - *Cramped Console*: 0.5 tons, 1 Sq, 0.2 MCr
  - *Standard Console*: 1.0 ton, 2 Sq, 0.5 MCr
  - *Master Console*: 2.0 tons, 4 Sq, 1.0 MCr
  - *Virtual / Holographic Consoles* (higher TL)
  - Multi-tasking operator assignments.
- **Ship's Computer Model/**:
  - Model/0 through Model/33 (or Model 0 to 9 with `bis` and `fib` options).
  - Computer Cells tracking and processing bandwidth for fire control, sensor fusion, and jump navigation.

---

### Sections 19 & 23: Accommodations & Payload
- **Accommodations Catalog**:
  - *Passenger Commons*: 1.0 ton, 0 MCr (movement & recreation)
  - *Standard Stateroom*: 2.0 tons, 0.1 MCr (1 passenger/crew)
  - *Standard Suite*: 4.0 tons, 0.2 MCr (2 passengers/crew)
  - *Double Stateroom*: 2.0 tons, 0.1 MCr (2 occupants in bunks)
  - *Triple Stateroom*: 2.0 tons, 0.1 MCr (3 occupants in bunks)
  - *Cramped Stateroom*: 2.0 tons, 0.1 MCr (4 occupants in bunks)
  - *Luxury Stateroom*: 6.0 tons, 0.4 MCr (includes dedicated fresher)
  - *Steerage / Space Bunks*: 0.5 tons, 0 MCr (2 occupants)
  - *Low Berth*: 0.5 tons, 0.1 MCr (1 cryogenic passenger)
  - *Spacer Niche*: 1.0 ton, 0 MCr (1 crew bunk)
- **Specialized Payload**:
  - Standard Cargo Hold
  - Refrigerated / Cold Storage
  - Hazardous Containment
  - Secure Armory / Vault
  - Science Laboratories, Medical Bays, Workshops

---

### Sections 20, 24 & 25: Automated Crew Hierarchy Engine
- **Automated Crew Roster Formula**:
  - **Command**: Captain, Pilot, Astrogator, Sensop, Comms.
  - **Engineering**: 1 Chief Engineer + 1 Engineer per 35 drive tons (plus Drive Techs & Power Techs).
  - **Gunnery**: 1 Gunner per active turret / bay / battery.
  - **Service**: Purser, Stewards (1 per 8 High Passengers, 1 per 24 Middle Passengers), Medics, Cooks.
  - **Troops**: Security and Marine detachments.
- **Organization Hierarchies**: Toggle between Naval, Merchant, and Scout staffing models.

---

### Section 26: Quality, Livability & Ergonomics Evaluations
- **Passenger Demand ($D$)**:
  $$D = \left(\frac{T}{P}\right) - 5$$
  *(Where $T = \text{Passenger Accommodations Tons}$, $P = \text{Passenger Count}$; determines ticket demand and premium pricing multipliers)*
- **Crew Comfort / Livability ($C$)**:
  $$C = \frac{Q}{M}$$
  *(Where $Q = \text{Crew Quarters Tons}$, $M = \text{Crew Personnel}$; dictates Crew Tension and long-voyage morale)*
- **Ship Ergonomics ($E$)**:
  $$E = \frac{C_{\text{tons}}}{P_{\text{panels}}}$$
  *(Where $C_{\text{tons}} = \text{Console Tonnage}$, $P_{\text{panels}} = \text{Total Control Panels}$; directly drives Mishap Risk)*
- **Tension & Mishap Check Tables**: Real-time warning indicators when Ergonomics or Comfort drop into hazardous thresholds.

---

### Fillform 1, 2, 3 Sheet Export & Printout
- **Interactive T5 Fillform View**:
  - **Fillform 1**: Overview, Mission, Hulls, Drives, Operations, Controls, Accommodations, Crew Summary.
  - **Fillform 2**: Armor Layers, Fuel, Hardpoints (1–12), Weapons, Defenses, Sensors.
  - **Fillform 3**: Crew Hierarchy, Specialists, and Quality/Ergonomics Calculations ($D, C, E, X$).
- Exportable directly to printable PDF, formatted Markdown, and JSON.

---

## 3. Phased Implementation Plan

| Phase | Focus Area | Key Features & Deliverables |
|---|---|---|
| **Phase 1** | **Weapons, Defenses & Sensors** | • Hardpoint calculator (1 per 100t)<br>• Turret (T1-T4), Barbette, Bay, and Spinal Mount dialogs<br>• Weapons2 library (Lasers, Missiles, Sand, Particle, Meson)<br>• Defenses2 library (Screens, Dampers, PDL, Black Globe)<br>• Sensors2 library (Passive/Active arrays) |
| **Phase 2** | **Controls, Consoles & Computers** | • Dynamic Control Panel (CP) accumulator<br>• Console dialog (Cramped, Standard, Master)<br>• Ship's Computer Model/0 through Model/33 selector<br>• Computer Cells vs. Console connection validator |
| **Phase 3** | **Accommodations & Crew Engine** | • Accommodations catalog (Staterooms, Suites, Low Berths, Commons)<br>• Life Support & Person-Day tracker<br>• Automated Crew Hierarchy generator (Naval / Merchant / Scout) |
| **Phase 4** | **Astrogation & Quality Metrics** | • Jump Field Type selector<br>• Safe Jump Distance ($D$) & Interference ($X$) calculators<br>• Demand ($D$), Comfort ($C$), and Ergonomics ($E$) evaluation panel<br>• Tension & Mishap warning indicators |
| **Phase 5** | **Mission Header & Fillform Export** | • 6-Character T5 Mission Code builder<br>• Official 3-Page T5 Fillform (1, 2, 3) interactive viewer<br>• Printable / PDF / Markdown sheet exporter |
