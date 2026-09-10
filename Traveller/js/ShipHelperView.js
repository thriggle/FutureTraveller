import * as ShipHelper from './ShipHelper.js';
window.getAvailableTechStages = ShipHelper.getAvailableTechStages;
window.getDrivePerformance = ShipHelper.getDrivePerformance;
window.buildDrive = ShipHelper.buildDrive;
// ShipHelperView.js
class ShipHelperView {
    static formatTLStatus(itemTL, shipTL, formulaDetails = '') {
        let badgeHtml = '';
        if (itemTL < shipTL) {
            badgeHtml = `<span class="tl-badge tl-badge-lower">Lower TL than Ship (Ship is TL ${shipTL})</span>`;
        } else if (itemTL === shipTL) {
            badgeHtml = `<span class="tl-badge tl-badge-match">Matches Ship TL (TL ${shipTL})</span>`;
        } else {
            badgeHtml = `<span class="tl-badge tl-badge-higher">Higher TL \u2014 Imported (+10% Surcharge, Ship is TL ${shipTL})</span>`;
        }
        return `
            <div class="tl-breakdown">
                <strong>Tech Level:</strong> TL ${itemTL}
                ${formulaDetails ? `<span style="color: var(--text-muted); font-size: 0.9em;">(${formulaDetails})</span>` : ''}
                ${badgeHtml}
            </div>
        `;
    }

    constructor() {
        this.ship = new ShipHelper.Hull(
            parseInt(document.getElementById('base-tl').value, 10) || 12
        );
        // Add a default starting 100-ton subhull so the user can begin adding components immediately
        this.ship.addSubhull("Main Hull", 100, this.ship.baseTL, "Unstreamlined");
        this.initEventListeners();
        this.render();
    }

    initEventListeners() {
        document.getElementById('base-tl').addEventListener('change', (e) => {
            this.ship.setBaseTL(parseInt(e.target.value, 10));
            this.render();
        });

        // Mission & Jump Fields & Fillform buttons
        document.getElementById('btn-mission-code')?.addEventListener('click', () => {
            this.openMissionCodeDialog();
        });

        const handleJumpFieldsClick = () => {
            if (!this.ship.hasJumpDrive) {
                this.showNotificationBanner("⚠️ Jump Fields cannot be configured until a Jump, Hop, or Skip Drive is installed on the vessel.");
            } else {
                this.openJumpFieldsDialog();
            }
        };

        document.getElementById('btn-astrogation')?.addEventListener('click', handleJumpFieldsClick);
        document.getElementById('btn-jump-fields')?.addEventListener('click', handleJumpFieldsClick);

        document.getElementById('btn-fillform')?.addEventListener('click', () => {
            this.openFillformModal();
        });

        // Add export/import functionality
        document.getElementById('export-json').addEventListener('click', () => {
            const data = {
                version: 2,
                shipName: this.ship.shipName,
                registration: this.ship.registration,
                missionId: this.ship.missionId,
                missionService: this.ship.missionService,
                missionActivity: this.ship.missionActivity,
                missionType: this.ship.missionType,
                missionQualifier: this.ship.missionQualifier,
                missionName: this.ship.missionName,
                missionCodeKey: this.ship.missionCodeKey,
                modifier1Word: this.ship.modifier1Word,
                modifier1Code: this.ship.modifier1Code,
                modifier2Word: this.ship.modifier2Word,
                modifier2Code: this.ship.modifier2Code,
                jumpFieldKey: this.ship.jumpFieldKey,
                engineerSkill: this.ship.engineerSkill,
                jumpDriveSpecialty: this.ship.jumpDriveSpecialty,
                jumpDiameters: this.ship.jumpDiameters,
                astrogatorSkill: this.ship.engineerSkill, // legacy
                baseTL: this.ship.baseTL,
                subhulls: this.ship.subhulls
            };
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const shipName = (this.ship.shipName || (this.ship.subhulls.length > 0 ? this.ship.subhulls[0].name : 'ship')).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            a.download = `${shipName}_data.json`;
            a.click();
            URL.revokeObjectURL(url);
        });

        document.getElementById('import-json').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data && data.subhulls) {
                        this.ship.setBaseTL(data.baseTL || 12);
                        document.getElementById('base-tl').value = this.ship.baseTL;
                        if (data.shipName) this.ship.shipName = data.shipName;
                        if (data.registration) this.ship.registration = data.registration;
                        if (data.missionId) this.ship.missionId = data.missionId;
                        if (data.missionService) this.ship.missionService = data.missionService;
                        if (data.missionActivity !== undefined) this.ship.missionActivity = data.missionActivity;
                        if (data.missionType !== undefined) this.ship.missionType = data.missionType;
                        if (data.missionQualifier !== undefined) this.ship.missionQualifier = data.missionQualifier;
                        if (data.missionName) this.ship.missionName = data.missionName;
                        if (data.missionCodeKey) this.ship.missionCodeKey = data.missionCodeKey;
                        if (data.modifier1Word !== undefined) this.ship.modifier1Word = data.modifier1Word;
                        if (data.modifier1Code !== undefined) this.ship.modifier1Code = data.modifier1Code;
                        if (data.modifier2Word !== undefined) this.ship.modifier2Word = data.modifier2Word;
                        if (data.modifier2Code !== undefined) this.ship.modifier2Code = data.modifier2Code;
                        if (data.jumpFieldKey) this.ship.jumpFieldKey = data.jumpFieldKey;
                        if (data.engineerSkill !== undefined) this.ship.engineerSkill = data.engineerSkill;
                        else if (data.astrogatorSkill !== undefined) this.ship.engineerSkill = data.astrogatorSkill;
                        if (data.jumpDriveSpecialty !== undefined) this.ship.jumpDriveSpecialty = data.jumpDriveSpecialty;
                        if (data.jumpDiameters !== undefined) this.ship.jumpDiameters = data.jumpDiameters;

                        this.ship.subhulls = data.subhulls;
                        // Migrate old format: unified components[] → split drives[]/components[]
                        this.ship.subhulls.forEach(h => {
                            if (!h.drives) {
                                h.drives = (h.components || []).filter(c => c.driveType !== undefined);
                                h.components = (h.components || []).filter(c => c.driveType === undefined);
                            }
                        });
                        this.ship.selectedSubhullIndex = this.ship.subhulls.length > 0 ? 0 : -1;
                        this.render();
                    }
                } catch (err) {
                    console.error("Failed to parse ship JSON", err);
                    alert("Invalid Ship JSON File");
                }
            };
            reader.readAsText(file);
            // reset file input
            e.target.value = '';
        });

        // Setup component list clicks
        const driveItems = document.querySelectorAll('.drive-item');
        driveItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const driveType = e.target.getAttribute('data-drive-type');
                this.openDriveDialog(driveType);
            });
        });

        // Setup generic component list clicks
        const genericItems = document.querySelectorAll('.generic-item');
        genericItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const componentType = e.target.getAttribute('data-component-type');
                if (componentType === 'Subhull' || componentType === 'Pod') {
                    this.openHullDialog(componentType);
                } else {
                    this.openGenericDialog(componentType);
                }
            });
        });

        // Setup weapon item clicks
        document.querySelectorAll('.weapon-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const weaponKey = e.target.getAttribute('data-weapon-key');
                this.openWeaponDialog(weaponKey);
            });
        });

        // Setup defense item clicks
        document.querySelectorAll('.defense-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const defenseKey = e.target.getAttribute('data-defense-key');
                this.openDefenseDialog(defenseKey);
            });
        });

        // Setup sensor item clicks
        document.querySelectorAll('.sensor-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const sensorKey = e.target.getAttribute('data-sensor-key');
                this.openSensorDialog(sensorKey);
            });
        });

        // Dynamically inject hull fitting items and attach click handlers
        const hullFittingsList = document.getElementById('hull-fittings-list');
        if (hullFittingsList) {
            for (const key of ShipHelper.ENUM_HULL_FITTINGS.keys) {
                const fDef = ShipHelper.ENUM_HULL_FITTINGS[key];
                const li = document.createElement('li');
                li.className = 'fitting-item';
                li.setAttribute('data-fitting-key', key);
                li.textContent = fDef.name;
                hullFittingsList.appendChild(li);
            }
        }
        document.querySelectorAll('.fitting-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const fittingKey = e.target.getAttribute('data-fitting-key');
                this.openHullFittingDialog(fittingKey);
            });
        });

        // Setup console item clicks
        document.querySelectorAll('.console-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const roleKey = e.target.getAttribute('data-console-role');
                this.openConsoleDialog(roleKey);
            });
        });

        // Setup computer item clicks
        document.querySelectorAll('.computer-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const modelStr = e.target.getAttribute('data-computer-model');
                const modelNum = modelStr === 'custom' ? 1 : parseInt(modelStr, 10);
                this.openComputerDialog(modelNum);
            });
        });

        // Setup accommodation item clicks
        document.querySelectorAll('.accommodation-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const typeKey = e.target.getAttribute('data-accommodation-type');
                this.openAccommodationDialog(typeKey);
            });
        });

        // Setup facility item clicks
        document.querySelectorAll('.facility-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const facilityKey = e.target.getAttribute('data-facility-type');
                this.openFacilityDialog(facilityKey);
            });
        });

        // Setup life support item clicks
        document.querySelectorAll('.lifesupport-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const lsKey = e.target.getAttribute('data-lifesupport-type');
                this.openLifeSupportDialog(lsKey);
            });
        });
    }

    openWeaponDialog(weaponKey, editIndex = -1) {
        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
        if (!selectedHull) {
            alert('No hull selected. Please select a hull first.');
            return;
        }

        let existingComp = null;
        if (editIndex >= 0) {
            const target = this.ship.getComponentByIdx(editIndex);
            if (target && target.component) existingComp = target.component;
        }

        const currentKey = existingComp ? (existingComp.weaponKey || weaponKey) : weaponKey;
        const currentMount = existingComp ? existingComp.mountKey : (ShipHelper.ENUM_WEAPONS2[currentKey]?.defaultMount || 'T1');
        const currentStage = existingComp ? existingComp.stage : 'Standard';
        const currentRange = existingComp ? existingComp.rangeKey : 'AR';
        const currentCount = existingComp ? (existingComp.count || 1) : 1;
        const currentTL = existingComp ? existingComp.tl : Math.max(0, (ShipHelper.ENUM_WEAPONS2[currentKey]?.baseTL || 10) + (ShipHelper.ENUM_STAGE_EFFECTS[currentStage]?.tlMod || 0) + (ShipHelper.ENUM_SPACE_RANGES[currentRange]?.tlMod || 0));
        const currentDeployable = existingComp ? (existingComp.deployable || false) : false;
        const currentExtendable = existingComp ? (existingComp.extendable || false) : false;
        const currentImport = existingComp ? (existingComp.importFee || false) : false;

        let weaponOptions = '';
        for (const [k, w] of Object.entries(ShipHelper.ENUM_WEAPONS2)) {
            const sel = (k === currentKey) ? 'selected' : '';
            weaponOptions += `<option value="${k}" ${sel}>[${w.category}] ${w.name} (TL ${w.baseTL}, MCr${w.baseCost})</option>`;
        }

        let mountOptions = '';
        for (const [k, m] of Object.entries(ShipHelper.ENUM_WEAPON_MOUNTS)) {
            const sel = (k === currentMount) ? 'selected' : '';
            mountOptions += `<option value="${k}" ${sel}>${m.name} (${m.tons}t, MCr${m.cost}, ${m.hardpointReq} HP, ${m.hits} Hits)</option>`;
        }

        let stageOptions = '';
        for (const [k, s] of Object.entries(ShipHelper.ENUM_STAGE_EFFECTS)) {
            const sel = (k === currentStage) ? 'selected' : '';
            stageOptions += `<option value="${k}" ${sel}>${s.stage} (TL ${s.tlMod >= 0 ? '+' : ''}${s.tlMod}, Cost x${s.costMult})</option>`;
        }

        let rangeOptions = '';
        for (const [k, r] of Object.entries(ShipHelper.ENUM_SPACE_RANGES)) {
            const sel = (k === currentRange) ? 'selected' : '';
            rangeOptions += `<option value="${k}" ${sel}>${r.name} (Tons x${r.tonsMult}, Cost x${r.costMult})</option>`;
        }

        const content = `
            <div class="form-row">
                <label for="weapon-select">Weapon Type:</label>
                <select id="weapon-select">${weaponOptions}</select>
            </div>
            <div class="form-row">
                <label for="weapon-mount-select">Mount Type:</label>
                <select id="weapon-mount-select">${mountOptions}</select>
            </div>
            <div class="form-row">
                <label for="weapon-stage-select">Tech Stage:</label>
                <select id="weapon-stage-select">${stageOptions}</select>
            </div>
            <div class="form-row">
                <label for="weapon-range-select">Space Range:</label>
                <select id="weapon-range-select">${rangeOptions}</select>
            </div>
            <div class="form-row">
                <label for="weapon-tl-input">Tech Level:</label>
                <input type="number" id="weapon-tl-input" value="${currentTL}" min="0" max="33">
            </div>
            <div class="form-row">
                <label for="weapon-count-input">Quantity:</label>
                <input type="number" id="weapon-count-input" value="${currentCount}" min="1" max="100">
            </div>
            <div class="form-row" style="justify-content: flex-start; gap: 20px;">
                <label><input type="checkbox" id="weapon-deployable" ${currentDeployable ? 'checked' : ''}> Deployable (+2t, +3 MCr)</label>
                <label><input type="checkbox" id="weapon-extendable" ${currentExtendable ? 'checked' : ''}> Extendable (+2t, +1 MCr)</label>
                <label><input type="checkbox" id="weapon-import" ${currentImport ? 'checked' : ''}> 10% Import Surcharge</label>
            </div>
            <div id="weapon-preview" class="drive-preview-box" style="margin-top: 15px;"></div>
        `;

        const updatePreview = () => {
            const wKey = document.getElementById('weapon-select').value;
            const mKey = document.getElementById('weapon-mount-select').value;
            const stgKey = document.getElementById('weapon-stage-select').value;
            const rngKey = document.getElementById('weapon-range-select').value;
            const cnt = parseInt(document.getElementById('weapon-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('weapon-tl-input').value, 10);
            const dep = document.getElementById('weapon-deployable').checked;
            const ext = document.getElementById('weapon-extendable').checked;
            const imp = document.getElementById('weapon-import').checked;

            const wpnObj = ShipHelper.buildWeapon(wKey, mKey, stgKey, rngKey, cnt, {
                tl: tlVal,
                deployable: dep,
                extendable: ext,
                importFee: imp
            });

            const wDef = ShipHelper.ENUM_WEAPONS2[wKey];
            const sDef = ShipHelper.ENUM_STAGE_EFFECTS[stgKey];
            const rDef = ShipHelper.ENUM_SPACE_RANGES[rngKey];
            const stageModStr = sDef ? ` + Stage: ${sDef.tlMod >= 0 ? '+' : ''}${sDef.tlMod} [${sDef.stage}]` : '';
            const rangeModStr = rDef ? ` + Range: ${rDef.tlMod >= 0 ? '+' : ''}${rDef.tlMod} [${rDef.name.split(' ')[0]}]` : '';
            const formulaStr = `Base TL ${wDef?.baseTL || 0} [${wDef?.name || ''}]${stageModStr}${rangeModStr}`;

            const previewDiv = document.getElementById('weapon-preview');
            if (previewDiv) {
                previewDiv.innerHTML = `
                    ${ShipHelperView.formatTLStatus(wpnObj.tl, this.ship.baseTL, formulaStr)}
                    <div class="preview-stat">Cost: MCr${wpnObj.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                    <div class="preview-stat">Tonnage: ${wpnObj.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>
                    <div class="preview-stat">Control Panels: ${wpnObj.cp} CP</div>
                    <div class="preview-stat">Hardpoints Required: ${wpnObj.hardpointReq} HP</div>
                    <div class="preview-stat">Damage Potential: ${wpnObj.hits * wpnObj.count}D Hits (Mod: ${wpnObj.mod >= 0 ? '+' : ''}${wpnObj.mod})</div>
                    <div class="preview-stat">Range: Space S=${wpnObj.spaceRange} / World R=${wpnObj.worldRange}</div>
                    <div style="grid-column: 1 / -1; color: var(--text-muted); font-style: italic; font-size: 0.9em; margin-top: 4px;">${wpnObj.comment}</div>
                `;
            }
        };

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} Weapon`, content, () => {
            const wKey = document.getElementById('weapon-select').value;
            const mKey = document.getElementById('weapon-mount-select').value;
            const stgKey = document.getElementById('weapon-stage-select').value;
            const rngKey = document.getElementById('weapon-range-select').value;
            const cnt = parseInt(document.getElementById('weapon-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('weapon-tl-input').value, 10);
            const dep = document.getElementById('weapon-deployable').checked;
            const ext = document.getElementById('weapon-extendable').checked;
            const imp = document.getElementById('weapon-import').checked;

            const wpnComp = ShipHelper.buildWeapon(wKey, mKey, stgKey, rngKey, cnt, {
                tl: tlVal,
                deployable: dep,
                extendable: ext,
                importFee: imp
            });

            if (editIndex >= 0) {
                this.ship.updateComponent(editIndex, wpnComp);
            } else {
                this.ship.addComponent(wpnComp);
            }
            this.render();
        });

        ['weapon-select', 'weapon-mount-select', 'weapon-stage-select', 'weapon-range-select', 'weapon-tl-input', 'weapon-count-input', 'weapon-deployable', 'weapon-extendable', 'weapon-import'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });

        const syncWeaponTL = () => {
            const w = ShipHelper.ENUM_WEAPONS2[document.getElementById('weapon-select').value];
            const s = ShipHelper.ENUM_STAGE_EFFECTS[document.getElementById('weapon-stage-select').value];
            const r = ShipHelper.ENUM_SPACE_RANGES[document.getElementById('weapon-range-select').value];
            if (w) {
                const calcTL = Math.max(0, w.baseTL + (s?.tlMod || 0) + (r?.tlMod || 0));
                document.getElementById('weapon-tl-input').value = calcTL;
                document.getElementById('weapon-import').checked = (calcTL > this.ship.baseTL);
            }
            updatePreview();
        };

        document.getElementById('weapon-select').addEventListener('change', (e) => {
            const w = ShipHelper.ENUM_WEAPONS2[e.target.value];
            if (w && w.defaultMount && document.getElementById('weapon-mount-select')) {
                document.getElementById('weapon-mount-select').value = w.defaultMount;
            }
            syncWeaponTL();
        });
        document.getElementById('weapon-stage-select').addEventListener('change', syncWeaponTL);
        document.getElementById('weapon-range-select').addEventListener('change', syncWeaponTL);
        document.getElementById('weapon-tl-input').addEventListener('input', () => {
            const manualTL = parseInt(document.getElementById('weapon-tl-input').value, 10) || 0;
            document.getElementById('weapon-import').checked = (manualTL > this.ship.baseTL);
            updatePreview();
        });

        updatePreview();
    }

    openDefenseDialog(defenseKey, editIndex = -1) {
        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
        if (!selectedHull) {
            alert('No hull selected. Please select a hull first.');
            return;
        }

        let existingComp = null;
        if (editIndex >= 0) {
            const target = this.ship.getComponentByIdx(editIndex);
            if (target && target.component) existingComp = target.component;
        }

        const currentKey = existingComp ? (existingComp.defenseKey || defenseKey) : defenseKey;
        const currentMount = existingComp ? existingComp.mountKey : (ShipHelper.ENUM_DEFENSES2[currentKey]?.defaultMount || 'Bo');
        const currentStage = existingComp ? existingComp.stage : 'Standard';
        const currentRange = existingComp ? existingComp.rangeKey : 'AR';
        const currentCount = existingComp ? (existingComp.count || 1) : 1;
        const currentTL = existingComp ? existingComp.tl : Math.max(0, (ShipHelper.ENUM_DEFENSES2[currentKey]?.baseTL || 12) + (ShipHelper.ENUM_STAGE_EFFECTS[currentStage]?.tlMod || 0) + (ShipHelper.ENUM_SPACE_RANGES[currentRange]?.tlMod || 0));
        const currentDeployable = existingComp ? (existingComp.deployable || false) : false;
        const currentExtendable = existingComp ? (existingComp.extendable || false) : false;
        const currentImport = existingComp ? (existingComp.importFee || false) : (currentTL > this.ship.baseTL);

        let defenseOptions = '';
        for (const [k, d] of Object.entries(ShipHelper.ENUM_DEFENSES2)) {
            const sel = (k === currentKey) ? 'selected' : '';
            defenseOptions += `<option value="${k}" ${sel}>[${d.category}] ${d.name} (TL ${d.baseTL}, MCr${d.baseCost})</option>`;
        }

        let mountOptions = '';
        for (const [k, m] of Object.entries(ShipHelper.ENUM_DEFENSE_MOUNTS)) {
            const sel = (k === currentMount) ? 'selected' : '';
            mountOptions += `<option value="${k}" ${sel}>${m.name} (${m.tons}t, MCr${m.cost}, ${m.hardpointReq} HP)</option>`;
        }

        let stageOptions = '';
        for (const [k, s] of Object.entries(ShipHelper.ENUM_STAGE_EFFECTS)) {
            const sel = (k === currentStage) ? 'selected' : '';
            stageOptions += `<option value="${k}" ${sel}>${s.stage} (TL ${s.tlMod >= 0 ? '+' : ''}${s.tlMod}, Cost x${s.costMult})</option>`;
        }

        let rangeOptions = '';
        for (const [k, r] of Object.entries(ShipHelper.ENUM_SPACE_RANGES)) {
            const sel = (k === currentRange) ? 'selected' : '';
            rangeOptions += `<option value="${k}" ${sel}>${r.name} (Tons x${r.tonsMult}, Cost x${r.costMult})</option>`;
        }

        const content = `
            <div class="form-row">
                <label for="defense-select">Defense Type:</label>
                <select id="defense-select">${defenseOptions}</select>
            </div>
            <div class="form-row">
                <label for="defense-mount-select">Mount Type:</label>
                <select id="defense-mount-select">${mountOptions}</select>
            </div>
            <div class="form-row">
                <label for="defense-stage-select">Tech Stage:</label>
                <select id="defense-stage-select">${stageOptions}</select>
            </div>
            <div class="form-row">
                <label for="defense-range-select">Space Range:</label>
                <select id="defense-range-select">${rangeOptions}</select>
            </div>
            <div class="form-row">
                <label for="defense-tl-input">Tech Level:</label>
                <input type="number" id="defense-tl-input" value="${currentTL}" min="0" max="33">
            </div>
            <div class="form-row">
                <label for="defense-count-input">Quantity:</label>
                <input type="number" id="defense-count-input" value="${currentCount}" min="1" max="100">
            </div>
            <div class="form-row" style="justify-content: flex-start; gap: 20px;">
                <label><input type="checkbox" id="defense-deployable" ${currentDeployable ? 'checked' : ''}> Deployable (+2t, +3 MCr)</label>
                <label><input type="checkbox" id="defense-extendable" ${currentExtendable ? 'checked' : ''}> Extendable (+2t, +1 MCr)</label>
                <label><input type="checkbox" id="defense-import" ${currentImport ? 'checked' : ''}> 10% Import Surcharge</label>
            </div>
            <div id="defense-preview" class="drive-preview-box" style="margin-top: 15px;"></div>
        `;

        const updatePreview = () => {
            const dKey = document.getElementById('defense-select').value;
            const mKey = document.getElementById('defense-mount-select').value;
            const stgKey = document.getElementById('defense-stage-select').value;
            const rngKey = document.getElementById('defense-range-select').value;
            const cnt = parseInt(document.getElementById('defense-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('defense-tl-input').value, 10);
            const dep = document.getElementById('defense-deployable').checked;
            const ext = document.getElementById('defense-extendable').checked;
            const imp = document.getElementById('defense-import').checked;

            const defObj = ShipHelper.buildDefense(dKey, mKey, stgKey, rngKey, cnt, {
                tl: tlVal,
                deployable: dep,
                extendable: ext,
                importFee: imp
            });

            const dDef = ShipHelper.ENUM_DEFENSES2[dKey];
            const sDef = ShipHelper.ENUM_STAGE_EFFECTS[stgKey];
            const rDef = ShipHelper.ENUM_SPACE_RANGES[rngKey];
            const stageModStr = sDef ? ` + Stage: ${sDef.tlMod >= 0 ? '+' : ''}${sDef.tlMod} [${sDef.stage}]` : '';
            const rangeModStr = rDef ? ` + Range: ${rDef.tlMod >= 0 ? '+' : ''}${rDef.tlMod} [${rDef.name.split(' ')[0]}]` : '';
            const formulaStr = `Base TL ${dDef?.baseTL || 0} [${dDef?.name || ''}]${stageModStr}${rangeModStr}`;

            const previewDiv = document.getElementById('defense-preview');
            if (previewDiv) {
                previewDiv.innerHTML = `
                    ${ShipHelperView.formatTLStatus(defObj.tl, this.ship.baseTL, formulaStr)}
                    <div class="preview-stat">Cost: MCr${defObj.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                    <div class="preview-stat">Tonnage: ${defObj.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>
                    <div class="preview-stat">Control Panels: ${defObj.cp} CP</div>
                    <div class="preview-stat">Hardpoints Required: ${defObj.hardpointReq} HP</div>
                    <div class="preview-stat">Modifier: ${defObj.mod >= 0 ? '+' : ''}${defObj.mod}</div>
                    <div class="preview-stat">Range: Space S=${defObj.spaceRange} / World R=${defObj.worldRange}</div>
                    <div style="grid-column: 1 / -1; color: var(--text-muted); font-style: italic; font-size: 0.9em; margin-top: 4px;">${defObj.comment}</div>
                `;
            }
        };

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} Defense`, content, () => {
            const dKey = document.getElementById('defense-select').value;
            const mKey = document.getElementById('defense-mount-select').value;
            const stgKey = document.getElementById('defense-stage-select').value;
            const rngKey = document.getElementById('defense-range-select').value;
            const cnt = parseInt(document.getElementById('defense-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('defense-tl-input').value, 10);
            const dep = document.getElementById('defense-deployable').checked;
            const ext = document.getElementById('defense-extendable').checked;
            const imp = document.getElementById('defense-import').checked;

            const defComp = ShipHelper.buildDefense(dKey, mKey, stgKey, rngKey, cnt, {
                tl: tlVal,
                deployable: dep,
                extendable: ext,
                importFee: imp
            });

            if (editIndex >= 0) {
                this.ship.updateComponent(editIndex, defComp);
            } else {
                this.ship.addComponent(defComp);
            }
            this.render();
        });

        ['defense-select', 'defense-mount-select', 'defense-stage-select', 'defense-range-select', 'defense-tl-input', 'defense-count-input', 'defense-deployable', 'defense-extendable', 'defense-import'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });

        const syncDefenseTL = () => {
            const d = ShipHelper.ENUM_DEFENSES2[document.getElementById('defense-select').value];
            const s = ShipHelper.ENUM_STAGE_EFFECTS[document.getElementById('defense-stage-select').value];
            const r = ShipHelper.ENUM_SPACE_RANGES[document.getElementById('defense-range-select').value];
            if (d) {
                const calcTL = Math.max(0, d.baseTL + (s?.tlMod || 0) + (r?.tlMod || 0));
                document.getElementById('defense-tl-input').value = calcTL;
                document.getElementById('defense-import').checked = (calcTL > this.ship.baseTL);
            }
            updatePreview();
        };

        document.getElementById('defense-select').addEventListener('change', (e) => {
            const d = ShipHelper.ENUM_DEFENSES2[e.target.value];
            if (d && d.defaultMount && document.getElementById('defense-mount-select')) {
                document.getElementById('defense-mount-select').value = d.defaultMount;
            }
            syncDefenseTL();
        });
        document.getElementById('defense-stage-select').addEventListener('change', syncDefenseTL);
        document.getElementById('defense-range-select').addEventListener('change', syncDefenseTL);
        document.getElementById('defense-tl-input').addEventListener('input', () => {
            const manualTL = parseInt(document.getElementById('defense-tl-input').value, 10) || 0;
            document.getElementById('defense-import').checked = (manualTL > this.ship.baseTL);
            updatePreview();
        });

        updatePreview();
    }

    openSensorDialog(sensorKey, editIndex = -1) {
        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
        if (!selectedHull) {
            alert('No hull selected. Please select a hull first.');
            return;
        }

        let existingComp = null;
        if (editIndex >= 0) {
            const target = this.ship.getComponentByIdx(editIndex);
            if (target && target.component) existingComp = target.component;
        }

        const currentKey = existingComp ? (existingComp.sensorKey || sensorKey) : sensorKey;
        const currentMount = existingComp ? existingComp.mountKey : (ShipHelper.ENUM_SENSORS2[currentKey]?.defaultMount || 'Surf');
        const currentStage = existingComp ? existingComp.stage : 'Standard';
        const currentRange = existingComp ? existingComp.rangeKey : 'AR';
        const currentCount = existingComp ? (existingComp.count || 1) : 1;
        const currentTL = existingComp ? existingComp.tl : Math.max(0, (ShipHelper.ENUM_SENSORS2[currentKey]?.baseTL || 9) + (ShipHelper.ENUM_STAGE_EFFECTS[currentStage]?.tlMod || 0) + (ShipHelper.ENUM_SPACE_RANGES[currentRange]?.tlMod || 0));
        const currentDeployable = existingComp ? (existingComp.deployable || false) : false;
        const currentExtendable = existingComp ? (existingComp.extendable || false) : false;
        const currentImport = existingComp ? (existingComp.importFee || false) : (currentTL > this.ship.baseTL);

        let sensorOptions = '';
        for (const [k, se] of Object.entries(ShipHelper.ENUM_SENSORS2)) {
            const sel = (k === currentKey) ? 'selected' : '';
            sensorOptions += `<option value="${k}" ${sel}>[${se.category} - ${se.mode}] ${se.name} (TL ${se.baseTL}, MCr${se.baseCost})</option>`;
        }

        let mountOptions = '';
        for (const [k, m] of Object.entries(ShipHelper.ENUM_SENSOR_MOUNTS)) {
            const sel = (k === currentMount) ? 'selected' : '';
            mountOptions += `<option value="${k}" ${sel}>${m.name} (${m.tons}t, MCr${m.cost}, ${m.hardpointReq} HP)</option>`;
        }

        let stageOptions = '';
        for (const [k, s] of Object.entries(ShipHelper.ENUM_STAGE_EFFECTS)) {
            const sel = (k === currentStage) ? 'selected' : '';
            stageOptions += `<option value="${k}" ${sel}>${s.stage} (TL ${s.tlMod >= 0 ? '+' : ''}${s.tlMod}, Cost x${s.costMult})</option>`;
        }

        let rangeOptions = '';
        for (const [k, r] of Object.entries(ShipHelper.ENUM_SPACE_RANGES)) {
            const sel = (k === currentRange) ? 'selected' : '';
            rangeOptions += `<option value="${k}" ${sel}>${r.name} (Tons x${r.tonsMult}, Cost x${r.costMult})</option>`;
        }

        const content = `
            <div class="form-row">
                <label for="sensor-select">Sensor Type:</label>
                <select id="sensor-select">${sensorOptions}</select>
            </div>
            <div class="form-row">
                <label for="sensor-mount-select">Mount Type:</label>
                <select id="sensor-mount-select">${mountOptions}</select>
            </div>
            <div class="form-row">
                <label for="sensor-stage-select">Tech Stage:</label>
                <select id="sensor-stage-select">${stageOptions}</select>
            </div>
            <div class="form-row">
                <label for="sensor-range-select">Space Range:</label>
                <select id="sensor-range-select">${rangeOptions}</select>
            </div>
            <div class="form-row">
                <label for="sensor-tl-input">Tech Level:</label>
                <input type="number" id="sensor-tl-input" value="${currentTL}" min="0" max="33">
            </div>
            <div class="form-row">
                <label for="sensor-count-input">Quantity:</label>
                <input type="number" id="sensor-count-input" value="${currentCount}" min="1" max="100">
            </div>
            <div class="form-row" style="justify-content: flex-start; gap: 20px;">
                <label><input type="checkbox" id="sensor-deployable" ${currentDeployable ? 'checked' : ''}> Deployable (+2t, +3 MCr)</label>
                <label><input type="checkbox" id="sensor-extendable" ${currentExtendable ? 'checked' : ''}> Extendable (+2t, +1 MCr)</label>
                <label><input type="checkbox" id="sensor-import" ${currentImport ? 'checked' : ''}> 10% Import Surcharge</label>
            </div>
            <div id="sensor-preview" class="drive-preview-box" style="margin-top: 15px;"></div>
        `;

        const updatePreview = () => {
            const sKey = document.getElementById('sensor-select').value;
            const mKey = document.getElementById('sensor-mount-select').value;
            const stgKey = document.getElementById('sensor-stage-select').value;
            const rngKey = document.getElementById('sensor-range-select').value;
            const cnt = parseInt(document.getElementById('sensor-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('sensor-tl-input').value, 10);
            const dep = document.getElementById('sensor-deployable').checked;
            const ext = document.getElementById('sensor-extendable').checked;
            const imp = document.getElementById('sensor-import').checked;

            const sensorObj = ShipHelper.buildSensor(sKey, mKey, stgKey, rngKey, cnt, {
                tl: tlVal,
                deployable: dep,
                extendable: ext,
                importFee: imp
            });

            const sDef = ShipHelper.ENUM_SENSORS2[sKey];
            const stgDef = ShipHelper.ENUM_STAGE_EFFECTS[stgKey];
            const rDef = ShipHelper.ENUM_SPACE_RANGES[rngKey];
            const stageModStr = stgDef ? ` + Stage: ${stgDef.tlMod >= 0 ? '+' : ''}${stgDef.tlMod} [${stgDef.stage}]` : '';
            const rangeModStr = rDef ? ` + Range: ${rDef.tlMod >= 0 ? '+' : ''}${rDef.tlMod} [${rDef.name.split(' ')[0]}]` : '';
            const formulaStr = `Base TL ${sDef?.baseTL || 0} [${sDef?.name || ''}]${stageModStr}${rangeModStr}`;

            const previewDiv = document.getElementById('sensor-preview');
            if (previewDiv) {
                previewDiv.innerHTML = `
                    ${ShipHelperView.formatTLStatus(sensorObj.tl, this.ship.baseTL, formulaStr)}
                    <div class="preview-stat">Cost: MCr${sensorObj.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                    <div class="preview-stat">Tonnage: ${sensorObj.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>
                    <div class="preview-stat">Control Panels: ${sensorObj.cp} CP</div>
                    <div class="preview-stat">Hardpoints Required: ${sensorObj.hardpointReq} HP</div>
                    <div class="preview-stat">Sensor Mode: ${sensorObj.mode} (Mod: ${sensorObj.mod >= 0 ? '+' : ''}${sensorObj.mod})</div>
                    <div class="preview-stat">Range: Space S=${sensorObj.spaceRange} / World R=${sensorObj.worldRange}</div>
                    <div style="grid-column: 1 / -1; color: var(--text-muted); font-style: italic; font-size: 0.9em; margin-top: 4px;">${sensorObj.comment}</div>
                `;
            }
        };

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} Sensor Suite`, content, () => {
            const sKey = document.getElementById('sensor-select').value;
            const mKey = document.getElementById('sensor-mount-select').value;
            const stgKey = document.getElementById('sensor-stage-select').value;
            const rngKey = document.getElementById('sensor-range-select').value;
            const cnt = parseInt(document.getElementById('sensor-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('sensor-tl-input').value, 10);
            const dep = document.getElementById('sensor-deployable').checked;
            const ext = document.getElementById('sensor-extendable').checked;
            const imp = document.getElementById('sensor-import').checked;

            const sensorComp = ShipHelper.buildSensor(sKey, mKey, stgKey, rngKey, cnt, {
                tl: tlVal,
                deployable: dep,
                extendable: ext,
                importFee: imp
            });

            if (editIndex >= 0) {
                this.ship.updateComponent(editIndex, sensorComp);
            } else {
                this.ship.addComponent(sensorComp);
            }
            this.render();
        });

        ['sensor-select', 'sensor-mount-select', 'sensor-stage-select', 'sensor-range-select', 'sensor-tl-input', 'sensor-count-input', 'sensor-deployable', 'sensor-extendable', 'sensor-import'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });

        const syncSensorTL = () => {
            const se = ShipHelper.ENUM_SENSORS2[document.getElementById('sensor-select').value];
            const s = ShipHelper.ENUM_STAGE_EFFECTS[document.getElementById('sensor-stage-select').value];
            const r = ShipHelper.ENUM_SPACE_RANGES[document.getElementById('sensor-range-select').value];
            if (se) {
                const calcTL = Math.max(0, se.baseTL + (s?.tlMod || 0) + (r?.tlMod || 0));
                document.getElementById('sensor-tl-input').value = calcTL;
                document.getElementById('sensor-import').checked = (calcTL > this.ship.baseTL);
            }
            updatePreview();
        };

        document.getElementById('sensor-select').addEventListener('change', (e) => {
            const se = ShipHelper.ENUM_SENSORS2[e.target.value];
            if (se && se.defaultMount && document.getElementById('sensor-mount-select')) {
                document.getElementById('sensor-mount-select').value = se.defaultMount;
            }
            syncSensorTL();
        });
        document.getElementById('sensor-stage-select').addEventListener('change', syncSensorTL);
        document.getElementById('sensor-range-select').addEventListener('change', syncSensorTL);
        document.getElementById('sensor-tl-input').addEventListener('input', () => {
            const manualTL = parseInt(document.getElementById('sensor-tl-input').value, 10) || 0;
            document.getElementById('sensor-import').checked = (manualTL > this.ship.baseTL);
            updatePreview();
        });

        updatePreview();
    }

    openHullFittingDialog(fittingKey, editIndex = -1) {
        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
        if (!selectedHull) {
            alert('No hull selected. Please select a hull first.');
            return;
        }
        const fDef = ShipHelper.ENUM_HULL_FITTINGS[fittingKey];
        if (!fDef) return;

        const config = selectedHull.config;
        const isInstallable = fDef.installable.includes(config) || fDef.automatic.includes(config);
        if (!isInstallable) {
            alert(`${fDef.name} cannot be installed on a ${config} hull.`);
            return;
        }

        // Prevent duplicate fittings on the same hull (auto or manual)
        if (editIndex < 0) {
            const alreadyPresent = selectedHull.components.some(c => c.isHullFitting && c.fittingKey === fittingKey);
            if (alreadyPresent) {
                alert(`${fDef.name} is already installed on this hull.`);
                return;
            }
        }

        const calcTons = fDef.tons * selectedHull.tons / 100;
        const calcCost = fDef.cost * selectedHull.tons / 100;
        const deployedTonsHtml = fDef.deployedTons !== undefined
            ? `<div class="preview-stat">Deployed Tonnage: ${(fDef.deployedTons * selectedHull.tons / 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>`
            : '';
        const costClass = calcCost < 0 ? 'style="color:var(--accent-cyan)"' : '';

        const content = `
            <div style="margin-bottom: 10px; color: var(--text-muted); font-style: italic; font-size:0.95em;">${fDef.comment}</div>
            <div class="drive-preview-box">
                ${ShipHelperView.formatTLStatus(fDef.baseTL, this.ship.baseTL, 'Hull Engineering Standard')}
                <div class="preview-stat" ${costClass}>Cost: MCr${calcCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                <div class="preview-stat">Tonnage: ${calcTons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} tons</div>
                ${deployedTonsHtml}
                <div class="preview-stat">Mechanisms: ${fDef.mechanisms ?? 1}</div>
            </div>
        `;

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} ${fDef.name}`, content, () => {
            const comp = {
                isHullFitting: true,
                isAutoInstalled: false,
                fittingKey: fittingKey,
                name: fDef.name,
                mechanisms: fDef.mechanisms ?? 1,
                tons: calcTons,
                cost: calcCost,
                comment: fDef.comment
            };
            if (fDef.deployedTons !== undefined) comp.deployedTons = fDef.deployedTons * selectedHull.tons / 100;
            if (editIndex >= 0) {
                this.ship.updateComponent(editIndex, comp);
            } else {
                this.ship.addComponent(comp);
            }
            this.render();
        });
    }

    openConsoleDialog(roleKey = 'Bridge', editIndex = -1) {
        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
        if (!selectedHull) {
            alert('No hull selected. Please select a hull first.');
            return;
        }

        let existingComp = null;
        if (editIndex >= 0) {
            const target = this.ship.getComponentByIdx(editIndex);
            if (target && target.component) existingComp = target.component;
        }

        const currentRole = existingComp ? (existingComp.roleKey || roleKey) : roleKey;
        const currentType = existingComp ? (existingComp.typeKey || 'Standard') : (ShipHelper.ENUM_CONSOLE_ROLES[currentRole]?.defaultType || 'Standard');
        const currentCount = existingComp ? (existingComp.count || 1) : 1;
        const currentHolo = existingComp ? (existingComp.holographic || false) : false;
        const currentTL = existingComp ? existingComp.tl : (currentHolo ? Math.max(15, this.ship.baseTL || 12) : (this.ship.baseTL || 12));
        const currentImport = existingComp ? (existingComp.importFee || false) : (currentTL > this.ship.baseTL);

        let roleOptions = '';
        for (const [k, r] of Object.entries(ShipHelper.ENUM_CONSOLE_ROLES)) {
            const sel = (k === currentRole) ? 'selected' : '';
            roleOptions += `<option value="${k}" ${sel}>[${r.type}] ${r.name} (${r.skill})</option>`;
        }

        let typeOptions = '';
        for (const [k, t] of Object.entries(ShipHelper.ENUM_CONSOLE_TYPES)) {
            const sel = (k === currentType) ? 'selected' : '';
            typeOptions += `<option value="${k}" ${sel}>${t.name} (MCr${t.baseCost}, ${t.sq} Sq)</option>`;
        }

        const content = `
            <div class="form-row">
                <label for="console-role-select">Console Function / Role:</label>
                <select id="console-role-select">${roleOptions}</select>
            </div>
            <div class="form-row">
                <label for="console-type-select">Console Format / Size:</label>
                <select id="console-type-select">${typeOptions}</select>
            </div>
            <div class="form-row">
                <label for="console-count-input">Quantity:</label>
                <input type="number" id="console-count-input" value="${currentCount}" min="1" max="100">
            </div>
            <div class="form-row">
                <label for="console-tl-input">Tech Level:</label>
                <input type="number" id="console-tl-input" value="${currentTL}" min="0" max="33">
            </div>
            <div class="form-row" style="justify-content: flex-start; gap: 20px; flex-wrap: wrap;">
                <label><input type="checkbox" id="console-holo" ${currentHolo ? 'checked' : ''}> Virtual / Holographic (TL 15+, 0.5x tons, 1.5x MCr)</label>
                <label><input type="checkbox" id="console-import" ${currentImport ? 'checked' : ''}> 10% Import Surcharge</label>
            </div>
            <div id="console-preview" class="drive-preview-box" style="margin-top: 15px;"></div>
        `;

        const updatePreview = () => {
            const rKey = document.getElementById('console-role-select').value;
            const tKey = document.getElementById('console-type-select').value;
            const cnt = parseInt(document.getElementById('console-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('console-tl-input').value, 10);
            const holo = document.getElementById('console-holo').checked;
            const imp = document.getElementById('console-import').checked;

            const cObj = ShipHelper.buildConsole(rKey, tKey, cnt, {
                tl: tlVal,
                holographic: holo,
                importFee: imp,
                shipBaseTL: this.ship.baseTL
            });

            const formulaStr = holo ? 'Holographic Virtual Interface (Requires TL 15+)' : 'Standard Control Electronics';

            const previewDiv = document.getElementById('console-preview');
            if (previewDiv) {
                previewDiv.innerHTML = `
                    ${ShipHelperView.formatTLStatus(cObj.tl, this.ship.baseTL, formulaStr)}
                    <div class="preview-stat">Cost: MCr${cObj.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                    <div class="preview-stat">Tonnage: ${cObj.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>
                    <div class="preview-stat">Deck Space: ${cObj.sq} Squares (${cObj.sq * 2} Cubes)</div>
                    <div class="preview-stat">Primary Skill: ${cObj.skill}</div>
                    <div class="preview-stat">Console Type: ${cObj.roleType} (${cObj.typeName})</div>
                    <div style="grid-column: 1 / -1; color: var(--text-muted); font-style: italic; font-size: 0.9em; margin-top: 4px;">${cObj.comment}</div>
                `;
            }
        };

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} Control Console`, content, () => {
            const rKey = document.getElementById('console-role-select').value;
            const tKey = document.getElementById('console-type-select').value;
            const cnt = parseInt(document.getElementById('console-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('console-tl-input').value, 10);
            const holo = document.getElementById('console-holo').checked;
            const imp = document.getElementById('console-import').checked;

            const cComp = ShipHelper.buildConsole(rKey, tKey, cnt, {
                tl: tlVal,
                holographic: holo,
                importFee: imp,
                shipBaseTL: this.ship.baseTL
            });

            if (editIndex >= 0) {
                this.ship.updateComponent(editIndex, cComp);
            } else {
                this.ship.addComponent(cComp);
            }
            this.render();
        });

        ['console-role-select', 'console-type-select', 'console-count-input', 'console-tl-input', 'console-holo', 'console-import'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });

        document.getElementById('console-holo').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.getElementById('console-tl-input').value = Math.max(15, this.ship.baseTL || 12);
            } else {
                document.getElementById('console-tl-input').value = this.ship.baseTL || 12;
            }
            const tlVal = parseInt(document.getElementById('console-tl-input').value, 10) || 0;
            document.getElementById('console-import').checked = (tlVal > this.ship.baseTL);
            updatePreview();
        });

        document.getElementById('console-tl-input').addEventListener('input', () => {
            const tlVal = parseInt(document.getElementById('console-tl-input').value, 10) || 0;
            document.getElementById('console-import').checked = (tlVal > this.ship.baseTL);
            updatePreview();
        });

        updatePreview();
    }

    openComputerDialog(modelNumber = 0, editIndex = -1) {
        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
        if (!selectedHull) {
            alert('No hull selected. Please select a hull first.');
            return;
        }

        let existingComp = null;
        if (editIndex >= 0) {
            const target = this.ship.getComponentByIdx(editIndex);
            if (target && target.component) existingComp = target.component;
        }

        const currentModel = existingComp ? existingComp.model : modelNumber;
        const currentBis = existingComp ? (existingComp.isBis || false) : false;
        const currentFib = existingComp ? (existingComp.fiberOptic || false) : false;
        const currentBackup = existingComp ? (existingComp.isBackup || false) : false;
        const currentMaster = existingComp ? (existingComp.isMaster || false) : false;
        const currentCount = existingComp ? (existingComp.count || 1) : 1;
        const currentTL = existingComp ? existingComp.tl : (ShipHelper.getComputerSpecs(currentModel, currentBis).baseTL);
        const currentImport = existingComp ? (existingComp.importFee || false) : (currentTL > this.ship.baseTL);

        let modelOptions = '';
        for (let m = 0; m <= 33; m++) {
            const specs = ShipHelper.getComputerSpecs(m, false);
            const sel = (m === currentModel) ? 'selected' : '';
            modelOptions += `<option value="${m}" ${sel}>Model/${m} (TL ${specs.baseTL}, ${specs.cells} Cells, ${specs.tons}t, MCr${specs.cost})</option>`;
        }

        const content = `
            <div class="form-row">
                <label for="computer-model-select">Computer Model:</label>
                <select id="computer-model-select">${modelOptions}</select>
            </div>
            <div class="form-row">
                <label for="computer-count-input">Quantity:</label>
                <input type="number" id="computer-count-input" value="${currentCount}" min="1" max="10">
            </div>
            <div class="form-row">
                <label for="computer-tl-input">Tech Level:</label>
                <input type="number" id="computer-tl-input" value="${currentTL}" min="0" max="33">
            </div>
            <div class="form-row" style="justify-content: flex-start; gap: 20px; flex-wrap: wrap;">
                <label><input type="checkbox" id="computer-bis" ${currentBis ? 'checked' : ''}> 'bis' Architecture (+1 Cell, enhanced processing)</label>
                <label><input type="checkbox" id="computer-fib" ${currentFib ? 'checked' : ''}> Fiber-Optic / Hardened (/fib, +50% MCr)</label>
                <label><input type="checkbox" id="computer-backup" ${currentBackup ? 'checked' : ''}> Off-line Standby Backup (50% MCr)</label>
                <label><input type="checkbox" id="computer-master" ${currentMaster ? 'checked' : ''}> Master Computer</label>
                <label><input type="checkbox" id="computer-import" ${currentImport ? 'checked' : ''}> 10% Import Surcharge</label>
            </div>
            <div id="computer-preview" class="drive-preview-box" style="margin-top: 15px;"></div>
        `;

        const updatePreview = () => {
            const mVal = parseInt(document.getElementById('computer-model-select').value, 10) || 0;
            const cnt = parseInt(document.getElementById('computer-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('computer-tl-input').value, 10);
            const isBis = document.getElementById('computer-bis').checked;
            const isFib = document.getElementById('computer-fib').checked;
            const isBak = document.getElementById('computer-backup').checked;
            const isMst = document.getElementById('computer-master').checked;
            const isImp = document.getElementById('computer-import').checked;

            const compObj = ShipHelper.buildComputer(mVal, isBis, cnt, {
                tl: tlVal,
                fiberOptic: isFib,
                isBackup: isBak,
                isMaster: isMst,
                importFee: isImp
            });

            const formulaStr = `Model/${compObj.model}${compObj.isBis ? ' bis' : ''} Base TL ${compObj.baseTL} (C+S = ${compObj.tl})`;

            const previewDiv = document.getElementById('computer-preview');
            if (previewDiv) {
                previewDiv.innerHTML = `
                    ${ShipHelperView.formatTLStatus(compObj.tl, this.ship.baseTL, formulaStr)}
                    <div class="preview-stat">Cost: MCr${compObj.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                    <div class="preview-stat">Tonnage: ${compObj.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>
                    <div class="preview-stat">Processing Cells: ${compObj.cells} Console-Equivalents</div>
                    <div class="preview-stat">Software Capacity: ${compObj.softwareCapacity}</div>
                    <div class="preview-stat">Deck Space: ${compObj.sq} Squares (${compObj.sq * 2} Cubes)</div>
                    <div style="grid-column: 1 / -1; color: var(--text-muted); font-style: italic; font-size: 0.9em; margin-top: 4px;">${compObj.comment}</div>
                `;
            }
        };

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} Ship's Computer`, content, () => {
            const mVal = parseInt(document.getElementById('computer-model-select').value, 10) || 0;
            const cnt = parseInt(document.getElementById('computer-count-input').value, 10) || 1;
            const tlVal = parseInt(document.getElementById('computer-tl-input').value, 10);
            const isBis = document.getElementById('computer-bis').checked;
            const isFib = document.getElementById('computer-fib').checked;
            const isBak = document.getElementById('computer-backup').checked;
            const isMst = document.getElementById('computer-master').checked;
            const isImp = document.getElementById('computer-import').checked;

            const compObj = ShipHelper.buildComputer(mVal, isBis, cnt, {
                tl: tlVal,
                fiberOptic: isFib,
                isBackup: isBak,
                isMaster: isMst,
                importFee: isImp
            });

            if (editIndex >= 0) {
                this.ship.updateComponent(editIndex, compObj);
            } else {
                this.ship.addComponent(compObj);
            }
            this.render();
        });

        ['computer-model-select', 'computer-count-input', 'computer-tl-input', 'computer-bis', 'computer-fib', 'computer-backup', 'computer-master', 'computer-import'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });

        const syncComputerTL = () => {
            const m = parseInt(document.getElementById('computer-model-select').value, 10) || 0;
            const isBis = document.getElementById('computer-bis').checked;
            const specs = ShipHelper.getComputerSpecs(m, isBis);
            document.getElementById('computer-tl-input').value = specs.baseTL;
            document.getElementById('computer-import').checked = (specs.baseTL > this.ship.baseTL);
            updatePreview();
        };

        document.getElementById('computer-model-select').addEventListener('change', syncComputerTL);
        document.getElementById('computer-bis').addEventListener('change', syncComputerTL);
        document.getElementById('computer-tl-input').addEventListener('input', () => {
            const manualTL = parseInt(document.getElementById('computer-tl-input').value, 10) || 0;
            document.getElementById('computer-import').checked = (manualTL > this.ship.baseTL);
            updatePreview();
        });

        updatePreview();
    }

    openAccommodationDialog(typeKey = 'StandardStateroom', editIndex = -1) {
        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
        if (!selectedHull) {
            alert('No hull selected. Please select a hull first.');
            return;
        }

        let existingComp = null;
        if (editIndex >= 0) {
            const target = this.ship.getComponentByIdx(editIndex);
            if (target && target.component) existingComp = target.component;
        }

        const currentKey = existingComp ? (existingComp.accommodationKey || typeKey) : typeKey;
        const currentCount = existingComp ? (existingComp.count || 1) : 1;
        const currentAssignment = existingComp ? existingComp.assignment : (ShipHelper.ENUM_ACCOMMODATION_TYPES[currentKey]?.defaultRole || 'Crew');
        const currentTL = existingComp ? existingComp.tl : (this.ship.baseTL || 12);
        const currentImport = existingComp ? (existingComp.importFee || false) : (currentTL > this.ship.baseTL);
        const currentTons = existingComp ? existingComp.tons : (ShipHelper.ENUM_ACCOMMODATION_TYPES[currentKey]?.tons || 2.0);

        let typeOptions = '';
        for (const [k, a] of Object.entries(ShipHelper.ENUM_ACCOMMODATION_TYPES)) {
            const sel = (k === currentKey) ? 'selected' : '';
            typeOptions += `<option value="${k}" ${sel}>${a.name} (${a.tons}t, MCr${a.cost}, ${a.occupants} Occ)</option>`;
        }

        const assignmentOptions = `
            <option value="Crew" ${currentAssignment === 'Crew' ? 'selected' : ''}>Crew Quarters</option>
            <option value="HighPax" ${currentAssignment === 'HighPax' ? 'selected' : ''}>High / Luxury Passenger</option>
            <option value="MidPax" ${currentAssignment === 'MidPax' ? 'selected' : ''}>Middle Passenger / Bunk</option>
            <option value="Cryo" ${currentAssignment === 'Cryo' ? 'selected' : ''}>Cryogenic Low Passenger</option>
            <option value="Commons" ${currentAssignment === 'Commons' ? 'selected' : ''}>Passenger Commons / Recreation</option>
        `;

        const isCommons = currentKey === 'PassengerCommons';

        const content = `
            <div class="form-row">
                <label for="accom-type-select">Accommodation Type:</label>
                <select id="accom-type-select">${typeOptions}</select>
            </div>
            <div class="form-row">
                <label for="accom-assignment-select">Berth Assignment:</label>
                <select id="accom-assignment-select">${assignmentOptions}</select>
            </div>
            <div class="form-row" id="accom-count-row">
                <label for="accom-count-input">Quantity / Staterooms:</label>
                <input type="number" id="accom-count-input" value="${currentCount}" min="1" max="500">
            </div>
            <div class="form-row" id="accom-tons-row" style="${isCommons ? '' : 'display:none;'}">
                <label for="accom-tons-input">Custom Commons Tonnage:</label>
                <input type="number" id="accom-tons-input" value="${currentTons}" min="1" max="10000">
            </div>
            <div class="form-row">
                <label for="accom-tl-input">Tech Level:</label>
                <input type="number" id="accom-tl-input" value="${currentTL}" min="0" max="33">
            </div>
            <div class="form-row" style="justify-content: flex-start; gap: 20px;">
                <label><input type="checkbox" id="accom-import" ${currentImport ? 'checked' : ''}> 10% Import Surcharge</label>
            </div>
            <div id="accom-preview" class="drive-preview-box" style="margin-top: 15px;"></div>
        `;

        const updatePreview = () => {
            const tKey = document.getElementById('accom-type-select').value;
            const assign = document.getElementById('accom-assignment-select').value;
            const cnt = parseInt(document.getElementById('accom-count-input').value, 10) || 1;
            const tonsVal = parseFloat(document.getElementById('accom-tons-input').value) || 1;
            const tlVal = parseInt(document.getElementById('accom-tl-input').value, 10);
            const imp = document.getElementById('accom-import').checked;

            const isComm = tKey === 'PassengerCommons';
            const tonsRow = document.getElementById('accom-tons-row');
            if (tonsRow) tonsRow.style.display = isComm ? 'flex' : 'none';

            const aObj = ShipHelper.buildAccommodation(tKey, cnt, {
                assignment: assign,
                tons: isComm ? tonsVal : undefined,
                tl: tlVal,
                importFee: imp,
                shipBaseTL: this.ship.baseTL
            });

            const formulaStr = aObj.isCommons ? 'Passenger Commons (1 ton/pax standard)' : `${aObj.singleOccupants} occupant(s) per cabin \u2014 ${aObj.assignment}`;

            const previewDiv = document.getElementById('accom-preview');
            if (previewDiv) {
                previewDiv.innerHTML = `
                    ${ShipHelperView.formatTLStatus(aObj.tl, this.ship.baseTL, formulaStr)}
                    <div class="preview-stat">Cost: MCr${aObj.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                    <div class="preview-stat">Tonnage: ${aObj.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>
                    <div class="preview-stat">Total Occupants: ${aObj.occupants} (${aObj.assignment})</div>
                    <div class="preview-stat">Fresher: ${aObj.fresher}</div>
                    <div class="preview-stat">Comfort Score: ${aObj.comfort}</div>
                    <div style="grid-column: 1 / -1; color: var(--text-muted); font-style: italic; font-size: 0.9em; margin-top: 4px;">${aObj.comment}</div>
                `;
            }
        };

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} Accommodations`, content, () => {
            const tKey = document.getElementById('accom-type-select').value;
            const assign = document.getElementById('accom-assignment-select').value;
            const cnt = parseInt(document.getElementById('accom-count-input').value, 10) || 1;
            const tonsVal = parseFloat(document.getElementById('accom-tons-input').value) || 1;
            const tlVal = parseInt(document.getElementById('accom-tl-input').value, 10);
            const imp = document.getElementById('accom-import').checked;

            const aObj = ShipHelper.buildAccommodation(tKey, cnt, {
                assignment: assign,
                tons: tKey === 'PassengerCommons' ? tonsVal : undefined,
                tl: tlVal,
                importFee: imp,
                shipBaseTL: this.ship.baseTL
            });

            if (editIndex >= 0) {
                this.ship.updateComponent(editIndex, aObj);
            } else {
                this.ship.addComponent(aObj);
            }
            this.render();
        });

        ['accom-type-select', 'accom-assignment-select', 'accom-count-input', 'accom-tons-input', 'accom-tl-input', 'accom-import'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });

        document.getElementById('accom-type-select').addEventListener('change', (e) => {
            const def = ShipHelper.ENUM_ACCOMMODATION_TYPES[e.target.value];
            if (def && def.defaultRole) {
                document.getElementById('accom-assignment-select').value = def.defaultRole;
            }
            updatePreview();
        });

        updatePreview();
    }

    openFacilityDialog(facilityKey = 'StandardCargo', editIndex = -1) {
        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
        if (!selectedHull) {
            alert('No hull selected. Please select a hull first.');
            return;
        }

        let existingComp = null;
        if (editIndex >= 0) {
            const target = this.ship.getComponentByIdx(editIndex);
            if (target && target.component) existingComp = target.component;
        }

        const currentKey = existingComp ? (existingComp.facilityKey || facilityKey) : facilityKey;
        const currentDef = ShipHelper.ENUM_FACILITY_TYPES[currentKey] || ShipHelper.ENUM_FACILITY_TYPES.StandardCargo;
        const currentAmount = existingComp ? (currentDef.fixedSize ? existingComp.count : existingComp.tons) : (currentDef.fixedSize ? 1 : 10);
        const currentTL = existingComp ? existingComp.tl : (this.ship.baseTL || 12);
        const currentImport = existingComp ? (existingComp.importFee || false) : (currentTL > this.ship.baseTL);

        let typeOptions = '';
        for (const [k, f] of Object.entries(ShipHelper.ENUM_FACILITY_TYPES)) {
            const sel = (k === currentKey) ? 'selected' : '';
            typeOptions += `<option value="${k}" ${sel}>${f.name} (MCr${f.unitCost}${f.fixedSize ? '/unit' : '/t'})</option>`;
        }

        const isFixed = !!currentDef.fixedSize;
        const amountLabel = isFixed ? 'Quantity (4-ton units):' : 'Tonnage (tons):';

        const content = `
            <div class="form-row">
                <label for="facility-type-select">Facility / Payload Type:</label>
                <select id="facility-type-select">${typeOptions}</select>
            </div>
            <div class="form-row">
                <label id="facility-amt-label" for="facility-amt-input">${amountLabel}</label>
                <div style="flex:2; display:flex; align-items:center; gap:5px;">
                    <button type="button" class="tons-btn" id="fac-step-m10">-10</button>
                    <input type="number" id="facility-amt-input" value="${currentAmount}" min="1" max="100000" style="flex:1;">
                    <button type="button" class="tons-btn" id="fac-step-p10">+10</button>
                    <button type="button" class="tons-btn" id="fac-step-p50">+50</button>
                </div>
            </div>
            <div class="form-row">
                <label for="facility-tl-input">Tech Level:</label>
                <input type="number" id="facility-tl-input" value="${currentTL}" min="0" max="33">
            </div>
            <div class="form-row" style="justify-content: flex-start; gap: 20px;">
                <label><input type="checkbox" id="facility-import" ${currentImport ? 'checked' : ''}> 10% Import Surcharge</label>
            </div>
            <div id="facility-preview" class="drive-preview-box" style="margin-top: 15px;"></div>
        `;

        const updatePreview = () => {
            const fKey = document.getElementById('facility-type-select').value;
            const amt = parseFloat(document.getElementById('facility-amt-input').value) || 1;
            const tlVal = parseInt(document.getElementById('facility-tl-input').value, 10);
            const imp = document.getElementById('facility-import').checked;
            const fDef = ShipHelper.ENUM_FACILITY_TYPES[fKey] || ShipHelper.ENUM_FACILITY_TYPES.StandardCargo;

            const lbl = document.getElementById('facility-amt-label');
            if (lbl) lbl.textContent = fDef.fixedSize ? 'Quantity (4-ton units):' : 'Tonnage (tons):';

            const fObj = ShipHelper.buildFacility(fKey, amt, {
                tl: tlVal,
                importFee: imp,
                shipBaseTL: this.ship.baseTL
            });

            const formulaStr = `${fObj.category} Payload / Facility (TL ${fObj.tl})`;

            const previewDiv = document.getElementById('facility-preview');
            if (previewDiv) {
                previewDiv.innerHTML = `
                    ${ShipHelperView.formatTLStatus(fObj.tl, this.ship.baseTL, formulaStr)}
                    <div class="preview-stat">Cost: MCr${fObj.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                    <div class="preview-stat">Tonnage: ${fObj.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>
                    <div class="preview-stat">Category: ${fObj.category}</div>
                    <div style="grid-column: 1 / -1; color: var(--text-muted); font-style: italic; font-size: 0.9em; margin-top: 4px;">${fObj.comment}</div>
                `;
            }
        };

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} Facility / Payload`, content, () => {
            const fKey = document.getElementById('facility-type-select').value;
            const amt = parseFloat(document.getElementById('facility-amt-input').value) || 1;
            const tlVal = parseInt(document.getElementById('facility-tl-input').value, 10);
            const imp = document.getElementById('facility-import').checked;

            const fObj = ShipHelper.buildFacility(fKey, amt, {
                tl: tlVal,
                importFee: imp,
                shipBaseTL: this.ship.baseTL
            });

            if (editIndex >= 0) {
                this.ship.updateComponent(editIndex, fObj);
            } else {
                this.ship.addComponent(fObj);
            }
            this.render();
        });

        ['facility-type-select', 'facility-amt-input', 'facility-tl-input', 'facility-import'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });

        const amtInput = document.getElementById('facility-amt-input');
        document.getElementById('fac-step-m10')?.addEventListener('click', () => {
            amtInput.value = Math.max(1, (parseFloat(amtInput.value) || 0) - 10);
            updatePreview();
        });
        document.getElementById('fac-step-p10')?.addEventListener('click', () => {
            amtInput.value = (parseFloat(amtInput.value) || 0) + 10;
            updatePreview();
        });
        document.getElementById('fac-step-p50')?.addEventListener('click', () => {
            amtInput.value = (parseFloat(amtInput.value) || 0) + 50;
            updatePreview();
        });

        updatePreview();
    }

    openLifeSupportDialog(lsKey = 'ExtendedLifeSupport', editIndex = -1) {
        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
        if (!selectedHull) {
            alert('No hull selected. Please select a hull first.');
            return;
        }

        let existingComp = null;
        if (editIndex >= 0) {
            const target = this.ship.getComponentByIdx(editIndex);
            if (target && target.component) existingComp = target.component;
        }

        const currentKey = existingComp ? (existingComp.lifeSupportKey || lsKey) : lsKey;
        const currentAmount = existingComp ? (currentKey === 'RecyclerUnit' ? existingComp.count : existingComp.tons) : (currentKey === 'RecyclerUnit' ? 1 : 5);
        const currentTL = existingComp ? existingComp.tl : (this.ship.baseTL || 12);
        const currentImport = existingComp ? (existingComp.importFee || false) : (currentTL > this.ship.baseTL);

        let typeOptions = '';
        for (const [k, ls] of Object.entries(ShipHelper.ENUM_LIFE_SUPPORT_TYPES)) {
            const sel = (k === currentKey) ? 'selected' : '';
            typeOptions += `<option value="${k}" ${sel}>${ls.name}</option>`;
        }

        const isRecycler = currentKey === 'RecyclerUnit';
        const amountLabel = isRecycler ? 'Units (2 tons each):' : 'Stores Tonnage (100 person-days/ton):';

        const content = `
            <div class="form-row">
                <label for="ls-type-select">Life Support System:</label>
                <select id="ls-type-select">${typeOptions}</select>
            </div>
            <div class="form-row">
                <label id="ls-amt-label" for="ls-amt-input">${amountLabel}</label>
                <input type="number" id="ls-amt-input" value="${currentAmount}" min="1" max="1000">
            </div>
            <div class="form-row">
                <label for="ls-tl-input">Tech Level:</label>
                <input type="number" id="ls-tl-input" value="${currentTL}" min="0" max="33">
            </div>
            <div class="form-row" style="justify-content: flex-start; gap: 20px;">
                <label><input type="checkbox" id="ls-import" ${currentImport ? 'checked' : ''}> 10% Import Surcharge</label>
            </div>
            <div id="ls-preview" class="drive-preview-box" style="margin-top: 15px;"></div>
        `;

        const updatePreview = () => {
            const kVal = document.getElementById('ls-type-select').value;
            const amt = parseFloat(document.getElementById('ls-amt-input').value) || 1;
            const tlVal = parseInt(document.getElementById('ls-tl-input').value, 10);
            const imp = document.getElementById('ls-import').checked;

            const isRec = kVal === 'RecyclerUnit';
            const lbl = document.getElementById('ls-amt-label');
            if (lbl) lbl.textContent = isRec ? 'Units (2 tons each):' : 'Stores Tonnage (100 person-days/ton):';

            const lsObj = ShipHelper.buildLifeSupport(kVal, amt, {
                tl: tlVal,
                importFee: imp,
                shipBaseTL: this.ship.baseTL
            });

            const formulaStr = isRec ? 'Atmospheric & Water Recycling (+50% mission endurance)' : `${lsObj.personDays} Person-Days of Consumables`;

            const previewDiv = document.getElementById('ls-preview');
            if (previewDiv) {
                previewDiv.innerHTML = `
                    ${ShipHelperView.formatTLStatus(lsObj.tl, this.ship.baseTL, formulaStr)}
                    <div class="preview-stat">Cost: MCr${lsObj.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                    <div class="preview-stat">Tonnage: ${lsObj.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>
                    ${lsObj.personDays > 0 ? `<div class="preview-stat">Capacity: ${lsObj.personDays.toLocaleString()} Person-Days</div>` : ''}
                    ${lsObj.efficiencyBonus > 0 ? `<div class="preview-stat">Recycling Bonus: +${Math.round(lsObj.efficiencyBonus * 100 * lsObj.count)}% Endurance</div>` : ''}
                    <div style="grid-column: 1 / -1; color: var(--text-muted); font-style: italic; font-size: 0.9em; margin-top: 4px;">${lsObj.comment}</div>
                `;
            }
        };

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} Life Support`, content, () => {
            const kVal = document.getElementById('ls-type-select').value;
            const amt = parseFloat(document.getElementById('ls-amt-input').value) || 1;
            const tlVal = parseInt(document.getElementById('ls-tl-input').value, 10);
            const imp = document.getElementById('ls-import').checked;

            const lsObj = ShipHelper.buildLifeSupport(kVal, amt, {
                tl: tlVal,
                importFee: imp,
                shipBaseTL: this.ship.baseTL
            });

            if (editIndex >= 0) {
                this.ship.updateComponent(editIndex, lsObj);
            } else {
                this.ship.addComponent(lsObj);
            }
            this.render();
        });

        ['ls-type-select', 'ls-amt-input', 'ls-tl-input', 'ls-import'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });

        updatePreview();
    }

    openCrewRosterModal(defaultModel = null) {
        if (defaultModel) this.currentStaffingModel = defaultModel;
        const currentModel = this.currentStaffingModel || 'Merchant';
        const crewData = this.ship.getCrewRequirements(currentModel);
        const lsStatus = this.ship.getLifeSupportStatus();

        let rowsHtml = '';
        let currentDept = '';

        crewData.roster.forEach(r => {
            if (r.department !== currentDept) {
                currentDept = r.department;
                rowsHtml += `
                    <tr class="crew-dept-header">
                        <td colspan="5">${currentDept.toUpperCase()} DEPARTMENT</td>
                    </tr>
                `;
            }
            rowsHtml += `
                <tr>
                    <td style="font-weight:bold; color:var(--text-main);">${r.role}</td>
                    <td style="color:var(--accent-cyan);">${r.title} <span style="font-size:0.8em; color:var(--text-muted);">(${r.rank})</span></td>
                    <td style="text-align:center; font-weight:bold;">${r.count}</td>
                    <td>${r.skill}</td>
                    <td style="color:var(--text-muted); font-size:0.85em; font-style:italic;">${r.comment}</td>
                </tr>
            `;
        });

        const berthWarning = this.ship.totalCrewBerths < crewData.totalCrew
            ? `<span style="color:var(--accent-red); font-weight:bold;">Deficit: ${crewData.totalCrew - this.ship.totalCrewBerths} Berths Missing</span>`
            : `<span style="color:#00e676; font-weight:bold;">Adequate (${this.ship.totalCrewBerths} Berths Available)</span>`;

        const content = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-bottom:15px; border-bottom:1px solid rgba(0,229,255,0.2); padding-bottom:10px;">
                <div class="staffing-toggle">
                    <span style="font-weight:bold; color:var(--text-muted); margin-right:5px;">Hierarchy Model:</span>
                    <button type="button" class="staffing-btn ${currentModel === 'Merchant' ? 'active' : ''}" data-model="Merchant">Merchant / Commercial</button>
                    <button type="button" class="staffing-btn ${currentModel === 'Naval' ? 'active' : ''}" data-model="Naval">Naval / Military</button>
                    <button type="button" class="staffing-btn ${currentModel === 'Scout' ? 'active' : ''}" data-model="Scout">Scout / Survey</button>
                </div>
                <div style="font-size:0.9em; color:var(--text-muted);">
                    Ship: <strong>${this.ship.tonnage.toLocaleString()} tons</strong> \u2014 TL ${this.ship.baseTL}
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:15px;">
                <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:4px; border-left:3px solid var(--accent-cyan);">
                    <div style="color:var(--text-muted); font-size:0.8em; text-transform:uppercase;">Total Crew</div>
                    <div style="font-size:1.4em; font-weight:bold; color:var(--accent-cyan);">${crewData.totalCrew} Personnel</div>
                    <div style="font-size:0.8em; color:var(--text-muted);">${crewData.totalOfficers} Officers, ${crewData.totalEnlisted} Enlisted</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:4px; border-left:3px solid #1abc9c;">
                    <div style="color:var(--text-muted); font-size:0.8em; text-transform:uppercase;">Crew Berthing</div>
                    <div style="font-size:1.4em; font-weight:bold; color:#1abc9c;">${this.ship.totalCrewBerths} Berths</div>
                    <div style="font-size:0.8em;">${berthWarning}</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:4px; border-left:3px solid #3498db;">
                    <div style="color:var(--text-muted); font-size:0.8em; text-transform:uppercase;">Passengers & Cryo</div>
                    <div style="font-size:1.4em; font-weight:bold; color:#3498db;">${crewData.totalPassengers} Pax (${crewData.lowPassengers} Low)</div>
                    <div style="font-size:0.8em; color:var(--text-muted);">${crewData.highPassengers} High, ${crewData.middlePassengers} Mid</div>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:4px; border-left:3px solid #16a085;">
                    <div style="color:var(--text-muted); font-size:0.8em; text-transform:uppercase;">Life Support Endurance</div>
                    <div style="font-size:1.4em; font-weight:bold; color:#16a085;">${lsStatus.daysEndurance} Days (${lsStatus.monthsEndurance} Mo)</div>
                    <div style="font-size:0.8em; color:var(--text-muted);">${lsStatus.totalPersonDays} Person-Days total</div>
                </div>
            </div>

            <table class="crew-table">
                <thead>
                    <tr>
                        <th style="width:25%;">Role / Assignment</th>
                        <th style="width:20%;">Official Title & Rank</th>
                        <th style="width:8%; text-align:center;">Count</th>
                        <th style="width:22%;">Primary Skillsets</th>
                        <th style="width:25%;">Duties / Rationale</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        `;

        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'dialog crew-modal';
        dialog.innerHTML = `
            <h2>Ship's Crew Hierarchy & Staffing Engine</h2>
            <div class="dialog-content">${content}</div>
            <div class="dialog-buttons" style="justify-content:flex-end;">
                <button id="crew-modal-close" class="confirm-btn">Close</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        dialog.querySelectorAll('.staffing-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const newModel = e.target.getAttribute('data-model');
                this.currentStaffingModel = newModel;
                overlay.remove();
                this.openCrewRosterModal(newModel);
                this.renderRightPanel();
            });
        });

        document.getElementById('crew-modal-close').addEventListener('click', () => {
            overlay.remove();
        });
    }

    openDriveDialog(driveType, editIndex = -1) {
        let classOptions = '';
        let defaultTL = this.ship.baseTL;
        let availableStages = ShipHelper.getAvailableTechStages(defaultTL, driveType);

        if (availableStages.length === 0) {
            // Find minimum TL where this drive becomes available
            for (let tl = 1; tl <= 33; tl++) {
                const stages = ShipHelper.getAvailableTechStages(tl, driveType);
                if (stages.length > 0) {
                    defaultTL = tl;
                    availableStages = stages;
                    break;
                }
            }
            if (availableStages.length === 0) {
                alert(`No ${driveType} technology available at any Tech Level.`);
                return;
            }
        }

        // Determine defaults based on whether we are editing or creating new
        let defaultClass = "A";
        let defaultNexus = 1;

        let defaultStageValue = availableStages.length > 0 ? availableStages[0].stage : '';

        if (editIndex < 0 && availableStages.length > 0) {
            try {
                const driveClasses = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                const preferredStages = ['Modified', 'Improved', 'Standard', 'Basic', 'Early', 'Prototype', 'Experimental'];

                let orderedStages = [];
                for (const p of preferredStages) {
                    const s = availableStages.find(x => x.stage === p);
                    if (s) orderedStages.push(s);
                }
                for (const s of availableStages) {
                    // Append any other available stages not in the preferred list
                    if (!orderedStages.includes(s)) orderedStages.push(s);
                }

                let foundViable = false;
                for (const stage of orderedStages) {
                    for (const dClass of driveClasses) {
                        const tempDrive = ShipHelper.buildDrive(stage.stage, 1, dClass, driveType, defaultTL);
                        const perf = ShipHelper.getDrivePerformance(tempDrive, this.ship.tonnage).potential;
                        if (perf >= 1) {
                            defaultClass = dClass;
                            defaultStageValue = stage.stage;
                            foundViable = true;
                            break;
                        }
                    }
                    if (foundViable) break;
                }

                if (!foundViable) {
                    // Fallback if no class can give 1 performance (e.g. ship too big for class Z)
                    defaultClass = "A";
                    defaultStageValue = orderedStages[0].stage;
                }

            } catch (err) {
                console.error("Error determining default drive:", err);
            }
        }

        if (editIndex >= 0) {
            const existingDrive = this.ship.drives[editIndex];
            defaultClass = existingDrive.driveClass.replace(/\d+$/, ''); // Strip nexus from class
            defaultStageValue = existingDrive.stage;
            defaultTL = existingDrive.tl;

            // TL might be different for an imported drive, so we must re-calculate available stages
            availableStages = ShipHelper.getAvailableTechStages(defaultTL, driveType);

            // Re-derive the Nexus Multiplier by comparing with base tonnage EP
            const nexusMatch = existingDrive.driveClass.match(/\d+$/);
            defaultNexus = nexusMatch ? parseInt(nexusMatch[0]) : 1;
        }

        const driveClasses = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        for (const key of driveClasses) {
            const isSelected = key === defaultClass ? 'selected' : '';
            classOptions += `<option value="${key}" ${isSelected}>${key} (EP: ${ShipHelper.ENUM_DRIVE_CLASS[key].ep})</option>`;
        }

        let stageOptions = '';
        availableStages.forEach(stage => {
            const isSelected = stage.stage === defaultStageValue ? 'selected' : '';
            stageOptions += `<option value="${stage.stage}" ${isSelected}>${stage.name}</option>`;
        });

        const content = `
            <div style="margin-bottom: 15px;">
                <label>Drive Class:</label>
                <select id="dialog-drive-class">${classOptions}</select>
            </div>
            <div style="margin-bottom: 15px;">
                <label>Tech Stage:</label>
                <select id="dialog-tech-stage">${stageOptions}</select>
            </div>
            <div style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <label style="margin-bottom: 0;">Tech Level:</label>
                <input type="number" id="dialog-tl" value="${defaultTL}" min="0" max="33" style="width: 50px;">
                <label style="margin-bottom: 0; margin-left: auto; display: flex; align-items: center; gap: 5px;">
                    <input type="checkbox" id="dialog-import-fee" ${(editIndex >= 0 && this.ship.drives[editIndex].importFee) || (editIndex < 0 && defaultTL > this.ship.baseTL) ? 'checked' : ''}>
                    Import Fee (10%)
                </label>
            </div>
            <div style="margin-bottom: 15px;">
                <label>Nexus Multiplier:</label>
                <input type="number" id="dialog-nexus" value="${defaultNexus}" min="1" max="9" style="width: 50px;">
            </div>
            <div style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <label style="margin-bottom: 0;">Desired Output:</label>
                <input type="range" id="dialog-perf-limit" min="0" max="99" value="${editIndex >= 0 && this.ship.drives[editIndex].performanceLimit !== undefined ? this.ship.drives[editIndex].performanceLimit : 99}" step="1" style="flex-grow: 1;">
                <span id="dialog-perf-limit-val" style="min-width: 50px; text-align: right;">Max</span>
            </div>
            <div id="drive-preview" class="drive-preview-box">
                <!-- Preview updates here -->
            </div>
        `;

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';

        let includeFuelHtml = '';
        const nonFuelDrives = ["M-Drive", "G-Drive", "Rocket", "Collector", "NAFAL", "Anti-Matter"];
        if (editIndex < 0 && !nonFuelDrives.includes(driveType)) {
            includeFuelHtml = `
                <label style="display: flex; align-items: center; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" id="dialog-include-fuel" checked> Include Linked Fuel
                </label>
            `;
        }

        this.showDialog(`${titlePrefix} ${driveType}`, content, () => {
            const driveClass = document.getElementById('dialog-drive-class').value;
            const techStage = document.getElementById('dialog-tech-stage').value;
            const tl = parseInt(document.getElementById('dialog-tl').value, 10);
            const nexus = parseInt(document.getElementById('dialog-nexus').value, 10);
            const perfSlider = document.getElementById('dialog-perf-limit');
            const importFee = document.getElementById('dialog-import-fee').checked;

            try {
                const drive = ShipHelper.buildDrive(techStage, nexus, driveClass, driveType, tl, importFee);
                const rawPerf = ShipHelper.getDrivePerformance(drive, this.ship.tonnage);

                if (perfSlider) {
                    const limit = parseInt(perfSlider.value, 10);
                    if (limit < rawPerf.potential) {
                        drive.performanceLimit = limit;
                    }
                }

                if (editIndex >= 0) {
                    this.ship.updateDrive(editIndex, drive);
                } else {
                    this.ship.addDrive(drive);

                    // Auto-link a minimal fuel tank if the drive consumes fuel
                    const fuelTons = rawPerf.fuelConsumption;

                    const includeFuelEl = document.getElementById('dialog-include-fuel');
                    const shouldIncludeFuel = includeFuelEl ? includeFuelEl.checked : false;

                    // Automatically linking the tank is handled exclusively on new drive creation
                    if (shouldIncludeFuel && fuelTons && fuelTons > 0 && editIndex < 0) {
                        let shortDrive = drive.driveType.replace(/Drive/i, '').trim();
                        if (shortDrive === 'PowerPlant' || shortDrive === 'Power Plant') shortDrive = 'Power Plant';

                        let compName = 'Fuel Tank';
                        let compTons = fuelTons;
                        let compCost = 0;
                        if (shortDrive === 'Fission') {
                            compName = 'Fuel Rods';
                            // fuelTons is actually the number of rods required per 10 years.
                            const numRods = Math.max(10, Math.ceil(fuelTons / 10) * 10);
                            compTons = numRods / 200;
                            compCost = (numRods / 10) * 0.4;
                        }

                        const fuelComp = {
                            isGeneric: true,
                            name: compName,
                            label: `${shortDrive} Fuel`,
                            linkedDriveIndex: this.ship.drives.length - 1,
                            tons: compTons,
                            cost: compCost
                        };
                        this.ship.addComponent(fuelComp);
                    }
                }
                this.render();
            } catch (err) {
                alert(err.message);
            }
        }, includeFuelHtml);

        // Add listeners for live preview updates
        const updatePreview = () => {
            const driveClassSelect = document.getElementById('dialog-drive-class');
            const driveClass = driveClassSelect.value;
            const techStage = document.getElementById('dialog-tech-stage').value;
            const tl = parseInt(document.getElementById('dialog-tl').value, 10);
            const nexus = parseInt(document.getElementById('dialog-nexus').value, 10);
            const perfSlider = document.getElementById('dialog-perf-limit');
            const perfVal = document.getElementById('dialog-perf-limit-val');
            const importFee = document.getElementById('dialog-import-fee').checked;

            try {
                if (driveClassSelect && techStage) {
                    Array.from(driveClassSelect.options).forEach(opt => {
                        try {
                            const tempDrive = ShipHelper.buildDrive(techStage, nexus, opt.value, driveType, tl, importFee);
                            const perf = ShipHelper.getDrivePerformance(tempDrive, this.ship.tonnage);
                            opt.text = `${tempDrive.driveClass} (EP: ${Math.floor(tempDrive.ep)}, P=${perf.potential})`;
                        } catch (e) { }
                    });
                }

                const drivePreview = ShipHelper.buildDrive(techStage, nexus, driveClass, driveType, tl, importFee);
                const rawPerf = ShipHelper.getDrivePerformance(drivePreview, this.ship.tonnage);

                if (perfSlider) {
                    const oldMax = perfSlider.max ? parseInt(perfSlider.max, 10) : null;
                    perfSlider.max = rawPerf.potential;
                    let limit = parseInt(perfSlider.value, 10);

                    // If the maximum capacity just increased, snap the slider to the new maximum
                    if (oldMax !== null && rawPerf.potential > oldMax) {
                        limit = rawPerf.potential;
                        perfSlider.value = limit;
                    }

                    if (limit > rawPerf.potential) {
                        limit = rawPerf.potential;
                        perfSlider.value = limit;
                    }

                    if (limit >= rawPerf.potential) {
                        perfVal.textContent = 'Max (' + rawPerf.potential + ')';
                        drivePreview.performanceLimit = undefined;
                    } else {
                        perfVal.textContent = limit;
                        drivePreview.performanceLimit = limit;
                    }
                }

                const perf = ShipHelper.getDrivePerformance(drivePreview, this.ship.tonnage);
                const mechanisms = Math.ceil(drivePreview.tons / 35);

                const baseIntroTL = ShipHelper.getBaseDriveIntroTL(driveType, perf.potential);
                const stageDef = ShipHelper.ENUM_DRIVE_STAGE[techStage];
                const stageMod = stageDef ? stageDef.mod : 0;
                const formulaStr = `${driveType}-${perf.potential} Base Intro TL ${baseIntroTL} + ${techStage} Stage [${stageMod >= 0 ? '+' : ''}${stageMod}]`;

                document.getElementById('drive-preview').innerHTML = `
                    <div class="preview-title">Preview:</div>
                    ${ShipHelperView.formatTLStatus(drivePreview.tl, this.ship.baseTL, formulaStr)}
                    <div class="preview-stat">Cost: MCr${drivePreview.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                    <div class="preview-stat">Tonnage: ${drivePreview.tons.toLocaleString()} tons</div>
                    <div class="preview-stat">Mechanisms: ${mechanisms}</div>
                    <div class="preview-stat">Performance: ${perf.potential.toLocaleString()}</div>
                    <div class="preview-stat">Fuel Consumption: ${perf.note}</div>
                `;
            } catch (err) {
                document.getElementById('drive-preview').innerHTML = `<span style="color:var(--accent-purple)">Error: ${err.message}</span>`;
            }
        };

        const syncDriveTL = () => {
            const driveClass = document.getElementById('dialog-drive-class').value;
            const techStage = document.getElementById('dialog-tech-stage').value;
            const nexus = parseInt(document.getElementById('dialog-nexus').value, 10) || 1;
            try {
                const stageDef = ShipHelper.ENUM_DRIVE_STAGE[techStage];
                const stageMod = stageDef ? stageDef.mod : 0;
                const tempDrive = ShipHelper.buildDrive(techStage, nexus, driveClass, driveType, parseInt(document.getElementById('dialog-tl').value, 10) || this.ship.baseTL);
                const rawPerf = ShipHelper.getDrivePerformance(tempDrive, this.ship.tonnage);
                const baseIntroTL = ShipHelper.getBaseDriveIntroTL(driveType, rawPerf.potential);
                const calcTL = Math.max(0, baseIntroTL + stageMod);
                document.getElementById('dialog-tl').value = calcTL;
                document.getElementById('dialog-import-fee').checked = (calcTL > this.ship.baseTL);
            } catch (e) { }
            updatePreview();
        };

        document.getElementById('dialog-drive-class').addEventListener('change', syncDriveTL);
        document.getElementById('dialog-tech-stage').addEventListener('change', syncDriveTL);
        document.getElementById('dialog-perf-limit').addEventListener('input', updatePreview);
        document.getElementById('dialog-import-fee').addEventListener('change', updatePreview);
        document.getElementById('dialog-tl').addEventListener('input', () => {
            const tl = parseInt(document.getElementById('dialog-tl').value, 10) || 0;
            document.getElementById('dialog-import-fee').checked = (tl > this.ship.baseTL);

            const availableStages = ShipHelper.getAvailableTechStages(tl, driveType);
            const stageSelect = document.getElementById('dialog-tech-stage');

            const currentStage = stageSelect.value;
            let stageOptions = '';
            let stageFound = false;

            if (availableStages.length === 0) {
                stageOptions = '<option value="">No tech available</option>';
            } else {
                availableStages.forEach(stage => {
                    stageOptions += `<option value="${stage.stage}">${stage.name}</option>`;
                    if (stage.stage === currentStage) {
                        stageFound = true;
                    }
                });
            }

            stageSelect.innerHTML = stageOptions;
            if (stageFound) {
                stageSelect.value = currentStage;
            }

            updatePreview();
        });
        document.getElementById('dialog-nexus').addEventListener('change', syncDriveTL);

        updatePreview();
    }

    openGenericDialog(componentType, editIndex = -1) {
        const isRods = componentType === 'Fuel Rods';
        let defaultValue = isRods ? 10 : 10;
        let defaultLabel = '';
        let defaultLinkedIndex = -1;

        if (editIndex >= 0) {
            const target = this.ship.getComponentByIdx(editIndex);
            if (target) {
                const currentTons = target.component.tons;
                defaultValue = isRods ? Math.round(currentTons * 200) : currentTons;
                defaultLabel = target.component.label || '';
                if (target.component.linkedDriveIndex !== undefined) {
                    defaultLinkedIndex = target.component.linkedDriveIndex;
                }
            }
        }

        let linkHTML = '';
        const validDrivesMap = {
            'Fuel Tank': ["Power Plant", "Jump", "Hop", "Skip", "HEPlaR"],
            'Fuel Rods': ["Fission"]
        };
        const validDrives = validDrivesMap[componentType];
        if (validDrives) {
            let options = '<option value="-1">None</option>';
            this.ship.drives.forEach((d, idx) => {
                if (validDrives.includes(d.driveType)) {
                    const sel = (idx === defaultLinkedIndex) ? 'selected' : '';
                    options += `<option value="${idx}" ${sel}>${d.driveType} (Class ${d.driveClass})</option>`;
                }
            });
            linkHTML = `
                <div style="margin-bottom: 15px;">
                    <label>Linked To:</label>
                    <select id="dialog-generic-link">${options}</select>
                </div>
            `;
        }
        const inputLabel = isRods ? 'Rods (increments of 10):' : (componentType === 'Grapple' ? 'Grapples in Set:' : 'Tonnage:');
        const stepVal = isRods ? 10 : 1;
        const minVal = isRods ? 10 : 1;

        const content = `
            <div style="margin-bottom: 15px;">
                <label>Custom Label:</label>
                <input type="text" id="dialog-generic-label" value="${defaultLabel}" placeholder="(Optional)" style="width: 150px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>${inputLabel}</label>
                <div>
                    <button type="button" class="tons-btn" data-val="${-100 * stepVal}">-${100 * stepVal}</button>
                    <button type="button" class="tons-btn" data-val="${-10 * stepVal}">-${10 * stepVal}</button>
                    <input type="number" id="dialog-generic-tons" value="${defaultValue}" min="${minVal}" step="${stepVal}" style="width: 80px; display:inline-block; margin: 0 5px;">
                    <button type="button" class="tons-btn" data-val="${10 * stepVal}">+${10 * stepVal}</button>
                    <button type="button" class="tons-btn" data-val="${100 * stepVal}">+${100 * stepVal}</button>
                </div>
            </div>
            ${linkHTML}
            <div id="generic-preview" class="drive-preview-box">
                <!-- Preview updates here -->
            </div>
        `;

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} ${componentType}`, content, () => {
            const tonsInput = document.getElementById('dialog-generic-tons');
            const labelInput = document.getElementById('dialog-generic-label');
            const linkInput = document.getElementById('dialog-generic-link');

            if (tonsInput) {
                let inputVal = parseFloat(tonsInput.value);
                if (isRods) inputVal = Math.max(10, Math.floor(inputVal / 10) * 10);
                const customLabel = labelInput ? labelInput.value.trim() : '';
                const linkedIdx = linkInput ? parseInt(linkInput.value, 10) : -1;

                const tons = isRods ? inputVal / 200 : inputVal;
                const cost = isRods ? (inputVal / 10) * 0.4 : 0;

                if (inputVal > 0) {
                    const comp = {
                        isGeneric: true,
                        name: componentType,
                        label: customLabel,
                        linkedDriveIndex: linkedIdx >= 0 ? linkedIdx : undefined,
                        tons: tons,
                        cost: cost
                    };
                    if (editIndex >= 0) {
                        this.ship.updateComponent(editIndex, comp);
                    } else {
                        this.ship.addComponent(comp);
                    }
                    this.render();
                }
            }
        });

        const updatePreview = () => {
            const tonsInput = document.getElementById('dialog-generic-tons');
            const linkInput = document.getElementById('dialog-generic-link');

            if (tonsInput) {
                let inputVal = parseFloat(tonsInput.value) || 0;
                if (isRods) inputVal = Math.max(10, Math.floor(inputVal / 10) * 10);
                const tons = isRods ? inputVal / 200 : inputVal;
                const cost = isRods ? (inputVal / 10) * 0.4 : 0;
                let linkedPerfStr = '';

                if (linkInput) {
                    const linkedIdx = parseInt(linkInput.value, 10);
                    if (linkedIdx >= 0 && this.ship.drives[linkedIdx]) {
                        const linkedDrive = this.ship.drives[linkedIdx];
                        const drivePerf = ShipHelper.getDrivePerformance(linkedDrive, this.ship.tonnage);
                        let requiredFuelPerUnit = drivePerf.minConsumption || drivePerf.fuelConsumption || 0;
                        if (linkedDrive.driveType === "Power Plant" || linkedDrive.driveType === "Fission") {
                            requiredFuelPerUnit = drivePerf.fuelConsumption || 0;
                        }

                        if (requiredFuelPerUnit > 0) {
                            // Calculate how many units this tank supports based on the linked drive's consumption per unit
                            const amountAvailable = isRods ? inputVal : tons;
                            const unitsSupported = Math.floor((amountAvailable / requiredFuelPerUnit) * 10) / 10;
                            let unitName = "uses";
                            let itemName = " (" + linkedDrive.driveType + ")";
                            if (linkedDrive.driveType === "Power Plant") {
                                unitName = "month operations";
                                itemName = " (Power Plant)";
                            } else if (linkedDrive.driveType === "Fission") {
                                unitName = "decades operations";
                                itemName = " (Fission)";
                            }
                            else if (linkedDrive.driveType === "Jump") { unitName = "Parsecs"; itemName = ""; }
                            else if (linkedDrive.driveType === "Hop") { unitName = "hops"; itemName = ""; }
                            else if (linkedDrive.driveType === "Skip") { unitName = "skips"; itemName = ""; }
                            else if (linkedDrive.driveType === "HEPlaR") { unitName = "burns"; itemName = ""; }

                            linkedPerfStr = `<div class="preview-stat" style="color:var(--accent-cyan)">Supports: ${unitsSupported} ${unitName}${itemName}</div>`;
                        } else {
                            linkedPerfStr = `<div class="preview-stat" style="color:#aaa">Drive consumes no fuel per unit.</div>`;
                        }
                    }
                }

                let mechanismsHtml = '';
                if (componentType === 'Grapple') {
                    mechanismsHtml = `<div class="preview-stat">Mechanisms: 1</div>`;
                }

                document.getElementById('generic-preview').innerHTML = `
                    <div class="preview-title">Preview:</div>
                    <div class="preview-stat">Cost: MCr${cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                    ${isRods ? `<div class="preview-stat">${inputLabel} ${inputVal.toLocaleString()}</div>` : ''}
                    <div class="preview-stat">Tonnage: ${tons.toLocaleString()} tons</div>
                    ${mechanismsHtml}
                    ${linkedPerfStr}
                `;
            }
        };

        const tInput = document.getElementById('dialog-generic-tons');
        // Small delay to ensure the dialog is fully rendered
        setTimeout(() => {
            const inputEl = document.getElementById('dialog-generic-tons');
            const linkEl = document.getElementById('dialog-generic-link');
            const stepBtns = document.querySelectorAll('.tons-btn');

            if (inputEl) {
                inputEl.addEventListener('input', updatePreview);
                inputEl.addEventListener('change', updatePreview);

                stepBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const valChange = parseInt(e.target.getAttribute('data-val'), 10);
                        let current = parseFloat(inputEl.value) || 0;
                        current += valChange;
                        if (current < 1) current = 1;
                        inputEl.value = current;
                        updatePreview();
                    });
                });
            }
            if (linkEl) {
                linkEl.addEventListener('change', updatePreview);
            }
            updatePreview();
        }, 10);
    }

    openHullDialog(hullType, editIndex = -1) {
        let isPod = hullType === 'Pod';

        let defaultTons = isPod ? 10 : 100;
        let defaultTL = this.ship.baseTL;
        let defaultConfig = 'Unstreamlined';
        let defaultName = hullType;

        if (editIndex >= 0) {
            const h = this.ship.subhulls[editIndex];
            isPod = h.isPod;
            defaultTons = h.tons;
            defaultTL = h.tl;
            defaultConfig = h.config;
            defaultName = h.name;
        }

        const minTons = isPod ? 10 : 100;
        const maxTons = isPod ? 90 : 999999;
        const disabledMax = isPod ? 'max="90"' : '';

        let configs = ["Cluster", "Braced", "Planetoid", "Unstreamlined", "Streamlined", "Airframe", "Lifting Body"];
        if (isPod) {
            configs = configs.filter(c => c !== "Airframe");
        }
        const configOptions = configs.map(c => `<option value="${c}" ${c === defaultConfig ? 'selected' : ''}>${c}</option>`).join('');

        let defaultArmorType = editIndex >= 0 ? this.ship.subhulls[editIndex].armorType : null;
        let defaultArmorLayers = editIndex >= 0 ? this.ship.subhulls[editIndex].armorLayers : 1;
        let defaultImportFee = editIndex >= 0 ? this.ship.subhulls[editIndex].importFee : (defaultTL !== this.ship.baseTL);

        const content = `
            <div style="margin-bottom: 15px;">
                <label>Name:</label>
                <input type="text" id="dialog-hull-name" value="${defaultName}" style="width: 150px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Tech Level:</label>
                <input type="number" id="dialog-hull-tl" value="${defaultTL}" min="0" max="33" style="width: 50px;">
                <label style="display: inline-flex; align-items: center; cursor: pointer; color: var(--text-main); margin-left:15px; font-size:14px;">
                    <input type="checkbox" id="dialog-hull-import" ${defaultImportFee ? 'checked' : ''}> Import Fee (10%)
                </label>
            </div>
            <div style="margin-bottom: 15px;">
                <label>Configuration:</label>
                <select id="dialog-hull-config">
                    ${configOptions}
                </select>
            </div>
            <div style="margin-bottom: 15px;">
                <label>Armor Type:</label>
                <select id="dialog-hull-armor"></select>
            </div>
             <div style="margin-bottom: 15px;">
                <label>Armor Layers:</label>
                <input type="number" id="dialog-hull-armor-layers" value="${defaultArmorLayers}" min="1" max="99" style="width: 50px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Tonnage:</label>
                <div>
                     <button type="button" class="tons-btn" data-val="-100">-100</button>
                     <button type="button" class="tons-btn" data-val="-10">-10</button>
                     <input type="number" id="dialog-hull-tons" value="${defaultTons}" min="${minTons}" ${disabledMax} step="10" style="width: 80px; display:inline-block; margin: 0 5px;">
                     <button type="button" class="tons-btn" data-val="10">+10</button>
                     <button type="button" class="tons-btn" data-val="100">+100</button>
                </div>
            </div>
            <div id="hull-preview" class="drive-preview-box"></div>
        `;

        const titlePrefix = editIndex >= 0 ? 'Edit' : 'Add';
        this.showDialog(`${titlePrefix} ${hullType}`, content, () => {
            const hName = document.getElementById('dialog-hull-name').value;
            const hTL = parseInt(document.getElementById('dialog-hull-tl').value, 10);
            const hConfig = document.getElementById('dialog-hull-config').value;
            const hTons = parseInt(document.getElementById('dialog-hull-tons').value, 10);
            const hArmorType = document.getElementById('dialog-hull-armor').value;
            const hArmorLayers = parseInt(document.getElementById('dialog-hull-armor-layers').value, 10);
            const hImport = document.getElementById('dialog-hull-import').checked;

            if (editIndex >= 0) {
                const result = this.ship.updateSubhull(editIndex, hName, hTons, hTL, hConfig, hArmorType, hArmorLayers, hImport);
                if (result && result.removedManualFittingNames && result.removedManualFittingNames.length > 0) {
                    this.showNotificationBanner(
                        `Hull config change: The following incompatible fittings were automatically removed — ${result.removedManualFittingNames.join(', ')}`
                    );
                }
            } else {
                this.ship.addSubhull(hName, hTons, hTL, hConfig, isPod, hArmorType, hArmorLayers, hImport);
            }
            this.render();
        });

        setTimeout(() => {
            const inputEl = document.getElementById('dialog-hull-tons');
            const stepBtns = document.querySelectorAll('.tons-btn');
            const tlEl = document.getElementById('dialog-hull-tl');
            const importEl = document.getElementById('dialog-hull-import');
            const configEl = document.getElementById('dialog-hull-config');
            const armorEl = document.getElementById('dialog-hull-armor');
            const layersEl = document.getElementById('dialog-hull-armor-layers');

            const refreshArmorOptions = () => {
                const config = configEl.value;
                const currentArmor = armorEl.value || defaultArmorType;
                let validArmorTypeExists = false;

                armorEl.innerHTML = '';
                for (const key of Object.keys(ShipHelper.ENUM_HULL_ARMOR)) {
                    const type = ShipHelper.ENUM_HULL_ARMOR[key];
                    if (type.configurations.includes(config)) {
                        const opt = document.createElement('option');
                        opt.value = type.type;
                        opt.textContent = type.type;
                        if (type.type === currentArmor || (!currentArmor && type.type === "Plate")) {
                            opt.selected = true;
                            validArmorTypeExists = true;
                        }
                        armorEl.appendChild(opt);
                    }
                }

                if (!validArmorTypeExists && armorEl.options.length > 0) {
                    armorEl.options[0].selected = true;
                }
            };

            if (armorEl) {
                refreshArmorOptions();
            }

            const updatePreview = () => {
                const tons = parseInt(inputEl.value, 10) || 0;
                const config = configEl.value;
                const isImport = importEl.checked;
                const aType = armorEl.value;
                const aLayers = parseInt(layersEl.value, 10) || 1;
                const aTL = parseInt(tlEl.value, 10) || 12;

                let cost = 0;
                if (ShipHelper.ENUM_HULL_CONFIG[config]) {
                    const flat = isPod ? ShipHelper.ENUM_HULL_CONFIG[config].podflatcost : ShipHelper.ENUM_HULL_CONFIG[config].flatcost;
                    cost = tons * ShipHelper.ENUM_HULL_CONFIG[config].cost + flat;
                    if (isImport) cost *= 1.1;
                }

                let armorTonsText = "";
                let avText = "";
                if (ShipHelper.ENUM_HULL_ARMOR[aType]) {
                    const aDef = ShipHelper.ENUM_HULL_ARMOR[aType];
                    const aTons = Math.max(0, (aLayers - 1) * 0.04 * tons * aDef.ton_Mult);
                    const AV = (aTL * aDef.AV_Mult) + aDef.AV_FlatBonus;
                    avText = `<div class="preview-stat">Armor: AV ${AV} (Layers: ${aLayers})</div>`;
                    if (aTons > 0) {
                        armorTonsText = `<div class="preview-stat">Armor Payload: ${aTons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>`;
                    }
                }

                let grappleText = "";
                if (this.ship.subhulls.length > 0 && editIndex === -1) {
                    const activeHull = this.ship.selectedSubhullIndex >= 0 ? this.ship.subhulls[this.ship.selectedSubhullIndex] : this.ship.subhulls[0];
                    const smallerTons = Math.min(tons, activeHull.tons);
                    const numGrapples = Math.max(1, Math.floor(smallerTons / 35));
                    grappleText = `<div class="preview-stat">Auto-Grapples: ${numGrapples} sets (Consumes ${numGrapples * 2} tons total across both hulls)</div>`;
                }

                const previewEl = document.getElementById('hull-preview');
                if (previewEl) {
                    previewEl.innerHTML = `
                        <div class="preview-title">Preview:</div>
                        <div class="preview-stat">Cost: MCr${cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                        <div class="preview-stat">Tonnage: ${tons} tons</div>
                        ${avText}
                        ${armorTonsText}
                        ${grappleText}
                    `;
                }
            };

            if (tlEl && importEl) {
                tlEl.addEventListener('change', () => {
                    importEl.checked = parseInt(tlEl.value, 10) !== this.ship.baseTL;
                    updatePreview();
                });
                importEl.addEventListener('change', updatePreview);
            }
            if (configEl) {
                configEl.addEventListener('change', () => {
                    refreshArmorOptions();
                    updatePreview();
                });
            }
            if (armorEl) {
                armorEl.addEventListener('change', updatePreview);
            }
            if (layersEl) {
                layersEl.addEventListener('input', updatePreview);
                layersEl.addEventListener('change', updatePreview);
            }

            if (inputEl) {
                inputEl.addEventListener('input', updatePreview);
                inputEl.addEventListener('change', updatePreview);

                stepBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const valChange = parseInt(e.target.getAttribute('data-val'), 10);
                        let current = parseFloat(inputEl.value) || 0;
                        current += valChange;
                        if (current < minTons) current = minTons;
                        if (hullType === 'Pod' && current > maxTons) current = maxTons;
                        inputEl.value = current;
                        updatePreview();
                    });
                });
            }
            updatePreview();
        }, 10);
    }

    openMissionCodeDialog() {
        const missionList = ShipHelper.ENUM_MISSION_LIST || [];
        const modifierOptions = ShipHelper.ENUM_MODIFIER_WORD_OPTIONS || [];
        const modifierList = ShipHelper.ENUM_MODIFIERS_LIST || [];

        const currentService = this.ship.missionService || "Commerce";
        const currentActivity = this.ship.missionActivity !== undefined ? this.ship.missionActivity : "Merchant";
        const currentType = this.ship.missionType !== undefined ? this.ship.missionType : "UnScheduled";
        const currentQualifier = this.ship.missionQualifier !== undefined ? this.ship.missionQualifier : "Cargo";
        const currentMissionId = this.ship.missionId || 23;
        const currentMod1 = this.ship.modifier1Word || "Far";
        const currentMod2 = this.ship.modifier2Word || "";

        const services = [...new Set(missionList.map(m => m.service))];

        const content = `
            <div class="dialog-field">
                <label>Vessel Name:</label>
                <input type="text" id="mission-ship-name" value="${this.ship.shipName || 'Starship'}" style="width: 100%;">
            </div>
            <div class="dialog-field">
                <label>Registration Number:</label>
                <input type="text" id="mission-registration" value="${this.ship.registration || 'REG-0101'}" style="width: 100%;">
            </div>

            <div style="margin-top: 14px; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 4px;">
                <div style="font-weight: bold; color: var(--accent-cyan); margin-bottom: 8px; font-size: 0.95em;">1. Primary Mission Hierarchy (Narrowing Selection):</div>
                <div class="dialog-row-split" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="dialog-field">
                        <label>A. Service:</label>
                        <select id="mission-service" style="width: 100%;">
                            ${services.map(s => `<option value="${s}" ${s === currentService ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                    </div>
                    <div class="dialog-field">
                        <label>B. Activity:</label>
                        <select id="mission-activity" style="width: 100%;"></select>
                    </div>
                </div>

                <div class="dialog-row-split" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
                    <div class="dialog-field">
                        <label>C. Type:</label>
                        <select id="mission-type" style="width: 100%;"></select>
                    </div>
                    <div class="dialog-field">
                        <label>D. Qualifier:</label>
                        <select id="mission-qualifier" style="width: 100%;"></select>
                    </div>
                </div>

                <div class="dialog-field" style="margin-top: 8px;">
                    <label>E. Mission & Classification Code:</label>
                    <select id="mission-entry" style="width: 100%; font-weight: bold; color: var(--accent-cyan);"></select>
                </div>
            </div>

            <div style="margin-top: 12px; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 4px;">
                <div style="font-weight: bold; color: var(--accent-cyan); margin-bottom: 8px; font-size: 0.95em;">2. Mission Modifiers (Up to Two):</div>
                <div class="dialog-row-split" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="dialog-field">
                        <label>Modifier 1:</label>
                        <select id="mission-mod1" style="width: 100%;">
                            <option value="">(None)</option>
                            ${modifierOptions.map(opt => `<option value="${opt.word}" data-code="${opt.code}" ${opt.word === currentMod1 ? 'selected' : ''}>${opt.label}</option>`).join('')}
                        </select>
                    </div>
                    <div class="dialog-field">
                        <label>Modifier 2:</label>
                        <select id="mission-mod2" style="width: 100%;">
                            <option value="">(None)</option>
                            ${modifierOptions.map(opt => `<option value="${opt.word}" data-code="${opt.code}" ${opt.word === currentMod2 ? 'selected' : ''}>${opt.label}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <div class="dialog-preview-box" id="mission-preview-box" style="margin-top: 15px; padding: 12px; background: rgba(0, 229, 255, 0.08); border: 1px solid var(--accent-cyan); border-radius: 4px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight: bold; color: var(--accent-cyan); font-size: 1.15em;" id="mission-preview-code">Code: ${this.ship.missionCode}</div>
                    <div style="font-weight: bold; color: var(--text-main); font-size: 1.05em;" id="mission-preview-title">${this.ship.missionFullTitle}</div>
                </div>
                <div style="color: var(--text-muted); font-size: 0.85em; margin-top: 6px;" id="mission-preview-desc">Hierarchy: ${this.ship.missionService} > ${this.ship.missionActivity || 'None'} > ${this.ship.missionType || 'None'} > ${this.ship.missionName}</div>
            </div>
        `;

        this.showDialog("Configure Mission Classification & Modifiers", content, () => {
            const shipName = document.getElementById('mission-ship-name').value.trim() || 'Starship';
            const registration = document.getElementById('mission-registration').value.trim() || 'REG-0101';
            const missionId = parseInt(document.getElementById('mission-entry').value, 10);
            const mObj = missionList.find(m => m.id === missionId) || missionList[22];

            const mod1Select = document.getElementById('mission-mod1');
            const mod2Select = document.getElementById('mission-mod2');
            const mod1Word = mod1Select.value;
            const mod1Code = mod1Select.selectedOptions[0]?.getAttribute('data-code') || (mod1Word ? (modifierList.find(m => m.words.includes(mod1Word))?.code || '') : '');
            const mod2Word = mod2Select.value;
            const mod2Code = mod2Select.selectedOptions[0]?.getAttribute('data-code') || (mod2Word ? (modifierList.find(m => m.words.includes(mod2Word))?.code || '') : '');

            this.ship.shipName = shipName;
            this.ship.registration = registration;
            this.ship.missionId = mObj.id;
            this.ship.missionService = mObj.service;
            this.ship.missionActivity = mObj.activity;
            this.ship.missionType = mObj.type;
            this.ship.missionQualifier = mObj.qualifier;
            this.ship.missionName = mObj.mission;
            this.ship.missionCodeKey = mObj.code;
            this.ship.modifier1Word = mod1Word;
            this.ship.modifier1Code = mod1Code;
            this.ship.modifier2Word = mod2Word;
            this.ship.modifier2Code = mod2Code;

            this.render();
        });

        setTimeout(() => {
            const elService = document.getElementById('mission-service');
            const elActivity = document.getElementById('mission-activity');
            const elType = document.getElementById('mission-type');
            const elQualifier = document.getElementById('mission-qualifier');
            const elEntry = document.getElementById('mission-entry');
            const elMod1 = document.getElementById('mission-mod1');
            const elMod2 = document.getElementById('mission-mod2');

            const populateActivities = (preserveVal) => {
                const s = elService.value;
                const matches = missionList.filter(m => m.service === s);
                const acts = [...new Set(matches.map(m => m.activity))];
                elActivity.innerHTML = acts.map(a => `<option value="${a}" ${a === preserveVal ? 'selected' : ''}>${a === '' ? '(Direct / None)' : a}</option>`).join('');
                if (!acts.includes(elActivity.value)) elActivity.value = acts[0];
                populateTypes(preserveVal === currentActivity ? currentType : undefined);
            };

            const populateTypes = (preserveVal) => {
                const s = elService.value;
                const a = elActivity.value;
                const matches = missionList.filter(m => m.service === s && m.activity === a);
                const types = [...new Set(matches.map(m => m.type))];
                elType.innerHTML = types.map(t => `<option value="${t}" ${t === preserveVal ? 'selected' : ''}>${t === '' ? '(Direct / None)' : t}</option>`).join('');
                if (!types.includes(elType.value)) elType.value = types[0];
                populateQualifiers(preserveVal === currentType ? currentQualifier : undefined);
            };

            const populateQualifiers = (preserveVal) => {
                const s = elService.value;
                const a = elActivity.value;
                const t = elType.value;
                const matches = missionList.filter(m => m.service === s && m.activity === a && m.type === t);
                const quals = [...new Set(matches.map(m => m.qualifier))];
                elQualifier.innerHTML = quals.map(q => `<option value="${q}" ${q === preserveVal ? 'selected' : ''}>${q === '' ? '(Direct / None)' : q}</option>`).join('');
                if (!quals.includes(elQualifier.value)) elQualifier.value = quals[0];
                populateEntries(preserveVal === currentQualifier ? currentMissionId : undefined);
            };

            const populateEntries = (preserveId) => {
                const s = elService.value;
                const a = elActivity.value;
                const t = elType.value;
                const q = elQualifier.value;
                const matches = missionList.filter(m => m.service === s && m.activity === a && m.type === t && m.qualifier === q);
                elEntry.innerHTML = matches.map(m => `<option value="${m.id}" ${m.id === preserveId ? 'selected' : ''}>${m.mission} [Code: ${m.code}]</option>`).join('');
                if (preserveId && matches.some(m => m.id === preserveId)) {
                    elEntry.value = preserveId;
                } else if (matches.length > 0) {
                    elEntry.value = matches[0].id;
                }
                updatePreview();
            };

            const updatePreview = () => {
                const mId = parseInt(elEntry.value, 10);
                const mObj = missionList.find(m => m.id === mId) || missionList[22];

                const mod1Word = elMod1.value;
                const mod1Code = elMod1.selectedOptions[0]?.getAttribute('data-code') || (mod1Word ? (modifierList.find(m => m.words.includes(mod1Word))?.code || '') : '');
                const mod2Word = elMod2.value;
                const mod2Code = elMod2.selectedOptions[0]?.getAttribute('data-code') || (mod2Word ? (modifierList.find(m => m.words.includes(mod2Word))?.code || '') : '');

                const code = `${mObj.code}${mod1Code}${mod2Code}`;
                const titleWords = [];
                if (mod1Word) titleWords.push(mod1Word);
                if (mod2Word && mod2Word !== mod1Word) titleWords.push(mod2Word);
                titleWords.push(mObj.mission);
                const title = titleWords.join(' ');

                const pCode = document.getElementById('mission-preview-code');
                const pTitle = document.getElementById('mission-preview-title');
                const pDesc = document.getElementById('mission-preview-desc');

                if (pCode) pCode.textContent = `Classification Code: ${code}`;
                if (pTitle) pTitle.textContent = title;
                if (pDesc) {
                    const actStr = mObj.activity ? ` > ${mObj.activity}` : '';
                    const typeStr = mObj.type ? ` > ${mObj.type}` : '';
                    const qualStr = mObj.qualifier ? ` > ${mObj.qualifier}` : '';
                    pDesc.textContent = `Hierarchy: ${mObj.service}${actStr}${typeStr}${qualStr} > ${mObj.mission} [${mObj.code}]`;
                }
            };

            elService.addEventListener('change', () => populateActivities());
            elActivity.addEventListener('change', () => populateTypes());
            elType.addEventListener('change', () => populateQualifiers());
            elQualifier.addEventListener('change', () => populateEntries());
            elEntry.addEventListener('change', updatePreview);
            elMod1.addEventListener('change', updatePreview);
            elMod2.addEventListener('change', updatePreview);

            // Initialize cascading state with current ship selection
            populateActivities(currentActivity);
            if (currentMissionId) {
                elEntry.value = currentMissionId;
            }
            updatePreview();
        }, 10);
    }

    openAstrogationDialog() {
        this.openJumpFieldsDialog();
    }

    openJumpFieldsDialog() {
        if (!this.ship.hasJumpDrive) {
            this.showNotificationBanner("⚠️ A Jump, Hop, or Skip Drive must be installed on the vessel before Jump Fields can be configured.");
            return;
        }

        const fields = ShipHelper.ENUM_JUMP_FIELDS;
        const currentField = this.ship.jumpFieldKey || 'Bubble';
        const currentEng = this.ship.engineerSkill !== undefined ? this.ship.engineerSkill : 0;
        const currentJD = this.ship.jumpDriveSpecialty !== undefined ? this.ship.jumpDriveSpecialty : 0;
        const currentDist = (this.ship.jumpDiameters !== null && this.ship.jumpDiameters !== undefined) ? this.ship.jumpDiameters : '';

        const jDrive = this.ship.drives.find(d => ['Jump', 'Hop', 'Skip'].includes(d.driveType));
        const jEff = jDrive ? (ShipHelper.ENUM_DRIVE_STAGE[jDrive.stage]?.eff || 1.0) : 1.0;
        const jEffPct = Math.round(jEff * 100);

        const content = `
            <div style="margin-bottom:12px; padding:8px 12px; background:rgba(0, 229, 255, 0.08); border:1px solid var(--accent-cyan); border-radius:4px; font-size:0.9em;">
                <strong>Installed Drive:</strong> ${jDrive ? `${jDrive.driveType} (${jDrive.stage || 'Standard'} Stage — Tech Efficiency: ${jEffPct}%)` : 'None'}
            </div>

            <div class="dialog-field">
                <label>Jump Field Type (Section 07 / Table 07G):</label>
                <select id="astro-jump-field" style="width: 100%;">
                    ${Object.keys(fields).map(k => `<option value="${k}" ${currentField === k ? 'selected' : ''}>${fields[k].name} — Strength: ${fields[k].strength}, Armor Mod: ${fields[k].armorMod}, Flash: ${fields[k].flash}</option>`).join('')}
                </select>
                <div style="font-size:0.85em; color:var(--text-muted); margin-top:4px;" id="astro-field-desc">${fields[currentField]?.comment || ''}</div>
            </div>

            <div class="dialog-row-split" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                <div class="dialog-field">
                    <label>Engineer Skill Rank (0–15):</label>
                    <input type="number" id="astro-eng-skill" value="${currentEng}" min="0" max="15" style="width: 100%;">
                </div>
                <div class="dialog-field">
                    <label>Jump Drives Specialty Rank (0–6):</label>
                    <input type="number" id="astro-jd-skill" value="${currentJD}" min="0" max="6" style="width: 100%;">
                </div>
            </div>

            <div class="dialog-row-split" style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                <div class="dialog-field">
                    <label>Initiation Distance (Diameters):</label>
                    <input type="number" id="astro-init-dist" value="${currentDist}" placeholder="Auto (Safe Distance D)" min="0" step="0.1" style="width: 100%;">
                    <div style="font-size:0.78em; color:var(--text-muted); margin-top:2px;">Leave blank to jump at Safe Distance (D).</div>
                </div>
                <div class="dialog-field">
                    <label>Gravity Well Flux (Mass Variance):</label>
                    <input type="number" id="astro-flux" value="0" min="0" max="10" step="0.5" style="width: 100%;">
                </div>
            </div>

            <div class="astrogation-card" style="margin-top: 15px;">
                <div style="font-weight: bold; color: var(--accent-cyan); font-size: 1.05em; margin-bottom: 6px;">Jump Field & Interference Simulation:</div>
                <div class="stat-row" style="display:flex; justify-content:space-between; font-size:0.9em; padding:3px 0;"><span class="stat-label">Field Strength:</span> <span class="stat-value" id="astro-s">100</span></div>
                <div class="stat-row" style="display:flex; justify-content:space-between; font-size:0.9em; padding:3px 0;"><span class="stat-label">Drive Efficiency (E):</span> <span class="stat-value" id="astro-e">1.0 (100%)</span></div>
                <div class="stat-row" style="display:flex; justify-content:space-between; font-size:0.9em; padding:3px 0;"><span class="stat-label">Total Engineer Skill:</span> <span class="stat-value" id="astro-total-skill">Skill 0</span></div>
                <div class="stat-row" style="display:flex; justify-content:space-between; font-size:0.9em; padding:3px 0;"><span class="stat-label">Safe Jump Distance (D):</span> <span class="stat-value good" id="astro-d">0 Diameters</span></div>
                <div class="stat-row" style="display:flex; justify-content:space-between; font-size:0.9em; padding:3px 0;"><span class="stat-label">Initiation Distance:</span> <span class="stat-value" id="astro-actual-dist">0 Diameters</span></div>
                <div class="stat-row" style="display:flex; justify-content:space-between; font-size:0.9em; padding:3px 0;"><span class="stat-label">Armor Modifier / Flash:</span> <span class="stat-value" id="astro-armor-flash">std / std</span></div>
                <div class="stat-row" style="display:flex; justify-content:space-between; font-size:0.9em; padding:3px 0;"><span class="stat-label">Interference & Misjump Risk (X):</span> <span class="stat-value good" id="astro-x">Nominal</span></div>
            </div>
        `;

        this.showDialog("Jump Fields & Physics (Table 07G)", content, () => {
            this.ship.jumpFieldKey = document.getElementById('astro-jump-field').value;
            this.ship.engineerSkill = parseInt(document.getElementById('astro-eng-skill').value, 10) || 0;
            this.ship.jumpDriveSpecialty = parseInt(document.getElementById('astro-jd-skill').value, 10) || 0;
            const distVal = document.getElementById('astro-init-dist').value;
            this.ship.jumpDiameters = distVal !== '' && !isNaN(parseFloat(distVal)) ? parseFloat(distVal) : null;
            this.render();
        });

        setTimeout(() => {
            const updateCalc = () => {
                const fieldKey = document.getElementById('astro-jump-field')?.value || 'Bubble';
                const engSkill = parseInt(document.getElementById('astro-eng-skill')?.value, 10) || 0;
                const jdSkill = parseInt(document.getElementById('astro-jd-skill')?.value, 10) || 0;
                const distVal = document.getElementById('astro-init-dist')?.value;
                const actualDist = (distVal !== '' && !isNaN(parseFloat(distVal))) ? parseFloat(distVal) : null;
                const flux = parseFloat(document.getElementById('astro-flux')?.value) || 0;

                const fDef = fields[fieldKey] || fields.Bubble;
                const fDesc = document.getElementById('astro-field-desc');
                if (fDesc) fDesc.textContent = fDef.comment;

                const oldField = this.ship.jumpFieldKey;
                this.ship.jumpFieldKey = fieldKey;
                const safe = this.ship.safeJumpDistance(engSkill, jdSkill);
                const intf = this.ship.jumpInterference(engSkill, jdSkill, actualDist, flux);
                this.ship.jumpFieldKey = oldField;

                const elS = document.getElementById('astro-s');
                if (elS) elS.textContent = `${safe.strength}`;
                const elE = document.getElementById('astro-e');
                if (elE) elE.textContent = `E = ${safe.E} (${Math.round(safe.E * 100)}%)`;
                const elTotalSkill = document.getElementById('astro-total-skill');
                if (elTotalSkill) elTotalSkill.textContent = `Engineer ${safe.engineerRank} + Jump Drives ${safe.jumpDriveSpecialty} = Skill ${safe.totalEngineerSkill}`;
                const elD = document.getElementById('astro-d');
                if (elD) elD.textContent = `D = ${safe.D} Planetary Diameters`;
                const elActualDist = document.getElementById('astro-actual-dist');
                if (elActualDist) elActualDist.textContent = `${intf.jumpDistance} Planetary Diameters`;
                const elArmorFlash = document.getElementById('astro-armor-flash');
                if (elArmorFlash) elArmorFlash.textContent = `Armor: ${safe.armorMod} | Flash: ${safe.flash}`;
                const elX = document.getElementById('astro-x');
                if (elX) {
                    elX.textContent = `X = ${intf.X} (${intf.misjumpRisk})`;
                    elX.className = `stat-value ${intf.riskClass}`;
                }
            };

            ['astro-jump-field', 'astro-eng-skill', 'astro-jd-skill', 'astro-init-dist', 'astro-flux'].forEach(id => {
                document.getElementById(id)?.addEventListener('input', updateCalc);
                document.getElementById(id)?.addEventListener('change', updateCalc);
            });
            updateCalc();
        }, 10);
    }

    openFillformModal() {
        const existing = document.getElementById('t5-fillform-modal');
        if (existing) existing.remove();

        const f1 = this.ship.getFillform1Data();
        const f2 = this.ship.getFillform2Data();
        const f3 = this.ship.getFillform3Data(this.currentStaffingModel || 'Merchant');
        const jf = f3.jumpFields;
        const mdText = this.ship.exportMarkdownFillform(this.currentStaffingModel || 'Merchant');

        const modal = document.createElement('div');
        modal.id = 't5-fillform-modal';
        modal.className = 'fillform-modal';
        modal.innerHTML = `
            <div class="fillform-dialog">
                <div class="fillform-header">
                    <div class="fillform-tabs">
                        <button type="button" class="fillform-tab-btn active" data-tab="tab-f1">Fillform 1: Overview & Drives</button>
                        <button type="button" class="fillform-tab-btn" data-tab="tab-f2">Fillform 2: Weapons & Systems</button>
                        <button type="button" class="fillform-tab-btn" data-tab="tab-f3">Fillform 3: Crew & Jump Fields</button>
                        <button type="button" class="fillform-tab-btn" data-tab="tab-md">Markdown Export</button>
                    </div>
                    <div class="fillform-toolbar-right">
                        <button type="button" class="cyan-btn" id="btn-print-sheet">🖨️ Print Sheets</button>
                        <button type="button" class="cyan-btn" id="btn-close-fillform">✕ Close</button>
                    </div>
                </div>
                <div class="fillform-body">
                    <!-- Page 1 -->
                    <div id="tab-f1" class="fillform-page active">
                        <div class="t5-sheet">
                            <div class="t5-sheet-header">
                                <div>
                                    <div class="t5-sheet-title">T5 Starship Construction Fillform 1</div>
                                    <div class="t5-sheet-subtitle">General Overview, Mission, Structure & Performance</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-weight: bold; color: var(--accent-cyan); font-size: 1.1em;">${f1.shipName} (${f1.registration})</div>
                                    <div style="color: var(--text-muted); font-size: 0.85em;">Mission: ${f1.missionCode} | TL-${f1.baseTL}</div>
                                </div>
                            </div>

                            <div class="t5-sheet-grid">
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Vessel Identification</div>
                                    <div class="t5-sheet-row"><span>Ship Name:</span> <strong>${f1.shipName}</strong></div>
                                    <div class="t5-sheet-row"><span>Registration:</span> <strong>${f1.registration}</strong></div>
                                    <div class="t5-sheet-row"><span>Mission Code:</span> <strong>${f1.missionCode}</strong></div>
                                    <div class="t5-sheet-row"><span>Hull Class:</span> <strong>${f1.hullClassification}</strong></div>
                                    <div class="t5-sheet-row"><span>Tech Level:</span> <strong>TL-${f1.baseTL}</strong></div>
                                    <div class="t5-sheet-row"><span>Displacement:</span> <strong>${f1.tonnage.toLocaleString()} tons</strong></div>
                                    <div class="t5-sheet-row"><span>Total Cost:</span> <strong>MCr${f1.totalCostMCr}</strong></div>
                                </div>
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Quick Ship Profile (QSP)</div>
                                    <div style="background: rgba(0,0,0,0.5); padding: 8px; border-radius: 4px; font-family: monospace; font-size: 1.05em; color: var(--accent-cyan); margin-bottom: 8px;">
                                        ${f1.qsp}
                                    </div>
                                    <div class="t5-sheet-row"><span>Hull Configuration:</span> <strong>${f1.configuration}</strong></div>
                                    <div class="t5-sheet-row"><span>Fuel Capacity:</span> <strong>${f1.drives.fuelTons} tons</strong></div>
                                    <div class="t5-sheet-row"><span>Cargo Payload:</span> <strong>${f1.accommodations.cargoTons} tons</strong></div>
                                    <div class="t5-sheet-row"><span>Life Support:</span> <strong>${f1.lifeSupport.daysEndurance} Days (${f1.lifeSupport.monthsEndurance} Mo)</strong></div>
                                </div>
                            </div>

                            <div class="t5-sheet-block" style="margin-bottom: 15px;">
                                <div class="t5-sheet-block-title">Subhulls, Pods & Armor Protection</div>
                                <table class="t5-sheet-table">
                                    <thead>
                                        <tr><th>#</th><th>Subhull Name</th><th>Tons</th><th>Config</th><th>TL</th><th>Armor Type</th><th>Layers</th><th>AV Rating</th></tr>
                                    </thead>
                                    <tbody>
                                        ${f1.subhulls.map(h => `<tr><td>${h.index}</td><td>${h.name}</td><td>${h.tons}t</td><td>${h.config}</td><td>TL-${h.tl}</td><td>${h.armorType}</td><td>${h.armorLayers}</td><td><strong>AV-${h.av}</strong></td></tr>`).join('')}
                                    </tbody>
                                </table>
                            </div>

                            <div class="t5-sheet-grid">
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Drives & Power Plant</div>
                                    <div class="t5-sheet-row"><span>Jump Drive:</span> <strong>${f1.drives.jump ? `${f1.drives.jump.name} (J-${f1.drives.jump.rating}, ${f1.drives.jump.tons}t, MCr${f1.drives.jump.cost})` : 'None'}</strong></div>
                                    <div class="t5-sheet-row"><span>Maneuver Drive:</span> <strong>${f1.drives.maneuver ? `${f1.drives.maneuver.name} (M-${f1.drives.maneuver.rating}, ${f1.drives.maneuver.tons}t, MCr${f1.drives.maneuver.cost})` : 'None'}</strong></div>
                                    <div class="t5-sheet-row"><span>Power Plant:</span> <strong>${f1.drives.power ? `${f1.drives.power.name} (${f1.drives.power.ep} EP, ${f1.drives.power.tons}t, MCr${f1.drives.power.cost})` : 'None'}</strong></div>
                                </div>
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Accommodations Summary</div>
                                    <div class="t5-sheet-row"><span>Crew Berths:</span> <strong>${f1.accommodations.crewBerths} Berths (${f1.accommodations.crewQuartersTons}t)</strong></div>
                                    <div class="t5-sheet-row"><span>Passenger Berths:</span> <strong>${f1.accommodations.passengerBerths} Pax (${f1.accommodations.highPaxBerths} High, ${f1.accommodations.midPaxBerths} Mid)</strong></div>
                                    <div class="t5-sheet-row"><span>Cryogenic Low Berths:</span> <strong>${f1.accommodations.lowBerths} Berths</strong></div>
                                    <div class="t5-sheet-row"><span>Passenger Commons:</span> <strong>${f1.accommodations.commonsTons} tons</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Page 2 -->
                    <div id="tab-f2" class="fillform-page" style="display:none;">
                        <div class="t5-sheet">
                            <div class="t5-sheet-header">
                                <div>
                                    <div class="t5-sheet-title">T5 Starship Construction Fillform 2</div>
                                    <div class="t5-sheet-subtitle">Armament, Defenses, Sensor Suites & Computing</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-weight: bold; color: var(--accent-cyan); font-size: 1.1em;">${f2.shipName}</div>
                                    <div style="color: var(--text-muted); font-size: 0.85em;">Hardpoints: ${f2.hardpoints.used} / ${f2.hardpoints.max}</div>
                                </div>
                            </div>

                            <div class="t5-sheet-block" style="margin-bottom: 15px;">
                                <div class="t5-sheet-block-title">Weapons & Offensive Battery</div>
                                ${f2.weapons.length > 0 ? `
                                <table class="t5-sheet-table">
                                    <thead><tr><th>Weapon System</th><th>Mount</th><th>Range</th><th>Damage</th><th>Qty</th><th>Tons</th><th>MCr</th></tr></thead>
                                    <tbody>
                                        ${f2.weapons.map(w => `<tr><td>${w.name}</td><td>${w.mount}</td><td>${w.range}</td><td>${w.damage}</td><td>${w.count}</td><td>${w.tons}t</td><td>MCr${w.cost}</td></tr>`).join('')}
                                    </tbody>
                                </table>` : '<p style="color:var(--text-muted); font-size:0.9em; margin:6px 0;">No offensive weapon batteries installed.</p>'}
                            </div>

                            <div class="t5-sheet-grid">
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Active Defenses & Screens</div>
                                    ${f2.defenses.length > 0 ? `
                                    <table class="t5-sheet-table">
                                        <thead><tr><th>Screen / Defense</th><th>Mount</th><th>Rating</th><th>Tons</th></tr></thead>
                                        <tbody>
                                            ${f2.defenses.map(d => `<tr><td>${d.name}</td><td>${d.mount}</td><td>${d.defenseValue}</td><td>${d.tons}t</td></tr>`).join('')}
                                        </tbody>
                                    </table>` : '<p style="color:var(--text-muted); font-size:0.9em; margin:6px 0;">No active defense screens installed.</p>'}
                                </div>
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Sensor Arrays</div>
                                    ${f2.sensors.length > 0 ? `
                                    <table class="t5-sheet-table">
                                        <thead><tr><th>Sensor Suite</th><th>Mount</th><th>Range</th><th>Tons</th></tr></thead>
                                        <tbody>
                                            ${f2.sensors.map(s => `<tr><td>${s.name}</td><td>${s.mount}</td><td>${s.range}</td><td>${s.tons}t</td></tr>`).join('')}
                                        </tbody>
                                    </table>` : '<p style="color:var(--text-muted); font-size:0.9em; margin:6px 0;">Standard bridge sensors only.</p>'}
                                </div>
                            </div>

                            <div class="t5-sheet-grid">
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Control Consoles & Footprint</div>
                                    <div class="t5-sheet-row"><span>Total Mechanisms:</span> <strong>${f2.consoles.totalCP} CP</strong></div>
                                    <div class="t5-sheet-row"><span>Consoles Installed:</span> <strong>${f2.consoles.totalCount} (${f2.consoles.totalTons}t)</strong></div>
                                    <div class="t5-sheet-row"><span>Ergonomics (E):</span> <strong>E = ${f2.consoles.ergonomics}</strong></div>
                                </div>
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Ship's Computers</div>
                                    <div class="t5-sheet-row"><span>Total Cells:</span> <strong>${f2.computers.totalCells} Cells</strong></div>
                                    <div class="t5-sheet-row"><span>Installed Units:</span> <strong>${f2.computers.items.map(c => c.model).join(', ') || 'None'}</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Page 3 -->
                    <div id="tab-f3" class="fillform-page" style="display:none;">
                        <div class="t5-sheet">
                            <div class="t5-sheet-header">
                                <div>
                                    <div class="t5-sheet-title">T5 Starship Construction Fillform 3</div>
                                    <div class="t5-sheet-subtitle">Crew Hierarchy, Livability Evaluations & Jump Fields</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-weight: bold; color: var(--accent-cyan); font-size: 1.1em;">Staffing: ${f3.staffingModel}</div>
                                    <div style="color: var(--text-muted); font-size: 0.85em;">Total Souls: ${f3.crewSummary.totalSouls}</div>
                                </div>
                            </div>

                            <div class="t5-sheet-block" style="margin-bottom: 15px;">
                                <div class="t5-sheet-block-title">Department Crew Roster (${f3.crewSummary.totalCrew} Personnel)</div>
                                <table class="t5-sheet-table">
                                    <thead><tr><th>Department</th><th>Rank</th><th>Role / Title</th><th>Qty</th><th>Duty Assignment / Skills</th></tr></thead>
                                    <tbody>
                                        ${f3.roster.map(r => `<tr><td><strong>${r.department}</strong></td><td>${r.rank || '—'}</td><td>${r.role}</td><td>${r.count}</td><td>${r.skill} — ${r.comment}</td></tr>`).join('')}
                                    </tbody>
                                </table>
                            </div>

                            <div class="t5-sheet-grid">
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Quality & Livability (Section 26)</div>
                                    <div class="t5-sheet-row"><span>Passenger Demand (D):</span> <strong class="${f3.quality.demandClass}">D = ${f3.quality.demand >= 0 ? '+' : ''}${f3.quality.demand} (${f3.quality.demandRating})</strong></div>
                                    <div class="t5-sheet-row"><span>Ticket Modifier:</span> <strong>${f3.quality.demandModifier}</strong></div>
                                    <div class="t5-sheet-row"><span>Crew Comfort (C):</span> <strong class="${f3.quality.comfortClass}">C = ${f3.quality.comfort} (${f3.quality.comfortRating})</strong></div>
                                    <div class="t5-sheet-row"><span>Tension Checks:</span> <strong>${f3.quality.tensionCheck}</strong></div>
                                    <div class="t5-sheet-row"><span>Control Ergonomics (E):</span> <strong class="${f3.quality.ergoClass}">E = ${f3.quality.ergonomics} (${f3.quality.ergoRating})</strong></div>
                                    <div class="t5-sheet-row"><span>Mishap Risk:</span> <strong>${f3.quality.mishapRisk}</strong></div>
                                </div>
                                <div class="t5-sheet-block">
                                    <div class="t5-sheet-block-title">Jump Fields (Section 07 / Table 07G)</div>
                                    ${jf.hasJumpDrive ? `
                                    <div class="t5-sheet-row"><span>Jump Field Type:</span> <strong>${jf.jumpField} (Strength: ${jf.strength})</strong></div>
                                    <div class="t5-sheet-row"><span>Drive Tech Stage:</span> <strong>${jf.driveStage} (E = ${jf.efficiencyE})</strong></div>
                                    <div class="t5-sheet-row"><span>Engineer Qualifications:</span> <strong>Rank ${jf.engineerRank} + JD ${jf.jumpDriveSpecialty} = Skill ${jf.totalEngineerSkill}</strong></div>
                                    <div class="t5-sheet-row"><span>Safe Jump Distance (D):</span> <strong class="good">D = ${jf.safeDistanceD} (${jf.safeDiameters} Diameters)</strong></div>
                                    <div class="t5-sheet-row"><span>Armor Mod / Flash:</span> <strong>${jf.armorMod} / ${jf.flashSize}</strong></div>
                                    <div class="t5-sheet-row"><span>Interference (X):</span> <strong class="good">X = ${jf.interferenceX} (${jf.misjumpRisk})</strong></div>
                                    ` : '<div style="color:var(--text-muted); font-size:0.9em; padding:8px 0;">No Jump, Hop, or Skip Drive installed.</div>'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Markdown View -->
                    <div id="tab-md" class="fillform-page" style="display:none;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <span style="color:var(--accent-cyan); font-weight:bold;">T5 Fillform Markdown Export</span>
                            <div>
                                <button type="button" class="cyan-btn" id="btn-copy-md" style="margin-right:8px;">📋 Copy Markdown</button>
                                <button type="button" class="cyan-btn" id="btn-dl-md">💾 Download .MD</button>
                            </div>
                        </div>
                        <textarea class="markdown-export-area" readonly id="fillform-md-text">${mdText}</textarea>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Tab Switching
        modal.querySelectorAll('.fillform-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                modal.querySelectorAll('.fillform-tab-btn').forEach(b => b.classList.remove('active'));
                modal.querySelectorAll('.fillform-page').forEach(p => p.style.display = 'none');
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-tab');
                const targetPage = modal.querySelector(`#${targetId}`);
                if (targetPage) targetPage.style.display = 'block';
            });
        });

        // Close
        modal.querySelector('#btn-close-fillform').addEventListener('click', () => {
            modal.remove();
        });

        // Print
        modal.querySelector('#btn-print-sheet').addEventListener('click', () => {
            // Show all fillform pages before printing
            modal.querySelectorAll('.fillform-page').forEach(p => p.style.display = 'block');
            window.print();
        });

        // Copy Markdown
        modal.querySelector('#btn-copy-md')?.addEventListener('click', () => {
            const ta = modal.querySelector('#fillform-md-text');
            if (ta) {
                ta.select();
                navigator.clipboard.writeText(ta.value).then(() => {
                    alert("Fillforms Markdown copied to clipboard!");
                });
            }
        });

        // Download Markdown
        modal.querySelector('#btn-dl-md')?.addEventListener('click', () => {
            const ta = modal.querySelector('#fillform-md-text');
            if (ta) {
                const blob = new Blob([ta.value], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const sName = (this.ship.shipName || 'starship').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                a.download = `${sName}_T5_Fillforms.md`;
                a.click();
                URL.revokeObjectURL(url);
            }
        });
    }

    render() {
        this.updateAvailableComponents();
        this.renderCenterPanel();
        this.renderRightPanel();
    }

    updateAvailableComponents() {
        const categories = document.querySelectorAll('.categorynode:not(.tech-constrained-node)');

        categories.forEach(category => {
            const contentList = category.querySelector(':scope > .content');
            if (!contentList) return;

            // Find or create the "Tech Constrained" section within this category
            let constrainedSection = contentList.querySelector(':scope > .tech-constrained-node');
            if (!constrainedSection) {
                constrainedSection = document.createElement('li');
                constrainedSection.className = 'categorynode tech-constrained-node';
                constrainedSection.innerHTML = `
                    <strong class="collapsible">Tech Constrained</strong>
                    <ul class="content constrained-list"></ul>
                `;
                contentList.appendChild(constrainedSection);

                // Attach collapsible event listener to the new header
                const newCollapsible = constrainedSection.querySelector('.collapsible');
                newCollapsible.addEventListener('click', function () {
                    this.classList.toggle('active');
                    const c = this.parentElement.querySelector('.content');
                    c.style.display = c.style.display === "block" ? "none" : "block";
                });
            }

            const constrainedList = constrainedSection.querySelector('.constrained-list');

            // Collect all items in this category (both regular and already constrained)
            const allItems = category.querySelectorAll('.drive-item, .generic-item, .fitting-item, .weapon-item, .defense-item, .sensor-item, .console-item, .computer-item, .accommodation-item, .facility-item, .lifesupport-item');

            let hasConstrained = false;

            allItems.forEach(item => {
                let isConstrained = false;

                if (item.classList.contains('drive-item')) {
                    const driveType = item.getAttribute('data-drive-type');
                    const availableStages = ShipHelper.getAvailableTechStages(this.ship.baseTL, driveType);
                    if (availableStages.length === 0) {
                        isConstrained = true;
                    }
                } else if (item.classList.contains('generic-item')) {
                    const compType = item.getAttribute('data-component-type');
                    if (compType === 'Fuel Rods' && this.ship.baseTL < 8) {
                        isConstrained = true;
                    }
                } else if (item.classList.contains('fitting-item')) {
                    const fittingKey = item.getAttribute('data-fitting-key');
                    const fDef = ShipHelper.ENUM_HULL_FITTINGS[fittingKey];
                    if (fDef) {
                        const selectedHull = this.ship.subhulls[this.ship.selectedSubhullIndex];
                        const config = selectedHull ? selectedHull.config : null;
                        if (config && !fDef.installable.includes(config) && !fDef.automatic.includes(config)) {
                            isConstrained = true;
                        }
                    }
                } else if (item.classList.contains('computer-item')) {
                    const modelStr = item.getAttribute('data-computer-model');
                    if (modelStr !== 'custom') {
                        const m = parseInt(modelStr, 10);
                        const reqTL = ShipHelper.getComputerSpecs(m, false).baseTL;
                        if (this.ship.baseTL < reqTL) {
                            isConstrained = true;
                        }
                    }
                }

                if (isConstrained) {
                    item.classList.add('unavailable');
                    constrainedList.appendChild(item);
                    hasConstrained = true;
                } else {
                    item.classList.remove('unavailable');
                    contentList.insertBefore(item, constrainedSection);
                }
            });

            if (hasConstrained) {
                constrainedSection.style.display = 'block';
            } else {
                constrainedSection.style.display = 'none';
            }
        });
    }

    renderCenterPanel() {
        const center = document.getElementById('current-components');
        center.innerHTML = '';

        if (this.ship.subhulls.length === 0) {
            center.innerHTML = '<p style="color: #666; font-style: italic;">No Hulls added. Add a Subhull or Pod to begin.</p>';
            return;
        }

        let globalDriveIdx = 0;
        let globalCompIdx = 0;

        this.ship.subhulls.forEach((hull, hIdx) => {
            const hullContainer = document.createElement('div');
            hullContainer.className = 'subhull-container';
            if (this.ship.selectedSubhullIndex === hIdx) {
                hullContainer.classList.add('selected-hull');
            }

            const isSelected = this.ship.selectedSubhullIndex === hIdx ? 'checked' : '';
            const flat = hull.isPod ? ShipHelper.ENUM_HULL_CONFIG[hull.config].podflatcost : ShipHelper.ENUM_HULL_CONFIG[hull.config].flatcost;
            const baseHullCost = (hull.tons * ShipHelper.ENUM_HULL_CONFIG[hull.config].cost + flat);
            const hullCost = hull.importFee ? baseHullCost * 1.1 : baseHullCost;
            const armorTons = this.ship.getSubhullArmorTons(hull);
            const subhullAV = this.ship.getSubhullAV(hull);

            const consumedTons = (hull.drives || []).reduce((s, d) => s + d.tons, 0)
                             + (hull.components || []).reduce((s, c) => s + c.tons, 0)
                             + armorTons;

            // Hull Header
            hullContainer.innerHTML = `
                <div class="subhull-header">
                    <label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                        <input type="radio" name="hull-selection" value="${hIdx}" ${isSelected}>
                        <strong>${hull.name}</strong>
                    </label>
                    <div style="font-size: 0.9em; flex-grow: 1; margin-left:15px; display:flex; gap: 15px; flex-wrap: wrap;">
                         <span>TL-${hull.tl}${hull.importFee ? ' (Imported)' : ''}</span>
                         <span class="${consumedTons > hull.tons ? 'warning' : ''}">${consumedTons.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })} / ${hull.tons.toLocaleString()} tons</span>
                         <span>${hull.config} ${hull.armorType || ''}</span>
                         <span>AV: ${subhullAV} (${hull.armorLayers} Layer${hull.armorLayers !== 1 ? 's' : ''})</span>
                         <span>MCr${hullCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                    </div>
                    <button class="hull-edit-btn" data-idx="${hIdx}">Edit</button>
                    <button class="hull-remove-btn" data-idx="${hIdx}">Remove</button>
                </div>
                <ul class="components-list" data-hull-idx="${hIdx}"></ul>
            `;

            // Radio button selection
            const radioBtn = hullContainer.querySelector(`input[type="radio"]`);
            radioBtn.addEventListener('change', () => {
                this.ship.selectSubhull(hIdx);
                this.renderCenterPanel(); // just re-render center to update styles
            });

            // Edit Hull button
            const editBtn = hullContainer.querySelector('.hull-edit-btn');
            editBtn.addEventListener('click', () => {
                this.openHullDialog(hull.name, hIdx);
            });

            // Remove Hull button
            const rmHullBtn = hullContainer.querySelector('.hull-remove-btn');
            if (rmHullBtn) {
                rmHullBtn.addEventListener('click', () => {
                    this.ship.removeSubhull(hIdx);
                    this.render();
                });
            }

            const ul = hullContainer.querySelector('.components-list');
            const totalItems = (hull.drives || []).length + (hull.components || []).length;

            if (totalItems === 0) {
                ul.innerHTML = '<div style="color: #555; font-style: italic; padding: 5px 10px;">Empty</div>';
            } else {
                const addGroupHeader = (label) => {
                    const h = document.createElement('div');
                    h.className = 'component-group-header';
                    h.textContent = label;
                    ul.appendChild(h);
                };

                const renderDriveCard = (comp, currentDriveIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card';
                    const perf = ShipHelper.getDrivePerformance(comp, this.ship.tonnage);
                    let perfDisplay;
                    if (comp.driveType === 'M-Drive' || comp.driveType === 'G-Drive') {
                        perfDisplay = `Perf: ${perf.potential} (Thrust ${perf.potential}G)`;
                    } else if (comp.driveType === 'NAFAL') {
                        const dG = (perf.potential / 10).toFixed(1);
                        perfDisplay = `Perf: ${perf.potential} (${dG}G to ${dG}C)`;
                    } else {
                        perfDisplay = `Perf: ${perf.potential} (${perf.note})`;
                    }
                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">${comp.driveType} (Class ${comp.driveClass})</div>
                            <div class="component-details">TL-${comp.tl} ${comp.stage}, EP: ${comp.ep}</div>
                            <div class="component-details">MCr${comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} - ${comp.tons.toLocaleString()} tons</div>
                            <div class="component-perf">${perfDisplay}</div>
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openDriveDialog(comp.driveType, currentDriveIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeDriveAtIndex(currentDriveIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                const renderFittingCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card';
                    const costStr = Math.abs(comp.cost).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
                    const costDisplay = comp.cost < 0
                        ? `<span style="color:var(--accent-cyan)">-MCr${costStr} (Credit)</span>`
                        : `MCr${costStr}`;
                    const autoBadge = comp.isAutoInstalled
                        ? `<span class="auto-badge">${comp.removableFromAutoInstall ? 'Auto \u2014 see Remove Lifters' : 'Auto'}</span>`
                        : '';
                    const deployedNote = comp.deployedTons !== undefined
                        ? `<div class="component-perf">Deployed: ${comp.deployedTons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>`
                        : '';
                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">${comp.name} ${autoBadge}</div>
                            <div class="component-details">${costDisplay} \u2014 ${comp.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</div>
                            ${deployedNote}
                            ${comp.comment ? `<div class="component-perf" style="color:var(--text-muted); font-family:inherit; font-style:italic">${comp.comment}</div>` : ''}
                        </div>
                    `;
                    if (comp.isAutoInstalled) {
                        li.style.cursor = 'default';
                    } else {
                        li.addEventListener('click', () => { this.openHullFittingDialog(comp.fittingKey, currentCompIdx); });
                        const removeBtn = document.createElement('button');
                        removeBtn.textContent = 'Remove';
                        removeBtn.className = 'remove-btn';
                        removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                        li.appendChild(removeBtn);
                    }
                    ul.appendChild(li);
                };

                const renderWeaponCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card weapon-card';
                    const costStr = comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
                    const countStr = comp.count > 1 ? ` (x${comp.count})` : '';
                    const hitsStr = comp.hits ? `<span class="badge badge-hits">${comp.hits * (comp.count || 1)}D Hits</span>` : '';
                    const hpStr = comp.hardpointReq > 0 ? `<span class="badge badge-hp">${comp.hardpointReq} HP</span>` : (comp.firmpointReq > 0 ? `<span class="badge badge-fp">${comp.firmpointReq} FP</span>` : '');
                    const stageStr = `<span class="badge badge-stage">${comp.stage}</span>`;
                    const rangeStr = `<span class="badge badge-range">${comp.rangeKey || 'AR'}</span>`;
                    const tlStr = `<span class="badge badge-tl">TL ${comp.tl}</span>`;

                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">
                                ${comp.name}${countStr}
                                ${hpStr} ${stageStr} ${rangeStr} ${tlStr} ${hitsStr}
                            </div>
                            <div class="component-details">
                                ${comp.mountName} \u2014 MCr${costStr} \u2014 ${comp.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons \u2014 ${comp.cp} CP
                            </div>
                            ${comp.comment ? `<div class="component-perf" style="color:var(--text-muted); font-style:italic">${comp.comment}</div>` : ''}
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openWeaponDialog(comp.weaponKey, currentCompIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                const renderDefenseCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card defense-card';
                    const costStr = comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
                    const countStr = comp.count > 1 ? ` (x${comp.count})` : '';
                    const hpStr = comp.hardpointReq > 0 ? `<span class="badge badge-hp">${comp.hardpointReq} HP</span>` : (comp.firmpointReq > 0 ? `<span class="badge badge-fp">${comp.firmpointReq} FP</span>` : '');
                    const stageStr = `<span class="badge badge-stage">${comp.stage}</span>`;
                    const rangeStr = `<span class="badge badge-range">${comp.rangeKey || 'AR'}</span>`;
                    const tlStr = `<span class="badge badge-tl">TL ${comp.tl}</span>`;

                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">
                                ${comp.name}${countStr}
                                ${hpStr} ${stageStr} ${rangeStr} ${tlStr}
                            </div>
                            <div class="component-details">
                                ${comp.mountName} \u2014 MCr${costStr} \u2014 ${comp.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons \u2014 ${comp.cp} CP
                            </div>
                            ${comp.comment ? `<div class="component-perf" style="color:var(--text-muted); font-style:italic">${comp.comment}</div>` : ''}
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openDefenseDialog(comp.defenseKey, currentCompIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                const renderSensorCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card sensor-card';
                    const costStr = comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
                    const countStr = comp.count > 1 ? ` (x${comp.count})` : '';
                    const hpStr = comp.hardpointReq > 0 ? `<span class="badge badge-hp">${comp.hardpointReq} HP</span>` : '';
                    const modeStr = comp.mode ? `<span class="badge badge-mode">${comp.mode}</span>` : '';
                    const stageStr = `<span class="badge badge-stage">${comp.stage}</span>`;
                    const rangeStr = `<span class="badge badge-range">${comp.rangeKey || 'AR'}</span>`;
                    const tlStr = `<span class="badge badge-tl">TL ${comp.tl}</span>`;

                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">
                                ${comp.name}${countStr}
                                ${hpStr} ${modeStr} ${stageStr} ${rangeStr} ${tlStr}
                            </div>
                            <div class="component-details">
                                ${comp.mountName} \u2014 MCr${costStr} \u2014 ${comp.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons \u2014 ${comp.cp} CP
                            </div>
                            ${comp.comment ? `<div class="component-perf" style="color:var(--text-muted); font-style:italic">${comp.comment}</div>` : ''}
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openSensorDialog(comp.sensorKey, currentCompIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                const renderGenericCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card';
                    let labelHtml = comp.label ? `<span style="font-size:0.9em; color:#aaa"> - ${comp.label}</span>` : '';
                    let linkedPerfStr = '', linkIcon = '';
                    if ((comp.name === 'Fuel Tank' || comp.name === 'Fuel Rods') && comp.linkedDriveIndex !== undefined) {
                        const linkedDrive = this.ship.drives[comp.linkedDriveIndex];
                        if (linkedDrive) {
                            linkIcon = '\ud83d\udd17 ';
                            const drivePerf = ShipHelper.getDrivePerformance(linkedDrive, this.ship.tonnage);
                            let fuelPerUnit = drivePerf.minConsumption || drivePerf.fuelConsumption || 0;
                            if (linkedDrive.driveType === "Power Plant" || linkedDrive.driveType === "Fission") fuelPerUnit = drivePerf.fuelConsumption || 0;
                            if (fuelPerUnit > 0) {
                                const isRods = comp.name === 'Fuel Rods';
                                const amount = isRods ? Math.round(comp.tons * 200) : comp.tons;
                                const units = Math.floor((amount / fuelPerUnit) * 10) / 10;
                                let unitName = "uses", itemName = " (" + linkedDrive.driveType + ")";
                                if (linkedDrive.driveType === "Power Plant") { unitName = "month operations"; itemName = " (Power Plant)"; }
                                else if (linkedDrive.driveType === "Fission") { unitName = "decades operations"; itemName = " (Fission)"; }
                                else if (linkedDrive.driveType === "Jump") { unitName = "Parsecs"; itemName = ""; }
                                else if (linkedDrive.driveType === "Hop") { unitName = "hops"; itemName = ""; }
                                else if (linkedDrive.driveType === "Skip") { unitName = "skips"; itemName = ""; }
                                else if (linkedDrive.driveType === "HEPlaR") { unitName = "burns"; itemName = ""; }
                                linkedPerfStr = `<div class="component-perf">Supports: ${units} ${unitName}${itemName}</div>`;
                            }
                        }
                    }
                    const compCostStr = comp.cost ? comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '0.0';
                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">${linkIcon}${comp.name}${labelHtml}</div>
                            <div class="component-details">MCr${compCostStr} - ${comp.tons.toLocaleString()} tons</div>
                            ${linkedPerfStr}
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openGenericDialog(comp.name, currentCompIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                const renderConsoleCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card console-card';
                    const costStr = comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
                    const countStr = comp.count > 1 ? ` (x${comp.count})` : '';
                    const roleBadge = `<span class="badge badge-role">${comp.roleType || 'CC'}</span>`;
                    const holoBadge = comp.holographic ? `<span class="badge badge-holo">Holo</span>` : '';
                    const tlStr = `<span class="badge badge-tl">TL ${comp.tl}</span>`;

                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">
                                ${comp.name}${countStr}
                                ${roleBadge} ${holoBadge} ${tlStr}
                            </div>
                            <div class="component-details">
                                ${comp.typeName} \u2014 MCr${costStr} \u2014 ${comp.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons \u2014 ${comp.sq} Sq \u2014 Skill: ${comp.skill}
                            </div>
                            ${comp.comment ? `<div class="component-perf" style="color:var(--text-muted); font-style:italic">${comp.comment}</div>` : ''}
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openConsoleDialog(comp.roleKey, currentCompIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                const renderComputerCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card computer-card';
                    const costStr = comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
                    const countStr = comp.count > 1 ? ` (x${comp.count})` : '';
                    const cellsBadge = `<span class="badge badge-cells">${comp.cells} Cells</span>`;
                    const masterBadge = comp.isMaster ? `<span class="badge badge-master">Master</span>` : '';
                    const backupBadge = comp.isBackup ? `<span class="badge badge-backup">Backup</span>` : '';
                    const tlStr = `<span class="badge badge-tl">TL ${comp.tl}</span>`;

                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">
                                ${comp.name}${countStr}
                                ${cellsBadge} ${masterBadge} ${backupBadge} ${tlStr}
                            </div>
                            <div class="component-details">
                                MCr${costStr} \u2014 ${comp.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons \u2014 ${comp.sq} Sq \u2014 ${comp.softwareCapacity}
                            </div>
                            ${comp.comment ? `<div class="component-perf" style="color:var(--text-muted); font-style:italic">${comp.comment}</div>` : ''}
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openComputerDialog(comp.model, currentCompIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                const renderAccommodationCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card accommodation-card';
                    const costStr = comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
                    const countStr = comp.count > 1 ? ` (x${comp.count})` : '';
                    let assignBadgeClass = 'badge-pax';
                    if (comp.assignment === 'Crew') assignBadgeClass = 'badge-crew';
                    else if (comp.assignment === 'HighPax') assignBadgeClass = 'badge-highpax';
                    else if (comp.assignment === 'Cryo') assignBadgeClass = 'badge-cryo';
                    else if (comp.assignment === 'Commons') assignBadgeClass = 'badge-commons';

                    const assignBadge = `<span class="badge ${assignBadgeClass}">${comp.assignment}</span>`;
                    const occBadge = comp.occupants > 0 ? `<span class="badge badge-cells">${comp.occupants} Occ</span>` : '';
                    const tlStr = `<span class="badge badge-tl">TL ${comp.tl}</span>`;

                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">
                                ${comp.name}${countStr}
                                ${assignBadge} ${occBadge} ${tlStr}
                            </div>
                            <div class="component-details">
                                MCr${costStr} \u2014 ${comp.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons \u2014 Fresher: ${comp.fresher} \u2014 Comfort: ${comp.comfort}
                            </div>
                            ${comp.comment ? `<div class="component-perf" style="color:var(--text-muted); font-style:italic">${comp.comment}</div>` : ''}
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openAccommodationDialog(comp.accommodationKey, currentCompIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                const renderFacilityCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card facility-card';
                    const costStr = comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
                    const countStr = comp.count > 1 ? ` (x${comp.count})` : '';
                    let catBadgeClass = 'badge-shop';
                    if (comp.isMedical) catBadgeClass = 'badge-med';
                    else if (comp.isLab) catBadgeClass = 'badge-lab';
                    else if (comp.isArmory) catBadgeClass = 'badge-vault';
                    else if (comp.isCargo) catBadgeClass = 'badge-role';

                    const catBadge = `<span class="badge ${catBadgeClass}">${comp.category}</span>`;
                    const tlStr = `<span class="badge badge-tl">TL ${comp.tl}</span>`;

                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">
                                ${comp.name}${countStr}
                                ${catBadge} ${tlStr}
                            </div>
                            <div class="component-details">
                                MCr${costStr} \u2014 ${comp.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons
                            </div>
                            ${comp.comment ? `<div class="component-perf" style="color:var(--text-muted); font-style:italic">${comp.comment}</div>` : ''}
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openFacilityDialog(comp.facilityKey, currentCompIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                const renderLifeSupportCard = (comp, currentCompIdx) => {
                    const li = document.createElement('div');
                    li.className = 'component-card lifesupport-card';
                    const costStr = comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
                    const countStr = comp.count > 1 ? ` (x${comp.count})` : '';
                    const capBadge = comp.personDays > 0 ? `<span class="badge badge-mode">${comp.personDays.toLocaleString()} p-days</span>` : (comp.efficiencyBonus > 0 ? `<span class="badge badge-mode">+${Math.round(comp.efficiencyBonus * 100 * comp.count)}% Eff</span>` : '');
                    const tlStr = `<span class="badge badge-tl">TL ${comp.tl}</span>`;

                    li.innerHTML = `
                        <div class="component-info">
                            <div class="component-title">
                                ${comp.name}${countStr}
                                ${capBadge} ${tlStr}
                            </div>
                            <div class="component-details">
                                MCr${costStr} \u2014 ${comp.tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons
                            </div>
                            ${comp.comment ? `<div class="component-perf" style="color:var(--text-muted); font-style:italic">${comp.comment}</div>` : ''}
                        </div>
                    `;
                    li.addEventListener('click', () => { this.openLifeSupportDialog(comp.lifeSupportKey, currentCompIdx); });
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => { e.stopPropagation(); this.ship.removeComponentAtIndex(currentCompIdx); this.render(); };
                    li.appendChild(removeBtn);
                    ul.appendChild(li);
                };

                // Pre-map components with their global indices before grouping
                const hullComps = hull.components || [];
                const compEntries = hullComps.map((c, i) => ({ comp: c, idx: globalCompIdx + i }));
                globalCompIdx += hullComps.length;

                const accomEntries    = compEntries.filter(e => e.comp.isAccommodation);
                const facilityEntries = compEntries.filter(e => e.comp.isFacility);
                const lsEntries       = compEntries.filter(e => e.comp.isLifeSupport);
                const consoleEntries  = compEntries.filter(e => e.comp.isConsole);
                const computerEntries = compEntries.filter(e => e.comp.isComputer);
                const weaponEntries   = compEntries.filter(e => e.comp.isWeapon);
                const defenseEntries  = compEntries.filter(e => e.comp.isDefense);
                const sensorEntries   = compEntries.filter(e => e.comp.isSensor);
                const fuelEntries     = compEntries.filter(e => e.comp.name === 'Fuel Tank' || e.comp.name === 'Fuel Rods');
                const fittingEntries  = compEntries.filter(e => e.comp.isHullFitting || e.comp.name === 'Grapple');
                const genericEntries  = compEntries.filter(e => !e.comp.isAccommodation && !e.comp.isFacility && !e.comp.isLifeSupport && !e.comp.isConsole && !e.comp.isComputer && !e.comp.isWeapon && !e.comp.isDefense && !e.comp.isSensor && !e.comp.isHullFitting && e.comp.name !== 'Grapple' && e.comp.name !== 'Fuel Tank' && e.comp.name !== 'Fuel Rods');

                // Drives group
                if ((hull.drives || []).length > 0) {
                    addGroupHeader('Drives');
                    (hull.drives || []).forEach(comp => {
                        renderDriveCard(comp, globalDriveIdx++);
                    });
                }

                // Accommodations group
                if (accomEntries.length > 0) {
                    addGroupHeader('Accommodations & Staterooms');
                    accomEntries.forEach(({ comp, idx }) => renderAccommodationCard(comp, idx));
                }

                // Facilities & Payload group
                if (facilityEntries.length > 0) {
                    addGroupHeader('Facilities & Payload');
                    facilityEntries.forEach(({ comp, idx }) => renderFacilityCard(comp, idx));
                }

                // Life Support group
                if (lsEntries.length > 0) {
                    addGroupHeader('Life Support Systems');
                    lsEntries.forEach(({ comp, idx }) => renderLifeSupportCard(comp, idx));
                }

                // Controls & Consoles group
                if (consoleEntries.length > 0) {
                    addGroupHeader('Controls & Consoles');
                    consoleEntries.forEach(({ comp, idx }) => renderConsoleCard(comp, idx));
                }

                // Computers group
                if (computerEntries.length > 0) {
                    addGroupHeader("Ship's Computers");
                    computerEntries.forEach(({ comp, idx }) => renderComputerCard(comp, idx));
                }

                // Weapons group
                if (weaponEntries.length > 0) {
                    addGroupHeader('Weapons');
                    weaponEntries.forEach(({ comp, idx }) => renderWeaponCard(comp, idx));
                }

                // Defenses group
                if (defenseEntries.length > 0) {
                    addGroupHeader('Defenses');
                    defenseEntries.forEach(({ comp, idx }) => renderDefenseCard(comp, idx));
                }

                // Sensors group
                if (sensorEntries.length > 0) {
                    addGroupHeader('Sensors');
                    sensorEntries.forEach(({ comp, idx }) => renderSensorCard(comp, idx));
                }

                // Fuel group
                if (fuelEntries.length > 0) {
                    addGroupHeader('Fuel Systems');
                    fuelEntries.forEach(({ comp, idx }) => renderGenericCard(comp, idx));
                }

                // Other Generic Payload group
                if (genericEntries.length > 0) {
                    addGroupHeader('Other Payload');
                    genericEntries.forEach(({ comp, idx }) => renderGenericCard(comp, idx));
                }

                // Fittings group (hull fittings + grapples)
                if (fittingEntries.length > 0) {
                    addGroupHeader('Hull Fittings & Grapples');
                    fittingEntries.forEach(({ comp, idx }) => {
                        if (comp.isHullFitting) renderFittingCard(comp, idx);
                        else renderGenericCard(comp, idx); // Grapple
                    });
                }
            }


            center.appendChild(hullContainer);
        });
    }

    renderRightPanel() {
        const stats = document.getElementById('ship-stats');
        const staffingModel = this.currentStaffingModel || 'Merchant';
        const crewReq = this.ship.getCrewRequirements(staffingModel);
        const lsStatus = this.ship.getLifeSupportStatus();
        const safeJump = this.ship.safeJumpDistance();
        const jumpIntf = this.ship.jumpInterference();
        const quality = this.ship.qualityEvaluations;

        // Update top bar display elements
        const displayTonnage = document.getElementById('display-tonnage');
        if (displayTonnage) displayTonnage.textContent = this.ship.tonnage.toLocaleString();

        const displayHardpoints = document.getElementById('display-hardpoints');
        if (displayHardpoints) {
            const hpUsed = this.ship.hardpointsUsed;
            const hpMax = this.ship.maxHardpoints;
            displayHardpoints.textContent = `${hpUsed} / ${hpMax}`;
            if (hpUsed > hpMax) {
                displayHardpoints.style.color = 'var(--accent-red)';
            } else {
                displayHardpoints.style.color = 'var(--accent-cyan)';
            }
        }

        const displayCP = document.getElementById('display-cp');
        if (displayCP) {
            displayCP.textContent = `${this.ship.totalControlPanels} CP`;
        }

        const displayErgo = document.getElementById('display-ergonomics');
        if (displayErgo) {
            const consCount = this.ship.totalConsoleCount;
            const ergo = this.ship.controlErgonomics;
            const ergoRatio = this.ship.controlErgonomicsRatio;
            displayErgo.textContent = `${consCount} Consoles (E: ${ergo}, ${ergoRatio} t/CP)`;
            if (this.ship.totalControlPanels > 0 && consCount === 0) {
                displayErgo.style.color = 'var(--accent-red)';
            } else {
                displayErgo.style.color = 'var(--accent-cyan)';
            }
        }

        const displayComputer = document.getElementById('display-computer');
        if (displayComputer) {
            const compCells = this.ship.totalComputerCells;
            const comps = this.ship.computers;
            const masterComp = comps.find(c => c.isMaster) || comps[0];
            const modelName = masterComp ? `Model/${masterComp.model}${masterComp.isBis ? ' bis' : ''}` : 'None';
            displayComputer.textContent = `${modelName} (${compCells} Cells)`;
            if (this.ship.totalConsoleCount > 0 && compCells < this.ship.totalConsoleCount) {
                displayComputer.style.color = 'var(--accent-red)';
            } else {
                displayComputer.style.color = 'var(--accent-cyan)';
            }
        }

        const displayCrew = document.getElementById('display-crew');
        if (displayCrew) {
            const req = crewReq.totalCrew;
            const berths = this.ship.totalCrewBerths;
            displayCrew.textContent = `${req} Req / ${berths} Berths`;
            if (berths < req) {
                displayCrew.style.color = 'var(--accent-red)';
            } else {
                displayCrew.style.color = 'var(--accent-cyan)';
            }
        }

        const displayPax = document.getElementById('display-passengers');
        if (displayPax) {
            displayPax.textContent = `${this.ship.totalPassengerBerths} Pax (${this.ship.totalLowBerths} Low)`;
            displayPax.style.color = 'var(--accent-cyan)';
        }

        const displayLS = document.getElementById('display-lifesupport');
        if (displayLS) {
            displayLS.textContent = `${lsStatus.daysEndurance} Days (${lsStatus.monthsEndurance} Mo)`;
            if (lsStatus.daysEndurance < 30 && lsStatus.totalSouls > 0) {
                displayLS.style.color = 'var(--accent-red)';
            } else {
                displayLS.style.color = 'var(--accent-cyan)';
            }
        }

        const displaySafeJump = document.getElementById('display-safejump');
        if (displaySafeJump) {
            if (this.ship.hasJumpDrive) {
                displaySafeJump.textContent = `${safeJump.D}D`;
                displaySafeJump.style.color = 'var(--accent-cyan)';
            } else {
                displaySafeJump.textContent = `No Jump`;
                displaySafeJump.style.color = 'var(--text-muted)';
            }
        }

        const displayConfig = document.getElementById('display-config');
        if (displayConfig) displayConfig.textContent = this.ship.configurationType;
        const displayMission = document.getElementById('display-mission');
        if (displayMission) {
            displayMission.textContent = `${this.ship.missionCode} (${this.ship.missionFullTitle})`;
        }

        // Calculate totals
        let totalCost = this.ship.baseCost;
        let totalTonnageUsed = 0;
        let totalMechanisms = this.ship.subhulls.length; // Built-in lifters
        let mdrivePotential = 0;
        let jumpPotential = 0;
        let hopPotential = 0;
        let skipPotential = 0;
        let nafalPotential = 0;
        let maxPower = 0;
        let maxJumpPower = 0;
        let totalDriveTonnage = 0;

        this.ship.subhulls.forEach(hull => {
            totalTonnageUsed += this.ship.getSubhullArmorTons(hull);
            totalCost += (hull.cost || 0);
            (hull.drives || []).forEach(drive => {
                totalCost += (drive.cost || 0);
                totalTonnageUsed += (drive.tons || 0);
                totalDriveTonnage += (drive.tons || 0);
                totalMechanisms += Math.ceil(drive.tons / 35);
                if (!drive.isGeneric) {
                    const perf = ShipHelper.getDrivePerformance(drive, this.ship.tonnage);
                    if (drive.driveType === 'M-Drive' || drive.driveType === 'G-Drive') {
                        if (perf.potential > mdrivePotential) mdrivePotential = perf.potential;
                    } else if (drive.driveType === 'Jump') {
                        if (perf.potential > jumpPotential) jumpPotential = perf.potential;
                    } else if (drive.driveType === 'Hop') {
                        if (perf.potential > hopPotential) hopPotential = perf.potential;
                    } else if (drive.driveType === 'Skip') {
                        if (perf.potential > skipPotential) skipPotential = perf.potential;
                    } else if (drive.driveType === 'NAFAL') {
                        if (perf.potential > nafalPotential) nafalPotential = perf.potential;
                    } else if (drive.driveType === 'Power Plant' || drive.driveType === 'Fission' || drive.driveType === 'Anti-Matter') {
                        if (perf.potential > maxPower) maxPower = perf.potential;
                        if (perf.potential > maxJumpPower) maxJumpPower = perf.potential;
                    } else if (drive.driveType === 'Collector') {
                        if (perf.potential > maxJumpPower) maxJumpPower = perf.potential;
                    }
                }
            });
            (hull.components || []).forEach(comp => {
                totalCost += (comp.cost || 0);
                totalTonnageUsed += (comp.tons || 0);
                if (comp.isHullFitting) {
                    totalMechanisms += (comp.mechanisms !== undefined ? comp.mechanisms : 1);
                } else if (comp.name === 'Grapple') {
                    totalMechanisms += 1;
                } else if (comp.mechanisms) {
                    totalMechanisms += comp.mechanisms;
                }
            });
        });

        const tonnageRemaining = this.ship.tonnage - totalTonnageUsed;

        const hullMaxG = this.ship.configuration.maxG;
        const effectiveMDrive = Math.min(mdrivePotential, maxPower, hullMaxG);
        let mDriveNote = '';
        if (effectiveMDrive < mdrivePotential) {
            if (effectiveMDrive === hullMaxG) mDriveNote = ' (Hull Limited)';
            else mDriveNote = ' (Power Limited)';
        }

        const effectiveNafal = Math.min(nafalPotential, maxPower);
        let nafalNote = '';
        if (effectiveNafal < nafalPotential) {
            nafalNote = ' (Power Limited)';
        }

        const effectiveJump = Math.min(jumpPotential, maxJumpPower);
        const effectiveHop = Math.min(hopPotential, maxJumpPower);
        const effectiveSkip = Math.min(skipPotential, maxJumpPower);

        let drivePerfHtml = '';
        if (totalDriveTonnage > 0 || mdrivePotential > 0 || jumpPotential > 0 || hopPotential > 0 || skipPotential > 0 || nafalPotential > 0) {
            drivePerfHtml = `
            <div class="stat-section">
                <div class="stat-header">Drive Performance:</div>
                ${totalDriveTonnage > 0 ? `<div class="stat-row"><span class="stat-label">Total Drive Tonnage:</span> <span class="stat-value">${totalDriveTonnage.toLocaleString()} tons</span></div>` : ''}
                ${mdrivePotential > 0 ? `<div class="stat-row"><span class="stat-label">Maneuver:</span> <span class="stat-value ${effectiveMDrive < mdrivePotential ? 'warning' : 'good'}">${effectiveMDrive} G${mDriveNote}</span></div>` : ''}
                ${nafalPotential > 0 ? `<div class="stat-row"><span class="stat-label">Interstellar Maneuver:</span> <span class="stat-value ${effectiveNafal < nafalPotential ? 'warning' : 'good'}">${(effectiveNafal / 10).toFixed(1)}G to ${(effectiveNafal / 10).toFixed(1)}C${nafalNote}</span></div>` : ''}
                ${jumpPotential > 0 ? `<div class="stat-row"><span class="stat-label">Jump:</span> <span class="stat-value ${effectiveJump < jumpPotential ? 'warning' : 'good'}">Jump-${effectiveJump}${effectiveJump < jumpPotential ? ' (Power Limited)' : ''}</span></div>` : ''}
                ${hopPotential > 0 ? `<div class="stat-row"><span class="stat-label">Hop:</span> <span class="stat-value ${effectiveHop < hopPotential ? 'warning' : 'good'}">Hop-${effectiveHop}${effectiveHop < hopPotential ? ' (Power Limited)' : ''}</span></div>` : ''}
                ${skipPotential > 0 ? `<div class="stat-row"><span class="stat-label">Skip:</span> <span class="stat-value ${effectiveSkip < skipPotential ? 'warning' : 'good'}">Skip-${effectiveSkip}${effectiveSkip < skipPotential ? ' (Power Limited)' : ''}</span></div>` : ''}
            </div>
            `;
        }

        // Deployed fittings performance section
        let deployedPerfHtml = '';
        const deployableFittings = [];
        let deployedTonnageDelta = 0;
        this.ship.subhulls.forEach(hull => {
            hull.components.forEach(comp => {
                if (comp.isHullFitting && comp.deployedTons !== undefined) {
                    deployableFittings.push(comp.name);
                    deployedTonnageDelta += (comp.deployedTons - comp.tons);
                }
            });
        });
        if (deployableFittings.length > 0) {
            const deployedTonnage = this.ship.tonnage + deployedTonnageDelta;
            let depMdrive = 0, depJump = 0, depHop = 0, depSkip = 0, depNafal = 0;
            this.ship.drives.forEach(d => {
                if (!d.isGeneric) {
                    const perf = ShipHelper.getDrivePerformance(d, deployedTonnage);
                    const pot = perf.potential || 0;
                    if (d.driveType === 'M-Drive' || d.driveType === 'G-Drive') { if (pot > depMdrive) depMdrive = pot; }
                    else if (d.driveType === 'Jump') { if (pot > depJump) depJump = pot; }
                    else if (d.driveType === 'Hop') { if (pot > depHop) depHop = pot; }
                    else if (d.driveType === 'Skip') { if (pot > depSkip) depSkip = pot; }
                    else if (d.driveType === 'NAFAL') { if (pot > depNafal) depNafal = pot; }
                }
            });
            const depEffMdrive = Math.min(depMdrive, maxPower, hullMaxG);
            deployedPerfHtml = `
            <div class="stat-section">
                <div class="stat-header">Performance with Fittings Deployed:</div>
                <div class="stat-row"><span class="stat-label">Effective Tonnage:</span> <span class="stat-value">${deployedTonnage.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })} tons</span></div>
                ${depMdrive > 0 ? `<div class="stat-row"><span class="stat-label">Maneuver:</span> <span class="stat-value ${depEffMdrive < depMdrive ? 'warning' : 'good'}">${depEffMdrive} G</span></div>` : ''}
                ${depJump > 0 ? `<div class="stat-row"><span class="stat-label">Jump:</span> <span class="stat-value good">Jump-${depJump}</span></div>` : ''}
                ${depHop > 0 ? `<div class="stat-row"><span class="stat-label">Hop:</span> <span class="stat-value good">Hop-${depHop}</span></div>` : ''}
                ${depSkip > 0 ? `<div class="stat-row"><span class="stat-label">Skip:</span> <span class="stat-value good">Skip-${depSkip}</span></div>` : ''}
                ${depNafal > 0 ? `<div class="stat-row"><span class="stat-label">Interstellar:</span> <span class="stat-value good">${(depNafal / 10).toFixed(1)}G</span></div>` : ''}
            </div>
            `;
        }

        const weaponsCount = this.ship.weapons.reduce((sum, w) => sum + (w.count || 1), 0);
        const defensesCount = this.ship.defenses.reduce((sum, d) => sum + (d.count || 1), 0);
        const sensorsCount = this.ship.sensors.reduce((sum, s) => sum + (s.count || 1), 0);

        let armamentHtml = '';
        if (weaponsCount > 0 || defensesCount > 0 || sensorsCount > 0) {
            armamentHtml = `
            <div class="stat-section">
                <div class="stat-header">Armament & Electronics:</div>
                ${weaponsCount > 0 ? `<div class="stat-row"><span class="stat-label">Weapons Installed:</span> <span class="stat-value">${weaponsCount} (${this.ship.weapons.reduce((s, w) => s + w.tons, 0).toFixed(1)}t, MCr${this.ship.weapons.reduce((s, w) => s + w.cost, 0).toFixed(1)})</span></div>` : ''}
                ${defensesCount > 0 ? `<div class="stat-row"><span class="stat-label">Defenses Installed:</span> <span class="stat-value">${defensesCount} (${this.ship.defenses.reduce((s, d) => s + d.tons, 0).toFixed(1)}t, MCr${this.ship.defenses.reduce((s, d) => s + d.cost, 0).toFixed(1)})</span></div>` : ''}
                ${sensorsCount > 0 ? `<div class="stat-row"><span class="stat-label">Sensors Installed:</span> <span class="stat-value">${sensorsCount} (${this.ship.sensors.reduce((s, se) => s + se.tons, 0).toFixed(1)}t, MCr${this.ship.sensors.reduce((s, se) => s + se.cost, 0).toFixed(1)})</span></div>` : ''}
            </div>
            `;
        }

        const mObj = this.ship.missionObject;
        const mHierarchyStr = `${mObj?.service || 'Commerce'}${mObj?.activity ? ` > ${mObj.activity}` : ''}${mObj?.type ? ` > ${mObj.type}` : ''} > ${mObj?.mission || 'Trader'} [${mObj?.code || 'A'}]`;

        stats.innerHTML = `
            <div class="stat-section">
                <div class="stat-header">Mission Classification (Sec 02):</div>
                <div class="stat-row"><span class="stat-label">Vessel:</span> <span class="stat-value">${this.ship.shipName || 'Starship'} (${this.ship.registration || 'REG-0101'})</span></div>
                <div class="stat-row"><span class="stat-label">Classification Code:</span> <span class="stat-value good">${this.ship.missionCode}</span></div>
                <div class="stat-row"><span class="stat-label">Full Designation:</span> <span class="stat-value">${this.ship.missionFullTitle}</span></div>
                <div class="stat-row"><span class="stat-label">Hierarchy:</span> <span class="stat-value" style="font-size:0.82em; color:var(--text-muted);">${mHierarchyStr}</span></div>
                <button type="button" class="roster-view-btn" id="btn-quick-mission">Configure Mission & Modifiers</button>
            </div>

            <div class="stat-section">
                <div class="stat-header">Hull Configurations:</div>
                <div class="stat-row"><span class="stat-label">Type:</span> <span class="stat-value">${this.ship.configurationType}</span></div>
                <div class="stat-row"><span class="stat-label">Friction:</span> <span class="stat-value">${this.ship.configuration.friction}</span></div>
                <div class="stat-row"><span class="stat-label">Agility:</span> <span class="stat-value">${this.ship.configuration.agility}</span></div>
            </div>

            <div class="stat-section">
                <div class="stat-header">Accommodations & Berthing (Sec 19/23):</div>
                <div class="stat-row"><span class="stat-label">Crew Berths:</span> <span class="stat-value ${this.ship.totalCrewBerths >= crewReq.totalCrew ? 'good' : 'warning'}">${this.ship.totalCrewBerths} Berths (${this.ship.totalCrewQuartersTons}t)</span></div>
                <div class="stat-row"><span class="stat-label">Passenger Berths:</span> <span class="stat-value">${this.ship.totalPassengerBerths} Pax (${this.ship.totalHighPaxBerths} High, ${this.ship.totalMidPaxBerths} Mid)</span></div>
                <div class="stat-row"><span class="stat-label">Cryo Low Berths:</span> <span class="stat-value">${this.ship.totalLowBerths} Low (${(this.ship.totalLowBerths * 0.5).toFixed(1)} tons)</span></div>
                <div class="stat-row"><span class="stat-label">Passenger Commons:</span> <span class="stat-value">${this.ship.totalCommonsTons} tons</span></div>
                <div class="stat-row"><span class="stat-label">Total Cargo Space:</span> <span class="stat-value">${this.ship.totalCargoTons} tons</span></div>
            </div>

            <div class="stat-section">
                <div class="stat-header">Quality & Livability (Sec 26):</div>
                <div class="stat-row"><span class="stat-label">Passenger Demand (D):</span> <span class="stat-value ${quality.demandClass}">D = ${quality.demand >= 0 ? '+' : ''}${quality.demand} (${quality.demandRating})</span></div>
                <div class="stat-row"><span class="stat-label">Ticket Modifier:</span> <span class="stat-value">${quality.demandModifier}</span></div>
                <div class="stat-row"><span class="stat-label">Crew Comfort (C):</span> <span class="stat-value ${quality.comfortClass}">C = ${quality.comfort} (${quality.comfortRating})</span></div>
                <div class="stat-row"><span class="stat-label">Tension Checks:</span> <span class="stat-value">${quality.tensionCheck}</span></div>
                <div class="stat-row"><span class="stat-label">Control Ergonomics (E):</span> <span class="stat-value ${quality.ergoClass}">E = ${quality.ergonomics} (${quality.ergoRating})</span></div>
                <div class="stat-row"><span class="stat-label">Mishap Hazard:</span> <span class="stat-value">${quality.mishapRisk}</span></div>
                ${quality.risks.length > 0 ? `<div style="margin-top:8px; font-size:0.82em; color:var(--accent-red);">${quality.risks.map(r => `<div>⚠️ ${r}</div>`).join('')}</div>` : ''}
            </div>

            <div class="stat-section">
                <div class="stat-header">Jump Fields (Sec 07):</div>
                ${this.ship.hasJumpDrive ? `
                <div class="stat-row"><span class="stat-label">Jump Field:</span> <span class="stat-value">${safeJump.fieldName}</span></div>
                <div class="stat-row"><span class="stat-label">Drive Tech Stage:</span> <span class="stat-value">${safeJump.driveStage} (E = ${safeJump.E})</span></div>
                <div class="stat-row"><span class="stat-label">Engineer Qualifications:</span> <span class="stat-value">Rank ${this.ship.engineerSkill || 0} + JD ${this.ship.jumpDriveSpecialty || 0} (Skill ${safeJump.totalEngineerSkill})</span></div>
                <div class="stat-row"><span class="stat-label">Safe Distance (D):</span> <span class="stat-value good">${safeJump.safeDiameters} Diameters</span></div>
                <div class="stat-row"><span class="stat-label">Armor Mod / Flash:</span> <span class="stat-value">${safeJump.armorMod} / ${safeJump.flash}</span></div>
                <div class="stat-row"><span class="stat-label">Misjump Risk (X):</span> <span class="stat-value ${jumpIntf.riskClass}">X = ${jumpIntf.X} (${jumpIntf.misjumpRisk})</span></div>
                <button type="button" class="roster-view-btn" id="btn-quick-astrogation">Configure Jump Fields</button>
                ` : `
                <div class="stat-row"><span class="stat-label">Jump Status:</span> <span class="stat-value warning">No Jump Drive Fitted</span></div>
                <div style="font-size:0.82em; color:var(--text-muted); margin: 4px 0 8px 0;">Install a Jump, Hop, or Skip Drive to configure Jump Fields.</div>
                <button type="button" class="roster-view-btn" id="btn-quick-astrogation" disabled style="opacity:0.5; cursor:not-allowed;" title="Requires Jump Drive">Configure Jump Fields (Drive Required)</button>
                `}
            </div>

            <div class="stat-section">
                <div class="stat-header">Automated Crew Engine (Sec 20/24/25):</div>
                <div class="stat-row">
                    <span class="stat-label">Staffing Model:</span>
                    <span class="stat-value">
                        <select id="stats-staffing-model" style="background:var(--bg-input); color:var(--text-main); border:1px solid var(--border-color); border-radius:3px; padding:2px 6px;">
                            <option value="Merchant" ${staffingModel === 'Merchant' ? 'selected' : ''}>Merchant / Commercial</option>
                            <option value="Naval" ${staffingModel === 'Naval' ? 'selected' : ''}>Naval / Military</option>
                            <option value="Scout" ${staffingModel === 'Scout' ? 'selected' : ''}>Scout / Survey</option>
                        </select>
                    </span>
                </div>
                <div class="stat-row"><span class="stat-label">Total Crew Required:</span> <span class="stat-value ${this.ship.totalCrewBerths >= crewReq.totalCrew ? 'good' : 'warning'}">${crewReq.totalCrew} Personnel (${crewReq.totalOfficers} Officers, ${crewReq.totalEnlisted} Enlisted)</span></div>
                ${crewReq.totalStewards > 0 ? `<div class="stat-row"><span class="stat-label">Stewards Required:</span> <span class="stat-value">${crewReq.totalStewards} Stewards</span></div>` : ''}
                ${crewReq.totalTroops > 0 ? `<div class="stat-row"><span class="stat-label">Marine Detachment:</span> <span class="stat-value">${crewReq.totalTroops} Troopers</span></div>` : ''}
                <div class="stat-row"><span class="stat-label">Berthing Status:</span> <span class="stat-value ${this.ship.totalCrewBerths >= crewReq.totalCrew ? 'good' : 'warning'}">${this.ship.totalCrewBerths >= crewReq.totalCrew ? 'Adequate' : `Deficit (-${crewReq.totalCrew - this.ship.totalCrewBerths} Berths)`}</span></div>
                <button type="button" class="roster-view-btn" id="btn-view-roster">View Full Crew Hierarchy Roster</button>
            </div>

            <div class="stat-section">
                <div class="stat-header">Life Support & Endurance (Sec 17/21):</div>
                <div class="stat-row"><span class="stat-label">Total Souls on Board:</span> <span class="stat-value">${lsStatus.totalSouls} souls (${lsStatus.activeOccupants} Active, ${lsStatus.cryoOccupants} Cryo)</span></div>
                <div class="stat-row"><span class="stat-label">Mission Endurance:</span> <span class="stat-value ${lsStatus.daysEndurance >= 30 ? 'good' : 'warning'}">${lsStatus.daysEndurance} Days (${lsStatus.monthsEndurance} Months)</span></div>
                <div class="stat-row"><span class="stat-label">Effective Person-Days:</span> <span class="stat-value">${lsStatus.totalPersonDays.toLocaleString()} p-days</span></div>
                ${lsStatus.recyclerCount > 0 ? `<div class="stat-row"><span class="stat-label">Closed-Loop Recycling:</span> <span class="stat-value good">${lsStatus.recyclerCount} Unit(s) (+${Math.round((lsStatus.recyclerMultiplier - 1) * 100)}% Eff)</span></div>` : ''}
            </div>
            
            <div class="stat-section">
                <div class="stat-header">Controls & Computers (Sec 18/22):</div>
                <div class="stat-row"><span class="stat-label">Total Mechanisms:</span> <span class="stat-value">${totalMechanisms}</span></div>
                <div class="stat-row"><span class="stat-label">Control Panels (P):</span> <span class="stat-value">${this.ship.totalControlPanels} CP</span></div>
                <div class="stat-row"><span class="stat-label">Consoles Installed:</span> <span class="stat-value">${this.ship.totalConsoleCount} (${this.ship.totalConsoleTons.toFixed(1)} tons)</span></div>
                <div class="stat-row"><span class="stat-label">Control Ergonomics (E):</span> <span class="stat-value ${this.ship.controlErgonomics >= 1 ? 'good' : 'warning'}">E = ${this.ship.controlErgonomics} (${this.ship.controlErgonomicsRatio} t/CP)</span></div>
                <div class="stat-row"><span class="stat-label">Computer Cells (C):</span> <span class="stat-value ${this.ship.totalComputerCells >= this.ship.totalConsoleCount ? 'good' : 'warning'}">${this.ship.totalComputerCells} Cells / ${this.ship.totalConsoleCount} Consoles ${this.ship.totalComputerCells < this.ship.totalConsoleCount ? '(Deficit)' : '(Supported)'}</span></div>
                ${this.ship.computers.length > 0 ? `<div class="stat-row"><span class="stat-label">Computers Installed:</span> <span class="stat-value">${this.ship.computers.length} unit${this.ship.computers.length > 1 ? 's' : ''} (${this.ship.computers.reduce((s, c) => s + c.tons, 0).toFixed(1)}t, MCr${this.ship.computers.reduce((s, c) => s + c.cost, 0).toFixed(1)})</span></div>` : ''}
                <div class="stat-row"><span class="stat-label">Hardpoints:</span> <span class="stat-value ${this.ship.hardpointsUsed > this.ship.maxHardpoints ? 'warning' : 'good'}">${this.ship.hardpointsUsed} / ${this.ship.maxHardpoints} Used</span></div>
                ${this.ship.maxFirmpoints > 0 && this.ship.tonnage < 100 ? `<div class="stat-row"><span class="stat-label">Firmpoints:</span> <span class="stat-value ${this.ship.firmpointsUsed > this.ship.maxFirmpoints ? 'warning' : 'good'}">${this.ship.firmpointsUsed} / ${this.ship.maxFirmpoints} Used</span></div>` : ''}
            </div>

            <div class="stat-section">
                <div class="stat-header">Overall Ship:</div>
                <div class="stat-row"><span class="stat-label">Total Cost:</span> <span class="stat-value">MCr${totalCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span></div>
                <div class="stat-row"><span class="stat-label">Total Tonnage:</span> <span class="stat-value">${this.ship.tonnage.toLocaleString()} tons</span></div>
                <div class="stat-row"><span class="stat-label">Tonnage Used:</span> <span class="stat-value">${totalTonnageUsed.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</span></div>
                <div class="stat-row"><span class="stat-label">Tonnage Available:</span> <span class="stat-value ${tonnageRemaining < 0 ? 'warning' : 'good'}">${tonnageRemaining.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</span></div>
                <div class="stat-row"><span class="stat-label">Average AV:</span> <span class="stat-value">${Math.max(0, Math.floor(this.ship.subhulls.reduce((sum, h) => sum + (this.ship.getSubhullAV(h) * h.tons), 0) / Math.max(1, this.ship.tonnage)))}</span></div>
            </div>
            ${armamentHtml}
            ${drivePerfHtml}
            ${deployedPerfHtml}
        `;

        document.getElementById('stats-staffing-model')?.addEventListener('change', (e) => {
            this.currentStaffingModel = e.target.value;
            this.renderRightPanel();
        });

        document.getElementById('btn-view-roster')?.addEventListener('click', () => {
            this.openCrewRosterModal();
        });

        document.getElementById('btn-quick-mission')?.addEventListener('click', () => {
            this.openMissionCodeDialog();
        });

        document.getElementById('btn-quick-astrogation')?.addEventListener('click', () => {
            if (!this.ship.hasJumpDrive) {
                this.showNotificationBanner("⚠️ A Jump, Hop, or Skip Drive must be installed on the vessel before Jump Fields can be configured.");
                return;
            }
            this.openJumpFieldsDialog();
        });
        document.getElementById('btn-quick-jumpfields')?.addEventListener('click', () => {
            if (!this.ship.hasJumpDrive) {
                this.showNotificationBanner("⚠️ A Jump, Hop, or Skip Drive must be installed on the vessel before Jump Fields can be configured.");
                return;
            }
            this.openJumpFieldsDialog();
        });
    }

    showNotificationBanner(message, duration = 6000) {
        const existing = document.getElementById('ship-notification-banner');
        if (existing) existing.remove();
        const banner = document.createElement('div');
        banner.id = 'ship-notification-banner';
        banner.className = 'notification-banner';
        banner.innerHTML = `<span>${message}</span><button class="banner-dismiss" onclick="this.parentElement.remove()">✕</button>`;
        const controlsBar = document.querySelector('.controls-bar');
        if (controlsBar) controlsBar.insertAdjacentElement('afterend', banner);
        else document.body.insertAdjacentElement('afterbegin', banner);
        if (duration > 0) setTimeout(() => { if (document.body.contains(banner)) banner.remove(); }, duration);
    }

    showDialog(title, content, onAccept, footerHtml = '') {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.innerHTML = `
            <h2>${title}</h2>
            <div class="dialog-content">${content}</div>
            <div class="dialog-buttons">
                <div class="dialog-footer-left">${footerHtml}</div>
                <div class="dialog-footer-right">
                    <button id="cancel-button">Cancel</button>
                    <button id="accept-button" class="confirm-btn">Accept</button>
                </div>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        document.getElementById('accept-button').addEventListener('click', () => {
            try {
                if (onAccept) onAccept();
            } catch (err) {
                console.error("Dialog Acceptance Error:", err);
                alert("Error saving component: " + err.message);
            } finally {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            }
        });
        document.getElementById('cancel-button').addEventListener('click', () => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        });
    }
}

function initShipHelperApp() {
    document.querySelectorAll('.collapsible').forEach(function (collapsible) {
        if (!collapsible._hasCollapsibleListener) {
            collapsible._hasCollapsibleListener = true;
            collapsible.addEventListener('click', function () {
                this.classList.toggle('active');
                const content = this.parentElement.querySelector('.content');
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    content.style.display = 'block';
                }
            });
        }
    });
    new ShipHelperView();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShipHelperApp);
} else {
    initShipHelperApp();
}

export default ShipHelperView;