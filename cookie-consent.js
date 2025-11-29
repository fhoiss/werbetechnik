/**
 * Cookie-Banner für Hoiß Werbetechnik
 * DSGVO-konform - Opt-in System
 */

(function() {
    'use strict';

    const COOKIE_NAME = 'hoiss_cookie_consent';
    const COOKIE_DURATION = 365; // Tage

    // Warte bis DOM geladen ist
    document.addEventListener('DOMContentLoaded', function() {
        initCookieBanner();
    });

    function initCookieBanner() {
        // Prüfe ob Consent bereits existiert
        const consent = getCookieConsent();

        if (!consent) {
            // Zeige Banner nach kurzer Verzögerung
            setTimeout(showBanner, 800);
        } else {
            // Lade erlaubte Cookies
            loadCookies(consent);
        }

        // Event Listener registrieren
        setupEventListeners();
    }

    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('active');
        }
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('active');
        }
    }

    function showModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    function hideModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    function setupEventListeners() {
        // Alle akzeptieren
        const acceptBtn = document.getElementById('cookie-accept-all');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                const consent = {
                    necessary: true,
                    analytics: true,
                    marketing: true,
                    timestamp: new Date().toISOString()
                };
                saveConsent(consent);
                loadCookies(consent);
                hideBanner();
            });
        }

        // Nur notwendige
        const declineBtn = document.getElementById('cookie-decline-all');
        if (declineBtn) {
            declineBtn.addEventListener('click', function() {
                const consent = {
                    necessary: true,
                    analytics: false,
                    marketing: false,
                    timestamp: new Date().toISOString()
                };
                saveConsent(consent);
                loadCookies(consent);
                hideBanner();
            });
        }

        // Einstellungen öffnen
        const settingsBtn = document.getElementById('cookie-settings-open');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', showModal);
        }

        // Modal schließen
        const closeBtn = document.getElementById('cookie-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideModal);
        }

        // Einstellungen speichern
        const saveBtn = document.getElementById('cookie-save-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                const analyticsCheckbox = document.getElementById('cookie-toggle-analytics');
                const marketingCheckbox = document.getElementById('cookie-toggle-marketing');

                const consent = {
                    necessary: true,
                    analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
                    marketing: marketingCheckbox ? marketingCheckbox.checked : false,
                    timestamp: new Date().toISOString()
                };

                saveConsent(consent);
                loadCookies(consent);
                hideModal();
                hideBanner();
            });
        }
    }

    function saveConsent(consent) {
        const consentString = JSON.stringify(consent);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + COOKIE_DURATION);

        document.cookie = COOKIE_NAME + '=' + encodeURIComponent(consentString) + 
                         '; expires=' + expiryDate.toUTCString() + 
                         '; path=/; SameSite=Lax';

        console.log('✅ Cookie-Einwilligung gespeichert:', consent);
    }

    function getCookieConsent() {
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.startsWith(COOKIE_NAME + '=')) {
                try {
                    const value = cookie.substring(COOKIE_NAME.length + 1);
                    return JSON.parse(decodeURIComponent(value));
                } catch (e) {
                    console.error('Fehler beim Parsen der Cookie-Einwilligung:', e);
                    return null;
                }
            }
        }

        return null;
    }

    function loadCookies(consent) {
        console.log('📊 Lade Cookies basierend auf Einwilligung:', consent);

        // Notwendige Cookies (immer geladen)
        loadNecessaryCookies();

        // Analytics
        if (consent.analytics) {
            loadAnalyticsCookies();
        }

        // Marketing
        if (consent.marketing) {
            loadMarketingCookies();
        }
    }

    function loadNecessaryCookies() {
        console.log('✓ Notwendige Cookies geladen');
        // Hier werden technisch notwendige Cookies geladen
    }

    function loadAnalyticsCookies() {
        console.log('✓ Analytics-Cookies geladen');

        // Beispiel: Google Analytics
        // Ersetzen Sie 'GA_MEASUREMENT_ID' mit Ihrer echten ID
        /*
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script);
        */
    }

    function loadMarketingCookies() {
        console.log('✓ Marketing-Cookies geladen');
        // Hier würden Marketing-Cookies geladen (z.B. Facebook Pixel)
    }

    // Öffentliche API für Widerruf
    window.revokeCookieConsent = function() {
        document.cookie = COOKIE_NAME + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        location.reload();
    };

})();
