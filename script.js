// === TEMA ===
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggleBtn.addEventListener('click', () => {
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro';
}

// === EMAIL ===
document.getElementById('email-btn').addEventListener('click', () => {
    window.location.href = `mailto:${atob("dmluaWNpdXN2ZWNjaGlvdHRpQGdtYWlsLmNvbQ==")}`;
});

// === REDE DE PARTÍCULAS ===
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
const wrapper = document.getElementById('canvas-wrapper');
let particlesArray = [];
const mouse = { x: null, y: null, radius: 100 };

function resizeCanvas() {
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#60519b';
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = Array.from(
        { length: Math.floor((canvas.width * canvas.height) / 4000) },
        () => new Particle()
    );
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
                ctx.strokeStyle = `rgba(96, 81, 155, ${1 - dist / 80})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
        if (mouse.x !== null) {
            const dx = particlesArray[a].x - mouse.x;
            const dy = particlesArray[a].y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                ctx.strokeStyle = `rgba(96, 81, 155, ${1 - dist / mouse.radius})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    connectParticles();
}

initParticles();
animateParticles();

// === FUNDO GEOMÉTRICO ===
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');

function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBgCanvas);
resizeBgCanvas();

class GeometricLine {
    constructor() { this.reset(); }

    reset() {
        if (Math.random() > 0.5) {
            this.x = Math.random() * bgCanvas.width;
            this.y = bgCanvas.height + 10;
        } else {
            this.x = -10;
            this.y = Math.random() * bgCanvas.height;
        }
        this.baseSpeedX = Math.random() * 2 + 1;
        this.baseSpeedY = -(Math.random() * 2 + 1);
        this.lineWidth = Math.random() * 6 + 0.5;
        this.maxLength = Math.random() * 300 + 100;
        this.currentLength = 0;
        this.opacity = Math.random() * 0.25 + 0.15;
        this.fadeSpeed = 0.001;
        this.state = 'growing';
        this.breakTimer = 0;
        this.breakInterval = Math.random() * 30 + 10;
        this.points = [];
    }

    update() {
        if (this.state === 'growing') {
            this.points.push({ x: this.x, y: this.y });
            this.breakTimer++;

            if (this.breakTimer >= this.breakInterval) {
                this.baseSpeedY = -(Math.random() * 5 + 2);
                if (Math.random() > 0.7) this.baseSpeedY *= -1;
                this.baseSpeedX += (Math.random() - 0.5) * 2;
                this.breakTimer = 0;
                this.breakInterval = Math.random() * 30 + 10;
            }

            this.x += this.baseSpeedX;
            this.y += this.baseSpeedY;
            this.currentLength++;

            if (this.currentLength >= this.maxLength || this.x > bgCanvas.width + 50 || this.y < -50) {
                this.state = 'fading';
            }
        } else {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0) this.reset();
        }
    }

    draw() {
        if (this.points.length < 2) return;
        bgCtx.strokeStyle = `rgba(96, 81, 155, ${this.opacity})`;
        bgCtx.lineWidth = this.lineWidth;
        bgCtx.lineCap = 'butt';
        bgCtx.lineJoin = 'miter';
        bgCtx.beginPath();
        bgCtx.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach(p => bgCtx.lineTo(p.x, p.y));
        bgCtx.stroke();
    }
}

const linesArray = Array.from({ length: 4 }, () => new GeometricLine());

function animateBackground() {
    requestAnimationFrame(animateBackground);
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    linesArray.forEach(line => { line.update(); line.draw(); });
}

animateBackground();
