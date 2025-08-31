// Initialize AOS (Animate On Scroll)
// Burger menu handling
const burgerMenu = document.querySelector('.burger-menu');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu a');

function toggleMenu() {
    burgerMenu.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
}

burgerMenu.addEventListener('click', toggleMenu);

// Close menu when clicking menu items
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (menu.classList.contains('active') && 
        !menu.contains(e.target) && 
        !burgerMenu.contains(e.target)) {
        toggleMenu();
    }
});

// Smooth scroll handling
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerOffset = 80; // Height of your fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 150,
        delay: 0
    });
});

// Lazy loading implementation
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    // Create a new image to preload
                    const tmpImg = new Image();
                    tmpImg.onload = function() {
                        img.src = src;
                        img.classList.add('loaded');
                    };
                    tmpImg.onerror = function() {
                        console.error('Error loading image:', src);
                        // Optionally add a class to show error state
                        img.classList.add('error');
                    };
                    tmpImg.src = src;
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px', // Increased margin for earlier loading
            threshold: 0.01
        });

        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(function(img) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
});

// Initialize VANTA background
VANTA.NET({
    el: '#vanta-background',
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x3fff,
    backgroundColor: 0x0,
    points: 15.00,
    maxDistance: 20.00,
    spacing: 16.00
});

// Form handling
const form = document.getElementById('contact-form');
const submitButton = form.querySelector('button[type="submit"]');

// Add ripple effect to button
submitButton.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = submitButton.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x - 10}px;
        top: ${y - 10}px;
    `;

    submitButton.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

form.addEventListener('submit', function(e) {
    // Form will be handled by FormSubmit.co
    // We don't need to prevent default or handle the submission ourselves
});
