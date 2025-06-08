// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Track specific navigation clicks
            const section = targetId.replace('#', '');
            if (typeof umami !== 'undefined') {
                umami.track(`navigation-${section}-click`, { 
                    section: section,
                    page: 'home'
                });
            }
            
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
            
            // Track CTA button clicks
            if (typeof umami !== 'undefined') {
                umami.track('hero-learn-more-click', { 
                    button: 'learn-more',
                    target: 'about',
                    page: 'home'
                });
            }
            
            const targetSection = document.querySelector('#about');
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Track ALL links comprehensively
    const allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            const linkText = this.textContent.trim();
            const linkClass = this.className;
            
            // Skip navigation links (already tracked above)
            if (this.classList.contains('nav-link') || this.classList.contains('hero-link')) {
                return;
            }
            
            let eventName = 'link-click';
            let eventData = {
                url: href,
                text: linkText,
                page: 'home'
            };
            
            // Contact links
            if (href.includes('linkedin.com')) {
                eventName = 'contact-linkedin-click';
            } else if (href.includes('mailto:')) {
                eventName = 'contact-email-click';
                eventData.email = 'bohdan.polishchuk2000@gmail.com';
            }
            // Resume download
            else if (href.includes('Resume') || this.hasAttribute('download')) {
                eventName = 'resume-download-click';
                eventData.file = 'Bohdan-Polishchuk-Resume-Game-Designer.pdf';
            }
            // Project cards
            else if (this.classList.contains('project-card')) {
                const projectTitle = this.querySelector('.card-title')?.textContent.toLowerCase().replace(/\s+/g, '-') || 'unknown';
                eventName = `project-${projectTitle}-click`;
                eventData.project = projectTitle;
            }
            // GDD links
            else if (this.classList.contains('card-link') && href.includes('.pdf')) {
                const gddCard = this.closest('.gdd-card');
                const projectTitle = gddCard?.querySelector('.card-title')?.textContent.toLowerCase().replace(/\s+/g, '-') || 'unknown';
                const documentType = linkText.toLowerCase().replace(/\s+/g, '-');
                eventName = `gdd-${projectTitle}-${documentType}-click`;
                eventData.project = projectTitle;
                eventData.documentType = documentType;
            }
            // External links
            else if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                eventName = 'external-link-click';
            }
            // Internal page links
            else if (href.startsWith('/project/')) {
                const projectName = href.split('/')[2] || 'unknown';
                eventName = `project-${projectName}-click`;
                eventData.project = projectName;
            }
            
            if (typeof umami !== 'undefined') {
                umami.track(eventName, eventData);
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Don't activate anything until user scrolls down a bit
        const scrollThreshold = 100; // pixels
        if (window.scrollY < scrollThreshold) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            return;
        }
        
        let current = '';
        const viewportTop = window.scrollY;
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