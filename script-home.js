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
    
    // Initialize expandable text functionality
    initializeExpandableText();
});

function initializeExpandableText() {
    const expandableElements = document.querySelectorAll('.expandable');
    
    expandableElements.forEach(element => {
        element.addEventListener('click', function() {
            const dataKey = this.getAttribute('datakey');
            const expandedText = this.textContent;
            
            // Track expandable text clicks
            if (typeof umami !== 'undefined') {
                umami.track(`about-expand-${dataKey}-click`, { 
                    dataKey: dataKey,
                    text: expandedText,
                    page: 'home'
                });
            }
            
            if (dataKey) {
                // Find the corresponding span with datavalue
                const targetSpan = document.querySelector(`span[datavalue="${dataKey}"]`);
                
                if (targetSpan) {
                    // Show the target span with a smooth animation
                    targetSpan.style.display = 'inline';
                    
                    // Trigger the fade-in animation
                    setTimeout(() => {
                        targetSpan.classList.add('visible');
                    }, 10);
                    
                    // Remove the expandable class and add expanded class
                    this.classList.remove('expandable');
                    this.classList.add('expanded');
                }
            }
        });
    });
    
    // Initially hide all datavalue spans
    const dataValueSpans = document.querySelectorAll('span[datavalue]');
    dataValueSpans.forEach(span => {
        span.style.display = 'none';
    });
}