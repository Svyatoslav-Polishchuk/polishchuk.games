// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Store session start time
    const sessionStartTime = Date.now();
    
    // Track session start
    if (typeof umami !== 'undefined') {
        umami.track('session-start', { 
            page: 'home',
            timestamp: sessionStartTime,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Track global navigation clicks
            if (typeof umami !== 'undefined') {
                umami.track('global-navigation-click', { 
                    section: targetId.replace('#', ''),
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
                umami.track('hero-cta-click', { 
                    button: 'learn-more',
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

    // Track contact link clicks
    const contactLinks = document.querySelectorAll('#contact a');
    contactLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            let linkType = 'contact-link';
            
            if (href.includes('linkedin.com')) {
                linkType = 'contact-linkedin';
            } else if (href.includes('mailto:')) {
                linkType = 'contact-email';
            }
            
            if (typeof umami !== 'undefined') {
                umami.track(linkType, { 
                    url: href,
                    page: 'home'
                });
            }
        });
    });

    // Track resume download
    const resumeLink = document.querySelector('a[download*="Resume"]');
    if (resumeLink) {
        resumeLink.addEventListener('click', function() {
            if (typeof umami !== 'undefined') {
                umami.track('resume-download', { 
                    file: 'resume',
                    page: 'home'
                });
            }
        });
    }

    // Track scroll depth
    let maxScrollDepth = 0;
    let scrollDepthMarkers = [25, 50, 75, 90, 100];
    let trackedMarkers = new Set();

    function trackScrollDepth() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
        
        scrollDepthMarkers.forEach(marker => {
            if (scrollPercent >= marker && !trackedMarkers.has(marker)) {
                trackedMarkers.add(marker);
                if (typeof umami !== 'undefined') {
                    umami.track('scroll-depth', { 
                        depth: marker,
                        page: 'home'
                    });
                }
            }
        });
    }

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        trackScrollDepth();
        
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

    // Track session end on page unload
    window.addEventListener('beforeunload', function() {
        if (typeof umami !== 'undefined') {
            const sessionLength = Date.now() - sessionStartTime;
            umami.track('session-end', { 
                page: 'home',
                sessionLength: Math.round(sessionLength / 1000), // in seconds
                maxScrollDepth: maxScrollDepth
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Initialize
document.body.style.opacity = '0'; 