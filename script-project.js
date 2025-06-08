// Project Page - JavaScript with Link Tracking Only

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
        
        this.currentSlide = index;
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    bindEvents() {
        // Numbered navigation buttons
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const slideIndex = parseInt(btn.getAttribute('data-slide'));
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
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
}

// Initialize carousel and link tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const projectName = getProjectName();
    
    // Initialize carousel
    const carouselElement = document.querySelector('.carousel');
    if (carouselElement) {
        new Carousel(carouselElement);
    }
    
    // Track ALL links comprehensively
    const allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            const linkText = this.textContent.trim();
            
            let eventName = 'link-click';
            let eventData = {
                url: href,
                text: linkText,
                projectName: projectName,
                page: 'project'
            };
            
            // Navigation links
            if (this.classList.contains('nav-link')) {
                const section = href.replace('#', '');
                eventName = `${projectName}-navigation-${section}-click`;
                eventData.section = section;
            }
            // Documentation links (PDFs)
            else if (href.includes('.pdf')) {
                const documentType = linkText.toLowerCase().replace(/\s+/g, '-');
                eventName = `${projectName}-${documentType}-download`;
                eventData.documentType = documentType;
            }
            // Related project links
            else if (this.classList.contains('project-card')) {
                const relatedProjectName = this.querySelector('.card-title')?.textContent.toLowerCase().replace(/\s+/g, '-') || 'unknown';
                eventName = `${projectName}-to-${relatedProjectName}-click`;
                eventData.relatedProject = relatedProjectName;
                eventData.currentProject = projectName;
            }
            // Back to projects link
            else if (this.classList.contains('backlink-link') || href === '/#projects') {
                eventName = `${projectName}-back-to-projects-click`;
                eventData.currentProject = projectName;
            }
            // Contact links
            else if (href.includes('linkedin.com')) {
                eventName = `${projectName}-contact-linkedin-click`;
            } else if (href.includes('mailto:')) {
                eventName = `${projectName}-contact-email-click`;
                eventData.email = 'bohdan.polishchuk2000@gmail.com';
            }
            // External links
            else if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                eventName = `${projectName}-external-link-click`;
            }
            // Internal links
            else if (href.startsWith('/') || href.startsWith('./')) {
                eventName = `${projectName}-internal-link-click`;
            }
            
            if (typeof umami !== 'undefined') {
                umami.track(eventName, eventData);
            }
        });
    });
});

// Helper function to get project name
function getProjectName() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 2] || document.querySelector('.hero-title')?.textContent?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
}
