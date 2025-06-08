// WarForged Case Study - JavaScript Slider with Analytics

class Carousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.navBtns = document.querySelectorAll('.carousel-nav-button[data-slide]');
        this.prevBtn = document.querySelector('.carousel-nav-button.prev');
        this.nextBtn = document.querySelector('.carousel-nav-button.next');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    async init() {
        await this.calculateOptimalHeight();
        this.showSlide(0);
        this.bindEvents();
    }
    
    async calculateOptimalHeight() {
        const images = this.carousel.querySelectorAll('.carousel-image');
        let maxHeight = 0;
        
        // Wait for all images to load and find the tallest
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    maxHeight = Math.max(maxHeight, img.naturalHeight);
                    resolve();
                } else {
                    img.onload = () => {
                        maxHeight = Math.max(maxHeight, img.naturalHeight);
                        resolve();
                    };
                    img.onerror = () => resolve(); // Handle broken images
                }
            });
        });
        
        await Promise.all(imagePromises);
        
        // Set carousel height to the tallest image (with a reasonable max)
        const optimalHeight = Math.min(maxHeight, 800); // Cap at 800px
        this.carousel.style.height = `${optimalHeight}px`;
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Show current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        // Update nav buttons
        this.navBtns.forEach(btn => {
            const slideIndex = parseInt(btn.getAttribute('data-slide'));
            btn.classList.toggle('active', slideIndex === index);
        });
        
        // Track carousel slide change (only if slide actually changed)
        if (typeof umami !== 'undefined' && this.currentSlide !== index) {
            umami.track('project-carousel-slide-change', { 
                slideIndex: index,
                totalSlides: this.totalSlides,
                projectName: this.getProjectName(),
                page: 'project'
            });
        }
        
        this.currentSlide = index;
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        
        // Track next button click
        if (typeof umami !== 'undefined') {
            umami.track('project-carousel-next', { 
                currentSlide: this.currentSlide,
                nextSlide: nextIndex,
                projectName: this.getProjectName(),
                page: 'project'
            });
        }
        
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        
        // Track previous button click
        if (typeof umami !== 'undefined') {
            umami.track('project-carousel-prev', { 
                currentSlide: this.currentSlide,
                prevSlide: prevIndex,
                projectName: this.getProjectName(),
                page: 'project'
            });
        }
        
        this.goToSlide(prevIndex);
    }
    
    getProjectName() {
        // Extract project name from URL or page title
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 2] || document.querySelector('.hero-title')?.textContent || 'unknown';
    }
    
    bindEvents() {
        // Numbered navigation buttons
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const slideIndex = parseInt(btn.getAttribute('data-slide'));
                
                // Track numbered navigation click
                if (typeof umami !== 'undefined') {
                    umami.track('project-carousel-numbered-nav', { 
                        targetSlide: slideIndex,
                        currentSlide: this.currentSlide,
                        projectName: this.getProjectName(),
                        page: 'project'
                    });
                }
                
                this.goToSlide(slideIndex);
            });
        });
        
        // Prev/Next buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                // Track keyboard navigation
                if (typeof umami !== 'undefined') {
                    umami.track('project-carousel-keyboard', { 
                        key: 'ArrowLeft',
                        direction: 'previous',
                        projectName: this.getProjectName(),
                        page: 'project'
                    });
                }
                this.prevSlide();
            }
            if (e.key === 'ArrowRight') {
                // Track keyboard navigation
                if (typeof umami !== 'undefined') {
                    umami.track('project-carousel-keyboard', { 
                        key: 'ArrowRight',
                        direction: 'next',
                        projectName: this.getProjectName(),
                        page: 'project'
                    });
                }
                this.nextSlide();
            }
        });
    }
}

// Initialize carousel and tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const projectName = getProjectName();
    const sessionStartTime = Date.now();
    
    // Track session start for project page
    if (typeof umami !== 'undefined') {
        umami.track('session-start', { 
            page: 'project',
            projectName: projectName,
            timestamp: sessionStartTime,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }
    
    // Initialize carousel
    const carouselElement = document.querySelector('.carousel');
    if (carouselElement) {
        new Carousel(carouselElement);
    }
    
    // Track project navigation clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('href').replace('#', '');
            
            if (typeof umami !== 'undefined') {
                umami.track('project-navigation-click', { 
                    section: section,
                    projectName: projectName,
                    page: 'project'
                });
            }
        });
    });
    
    // Track documentation link clicks
    const docLinks = document.querySelectorAll('#documentation a[href$=".pdf"]');
    docLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            const documentType = this.textContent.trim();
            
            if (typeof umami !== 'undefined') {
                umami.track('project-documentation-click', { 
                    documentType: documentType,
                    url: href,
                    projectName: projectName,
                    page: 'project'
                });
            }
        });
    });
    
    // Track related project clicks
    const relatedProjectLinks = document.querySelectorAll('.related .project-card');
    relatedProjectLinks.forEach(link => {
        link.addEventListener('click', function() {
            const relatedProjectName = this.querySelector('.card-title').textContent;
            const href = this.getAttribute('href');
            
            if (typeof umami !== 'undefined') {
                umami.track('related-project-click', { 
                    relatedProject: relatedProjectName,
                    currentProject: projectName,
                    url: href,
                    page: 'project'
                });
            }
        });
    });
    
    // Track back to projects link
    const backLink = document.querySelector('.backlink-link');
    if (backLink) {
        backLink.addEventListener('click', function() {
            if (typeof umami !== 'undefined') {
                umami.track('back-to-projects-click', { 
                    currentProject: projectName,
                    page: 'project'
                });
            }
        });
    }
    
    // Track contact link clicks
    const contactLinks = document.querySelectorAll('.contact a');
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
                    projectName: projectName,
                    page: 'project'
                });
            }
        });
    });
    
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
                        projectName: projectName,
                        page: 'project'
                    });
                }
            }
        });
    }
    
    window.addEventListener('scroll', trackScrollDepth);
    
    // Track session end on page unload
    window.addEventListener('beforeunload', function() {
        if (typeof umami !== 'undefined') {
            const sessionLength = Date.now() - sessionStartTime;
            umami.track('session-end', { 
                page: 'project',
                projectName: projectName,
                sessionLength: Math.round(sessionLength / 1000), // in seconds
                maxScrollDepth: maxScrollDepth
            });
        }
    });
});

// Helper function to get project name
function getProjectName() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 2] || document.querySelector('.hero-title')?.textContent || 'unknown';
}
