/**
 * DevCenturioAI - Main JavaScript
 * @version 2.1.0
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
    initChatbot();
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

/**
 * AI Chatbot Widget
 */
function initChatbot() {
    // Create chatbot HTML
    const chatbotHTML = `
        <div id="chatbot-widget" class="chatbot-widget">
            <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Ouvrir le chat">
                <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span class="chatbot-badge">1</span>
            </button>

            <div id="chatbot-container" class="chatbot-container">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <span>C</span>
                            <span class="chatbot-status"></span>
                        </div>
                        <div>
                            <h4>CenturioBot</h4>
                            <p>Assistant IA • En ligne</p>
                        </div>
                    </div>
                    <button id="chatbot-close" class="chatbot-close" aria-label="Fermer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div id="chatbot-messages" class="chatbot-messages">
                    <div class="chat-message bot">
                        <div class="message-avatar">C</div>
                        <div class="message-content">
                            <p>Bonjour ! Je suis CenturioBot, votre assistant. Comment puis-je vous aider ?</p>
                        </div>
                    </div>
                </div>

                <div class="chatbot-quick-replies">
                    <button class="quick-reply" data-question="prix">Vos tarifs</button>
                    <button class="quick-reply" data-question="delai">Délais de livraison</button>
                    <button class="quick-reply" data-question="ia">Services IA</button>
                    <button class="quick-reply" data-question="contact">Contacter un humain</button>
                </div>

                <div class="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Écrivez votre message..." autocomplete="off">
                    <button id="chatbot-send" aria-label="Envoyer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Create chatbot styles
    const chatbotStyles = `
        <style id="chatbot-styles">
            .chatbot-widget {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .chatbot-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
                transition: transform 0.3s, box-shadow 0.3s;
                position: relative;
            }

            .chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(245, 158, 11, 0.5);
            }

            .chatbot-toggle svg {
                width: 28px;
                height: 28px;
                color: white;
                transition: opacity 0.3s, transform 0.3s;
            }

            .chatbot-toggle .close-icon {
                position: absolute;
                opacity: 0;
                transform: rotate(-90deg);
            }

            .chatbot-widget.open .chatbot-toggle .chat-icon {
                opacity: 0;
                transform: rotate(90deg);
            }

            .chatbot-widget.open .chatbot-toggle .close-icon {
                opacity: 1;
                transform: rotate(0);
            }

            .chatbot-badge {
                position: absolute;
                top: -4px;
                right: -4px;
                width: 20px;
                height: 20px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                font-size: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: pulse 2s infinite;
            }

            .chatbot-widget.open .chatbot-badge,
            .chatbot-widget.seen .chatbot-badge {
                display: none;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .chatbot-container {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                max-width: calc(100vw - 48px);
                background: #0f172a;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px) scale(0.95);
                transition: all 0.3s ease;
                border: 1px solid #1e293b;
            }

            .chatbot-widget.open .chatbot-container {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }

            .chatbot-header {
                background: linear-gradient(135deg, #1e293b, #334155);
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #334155;
            }

            .chatbot-header-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .chatbot-avatar {
                width: 44px;
                height: 44px;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                color: white;
                font-size: 18px;
                position: relative;
            }

            .chatbot-status {
                position: absolute;
                bottom: -2px;
                right: -2px;
                width: 12px;
                height: 12px;
                background: #10b981;
                border: 2px solid #1e293b;
                border-radius: 50%;
            }

            .chatbot-header h4 {
                color: white;
                font-size: 15px;
                font-weight: 600;
                margin: 0;
            }

            .chatbot-header p {
                color: #94a3b8;
                font-size: 12px;
                margin: 2px 0 0 0;
            }

            .chatbot-close {
                width: 32px;
                height: 32px;
                background: transparent;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: background 0.2s;
            }

            .chatbot-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .chatbot-close svg {
                width: 20px;
                height: 20px;
                color: #94a3b8;
            }

            .chatbot-messages {
                height: 320px;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: #020617;
            }

            .chatbot-messages::-webkit-scrollbar {
                width: 6px;
            }

            .chatbot-messages::-webkit-scrollbar-track {
                background: transparent;
            }

            .chatbot-messages::-webkit-scrollbar-thumb {
                background: #334155;
                border-radius: 3px;
            }

            .chat-message {
                display: flex;
                gap: 10px;
                animation: messageIn 0.3s ease;
            }

            @keyframes messageIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .chat-message.user {
                flex-direction: row-reverse;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                color: white;
                font-size: 14px;
                flex-shrink: 0;
            }

            .chat-message.user .message-avatar {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
            }

            .message-content {
                max-width: 75%;
                background: #1e293b;
                padding: 12px 16px;
                border-radius: 16px;
                border-top-left-radius: 4px;
            }

            .chat-message.user .message-content {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                border-radius: 16px;
                border-top-right-radius: 4px;
            }

            .message-content p {
                color: #e2e8f0;
                font-size: 14px;
                line-height: 1.5;
                margin: 0;
            }

            .chat-message.user .message-content p {
                color: white;
            }

            .message-content a {
                color: #f59e0b;
                text-decoration: none;
                font-weight: 500;
            }

            .message-content a:hover {
                text-decoration: underline;
            }

            .chatbot-quick-replies {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 12px 20px;
                background: #0f172a;
                border-top: 1px solid #1e293b;
            }

            .quick-reply {
                background: #1e293b;
                border: 1px solid #334155;
                color: #e2e8f0;
                padding: 8px 14px;
                border-radius: 20px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
                font-family: inherit;
            }

            .quick-reply:hover {
                background: #334155;
                border-color: #f59e0b;
                color: #f59e0b;
            }

            .chatbot-input-container {
                display: flex;
                gap: 10px;
                padding: 16px 20px;
                background: #0f172a;
                border-top: 1px solid #1e293b;
            }

            #chatbot-input {
                flex: 1;
                background: #1e293b;
                border: 1px solid #334155;
                border-radius: 12px;
                padding: 12px 16px;
                color: white;
                font-size: 14px;
                font-family: inherit;
                outline: none;
                transition: border-color 0.2s;
            }

            #chatbot-input::placeholder {
                color: #64748b;
            }

            #chatbot-input:focus {
                border-color: #f59e0b;
            }

            #chatbot-send {
                width: 44px;
                height: 44px;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                border: none;
                border-radius: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s, box-shadow 0.2s;
            }

            #chatbot-send:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
            }

            #chatbot-send svg {
                width: 20px;
                height: 20px;
                color: white;
            }

            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
            }

            .typing-indicator span {
                width: 8px;
                height: 8px;
                background: #64748b;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out both;
            }

            .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
            .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
                40% { transform: scale(1); opacity: 1; }
            }

            @media (max-width: 480px) {
                .chatbot-widget {
                    bottom: 16px;
                    right: 16px;
                }

                .chatbot-container {
                    width: calc(100vw - 32px);
                    right: -8px;
                    bottom: 70px;
                }

                .chatbot-messages {
                    height: 280px;
                }
            }
        </style>
    `;

    // Insert styles and HTML
    document.head.insertAdjacentHTML('beforeend', chatbotStyles);
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Get elements
    const widget = document.getElementById('chatbot-widget');
    const toggle = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const messages = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const quickReplies = document.querySelectorAll('.quick-reply');

    // Knowledge base
    const knowledge = {
        prix: {
            keywords: ['prix', 'tarif', 'coût', 'cout', 'combien', 'budget', 'devis', 'offre', 'starter', 'business', 'enterprise'],
            response: `Nos tarifs sont adaptés à chaque besoin :<br><br>
                <strong>🚀 Starter</strong> - 499€<br>
                Site vitrine 5 pages, responsive, SEO basique<br><br>
                <strong>⭐ Business</strong> - 1499€ <em>(Populaire)</em><br>
                Site avancé 15 pages, chatbot IA, analytics<br><br>
                <strong>🏢 Enterprise</strong> - Sur devis<br>
                Solution sur-mesure avec IA avancée<br><br>
                <a href="#pricing">Voir les détails</a> ou <a href="https://wa.me/33658687475?text=Bonjour,%20je%20souhaite%20un%20devis" target="_blank">demander un devis personnalisé</a>`
        },
        delai: {
            keywords: ['délai', 'delai', 'temps', 'livraison', 'combien de temps', 'durée', 'duree', 'quand'],
            response: `Nos délais de livraison standards :<br><br>
                <strong>Starter</strong> : 1-2 semaines<br>
                <strong>Business</strong> : 2-3 semaines<br>
                <strong>Enterprise</strong> : 4-8 semaines<br><br>
                Ces délais dépendent de la rapidité de validation et de la fourniture des contenus. Besoin d'un site en urgence ? <a href="https://wa.me/33658687475?text=Bonjour,%20j'ai%20besoin%20d'un%20site%20rapidement" target="_blank">Contactez-nous</a> !`
        },
        ia: {
            keywords: ['ia', 'intelligence artificielle', 'chatbot', 'automatisation', 'gpt', 'claude', 'ai'],
            response: `Nous intégrons l'IA à vos projets :<br><br>
                <strong>🤖 Chatbots IA</strong><br>
                Assistants intelligents entraînés sur vos données<br><br>
                <strong>⚡ Automatisation</strong><br>
                Workflows avec n8n, Make, Zapier<br><br>
                <strong>📊 Analytics IA</strong><br>
                Tableaux de bord intelligents<br><br>
                <a href="blog/ia-entreprises-2025.html">Lire notre article sur l'IA</a>`
        },
        contact: {
            keywords: ['contact', 'humain', 'parler', 'appeler', 'email', 'téléphone', 'telephone', 'whatsapp'],
            response: `Contactez notre équipe directement :<br><br>
                <strong>📱 WhatsApp</strong> (Recommandé - Réponse rapide)<br>
                <a href="https://wa.me/33658687475" target="_blank">+33 6 58 68 74 75</a><br><br>
                <strong>📧 Email</strong><br>
                <a href="mailto:contact@devcenturio.ai">contact@devcenturio.ai</a><br><br>
                Nous répondons généralement sous 2h en journée !`
        },
        demo: {
            keywords: ['demo', 'démo', 'exemple', 'portfolio', 'réalisation', 'realisation', 'travaux'],
            response: `Découvrez nos réalisations :<br><br>
                <strong>🔧 DepanPro 24/7</strong><br>
                <a href="depannage-auto/index.html">Site de dépannage automobile</a><br><br>
                <strong>🚗 AutoPro IA</strong><br>
                <a href="saas-landing/index.html">Dashboard garage avec IA</a><br><br>
                <a href="#demos">Voir toutes les démos</a>`
        },
        bonjour: {
            keywords: ['bonjour', 'salut', 'hello', 'coucou', 'hey', 'bonsoir'],
            response: `Bonjour ! 👋 Bienvenue chez DevCenturioAI !<br><br>
                Je suis CenturioBot, votre assistant. Je peux vous renseigner sur :<br><br>
                • Nos <strong>tarifs</strong> et offres<br>
                • Les <strong>délais</strong> de livraison<br>
                • Nos services <strong>IA</strong><br>
                • Nos <strong>démos</strong><br><br>
                Comment puis-je vous aider ?`
        },
        merci: {
            keywords: ['merci', 'thanks', 'super', 'parfait', 'génial', 'genial', 'cool'],
            response: `Avec plaisir ! 😊<br><br>
                N'hésitez pas si vous avez d'autres questions. Pour démarrer votre projet :<br><br>
                <a href="https://wa.me/33658687475?text=Bonjour,%20je%20souhaite%20discuter%20de%20mon%20projet" target="_blank">💬 Discuter sur WhatsApp</a>`
        }
    };

    // Default response
    const defaultResponse = `Je ne suis pas sûr de comprendre votre question. 🤔<br><br>
        Je peux vous aider avec :<br>
        • <strong>Tarifs</strong> - Nos offres et prix<br>
        • <strong>Délais</strong> - Temps de livraison<br>
        • <strong>IA</strong> - Nos services d'intelligence artificielle<br>
        • <strong>Contact</strong> - Parler à un humain<br><br>
        Ou posez votre question directement à notre équipe : <a href="https://wa.me/33658687475" target="_blank">WhatsApp</a>`;

    // Find response based on message
    function findResponse(message) {
        const lowerMessage = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        for (const [key, data] of Object.entries(knowledge)) {
            for (const keyword of data.keywords) {
                if (lowerMessage.includes(keyword.toLowerCase())) {
                    return data.response;
                }
            }
        }

        return defaultResponse;
    }

    // Add message to chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ' + (isUser ? 'user' : 'bot');
        messageDiv.innerHTML = `
            <div class="message-avatar">${isUser ? 'V' : 'C'}</div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.id = 'typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">C</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    // Remove typing indicator
    function hideTyping() {
        const typing = document.getElementById('typing-message');
        if (typing) typing.remove();
    }

    // Process message
    function processMessage(message) {
        if (!message.trim()) return;

        addMessage(message, true);
        input.value = '';

        // Show typing
        showTyping();

        // Simulate response delay
        setTimeout(function() {
            hideTyping();
            const response = findResponse(message);
            addMessage(response);
        }, 800 + Math.random() * 700);
    }

    // Toggle chat
    toggle.addEventListener('click', function() {
        widget.classList.toggle('open');
        widget.classList.add('seen');
        if (widget.classList.contains('open')) {
            input.focus();
        }
    });

    // Close chat
    closeBtn.addEventListener('click', function() {
        widget.classList.remove('open');
    });

    // Send message
    sendBtn.addEventListener('click', function() {
        processMessage(input.value);
    });

    // Send on Enter
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processMessage(input.value);
        }
    });

    // Quick replies
    quickReplies.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            const questionTexts = {
                prix: 'Quels sont vos tarifs ?',
                delai: 'Quels sont vos délais de livraison ?',
                ia: 'Quels services IA proposez-vous ?',
                contact: 'Je voudrais parler à quelqu\'un'
            };
            processMessage(questionTexts[question] || question);
        });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!widget.contains(e.target) && widget.classList.contains('open')) {
            widget.classList.remove('open');
        }
    });
}
