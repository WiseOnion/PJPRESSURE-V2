// ===================================
// MOBILE MENU TOGGLE
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

function openMenu() {
    nav.classList.add('active');
    mobileMenuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    nav.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
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
// SLIDING GOOGLE REVIEWS
// ===================================
const sampleReviews = [
    {
        author: "R L Smith",
        rating: 5,
        date: "10 months ago",
        text: "PJ Pressure Washing power washed my two-story home in one morning and did an excellent job. The house looks brand new. I am very pleased with the service, price, and results."
    },
    {
        author: "Tisha Evans",
        rating: 5,
        date: "11 months ago",
        text: "I highly recommend PJ Pressure Washing! They provided pressure washing services for my buyer client and did an exceptional job. Professional, efficient, and delivered top-quality results."
    },
    {
        author: "Marcus Leavell",
        rating: 5,
        date: "1 month ago",
        text: "Outstanding job pressure washing house and surrounding areas. Great price and customer service. I plan to use them again in the future!"
    },
    {
        author: "Carlton Burse",
        rating: 5,
        date: "7 months ago",
        text: "Great work!! These guys do a wonderful job and are very affordable. I highly recommend these guys for all your pressure washing needs. If I could I'd give them 10 stars."
    },
    {
        author: "Aida Patchana",
        rating: 5,
        date: "1 year ago",
        text: "I really satisfied with the service! He did an amazing job, and great personality! I will definitely will recommend his service to anyone! Thank you!"
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
// CONTACT FORM
// ===================================
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    emailjs.init('xr7buqF-wb6GEYvOb');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const templateParams = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            phone: contactForm.phone.value,
            address: contactForm.address.value,
            service: contactForm.service.value,
            message: contactForm.message.value,
        };

        try {
            await emailjs.send('service_9ukaak8', 'template_7khptr3', templateParams);
            contactForm.style.display = 'none';
            if (successMessage) {
                successMessage.classList.add('visible');
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } catch (err) {
            console.error('EmailJS error:', err);
            submitBtn.textContent = 'Failed — Try Again';
            submitBtn.disabled = false;
        }
    });
}

// ===================================
// BEFORE/AFTER SLIDER
// ===================================

class BeforeAfterSlider {
    constructor(container) {
        this.container = container;
        this.handle = container.querySelector('.slider-handle');
        this.beforeImage = container.querySelector('.before-image');
        this.isDragging = false;
        this.position = 50; // percent

        this.afterImage = container.querySelector('.after-image');

        if (this.handle && this.beforeImage && this.afterImage) {
            this.destroy(); // clean up any old listeners
            this.init();
        }
    }

    destroy() {
        // Remove old bound listeners if re-initializing
        if (this._onMouseDown) this.container.removeEventListener('mousedown', this._onMouseDown);
        if (this._onTouchStart) this.container.removeEventListener('touchstart', this._onTouchStart);
        if (this._onMouseMove) document.removeEventListener('mousemove', this._onMouseMove);
        if (this._onMouseUp) document.removeEventListener('mouseup', this._onMouseUp);
        if (this._onTouchMove) document.removeEventListener('touchmove', this._onTouchMove);
        if (this._onTouchEnd) document.removeEventListener('touchend', this._onTouchEnd);
    }

    init() {
        this._onMouseDown = this.startDrag.bind(this);
        this._onMouseMove = this.drag.bind(this);
        this._onMouseUp = this.stopDrag.bind(this);
        this._onTouchStart = this.startDrag.bind(this);
        this._onTouchMove = this.drag.bind(this);
        this._onTouchEnd = this.stopDrag.bind(this);

        this.container.addEventListener('mousedown', this._onMouseDown);
        document.addEventListener('mousemove', this._onMouseMove);
        document.addEventListener('mouseup', this._onMouseUp);
        this.container.addEventListener('touchstart', this._onTouchStart, { passive: false });
        document.addEventListener('touchmove', this._onTouchMove, { passive: false });
        document.addEventListener('touchend', this._onTouchEnd);

        this.setPosition(50);
    }

    getX(e) {
        if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
        return e.clientX;
    }

    startDrag(e) {
        this.isDragging = true;
        this.container.style.cursor = 'ew-resize';
        this.updateFromEvent(e);
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;
        this.updateFromEvent(e);
        e.preventDefault();
    }

    stopDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.container.style.cursor = 'ew-resize';
    }

    updateFromEvent(e) {
        const rect = this.container.getBoundingClientRect();
        const x = this.getX(e) - rect.left;
        const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
        this.setPosition(pct);
    }

    setPosition(pct) {
        this.position = pct;
        // before visible on LEFT: clip its right edge
        this.beforeImage.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        // after visible on RIGHT: clip its left edge
        this.afterImage.style.clipPath = `inset(0 0 0 ${pct}%)`;
        this.handle.style.left = `${pct}%`;
    }
}

// Store slider instances so lightbox can be re-inited cleanly
const sliderInstances = new Map();

function initAllSliders() {
    document.querySelectorAll('.before-after-container:not(#lightboxSlider)').forEach(container => {
        if (sliderInstances.has(container)) {
            // Re-apply position in case container was hidden during first init
            sliderInstances.get(container).setPosition(50);
        } else {
            sliderInstances.set(container, new BeforeAfterSlider(container));
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initAllSliders();

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
                    } else {
                        item.classList.add('filtered-out');
                    }
                });
                // Re-init sliders that were hidden during initial load
                initAllSliders();
            });
        });
    }

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxClose = document.getElementById('lightboxClose');
    let lightboxSliderInstance = null;

    if (lightboxModal && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
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

                // Always re-initialize lightbox slider with fresh position
                setTimeout(() => {
                    const lightboxSlider = document.getElementById('lightboxSlider');
                    if (lightboxSlider) {
                        if (lightboxSliderInstance) lightboxSliderInstance.destroy();
                        lightboxSliderInstance = new BeforeAfterSlider(lightboxSlider);
                    }
                }, 100);
            });
        });

        function closeLightbox() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) closeLightbox();
        });
    }
});

window.addEventListener('load', initAllSliders);