// Material Design School Portal - Interactive Behaviors

// ===== Navigation & Scroll Effects =====
const nav = document.querySelector('.nav-bar');
const mobileDrawer = document.getElementById('mobileDrawer');
const menuToggle = document.getElementById('menuToggle');
const drawerClose = document.getElementById('drawerClose');
const drawerLinks = document.querySelectorAll('.drawer-link');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.boxShadow = 'var(--elevation-3)';
    } else {
        nav.style.boxShadow = 'var(--elevation-1)';
    }

    lastScroll = currentScroll;
});

// Mobile drawer toggle
menuToggle.addEventListener('click', () => {
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
});

drawerClose.addEventListener('click', () => {
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
});

// Close drawer when clicking on a link
drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close drawer when clicking outside
mobileDrawer.addEventListener('click', (e) => {
    if (e.target === mobileDrawer) {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Smooth Scroll for Navigation Links =====
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Active Navigation Link Highlighting =====
const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNav);

// ===== Intersection Observer for Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elements to animate on scroll
const animatedElements = document.querySelectorAll(`
    .feature-card,
    .quick-card,
    .info-card,
    .announcement-card,
    .testimonial-card,
    .highlight-card,
    .stat-card
`);

// Set initial state and observe
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// ===== Counter Animation for Stats =====
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
};

// Observe hero stats
const heroStats = document.querySelectorAll('.hero-stats .stat-value');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));

            if (!isNaN(number)) {
                entry.target.textContent = '0';
                animateCounter(entry.target, number);
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

heroStats.forEach(stat => statsObserver.observe(stat));

// Community stats animation
const communityStats = document.querySelectorAll('.stat-card .stat-number');
const communityStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));

            if (!isNaN(number)) {
                entry.target.textContent = '0';
                animateCounter(entry.target, number);
            }

            communityStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

communityStats.forEach(stat => communityStatsObserver.observe(stat));

// ===== Progress Ring Animation =====
const progressRing = document.querySelector('.progress-ring-fill');
if (progressRing) {
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate from 0 to current value
                const currentOffset = parseFloat(progressRing.style.strokeDashoffset || 31.4);
                progressRing.style.strokeDashoffset = '251.2';

                setTimeout(() => {
                    progressRing.style.transition = 'stroke-dashoffset 1.5s ease';
                    progressRing.style.strokeDashoffset = currentOffset;
                }, 100);

                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    progressObserver.observe(progressRing.closest('.grade-card'));
}

// ===== Button Ripple Effect =====
const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(ripple);
};

// Add ripple CSS
const style = document.createElement('style');
style.textContent = `
    .btn-primary, .btn-secondary, .btn-text {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Apply ripple to all buttons
const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-text, .btn-large');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// ===== Quick Access Cards Interactive Glow =====
const quickCards = document.querySelectorAll('.quick-card');
quickCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const color = card.getAttribute('data-color');
        let glowColor;

        switch(color) {
            case 'blue':
                glowColor = 'rgba(33, 150, 243, 0.3)';
                break;
            case 'purple':
                glowColor = 'rgba(156, 39, 176, 0.3)';
                break;
            case 'green':
                glowColor = 'rgba(76, 175, 80, 0.3)';
                break;
            case 'orange':
                glowColor = 'rgba(255, 152, 0, 0.3)';
                break;
            default:
                glowColor = 'rgba(33, 150, 243, 0.3)';
        }

        card.style.boxShadow = `0 8px 24px ${glowColor}`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// ===== Portal Access Button Click Handler =====
const portalAccessBtn = document.getElementById('portalAccessBtn');
const ctaButtons = document.querySelectorAll('.cta-actions .btn-primary, .drawer-cta');

const handlePortalAccess = (e) => {
    e.preventDefault();

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 48px;
        border-radius: 16px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="text-align: center;">
            <span class="material-icons" style="font-size: 64px; color: #2196F3; margin-bottom: 16px;">login</span>
            <h2 style="margin-bottom: 16px; font-size: 28px;">Portal Access</h2>
            <p style="color: rgba(0, 0, 0, 0.6); margin-bottom: 32px;">
                Enter your credentials to access your personalized portal
            </p>
            <div style="text-align: left; margin-bottom: 24px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Username</label>
                <input type="text" placeholder="Enter your username" style="
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #E0E0E0;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.2s;
                " />
            </div>
            <div style="text-align: left; margin-bottom: 24px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Password</label>
                <input type="password" placeholder="Enter your password" style="
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #E0E0E0;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.2s;
                " />
            </div>
            <button class="btn-primary" style="width: 100%; justify-content: center; margin-bottom: 16px;">
                <span>Sign In</span>
                <span class="material-icons">arrow_forward</span>
            </button>
            <button class="btn-text" style="width: 100%;" id="closeModal">Cancel</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Add animations
    const fadeInAnimation = document.createElement('style');
    fadeInAnimation.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(fadeInAnimation);

    // Focus on input borders
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#2196F3';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#E0E0E0';
        });
    });

    // Close modal handlers
    const closeModal = () => {
        overlay.style.animation = 'fadeOut 0.3s ease';
        modal.style.animation = 'slideDown 0.3s ease';

        const fadeOutAnimation = document.createElement('style');
        fadeOutAnimation.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideDown {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(30px);
                }
            }
        `;
        document.head.appendChild(fadeOutAnimation);

        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.style.overflow = '';
        }, 300);
    };

    document.getElementById('closeModal').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
};

portalAccessBtn.addEventListener('click', handlePortalAccess);
ctaButtons.forEach(btn => btn.addEventListener('click', handlePortalAccess));

// ===== Watch Demo Button =====
const watchDemoBtn = document.querySelector('.hero-actions .btn-secondary');
if (watchDemoBtn) {
    watchDemoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Demo video would play here. This is a placeholder for the video player functionality.');
    });
}

// ===== Announcement "View Details" Buttons =====
const announcementButtons = document.querySelectorAll('.announcement-footer .btn-text');
announcementButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.announcement-card');
        const title = card.querySelector('.announcement-title').textContent;

        // Simple notification
        showNotification(`Opening: ${title}`);
    });
});

// Simple notification system
const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #323232;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        z-index: 4000;
        animation: slideInRight 0.3s ease;
    `;

    const slideInStyle = document.createElement('style');
    slideInStyle.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(slideInStyle);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};

// ===== Parallax Effect for Hero Section =====
const heroSection = document.querySelector('.hero-section');
const floatingCards = document.querySelectorAll('.floating-card');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    if (scrolled < heroHeight) {
        floatingCards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            card.style.transform = `translateY(${yPos}px)`;
        });
    }
});

// ===== Keyboard Navigation Support =====
document.addEventListener('keydown', (e) => {
    // ESC to close mobile drawer
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Performance: Lazy Load Images =====
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===== Console Welcome Message =====
console.log('%cEduPortal', 'font-size: 24px; font-weight: bold; color: #2196F3;');
console.log('%cWelcome to the modern school portal experience', 'font-size: 14px; color: #666;');
console.log('%cBuilt with Material Design principles', 'font-size: 12px; color: #999;');

// ===== Initialize on Load =====
window.addEventListener('load', () => {
    // Small delay for smoother initial render
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Set initial body opacity for fade-in effect
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease';
