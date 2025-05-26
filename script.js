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
    const ctaButton = document.querySelector('.hero-link');
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
        
        // Don't activate anything until user scrolls down a bit
        const scrollThreshold = 100; // pixels
        if (window.pageYOffset < scrollThreshold) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            return;
        }
        
        let current = '';
        const viewportTop = window.pageYOffset;
        const viewportBottom = viewportTop + window.innerHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.clientHeight;
            
            // Check if section is visible in viewport
            const isVisible = sectionTop < viewportBottom && sectionBottom > viewportTop;
            
            // For sections that cross the top edge (traditional behavior)
            if (viewportTop >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
            
            // For small sections that are visible but never cross the top
            // Priority given to sections that are more than 50% visible
            if (isVisible) {
                const visibleTop = Math.max(sectionTop, viewportTop);
                const visibleBottom = Math.min(sectionBottom, viewportBottom);
                const visibleHeight = visibleBottom - visibleTop;
                const sectionHeight = section.clientHeight;
                const visibilityRatio = visibleHeight / sectionHeight;
                
                // If section is more than 50% visible, make it active
                if (visibilityRatio > 0.5) {
                    current = section.getAttribute('id');
                }
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

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        scrollProjects(-1);
    } else if (e.key === 'ArrowRight') {
        scrollProjects(1);
    }
});

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
        // Hide the clicked expandable element
        element.style.display = 'none';
        
        // Show the hidden text with typing animation
        hiddenText.style.display = 'inline';
        
        // Get the full text content
        const fullText = hiddenText.textContent;
        
        // Clear the text and start typing animation
        hiddenText.innerHTML = '';
        
        // Natural typing animation with variable speeds
        let i = 0;
        
        function getTypingDelay(char, nextChar) {
            const baseSpeed = 40; // Base typing speed
            const variation = Math.random() * 30; // Random variation (0-30ms)
            
            // Longer pauses for punctuation
            if (char === '.' || char === '!' || char === '?') {
                return baseSpeed + variation + 200;
            }
            if (char === ',' || char === ';') {
                return baseSpeed + variation + 100;
            }
            if (char === ' ') {
                return baseSpeed + variation + 20;
            }
            
            // Slightly faster for common letter combinations
            const commonPairs = ['th', 'he', 'in', 'er', 'an', 're', 'ed', 'nd', 'ou', 'ea'];
            const currentPair = char + (nextChar || '');
            if (commonPairs.includes(currentPair.toLowerCase())) {
                return Math.max(15, baseSpeed + variation - 15);
            }
            
            return baseSpeed + variation;
        }
        
        function typeCharacter() {
            if (i < fullText.length) {
                const currentChar = fullText.charAt(i);
                const nextChar = fullText.charAt(i + 1);
                
                // Create a span for the new character with grey color
                const charSpan = document.createElement('span');
                charSpan.textContent = currentChar;
                charSpan.style.color = '#999';
                charSpan.style.transition = 'color 0.8s ease-in-out';
                charSpan.classList.add('typing-char');
                
                hiddenText.appendChild(charSpan);
                
                // Fade to black after a delay
                setTimeout(() => {
                    charSpan.style.color = 'var(--text-default)';
                }, 300 + Math.random() * 200); // Random delay between 300-500ms
                
                const delay = getTypingDelay(currentChar, nextChar);
                i++;
                setTimeout(typeCharacter, delay);
            }
        }
        
        // Start typing after a small delay
        setTimeout(typeCharacter, 150);
    }
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Initialize
document.body.style.opacity = '0'; 