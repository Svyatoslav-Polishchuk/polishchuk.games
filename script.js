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

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Initialize
document.body.style.opacity = '0'; 