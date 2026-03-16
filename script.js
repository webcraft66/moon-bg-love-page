const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
const mainHeart = document.getElementById('main-heart');
const heartsContainer = document.getElementById('hearts-container');
const loveNote = document.getElementById('love-note');
const newMessageBtn = document.getElementById('new-message');
const proposalBtn = document.getElementById('proposal-btn');
const personalizeBtn = document.getElementById('personalize-btn');
const partner1Input = document.getElementById('partner1');
const partner2Input = document.getElementById('partner2');
const titleEl = document.querySelector('.title');
const starsContainer = document.getElementById('stars-container');
const moon = document.getElementById('moon');
const bgm = document.getElementById('bgm');

let partner1Name = '';
let partner2Name = '';
let particles = [];
let stars = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '0';

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const loveMessages = [
    'You make my heart flutter! 💖',
    'Forever and always, my love. 🌹',
    'You are my sunshine on a cloudy day. ☀️',
    'Every moment with you is magical. ✨',
    'I love you more than chocolate! 🍫',
    'You complete me perfectly. ❤️',
    'Sweet dreams of us tonight. 😘',
    'Our love story is the best! 📖',
    'Hugs and kisses forever! 🤗💋',
    'You are my one and only. 💕'
];

mainHeart.addEventListener('click', () => {
    createFloatingHeart();
    createFireworks(mainHeart.getBoundingClientRect().left + mainHeart.offsetWidth / 2, mainHeart.getBoundingClientRect().top + mainHeart.offsetHeight / 2);
});

newMessageBtn.addEventListener('click', () => {
    const msg = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    loveNote.textContent = msg.replace(/you|your/gi, partner2Name || 'my love');
});

personalizeBtn.addEventListener('click', () => {
    partner1Name = partner1Input.value.trim() || 'My Love';
    partner2Name = partner2Input.value.trim() || 'Darling';
    titleEl.textContent = `${partner1Name} ❤️ ${partner2Name}`;
    loveNote.textContent = `Forever yours, ${partner2Name}! 💕`;
    createMassiveFireworks();
});

proposalBtn.addEventListener('click', () => {
    const p1 = partner1Name || '';
    const p2 = partner2Name || '';
    alert(`💍 ${p1}, will you marry me ${p2}? YES, forever together! 💕✨`);
    bgm.pause();
    createMassiveFireworks();
    setTimeout(() => bgm.play().catch(() => {}), 5000);
});

moon.addEventListener('click', () => {
    loveNote.textContent = `You light up my night like the moon, ${partner2Name || ''}! 🌙💖`;
    createFireworks(moon.getBoundingClientRect().right, moon.getBoundingClientRect().top);
    createFloatingHeart();
});

// Stars generation
function createStars() {
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 4 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 60}%`;
        star.style.animation = `twinkle ${Math.random() * 2 + 1}s infinite`;
        star.style.animationDelay = `${Math.random() * 2}s`;

        const msgDiv = document.createElement('div');
        msgDiv.classList.add('star-message');

        star.appendChild(msgDiv);
        starsContainer.appendChild(star);
        stars.push(star);

        star.addEventListener('mouseenter', (e) => {
            const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
            msgDiv.textContent = message.replace(/you|your/gi, partner2Name || 'love');
            msgDiv.style.display = 'block';
            msgDiv.style.left = `${e.clientX + 10}px`;
            msgDiv.style.top = `${e.clientY - 10}px`;
            createFireworks(e.clientX, e.clientY, '#ffd700');
        });

        star.addEventListener('mouseleave', () => {
            msgDiv.style.display = 'none';
        });

        star.addEventListener('click', (e) => {
            createFireworks(e.clientX, e.clientY);
            createFloatingHeart();
        });
    }
}

function createFloatingHeart() {
    const hearts = ['💖', '💕', '💗', '💓', '💞', '💝'];
    const heart = document.createElement('div');
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.classList.add('floating-heart');
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${Math.random() * 3 + 2}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}

function createPetal() {
    const petals = ['🌹', '🌺', '🌸', '💐'];
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${Math.random() * 3 + 3}s`;
    petal.style.animationDelay = `${Math.random() * 2}s`;
    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 8000);
}

// Canvas fireworks & particles
class Particle {
    constructor(x, y, vx, vy, color, size, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.life = life;
        this.maxLife = life;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.life--;
        this.size *= 0.99;
    }

    draw() {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createFireworks(x, y, color = '#ff69b4') {
    for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const speed = Math.random() * 5 + 2;
        particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 3, color, Math.random() * 3 + 1, 60));
    }
}

function createMassiveFireworks() {
    const colors = ['#ff69b4', '#ffd700', '#ff1493', '#ff6b9d', '#ff1493'];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    for (let c = 0; c < 3; c++) {
        setTimeout(() => createFireworks(centerX, centerY, colors[Math.floor(Math.random() * colors.length)]), c * 200);
    }
}

function animate() {
    ctx.fillStyle = 'rgba(27, 39, 53, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.life > 0 && p.size > 0.1;
    });

    requestAnimationFrame(animate);
}

// Init
loveNote.textContent = loveMessages[0];
createStars();
bgm.volume = 0.3;
bgm.play().catch(e => console.log('Autoplay blocked'));

// Loops
setInterval(() => {
    if (Math.random() > 0.6) createFloatingHeart();
    if (Math.random() > 0.95) createFireworks(Math.random() * canvas.width, Math.random() * canvas.height / 2);
}, 2500);

setInterval(createPetal, 600);

animate();
