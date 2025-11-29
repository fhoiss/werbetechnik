/**
 * COOKIE-BANNER & CONSENT-MANAGEMENT
 * DSGVO-konform - Opt-in erforderlich
 */

class CookieConsent {
    constructor() {
        this.cookieName = 'hoiss_cookie_consent';
        this.cookieExpiry = 365; // Tage
        this.init();
    }

    init() {
        // Prüfe ob bereits Consent vorliegt
        const consent = this.getConsent();

        if (!consent) {
            // Zeige Banner nach kurzer Verzögerung
            setTimeout(() => this.showBanner(), 500);
        } else {
            // Lade erlaubte Cookies
            this.loadAllowedCookies(consent);
        }

        // Event Listener für Buttons
        this.attachEventListeners();
    }

    showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hide');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 400);
        }
    }

    attachEventListeners() {
        // Accept Button
        const acceptBtn = document.getElementById('cookie-accept');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAll());
        }

        // Decline Button
        const declineBtn = document.getElementById('cookie-decline');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineAll());
        }

        // Settings Button
        const settingsBtn = document.getElementById('cookie-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }

        // Modal Close
        const modalClose = document.getElementById('cookie-modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeSettings());
        }

        // Save Settings
        const saveBtn = document.getElementById('cookie-save-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }
    }

    acceptAll() {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        this.saveConsent(consent);
        this.loadAllowedCookies(consent);
        this.hideBanner();
    }

    declineAll() {
        const consent = {
            necessary: true,  // Technisch notwendig, können nicht abgelehnt werden
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        this.saveConsent(consent);
        this.loadAllowedCookies(consent);
        this.hideBanner();
    }

    showSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    saveSettings() {
        const analyticsToggle = document.getElementById('cookie-analytics');
        const marketingToggle = document.getElementById('cookie-marketing');

        const consent = {
            necessary: true,
            analytics: analyticsToggle ? analyticsToggle.checked : false,
            marketing: marketingToggle ? marketingToggle.checked : false,
            timestamp: new Date().toISOString()
        };

        this.saveConsent(consent);
        this.loadAllowedCookies(consent);
        this.closeSettings();
        this.hideBanner();
    }

    saveConsent(consent) {
        const consentString = JSON.stringify(consent);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.cookieExpiry);

        document.cookie = `${this.cookieName}=${consentString}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

        console.log('Cookie Consent gespeichert:', consent);
    }

    getConsent() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.cookieName) {
                try {
                    return JSON.parse(decodeURIComponent(value));
                } catch (e) {
                    console.error('Fehler beim Parsen des Cookie Consent:', e);
                    return null;
                }
            }
        }
        return null;
    }

    loadAllowedCookies(consent) {
        console.log('Lade erlaubte Cookies:', consent);

        // Technisch notwendige Cookies (immer geladen)
        this.loadNecessaryCookies();

        // Analytics (z.B. Google Analytics)
        if (consent.analytics) {
            this.loadAnalyticsCookies();
        }

        // Marketing (z.B. Facebook Pixel, Google Ads)
        if (consent.marketing) {
            this.loadMarketingCookies();
        }
    }

    loadNecessaryCookies() {
        // Hier werden technisch notwendige Cookies geladen
        console.log('Technisch notwendige Cookies geladen');
    }

    loadAnalyticsCookies() {
        // Google Analytics laden
        console.log('Analytics-Cookies geladen');

        // BEISPIEL: Google Analytics
        /*
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script);
        */
    }

    loadMarketingCookies() {
        // Marketing-Cookies laden (Facebook Pixel, etc.)
        console.log('Marketing-Cookies geladen');

        // BEISPIEL: Facebook Pixel
        /*
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
        */
    }

    // Öffentliche Methode zum Widerrufen des Consents
    revokeConsent() {
        document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        location.reload();
    }
}

// Initialisiere Cookie Consent wenn DOM geladen ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cookieConsent = new CookieConsent();
    });
} else {
    window.cookieConsent = new CookieConsent();
}
