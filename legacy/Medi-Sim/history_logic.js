
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
