   ========================================
   CONTACT PAGE - JAVASCRIPT
   ======================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initFileUpload();
    initGoogleMaps();
    autoSelectInterest();
    
    console.log('âœ… Contact Page initialisiert');
});

// ========================================
// AUTO-SELECT INTERESSE BASIEREND AUF REFERRER
// ========================================

function autoSelectInterest() {
    const interestSelect = document.getElementById('interest');
    if (!interestSelect) return;
    
    // PrÃ¼fe URL-Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const interestParam = urlParams.get('interesse');
    
    if (interestParam) {
        // Setze Wert aus URL-Parameter
        interestSelect.value = interestParam;
        console.log(`âœ… Interesse automatisch gesetzt: ${interestParam}`);
        return;
    }
    
    // Fallback: PrÃ¼fe Referrer (vorherige Seite)
    const referrer = document.referrer;
    
    const interestMapping = {
        'fahrzeugbeschriftung': 'fahrzeugbeschriftung',
        'glasdekor': 'glasdekor',
        'sichtschutz': 'glasdekor',
        'schilder': 'schilder',
        'leitsysteme': 'schilder',
        'digitaldruck': 'digitaldruck',
        'banner': 'digitaldruck',
        'leuchtschrift': 'leuchtschrift',
        'leuchtreklame': 'leuchtschrift',
        'messebau': 'messebau',
        'display': 'messebau'
    };
    
    // Durchsuche Referrer nach Keywords
    for (const [keyword, value] of Object.entries(interestMapping)) {
        if (referrer.toLowerCase().includes(keyword)) {
            interestSelect.value = value;
            console.log(`âœ… Interesse automatisch erkannt: ${value}`);
            break;
        }
    }
}

// ========================================
// CONTACT FORM HANDLING
// ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Validierung
    if (!validateForm(form)) {
        return;
    }
    
    // Submit Button deaktivieren
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet...';
    
    try {
        // FormData erstellen
        const formData = new FormData(form);
        
        // Entferne das Standard-File-Input (wir nutzen unser Array)
        formData.delete('file-upload');
        
        // Füge alle ausgewählten Dateien hinzu
        selectedFiles.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });
        
        console.log('?? Sende Formular mit', selectedFiles.length, 'Datei(en)');
        
        // Hier würde der tatsächliche Submit erfolgen
        // await fetch('/api/contact', { method: 'POST', body: formData });
        
        // Simuliere erfolgreichen Submit (2 Sekunden)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Zeige Success-Message
        showSuccess();
        
        // Formular und Dateien zurücksetzen
        form.reset();
        selectedFiles = [];
        updateFilePreview();
        
        // Scroll zur Success-Message
        const successElement = document.getElementById('formSuccess');
        if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
    } catch (error) {
        console.error('Fehler beim Senden:', error);
        showError();
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#dc3545';
            
            // Setze Border nach Eingabe zurÃ¼ck
            field.addEventListener('input', () => {
                field.style.borderColor = '';
            }, { once: true });
        }
    });
    
    // Email-Validierung
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.style.borderColor = '#dc3545';
            alert('Bitte geben Sie eine gÃ¼ltige E-Mail-Adresse ein.');
        }
    }
    
    if (!isValid) {
        alert('Bitte fÃ¼llen Sie alle Pflichtfelder aus.');
    }
    
    return isValid;
}

function showSuccess() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');
    
    if (form) form.style.display = 'none';
    if (error) error.style.display = 'none';
    if (success) success.style.display = 'block';
}

function showError() {
    const error = document.getElementById('formError');
    if (error) {
        error.style.display = 'block';
        error.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
// ========================================
// MULTI-FILE UPLOAD
// ========================================

let selectedFiles = []; // Array für mehrere Dateien

function initFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const filePreviewList = document.getElementById('filePreviewList');
    
    if (!fileInput || !filePreviewList) {
        console.warn('?? File Upload Elemente nicht gefunden');
        return;
    }
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;
        
        // Validiere und füge Dateien hinzu
        files.forEach(file => {
            if (validateFile(file)) {
                addFile(file);
            }
        });
        
        // Input zurücksetzen (erlaubt erneutes Hinzufügen gleicher Datei)
        fileInput.value = '';
        
        // Aktualisiere Preview
        updateFilePreview();
    });
    
    console.log('? Multi-File Upload initialisiert');
}

function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10 MB
    
    // Prüfe Dateigröße
    if (file.size > maxSize) {
        alert(`Die Datei "${file.name}" ist zu groß. Maximale Größe: 10 MB`);
        return false;
    }
    
    // Prüfe ob Datei bereits hinzugefügt wurde
    const isDuplicate = selectedFiles.some(f => 
        f.name === file.name && f.size === file.size
    );
    
    if (isDuplicate) {
        alert(`Die Datei "${file.name}" wurde bereits hinzugefügt.`);
        return false;
    }
    
    // Prüfe erlaubte Dateitypen
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.ai', '.eps'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        alert(`Der Dateityp "${fileExtension}" ist nicht erlaubt.`);
        return false;
    }
    
    return true;
}

function addFile(file) {
    selectedFiles.push(file);
    console.log(`? Datei hinzugefügt: ${file.name}`);
}

function removeFile(index) {
    const removedFile = selectedFiles[index];
    selectedFiles.splice(index, 1);
    console.log(`? Datei entfernt: ${removedFile.name}`);
    updateFilePreview();
}

function updateFilePreview() {
    const filePreviewList = document.getElementById('filePreviewList');
    if (!filePreviewList) return;
    
    // Leere die Liste
    filePreviewList.innerHTML = '';
    
    // Zeige "Keine Dateien" wenn Array leer
    if (selectedFiles.length === 0) {
        filePreviewList.innerHTML = `
            <div class="file-preview-empty">
                Keine Dateien ausgewählt
            </div>
        `;
        updateFileUploadLabel(0);
        return;
    }
    
    // Erstelle Preview für jede Datei
    selectedFiles.forEach((file, index) => {
        const fileItem = createFilePreviewItem(file, index);
        filePreviewList.appendChild(fileItem);
    });
    
    // Aktualisiere Upload-Label mit Dateianzahl
    updateFileUploadLabel(selectedFiles.length);
}

function createFilePreviewItem(file, index) {
    const item = document.createElement('div');
    item.className = 'file-preview-item';
    
    const icon = getFileIcon(file.name);
    
    item.innerHTML = `
        <div class="file-preview-info">
            <div class="file-preview-icon">${icon}</div>
            <div class="file-preview-details">
                <div class="file-preview-name" title="${file.name}">
                    ${file.name}
                </div>
                <div class="file-preview-size">
                    ${formatFileSize(file.size)}
                </div>
            </div>
        </div>
        <button type="button" class="file-remove-btn" data-index="${index}" title="Datei entfernen">
            ?
        </button>
    `;
    
    // Event Listener für Löschen-Button
    const removeBtn = item.querySelector('.file-remove-btn');
    removeBtn.addEventListener('click', () => {
        removeFile(index);
    });
    
    return item;
}

function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    const iconMap = {
        'pdf': '??',
        'doc': '??',
        'docx': '??',
        'jpg': '???',
        'jpeg': '???',
        'png': '???',
        'ai': '??',
        'eps': '??'
    };
    
    return iconMap[extension] || '??';
}

function updateFileUploadLabel(count) {
    const labelText = document.querySelector('.file-upload-text');
    if (!labelText) return;
    
    if (count === 0) {
        labelText.innerHTML = 'Dateien auswählen';
    } else {
        labelText.innerHTML = `Weitere Dateien hinzufügen <span class="file-count-badge">${count}</span>`;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ========================================
// GOOGLE MAPS - DSGVO-KONFORM
// ========================================

function initGoogleMaps() {
    const activateBtn = document.getElementById('activateMap');
    const mapConsent = document.getElementById('mapConsent');
    const mapIframe = document.getElementById('mapIframe');
    
    if (!activateBtn || !mapConsent || !mapIframe) return;
    
    // PrÃ¼fe ob User bereits zugestimmt hat (Cookie)
    if (hasMapConsent()) {
        loadMap();
    }
    
    // Event Listener fÃ¼r Aktivierungs-Button
    activateBtn.addEventListener('click', () => {
        setMapConsent();
        loadMap();
    });
}

function hasMapConsent() {
    const consent = localStorage.getItem('hoiss_map_consent');
    return consent === 'true';
}

function setMapConsent() {
    localStorage.setItem('hoiss_map_consent', 'true');
    console.log('âœ… Google Maps Zustimmung gespeichert');
}
function loadMap() {
    const mapConsent = document.getElementById('mapConsent');
    const mapIframe = document.getElementById('mapIframe');
    
    if (!mapIframe) return;
    
    // Verstecke Consent-Box
    if (mapConsent) {
        mapConsent.style.display = 'none';
    }
    
    // Dein exakter Google Maps Embed Code
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.305729838538!2d12.091146676661012!3d47.898990067740726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47760350124a90a7%3A0xf04f0b08d5d9605e!2sHoi%C3%9F%20Beklebe%20%26%20Werbetechnik!5e1!3m2!1sde!2sde!4v1765642965214!5m2!1sde!2sde';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    iframe.title = 'Google Maps - Hoiß Werbetechnik Standort';
    
    // Füge Iframe ein
    mapIframe.innerHTML = '';
    mapIframe.appendChild(iframe);
    mapIframe.style.display = 'block';
    
    console.log('? Google Maps geladen');
}
// ========================================
// GOOGLE MAPS - DSGVO-KONFORM (mit Widerruf)
// ========================================

function initGoogleMaps() {
    const activateBtn = document.getElementById('activateMap');
    const revokeBtn = document.getElementById('revokeMap');
    const mapConsent = document.getElementById('mapConsent');
    const mapIframe = document.getElementById('mapIframe');
    
    if (!activateBtn || !mapConsent || !mapIframe) return;
    
    // Prüfe ob User bereits zugestimmt hat (localStorage)
    if (hasMapConsent()) {
        loadMap();
    }
    
    // Event Listener für Aktivierungs-Button
    activateBtn.addEventListener('click', () => {
        setMapConsent();
        loadMap();
    });
    
    // Event Listener für Widerruf-Button (NEU!)
    if (revokeBtn) {
        revokeBtn.addEventListener('click', () => {
            revokeMapConsent();
            unloadMap();
        });
    }
}

function hasMapConsent() {
    const consent = localStorage.getItem('hoiss_map_consent');
    return consent === 'true';
}

function setMapConsent() {
    localStorage.setItem('hoiss_map_consent', 'true');
    console.log('? Google Maps Zustimmung gespeichert');
}

function revokeMapConsent() {
    localStorage.removeItem('hoiss_map_consent');
    console.log('? Google Maps Zustimmung widerrufen');
}

function loadMap() {
    const mapConsent = document.getElementById('mapConsent');
    const mapIframe = document.getElementById('mapIframe');
    
    if (!mapIframe) return;
    
    // Verstecke Consent-Box
    if (mapConsent) {
        mapConsent.style.display = 'none';
    }
    
    // Dein exakter Google Maps Embed Code
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.305729838538!2d12.091146676661012!3d47.898990067740726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47760350124a90a7%3A0xf04f0b08d5d9605e!2sHoi%C3%9F%20Beklebe%20%26%20Werbetechnik!5e1!3m2!1sde!2sde!4v1765642965214!5m2!1sde!2sde';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    iframe.title = 'Google Maps - Hoiß Werbetechnik Standort';
    iframe.id = 'googleMapIframe';
    
    // Füge Iframe ein
    const existingIframe = mapIframe.querySelector('iframe');
    if (!existingIframe) {
        mapIframe.insertBefore(iframe, mapIframe.firstChild);
    }
    mapIframe.style.display = 'block';
    
    console.log('? Google Maps geladen');
}

function unloadMap() {
    const mapConsent = document.getElementById('mapConsent');
    const mapIframe = document.getElementById('mapIframe');
    
    if (!mapIframe) return;
    
    // Entferne Iframe
    const iframe = mapIframe.querySelector('iframe');
    if (iframe) {
        iframe.remove();
    }
    
    // Verstecke Map Container, zeige Consent wieder
    mapIframe.style.display = 'none';
    if (mapConsent) {
        mapConsent.style.display = 'block';
    }
    
    console.log('? Google Maps entfernt');
}