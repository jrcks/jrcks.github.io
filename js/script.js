/* ============================================
   JULIAN ROCKS - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeFormHandling();
    initializeScrollEffects();
    initializeLazyLoading();
    initializeGalleryLightbox();
});

// ============================================
// NAVIGATION & HEADER
// ============================================

function initializeNavigation() {
    const header = document.querySelector('header');
    const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    // Sticky header on scroll
    window.addEventListener('scroll', throttle(function () {
        const currentScroll = window.pageYOffset;
        if (!header) return;

        if (currentScroll > 50) {
            header.classList.remove('py-4');
            const nav = header.querySelector('nav');
            if (nav) {
                nav.classList.add('bg-black/40', 'shadow-xl', 'backdrop-blur-xl');
                nav.classList.remove('bg-black/20', 'backdrop-blur-md');
            }
        } else {
            header.classList.add('py-4');
            const nav = header.querySelector('nav');
            if (nav) {
                nav.classList.remove('bg-black/40', 'shadow-xl', 'backdrop-blur-xl');
                nav.classList.add('bg-black/20', 'backdrop-blur-md');
            }
        }
    }, 100));

    // Mobile menu toggle
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function () {
            if (mobileMenu) {
                mobileMenu.classList.toggle('active');
                this.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
            }
        });
    }

    // Smooth scroll for ALL anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    if (mobileMenuButton) {
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                    }
                }

                // Scroll to target
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// FORM HANDLING
// ============================================

function initializeFormHandling() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Get all form inputs
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const eventSelect = form.querySelector('select[name="event"]');
    const dateInput = form.querySelector('input[name="date"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Store original button text
    const originalBtnText = submitBtn.innerHTML;

    // Helper function to show/hide error
    function setError(field, message) {
        const input = form.querySelector(`[name="${field}"]`);
        const errorDiv = form.querySelector(`[data-field="${field}"]`);

        if (message) {
            input.classList.add('input-error');
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        } else {
            input.classList.remove('input-error');
            errorDiv.classList.remove('show');
            errorDiv.textContent = '';
        }
    }

    // Real-time validation for email
    emailInput?.addEventListener('input', function () {
        this.classList.remove('input-error');
    });

    // Real-time validation for date
    dateInput?.addEventListener('input', function () {
        this.classList.remove('input-error');
    });

    // Real-time validation for name
    nameInput?.addEventListener('input', function () {
        this.classList.remove('input-error');
    });

    // Real-time validation for event
    eventSelect?.addEventListener('change', function () {
        this.classList.remove('input-error');
    });

    // Real-time validation for message
    messageInput?.addEventListener('input', function () {
        this.classList.remove('input-error');
        if (this.value.trim().length >= 10) {
            setError('message', '');
        } else if (this.value.trim().length > 0 && this.value.trim().length < 10) {
            setError('message', 'Mindestens 10 Zeichen erforderlich');
        } else {
            setError('message', '');
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const name = nameInput?.value.trim();
        const email = emailInput?.value.trim();
        const event = eventSelect?.value;
        const date = dateInput?.value;
        const message = messageInput?.value.trim();

        // Clear previous errors
        ['name', 'email', 'event', 'date', 'message'].forEach(field => setError(field, ''));

        // Validation
        let hasErrors = false;

        // Only show errors for actual validation issues, not just empty fields
        if (!name) {
            nameInput.classList.add('input-error');
            hasErrors = true;
        }

        if (!email) {
            emailInput.classList.add('input-error');
            hasErrors = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput.classList.add('input-error');
            hasErrors = true;
        }

        if (!event) {
            eventSelect.classList.add('input-error');
            hasErrors = true;
        }

        if (!date) {
            dateInput.classList.add('input-error');
            hasErrors = true;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                dateInput.classList.add('input-error');
                hasErrors = true;
            }
        }

        if (!message) {
            messageInput.classList.add('input-error');
            hasErrors = true;
        } else if (message.length < 10) {
            setError('message', 'Mindestens 10 Zeichen erforderlich');
            hasErrors = true;
        }

        // Show success or keep form visible
        if (!hasErrors) {
            // Submit the form
            // form.submit();

            // Set loading state
            setLoading(true);

            // Collect form data for submission
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const email = data.email;

            // Fetch Request to FormSubmit
            fetch("https://formsubmit.co/ajax/4cefb599cc74af74ec4f2ed9472d41a1", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) throw new Error('Server-Fehler');
                    return response.json();
                })
                .then(data => {
                    // Erfolg: Nachricht anzeigen
                    showSuccess(email ||  "deine Email");
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                    showError("Ups! Da ist was schiefgelaufen. Bitte versuche es erneut.");
                });
        }
    });

    // --- Hilfsfunktionen ---

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            // Fügt einen Spinner hinzu (Tailwind animate-spin)
            submitBtn.innerHTML = `
            <div class="flex items-center justify-center gap-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Wird gesendet...</span>
            </div>
        `;
            submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
        }
    }

    function showSuccess(email) {
        const successMessage = document.createElement('div');
        successMessage.className = 'flex flex-col items-center justify-center text-center gap-4 py-12 animate-in fade-in zoom-in duration-500';
        successMessage.innerHTML = `
        <div class="rounded-full p-4 mb-2">
            <span class="material-symbols-outlined text-green-500 text-6xl">check_circle</span>
        </div>
        <h3 class="text-white text-3xl font-bold font-display">Anfrage erhalten!</h3>
        <p class="text-slate-300 text-lg max-w-md">Vielen Dank! Wir haben deine Nachricht erhalten und melden uns zeitnah bei dir.</p>
        <p class="text-slate-400 text-sm mt-2 italic">Rückmeldung geht an: ${email}</p>
    `;
        form.parentElement.replaceChild(successMessage, form);
    }

    function showError(message) {
        // Falls schon eine Fehlermeldung da ist, entfernen
        const existingError = form.querySelector('.form-error-banner');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-banner bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm mb-6 animate-bounce-short';
        errorDiv.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">error</span>
            <span>${message}</span>
        </div>
    `;
        // Ganz oben im Formular einfügen
        form.prepend(errorDiv);
    }
}


// ============================================
// SCROLL EFFECTS
// ============================================

function initializeScrollEffects() {
    // Fade in sections on scroll - skip hero section (#home)
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    // Check each section - if it's already visible on page load, make it visible immediately
    sections.forEach(section => {
        if (section.id !== 'home') {
            // Check if section is already in viewport on page load
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Section is already visible, show it immediately without animation
                section.style.opacity = '1';
            } else {
                // Section is not visible, observe it for fade-in animation
                observer.observe(section);
            }
        }
    });
}

// ============================================
// LAZY LOADING
// ============================================

function initializeLazyLoading() {
    // Lazy loading for images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;

                    // Create a new image to preload
                    const newImg = new Image();
                    newImg.onload = () => {
                        img.src = src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    };
                    newImg.onerror = () => {
                        // Fallback: still set src even if load fails
                        img.src = src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    };
                    newImg.src = src;
                }
            });
        }, { rootMargin: '50px' });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        });
    }

    // Lazy loading for background images with data-bg
    const lazyBGs = document.querySelectorAll('[data-bg]');
    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const bgUrl = el.dataset.bg;
                    el.style.backgroundImage = `url('${bgUrl}')`;
                    el.classList.add('loaded');
                    el.classList.remove('bg-skeleton');
                    el.removeAttribute('data-bg');
                    bgObserver.unobserve(el);
                }
            });
        }, { rootMargin: '50px' });

        lazyBGs.forEach(el => {
            bgObserver.observe(el);
        });
    }
}

// ============================================
// GALLERY LIGHTBOX
// ============================================

function initializeGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');

    // Read gallery data from HTML elements
    const galleryData = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.dataset.src || img.src,
            alt: img.alt || 'Gallery image'
        };
    });

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const data = galleryData[index];
        lightboxImage.src = data.src;
        lightboxImage.alt = data.alt;
        lightboxCounter.textContent = `${index + 1} / ${galleryData.length}`;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryData.length;
        const data = galleryData[currentIndex];
        lightboxImage.src = data.src;
        lightboxImage.alt = data.alt;
        lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        const data = galleryData[currentIndex];
        lightboxImage.src = data.src;
        lightboxImage.alt = data.alt;
        lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
    }

    // Gallery item click handlers
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function throttle(func, wait) {
    let timeout;
    return function (...args) {
        if (!timeout) {
            func.apply(this, args);
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
