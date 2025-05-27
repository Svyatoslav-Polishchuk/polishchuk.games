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
// function toggleExpand(element, targetId) {
//     const hiddenText = document.getElementById(targetId);
    
//     // Check if already expanded
//     if (element.classList.contains('expanded')) {
//         return;
//     }
    
//     if (hiddenText && hiddenText.classList.contains('hidden-text')) {
//         // Mark as expanded
//         element.classList.add('expanded');
//         element.onclick = null;
//         element.style.cursor = 'default';
//         element.style.textDecoration = 'none';
//         element.classList.remove('expandable-text');
        
//         // Show the element
//         hiddenText.style.display = 'inline';
        
//         // Animate only direct text nodes, leave nested elements alone
//         animateDirectTextOnly(hiddenText);
//     }
// }

// // Get only the direct text content, ignoring nested elements
// function getDirectTextContent(element) {
//     let directText = '';
    
//     for (let node of element.childNodes) {
//         if (node.nodeType === Node.TEXT_NODE) {
//             directText += node.textContent;
//         }
//     }
    
//     return directText;
// }

// function animateDirectTextOnly(element) {
//     // Find and animate only direct text nodes
//     const walker = document.createTreeWalker(
//         element,
//         NodeFilter.SHOW_TEXT,
//         {
//             acceptNode: function(node) {
//                 // Only accept direct children text nodes
//                 return node.parentNode === element ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
//             }
//         }
//     );
    
//     const textNodes = [];
//     let node;
//     while (node = walker.nextNode()) {
//         if (node.textContent.trim()) {
//             textNodes.push(node);
//         }
//     }
    
//     // Animate each direct text node
//     textNodes.forEach(textNode => {
//         const text = textNode.textContent;
//         const container = document.createElement('span');
//         textNode.parentNode.replaceChild(container, textNode);
        
//         let charIndex = 0;
        
//         function typeChar() {
//             if (charIndex < text.length) {
//                 const char = text[charIndex];
//                 const span = document.createElement('span');
//                 span.textContent = char;
//                 span.style.color = '#999';
//                 span.style.transition = 'color 0.8s ease-in-out';
                
//                 container.appendChild(span);
                
//                 setTimeout(() => {
//                     span.style.color = 'var(--text-default)';
//                 }, 300 + Math.random() * 200);
                
//                 charIndex++;
                
//                 let delay = 40 + Math.random() * 30;
//                 if (char === '.' || char === '!' || char === '?') delay += 200;
//                 else if (char === ',' || char === ';') delay += 100;
//                 else if (char === ' ') delay += 20;
                
//                 setTimeout(typeChar, delay);
//             }
//         }
        
//         setTimeout(typeChar, 150);
//     });
// }