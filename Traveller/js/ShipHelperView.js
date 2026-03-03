import * as ShipHelper from './ShipHelper.js';
window.getAvailableTechStages = ShipHelper.getAvailableTechStages;
window.getDrivePerformance = ShipHelper.getDrivePerformance;
window.buildDrive = ShipHelper.buildDrive;
// ShipHelperView.js
class ShipHelperView {
    constructor() {
        this.ship = new ShipHelper.Hull(
            parseInt(document.getElementById('base-tl').value),
            parseFloat(document.getElementById('ship-tonnage').value),
            document.getElementById('hull-config').value
        );
        this.initEventListeners();
        this.render();
    }

    initEventListeners() {
        document.getElementById('base-tl').addEventListener('change', (e) => {
            this.ship.setBaseTL(parseInt(e.target.value));
            this.render();
        });
        document.getElementById('ship-tonnage').addEventListener('change', (e) => {
            this.ship.setTonnage(parseFloat(e.target.value));
            this.render();
        });
        document.getElementById('hull-config').addEventListener('change', (e) => {
            this.ship.setConfiguration(e.target.value);
            this.render();
        });

        // Setup component list clicks
        const driveItems = document.querySelectorAll('.drive-item');
        driveItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('unavailable')) {
                    return;
                }
                const driveType = e.target.getAttribute('data-drive-type');
                this.openDriveDialog(driveType);
            });
        });

        // Setup generic component list clicks
        const genericItems = document.querySelectorAll('.generic-item');
        genericItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const componentType = e.target.getAttribute('data-component-type');
                this.openGenericDialog(componentType);
            });
        });
    }

    openDriveDialog(driveType, editIndex = -1) {
        let classOptions = '';
        const availableStages = ShipHelper.getAvailableTechStages(this.ship.baseTL, driveType);
        if (availableStages.length === 0) {
            alert(`No ${driveType} technology available at TL-${this.ship.baseTL}`);
            return;
        }

        // Determine defaults based on whether we are editing or creating new
        let defaultClass = "A";
        let defaultTL = this.ship.baseTL;
        let defaultNexus = 1;

        let defaultStageValue = availableStages[0].stage;
        const standardStage = availableStages.find(s => s.stage === 'Standard');
        if (standardStage) {
            try {
                // Determine Performance of Standard drive for given ship tonnage
                const tempDrive = ShipHelper.buildDrive('Standard', 1, "A", driveType, this.ship.baseTL);
                const standardPerf = ShipHelper.getDrivePerformance(tempDrive, this.ship.tonnage).potential;

                const modifiedStage = availableStages.find(s => s.stage === 'Modified');
                const improvedStage = availableStages.find(s => s.stage === 'Improved');

                if (modifiedStage && Math.floor(modifiedStage.eff) >= standardPerf) {
                    defaultStageValue = 'Modified';
                } else if (improvedStage && Math.floor(improvedStage.eff) >= standardPerf) {
                    defaultStageValue = 'Improved';
                } else {
                    defaultStageValue = 'Standard';
                }
            } catch (err) {
                console.error("Error determining default tech stage:", err);
            }
        } else {
            // Find the lowest stage (reading from right to left array end) that gives us eff >= 1
            const viableStages = availableStages.slice().reverse().filter(s => Math.floor(s.eff) >= 1);
            if (viableStages.length > 0) {
                defaultStageValue = viableStages[0].stage;
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
                    <input type="checkbox" id="dialog-import-fee" ${editIndex >= 0 && this.ship.drives[editIndex].importFee ? 'checked' : ''}>
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
                    this.ship.drives[editIndex] = drive;
                } else {
                    this.ship.addDrive(drive);

                    // Auto-link a minimal fuel tank if the drive consumes fuel
                    const fuelTons = drive.driveType === 'PowerPlant' ? rawPerf.fuelConsumption : rawPerf.minConsumption;

                    if (fuelTons && fuelTons > 0) {
                        const fuelComp = {
                            isGeneric: true,
                            name: 'Fuel Tank',
                            label: `Auto-Linked (${drive.driveType})`,
                            linkedDriveIndex: this.ship.drives.length - 1,
                            tons: fuelTons,
                            cost: 0
                        };
                        this.ship.addDrive(fuelComp);
                    }
                }
                this.render();
            } catch (err) {
                alert(err.message);
            }
        });

        // Add listeners for live preview updates
        const updatePreview = () => {
            const driveClass = document.getElementById('dialog-drive-class').value;
            const techStage = document.getElementById('dialog-tech-stage').value;
            const tl = parseInt(document.getElementById('dialog-tl').value, 10);
            const nexus = parseInt(document.getElementById('dialog-nexus').value, 10);
            const perfSlider = document.getElementById('dialog-perf-limit');
            const perfVal = document.getElementById('dialog-perf-limit-val');
            const importFee = document.getElementById('dialog-import-fee').checked;

            try {
                const drivePreview = ShipHelper.buildDrive(techStage, nexus, driveClass, driveType, tl, importFee);
                const rawPerf = ShipHelper.getDrivePerformance(drivePreview, this.ship.tonnage);

                if (perfSlider) {
                    perfSlider.max = rawPerf.potential;
                    let limit = parseInt(perfSlider.value, 10);
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
        let defaultTons = 10;
        let defaultLabel = '';
        let defaultLinkedIndex = -1;

        if (editIndex >= 0) {
            defaultTons = this.ship.drives[editIndex].tons;
            defaultLabel = this.ship.drives[editIndex].label || '';
            if (this.ship.drives[editIndex].linkedDriveIndex !== undefined) {
                defaultLinkedIndex = this.ship.drives[editIndex].linkedDriveIndex;
            }
        }

        let linkHTML = '';
        if (componentType === 'Fuel Tank') {
            let options = '<option value="-1">None</option>';
            this.ship.drives.forEach((comp, idx) => {
                const validDrives = ["PowerPlant", "Jump", "Hop", "Skip", "HEPlaR"];
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

        const content = `
            <div style="margin-bottom: 15px;">
                <label>Custom Label:</label>
                <input type="text" id="dialog-generic-label" value="${defaultLabel}" placeholder="(Optional)" style="width: 150px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Tonnage:</label>
                <div>
                    <button type="button" class="tons-btn" data-val="-100">-100</button>
                    <button type="button" class="tons-btn" data-val="-10">-10</button>
                    <input type="number" id="dialog-generic-tons" value="${defaultTons}" min="1" step="1" style="width: 80px; display:inline-block; margin: 0 5px;">
                    <button type="button" class="tons-btn" data-val="10">+10</button>
                    <button type="button" class="tons-btn" data-val="100">+100</button>
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
                const tons = parseFloat(tonsInput.value);
                const customLabel = labelInput ? labelInput.value.trim() : '';
                const linkedIdx = linkInput ? parseInt(linkInput.value, 10) : -1;

                if (tons > 0) {
                    const comp = {
                        isGeneric: true,
                        name: componentType,
                        label: customLabel,
                        linkedDriveIndex: linkedIdx >= 0 ? linkedIdx : undefined,
                        tons: tons,
                        cost: 0
                    };
                    if (editIndex >= 0) {
                        this.ship.drives[editIndex] = comp;
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
                const tons = parseFloat(tonsInput.value) || 0;
                let linkedPerfStr = '';

                if (linkInput) {
                    const linkedIdx = parseInt(linkInput.value, 10);
                    if (linkedIdx >= 0 && this.ship.drives[linkedIdx]) {
                        const linkedDrive = this.ship.drives[linkedIdx];
                        const drivePerf = ShipHelper.getDrivePerformance(linkedDrive, this.ship.tonnage);
                        const requiredFuelPerUnit = drivePerf.minConsumption || drivePerf.fuelConsumption || 0;

                        if (requiredFuelPerUnit > 0) {
                            // Calculate how many units this tank supports based on the linked drive's consumption per unit
                            const unitsSupported = Math.floor((tons / requiredFuelPerUnit) * 10) / 10;
                            let unitName = "uses";
                            if (linkedDrive.driveType === "PowerPlant") unitName = "months";
                            else if (linkedDrive.driveType === "Jump") unitName = "Parsecs"; // e.g. Jump 1 uses 10%, Jump 2 uses 20%, so if we have fuel for Jump 1, we have 1 parsec of jump capacity. Actually, fuel required is per jump. We'll say "jumps at max rating" or similar. But user said "half fuel for Jump 2 = enough for Jump 1". That means fuel is linear per parsec for Jump drives (usually 10% per parsec).
                            else if (linkedDrive.driveType === "Hop") unitName = "hops";
                            else if (linkedDrive.driveType === "Skip") unitName = "skips";
                            else if (linkedDrive.driveType === "HEPlaR") unitName = "burns";

                            linkedPerfStr = `<div class="preview-stat" style="color:var(--accent-cyan)">Supports: ${unitsSupported} ${unitName}</div>`;
                        } else {
                            linkedPerfStr = `<div class="preview-stat" style="color:#aaa">Drive consumes no fuel per unit.</div>`;
                        }
                    }
                }

                document.getElementById('generic-preview').innerHTML = `
                    <div class="preview-title">Preview:</div>
                    <div class="preview-stat">Cost: MCr0.0</div>
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

    render() {
        this.updateAvailableComponents();
        this.renderCenterPanel();
        this.renderRightPanel();
    }

    updateAvailableComponents() {
        const driveItems = document.querySelectorAll('.drive-item');
        driveItems.forEach(item => {
            const driveType = item.getAttribute('data-drive-type');
            const availableStages = ShipHelper.getAvailableTechStages(this.ship.baseTL, driveType);
            if (availableStages.length === 0) {
                item.classList.add('unavailable');
            } else {
                item.classList.remove('unavailable');
            }
        });
    }

    renderCenterPanel() {
        const center = document.getElementById('current-components');
        center.innerHTML = '';

        if (this.ship.drives.length === 0) {
            center.innerHTML = '<p style="color: #666; font-style: italic;">No components added.</p>';
            return;
        }

        const ul = document.createElement('div');
        ul.className = 'components-list';

        this.ship.drives.forEach((comp, index) => {
            const li = document.createElement('div');
            li.className = 'component-card';

            if (comp.isGeneric) {
                let labelHtml = comp.label ? `<span style="font-size:0.9em; color:#aaa"> - ${comp.label}</span>` : '';
                let linkedPerfStr = '';
                if (comp.name === 'Fuel Tank' && comp.linkedDriveIndex !== undefined && this.ship.drives[comp.linkedDriveIndex]) {
                    const linkedDrive = this.ship.drives[comp.linkedDriveIndex];
                    const drivePerf = ShipHelper.getDrivePerformance(linkedDrive, this.ship.tonnage);
                    const fuelPerUnit = drivePerf.minConsumption || drivePerf.fuelConsumption || 0;
                    if (fuelPerUnit > 0) {
                        const unitsSupported = Math.floor((comp.tons / fuelPerUnit) * 10) / 10;
                        let unitName = "uses";
                        if (linkedDrive.driveType === "PowerPlant") unitName = "months";
                        else if (linkedDrive.driveType === "Jump") unitName = "Parsecs";
                        else if (linkedDrive.driveType === "Hop") unitName = "hops";
                        else if (linkedDrive.driveType === "Skip") unitName = "skips";
                        else if (linkedDrive.driveType === "HEPlaR") unitName = "burns";

                        linkedPerfStr = `<div class="component-perf">Supports: ${unitsSupported} ${unitName} (${linkedDrive.driveType})</div>`;
                    }
                }

                li.innerHTML = `
                    <div class="component-info">
                        <div class="component-title">${comp.name}${labelHtml}</div>
                        <div class="component-details">MCr${comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} - ${comp.tons.toLocaleString()} tons</div>
                        ${linkedPerfStr}
                    </div>
                `;
            } else {
                const perf = ShipHelper.getDrivePerformance(comp, this.ship.tonnage);

                li.innerHTML = `
                    <div class="component-info">
                        <div class="component-title">${comp.driveType} (Class ${comp.driveClass})</div>
                        <div class="component-details">TL-${comp.tl} ${comp.stage}, EP: ${comp.ep}</div>
                        <div class="component-details">MCr${comp.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} - ${comp.tons.toLocaleString()} tons</div>
                        <div class="component-perf">Perf: ${perf.potential} (${perf.note})</div>
                    </div>
                `;
            }

            li.addEventListener('click', () => {
                if (comp.isGeneric) {
                    this.openGenericDialog(comp.name, index);
                } else {
                    this.openDriveDialog(comp.driveType, index);
                }
            });

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = (e) => {
                e.stopPropagation(); // prevent opening the edit dialog
                this.ship.removeDriveAtIndex(index);
                this.render();
            };

            li.appendChild(removeBtn);
            ul.appendChild(li);
        });

        center.appendChild(ul);
    }

    renderRightPanel() {
        const stats = document.getElementById('ship-stats');

        // Calculate totals
        let totalCost = this.ship.baseCost;
        let totalTonnageUsed = 0;

        this.ship.drives.forEach(d => {
            totalCost += d.cost;
            totalTonnageUsed += d.tons;
        });

        const tonnageRemaining = this.ship.tonnage - totalTonnageUsed;

        stats.innerHTML = `
            <div class="stat-section">
                <div class="stat-header">Hull Configurations:</div>
                <div class="stat-row"><span class="stat-label">Type:</span> <span class="stat-value">${this.ship.configurationType}</span></div>
                <div class="stat-row"><span class="stat-label">Base Cost:</span> <span class="stat-value">MCr${this.ship.baseCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span></div>
                <div class="stat-row"><span class="stat-label">Friction:</span> <span class="stat-value">${this.ship.configuration.friction}</span></div>
                <div class="stat-row"><span class="stat-label">Agility:</span> <span class="stat-value">${this.ship.configuration.agility}</span></div>
            </div>
            
            <div class="stat-section">
                <div class="stat-header">Overall Ship:</div>
                <div class="stat-row"><span class="stat-label">Total Cost:</span> <span class="stat-value">MCr${totalCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span></div>
                <div class="stat-row"><span class="stat-label">Total Tonnage:</span> <span class="stat-value">${this.ship.tonnage.toLocaleString()} tons</span></div>
                <div class="stat-row"><span class="stat-label">Tonnage Used:</span> <span class="stat-value">${totalTonnageUsed.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</span></div>
                <div class="stat-row"><span class="stat-label">Tonnage Available:</span> <span class="stat-value ${tonnageRemaining < 0 ? 'warning' : 'good'}">${tonnageRemaining.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</span></div>
            </div>
        `;
    }

    showDialog(title, content, onAccept) {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.innerHTML = `
            <h2>${title}</h2>
            <div class="dialog-content">${content}</div>
            <div class="dialog-buttons">
                <button id="cancel-button">Cancel</button>
                <button id="accept-button" class="confirm-btn">Accept</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        document.getElementById('accept-button').addEventListener('click', () => {
            if (onAccept) onAccept();
            document.body.removeChild(overlay);
        });
        document.getElementById('cancel-button').addEventListener('click', () => {
            document.body.removeChild(overlay);
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