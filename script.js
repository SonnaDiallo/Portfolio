/* Portfolio Sonna - JavaScript Optimisé SEO & Performance */

// ✅ Chargement DOMContentLoaded pour performances optimales
document.addEventListener('DOMContentLoaded', function() {
    
    // ==============================================
    // 1. LAZY LOADING DES IMAGES (IntersectionObserver)
    // ==============================================
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Charger l'image réelle
                    img.src = img.dataset.src;
                    // Retirer la classe skeleton une fois chargée
                    img.onload = () => {
                        img.classList.remove('skeleton');
                        img.classList.add('loaded');
                    };
                    // Arrêter d'observer cette image
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Charger 50px avant d'être visible
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback pour navigateurs anciens
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('skeleton');
        });
    }

    // ==============================================
    // 2. MENU MOBILE - Toggle & Close on link click
    // ==============================================
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');
    
    if (menuIcon && navbar) {
        // Ouvrir/Fermer le menu
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuIcon.setAttribute('aria-expanded', navbar.classList.contains('active'));
        });
        
        // Fermer le menu au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                menuIcon.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Fermer le menu au clic en dehors
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
                navbar.classList.remove('active');
                menuIcon.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ==============================================
    // 3. ACTIVE LINK - Navigation Scroll Spy
    // ==============================================
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.navbar a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    // Throttle pour optimiser les performances
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ==============================================
    // 4. ANIMATION AU SCROLL - Sections fade-in
    // ==============================================
    const animatedSections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionnel: arrêter d'observer après l'animation
                // sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ==============================================
    // 5. VALIDATION FORMULAIRE DE CONTACT
    // ==============================================
    const contactForm = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm) {
        // Validation en temps réel
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.parentElement.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
        
        // Soumission du formulaire
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Valider tous les champs
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                showMessage('Veuillez corriger les erreurs dans le formulaire', 'error');
                return;
            }
            
            // Désactiver le bouton et afficher le loading
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Récupérer les données du formulaire
            const formData = new FormData(contactForm);
            const data = {
                nom: formData.get('nom').trim(),
                email: formData.get('email').trim(),
                sujet: formData.get('sujet').trim(),
                message: formData.get('message').trim()
            };
            
            try {
                // Simulation d'envoi (remplacer par votre API)
                await sendEmail(data);
                
                showMessage('Message envoyé avec succès ! Je vous répondrai sous 24h.', 'success');
                contactForm.reset();
                inputs.forEach(input => input.parentElement.classList.remove('valid'));
                
            } catch (error) {
                console.error('Erreur:', error);
                showMessage('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }
    
    // Fonction de validation des champs
    function validateField(field) {
        const inputGroup = field.parentElement;
        const value = field.value.trim();
        let isValid = true;
        
        inputGroup.classList.remove('error', 'valid');
        
        if (field.name === 'nom') {
            isValid = value.length >= 2;
        } else if (field.name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        } else if (field.name === 'sujet') {
            isValid = value.length >= 3;
        } else if (field.name === 'message') {
            isValid = value.length >= 10;
        }
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }
        
        inputGroup.classList.add(isValid ? 'valid' : 'error');
        field.setAttribute('aria-invalid', !isValid);
        
        return isValid;
    }
    
    // Afficher les messages de statut
    function showMessage(text, type) {
        if (!statusMessage) return;
        
        statusMessage.textContent = text;
        statusMessage.className = `status-message ${type} show`;
        statusMessage.setAttribute('role', 'alert');
        
        // Scroll vers le message
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Masquer après 5 secondes
        setTimeout(() => {
            statusMessage.classList.remove('show');
        }, 5000);
    }
    
    // Fonction d'envoi d'email (à personnaliser avec EmailJS ou votre API)
    async function sendEmail(data) {
        // Simulation d'un délai réseau
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Remplacer par votre logique d'envoi
                console.log('Données du formulaire:', data);
                
                // Si vous utilisez EmailJS:
                // emailjs.send('SERVICE_ID', 'TEMPLATE_ID', data)
                //   .then(response => resolve(response))
                //   .catch(error => reject(error));
                
                resolve({ success: true });
            }, 1500);
        });
    }

    // ==============================================
    // 6. ANIMATION DES BARRES DE PROGRESSION
    // ==============================================
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress');
    
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillsObserver.observe(skillsSection);
    }

    // ==============================================
    // 7. SMOOTH SCROLL POUR LES ANCRES
    // ==============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorer les liens vides
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==============================================
    // 8. PRELOAD CRITICAL IMAGES
    // ==============================================
    const criticalImages = [
        'image/S-removebg-preview (1) (1).png',
        'image/M-removebg-preview (1).png'
    ];
    
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        });
    }

    // ==============================================
    // 9. ACCESSIBILITÉ - Focus visible
    // ==============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });

    // ==============================================
    // 10. PERFORMANCE MONITORING (DEV)
    // ==============================================
    if ('PerformanceObserver' in window) {
        // Mesurer les Core Web Vitals
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`${entry.name}: ${entry.value.toFixed(2)}ms`);
                }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
        } catch (e) {
            // Observer non supporté
        }
    }

    // ==============================================
    // 11. CONSOLE LOG - Version
    // ==============================================
    console.log(
        '%c✨ Portfolio Sonna - Version SEO Optimisée ✅',
        'color: #00abf0; font-size: 16px; font-weight: bold; padding: 10px;'
    );
    console.log(
        '%c🚀 Performances optimales | Lazy loading | Accessibilité WCAG 2.1',
        'color: #4caf50; font-size: 12px;'
    );
});

// ==============================================
// 12. SERVICE WORKER (optionnel pour PWA)
// ==============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Décommenter si vous créez un service worker
        // navigator.serviceWorker.register('/sw.js')
        //   .then(reg => console.log('Service Worker enregistré'))
        //   .catch(err => console.log('Erreur Service Worker:', err));
    });
}