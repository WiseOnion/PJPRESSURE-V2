// ===================================
// MOBILE MENU TOGGLE
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// ===================================
// STICKY HEADER SHADOW
// ===================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight + nav.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-list a');

function updateActiveNavLink() {
    const scrollPos = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elements to animate on scroll
const animateElements = document.querySelectorAll(
    '.service-card, .feature-box, .testimonial-card, .badge'
);

animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// ===================================
// SLIDING GOOGLE REVIEWS
// ===================================
const sampleReviews = [
    {
        author: "Carlton Burse",
        rating: 5,
        date: "7 months ago",
        text: "Great work!! These guys do a wonderful job and are very affordable. I highly recommend these guys for all your pressure washing needs. If I could I'd give them 10 stars."
    },
    {
        author: "Suzanne Daniels",
        rating: 5,
        date: "1 week ago",
        text: "The house looks brand new! Quick to get you on their schedule and the price is affordable. Will definitely be using their services again. They're quick and do quality work."
    },
    {
        author: "Aida Patchana",
        rating: 5,
        date: "a year ago",
        text: "I really satisfied with the service! He did an amazing job, and great personality! I will definitely will recommend his service to anyone! Thank you!"
    },
    {
        author: "Darlene Burdsall",
        rating: 5,
        date: "One week ago",
        text: "Our house looks brand new! Quick to get you on their schedule and the price is affordable. Will definitely be using their services again. They're quick and do quality work."
    }
];

function createReviewCard(review) {
    const initial = review.author.charAt(0).toUpperCase();
    const stars = '★'.repeat(review.rating);
    
    return `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${initial}</div>
                <div class="review-info">
                    <div class="review-author">${review.author}</div>
                    <div class="review-date">${review.date}</div>
                </div>
            </div>
            <div class="review-stars">${stars}</div>
            <div class="review-text">${review.text}</div>
        </div>
    `;
}

function initReviews() {
    const track = document.getElementById('reviewsTrack');
    if (track) {
        // Create reviews twice for seamless loop
        const reviewsHTML = sampleReviews.map(createReviewCard).join('');
        track.innerHTML = reviewsHTML + reviewsHTML;
    }
}

// Initialize reviews on load
window.addEventListener('DOMContentLoaded', () => {
    initReviews();
});

// ===================================
// ENHANCED BEFORE/AFTER SLIDER - COMPLETE FIX
// ===================================

class BeforeAfterSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.slider-handle');
        this.beforeImage = container.querySelector('.before-image');
        this.isDragging = false;

        // Only initialize if not already done and elements exist
        if (this.slider && this.beforeImage && !container.dataset.sliderInit) {
            this.init();
        }
    }

    init() {
        // Mark as initialized
        this.container.dataset.sliderInit = 'true';
        
        // Remove any hover interference
        this.container.style.pointerEvents = 'auto';
        
        // Mouse events
        this.container.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));

        // Touch events
        this.container.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
        document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
        document.addEventListener('touchend', this.stopDrag.bind(this));

        // Set initial position (50% split)
        const rect = this.container.getBoundingClientRect();
        if (rect.width > 0) {
            const centerX = rect.left + (rect.width / 2);
            this.updateSlider({ clientX: centerX, type: 'init' });
        }
        
        console.log('Slider initialized:', this.container.dataset.project || 'lightbox');
    }

    startDrag(e) {
        this.isDragging = true;
        this.container.style.cursor = 'ew-resize';
        this.updateSlider(e);
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;
        this.updateSlider(e);
        e.preventDefault();
    }

    stopDrag() {
        this.isDragging = false;
        this.container.style.cursor = 'pointer';
    }

    updateSlider(e) {
        const rect = this.container.getBoundingClientRect();
        let x;
        
        if (e.type === 'init') {
            x = e.clientX - rect.left;
        } else if (e.type.includes('touch')) {
            if (e.touches && e.touches.length > 0) {
                x = e.touches[0].clientX - rect.left;
            } else {
                return;
            }
        } else {
            x = e.clientX - rect.left;
        }
        
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

        // Update the before image clip path
        this.beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        this.slider.style.left = `${percentage}%`;
    }
}

// Initialize all sliders function
function initAllSliders() {
    const containers = document.querySelectorAll('.before-after-container');
    console.log(`Found ${containers.length} slider containers`);
    
    containers.forEach((container, index) => {
        if (!container.dataset.sliderInit) {
            console.log(`Initializing slider ${index + 1}`);
            new BeforeAfterSlider(container);
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing sliders...');
    
    // Small delay to ensure images are in DOM
    setTimeout(() => {
        initAllSliders();
    }, 100);

    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('filtered-out');
                        item.style.animation = 'fadeInUp 0.6s ease-out';
                    } else {
                        item.classList.add('filtered-out');
                    }
                });
            });
        });
    }

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightboxModal && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't open if clicking inside the slider area
                if (e.target.closest('.before-after-container')) {
                    return;
                }

                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('.gallery-item-content p').textContent;
                const location = item.querySelector('.project-details span:first-child').textContent.trim();
                const duration = item.querySelector('.project-details span:last-child').textContent.trim();
                const category = item.querySelector('.project-type').textContent;

                const beforeImg = item.querySelector('.before-image img').src;
                const afterImg = item.querySelector('.after-image img').src;

                document.getElementById('lightboxProjectTitle').textContent = title;
                document.getElementById('lightboxProjectDescription').textContent = description;
                document.getElementById('lightboxLocation').textContent = location;
                document.getElementById('lightboxDuration').textContent = duration;
                document.getElementById('lightboxCategory').textContent = category;

                document.getElementById('lightboxBeforeImg').src = beforeImg;
                document.getElementById('lightboxAfterImg').src = afterImg;

                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Initialize slider for lightbox
                setTimeout(() => {
                    const lightboxSlider = document.getElementById('lightboxSlider');
                    if (lightboxSlider && !lightboxSlider.dataset.sliderInit) {
                        console.log('Initializing lightbox slider');
                        new BeforeAfterSlider(lightboxSlider);
                    }
                }, 150);
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Backup: Initialize on window load
window.addEventListener('load', () => {
    console.log('Window Loaded - Re-checking sliders...');
    setTimeout(() => {
        initAllSliders();
    }, 100);
});

// Additional backup: Re-initialize after delay (for lazy-loaded content)
setTimeout(() => {
    console.log('Delayed initialization check...');
    initAllSliders();
}, 1000);

// ===================================
// LOG INITIALIZATION
// ===================================
console.log('PJ Pressure Washing website initialized successfully!');