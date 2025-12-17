/* ========================================
   HOISS WERBETECHNIK - JAVASCRIPT
   ======================================== */

'use strict';

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
                '<header class="site-header"><div class="container"><p style="color: red; padding: 20px;">Header konnte nicht geladen werden.</p></div></header>';
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

            // ⭐ WICHTIG: Cookie-Banner NACH Footer-Laden initialisieren
            setTimeout(() => {
                if (typeof window.initCookieBanner === 'function') {
                    console.log('🍪 Initialisiere Cookie-Banner...');
                    window.initCookieBanner();
                } else {
                    console.error('❌ initCookieBanner Funktion nicht gefunden!');
                }
            }, 200);
        })
        .catch(error => {
            console.error('Fehler beim Laden des Footers:', error);
        });

    // Initialisierung
    initMobileNav();
    initDropdowns();
    initSmoothScroll();
    initHeaderScroll();
    initActiveNavLink();

    console.log('✅ Hoiß Werbetechnik - Website initialisiert');
});

// ========================================
// NAVIGATION FUNKTIONALITÄT
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

        // Menü schließen bei Klick außerhalb
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
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

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

    if (header) {
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
}

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

// Dropdown Toggle für Mobile
const initDropdowns = () => {
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

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

// Smooth Scrolling für Anker-Links
const initSmoothScroll = () => {
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
};

// Header Scroll-Effekt
const initHeaderScroll = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
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

// Aktive Seite hervorheben
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
// COOKIE-BANNER - DSGVO-KONFORM
// ========================================

(function() {
    'use strict';

    const COOKIE_NAME = 'hoiss_cookie_consent';
    const COOKIE_DURATION = 365;

    // ⭐ WICHTIG: Diese Funktion wird global verfügbar gemacht
    window.initCookieBanner = function() {
        console.log('🍪 Cookie-Banner Initialisierung gestartet...');

        const consent = getCookieConsent();

        if (!consent) {
            console.log('📋 Kein Cookie gefunden - zeige Banner');
            setTimeout(showBanner, 800);
        } else {
            console.log('✅ Cookie vorhanden - lade Einstellungen');
            loadCookies(consent);
        }

        // ⭐ Event Listener HIER registrieren (nachdem Footer geladen ist)
        setupEventListeners();
    };

    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('active');
            console.log('✅ Banner angezeigt');
        } else {
            console.error('❌ Banner Element nicht gefunden!');
        }
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('active');
            console.log('✅ Banner ausgeblendet');
        }
    }

    function showModal() {
        console.log('🔍 showModal() aufgerufen');
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.add('active');
            console.log('✅ Modal geöffnet');
        } else {
            console.error('❌ Modal Element nicht gefunden!');
        }
    }

    function hideModal() {
        console.log('🔍 hideModal() aufgerufen');
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.remove('active');
            console.log('✅ Modal geschlossen');
        }
    }

    function setupEventListeners() {
        console.log('🔗 Registriere Event Listener...');

        // Alle akzeptieren
        const acceptBtn = document.getElementById('cookie-accept-all');
        if (acceptBtn) {
            console.log('✅ Accept-Button gefunden');
            acceptBtn.addEventListener('click', function() {
                console.log('👆 Accept-Button geklickt');
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
        } else {
            console.error('❌ Accept-Button NICHT gefunden');
        }

        // Nur notwendige
        const declineBtn = document.getElementById('cookie-decline-all');
        if (declineBtn) {
            console.log('✅ Decline-Button gefunden');
            declineBtn.addEventListener('click', function() {
                console.log('👆 Decline-Button geklickt');
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
        } else {
            console.error('❌ Decline-Button NICHT gefunden');
        }

        // Einstellungen öffnen
        const settingsBtn = document.getElementById('cookie-settings-open');
        if (settingsBtn) {
            console.log('✅ Settings-Button gefunden');
            settingsBtn.addEventListener('click', function(e) {
                console.log('👆 Settings-Button geklickt!');
                e.preventDefault();
                showModal();
            });
        } else {
            console.error('❌ Settings-Button NICHT gefunden');
        }

        // Modal schließen
        const closeBtn = document.getElementById('cookie-modal-close');
        if (closeBtn) {
            console.log('✅ Close-Button gefunden');
            closeBtn.addEventListener('click', function() {
                console.log('👆 Close-Button geklickt');
                hideModal();
            });
        } else {
            console.error('❌ Close-Button NICHT gefunden');
        }

        // Einstellungen speichern
        const saveBtn = document.getElementById('cookie-save-settings');
        if (saveBtn) {
            console.log('✅ Save-Button gefunden');
            saveBtn.addEventListener('click', function() {
                console.log('👆 Save-Button geklickt');
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
        } else {
            console.error('❌ Save-Button NICHT gefunden');
        }

        console.log('✅ Event Listener Registrierung abgeschlossen');
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

        loadNecessaryCookies();

        if (consent.analytics) {
            loadAnalyticsCookies();
        }

        if (consent.marketing) {
            loadMarketingCookies();
        }
    }

    function loadNecessaryCookies() {
        console.log('✔ Notwendige Cookies geladen');
    }

    function loadAnalyticsCookies() {
        console.log('✔ Analytics-Cookies geladen');
        // Hier Google Analytics Code einfügen
    }

    function loadMarketingCookies() {
        console.log('✔ Marketing-Cookies geladen');
        // Hier Marketing-Cookies Code einfügen
    }

    window.revokeCookieConsent = function() {
        document.cookie = COOKIE_NAME + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        location.reload();
    };

})();

// ========== SCHEMA MARKUP (Aktualisiert 17.12.2025 - Clean URLs) ==========

document.addEventListener('DOMContentLoaded', function() {

  // ===== 1. ORGANIZATION SCHEMA =====
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hoiß Werbetechnik",
    "alternateName": "Hoiß Beklebe & Werbetechnik",
    "legalName": "Hoiß Werbetechnik GmbH",
    "url": "https://www.werbetechnik-hoiss.de/",
    "logo": "https://www.werbetechnik-hoiss.de/img/Logo-Hoiss.webp",
    "image": "https://www.werbetechnik-hoiss.de/img/Hoiss_Werbetechnik_Gebaeude.webp",
    "description": "Professionelle Werbetechnik in Rosenheim - Fahrzeugbeschriftungen, Schilder, Glasbeschriftungen, Digitaldruck und Großformatdruck. Von der Beratung bis zur Montage.",
    "slogan": "Werbetechnik, die wirkt",
    "foundingDate": "2018",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Lochberg 12",
      "addressLocality": "Schechen",
      "postalCode": "83135",
      "addressRegion": "Bayern",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.8292,
      "longitude": 12.1472
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Kundenservice",
        "telephone": "+49-8031-9003379",
        "email": "info@werbetechnik-hoiss.de",
        "availableLanguage": ["German"],
        "areaServed": "DE"
      },
      {
        "@type": "ContactPoint",
        "contactType": "Angebot & Beratung",
        "telephone": "+49-8031-9003379",
        "email": "info@werbetechnik-hoiss.de",
        "availableLanguage": ["German"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/WerbetechnikHoiss",
      "https://www.instagram.com/hoiss.werbetechnik"
    ]
  };

  // ===== 2. LOCAL BUSINESS SCHEMA (Erweitert) =====
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hoiß Werbetechnik",
    "image": [
      "https://www.werbetechnik-hoiss.de/img/Fahrzeugbeschriftung-Kosumi-Rosenheim.webp",
      "https://www.werbetechnik-hoiss.de/img/Schild-Aicherpark-Rosenheim.webp",
      "https://www.werbetechnik-hoiss.de/img/Glasdekor-Sichtschutz.webp"
    ],
    "@id": "https://www.werbetechnik-hoiss.de/",
    "url": "https://www.werbetechnik-hoiss.de/",
    "description": "Ihre Full-Service-Agentur für Werbetechnik in Rosenheim. Fahrzeugbeschriftungen, Schilder, Glasbeschriftungen, Digitaldruck, Banner und Großformatdruck – alles aus einer Hand.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Lochberg 12",
      "addressLocality": "Schechen",
      "postalCode": "83135",
      "addressRegion": "Bayern",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.8292,
      "longitude": 12.1472
    },
    "telephone": "+49-8031-9003379",
    "email": "info@werbetechnik-hoiss.de",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "€-€€€",
    "areaServed": [
      {
        "@type": "City",
        "name": "Rosenheim",
        "containedIn": {
          "@type": "State",
          "name": "Bayern"
        }
      },
      {
        "@type": "City",
        "name": "Schechen"
      },
      {
        "@type": "City",
        "name": "Bad Aibling"
      },
      {
        "@type": "City",
        "name": "München"
      },
      {
        "@type": "City",
        "name": "Brannenburg"
      },
      {
        "@type": "City",
        "name": "Oberaudorf"
      },
      {
        "@type": "City",
        "name": "Flintsbach"
      },
      {
        "@type": "City",
        "name": "Raubling"
      }
    ],
    "hasMap": "https://www.google.com/maps/place/Lochberg+12,+83135+Schechen",
    "sameAs": [
      "https://www.facebook.com/werbetechnikhoiss",
      "https://www.instagram.com/hoiss.werbetechnik"
    ]
  };

  // ===== 3. SERVICE SCHEMA (Clean URLs) =====
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Hoiß Werbetechnik",
    "url": "https://www.werbetechnik-hoiss.de/",
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Fahrzeugbeschriftung",
          "description": "Professionelle Fahrzeugbeklebungen für PKW, LKW, Transporter und Anhänger. Hochwertige Fahrzeugfolien als mobile Werbefläche – individuell gestaltet mit Digitaldruck oder Plotterfolien.",
          "serviceType": "Fahrzeugfolierung",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Hoiß Werbetechnik"
          },
          "areaServed": {
            "@type": "State",
            "name": "Bayern"
          },
          "url": "https://www.werbetechnik-hoiss.de/fahrzeugbeschriftung"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Glasdekorfolien & Sichtschutz",
          "description": "Glasdekorfolien für Fenster, Türen und Glasflächen. Perfekt für Sichtschutz, Sonnenschutz und dekorative Gestaltung. In vielen Farben und Designs erhältlich.",
          "serviceType": "Glasbeschriftung",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Hoiß Werbetechnik"
          },
          "areaServed": {
            "@type": "State",
            "name": "Bayern"
          },
          "url": "https://www.werbetechnik-hoiss.de/glasdekor-sichtschutz"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Schaufensterbeschriftung",
          "description": "Professionelle Schaufensterbeschriftungen für Geschäfte, Praxen und Büros. Von einfachen Öffnungszeiten bis zu aufwendigen Glasgestaltungen.",
          "serviceType": "Schaufensterbeschriftung",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Hoiß Werbetechnik"
          },
          "areaServed": {
            "@type": "State",
            "name": "Bayern"
          },
          "url": "https://www.werbetechnik-hoiss.de/schaufensterbeschriftung"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Aluverbundschilder & Schilder",
          "description": "Hochwertige Schilder für Fassaden, Firmen und Leitsysteme. Aluverbund, Dibond, Acrylglas – robust und wetterfest in individuellen Designs.",
          "serviceType": "Beschilderung",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Hoiß Werbetechnik"
          },
          "areaServed": {
            "@type": "State",
            "name": "Bayern"
          },
          "url": "https://www.werbetechnik-hoiss.de/schilder-leitsysteme"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Banner & Großformatdruck",
          "description": "PVC-Banner, Mesh-Banner, Textilbanner und Bauzaunbanner für Events, Baustellen und Werbezwecke. Wetterfest und UV-beständig.",
          "serviceType": "Großformatdruck",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Hoiß Werbetechnik"
          },
          "areaServed": {
            "@type": "State",
            "name": "Bayern"
          },
          "url": "https://www.werbetechnik-hoiss.de/banner-grossformat"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Car Designer Tool",
          "description": "Online-Tool zur selbstständigen Gestaltung Ihrer Fahrzeugbeschriftung. Einfach, intuitiv und mit Live-Vorschau.",
          "serviceType": "Design-Tool",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Hoiß Werbetechnik"
          },
          "url": "https://www.werbetechnik-hoiss.de/cardesigner"
        }
      }
    ]
  };

  // ===== 4. WEBSITE SCHEMA mit SearchAction =====
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hoiß Werbetechnik",
    "url": "https://www.werbetechnik-hoiss.de/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.werbetechnik-hoiss.de/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hoiß Werbetechnik"
    }
  };

  // ===== 5. FAQ SCHEMA (Glasdekor-Seite) =====
  const faqSchemaGlasdekor = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Welche Arten von Glasfolien gibt es?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Es gibt transluzente Folien (lichtdurchlässig), opake Folien (blickdicht), satinierte Folien (milchglasoptik) und bedruckte Folien mit individuellen Designs."
        }
      },
      {
        "@type": "Question",
        "name": "Wie lange hält eine Glasdekorfolie?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hochwertige Glasdekorfolien halten bei fachgerechter Montage und Pflege 5-8 Jahre, je nach Beanspruchung und Witterungseinflüssen."
        }
      },
      {
        "@type": "Question",
        "name": "Kann ich Glasdekorfolien wieder entfernen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, Glasdekorfolien sind grundsätzlich rückstandsfrei entfernbar. Mit der richtigen Technik und etwas Wärme lassen sie sich problemlos ablösen."
        }
      },
      {
        "@type": "Question",
        "name": "Eignen sich Glasdekorfolien auch für Außenverglasungen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, spezielle Glasdekorfolien sind UV- und witterungsbeständig und eignen sich auch für Außenverglasungen."
        }
      }
    ]
  };

  // ===== 6. FAQ SCHEMA (Schaufenster-Seite) =====
  const faqSchemaSchaufenster = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Welche Materialien eignen sich für Schaufensterbeschriftungen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Für Schaufensterbeschriftungen eignen sich selbstklebende Folien (transluzent oder opak), Glasdekorfolien und bedruckte Digitaldruckfolien."
        }
      },
      {
        "@type": "Question",
        "name": "Wie lange hält eine Schaufensterbeschriftung?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Je nach Material und Beanspruchung halten Schaufensterbeschriftungen 3-7 Jahre. Hochwertige Folien mit UV-Schutz sind besonders langlebig."
        }
      },
      {
        "@type": "Question",
        "name": "Kann ich meine Schaufensterbeschriftung selbst anbringen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kleinere Beschriftungen können Sie selbst anbringen. Für größere Flächen und perfekte Ergebnisse empfehlen wir unseren Montageservice."
        }
      }
    ]
  };

  // ===== 7. BREADCRUMB SCHEMA (Dynamisch für jede Seite - Clean URLs) =====
  function getBreadcrumbSchema() {
    const path = window.location.pathname;
    const breadcrumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Startseite",
          "item": "https://www.werbetechnik-hoiss.de/"
        }
      ]
    };

    // Dynamische Breadcrumb-Generierung basierend auf URL (Clean URLs)
    const pageMap = {
      "/fahrzeugbeschriftung": {
        name: "Fahrzeugbeschriftung",
        position: 2
      },
      "/glasdekor-sichtschutz": {
        name: "Glasdekor & Sichtschutz",
        position: 2
      },
      "/schaufensterbeschriftung": {
        name: "Schaufensterbeschriftung",
        position: 2
      },
      "/schilder-leitsysteme": {
        name: "Schilder & Leitsysteme",
        position: 2
      },
      "/banner-grossformat": {
        name: "Banner & Großformat",
        position: 2
      },
      "/cardesigner": {
        name: "Car Designer",
        position: 2
      },
      "/ueber-uns": {
        name: "Über uns",
        position: 2
      },
      "/kontakt": {
        name: "Kontakt",
        position: 2
      },
      "/impressum": {
        name: "Impressum",
        position: 2
      },
      "/datenschutz": {
        name: "Datenschutz",
        position: 2
      }
    };

    if (pageMap[path]) {
      breadcrumbs.itemListElement.push({
        "@type": "ListItem",
        "position": pageMap[path].position,
        "name": pageMap[path].name,
        "item": "https://www.werbetechnik-hoiss.de" + path
      });
    }

    return breadcrumbs;
  }

  // ===== 8. IMAGE OBJECT SCHEMA (Hauptbilder) =====
  const imageObjectSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": "https://www.werbetechnik-hoiss.de/img/Dr-Klein-Traunstein.webp",
    "description": "Professionelle Fahrzeugbeschriftung in Rosenheim - Hoiß Werbetechnik",
    "name": "Fahrzeugbeschriftung Rosenheim",
    "creator": {
      "@type": "Organization",
      "name": "Hoiß Werbetechnik"
    }
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "18"
    }
  };

  // ===== HILFSFUNKTION: Schema zum Head hinzufügen =====
  function addSchema(schemaData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaData, null, 2);
    document.head.appendChild(script);
  }

  // ===== SCHEMAS HINZUFÜGEN =====
  // Basis-Schemas (auf allen Seiten)
  addSchema(organizationSchema);
  addSchema(localBusinessSchema);
  addSchema(serviceSchema);
  addSchema(websiteSchema);
  addSchema(getBreadcrumbSchema());

  // Seitenspezifische Schemas
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('glasdekor-sichtschutz')) {
    addSchema(faqSchemaGlasdekor);
  }
  
  if (currentPath.includes('schaufensterbeschriftung')) {
    addSchema(faqSchemaSchaufenster);
  }

  // Image Schema nur auf Startseite
  if (currentPath === '/' || currentPath === '/index.html') {
    addSchema(imageObjectSchema);
  }

  console.log('✅ Schema.org Markups erfolgreich geladen (Clean URLs)');
});

// ========== END SCHEMA MARKUP ==========


// LIGHTBOX FUNKTIONEN - GLOBAL (nicht in DOMContentLoaded!)
// Diese müssen AUSSERHALB von allen Event-Listenern stehen!

window.openLightbox = function(src, alt) {
    var lightbox = document.getElementById('myLightbox');
    var img = document.getElementById('lightboxImg');
    if (lightbox && img) {
        img.src = src;
        img.alt = alt;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

window.closeLightbox = function() {
    var lightbox = document.getElementById('myLightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ESC zum Schließen
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.closeLightbox();
    }
});