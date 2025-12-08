/**
 * DevCenturioAI - Main JavaScript
 * @version 2.0.0
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initLucideIcons();
    initMobileMenu();
    initNavbarScroll();
    initFaqAccordion();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
});

/**
 * Initialize Lucide Icons
 */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', function() {
        const isActive = mobileMenu.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isActive);
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.mobile-nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.focus();
        }
    });
}

/**
 * Navbar scroll effect
 */
function initNavbarScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 100) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(function(i) {
                i.classList.remove('active');
                const btn = i.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });

        // Keyboard navigation
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

/**
 * Scroll reveal animations
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const revealOnScroll = function() {
        revealElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                revealOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    revealOnScroll();
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without triggering scroll
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.btn-submit');
        if (!submitBtn) return;

        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i data-lucide="loader" class="spinning"></i> Envoi en cours...';
        submitBtn.disabled = true;
        initLucideIcons();

        try {
            // Send form data to Web3Forms
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Success state
                submitBtn.innerHTML = '<i data-lucide="check-circle"></i> Message envoy\u00e9 !';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                initLucideIcons();

                setTimeout(function() {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    initLucideIcons();
                    showNotification('Merci ! Nous vous r\u00e9pondrons sous 24h.', 'success');
                }, 2000);
            } else {
                throw new Error('\u00c9chec de l\'envoi');
            }
        } catch (error) {
            // Error state
            showNotification('Erreur lors de l\'envoi. Contactez-nous directement par email ou WhatsApp.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            initLucideIcons();
        }
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification-toast notification-' + type;
    notification.textContent = message;
    notification.style.cssText = [
        'position: fixed',
        'bottom: 100px',
        'right: 24px',
        'padding: 1rem 1.5rem',
        'border-radius: 12px',
        'color: white',
        'font-weight: 500',
        'z-index: 10000',
        'animation: fadeInUp 0.3s ease',
        'box-shadow: 0 4px 20px rgba(0,0,0,0.2)',
        type === 'success' ? 'background: linear-gradient(135deg, #10b981, #059669)' : 'background: linear-gradient(135deg, #ef4444, #dc2626)'
    ].join(';');

    document.body.appendChild(notification);

    setTimeout(function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 4000);
}
