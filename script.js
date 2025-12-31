    // --- Initialize ScrollReveal Animations ---
        // --- Optimized ScrollReveal Animations ---
// --- Optimized ScrollReveal Animations (Har baar trigger hone ke liye) ---
const revealConfig = {
    distance: '60px',
    duration: 500,        // Fast animation
    easing: 'ease-out',   
    interval: 80,         
    opacity: 0,
    scale: 0.95,
    mobile: true,
    reset: true,          // Sabse Zaroori: Isse animation baar-baar dikhegi
    viewFactor: 0.1       // Screen par aate hi turant shuru ho jayegi
};

// Har direction ke liye triggers (Puraane wale hatakar ye lagayein)
ScrollReveal().reveal('.reveal-bottom', { ...revealConfig, origin: 'bottom' });
ScrollReveal().reveal('.reveal-left', { ...revealConfig, origin: 'left' });
ScrollReveal().reveal('.reveal-right', { ...revealConfig, origin: 'right' });
ScrollReveal().reveal('.reveal-tag', { ...revealConfig, scale: 0.8, interval: 40 });

// Extra smooth scrolling for the whole page
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

        // --- Matrix Canvas Effect (Dark Mode) ---
        const canvas2d = document.getElementById('hero-canvas-dark');
        const ctx2d = canvas2d.getContext('2d');

        function resizeCanvas2d() {
            canvas2d.width = window.innerWidth;
            canvas2d.height = window.innerHeight;
        }
        resizeCanvas2d();
        window.addEventListener('resize', resizeCanvas2d);

        const hexChars = '0123456789ABCDEF<>/\\{}[]=+-_|';
        const fontSize = 16;
        let columns = canvas2d.width / fontSize;
        const drops = [];
        for (let i = 0; i < columns; i++) { drops[i] = Math.random() * -100; }

        function drawMatrix() {
            ctx2d.fillStyle = 'rgba(2, 6, 23, 0.05)';
            ctx2d.fillRect(0, 0, canvas2d.width, canvas2d.height);
            ctx2d.fillStyle = '#06b6d4'; 
            ctx2d.font = fontSize + 'px "Source Code Pro", monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = hexChars.charAt(Math.floor(Math.random() * hexChars.length));
                ctx2d.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas2d.height && Math.random() > 0.98) { drops[i] = 0; }
                drops[i]++;
            }
        }
        setInterval(drawMatrix, 45);

        // --- Enhanced Interactive Rain Effect (Light Mode) ---
        const canvasRain = document.getElementById('hero-canvas-light-rain');
        const ctxRain = canvasRain.getContext('2d');
        let rainDrops = [];
        let splashes = [];
        let ripples = [];
        let mouseX = -100, mouseY = -100;

        function resizeCanvasRain() {
            canvasRain.width = window.innerWidth;
            canvasRain.height = window.innerHeight;
            initRain();
        }

        class RainDrop {
            constructor() {
                this.x = Math.random() * canvasRain.width;
                this.y = Math.random() * -canvasRain.height;
                // Depth factor (0 = far, 1 = close)
                this.z = Math.random();

                // Speed based on depth (closer = faster) - SLOW speed
                this.speed = this.z * 2 + 1.5; 
                
                // Horizontal oscillation parameters for "wind"
                this.oscillationBase = Math.random() * Math.PI * 2;
                this.oscillationSpeed = Math.random() * 0.02;

                // Radius based on depth (closer = bigger)
                this.radius = this.z * 2 + 1; // Range: 1 to 3

                // Opacity based on depth (closer = more opaque)
                this.baseOpacity = this.z * 0.3 + 0.1; // Range: 0.1 to 0.4
                this.opacity = this.baseOpacity;
            }
            update() {
                this.y += this.speed;
                // Add horizontal oscillation for "wind" effect
                this.x += Math.sin(this.oscillationBase) * this.z * 0.5;
                this.oscillationBase += this.oscillationSpeed;

                // Collision with bottom
                if (this.y + this.radius > canvasRain.height) {
                    createRipple(this.x, canvasRain.height, this.z);
                    this.reset();
                }
                // Collision with mouse
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                if (Math.sqrt(dx*dx + dy*dy) < 50 * this.z) { // Easier to hit closer drops
                      createSplash(this.x, this.y, this.z);
                      this.reset();
                }
            }
            reset() {
                 this.x = Math.random() * canvasRain.width;
                 this.y = Math.random() * -200;
                 this.z = Math.random();
                 this.speed = this.z * 2 + 1.5;
                 this.radius = this.z * 2 + 1;
                 this.baseOpacity = this.z * 0.3 + 0.1;
                 this.opacity = this.baseOpacity;
            }
            draw() {
                ctxRain.beginPath();
                ctxRain.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
                // Draw circle droplet
                ctxRain.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctxRain.fill();
            }
        }

        class SplashParticle {
             constructor(x, y, z) {
                 this.x = x; this.y = y;
                 this.z = z;
                 this.vx = (Math.random() - 0.5) * (4 * z);
                 this.vy = (Math.random() * -3 - 1) * z;
                 this.life = 1.0;
                 // REDUCED GRAVITY for softer splashes
                 this.gravity = 0.05 * z;
                 this.radius = 1.5 * z;
             }
             update() {
                 this.vy += this.gravity;
                 this.x += this.vx;
                 this.y += this.vy;
                 this.life -= 0.03;
             }
             draw() {
                 ctxRain.beginPath();
                 ctxRain.fillStyle = `rgba(59, 130, 246, ${this.life * this.z})`;
                 ctxRain.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                 ctxRain.fill();
             }
        }

        class Ripple {
            constructor(x, y, z) {
                this.x = x; this.y = y;
                this.z = z;
                this.radius = 1 * z;
                this.opacity = 0.5 * z;
            }
            update() {
                this.radius += 1.5 * this.z;
                this.opacity -= 0.015;
            }
            draw() {
                ctxRain.beginPath();
                ctxRain.strokeStyle = `rgba(59, 130, 246, ${this.opacity})`;
                ctxRain.lineWidth = 1 * this.z;
                ctxRain.ellipse(this.x, this.y, this.radius, this.radius * 0.3, 0, 0, Math.PI * 2);
                ctxRain.stroke();
            }
        }

        function initRain() {
            rainDrops = [];
            // Increased count for denser rain to compensate for slower speed
            for (let i = 0; i < 200; i++) { rainDrops.push(new RainDrop()); }
        }

        function createSplash(x, y, z) {
            const count = Math.floor(5 * z) + 2;
            for (let i = 0; i < count; i++) { splashes.push(new SplashParticle(x, y, z)); }
        }
        function createRipple(x, y, z) {
            ripples.push(new Ripple(x, y, z));
        }

        function animateLightRain() {
            if (!document.body.classList.contains('light-mode')) return; 
            ctxRain.clearRect(0, 0, canvasRain.width, canvasRain.height);

            // Sort by z-index so bigger drops are drawn on top
            rainDrops.sort((a, b) => a.z - b.z);

            rainDrops.forEach(drop => { drop.update(); drop.draw(); });
            
            splashes.forEach((splash, index) => {
                splash.update(); splash.draw();
                if (splash.life <= 0) splashes.splice(index, 1);
            });
             ripples.forEach((ripple, index) => {
                ripple.update(); ripple.draw();
                if (ripple.opacity <= 0) ripples.splice(index, 1);
            });

            requestAnimationFrame(animateLightRain);
        }

        window.addEventListener('resize', resizeCanvasRain);
        window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        resizeCanvasRain();


        // --- Dark/Light Mode Toggle ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = themeToggleBtn.querySelector('i');
        const body = document.body;

        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            body.classList.remove('dark-mode', 'light-mode');
            body.classList.add(currentTheme);
            updateThemeIcon(currentTheme);
        }

        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.replace('light-mode', 'dark-mode');
                localStorage.setItem('theme', 'dark-mode');
                updateThemeIcon('dark-mode');
            } else {
                body.classList.replace('dark-mode', 'light-mode');
                localStorage.setItem('theme', 'light-mode');
                updateThemeIcon('light-mode');
                animateLightRain(); 
            }
        });

        function updateThemeIcon(theme) {
            if (theme === 'light-mode') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                animateLightRain(); 
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }

        // --- Dynamic Year ---
        document.getElementById('year').textContent = new Date().getFullYear();

        // --- Mobile Menu Toggle ---
        // --- Mobile Menu Toggle with Cross Icon Fix ---
const menuToggle = document.querySelector('.menu-toggle');
const menuIcon = document.querySelector('.menu-toggle i'); // Icon element
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Check if menu is open
    if (navLinks.classList.contains('active')) {
        // Change to Cross Icon
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        // Change back to Bars Icon
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

// Jab kisi link par click ho, menu band ho jaye aur icon reset ho jaye
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    });
});

        

        // --- Multi-color Typing Effect with "a/an" Grammar Check ---
        const typedTextSpan = document.querySelector(".type-text");
        const staticTextSpan = document.querySelector(".static-text");
        const textArray = ["Software Developer.", "Full Stack Developer.", "Content Creator.", "Video Editor.", "Engineer."];
        const colorArray = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]; 
        
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex === 0) {
                const currentWord = textArray[textArrayIndex];
                if (currentWord === "Engineer.") {
                      staticTextSpan.textContent = "I am an";
                } else {
                      staticTextSpan.textContent = "I am a";
                }
                typedTextSpan.style.color = colorArray[textArrayIndex];
            }
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 500);
            }
        }

        document.addEventListener("DOMContentLoaded", () => { setTimeout(type, newTextDelay + 250); });

        

           // Line 1908 se replace karein
// --- Unified Scroll Logic ---
const scrollTopBtn = document.getElementById("scrollTopBtn");
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".nav-links li a");

window.addEventListener('scroll', () => {
    // 1. Button Visibility Logic
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }

    // 2. Active Link Highlight Logic
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 250) {
            current = section.getAttribute("id");
        }
    });

    navLi.forEach((a) => {
        a.classList.remove("active");
        if (a.getAttribute("href") === `#${current}`) {
            a.classList.add("active");
        }
    });
});

// Scroll to top click event
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


  const contactForm = document.querySelector('.contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // 1. Formspree ka Thank You page rokne ke liye

    const formData = new FormData(this);
    
    // 2. Button par loading dikhana (Optional par accha lagta hai)
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // 3. Form ko turant reset karna jaisa aapne kaha
    this.reset(); 

    // 4. Background mein data bhejnan (Bina redirect ke)
    fetch("https://formspree.io/f/mwvkbjkp", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // 5. Success Message dikhana
            formStatus.innerHTML = '<span style="color: #10b981; display: block; line-height: 1.5;">Thanks For Reaching Out ! <br> Your Message Sent Successfully!</span>';
            
            // 6. 2 second baad text ko hatana
            setTimeout(() => {
                formStatus.innerHTML = "";
            }, 2000);
        } else {
            formStatus.innerHTML = '<span style="color: #ef4444;">Oops! Something went wrong.</span>';
        }
    }).catch(error => {
        formStatus.innerHTML = '<span style="color: #ef4444;">Network Error. Please try again.</span>';
    }).finally(() => {
        // Button ko wapas normal karna
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Check if mobile or tablet screen
    if (window.innerWidth <= 768) {
        // Sirf Internship section (#experience) ki lists ko select karein
        const internshipLists = document.querySelectorAll('#experience .timeline-list');

        internshipLists.forEach(list => {
            // Naya "More" button create karein
            const moreBtn = document.createElement('div');
            moreBtn.className = 'read-more-intern';
            moreBtn.innerHTML = '...More';
            
            // List ke turant baad button insert karein (Certificate button se upar)
            list.parentNode.insertBefore(moreBtn, list.nextSibling);

            moreBtn.addEventListener('click', function() {
                if (list.classList.contains('expanded')) {
                    list.classList.remove('expanded');
                    this.innerHTML = '...More';
                    // Scroll layout fix
                    list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    list.classList.add('expanded');
                    this.innerHTML = 'Show Less';
                }
            });
        });
    }
});