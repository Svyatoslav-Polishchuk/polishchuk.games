// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scroll for CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector('#contact');
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});

// Project navigation functionality
let currentIndex = 0;
let scrollAccumulator = 0;
let scrollTimeout;

function updateButtonStates() {
    const cards = document.querySelectorAll('.project-card');
    const prevButton = document.querySelector('.nav-arrow.prev');
    const nextButton = document.querySelector('.nav-arrow.next');
    
    if (prevButton && nextButton) {
        // Disable prev button if at start
        if (currentIndex <= 0) {
            prevButton.disabled = true;
            prevButton.style.opacity = '0.5';
            prevButton.style.cursor = 'not-allowed';
        } else {
            prevButton.disabled = false;
            prevButton.style.opacity = '1';
            prevButton.style.cursor = 'pointer';
        }
        
        // Disable next button if at end
        if (currentIndex >= cards.length - 2) {
            nextButton.disabled = true;
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'not-allowed';
        } else {
            nextButton.disabled = false;
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
        }
    }
}

function scrollProjects(direction) {
    const cards = document.querySelectorAll('.project-card');
    const totalCards = cards.length;
    
    if (direction === 1) {
        currentIndex = Math.min(currentIndex + 1, totalCards - 2);
    } else {
        currentIndex = Math.max(currentIndex - 1, 0);
    }
    
    updateCarousel();
    updateButtonStates();
}

function updateCarousel() {
    const projectsWrapper = document.querySelector('.projects-wrapper');
    const cards = document.querySelectorAll('.project-card');
    const cardWidth = cards[0].offsetWidth;
    const gap = 16;
    const translateX = -(currentIndex * (cardWidth + gap));
    
    projectsWrapper.style.transform = `translateX(${translateX}px)`;
}

function snapToNearestCard() {
    const cards = document.querySelectorAll('.project-card');
    const cardWidth = cards[0].offsetWidth + 16;
    
    // Calculate nearest card index
    const targetIndex = Math.round(-scrollAccumulator / cardWidth);
    currentIndex = Math.max(0, Math.min(targetIndex, cards.length - 2));
    
    // Reset accumulator and update position
    scrollAccumulator = -(currentIndex * cardWidth);
    updateCarousel();
    updateButtonStates();
}

// Natural scroll and touch handling
document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.querySelector('.projects-container');
    
    // Initialize button states
    updateButtonStates();
    
    if (projectsContainer) {
        // Wheel scroll handling with accumulation
        projectsContainer.addEventListener('wheel', function(e) {
            // Only handle horizontal scrolling
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
            
            e.preventDefault();
            
            const projectsWrapper = document.querySelector('.projects-wrapper');
            const cards = document.querySelectorAll('.project-card');
            const cardWidth = cards[0].offsetWidth + 16;
            const maxScroll = -(cards.length - 2) * cardWidth;
            
            // Accumulate scroll delta
            scrollAccumulator += -e.deltaX;
            scrollAccumulator = Math.max(maxScroll, Math.min(0, scrollAccumulator));
            
            // Apply smooth transform without transition
            projectsWrapper.style.transition = 'none';
            projectsWrapper.style.transform = `translateX(${scrollAccumulator}px)`;
            
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Snap to nearest card after scrolling stops
            scrollTimeout = setTimeout(() => {
                projectsWrapper.style.transition = 'transform 0.3s ease-in-out';
                snapToNearestCard();
            }, 100);
            
        }, { passive: false });
        
        // Touch handling
        let touchStartX = 0;
        
        projectsContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        });
        
        projectsContainer.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                const direction = diff > 0 ? 1 : -1;
                scrollProjects(direction);
            }
        });
    }
});

// Expandable text functionality
function toggleExpand(element) {
    const hiddenText = element.nextElementSibling;
    
    if (hiddenText && hiddenText.classList.contains('hidden-text')) {
        if (hiddenText.style.display === 'none' || hiddenText.style.display === '') {
            hiddenText.style.display = 'inline';
            element.textContent = 'Show less';
        } else {
            hiddenText.style.display = 'none';
            element.textContent = 'Yay!';
        }
    }
}

// Intersection Observer for fade-in animations
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

// Observe elements for animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.project-card, .gdd-card, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        scrollProjects(-1);
    } else if (e.key === 'ArrowRight') {
        scrollProjects(1);
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Initialize
document.body.style.opacity = '0'; 