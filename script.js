/* ============================================
   CANTERAS ALEBRIJES TEOTIHUACAN
   Landing Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initSmoothScroll();
    initScrollEffects();
    initCopyToClipboard();
    initBackToTop();
    initAnimations();
    initLightbox();
    createParticles();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   SCROLL EFFECTS & NAV HIGHLIGHT
   ============================================ */
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        const scrollY = window.scrollY;

        // Navbar background on scroll
        if (navbar) {
            if (scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // WhatsApp float visibility
        const whatsapp = document.querySelector('.whatsapp-float');
        if (whatsapp) {
            if (scrollY > window.innerHeight * 0.5) {
                whatsapp.classList.add('visible');
            } else {
                whatsapp.classList.remove('visible');
            }
        }

        // Highlight active nav link
        highlightNavLink(scrollY, sections);
    }

    function highlightNavLink(scrollY, sections) {
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = '';

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run once on load
}

/* ============================================
   COPY TO CLIPBOARD
   ============================================ */
function initCopyToClipboard() {
    // Make copyToClipboard available globally
    window.copyToClipboard = function (text, element) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text.replace(/\s/g, '')).then(function () {
                showCopyFeedback(element);
                showToast('Número copiado al portapapeles');
            }).catch(function () {
                fallbackCopy(text, element);
            });
        } else {
            fallbackCopy(text, element);
        }
    };
}

function fallbackCopy(text, element) {
    const textArea = document.createElement('textarea');
    textArea.value = text.replace(/\s/g, '');
    textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback(element);
        showToast('Número copiado al portapapeles');
    } catch (err) {
        showToast('Error al copiar');
    }
    document.body.removeChild(textArea);
}

function showCopyFeedback(element) {
    if (!element) return;
    const btn = element.querySelector('.copy-btn');
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-check';
            icon.style.color = 'var(--success)';
            setTimeout(function () {
                icon.className = 'fas fa-copy';
                icon.style.color = '';
            }, 2000);
        }
    }
}

function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<i class="fas fa-check-circle" style="color:var(--success);margin-right:8px;"></i>' + message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
        toast.classList.add('show');
    });

    setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () { toast.remove(); }, 400);
    }, 2500);
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all data-aos elements
    document.querySelectorAll('[data-aos]').forEach(function (el) {
        el.classList.add('aos-init');
        observer.observe(el);
    });

    // Animated number counters for stat items
    const statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounters();
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statObserver.observe(heroStats);
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(function (counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(easedProgress * target);
            counter.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// Add CSS for animation states dynamically
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    [data-aos].aos-init {
        opacity: 0;
        transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-aos="fade-up"].aos-init { transform: translateY(30px); }
    [data-aos="fade-down"].aos-init { transform: translateY(-30px); }
    [data-aos="fade-right"].aos-init { transform: translateX(-30px); }
    [data-aos="fade-left"].aos-init { transform: translateX(30px); }
    [data-aos="zoom-in"].aos-init { transform: scale(0.92); }
    
    [data-aos].aos-animate {
        opacity: 1;
        transform: translateY(0) translateX(0) scale(1);
    }
    
    /* Staggered delays based on data-aos-delay */
    [data-aos-delay="50"].aos-animate { transition-delay: 50ms; }
    [data-aos-delay="100"].aos-animate { transition-delay: 100ms; }
    [data-aos-delay="150"].aos-animate { transition-delay: 150ms; }
    [data-aos-delay="200"].aos-animate { transition-delay: 200ms; }
    [data-aos-delay="250"].aos-animate { transition-delay: 250ms; }
    [data-aos-delay="300"].aos-animate { transition-delay: 300ms; }
    [data-aos-delay="350"].aos-animate { transition-delay: 350ms; }
    
    /* Active nav link style */
    .nav-link.active {
        color: var(--white);
    }
    .nav-link.active::after {
        width: 70%;
    }
    
    /* Section header entrance */
    .section-header.aos-init {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .section-header.aos-animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(animationStyles);

/* ============================================
   LIGHTBOX (Gallery)
   ============================================ */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightbox || !lightboxImg) return;

    // Open lightbox on gallery item click
    document.querySelectorAll('.gallery-item').forEach(function (item) {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(function () { lightboxImg.src = ''; }, 350);
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* ============================================
   PARTICLE EFFECT
   ============================================ */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 25;
    const colors = [
        'rgba(232, 93, 4, 0.4)',
        'rgba(247, 127, 0, 0.3)',
        'rgba(255, 183, 3, 0.25)',
        'rgba(255, 203, 71, 0.2)',
        'rgba(255, 255, 255, 0.08)'
    ];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 12 + 8}s ease-in-out infinite;
            animation-delay: ${Math.random() * 6}s;
            pointer-events: none;
        `;
        container.appendChild(particle);
    }
}

// Add particle float animation
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        50% {
            transform: translateY(-80px) translateX(30px);
            opacity: 0.7;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-160px) translateX(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);
