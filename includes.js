   ========================================
// HEADER & FOOTER LADEN
// ========================================

// Header laden und Navigation initialisieren
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
            // Nur auf Mobile preventDefault
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

                // Alle anderen Dropdowns schließen
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

        // Prüfe ob der Link zur aktuellen Seite führt
        if (href === currentPage || href === './' + currentPage) {
            link.classList.add('nav-link-active');

            // Wenn es ein Dropdown-Link ist, markiere auch den Haupt-Toggle
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
// SMOOTH SCROLL FÜR ANKER-LINKS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Warte kurz, damit Header/Footer geladen sind
    setTimeout(() => {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Nur für echte Anker (nicht #)
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

                        // Mobile Menü schließen
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