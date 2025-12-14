/* ========================================
   CONTACT PAGE - JAVASCRIPT
   Hoiß Werbetechnik
   ======================================== */

'use strict';

// Globale Variable für File Upload
let selectedFiles = [];

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Contact Page wird initialisiert...');
    
    initContactForm();
    initFileUpload();
    initGoogleMaps();
    autoSelectInterest();
    
    console.log('✅ Contact Page initialisiert');
});

// ========================================
// AUTO-SELECT INTERESSE BASIEREND AUF REFERRER
// ========================================

function autoSelectInterest() {
    const interestSelect = document.getElementById('interest');
    if (!interestSelect) {
        console.warn('⚠️ Interest Select nicht gefunden');
        return;
    }
    
    // Prüfe URL-Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const interestParam = urlParams.get('interesse');
    
    if (interestParam) {
        interestSelect.value = interestParam;
        console.log(`✅ Interesse automatisch gesetzt: ${interestParam}`);
        return;
    }
    
    // Fallback: Prüfe Referrer (vorherige Seite)
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
    
    for (const [keyword, value] of Object.entries(interestMapping)) {
        if (referrer.toLowerCase().includes(keyword)) {
            interestSelect.value = value;
            console.log(`✅ Interesse automatisch erkannt: ${value}`);
            break;
        }
    }
}

// ========================================
// CONTACT FORM HANDLING
// ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) {
        console.warn('⚠️ Contact Form nicht gefunden');
        return;
    }
    
    form.addEventListener('submit', handleFormSubmit);
    console.log('✅ Contact Form initialisiert');
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
        
        console.log('📤 Sende Formular mit', selectedFiles.length, 'Datei(en)');
        
        // Hier würde der tatsächliche Submit erfolgen
        // Beispiel: await fetch('/api/contact', { method: 'POST', body: formData });
        
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
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        }
    }
    
    if (!isValid) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
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

function initFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const filePreviewList = document.getElementById('filePreviewList');
    
    if (!fileInput || !filePreviewList) {
        console.warn('⚠️ File Upload Elemente nicht gefunden');
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
    
    console.log('✅ Multi-File Upload initialisiert');
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
    console.log(`✅ Datei hinzugefügt: ${file.name}`);
}

function removeFile(index) {
    const removedFile = selectedFiles[index];
    selectedFiles.splice(index, 1);
    console.log(`❌ Datei entfernt: ${removedFile.name}`);
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
            ✕
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
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'ai': '🎨',
        'eps': '🎨'
    };
    
    return iconMap[extension] || '📎';
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
    console.log('🗺️ Initialisiere Google Maps...');
    
    const activateBtn = document.getElementById('activateMap');
    const revokeBtn = document.getElementById('revokeMap');
    const mapConsent = document.getElementById('mapConsent');
    const mapIframe = document.getElementById('mapIframe');
    
    console.log('Debug - Elemente gefunden:');
    console.log('activateBtn:', activateBtn);
    console.log('revokeBtn:', revokeBtn);
    console.log('mapConsent:', mapConsent);
    console.log('mapIframe:', mapIframe);
    
    if (!activateBtn || !mapConsent || !mapIframe) {
        console.error('❌ Google Maps Elemente nicht gefunden!');
        return;
    }
    
    // Prüfe ob User bereits zugestimmt hat
    if (hasMapConsent()) {
        console.log('✅ Zustimmung bereits vorhanden, lade Karte...');
        loadMap();
    }
    
    // Event Listener für Aktivierungs-Button
    activateBtn.addEventListener('click', function() {
        console.log('🖱️ Karte aktivieren Button geklickt');
        setMapConsent();
        loadMap();
    });
    
    // Event Listener für Widerruf-Button
    if (revokeBtn) {
        revokeBtn.addEventListener('click', function() {
            console.log('🖱️ Karte deaktivieren Button geklickt');
            revokeMapConsent();
            unloadMap();
        });
    }
    
    console.log('✅ Google Maps initialisiert');
}

function hasMapConsent() {
    const consent = localStorage.getItem('hoiss_map_consent');
    return consent === 'true';
}

function setMapConsent() {
    localStorage.setItem('hoiss_map_consent', 'true');
    console.log('✅ Google Maps Zustimmung gespeichert');
}

function revokeMapConsent() {
    localStorage.removeItem('hoiss_map_consent');
    console.log('❌ Google Maps Zustimmung widerrufen');
}

function loadMap() {
    console.log('🔄 Lade Google Maps...');
    
    const mapConsent = document.getElementById('mapConsent');
    const mapIframe = document.getElementById('mapIframe');
    
    if (!mapIframe) {
        console.error('❌ mapIframe Element nicht gefunden!');
        return;
    }
    
    // Verstecke Consent-Box
    if (mapConsent) {
        mapConsent.style.display = 'none';
        console.log('✅ Consent-Box ausgeblendet');
    }
    
    // Prüfe ob Iframe bereits existiert
    const existingIframe = mapIframe.querySelector('iframe');
    if (existingIframe) {
        console.log('ℹ️ Karte bereits geladen');
        mapIframe.style.display = 'block';
        return;
    }
    
    // Erstelle Iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.305729838538!2d12.091146676661012!3d47.898990067740726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47760350124a90a7%3A0xf04f0b08d5d9605e!2sHoi%C3%9F%20Beklebe%20%26%20Werbetechnik!5e1!3m2!1sde!2sde!4v1765642965214!5m2!1sde!2sde';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('title', 'Google Maps - Hoiß Werbetechnik Standort');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    // Füge Iframe ein (vor dem Widerruf-Button)
    const revokeBtn = mapIframe.querySelector('#revokeMap');
    if (revokeBtn) {
        mapIframe.insertBefore(iframe, revokeBtn);
    } else {
        mapIframe.appendChild(iframe);
    }
    
    // Zeige Map Container
    mapIframe.style.display = 'block';
    
    console.log('✅ Google Maps erfolgreich geladen!');
}

function unloadMap() {
    console.log('🔄 Entferne Google Maps...');
    
    const mapConsent = document.getElementById('mapConsent');
    const mapIframe = document.getElementById('mapIframe');
    
    if (!mapIframe) return;
    
    // Entferne Iframe
    const iframe = mapIframe.querySelector('iframe');
    if (iframe) {
        iframe.remove();
        console.log('✅ Iframe entfernt');
    }
    
    // Verstecke Map Container, zeige Consent wieder
    mapIframe.style.display = 'none';
    if (mapConsent) {
        mapConsent.style.display = 'block';
        console.log('✅ Consent-Box wieder angezeigt');
    }
    
    console.log('✅ Google Maps entfernt');
}
