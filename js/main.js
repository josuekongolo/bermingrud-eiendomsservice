/**
 * BERMINGRUD EIENDOMSSERVICE AS - Main JavaScript
 * Roofing & Property Service Website
 */

(function() {
    'use strict';

    // =========================================
    // DOM Elements
    // =========================================
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
    const contactForm = document.getElementById('contact-form');

    // =========================================
    // Header Scroll Effect
    // =========================================
    function handleHeaderScroll() {
        if (!header) return;

        const scrollPosition = window.scrollY;

        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // =========================================
    // Mobile Menu
    // =========================================
    function toggleMobileMenu() {
        if (!menuToggle || !mobileMenu) return;

        const isActive = mobileMenu.classList.contains('active');

        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Update ARIA attributes
        menuToggle.setAttribute('aria-expanded', !isActive);
    }

    function closeMobileMenu() {
        if (!menuToggle || !mobileMenu) return;

        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    // =========================================
    // Scroll Animations
    // =========================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

        if (animatedElements.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach((element) => {
            observer.observe(element);
        });
    }

    // =========================================
    // Form Validation
    // =========================================
    function initFormValidation() {
        if (!contactForm) return;

        const requiredFields = contactForm.querySelectorAll('[required]');

        // Real-time validation on blur
        requiredFields.forEach((field) => {
            field.addEventListener('blur', function() {
                validateField(this);
            });

            field.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup && formGroup.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;

            requiredFields.forEach((field) => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Form is valid - show success message
                showFormSuccess();
            } else {
                // Scroll to first error
                const firstError = contactForm.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    function validateField(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return true;

        const errorElement = formGroup.querySelector('.form-error');
        let isValid = true;
        let errorMessage = '';

        // Check if field is empty
        if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'Dette feltet er påkrevd';
        } else {
            // Field-specific validation
            switch (field.type) {
                case 'email':
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Vennligst oppgi en gyldig e-postadresse';
                    }
                    break;

                case 'tel':
                    const phonePattern = /^[\d\s\+\-\(\)]{8,}$/;
                    if (!phonePattern.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Vennligst oppgi et gyldig telefonnummer';
                    }
                    break;
            }
        }

        // Update form group state
        if (isValid) {
            formGroup.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        } else {
            formGroup.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        }

        return isValid;
    }

    function showFormSuccess() {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div class="form-success__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
            </div>
            <h3 class="form-success__title">Takk for din henvendelse!</h3>
            <p class="form-success__text">Vi har mottatt forespørselen din og tar kontakt så raskt som mulig – vanligvis samme dag.</p>
        `;

        // Add success styles
        successMessage.style.cssText = `
            text-align: center;
            padding: 3rem;
            background-color: rgba(45, 90, 61, 0.1);
            border-radius: 16px;
            border: 2px solid #2D5A3D;
        `;

        const iconStyle = successMessage.querySelector('.form-success__icon');
        iconStyle.style.cssText = `
            width: 64px;
            height: 64px;
            margin: 0 auto 1.5rem;
            background-color: #2D5A3D;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const iconSvg = iconStyle.querySelector('svg');
        iconSvg.style.cssText = `
            width: 32px;
            height: 32px;
            color: white;
        `;

        const titleEl = successMessage.querySelector('.form-success__title');
        titleEl.style.cssText = `
            font-family: 'Merriweather', serif;
            font-size: 1.5rem;
            color: #3D4852;
            margin-bottom: 0.5rem;
        `;

        const textEl = successMessage.querySelector('.form-success__text');
        textEl.style.cssText = `
            color: #5A6670;
            font-size: 1rem;
        `;

        // Replace form with success message
        const formContainer = contactForm.parentElement;
        contactForm.style.display = 'none';
        formContainer.appendChild(successMessage);
    }

    // =========================================
    // Smooth Scroll for Anchor Links
    // =========================================
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach((link) => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }

    // =========================================
    // Active Navigation State
    // =========================================
    function updateActiveNavState() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');

        navLinks.forEach((link) => {
            const linkPath = link.getAttribute('href');

            // Check if current page matches link
            if (currentPath.endsWith(linkPath) ||
                (linkPath === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/bermingrud-eiendomsservice/')))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // =========================================
    // Click-to-Call Tracking
    // =========================================
    function initClickToCall() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach((link) => {
            link.addEventListener('click', function() {
                // Analytics tracking could go here
                console.log('Phone click tracked');
            });
        });
    }

    // =========================================
    // Keyboard Navigation
    // =========================================
    function initKeyboardNav() {
        document.addEventListener('keydown', function(e) {
            // Close mobile menu on Escape
            if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // =========================================
    // Service Cards Hover Enhancement
    // =========================================
    function initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card, .feature-card, .value-card, .area-card');

        serviceCards.forEach((card) => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }

    // =========================================
    // Initialize Everything
    // =========================================
    function init() {
        // Scroll handling
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Initial check

        // Mobile menu
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking links
        mobileMenuLinks.forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Initialize components
        initScrollAnimations();
        initFormValidation();
        initSmoothScroll();
        updateActiveNavState();
        initClickToCall();
        initKeyboardNav();
        initServiceCards();

        // Log initialization
        console.log('Bermingrud Eiendomsservice website initialized');
    }

    // =========================================
    // Run on DOM Ready
    // =========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
