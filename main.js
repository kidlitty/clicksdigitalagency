// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- INITIALIZE CUSTOM COLOR PICKER ---
    Coloris({
        el: '.color-picker-input',
        swatches: [
            '#4f46e5', '#db2777', '#16a34a', '#ea580c', '#0891b2',
            '#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51',
            '#d62828', '#023e8a', '#0077b6', '#0096c7', '#00b4d8',
            '#48cae4', '#ade8f4', '#333333'
        ],
        theme: 'light',
        alpha: false,
        format: 'hex',
    });

    // --- MOBILE MENU TOGGLE ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- SMOOTH SCROLL FOR NAV LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- THEME CUSTOMIZER TOGGLE ---
    const themeButton = document.getElementById('theme-toggle-button');
    const themePanel = document.getElementById('color-selector-panel');

    if (themeButton && themePanel) {
        themePanel.classList.add('hidden');
        let isPanelOpen = false;

        themeButton.addEventListener('click', () => {
            isPanelOpen = !isPanelOpen;
            themePanel.classList.toggle('hidden');
        });
    }
    
    // --- INTERACTIVE GALLERY LOGIC ---
    const gallery = document.getElementById('gallery');
    if (gallery) {
        const galleryImages = [
            { thumb: 'gallery/001.jpg', full: 'gallery/001.jpg' },
            { thumb: 'gallery/002.jpg', full: 'gallery/002.jpg' },
            { thumb: 'gallery/003.jpg', full: 'gallery/003.jpg' },
            { thumb: 'gallery/004.jpg', full: 'gallery/004.jpg' },
            { thumb: 'gallery/005.jpg', full: 'gallery/005.jpg' },
            { thumb: 'gallery/006.jpg', full: 'gallery/006.jpg' },
            { thumb: 'gallery/007.jpg', full: 'gallery/007.jpg' },
            { thumb: 'gallery/008.jpg', full: 'gallery/008.jpg' }
        ];

        const swiperWrapper = document.querySelector('.mySwiper .swiper-wrapper');
        const galleryGrid = document.getElementById('gallery-grid');

        if(swiperWrapper && galleryGrid) {
            galleryImages.forEach((img, index) => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.style.backgroundImage = `url(${img.full})`;
                swiperWrapper.appendChild(slide);

                const gridImg = document.createElement('img');
                gridImg.src = img.thumb;
                gridImg.alt = `Project ${index + 1}`;
                gridImg.className = 'gallery-grid-item rounded-lg shadow-md hover:opacity-90 transition-opacity';
                gridImg.dataset.index = index;
                galleryGrid.appendChild(gridImg);
            });
        }

        const gridItems = document.querySelectorAll('.gallery-grid-item');

        function updateGalleryBackground(activeIndex) {
            const imageUrl = galleryImages[activeIndex].full;
            gallery.style.setProperty('--gallery-bg-image', `url(${imageUrl})`);
        }

        function updateGridSelection(activeIndex) {
            gridItems.forEach((item, index) => {
                if (index === activeIndex) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        }

        const cursorBlur = document.createElement('div');
        cursorBlur.className = 'cursor-blur';
        gallery.appendChild(cursorBlur);

        gallery.addEventListener('mouseenter', () => { cursorBlur.style.display = 'block'; });
        gallery.addEventListener('mouseleave', () => { cursorBlur.style.display = 'none'; });

        gallery.addEventListener('mousemove', (e) => {
            const rect = gallery.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            requestAnimationFrame(() => {
                cursorBlur.style.left = `${x}px`;
                cursorBlur.style.top = `${y}px`;
            });
        });

        const swiper = new Swiper('.mySwiper', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            on: {
                init: function () {
                    const clickableElements = document.querySelectorAll('.gallery-grid-item, .swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet');
                    clickableElements.forEach(el => {
                        el.addEventListener('mouseenter', () => cursorBlur.classList.add('active'));
                        el.addEventListener('mouseleave', () => cursorBlur.classList.remove('active'));
                    });
                },
                slideChange: function () {
                    updateGridSelection(this.realIndex);
                    updateGalleryBackground(this.realIndex);
                },
            },
        });

        gridItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index, 10);
                swiper.slideToLoop(index);
            });
        });

        updateGridSelection(swiper.realIndex);
        updateGalleryBackground(swiper.realIndex);
    }

    // --- THEME & PALETTE LOGIC (EVENT LISTENERS ONLY) ---
    const brandColorPicker = document.getElementById('brand-color-picker');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (brandColorPicker && darkModeToggle) {
        const root = document.documentElement;
        const toggleCircle = darkModeToggle.querySelector('span:not(.sr-only)');

        function hexToHsl(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) return [0, 0, 0];
            let r = parseInt(result[1], 16) / 255, g = parseInt(result[2], 16) / 255, b = parseInt(result[3], 16) / 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) { h = s = 0; } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h, s, l];
        }

        function hslToHex(h, s, l) {
            let r, g, b;
            if (s === 0) { r = g = b = l; } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1; if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
            }
            const toHex = x => { const hex = Math.round(x * 255).toString(16); return hex.length === 1 ? '0' + hex : hex; };
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }

        function getLuminance(hex) {
             const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
             if (!result) return 0;
             let r = parseInt(result[1], 16), g = parseInt(result[2], 16), b = parseInt(result[3], 16);
             const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
             return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        const schemeDefaultBtn = document.getElementById('scheme-default');
        const schemeBolderBtn = document.getElementById('scheme-bolder');

        function applyScheme(scheme) {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const brandColor = localStorage.getItem('brandColor') || '#4f46e5';
            updatePalette(brandColor, isDarkMode, scheme);
            localStorage.setItem('colorScheme', scheme);
            updateSchemeButtons(scheme);
        }

        function updateSchemeButtons(activeScheme) {
            [schemeDefaultBtn, schemeBolderBtn].forEach(btn => {
                btn.classList.remove('border-primary', 'text-primary', 'bg-primary', 'text-on-primary', 'is-selected-scheme');
            });
            if (activeScheme === 'bolder') {
                schemeBolderBtn.classList.add('border-primary', 'text-primary', 'bg-primary', 'text-on-primary', 'is-selected-scheme');
                document.documentElement.classList.add('bolder-theme');
            } else {
                schemeDefaultBtn.classList.add('border-primary', 'text-primary', 'bg-primary', 'text-on-primary', 'is-selected-scheme');
                document.documentElement.classList.remove('bolder-theme');
            }
        }

        schemeDefaultBtn.addEventListener('click', () => applyScheme('default'));
        schemeBolderBtn.addEventListener('click', () => applyScheme('bolder'));

        function updatePalette(brandColor, isDark, scheme = 'default') {
            let [h, s, l] = hexToHsl(brandColor);
            let primaryColor, primaryHover, secondaryColor, accentColor;

            // Default color generation
            if (isDark) {
                primaryColor = hslToHex(h, s, Math.max(0.55, l));
                primaryHover = hslToHex(h, s, Math.max(0.5, l - 0.05));
                secondaryColor = hslToHex(h, s * 0.2, 0.15);
                accentColor = hslToHex((h + 150 / 360) % 1.0, Math.max(0.6, s), Math.max(0.5, l));
            } else {
                primaryColor = brandColor;
                primaryHover = hslToHex(h, s, Math.max(0, l - 0.05));
                secondaryColor = hslToHex(h, Math.max(0.25, s * 0.6), 0.94);
                accentColor = hslToHex((h + 150 / 360) % 1.0, Math.max(0.5, s * 0.95), Math.max(0.4, Math.min(0.65, l)));
            }

            const defaultSecondaryColor = secondaryColor; // Store the default secondary color

            // Apply schemes on top of the default palette
            if (scheme === 'bolder') {
                let [primaryH, primaryS, primaryL] = hexToHsl(primaryColor);
                primaryS = Math.min(1, primaryS * 1.8);
                primaryL = primaryL * 0.9;
                primaryColor = hslToHex(primaryH, primaryS, primaryL);

                let [secondaryH, secondaryS, secondaryL] = hexToHsl(secondaryColor);
                secondaryL = secondaryL * 0.8;
                secondaryColor = hslToHex(secondaryH, secondaryS, secondaryL);
                
                let [accentH, accentS, accentL] = hexToHsl(accentColor);
                accentS = Math.min(1, accentS * 1.5);
                accentL = accentL * 0.9;
                accentColor = hslToHex(accentH, accentS, accentL);

                primaryHover = hslToHex(primaryH, primaryS, Math.max(0, primaryL - 0.05));

                if (isDark) {
                    // For bolder dark mode, make backgrounds even darker
                    const darkerSecondary = hslToHex(secondaryH, secondaryS, Math.max(0, secondaryL * 0.6)); // Make it darker
                    const cardDarkerSecondary = hslToHex(secondaryH, secondaryS, Math.max(0, secondaryL * 0.5)); // Make it even darker for cards

                    root.style.setProperty('--bg-color', darkerSecondary);
                    root.style.setProperty('--card-bg-color', cardDarkerSecondary);
                } else {
                    // Create lighter shades for backgrounds in light mode
                    const lighterSecondary = hslToHex(secondaryH, secondaryS, Math.min(1, secondaryL + 0.2));
                    const cardLighterSecondary = hslToHex(secondaryH, secondaryS, Math.min(1, secondaryL + 0.1));

                    root.style.setProperty('--bg-color', lighterSecondary);
                    root.style.setProperty('--card-bg-color', cardLighterSecondary);
                }

            } else {
                // Reset to default colors if not 'bolder'
                root.style.setProperty('--bg-color', isDark ? '#111827' : '#f8f9fa');
                root.style.setProperty('--card-bg-color', isDark ? '#1f2937' : '#ffffff');
            }
            const textOnPrimary = getLuminance(primaryColor) > 0.5 ? '#212529' : '#ffffff';
            let calculatedTextOnSecondary = getLuminance(secondaryColor) > 0.5 ? '#212529' : '#ffffff';

            // Special handling for bolder scheme in light mode to ensure dark text on light backgrounds
            if (!isDark && scheme === 'bolder') {
                // If secondaryColor is still relatively light, force text to be dark
                if (getLuminance(secondaryColor) > 0.3) { // Adjust threshold as needed
                    calculatedTextOnSecondary = '#212529'; // Force dark text
                }
            }
            const textOnSecondary = calculatedTextOnSecondary;

            root.style.setProperty('--primary-color', primaryColor);
            root.style.setProperty('--primary-hover', primaryHover);
            root.style.setProperty('--secondary-color', secondaryColor);
            root.style.setProperty('--accent-color', accentColor);
            root.style.setProperty('--text-on-primary', textOnPrimary);
            root.style.setProperty('--text-on-secondary', textOnSecondary);

            localStorage.setItem('brandColor', brandColor);
        }

        function setDarkModeUI(isDark) {
            darkModeToggle.setAttribute('aria-checked', isDark);
            if (isDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                toggleCircle.style.transform = 'translateX(1.25rem)';
                darkModeToggle.style.backgroundColor = 'var(--primary-color)';
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                toggleCircle.style.transform = 'translateX(0)';
                darkModeToggle.style.backgroundColor = '#d1d5db';
            }
        }

        darkModeToggle.addEventListener('click', () => {
            const isCurrentlyDark = document.documentElement.classList.contains('dark');
            setDarkModeUI(!isCurrentlyDark);
            const scheme = localStorage.getItem('colorScheme') || 'default';
            updatePalette(localStorage.getItem('brandColor') || '#4f46e5', !isCurrentlyDark, scheme);
        });
        
        brandColorPicker.addEventListener('change', (event) => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const scheme = localStorage.getItem('colorScheme') || 'default';
            updatePalette(event.target.value, isDarkMode, scheme);
        });

        // Set initial UI state from localStorage
        const savedTheme = localStorage.getItem('theme');
        const savedColor = localStorage.getItem('brandColor') || '#4f46e5';
        const savedScheme = localStorage.getItem('colorScheme') || 'default';
        brandColorPicker.value = savedColor;
        if (savedTheme === 'dark') {
            setDarkModeUI(true);
        }
        else {
            setDarkModeUI(false);
        }
        updatePalette(savedColor, savedTheme === 'dark', savedScheme);
        updateSchemeButtons(savedScheme);
    }



    // --- SERVICE CARD HOVER EFFECT ---
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
});

    // --- BACK TO TOP BUTTON ---
const backToTopButton = document.getElementById('back-to-top-btn');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) { // Show the button after scrolling 400px
            backToTopButton.classList.remove('opacity-0');
        } else {
            backToTopButton.classList.add('opacity-0');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- THEME & PALETTE LOGIC (EVENT LISTENERS ONLY) ---
const themePopup = document.getElementById('theme-popup');
const closePopupButton = document.getElementById('close-popup');

if (themePopup && closePopupButton) {
    const popupDismissed = localStorage.getItem('themePopupDismissed');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    // Show the pop-up if it was dismissed more than a day ago or never dismissed
    if (!popupDismissed || (now - parseInt(popupDismissed, 10)) > oneDay) {
        setTimeout(() => {
            themePopup.classList.remove('hidden');
            themePopup.classList.add('show');
        }, 5000);
    }

    // Close the pop-up when the close button is clicked
    closePopupButton.addEventListener('click', () => {
        themePopup.classList.remove('show');
        setTimeout(() => {
            themePopup.classList.add('hidden');
        }, 500);
        // Set a timestamp in local storage to indicate that the pop-up has been dismissed
        localStorage.setItem('themePopupDismissed', new Date().getTime().toString());
    });
}

// --- TEXT SCRAMBLE ANIMATION ---


