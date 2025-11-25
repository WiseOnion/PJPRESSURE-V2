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
// LOG INITIALIZATION
// ===================================
console.log('PJ Pressure Washing website initialized successfully!');