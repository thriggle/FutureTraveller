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
    }

    openDriveDialog(driveType) {
        let classOptions = '';
        const availableStages = ShipHelper.getAvailableTechStages(this.ship.baseTL, driveType);
        if (availableStages.length === 0) {
            alert(`No ${driveType} technology available at TL-${this.ship.baseTL}`);
            return;
        }

        const driveClasses = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        for (const key of driveClasses) {
            classOptions += `<option value="${key}">${key} (EP: ${ShipHelper.ENUM_DRIVE_CLASS[key].ep})</option>`;
        }

        let stageOptions = '';
        availableStages.forEach(stage => {
            stageOptions += `<option value="${stage.stage}">${stage.name}</option>`;
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
            <div style="margin-bottom: 15px;">
                <label>Tech Level:</label>
                <input type="number" id="dialog-tl" value="${this.ship.baseTL}" min="0" max="33" style="width: 50px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label>Nexus Multiplier:</label>
                <input type="number" id="dialog-nexus" value="1" min="1" max="9" style="width: 50px;">
            </div>
            <div id="drive-preview" style="background: #f0f0f0; padding: 10px; border: 1px solid #ccc; font-size: 0.9em;">
                <!-- Preview updates here -->
            </div>
        `;

        this.showDialog(`Add ${driveType}`, content, () => {
            const driveClass = document.getElementById('dialog-drive-class').value;
            const techStage = document.getElementById('dialog-tech-stage').value;
            const tl = parseInt(document.getElementById('dialog-tl').value, 10);
            const nexus = parseInt(document.getElementById('dialog-nexus').value, 10);
            try {
                const drive = ShipHelper.buildDrive(techStage, nexus, driveClass, driveType, tl);
                this.ship.addDrive(drive);
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
            try {
                const drivePreview = ShipHelper.buildDrive(techStage, nexus, driveClass, driveType, tl);
                const perf = ShipHelper.getDrivePerformance(drivePreview, this.ship.tonnage);

                document.getElementById('drive-preview').innerHTML = `
                    <strong>Preview:</strong><br>
                    Cost: MCr${drivePreview.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}<br>
                    Tonnage: ${drivePreview.tons.toLocaleString()} tons<br>
                    Performance: ${perf.potential.toLocaleString()}<br>
                    Fuel Consumption: ${perf.note}
                `;
            } catch (err) {
                document.getElementById('drive-preview').innerHTML = `<span style="color:red">Error: ${err.message}</span>`;
            }
        };

        document.getElementById('dialog-drive-class').addEventListener('change', updatePreview);
        document.getElementById('dialog-tech-stage').addEventListener('change', updatePreview);
        document.getElementById('dialog-tl').addEventListener('change', () => {
            const tl = parseInt(document.getElementById('dialog-tl').value, 10);
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

        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.padding = '0';

        this.ship.drives.forEach((drive, index) => {
            const li = document.createElement('li');
            li.style.border = '1px solid #ddd';
            li.style.margin = '10px 0';
            li.style.padding = '10px';
            li.style.background = '#f9f9f9';
            li.style.borderRadius = '5px';
            li.style.position = 'relative';

            const perf = ShipHelper.getDrivePerformance(drive, this.ship.tonnage);

            li.innerHTML = `
                <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 5px;">${drive.driveType} (Class ${drive.driveClass})</div>
                <div style="font-size: 0.9em; color: #444;">TL-${drive.tl} ${drive.stage}, EP: ${drive.ep}</div>
                <div style="font-size: 0.9em; color: #444;">MCr${drive.cost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} - ${drive.tons.toLocaleString()} tons</div>
                <div style="font-size: 0.85em; color: #111; margin-top: 5px; font-style: italic;">Perf: ${perf.potential} (${perf.note})</div>
            `;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '10px';
            removeBtn.style.right = '10px';
            removeBtn.style.padding = '4px 8px';
            removeBtn.onclick = () => {
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
            <div style="margin-bottom: 10px;"><strong>Hull Configurations:</strong><br>
            <ul>
                <li>Type: ${this.ship.configurationType}</li>
                <li>Base Cost: MCr${this.ship.baseCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</li>
                <li>Friction: ${this.ship.configuration.friction}</li>
                <li>Agility: ${this.ship.configuration.agility}</li>
            </ul>
            </div>
            
            <hr>

            <div style="margin-bottom: 10px;"><strong>Overall Ship:</strong><br>
            <ul>
                <li><strong>Total Cost:</strong> MCr${totalCost.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</li>
                <li><strong>Total Tonnage:</strong> ${this.ship.tonnage.toLocaleString()} tons</li>
                <li><strong>Tonnage Used:</strong> ${totalTonnageUsed.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</li>
                <li style="color: ${tonnageRemaining < 0 ? 'red' : 'green'}"><strong>Tonnage Available:</strong> ${tonnageRemaining.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tons</li>
            </ul>
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
                <button id="accept-button" style="background-color: #007bff; color: white; border: 1px solid #0056b3;">Accept</button>
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