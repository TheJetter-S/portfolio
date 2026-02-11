// Matrix Rain Effect
        function createMatrixRain() {
            const matrixRain = document.getElementById('matrixRain');
            const characters = '01abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

            for (let i = 0; i < 50; i++) {
                const column = document.createElement('div');
                column.classList.add('matrix-column');

                // Random position
                const left = Math.random() * 100;
                column.style.left = `${left}%`;

                // Random animation duration
                const duration = 5 + Math.random() * 10;
                column.style.animationDuration = `${duration}s`;

                // Random delay
                const delay = Math.random() * 5;
                column.style.animationDelay = `${delay}s`;

                // Create characters
                const charCount = 30 + Math.floor(Math.random() * 20);
                for (let j = 0; j < charCount; j++) {
                    const char = document.createElement('span');
                    char.textContent = characters.charAt(Math.floor(Math.random() * characters.length));
                    char.style.opacity = 0.1 + Math.random() * 0.9;
                    char.style.fontSize = `${12 + Math.random() * 6}px`;
                    column.appendChild(char);
                }

                matrixRain.appendChild(column);
            }
        }

        // ===== ENHANCED THEME SYSTEM =====
        /**
         * Theme Management System
         * - Detects system preference (prefers-color-scheme)
         * - Persists user choice in localStorage
         * - Smooth animated transitions
         * - Updates meta theme-color for mobile browsers
         */
        const ThemeManager = {
            STORAGE_KEY: 'preferred-theme',
            TRANSITION_DURATION: 500,
            
            /**
             * Initialize the theme system
             */
            init() {
                this.themeToggle = document.getElementById('themeToggle');
                this.body = document.body;
                
                // Set initial theme
                const initialTheme = this.getInitialTheme();
                this.applyTheme(initialTheme, false); // false = no animation on load
                
                // Bind toggle event
                if (this.themeToggle) {
                    this.themeToggle.addEventListener('click', () => this.toggle());
                }
                
                // Listen for system theme changes
                this.listenForSystemChanges();
                
                console.log('[Theme] System initialized with theme:', initialTheme);
            },
            
            /**
             * Get the initial theme based on saved preference or system setting
             * @returns {string} 'dark' or 'light'
             */
            getInitialTheme() {
                // Check localStorage first
                const savedTheme = localStorage.getItem(this.STORAGE_KEY);
                if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
                    return savedTheme;
                }
                
                // Fall back to system preference
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                    return 'light';
                }
                
                // Default to dark
                return 'dark';
            },
            
            /**
             * Get the current theme
             * @returns {string} Current theme
             */
            getCurrentTheme() {
                return this.body.getAttribute('data-theme') || 'dark';
            },
            
            /**
             * Apply a theme
             * @param {string} theme - 'dark' or 'light'
             * @param {boolean} animate - Whether to animate the transition
             */
            applyTheme(theme, animate = true) {
                const validTheme = theme === 'light' ? 'light' : 'dark';
                
                if (animate) {
                    // Add transition class for smooth animation
                    this.body.classList.add('theme-transitioning');
                    
                    // Add spinning animation to toggle button
                    if (this.themeToggle) {
                        this.themeToggle.classList.add('switching');
                    }
                }
                
                // Apply the theme after a tiny delay for animation sync
                setTimeout(() => {
                    // Set data-theme attribute
                    this.body.setAttribute('data-theme', validTheme);
                    
                    // Update legacy class names
                    this.body.classList.remove('matrix-theme', 'cyber-theme', 'light-theme');
                    if (validTheme === 'dark') {
                        this.body.classList.add('matrix-theme');
                    } else {
                        this.body.classList.add('light-theme');
                    }
                    
                    // Update toggle icon
                    this.updateToggleIcon(validTheme);
                    
                    // Update tooltip
                    this.updateTooltip(validTheme);
                    
                    // Update meta theme-color for mobile browsers
                    this.updateMetaThemeColor(validTheme);
                    
                    // Store preference
                    localStorage.setItem(this.STORAGE_KEY, validTheme);
                    
                }, animate ? 50 : 0);
                
                if (animate) {
                    // Remove transition classes after animation completes
                    setTimeout(() => {
                        this.body.classList.remove('theme-transitioning');
                        if (this.themeToggle) {
                            this.themeToggle.classList.remove('switching');
                        }
                    }, this.TRANSITION_DURATION);
                }
            },
            
            /**
             * Toggle between light and dark themes
             */
            toggle() {
                const currentTheme = this.getCurrentTheme();
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme(newTheme, true);
                console.log('[Theme] Switched to:', newTheme);
            },
            
            /**
             * Update the toggle button icon
             * @param {string} theme - Current theme
             */
            updateToggleIcon(theme) {
                if (!this.themeToggle) return;
                
                const icon = this.themeToggle.querySelector('i');
                if (icon) {
                    // Sun for dark mode (switch to light), Moon for light mode (switch to dark)
                    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            },
            
            /**
             * Update the tooltip text
             * @param {string} theme - Current theme
             */
            updateTooltip(theme) {
                if (!this.themeToggle) return;
                
                const tooltipText = theme === 'dark' ? 'Switch to Light' : 'Switch to Dark';
                this.themeToggle.setAttribute('data-tooltip', tooltipText);
            },
            
            /**
             * Update meta theme-color for mobile browser chrome
             * @param {string} theme - Current theme
             */
            updateMetaThemeColor(theme) {
                let metaTheme = document.querySelector('meta[name="theme-color"]');
                
                if (!metaTheme) {
                    metaTheme = document.createElement('meta');
                    metaTheme.name = 'theme-color';
                    document.head.appendChild(metaTheme);
                }
                
                metaTheme.content = theme === 'dark' ? '#0a0a0a' : '#FFFFFF';
            },
            
            /**
             * Listen for system theme preference changes
             */
            listenForSystemChanges() {
                if (!window.matchMedia) return;
                
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                
                mediaQuery.addEventListener('change', (e) => {
                    // Only auto-switch if user hasn't set a manual preference
                    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
                    if (!savedTheme) {
                        const newTheme = e.matches ? 'dark' : 'light';
                        this.applyTheme(newTheme, true);
                        console.log('[Theme] System preference changed to:', newTheme);
                    }
                });
            },
            
            /**
             * Reset to system preference (clear saved preference)
             */
            resetToSystem() {
                localStorage.removeItem(this.STORAGE_KEY);
                const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                this.applyTheme(systemTheme, true);
            }
        };

        // Initialize theme system immediately
        ThemeManager.init();

        // Navigation Active State
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Typewriter Effect
        function typeWriter(element, text, speed = 50) {
            let i = 0;
            element.innerHTML = '';

            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    setTimeout(() => {
                        i = 0;
                        element.innerHTML = '';
                        type();
                    }, 2000);
                }
            }

            type();
        }
// ===== CONTACT FORM — Web3Forms Integration =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn.querySelector('span');
    const submitBtnIcon = submitBtn.querySelector('i');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);

        const originalText = submitBtnText.textContent;
        submitBtnText.textContent = "TRANSMITTING...";
        submitBtnIcon.className = "fas fa-spinner fa-spin";
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                submitBtnText.textContent = "SENT SUCCESSFULLY";
                submitBtnIcon.className = "fas fa-check-circle";
                submitBtn.style.background = "rgba(0, 255, 65, 0.2)";
                submitBtn.style.borderColor = "#00ff41";
                submitBtn.style.color = "#00ff41";
                contactForm.reset();
            } else {
                submitBtnText.textContent = "FAILED — TRY AGAIN";
                submitBtnIcon.className = "fas fa-exclamation-triangle";
                submitBtn.style.background = "rgba(255, 50, 50, 0.2)";
                submitBtn.style.borderColor = "#ff3232";
                submitBtn.style.color = "#ff3232";
            }

        } catch (error) {
            submitBtnText.textContent = "FAILED — TRY AGAIN";
            submitBtnIcon.className = "fas fa-exclamation-triangle";
            submitBtn.style.background = "rgba(255, 50, 50, 0.2)";
            submitBtn.style.borderColor = "#ff3232";
            submitBtn.style.color = "#ff3232";
        } finally {
            setTimeout(() => {
                submitBtnText.textContent = originalText;
                submitBtnIcon.className = "fas fa-paper-plane";
                submitBtn.style.background = "";
                submitBtn.style.borderColor = "";
                submitBtn.style.color = "";
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}


        // Initialize effects
        document.addEventListener('DOMContentLoaded', () => {
            // ===== MOBILE MENU FUNCTIONALITY =====
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            const navLinksContainer = document.getElementById('navLinks');

            if (mobileMenuToggle && navLinksContainer) {
                mobileMenuToggle.addEventListener('click', () => {
                    mobileMenuToggle.classList.toggle('active');
                    navLinksContainer.classList.toggle('active');

                    // Prevent body scroll when menu is open
                    document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
                });

                // Close menu when clicking a nav link
                navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenuToggle.classList.remove('active');
                        navLinksContainer.classList.remove('active');
                        document.body.style.overflow = '';
                    });
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!navLinksContainer.contains(e.target) &&
                        !mobileMenuToggle.contains(e.target) &&
                        navLinksContainer.classList.contains('active')) {
                        mobileMenuToggle.classList.remove('active');
                        navLinksContainer.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }

            // ===== DEVICE DETECTION FOR OPTIMIZATIONS =====
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // Reduce effects on mobile for better performance
            const matrixColumnCount = isMobile ? 20 : 50;
            const particleCount = isMobile ? 15 : 30;

            // ===== MATRIX RAIN (OPTIMIZED) =====
            createMatrixRain();



            // Initialize typewriter
            const typingText = document.querySelector('.typing-text');
            if (typingText) {
                const text = "Penetration Testing & Vulnerability Assessment";
                typeWriter(typingText, text, 70);
            }

            // ===== ENHANCED PARALLAX SCROLLING =====
            const parallaxLayers = document.querySelectorAll('.parallax-layer');
            const floatingShapes = document.querySelectorAll('.shape');
            const matrixColumns = document.querySelectorAll('.matrix-column');

            // Parallax speed multipliers for each layer (higher = faster)
            const layerSpeeds = [0.1, 0.2, 0.3];
            const shapeSpeedBase = 0.15;

            let ticking = false;

            function updateParallax() {
                const scrolled = window.pageYOffset;

                // Parallax for background layers
                parallaxLayers.forEach((layer, index) => {
                    const speed = layerSpeeds[index] || 0.1;
                    const yPos = scrolled * speed;
                    layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });

                // Parallax for floating shapes (different speeds based on index)
                floatingShapes.forEach((shape, index) => {
                    const speed = shapeSpeedBase * (1 + (index * 0.1));
                    const yPos = scrolled * speed;
                    const rotation = scrolled * 0.02 * (index + 1);
                    shape.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotation}deg)`;
                });

                // Matrix rain parallax
                const matrixRate = scrolled * -0.3;
                matrixColumns.forEach(column => {
                    column.style.transform = `translateY(${matrixRate}px)`;
                });

                ticking = false;
            }

            // Throttled scroll handler using requestAnimationFrame
            function onScroll() {
                if (!ticking && !prefersReducedMotion) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            }

            window.addEventListener('scroll', onScroll, { passive: true });

            // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            document.querySelectorAll('.project-card, .skill-item, .cert-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(el);
            });

            // ===== CERTIFICATE & PROJECT CARD CURSOR GLOW EFFECT (VIBRANT) =====
            const interactiveCards = document.querySelectorAll('.cert-card, .project-card');
            
            interactiveCards.forEach(card => {
                // Find the inner container (handles both cert-card-inner and project-card-inner)
                const cardInner = card.querySelector('.cert-card-inner, .project-card-inner');
                if (!cardInner) return;

                // Create cursor glow element
                const cursorGlow = document.createElement('div');
                cursorGlow.className = 'card-cursor-glow'; // unified class name
                cursorGlow.style.cssText = `
                    position: absolute;
                    width: 250px;
                    height: 250px;
                    border-radius: 50%;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 5;
                    mix-blend-mode: screen;
                    transform: translate(-50%, -50%);
                `;
                cardInner.appendChild(cursorGlow);

                // Function to update theme-appropriate glow color
                function updateGlowColor() {
                    const isDark = document.body.getAttribute('data-theme') !== 'light';
                    if (isDark) {
                        cursorGlow.style.background = `radial-gradient(circle, 
                            rgba(0, 255, 65, 0.5) 0%, 
                            rgba(0, 179, 255, 0.3) 30%, 
                            rgba(188, 19, 254, 0.15) 60%, 
                            transparent 80%)`;
                    } else {
                        cursorGlow.style.background = `radial-gradient(circle, 
                            rgba(0, 100, 200, 0.4) 0%, 
                            rgba(91, 91, 214, 0.25) 30%, 
                            rgba(124, 58, 237, 0.12) 60%, 
                            transparent 80%)`;
                    }
                }
                updateGlowColor();

                // Watch for theme changes
                const observer = new MutationObserver(updateGlowColor);
                observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

                // Mouse enter - show glow
                card.addEventListener('mouseenter', () => {
                    cursorGlow.style.opacity = '1';
                });

                // Mouse leave - hide glow
                card.addEventListener('mouseleave', () => {
                    cursorGlow.style.opacity = '0';
                    card.style.transform = ''; // reset tilt
                });

                // Mouse move - track cursor position
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Update CSS variables for the global shine effect (if any)
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                    
                    // Update the inner cursor glow element
                    if (cursorGlow) {
                        cursorGlow.style.left = x + 'px';
                        cursorGlow.style.top = y + 'px';
                    }
                    
                    // Add slight 3D tilt effect based on cursor position
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateY = ((x - centerX) / centerX) * 6;
                    const rotateX = -((y - centerY) / centerY) * 4;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                });
            });

            // Terminal typing simulation
            const terminalLines = document.querySelectorAll('.terminal-line');
            terminalLines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '1';
                }, (index + 1) * 500);
            });

            // ===== ACTIVE NAV LINK ON SCROLL =====
            const sections = document.querySelectorAll('section[id]');

            function updateActiveNav() {
                const scrollY = window.pageYOffset;

                sections.forEach(section => {
                    const sectionHeight = section.offsetHeight;
                    const sectionTop = section.offsetTop - 100;
                    const sectionId = section.getAttribute('id');
                    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        if (navLink) navLink.classList.add('active');
                    }
                });
            }

            window.addEventListener('scroll', updateActiveNav, { passive: true });
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl + T for theme toggle
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                themeToggle.click();
            }

            // Escape to go home
            if (e.key === 'Escape') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // Easter egg: Konami code
        let konamiCode = [];
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];

        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.key);
            konamiCode = konamiCode.slice(-10);

            if (konamiCode.join(',') === konamiSequence.join(',')) {
                // Activate hacker mode
                document.body.style.animation = 'glitch 0.3s infinite';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 2000);

                // Show secret message
                const secretMsg = document.createElement('div');
                secretMsg.innerHTML = '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#000;color:#0f0;padding:20px;border:2px solid #0f0;z-index:9999;font-family:monospace;">ACCESS GRANTED: ADMIN MODE ACTIVATED</div>';
                document.body.appendChild(secretMsg);

                setTimeout(() => {
                    secretMsg.remove();
                }, 3000);
            }
        });

        /* =========================================================================
         * ENHANCED ANIMATION SYSTEM
         * =========================================================================
         * This module implements advanced visual effects including:
         * 1. Houdini PaintWorklet for ring particle rendering
         * 2. Perlin Noise for natural particle motion
         * 3. Vector field calculations for fluid dynamics
         * 4. Scroll-driven perspective animations
         * 5. Cursor interaction with particle attraction
         * 6. Click ripple effects
         * 7. Performance-optimized rendering pipeline
         * =========================================================================
         */

        /**
         * =========================================================================
         * PERLIN NOISE IMPLEMENTATION
         * =========================================================================
         * Classic Perlin Noise algorithm for generating smooth, natural-looking
         * random values. Used for particle drift and vector field calculations.
         * 
         * @description This implementation uses a permutation table and gradient
         * vectors to produce coherent noise that varies smoothly across space.
         * =========================================================================
         */
        class PerlinNoise {
            constructor() {
                // Initialize permutation table with doubled length for wrapping
                this.permutation = [];
                this.gradients = [];
                this.initializePermutation();
            }

            /**
             * Initialize the permutation table with random values
             * @description Creates a shuffled array of 0-255 and doubles it for seamless wrapping
             */
            initializePermutation() {
                // Create array 0-255 and shuffle using Fisher-Yates algorithm
                const p = Array.from({ length: 256 }, (_, i) => i);
                for (let i = p.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [p[i], p[j]] = [p[j], p[i]];
                }
                // Double the permutation table for seamless wrapping
                this.permutation = [...p, ...p];

                // Pre-calculate gradient vectors for 2D noise
                for (let i = 0; i < 256; i++) {
                    const angle = (i / 256) * Math.PI * 2;
                    this.gradients.push({ x: Math.cos(angle), y: Math.sin(angle) });
                }
            }

            /**
             * Fade/Ease function for smooth interpolation
             * @param {number} t - Input value (0-1)
             * @returns {number} Smoothed value using 6t^5 - 15t^4 + 10t^3
             */
            fade(t) {
                return t * t * t * (t * (t * 6 - 15) + 10);
            }

            /**
             * Linear interpolation between two values
             * @param {number} a - Start value
             * @param {number} b - End value
             * @param {number} t - Interpolation factor (0-1)
             * @returns {number} Interpolated value
             */
            lerp(a, b, t) {
                return a + t * (b - a);
            }

            /**
             * Calculate dot product of gradient and distance vector
             * @param {number} hash - Hash value from permutation table
             * @param {number} x - X distance from grid corner
             * @param {number} y - Y distance from grid corner
             * @returns {number} Dot product value
             */
            grad(hash, x, y) {
                const gradient = this.gradients[hash % 256];
                return gradient.x * x + gradient.y * y;
            }

            /**
             * Generate 2D Perlin noise value
             * @param {number} x - X coordinate
             * @param {number} y - Y coordinate
             * @returns {number} Noise value between -1 and 1
             */
            noise2D(x, y) {
                // Find grid cell coordinates
                const X = Math.floor(x) & 255;
                const Y = Math.floor(y) & 255;

                // Find relative position within cell
                const xf = x - Math.floor(x);
                const yf = y - Math.floor(y);

                // Compute fade curves
                const u = this.fade(xf);
                const v = this.fade(yf);

                // Hash coordinates of 4 cube corners
                const aa = this.permutation[this.permutation[X] + Y];
                const ab = this.permutation[this.permutation[X] + Y + 1];
                const ba = this.permutation[this.permutation[X + 1] + Y];
                const bb = this.permutation[this.permutation[X + 1] + Y + 1];

                // Blend results from 4 corners
                const x1 = this.lerp(
                    this.grad(aa, xf, yf),
                    this.grad(ba, xf - 1, yf),
                    u
                );
                const x2 = this.lerp(
                    this.grad(ab, xf, yf - 1),
                    this.grad(bb, xf - 1, yf - 1),
                    u
                );

                return this.lerp(x1, x2, v);
            }

            /**
             * Generate fractal Brownian motion (multi-octave noise)
             * @param {number} x - X coordinate
             * @param {number} y - Y coordinate
             * @param {number} octaves - Number of noise layers
             * @param {number} persistence - Amplitude decrease per octave
             * @returns {number} Combined noise value
             */
            fbm(x, y, octaves = 4, persistence = 0.5) {
                let total = 0;
                let frequency = 1;
                let amplitude = 1;
                let maxValue = 0;

                for (let i = 0; i < octaves; i++) {
                    total += this.noise2D(x * frequency, y * frequency) * amplitude;
                    maxValue += amplitude;
                    amplitude *= persistence;
                    frequency *= 2;
                }

                return total / maxValue;
            }
        }

        /**
         * =========================================================================
         * RING PARTICLE SYSTEM
         * =========================================================================
         * Manages ring-shaped particles that drift using Perlin noise vector fields.
         * Uses Canvas API with optional Houdini PaintWorklet support for rendering.
         * =========================================================================
         */
        /**
         * =========================================================================
         * CYBER GRID BACKGROUND (Modern & Clean)
         * =========================================================================
         * A professional, subtle animated infrastructure grid.
         * represents the "Digital Horizon".
         * =========================================================================
         */
        /**
         * =========================================================================
         * INTERACTIVE PARTICLE NETWORK
         * =========================================================================
         * Professional animated background with cursor-reactive connections.
         * Creates a constellation effect that responds to mouse movement.
         * =========================================================================
         */
        class InteractiveParticleNetwork {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.particles = [];
                this.isRunning = false;
                
                // Configuration
                this.config = {
                    particleCount: 80,
                    connectionDistance: 150,
                    mouseDistance: 200,
                    baseSpeed: 0.5,
                    colors: ['#00ff41', '#00b3ff', '#bc13fe'] 
                };
                
                // Mouse tracking
                this.mouse = { x: null, y: null };
                
                // Setup
                this.resize();
                this.bindEvents();
                this.initParticles();
                this.start();
                
                // Watch theme
                this.updateThemeColors();
                const observer = new MutationObserver(() => this.updateThemeColors());
                observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
            }
            
            updateThemeColors() {
                const isLight = document.body.getAttribute('data-theme') === 'light' || 
                               document.body.classList.contains('light-theme');
                
                if (isLight) {
                    this.config.colors = ['#0055AA', '#5B5BD6', '#7C3AED']; // Professional Blue/Purple
                    this.lineColor = 'rgba(0, 85, 170, 0.15)';
                } else {
                    this.config.colors = ['#00ff41', '#00b3ff', '#bc13fe']; // Matrix/Cyber Colors
                    this.lineColor = 'rgba(0, 255, 65, 0.15)';
                }
                
                // Refresh particle colors
                this.particles.forEach(p => {
                    p.color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
                });
            }
            
            bindEvents() {
                window.addEventListener('resize', () => this.resize());
                
                document.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.x;
                    this.mouse.y = e.y;
                });
                
                document.addEventListener('mouseleave', () => {
                    this.mouse.x = null;
                    this.mouse.y = null;
                });
            }
            
            resize() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                // Re-init if drastic change? No, just let them float.
            }
            
            initParticles() {
                this.particles = [];
                // Adjust count for mobile
                const count = window.innerWidth < 768 ? 40 : this.config.particleCount;
                
                for (let i = 0; i < count; i++) {
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        vx: (Math.random() - 0.5) * this.config.baseSpeed,
                        vy: (Math.random() - 0.5) * this.config.baseSpeed,
                        size: Math.random() * 2 + 1,
                        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)]
                    });
                }
            }
            
            draw() {
                if (!this.isRunning) return;
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Update and draw particles
                this.particles.forEach((p, index) => {
                    // Move
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    // Interaction with mouse
                    if (this.mouse.x != null) {
                        const dx = this.mouse.x - p.x;
                        const dy = this.mouse.y - p.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < this.config.mouseDistance) {
                            const forceDirectionX = dx / distance;
                            const forceDirectionY = dy / distance;
                            const force = (this.config.mouseDistance - distance) / this.config.mouseDistance;
                            
                            // Gentle attraction/repulsion
                            // Using slight repulsion for "bubble" feel, or attraction for "net"
                            // Let's do attraction for professional feel
                            const direction = 1; // 1 for attraction, -1 for repulsion
                            p.vx += forceDirectionX * force * 0.05 * direction;
                            p.vy += forceDirectionY * force * 0.05 * direction;
                        }
                    }
                    
                    // Bounce
                    if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
                    
                    // Draw Particle
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fillStyle = p.color;
                    this.ctx.fill();
                    
                    // Connect to other particles
                    for (let j = index + 1; j < this.particles.length; j++) {
                        const p2 = this.particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < this.config.connectionDistance) {
                            this.ctx.beginPath();
                            this.ctx.strokeStyle = this.lineColor;
                            this.ctx.lineWidth = 0.5;
                            this.ctx.moveTo(p.x, p.y);
                            this.ctx.lineTo(p2.x, p2.y);
                            this.ctx.stroke();
                        }
                    }
                    
                    // Connect to mouse
                    if (this.mouse.x != null) {
                        const dx = p.x - this.mouse.x;
                        const dy = p.y - this.mouse.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < this.config.mouseDistance) {
                            this.ctx.beginPath();
                            this.ctx.strokeStyle = this.lineColor;
                            this.ctx.lineWidth = 0.8; 
                            this.ctx.globalAlpha = 1 - (distance / this.config.mouseDistance);
                            this.ctx.moveTo(p.x, p.y);
                            this.ctx.lineTo(this.mouse.x, this.mouse.y);
                            this.ctx.stroke();
                            this.ctx.globalAlpha = 1;
                        }
                    }
                });
                
                requestAnimationFrame(() => this.draw());
            }
            
            start() {
                if (!this.isRunning) {
                    this.isRunning = true;
                    this.draw();
                }
            }
            
            stop() {
                this.isRunning = false;
            }
        }
        
        // Initialize the new system
        document.addEventListener('DOMContentLoaded', () => {
             const canvas = document.getElementById('ringParticleCanvas');
             if (canvas) {
                 new InteractiveParticleNetwork(canvas);
             }
        }); 
        
        /**
         * Original ParticleNetwork Removed
         */

        /**
         * =========================================================================
         * VECTOR FIELD VISUALIZER
         * =========================================================================
         * Draws subtle flow lines representing the Perlin noise vector field.
         * This creates a mesmerizing background effect showing particle flow paths.
         * =========================================================================
         */
        class VectorFieldVisualizer {
            constructor(canvas, perlin) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.perlin = perlin;
                this.time = 0;
                this.isRunning = false;

                // Grid settings for vector field visualization - INCREASED grid size to reduce draw calls
                this.gridSize = 100; // Increased from 50 to reduce draw calls
                this.lineLength = 15;
                
                // Frame rate limiter for vector field
                this.targetFPS = 20; // Lower FPS for background effect
                this.frameInterval = 1000 / this.targetFPS;
                this.lastFrameTime = 0;

                this.setupCanvas();
                this.watchThemeChanges();
            }
            
            /**
             * Check if current theme is light mode
             */
            isLightTheme() {
                return document.body.getAttribute('data-theme') === 'light' || 
                       document.body.classList.contains('light-theme');
            }
            
            /**
             * Get current theme color for flow lines
             */
            getFlowColor(opacity) {
                if (this.isLightTheme()) {
                    return `rgba(0, 100, 180, ${Math.max(0.08, opacity * 1.5)})`; // Deep blue for light mode
                }
                return `rgba(0, 255, 65, ${Math.max(0.02, opacity)})`; // Matrix green for dark mode
            }
            
            /**
             * Watch for theme changes
             */
            watchThemeChanges() {
                const observer = new MutationObserver(() => {
                    // Theme changed, colors will update on next frame
                });
                
                observer.observe(document.body, { 
                    attributes: true, 
                    attributeFilter: ['data-theme', 'class'] 
                });
            }

            /**
             * Setup canvas with proper dimensions
             */
            setupCanvas() {
                const dpr = window.devicePixelRatio || 1;
                this.canvas.width = window.innerWidth * dpr;
                this.canvas.height = window.innerHeight * dpr;
                this.canvas.style.width = window.innerWidth + 'px';
                this.canvas.style.height = window.innerHeight + 'px';
                this.ctx.scale(dpr, dpr);
                this.width = window.innerWidth;
                this.height = window.innerHeight;
            }

            /**
             * Draw vector field flow lines
             */
            draw() {
                this.ctx.clearRect(0, 0, this.width, this.height);

                const cols = Math.ceil(this.width / this.gridSize);
                const rows = Math.ceil(this.height / this.gridSize);

                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        const x = i * this.gridSize + this.gridSize / 2;
                        const y = j * this.gridSize + this.gridSize / 2;

                        // Get flow direction from Perlin noise
                        const angle = this.perlin.fbm(x * 0.003 + this.time * 0.05, y * 0.003, 2, 0.5) * Math.PI * 2;
                        const opacity = 0.1 + this.perlin.noise2D(x * 0.005, y * 0.005 + this.time * 0.02) * 0.1;

                        // Draw flow line
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y);
                        this.ctx.lineTo(
                            x + Math.cos(angle) * this.lineLength,
                            y + Math.sin(angle) * this.lineLength
                        );
                        this.ctx.strokeStyle = this.getFlowColor(opacity);
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }

            /**
             * Animation loop for vector field with frame rate limiting
             */
            animate(timestamp) {
                if (!this.isRunning) return;
                
                // Pause when tab is not visible
                if (document.hidden) {
                    requestAnimationFrame((t) => this.animate(t));
                    return;
                }

                // Frame rate limiting
                const elapsed = timestamp - this.lastFrameTime;
                if (elapsed < this.frameInterval) {
                    requestAnimationFrame((t) => this.animate(t));
                    return;
                }
                this.lastFrameTime = timestamp - (elapsed % this.frameInterval);

                this.time += elapsed / 1000;
                this.draw();

                requestAnimationFrame((t) => this.animate(t));
            }

            start() {
                if (this.isRunning) return;
                this.isRunning = true;
                this.animate(0);
            }

            stop() {
                this.isRunning = false;
            }
        }

        /**
         * =========================================================================
         * SCROLL-DRIVEN SECTION ANIMATOR
         * =========================================================================
         * Applies perspective and scale transformations to sections based on
         * scroll position, creating an immersive depth effect.
         * =========================================================================
         */
        class ScrollSectionAnimator {
            constructor() {
                this.sections = document.querySelectorAll('section');
                this.init();
            }

            /**
             * Initialize scroll observer for section animations
             */
            init() {
                // Add scroll-animated class to all sections
                this.sections.forEach(section => {
                    section.classList.add('scroll-animated');
                });

                // Create intersection observer for section visibility
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const section = entry.target;

                        if (entry.isIntersecting) {
                            section.classList.add('in-view');
                            section.classList.remove('out-of-view-top', 'out-of-view-bottom');
                        } else {
                            const rect = entry.boundingClientRect;
                            if (rect.top < 0) {
                                section.classList.add('out-of-view-top');
                            } else {
                                section.classList.add('out-of-view-bottom');
                            }
                            section.classList.remove('in-view');
                        }
                    });
                }, {
                    threshold: [0, 0.25, 0.5, 0.75, 1],
                    rootMargin: '-50px 0px'
                });

                this.sections.forEach(section => observer.observe(section));
            }
        }

        /**
         * =========================================================================
         * HOUDINI PAINTWORKLET LOADER (with fallback)
         * =========================================================================
         * Attempts to load CSS Paint Worklet for advanced rendering.
         * Falls back to canvas-based rendering if not supported.
         * =========================================================================
         */
        class HoudiniPaintWorkletManager {
            constructor() {
                this.isSupported = 'paintWorklet' in CSS;
            }

            /**
             * Check if Houdini PaintWorklet is supported
             * @returns {boolean} True if supported
             */
            checkSupport() {
                return this.isSupported;
            }

            /**
             * Register a paint worklet (for future enhancement)
             * @description Currently logs support status; can be extended to load worklet modules
             */
            async registerWorklet() {
                if (this.isSupported) {
                    console.log('[Houdini] PaintWorklet supported - advanced rendering available');
                    // Future: CSS.paintWorklet.addModule('ring-particles-worklet.js');
                } else {
                    console.log('[Houdini] PaintWorklet not supported - using Canvas fallback');
                }
            }
        }

        /**
         * =========================================================================
         * INITIALIZATION
         * =========================================================================
         * Initialize all animation systems when DOM is ready
         * =========================================================================
         */
        (function initializeEnhancedAnimations() {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }

            function init() {
            // Check for reduced motion preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (prefersReducedMotion) {
                console.log('[Animation] Reduced motion preference detected - running with minimal effects');
            }
            
            // Handle visibility change to pause/resume animations
            let ringSystem = null;
            let vectorVisualizer = null;
            
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    console.log('[Animation] Tab hidden - animations paused');
                } else {
                    console.log('[Animation] Tab visible - animations resumed');
                }
            });

            // Initialize Perlin noise generator
            const perlinNoise = new PerlinNoise();

            // Initialize Houdini PaintWorklet manager
            const houdiniManager = new HoudiniPaintWorkletManager();
            houdiniManager.registerWorklet();


            // Initialize Vector Field Visualizer (disabled on mobile and reduced motion for performance)
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const vectorCanvas = document.getElementById('vectorFieldCanvas');
            // Skip vector field if reduced motion or mobile - major performance saver
            if (vectorCanvas && !isMobile && !prefersReducedMotion) {
                vectorVisualizer = new VectorFieldVisualizer(vectorCanvas, perlinNoise);
                vectorVisualizer.start();
                console.log('[Animation] Vector field visualizer initialized');
            } else if (vectorCanvas) {
                // Hide the canvas if not using it
                vectorCanvas.style.display = 'none';
                console.log('[Animation] Vector field disabled for performance');
            }

            // Initialize Scroll Section Animator
            const scrollAnimator = new ScrollSectionAnimator();
            console.log('[Animation] Scroll section animator initialized');

            // Log initialization complete
            console.log('[Animation] Enhanced animation system fully initialized');
            console.log('[Animation] Features: Perlin Noise, Ring Particles, Vector Fields, Scroll Animations, Cursor Interaction');

            // ===== LOADING SCREEN FUNCTIONALITY =====
            const loadingScreen = document.getElementById('loadingScreen');

            if (loadingScreen) {
                // Hide loading screen after page loads
                const hideLoading = () => {
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        // Remove from DOM after transition
                        setTimeout(() => {
                            loadingScreen.remove();
                        }, 800);
                    }, 2800); // Wait for loading bar animation + some buffer
                };
                
                if (document.readyState === 'complete') {
                    hideLoading();
                } else {
                    window.addEventListener('load', hideLoading);
                }
                
                console.log('[Loading] Loading screen initialized');
            }

            // ===== CURSOR TRACKING FOR ENHANCED CARDS =====
            const trackCursor = (elements, selector) => {
                elements.forEach(card => {
                    card.addEventListener('mousemove', (e) => {
                        const rect = card.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        card.style.setProperty('--mouse-x', `${x}%`);
                        card.style.setProperty('--mouse-y', `${y}%`);
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        card.style.setProperty('--mouse-x', '50%');
                        card.style.setProperty('--mouse-y', '50%');
                    });
                });
            };
            
            // Track cursor for project cards
            const projectCards = document.querySelectorAll('.project-card');
            if (projectCards.length > 0) {
                trackCursor(projectCards);
                console.log('[Cursor] Project card tracking enabled');
            }
            
            // Track cursor for skill category cards
            const skillCards = document.querySelectorAll('.skill-category-card');
            if (skillCards.length > 0) {
                trackCursor(skillCards);
                console.log('[Cursor] Skill card tracking enabled');
            }
            
            // ===== DOSSIER INTEL TABS =====
            const intelTabs = document.querySelectorAll('.intel-tab');
            const intelContents = document.querySelectorAll('.intel-content');
            if (intelTabs.length > 0 && intelContents.length > 0) {
                intelTabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        const targetTab = tab.getAttribute('data-tab');
                        
                        // Deactivate all tabs and contents
                        intelTabs.forEach(t => t.classList.remove('active'));
                        intelContents.forEach(c => c.classList.remove('active'));
                        
                        // Activate clicked tab and matching content
                        tab.classList.add('active');
                        const targetContent = document.getElementById('tab-' + targetTab);
                        if (targetContent) {
                            targetContent.classList.add('active');
                        }
                    });
                });
                console.log('[Dossier] Intel tabs initialized');
            }
            }
        })();