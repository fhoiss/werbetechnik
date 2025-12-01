/* ========================================
   HOISS WERBETECHNIK - JAVASCRIPT
   ======================================== */

'use strict';

// Mobile Navigation Toggle
const initMobileNav = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

        navToggle.setAttribute('aria-expanded', !isExpanded);
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
};

// Smooth Scrolling fÃ¼r Anker-Links
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Ignoriere leere Hashes
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // SchlieÃŸe Mobile-MenÃ¼ falls offen
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');

                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
};

// Header Scroll-Effekt
const initHeaderScroll = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
};

// Aktiven Nav-Link beim Scrollen markieren
const initActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav-link-active');

            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('nav-link-active');
            }
        });
    });
};

// Initialisierung beim DOM-Load
const init = () => {
    initMobileNav();
	initDropdowns();
    initSmoothScroll();
    initHeaderScroll();
    initActiveNavLink();

    console.log('HoiÃŸ Werbetechnik - Website initialisiert');
};
// Dropdown Toggle fÃ¼r Mobile
const initDropdowns = () => {
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Nur auf Mobile (wenn Burger-MenÃ¼ sichtbar)
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

                // SchlieÃŸe alle anderen Dropdowns
                dropdownToggles.forEach(t => {
                    if (t !== toggle) {
                        t.setAttribute('aria-expanded', 'false');
                    }
                });

                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        });
    });
};

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// ========================================
// HEADER & FOOTER LADEN
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // Header laden
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Header konnte nicht geladen werden');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initNavigation();
            highlightActiveNavLink();
        })
        .catch(error => {
            console.error('Fehler beim Laden des Headers:', error);
            document.getElementById('header-placeholder').innerHTML =
                '<header class="site-header"><div class="container"><p style="color: red; padding: 20px;">Header konnte nicht geladen werden. Bitte Seite neu laden oder lokalen Server verwenden.</p></div></header>';
        });

    // Footer laden
    fetch('footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Footer konnte nicht geladen werden');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Fehler beim Laden des Footers:', error);
        });
});

// ========================================
// NAVIGATION FUNKTIONALITÃ„T
// ========================================

function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    // Mobile Menu Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive);
        });

        // MenÃ¼ schlieÃŸen bei Klick auÃŸerhalb
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Dropdown Toggle (Mobile)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Nur auf Mobile preventDefault
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

                // Alle anderen Dropdowns schlieÃŸen
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });

                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        });
    });

    // Header Scroll-Effekt
    let lastScroll = 0;
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// AKTIVE SEITE HERVORHEBEN
// ========================================

function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        if (href === currentPage || href === './' + currentPage) {
            link.classList.add('nav-link-active');

            const parentDropdown = link.closest('.nav-dropdown');
            if (parentDropdown) {
                const parentToggle = parentDropdown.querySelector('.nav-dropdown-toggle');
                if (parentToggle) {
                    parentToggle.classList.add('nav-link-active');
                }
            }
        }
    });
}

// ========================================
// SMOOTH SCROLL FÃœR ANKER-LINKS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href && href !== '#') {
                    const target = document.querySelector(href);

                    if (target) {
                        e.preventDefault();

                        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 100;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        const navMenu = document.querySelector('.nav-menu');
                        const navToggle = document.querySelector('.nav-toggle');
                        if (navMenu && navToggle) {
                            navMenu.classList.remove('active');
                            navToggle.classList.remove('active');
                            navToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                }
            });
        });
    }, 100);
});
/**
 * Cookie-Banner fÃƒÂ¼r HoiÃƒÅ¸ Werbetechnik
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
        // PrÃƒÂ¼fe ob Consent bereits existiert
        const consent = getCookieConsent();

        if (!consent) {
            // Zeige Banner nach kurzer VerzÃƒÂ¶gerung
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

        // Einstellungen ÃƒÂ¶ffnen
        const settingsBtn = document.getElementById('cookie-settings-open');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', showModal);
        }

        // Modal schlieÃƒÅ¸en
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

        console.log('Ã¢Å“â€¦ Cookie-Einwilligung gespeichert:', consent);
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
        console.log('Ã°Å¸â€œÅ  Lade Cookies basierend auf Einwilligung:', consent);

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
        console.log('Ã¢Å“â€œ Notwendige Cookies geladen');
        // Hier werden technisch notwendige Cookies geladen
    }

    function loadAnalyticsCookies() {
        console.log('Ã¢Å“â€œ Analytics-Cookies geladen');

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
        console.log('Ã¢Å“â€œ Marketing-Cookies geladen');
        // Hier wÃƒÂ¼rden Marketing-Cookies geladen (z.B. Facebook Pixel)
    }

    // Ãƒâ€“ffentliche API fÃƒÂ¼r Widerruf
    window.revokeCookieConsent = function() {
        document.cookie = COOKIE_NAME + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        location.reload();
    };

})();
