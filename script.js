document.addEventListener('DOMContentLoaded', () => {

    // ==================================================================
    // ======================= LOADING SCREEN =========================
    // ==================================================================
    const loadingScreen = document.getElementById('loading-screen');
    window.onload = () => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    };

    // ==================================================================
    // ======================= ՀԵՏՀԱՇՎԱՐԿ ============================
    // ==================================================================
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const countDate = new Date("December 26, 2025 00:00:00").getTime();
        const countdown = () => {
            const now = new Date().getTime();
            const gap = countDate - now;
            if (gap < 0) {
                countdownElement.innerHTML = `<div class="countdown-item" style="font-size: 1.5em;">Մեր հարսանիքն արդեն սկսվել է!</div>`;
                clearInterval(countdownInterval); return;
            }
            const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
            const textDay = Math.floor(gap / day);
            const textHour = Math.floor((gap % day) / hour);
            const textMinute = Math.floor((gap % hour) / minute);
            const textSecond = Math.floor((gap % minute) / second);
            
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${textDay}</span>
                    <span class="countdown-label">օր</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${textHour}</span>
                    <span class="countdown-label">ժամ</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${textMinute}</span>
                    <span class="countdown-label">րոպե</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${textSecond}</span>
                    <span class="countdown-label">վայրկյան</span>
                </div>
            `;
        };
        countdown();
        const countdownInterval = setInterval(countdown, 1000);
    }

    // ==================================================================
    // =================== ՖՈՆԻ ՍԱՀՈՒՆ ՓՈՓՈԽՈՒՄ ===================
    // ==================================================================
    const sections = document.querySelectorAll('.section');
    const bgLayer1 = document.getElementById('bg-layer-1');
    const bgLayer2 = document.getElementById('bg-layer-2');

    // Image Error Handling
    function handleImageError(layer, fallbackImage) {
        console.warn(`Image failed to load. Applying fallback: ${fallbackImage}`);
        layer.style.backgroundImage = `url(${fallbackImage})`;
    }
    
    // You can create a simple fallback.jpg or use one of your existing images
    const fallbackImg = 'images/gun_image1.jpg'; 
    bgLayer1.onerror = () => handleImageError(bgLayer1, fallbackImg);
    bgLayer2.onerror = () => handleImageError(bgLayer2, fallbackImg);

    if (sections.length > 0 && bgLayer1 && bgLayer2) {
        
        const sectionImages = {
            'hero-section': 'images/gun_image1.jpg',
            'countdown-section': 'images/gun_image2.jpg',
            'story-section': 'images/gun_image3.jpg',
            'timeline-section': 'images/gun_image4.jpg',
            'end_section' : 'images/gun_image7.jpg'
        };

        let currentImage = '';
        let activeLayer = 1;

        function initializeBackground() {
            const initialImage = sectionImages['hero-section'];
            if(initialImage) {
                bgLayer1.style.backgroundImage = `url(${initialImage})`;
                bgLayer1.style.opacity = 1;
                bgLayer2.style.opacity = 0;
                currentImage = initialImage;
            }
        }

        function changeImageOnScroll() {
            let activeSectionId = sections[0].id;
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    activeSectionId = section.id;
                }
            });
            
            const newImageSrc = sectionImages[activeSectionId];

            if (currentImage !== newImageSrc && newImageSrc) {
                if (activeLayer === 1) {
                    bgLayer2.style.backgroundImage = `url(${newImageSrc})`;
                    bgLayer2.style.opacity = 1;
                    bgLayer1.style.opacity = 0;
                    activeLayer = 2;
                } else {
                    bgLayer1.style.backgroundImage = `url(${newImageSrc})`;
                    bgLayer1.style.opacity = 1;
                    bgLayer2.style.opacity = 0;
                    activeLayer = 1;
                }
                currentImage = newImageSrc;
            }
        }
        
        initializeBackground();
        // Throttle scroll events for performance
        window.addEventListener('scroll', throttle(changeImageOnScroll, 200));
    }

    // ==================================================================
    // ======================= BETTER MUSIC CONTROLS ====================
    // ==================================================================
    const audioElement = document.getElementById('background-music');
    const musicToggleButton = document.getElementById('music-toggle');
    let userInteracted = false;

    // Listen for the first interaction to enable audio context
    document.body.addEventListener('click', () => { userInteracted = true; }, { once: true });
    
    // Create Volume Slider
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.05';
    volumeSlider.value = '0.5';
    volumeSlider.className = 'volume-slider'; // For potential styling via CSS

    if (audioElement && musicToggleButton) {

        // Try to play on load
        audioElement.play().then(() => {
            musicToggleButton.textContent = '⏸';
        }).catch(() => {
            musicToggleButton.textContent = '🎵';
        });

        // Toggle music and volume slider
        musicToggleButton.addEventListener('click', () => {
            if (audioElement.paused) {
                audioElement.play().then(() => {
                    musicToggleButton.textContent = '⏸';
                    volumeSlider.style.display = 'block';
                });
            } else {
                audioElement.pause();
                musicToggleButton.textContent = '🎵';
                volumeSlider.style.display = 'none';
            }
        });
    }

    // ==================================================================
    // ========= "ԲԱՑԱՀԱՅՏՈՒՄ ՍՔՐՈԼ ԱՆԵԼԻՍ" ՏՐԱՄԱԲԱՆՈՒԹՅՈՒՆ ======
    // ==================================================================
    const revealElements = document.querySelectorAll('h1:not(.name), h2, p, .location-card, .calendar, #countdown, .share-button');
    revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.3 }); // Adjust threshold for when animation should trigger

    revealElements.forEach(el => observer.observe(el));

    // ==================================================================
    // ======================= JS OPTIMIZATION (THROTTLE) =============
    // ==================================================================
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
});