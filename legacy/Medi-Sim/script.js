// ============================================
// EHR Simulation Interface - JavaScript
// ============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
    loadAllData();
    // setCurrentDateTime(); // Don't auto-set on load, wait for patient load or manual entry
    setupAutoSave();
    setupFormListeners();

    // Check if we have a patient loaded, if not, clear header
    const demographics = loadData('demographics');
    if (demographics) {
        updateHeader(demographics);
        updateAccountNumberFields(demographics.accountNumber);
    }
});

// ============================================
// Tab Navigation
// ============================================

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// ============================================
// Data Persistence (localStorage)
// ============================================

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        showSaveIndicator();
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function loadData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

function showSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

// ============================================
// Auto-save Setup
// ============================================

function setupAutoSave() {
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.id) {
            // Load saved value
            const savedValue = loadData(`field_${input.id}`);
            if (savedValue !== null && input.type !== 'checkbox' && input.type !== 'radio') {
                input.value = savedValue;
            } else if (input.type === 'checkbox' && savedValue !== null) {
                input.checked = savedValue;
            }

            // Save on change
            input.addEventListener('change', function () {
                if (this.type === 'checkbox') {
                    saveData(`field_${this.id}`, this.checked);
                } else {
                    saveData(`field_${this.id}`, this.value);
                }
            });
        }
    });
}

function setupFormListeners() {
    // Nursing diagnosis dropdown
    const diagnosisSelect = document.getElementById('nursing-diagnosis');
    if (diagnosisSelect) {
        diagnosisSelect.addEventListener('change', function () {
            const customGroup = document.getElementById('custom-diagnosis-group');
            if (this.value === 'other') {
                customGroup.style.display = 'block';
            } else {
                customGroup.style.display = 'none';
            }
        });
    }

    // BMI calculation
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const weightUnit = document.getElementById('weight-unit');
    const heightUnit = document.getElementById('height-unit');

    if (weightInput && heightInput) {
        [weightInput, heightInput, weightUnit, heightUnit].forEach(input => {
            if (input) {
                input.addEventListener('change', calculateBMI);
            }
        });
    }
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const weightUnit = document.getElementById('weight-unit').value;
    const heightUnit = document.getElementById('height-unit').value;

    if (!weight || !height) return;

    // Convert to metric
    let weightKg = weight;
    let heightM = height;

    if (weightUnit === 'lbs') {
        weightKg = weight * 0.453592;
    }

    if (heightUnit === 'in') {
        heightM = height * 0.0254;
    } else if (heightUnit === 'cm') {
        heightM = height / 100;
    }

    const bmi = (weightKg / (heightM * heightM)).toFixed(1);
    document.getElementById('bmi').value = bmi;
}

// ============================================
// Utilities
// ============================================

function setCurrentDateTime() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    // Set default dates/times for various fields
    const dateFields = ['vital-date', 'assessment-date', 'shift-date', 'med-start-date'];
    const timeFields = ['vital-time', 'assessment-time'];

    dateFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value) {
            field.value = dateStr;
        }
    });

    timeFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value) {
            field.value = timeStr;
        }
    });
}

function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

function clearForm(formId) {
    const container = document.getElementById(formId);
    if (!container) return;

    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else if (input.type !== 'date' && input.type !== 'time') {
            input.value = '';
        }
        if (input.id) {
            saveData(`field_${input.id}`, input.type === 'checkbox' ? false : '');
        }
    });

    showSaveIndicator();
}

function clearAllData() {
    localStorage.clear();
    location.reload();
}

// ============================================
// Patient Search Functions
// ============================================

function searchPatient() {
    const searchInput = document.getElementById('patient-search-input').value.trim();

    if (!searchInput) {
        alert('Please enter an MRN or Account Number');
        return;
    }

    // Check if PATIENT_DATABASE exists (from patients.js)
    if (typeof PATIENT_DATABASE === 'undefined') {
        alert('Error: Patient database not loaded.');
        return;
    }

    const patient = PATIENT_DATABASE.find(p =>
        p.mrn === searchInput || p.accountNumber === searchInput
    );

    if (patient) {
        if (confirm(`Found patient: ${patient.lastName}, ${patient.firstName}. \n\nLoading this patient will CLEAR current session data. Continue?`)) {
            loadPatient(patient);
        }
    } else {
        alert('Patient not found. Please check the MRN or Account Number.');
    }
}

function loadPatient(patient) {
    // 1. Clear existing data
    localStorage.clear();

    // 2. Prepare demographics object
    const demographics = {
        mrn: patient.mrn,
        accountNumber: patient.accountNumber,
        lastName: patient.lastName,
        firstName: patient.firstName,
        middleName: patient.middleName,
        dob: patient.dob,
        gender: patient.gender,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        zip: patient.zip,
        phone: patient.phone,
        email: patient.email,
        allergies: patient.allergies,
        codeStatus: patient.codeStatus,
        insuranceProvider: patient.insurance.provider,
        policyNumber: patient.insurance.policyNumber,
        groupNumber: patient.insurance.groupNumber,
        admissionDate: patient.admissionDate,
        emergencyName: patient.emergencyContact.name,
        emergencyRelationship: patient.emergencyContact.relationship,
        emergencyPhone: patient.emergencyContact.phone
    };

    // 3. Save to localStorage
    // 3. Save to localStorage
    saveData('demographics', demographics);

    // 3b. Prepare and save history
    const history = {
        medical: patient.medicalHistory || {},
        surgical: patient.surgicalHistory || '',
        family: patient.familyHistory || {},
        social: patient.socialHistory || {}
    };
    saveData('history', history);
    populateHistoryForm(history);

    // 4. Populate Form Fields
    populateDemographicsForm(demographics);

    // 5. Update Header
    updateHeader(demographics);

    // 6. Update Account Number in other tabs
    updateAccountNumberFields(demographics.accountNumber);

    // 7. Set default dates
    setCurrentDateTime();

    // 8. Clear/Update all other tables to reflect new patient (empty) state
    updateVitalsTable();
    updateMedicationTable();
    updateAdminLog();
    updateCarePlansDisplay();
    updateCommunicationLog();

    // Clear forms that might have leftover data
    clearForm('assessments');
    clearForm('sbar-form'); // Assuming ID, if not will just return

    // Reset BCMA section if open
    document.getElementById('bcma-scanner-section').style.display = 'none';
    document.getElementById('add-medication-form').style.display = 'none';

    alert('Patient loaded successfully.');
}

function populateDemographicsForm(data) {
    const mapping = {
        'mrn': data.mrn,
        'account-number': data.accountNumber,
        'last-name': data.lastName,
        'first-name': data.firstName,
        'middle-name': data.middleName,
        'dob': data.dob,
        'gender': data.gender,
        'address': data.address,
        'city': data.city,
        'state': data.state,
        'zip': data.zip,
        'phone': data.phone,
        'email': data.email,
        'allergies': data.allergies,
        'code-status': data.codeStatus,
        'insurance-provider': data.insuranceProvider,
        'policy-number': data.policyNumber,
        'group-number': data.groupNumber,
        'admission-date': data.admissionDate,
        'emergency-name': data.emergencyName,
        'emergency-relationship': data.emergencyRelationship,
        'emergency-phone': data.emergencyPhone
    };

    for (const [id, value] of Object.entries(mapping)) {
        const field = document.getElementById(id);
        if (field) {
            field.value = value || '';
            // Trigger change event to save to localStorage (auto-save logic)
            saveData(`field_${id}`, value || '');
        }
    }
}

function updateHeader(data) {
    document.getElementById('header-patient-name').textContent =
        `${data.lastName}, ${data.firstName} ${data.middleName ? data.middleName.charAt(0) + '.' : ''}`;
    document.getElementById('header-mrn').textContent = data.mrn || '--';
    document.getElementById('header-account').textContent = data.accountNumber || '--';

    if (data.dob) {
        const age = calculateAge(data.dob);
        const dobFormatted = new Date(data.dob).toLocaleDateString();
        document.getElementById('header-dob').textContent = `${dobFormatted} (${age}y)`;
    } else {
        document.getElementById('header-dob').textContent = '--';
    }

    const allergyBadge = document.getElementById('header-allergies');
    if (data.allergies) {
        const allergyText = data.allergies.split('\n')[0].split('(')[0].trim();
        allergyBadge.textContent = allergyText.toUpperCase();
        allergyBadge.style.display = 'inline-block';
    } else {
        allergyBadge.style.display = 'none';
    }
}

function updateAccountNumberFields(accNum) {
    const fields = ['vitals-account-number', 'meds-account-number'];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.value = accNum || '';
        }
    });
}

function saveDemographics() {
    const demographics = {
        mrn: document.getElementById('mrn').value,
        accountNumber: document.getElementById('account-number').value,
        lastName: document.getElementById('last-name').value,
        firstName: document.getElementById('first-name').value,
        middleName: document.getElementById('middle-name').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        allergies: document.getElementById('allergies').value,
        // Capture other fields for completeness if needed, but these are the core for header
        admissionDate: document.getElementById('admission-date').value
    };

    // Update header
    updateHeader(demographics);
    updateAccountNumberFields(demographics.accountNumber);

    saveData('demographics', demographics);
    alert('Demographics saved successfully!');
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

// ============================================
// Vital Signs Functions
// ============================================

function recordVitals() {
    const vitals = {
        date: document.getElementById('vital-date').value,
        time: document.getElementById('vital-time').value,
        bpSystolic: document.getElementById('bp-systolic').value,
        bpDiastolic: document.getElementById('bp-diastolic').value,
        heartRate: document.getElementById('heart-rate').value,
        respRate: document.getElementById('resp-rate').value,
        temp: document.getElementById('temp').value,
        tempRoute: document.getElementById('temp-route').value,
        spo2: document.getElementById('spo2').value,
        o2Delivery: document.getElementById('o2-delivery').value,
        painScale: document.getElementById('pain-scale').value,
        painLocation: document.getElementById('pain-location').value,
        timestamp: getCurrentDateTime()
    };

    // Validate required fields
    if (!vitals.bpSystolic || !vitals.bpDiastolic) {
        alert('Please enter blood pressure values');
        return;
    }

    // Load existing vitals history
    let vitalsHistory = loadData('vitalsHistory') || [];
    vitalsHistory.unshift(vitals); // Add to beginning
    saveData('vitalsHistory', vitalsHistory);

    updateVitalsTable();
    clearVitalsForm();
    alert('Vital signs recorded successfully!');
}

function updateVitalsTable() {
    const vitalsHistory = loadData('vitalsHistory') || [];
    const tbody = document.getElementById('vitals-history');

    if (vitalsHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No vital signs recorded yet</td></tr>';
        return;
    }

    tbody.innerHTML = vitalsHistory.map((vital, index) => `
        <tr>
            <td>${vital.date} ${vital.time}</td>
            <td>${vital.bpSystolic}/${vital.bpDiastolic}</td>
            <td>${vital.heartRate || '-'}</td>
            <td>${vital.respRate || '-'}</td>
            <td>${vital.temp ? vital.temp + '°F (' + vital.tempRoute + ')' : '-'}</td>
            <td>${vital.spo2 ? vital.spo2 + '%' : '-'}</td>
            <td>${vital.painScale ? vital.painScale + '/10' : '-'}</td>
            <td><button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="deleteVital(${index})">Delete</button></td>
        </tr>
    `).join('');
}

function deleteVital(index) {
    if (confirm('Delete this vital signs entry?')) {
        let vitalsHistory = loadData('vitalsHistory') || [];
        vitalsHistory.splice(index, 1);
        saveData('vitalsHistory', vitalsHistory);
        updateVitalsTable();
    }
}

function clearVitalsForm() {
    const fields = ['bp-systolic', 'bp-diastolic', 'heart-rate', 'resp-rate', 'temp', 'spo2', 'pain-scale', 'pain-location'];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });
    setCurrentDateTime();
}

// ============================================
// Medication Functions
// ============================================

let currentMedIndex = -1; // Track which med is being administered

function showAddMedicationForm() {
    document.getElementById('add-medication-form').style.display = 'block';
    document.getElementById('bcma-scanner-section').style.display = 'none';
}

function hideAddMedicationForm() {
    document.getElementById('add-medication-form').style.display = 'none';
}

function generateBarcode() {
    return 'MED-' + Math.floor(10000 + Math.random() * 90000);
}

function addMedication() {
    const med = {
        name: document.getElementById('med-name').value,
        dose: document.getElementById('med-dose').value,
        route: document.getElementById('med-route').value,
        frequency: document.getElementById('med-frequency').value,
        indication: document.getElementById('med-indication').value,
        startDate: document.getElementById('med-start-date').value,
        status: 'Active',
        lastGiven: null,
        nextDue: null,
        barcodeId: generateBarcode() // Generate barcode
    };

    if (!med.name || !med.dose || !med.route || !med.frequency) {
        alert('Please fill in all required fields');
        return;
    }

    let medications = loadData('medications') || [];
    medications.push(med);
    saveData('medications', medications);

    updateMedicationTable();
    hideAddMedicationForm();

    // Clear form
    ['med-name', 'med-dose', 'med-route', 'med-frequency', 'med-indication', 'med-start-date'].forEach(id => {
        document.getElementById(id).value = '';
    });

    alert('Medication added to MAR!');
}

function updateMedicationTable() {
    const medications = loadData('medications') || [];
    const tbody = document.getElementById('medication-list');

    if (medications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No medications ordered</td></tr>';
        return;
    }

    tbody.innerHTML = medications.map((med, index) => `
        <tr>
            <td><strong>${med.name}</strong><br><small>${med.indication || ''}</small></td>
            <td><code style="background: #eee; padding: 2px 4px; border-radius: 3px;">${med.barcodeId || 'N/A'}</code></td>
            <td>${med.dose} / ${med.route} / ${med.frequency}</td>
            <td>${med.lastGiven || '-'}</td>
            <td>${med.nextDue || 'Calculate'}</td>
            <td><span class="badge badge-success">${med.status}</span></td>
            <td>
                <button class="btn btn-primary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="initiateBCMA(${index})">Scan to Give</button>
                <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="deleteMedication(${index})">Remove</button>
            </td>
        </tr>
    `).join('');
}

function initiateBCMA(index) {
    currentMedIndex = index;
    const medications = loadData('medications') || [];
    const med = medications[index];

    // Show Scanner Section
    const scannerSection = document.getElementById('bcma-scanner-section');
    scannerSection.style.display = 'block';

    // Hide Add Form if open
    document.getElementById('add-medication-form').style.display = 'none';

    // Clear previous inputs
    document.getElementById('scan-patient-id').value = '';
    document.getElementById('scan-med-id').value = ''; // User must type/scan this
    document.getElementById('scan-med-id').readOnly = false; // Allow typing
    document.getElementById('bcma-status').textContent = '';
    document.getElementById('bcma-status').className = '';

    // Scroll to scanner
    scannerSection.scrollIntoView({ behavior: 'smooth' });

    // Focus first input
    document.getElementById('scan-patient-id').focus();
}

function cancelAdministration() {
    document.getElementById('bcma-scanner-section').style.display = 'none';
    currentMedIndex = -1;
}

function confirmAdministration() {
    if (currentMedIndex === -1) return;

    const scannedPatientId = document.getElementById('scan-patient-id').value.trim();
    const scannedMedId = document.getElementById('scan-med-id').value.trim();
    const statusDiv = document.getElementById('bcma-status');
    statusDiv.textContent = 'Verifying...';
    statusDiv.style.color = 'blue';

    // Load current data
    const demographics = loadData('demographics');
    const medications = loadData('medications') || [];
    const med = medications[currentMedIndex];

    // Validation 1: Patient
    if (!demographics || scannedPatientId !== demographics.accountNumber) {
        statusDiv.textContent = 'ERROR: Patient Account Number mismatch!';
        statusDiv.style.color = 'red';
        return;
    }

    // Validation 2: Medication
    if (scannedMedId !== med.barcodeId) {
        statusDiv.textContent = 'ERROR: Medication Barcode mismatch!';
        statusDiv.style.color = 'red';
        return;
    }

    // Success
    statusDiv.textContent = 'MATCH CONFIRMED. Processing administration...';
    statusDiv.style.color = 'green';

    // Proceed to administration logic (with short delay for effect)
    setTimeout(() => {
        administerMedication(currentMedIndex);
        cancelAdministration(); // Close scanner
    }, 1000);
}

function administerMedication(index) {
    const medications = loadData('medications') || [];
    const med = medications[index];

    const initials = prompt('Barcode match confirmed.\n\nEnter your initials to sign off:');
    if (!initials) return;

    const site = (med.route === 'IM' || med.route === 'SubQ') ? prompt('Enter injection site:') : '';

    const adminRecord = {
        dateTime: getCurrentDateTime(),
        medication: med.name,
        dose: med.dose,
        route: med.route,
        site: site || 'N/A',
        initials: initials
    };

    // Update medication last given
    medications[index].lastGiven = getCurrentDateTime();
    saveData('medications', medications);

    // Add to administration log
    let adminLog = loadData('adminLog') || [];
    adminLog.unshift(adminRecord);
    saveData('adminLog', adminLog);

    updateMedicationTable();
    updateAdminLog();
    alert('Medication administered and logged!');
}

function deleteMedication(index) {
    if (confirm('Remove this medication from the MAR?')) {
        let medications = loadData('medications') || [];
        medications.splice(index, 1);
        saveData('medications', medications);
        updateMedicationTable();
    }
}

function updateAdminLog() {
    const adminLog = loadData('adminLog') || [];
    const tbody = document.getElementById('admin-log');

    if (adminLog.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No administrations recorded</td></tr>';
        return;
    }

    tbody.innerHTML = adminLog.map(record => `
        <tr>
            <td>${record.dateTime}</td>
            <td>${record.medication}</td>
            <td>${record.dose}</td>
            <td>${record.route}</td>
            <td>${record.site}</td>
            <td><strong>${record.initials}</strong></td>
        </tr>
    `).join('');
}

// ============================================
// Assessment Functions
// ============================================

function saveAssessment() {
    const assessment = {
        date: document.getElementById('assessment-date').value,
        time: document.getElementById('assessment-time').value,
        type: document.getElementById('assessment-type').value,
        timestamp: getCurrentDateTime()
    };

    // Collect all assessment data
    const assessmentFields = document.querySelectorAll('#assessments input, #assessments select, #assessments textarea');
    assessmentFields.forEach(field => {
        if (field.id && field.id !== 'assessment-date' && field.id !== 'assessment-time' && field.id !== 'assessment-type') {
            if (field.type === 'checkbox') {
                assessment[field.id] = field.checked;
            } else {
                assessment[field.id] = field.value;
            }
        }
    });

    saveData('currentAssessment', assessment);
    alert('Assessment saved successfully!');
}

// ============================================
// Care Plan Functions
// ============================================

function showAddCarePlanForm() {
    document.getElementById('add-careplan-form').style.display = 'block';
}

function hideAddCarePlanForm() {
    document.getElementById('add-careplan-form').style.display = 'none';
}

function addCarePlan() {
    let diagnosis = document.getElementById('nursing-diagnosis').value;

    if (diagnosis === 'other') {
        diagnosis = document.getElementById('custom-diagnosis').value;
    }

    const carePlan = {
        diagnosis: diagnosis,
        relatedTo: document.getElementById('related-to').value,
        evidencedBy: document.getElementById('evidenced-by').value,
        shortTermGoal: document.getElementById('short-term-goal').value,
        longTermGoal: document.getElementById('long-term-goal').value,
        interventions: document.getElementById('interventions').value,
        status: 'Active',
        created: getCurrentDateTime()
    };

    if (!carePlan.diagnosis) {
        alert('Please select or enter a nursing diagnosis');
        return;
    }

    let carePlans = loadData('carePlans') || [];
    carePlans.push(carePlan);
    saveData('carePlans', carePlans);

    updateCarePlansDisplay();
    hideAddCarePlanForm();

    // Clear form
    ['nursing-diagnosis', 'custom-diagnosis', 'related-to', 'evidenced-by', 'short-term-goal', 'long-term-goal', 'interventions'].forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });

    alert('Care plan added successfully!');
}

function updateCarePlansDisplay() {
    const carePlans = loadData('carePlans') || [];
    const container = document.getElementById('active-careplans');

    if (carePlans.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No care plans created yet</p>';
        return;
    }

    container.innerHTML = carePlans.map((plan, index) => `
        <div class="vitals-entry" style="border-left: 4px solid var(--primary-blue);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${plan.diagnosis}</h4>
                    <span class="badge badge-success">${plan.status}</span>
                    <span style="font-size: 0.875rem; color: var(--text-secondary); margin-left: 1rem;">Created: ${plan.created}</span>
                </div>
                <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem;" onclick="deleteCarePlan(${index})">Remove</button>
            </div>
            
            <div style="margin-top: 1rem;">
                <p><strong>Related to:</strong> ${plan.relatedTo || 'Not specified'}</p>
                <p><strong>As evidenced by:</strong> ${plan.evidencedBy || 'Not specified'}</p>
            </div>
            
            <div style="margin-top: 1rem; background-color: var(--bg-main); padding: 1rem; border-radius: var(--border-radius);">
                <h5 style="color: var(--text-primary); margin-bottom: 0.5rem;">Short-Term Goal</h5>
                <p>${plan.shortTermGoal || 'Not specified'}</p>
                
                <h5 style="color: var(--text-primary); margin-top: 1rem; margin-bottom: 0.5rem;">Long-Term Goal</h5>
                <p>${plan.longTermGoal || 'Not specified'}</p>
            </div>
            
            <div style="margin-top: 1rem;">
                <h5 style="color: var(--text-primary); margin-bottom: 0.5rem;">Interventions</h5>
                <pre style="white-space: pre-wrap; font-family: var(--font-family); background-color: var(--bg-main); padding: 1rem; border-radius: var(--border-radius);">${plan.interventions || 'Not specified'}</pre>
            </div>
        </div>
    `).join('');
}

function deleteCarePlan(index) {
    if (confirm('Remove this care plan?')) {
        let carePlans = loadData('carePlans') || [];
        carePlans.splice(index, 1);
        saveData('carePlans', carePlans);
        updateCarePlansDisplay();
    }
}

// ============================================
// Communication Functions
// ============================================

function saveSBAR() {
    const sbar = {
        situation: document.getElementById('sbar-situation').value,
        background: document.getElementById('sbar-background').value,
        assessment: document.getElementById('sbar-assessment').value,
        recommendation: document.getElementById('sbar-recommendation').value,
        timestamp: getCurrentDateTime()
    };

    if (!sbar.situation || !sbar.background || !sbar.assessment || !sbar.recommendation) {
        alert('Please complete all SBAR sections');
        return;
    }

    // Add to communication log
    const logEntry = {
        dateTime: getCurrentDateTime(),
        type: 'SBAR',
        recipient: 'Provider',
        summary: sbar.situation.substring(0, 100) + '...'
    };

    let commLog = loadData('communicationLog') || [];
    commLog.unshift(logEntry);
    saveData('communicationLog', commLog);

    saveData('lastSBAR', sbar);
    updateCommunicationLog();

    alert('SBAR report saved and logged!');
}

function clearSBAR() {
    ['sbar-situation', 'sbar-background', 'sbar-assessment', 'sbar-recommendation'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function saveShiftReport() {
    const report = {
        date: document.getElementById('shift-date').value,
        shift: document.getElementById('shift-type').value,
        oncomingNurse: document.getElementById('oncoming-nurse').value,
        notes: document.getElementById('shift-notes').value,
        timestamp: getCurrentDateTime()
    };

    if (!report.notes) {
        alert('Please enter shift report notes');
        return;
    }

    // Add to communication log
    const logEntry = {
        dateTime: getCurrentDateTime(),
        type: 'Shift Report',
        recipient: report.oncomingNurse || 'Oncoming Nurse',
        summary: report.notes.substring(0, 100) + '...'
    };

    let commLog = loadData('communicationLog') || [];
    commLog.unshift(logEntry);
    saveData('communicationLog', commLog);

    saveData('lastShiftReport', report);
    updateCommunicationLog();

    alert('Shift report saved and logged!');
}

function clearShiftReport() {
    ['shift-notes', 'oncoming-nurse'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function updateCommunicationLog() {
    const commLog = loadData('communicationLog') || [];
    const tbody = document.getElementById('communication-log');

    if (commLog.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No communications logged</td></tr>';
        return;
    }

    tbody.innerHTML = commLog.map((entry, index) => `
        <tr>
            <td>${entry.dateTime}</td>
            <td><span class="badge badge-info">${entry.type}</span></td>
            <td>${entry.recipient}</td>
            <td>${entry.summary}</td>
            <td><button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="deleteCommLog(${index})">Delete</button></td>
        </tr>
    `).join('');
}

function deleteCommLog(index) {
    if (confirm('Delete this communication log entry?')) {
        let commLog = loadData('communicationLog') || [];
        commLog.splice(index, 1);
        saveData('communicationLog', commLog);
        updateCommunicationLog();
    }
}

// ============================================
// Load All Data on Page Load
// ============================================

function loadAllData() {
    updateVitalsTable();
    updateMedicationTable();
    updateAdminLog();
    updateCarePlansDisplay();
    updateCommunicationLog();
    populateHistoryForm(loadData('history'));
}

// ============================================
// Medical History Functions
// ============================================

function saveHistory() {
    const history = {
        medical: {
            htn: document.getElementById('pmh-htn').checked,
            dm: document.getElementById('pmh-dm').checked,
            cad: document.getElementById('pmh-cad').checked,
            copd: document.getElementById('pmh-copd').checked,
            ckd: document.getElementById('pmh-ckd').checked,
            chf: document.getElementById('pmh-chf').checked,
            notes: document.getElementById('pmh-notes').value
        },
        surgical: document.getElementById('psh-notes').value,
        family: {
            cancer: document.getElementById('fh-cancer').checked,
            heart: document.getElementById('fh-heart').checked,
            dm: document.getElementById('fh-dm').checked,
            notes: document.getElementById('fh-notes').value
        },
        social: {
            tobacco: document.getElementById('sh-tobacco').value,
            alcohol: document.getElementById('sh-alcohol').value,
            drugs: document.getElementById('sh-drugs').value,
            occupation: document.getElementById('sh-occupation').value,
            notes: document.getElementById('sh-notes').value
        }
    };

    saveData('history', history);
    alert('Medical history saved successfully!');
}

function populateHistoryForm(data) {
    if (!data) return;

    // Medical History
    if (data.medical) {
        document.getElementById('pmh-htn').checked = data.medical.htn || false;
        document.getElementById('pmh-dm').checked = data.medical.dm || false;
        document.getElementById('pmh-cad').checked = data.medical.cad || false;
        document.getElementById('pmh-copd').checked = data.medical.copd || false;
        document.getElementById('pmh-ckd').checked = data.medical.ckd || false;
        document.getElementById('pmh-chf').checked = data.medical.chf || false;
        document.getElementById('pmh-notes').value = data.medical.notes || '';
    }

    // Surgical History
    document.getElementById('psh-notes').value = data.surgical || '';

    // Family History
    if (data.family) {
        document.getElementById('fh-cancer').checked = data.family.cancer || false;
        document.getElementById('fh-heart').checked = data.family.heart || false;
        document.getElementById('fh-dm').checked = data.family.dm || false;
        document.getElementById('fh-notes').value = data.family.notes || '';
    }

    // Social History
    if (data.social) {
        document.getElementById('sh-tobacco').value = data.social.tobacco || 'never';
        document.getElementById('sh-alcohol').value = data.social.alcohol || 'none';
        document.getElementById('sh-drugs').value = data.social.drugs || 'none';
        document.getElementById('sh-occupation').value = data.social.occupation || '';
        document.getElementById('sh-notes').value = data.social.notes || '';
    }

    // Trigger auto-save for all fields
    const inputs = document.querySelectorAll('#history input, #history select, #history textarea');
    inputs.forEach(input => {
        if (input.id) {
            saveData(`field_${input.id}`, input.type === 'checkbox' ? input.checked : input.value);
        }
    });
}
