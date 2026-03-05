import * as ShipHelper from './ShipHelper.js';
window.getAvailableTechStages = ShipHelper.getAvailableTechStages;
window.getDrivePerformance = ShipHelper.getDrivePerformance;
window.buildDrive = ShipHelper.buildDrive;
// ShipHelperView.js
class ShipHelperView {
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
                    this.ship.updateComponent(editIndex, drive);
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
                        this.ship.addDrive(fuelComp);
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

                document.getElementById('drive-preview').innerHTML = `
                    <div class="preview-title">Preview:</div>
                    <div class="preview-stat">Cost: MCr${drivePreview.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                    <div class="preview-stat">Tonnage: ${drivePreview.tons.toLocaleString()} tons</div>
                    <div class="preview-stat">Performance: ${perf.potential.toLocaleString()}</div>
                    <div class="preview-stat">Fuel Consumption: ${perf.note}</div>
                `;
            } catch (err) {
                document.getElementById('drive-preview').innerHTML = `<span style="color:var(--accent-purple)">Error: ${err.message}</span>`;
            }
        };

        document.getElementById('dialog-drive-class').addEventListener('change', updatePreview);
        document.getElementById('dialog-tech-stage').addEventListener('change', updatePreview);
        document.getElementById('dialog-perf-limit').addEventListener('input', updatePreview);
        document.getElementById('dialog-import-fee').addEventListener('change', updatePreview);
        document.getElementById('dialog-tl').addEventListener('change', () => {
            const tl = parseInt(document.getElementById('dialog-tl').value, 10);

            // Auto check import fee if TL is different from ship's base TL
            const importFeeCb = document.getElementById('dialog-import-fee');
            if (tl !== this.ship.baseTL) {
                importFeeCb.checked = true;
            } else {
                importFeeCb.checked = false;
            }

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
        document.getElementById('dialog-nexus').addEventListener('change', updatePreview);

        updatePreview();
    }

    openGenericDialog(componentType, editIndex = -1) {
        const isRods = componentType === 'Fuel Rods';
        let defaultValue = isRods ? 10 : 10;
        let defaultLabel = '';
        let defaultLinkedIndex = -1;

        if (editIndex >= 0) {
            const currentTons = this.ship.drives[editIndex].tons;
            defaultValue = isRods ? Math.round(currentTons * 200) : currentTons;
            defaultLabel = this.ship.drives[editIndex].label || '';
            if (this.ship.drives[editIndex].linkedDriveIndex !== undefined) {
                defaultLinkedIndex = this.ship.drives[editIndex].linkedDriveIndex;
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
            this.ship.drives.forEach((comp, idx) => {
                if (!comp.isGeneric && validDrives.includes(comp.driveType)) {
                    const sel = (idx === defaultLinkedIndex) ? 'selected' : '';
                    options += `<option value="${idx}" ${sel}>${comp.driveType} (Class ${comp.driveClass})</option>`;
                }
            });
            linkHTML = `
                <div style="margin-bottom: 15px;">
                    <label>Linked To:</label>
                    <select id="dialog-generic-link">${options}</select>
                </div>
            `;
        }

        const inputLabel = isRods ? 'Rods (increments of 10):' : 'Tonnage:';
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
                        this.ship.addDrive(comp);
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

                document.getElementById('generic-preview').innerHTML = `
                    <div class="preview-title">Preview:</div>
                    <div class="preview-stat">Cost: MCr${cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                    ${isRods ? `<div class="preview-stat">${inputLabel} ${inputVal.toLocaleString()}</div>` : ''}
                    <div class="preview-stat">Tonnage: ${tons.toLocaleString()} tons</div>
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

        const content = `
            <div style="margin-bottom: 15px;">
                <label>Name:</label>
                <input type="text" id="dialog-hull-name" value="${defaultName}" style="width: 150px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Tech Level:</label>
                <input type="number" id="dialog-hull-tl" value="${defaultTL}" min="0" max="33" style="width: 50px;">
                <label style="display: inline-flex; align-items: center; cursor: pointer; color: var(--text-main); margin-left:15px; font-size:14px;">
                    <input type="checkbox" id="dialog-hull-import" ${defaultTL !== this.ship.baseTL ? 'checked' : ''}> Import Fee (10%)
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

            if (editIndex >= 0) {
                this.ship.updateSubhull(editIndex, hName, hTons, hTL, hConfig, hArmorType, hArmorLayers);
            } else {
                this.ship.addSubhull(hName, hTons, hTL, hConfig, isPod, hArmorType, hArmorLayers);
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
            const allItems = category.querySelectorAll('.drive-item, .generic-item');

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

        let globalCompIdx = 0;

        this.ship.subhulls.forEach((hull, hIdx) => {
            const hullContainer = document.createElement('div');
            hullContainer.className = 'subhull-container';
            if (this.ship.selectedSubhullIndex === hIdx) {
                hullContainer.classList.add('selected-hull');
            }

            const isSelected = this.ship.selectedSubhullIndex === hIdx ? 'checked' : '';
            const flat = hull.isPod ? ShipHelper.ENUM_HULL_CONFIG[hull.config].podflatcost : ShipHelper.ENUM_HULL_CONFIG[hull.config].flatcost;
            const hullCost = (hull.tons * ShipHelper.ENUM_HULL_CONFIG[hull.config].cost + flat);
            const armorTons = this.ship.getSubhullArmorTons(hull);
            const subhullAV = this.ship.getSubhullAV(hull);

            // Subhull natively consumes its own armor tons
            const consumedTons = hull.components.reduce((sum, comp) => sum + comp.tons, 0) + armorTons;

            // Hull Header
            hullContainer.innerHTML = `
                <div class="subhull-header">
                    <label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                        <input type="radio" name="hull-selection" value="${hIdx}" ${isSelected}>
                        <strong>${hull.name}</strong>
                    </label>
                    <div style="font-size: 0.9em; flex-grow: 1; margin-left:15px; display:flex; gap: 15px; flex-wrap: wrap;">
                         <span>TL-${hull.tl}</span>
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

            if (hull.components.length === 0) {
                ul.innerHTML = '<div style="color: #555; font-style: italic; padding: 5px 10px;">Empty</div>';
            } else {
                hull.components.forEach((comp) => {
                    const li = document.createElement('div');
                    li.className = 'component-card';
                    const currentGlobalIdx = globalCompIdx; // capture current value for closures

                    if (comp.isGeneric) {
                        let labelHtml = comp.label ? `<span style="font-size:0.9em; color:#aaa"> - ${comp.label}</span>` : '';
                        let linkedPerfStr = '';
                        let linkIcon = '';

                        if ((comp.name === 'Fuel Tank' || comp.name === 'Fuel Rods') && comp.linkedDriveIndex !== undefined) {
                            const linkedTarget = this.ship.getComponentByIdx(comp.linkedDriveIndex);
                            if (linkedTarget && linkedTarget.component) {
                                linkIcon = '🔗 ';
                                const linkedDrive = linkedTarget.component;
                                const drivePerf = ShipHelper.getDrivePerformance(linkedDrive, this.ship.tonnage);
                                let fuelPerUnit = drivePerf.minConsumption || drivePerf.fuelConsumption || 0;
                                if (linkedDrive.driveType === "Power Plant" || linkedDrive.driveType === "Fission") {
                                    fuelPerUnit = drivePerf.fuelConsumption || 0;
                                }
                                if (fuelPerUnit > 0) {
                                    const isRods = comp.name === 'Fuel Rods';
                                    const amountAvailable = isRods ? Math.round(comp.tons * 200) : comp.tons;
                                    const unitsSupported = Math.floor((amountAvailable / fuelPerUnit) * 10) / 10;
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

                                    linkedPerfStr = `<div class="component-perf">Supports: ${unitsSupported} ${unitName}${itemName}</div>`;
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
                    } else {
                        const perf = ShipHelper.getDrivePerformance(comp, this.ship.tonnage);

                        let perfDisplay = `Perf: ${perf.potential}`;
                        if (comp.driveType === 'M-Drive') {
                            perfDisplay = `Perf: ${perf.potential} (Thrust ${perf.potential}G)`;
                        } else if (comp.driveType === 'G-Drive') {
                            perfDisplay = `Perf: ${perf.potential} (Thrust ${perf.potential}G)`;
                        } else if (comp.driveType === 'NAFAL') {
                            const decimalG = (perf.potential / 10).toFixed(1);
                            perfDisplay = `Perf: ${perf.potential} (${decimalG}G to ${decimalG}C)`;
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
                    }

                    li.addEventListener('click', () => {
                        if (comp.isGeneric) {
                            this.openGenericDialog(comp.name, currentGlobalIdx);
                        } else {
                            this.openDriveDialog(comp.driveType, currentGlobalIdx);
                        }
                    });

                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.className = 'remove-btn';
                    removeBtn.onclick = (e) => {
                        e.stopPropagation(); // prevent opening the edit dialog
                        this.ship.removeComponentAtIndex(currentGlobalIdx);
                        this.render();
                    };

                    li.appendChild(removeBtn);
                    ul.appendChild(li);

                    globalCompIdx++;
                });
            }

            center.appendChild(hullContainer);
        });
    }

    renderRightPanel() {
        const stats = document.getElementById('ship-stats');

        // Update top bar display elements
        const displayTonnage = document.getElementById('display-tonnage');
        if (displayTonnage) displayTonnage.textContent = this.ship.tonnage.toLocaleString();

        const displayConfig = document.getElementById('display-config');
        if (displayConfig) displayConfig.textContent = this.ship.configurationType;

        // Calculate totals
        let totalCost = this.ship.baseCost;
        let totalTonnageUsed = 0;

        this.ship.subhulls.forEach(h => {
            totalTonnageUsed += this.ship.getSubhullArmorTons(h);
        });

        this.ship.drives.forEach(d => {
            totalCost += d.cost;
            totalTonnageUsed += d.tons;
        });

        const tonnageRemaining = this.ship.tonnage - totalTonnageUsed;

        let maxPower = 0;
        let maxJumpPower = 0;
        let mdrivePotential = 0;
        let jumpPotential = 0;
        let hopPotential = 0;
        let skipPotential = 0;
        let nafalPotential = 0;
        this.ship.drives.forEach(d => {
            if (!d.isGeneric) {
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
            }
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
        if (mdrivePotential > 0 || jumpPotential > 0 || hopPotential > 0 || skipPotential > 0 || nafalPotential > 0) {
            drivePerfHtml = `
            <div class="stat-section">
                <div class="stat-header">Drive Performance:</div>
                ${mdrivePotential > 0 ? `<div class="stat-row"><span class="stat-label">Maneuver:</span> <span class="stat-value ${effectiveMDrive < mdrivePotential ? 'warning' : 'good'}">${effectiveMDrive} G${mDriveNote}</span></div>` : ''}
                ${nafalPotential > 0 ? `<div class="stat-row"><span class="stat-label">Interstellar Maneuver:</span> <span class="stat-value ${effectiveNafal < nafalPotential ? 'warning' : 'good'}">${(effectiveNafal / 10).toFixed(1)}G to ${(effectiveNafal / 10).toFixed(1)}C${nafalNote}</span></div>` : ''}
                ${jumpPotential > 0 ? `<div class="stat-row"><span class="stat-label">Jump:</span> <span class="stat-value ${effectiveJump < jumpPotential ? 'warning' : 'good'}">Jump-${effectiveJump}${effectiveJump < jumpPotential ? ' (Power Limited)' : ''}</span></div>` : ''}
                ${hopPotential > 0 ? `<div class="stat-row"><span class="stat-label">Hop:</span> <span class="stat-value ${effectiveHop < hopPotential ? 'warning' : 'good'}">Hop-${effectiveHop}${effectiveHop < hopPotential ? ' (Power Limited)' : ''}</span></div>` : ''}
                ${skipPotential > 0 ? `<div class="stat-row"><span class="stat-label">Skip:</span> <span class="stat-value ${effectiveSkip < skipPotential ? 'warning' : 'good'}">Skip-${effectiveSkip}${effectiveSkip < skipPotential ? ' (Power Limited)' : ''}</span></div>` : ''}
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
                <div class="stat-header">Overall Ship:</div>
                <div class="stat-row"><span class="stat-label">Total Cost:</span> <span class="stat-value">MCr${totalCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span></div>
                <div class="stat-row"><span class="stat-label">Total Tonnage:</span> <span class="stat-value">${this.ship.tonnage.toLocaleString()} tons</span></div>
                <div class="stat-row"><span class="stat-label">Tonnage Used:</span> <span class="stat-value">${totalTonnageUsed.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</span></div>
                <div class="stat-row"><span class="stat-label">Tonnage Available:</span> <span class="stat-value ${tonnageRemaining < 0 ? 'warning' : 'good'}">${tonnageRemaining.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</span></div>
                <div class="stat-row"><span class="stat-label">Average AV:</span> <span class="stat-value">${Math.max(0, Math.floor(this.ship.subhulls.reduce((sum, h) => sum + (this.ship.getSubhullAV(h) * h.tons), 0) / Math.max(1, this.ship.tonnage)))}</span></div>
            </div>
            ${drivePerfHtml}
        `;
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