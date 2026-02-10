// Image Carousel Functionality
class ImageCarousel {
    constructor(carouselContainer) {
        this.container = carouselContainer;
        this.wrapper = carouselContainer.querySelector('.carousel-wrapper');
        this.items = carouselContainer.querySelectorAll('.carousel-item');
        this.dots = carouselContainer.querySelectorAll('.carousel-dot');
        this.prevBtn = carouselContainer.querySelector('.carousel-prev');
        this.nextBtn = carouselContainer.querySelector('.carousel-next');
        
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds

        // Only initialize if there are carousel items
        if (this.items.length > 0) {
            this.init();
        }
    }

    init() {
        // Set initial active slide
        this.updateCarousel();

        // Event listeners for arrow buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Event listeners for dot indicators
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto-play carousel
        this.startAutoPlay();

        // Pause auto-play on hover
        if (this.wrapper) {
            this.wrapper.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.wrapper.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    updateCarousel() {
        // Remove active class from all items and dots
        this.items.forEach(item => item.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current item and dot
        this.items[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    startAutoPlay() {
        if (this.items.length <= 1) return; // No need to auto-play if only one image

        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        new ImageCarousel(container);
    });
});
