document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
    initPhotoSwipeGallery();
    initNavigation();
    initContactForm();
    initFloatingButton();
});

function initPhotoSwipeGallery() {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
        import PhotoSwipeLightbox from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.js';
        
        const lightbox = new PhotoSwipeLightbox({
            gallery: '#my-gallery',
            children: 'a[data-pswp-width]',
            pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.js')
        });
        
        lightbox.on('uiRegister', function() {
            lightbox.pswp.ui.registerElement({
                name: 'custom-caption',
                order: 9,
                isButton: false,
                appendTo: 'root',
                html: '',
                onInit: (el, pswp) => {
                    el.classList.add('pswp__custom-caption');
                    
                    const updateCaption = () => {
                        const currSlideElement = lightbox.pswp.currSlide.data.element;
                        let captionHTML = '';
                        
                        if (currSlideElement) {
                            const captionAttr = currSlideElement.getAttribute('data-pswp-caption');
                            if (captionAttr) {
                                captionHTML = captionAttr.replace(/&lt;br&gt;/g, '<br>');
                            } else {
                                const img = currSlideElement.querySelector('img');
                                if (img && img.alt) {
                                    captionHTML = img.alt;
                                }
                            }
                        }
                        
                        el.innerHTML = captionHTML || '';
                    };
                    
                    lightbox.pswp.on('change', updateCaption);
                    
                    lightbox.pswp.on('afterInit', updateCaption);
                }
            });
        });
        
        lightbox.init();
    `;
    document.head.appendChild(script);
}

function initCarousel() {
    const slidesContainer = document.querySelector('.carousel-slides');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    const images = [
        'assets/images/hero/turtle.png',
        'assets/images/hero/Aharen_Reina_Holding_C_Programming_Language.png',
        'assets/images/hero/Tsukishima_Shijima_The_Rust_programming_language.png',
        'assets/images/hero/Himegoto_Casting_Malloc.png'
    ];

    let currentSlide = 0;
    let slideInterval;

    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        slide.style.backgroundImage = `url(${image})`;
        if (index === 0) slide.classList.add('active');

        const img = new Image();
        img.onload = () => {
            slide.style.backgroundImage = `url(${image})`;
        };
        img.onerror = () => {
            slide.style.backgroundColor = '#f0f0f0';
            slide.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 1.2rem;">Loading image ${index + 1}...</div>`;
        };
        img.src = image;

        slidesContainer.appendChild(slide);
    });

    images.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    function updateSlides() {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');

        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
        resetAutoSlide();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % images.length;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + images.length) % images.length;
        updateSlides();
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    resetAutoSlide();
}

function initNavigation() {
    const navLinks = document.querySelectorAll('#main-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    function showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        errorElement.textContent = message;
    }

    function clearError(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        errorElement.textContent = '';
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let hasErrors = false;

        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            hasErrors = true;
        } else {
            clearError(nameInput);
        }

        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            hasErrors = true;
        } else if (!emailInput.value.includes('@')) {
            showError(emailInput, 'Valid email required');
            hasErrors = true;
        } else {
            clearError(emailInput);
        }

        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Message is required');
            hasErrors = true;
        } else {
            clearError(messageInput);
        }

        if (!hasErrors) {
            alert('Form submitted successfully (demo mode)');
            form.reset();
        }
    });
}

function initFloatingButton() {
    const floatingBtn = document.getElementById('floating-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            floatingBtn.classList.add('show');
        } else {
            floatingBtn.classList.remove('show');
        }
    });

    floatingBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
