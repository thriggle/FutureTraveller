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

        // Add export/import functionality
        document.getElementById('export-json').addEventListener('click', () => {
            const data = {
                version: 1,
                baseTL: this.ship.baseTL,
                subhulls: this.ship.subhulls
            };
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const shipName = this.ship.subhulls.length > 0 ? this.ship.subhulls[0].name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'ship';
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
                    if (data.subhulls) {
                        this.ship.setBaseTL(data.baseTL || 12);
                        document.getElementById('base-tl').value = this.ship.baseTL;
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
            const allItems = category.querySelectorAll('.drive-item, .generic-item, .fitting-item, .weapon-item, .defense-item, .sensor-item, .console-item, .computer-item');

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

                // Pre-map components with their global indices before grouping
                const hullComps = hull.components || [];
                const compEntries = hullComps.map((c, i) => ({ comp: c, idx: globalCompIdx + i }));
                globalCompIdx += hullComps.length;

                const weaponEntries   = compEntries.filter(e => e.comp.isWeapon);
                const defenseEntries  = compEntries.filter(e => e.comp.isDefense);
                const sensorEntries   = compEntries.filter(e => e.comp.isSensor);
                const consoleEntries  = compEntries.filter(e => e.comp.isConsole);
                const computerEntries = compEntries.filter(e => e.comp.isComputer);
                const fittingEntries  = compEntries.filter(e => e.comp.isHullFitting || e.comp.name === 'Grapple');
                const fuelPayEntries  = compEntries.filter(e => !e.comp.isHullFitting && e.comp.name !== 'Grapple' && !e.comp.isWeapon && !e.comp.isDefense && !e.comp.isSensor && !e.comp.isConsole && !e.comp.isComputer);

                // Drives group
                if ((hull.drives || []).length > 0) {
                    addGroupHeader('Drives');
                    (hull.drives || []).forEach(comp => {
                        renderDriveCard(comp, globalDriveIdx++);
                    });
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

                // Fuel / Payload group
                if (fuelPayEntries.length > 0) {
                    addGroupHeader('Fuel / Payload');
                    fuelPayEntries.forEach(({ comp, idx }) => renderGenericCard(comp, idx));
                }

                // Fittings group (hull fittings + grapples)
                if (fittingEntries.length > 0) {
                    addGroupHeader('Fittings');
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

        const displayConfig = document.getElementById('display-config');
        if (displayConfig) displayConfig.textContent = this.ship.configurationType;

        // Calculate totals
        let totalCost = this.ship.baseCost;
        let totalTonnageUsed = 0;

        this.ship.subhulls.forEach(h => {
            totalTonnageUsed += this.ship.getSubhullArmorTons(h);
        });

        this.ship.subhulls.forEach(h => {
            (h.drives || []).forEach(d => { totalCost += d.cost; totalTonnageUsed += d.tons; });
            (h.components || []).forEach(c => { totalCost += c.cost; totalTonnageUsed += c.tons; });
        });

        const tonnageRemaining = this.ship.tonnage - totalTonnageUsed;

        // Every hull contributes 1 mechanism for its built-in (hidden) lifters
        let totalMechanisms = this.ship.subhulls.length;
        let maxPower = 0;
        let maxJumpPower = 0;
        let mdrivePotential = 0;
        let jumpPotential = 0;
        let hopPotential = 0;
        let skipPotential = 0;
        let nafalPotential = 0;
        let totalDriveTonnage = 0;
        this.ship.drives.forEach(d => {
            // this.ship.drives now contains ONLY real drives — no guards needed
            totalMechanisms += Math.ceil(d.tons / 35);
            totalDriveTonnage += d.tons;
            const perf = ShipHelper.getDrivePerformance(d, this.ship.tonnage);
            const pot = perf.potential || 0;
            if (d.driveType === 'Power Plant' || d.driveType === 'Fission' || d.driveType === 'Anti-Matter') {
                if (pot > maxPower) maxPower = pot;
                if (pot > maxJumpPower) maxJumpPower = pot;
            } else if (d.driveType === 'Collector') {
                if (pot > maxJumpPower) maxJumpPower = pot;
            } else if (d.driveType === 'M-Drive' || d.driveType === 'G-Drive') {
                if (pot > mdrivePotential) mdrivePotential = pot;
            } else if (d.driveType === 'NAFAL') {
                if (pot > nafalPotential) nafalPotential = pot;
            } else if (d.driveType === 'Jump') {
                if (pot > jumpPotential) jumpPotential = pot;
            } else if (d.driveType === 'Hop') {
                if (pot > hopPotential) hopPotential = pot;
            } else if (d.driveType === 'Skip') {
                if (pot > skipPotential) skipPotential = pot;
            }
        });
        // Hull fittings contribute their own mechanisms value (may be negative, e.g. RemoveLifters)
        // Grapples add 1 each; generic components (fuel, cargo) add 0
        this.ship.subhulls.forEach(h => {
            (h.components || []).forEach(c => {
                if (c.isHullFitting) totalMechanisms += (c.mechanisms ?? 1);
                else if (c.name === 'Grapple') totalMechanisms += 1;
            });
        });

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

        stats.innerHTML = `
            <div class="stat-section">
                <div class="stat-header">Hull Configurations:</div>
                <div class="stat-row"><span class="stat-label">Type:</span> <span class="stat-value">${this.ship.configurationType}</span></div>
                <div class="stat-row"><span class="stat-label">Friction:</span> <span class="stat-value">${this.ship.configuration.friction}</span></div>
                <div class="stat-row"><span class="stat-label">Agility:</span> <span class="stat-value">${this.ship.configuration.agility}</span></div>
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
document.querySelectorAll('.collapsible').forEach(function (collapsible) {
    collapsible.addEventListener('click', function () {
        this.classList.toggle('active');
        const content = this.parentElement.querySelector('.content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    });
});
// Initialize the view when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ShipHelperView();
});

export default ShipHelperView;