const loader = document.getElementById('loader');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const yearEl = document.getElementById('year');
const projectCards = document.querySelectorAll('.project-card');
const modal = document.querySelector('.project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.querySelector('.modal-description');
const modalStack = document.querySelector('.modal-stack');
const modalLinks = document.querySelector('.modal-links');
const modalClose = document.querySelector('.modal-close');
const sections = document.querySelectorAll('.section, .hero-content, .hero-text, .hero-visual, .section-heading, .project-card, .skill-card, .about-content, .contact-form');
const form = document.querySelector('.contact-form');
const statusMessage = document.querySelector('.form-status');
const starfield = document.getElementById('starfield');

const projectData = {
    nebula: {
        title: 'Nebula UI Kit',
        description:
            'A modular design system with live component previews, custom theming engine, and accessibility-first components.',
        stack: ['React', 'Styled Components', 'Storybook', 'Jest'],
        links: [
            { label: 'View on GitHub', url: 'https://github.com' },
            { label: 'Live Demo', url: 'https://example.com' }
        ]
    },
    aether: {
        title: 'Aether Analytics',
        description:
            'Cloud-native analytics platform ingesting millions of events per hour with predictive dashboards and anomaly detection.',
        stack: ['Node.js', 'GraphQL', 'PostgreSQL', 'Redis', 'AWS'],
        links: [
            { label: 'Case Study', url: 'https://example.com' },
            { label: 'View on GitHub', url: 'https://github.com' }
        ]
    },
    quantum: {
        title: 'Quantum Collaboration',
        description:
            'Real-time collaboration app featuring secure messaging, shared canvases, and AI-powered meeting summaries.',
        stack: ['React', 'WebRTC', 'Socket.io', 'Go Microservices'],
        links: [
            { label: 'Product Tour', url: 'https://example.com' },
            { label: 'View on GitHub', url: 'https://github.com' }
        ]
    }
};

function fadeOutLoader() {
    loader.classList.add('hidden');
}

window.addEventListener('load', () => {
    setTimeout(fadeOutLoader, 2200);
});

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function openModal(key) {
    const data = projectData[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;

    modalStack.innerHTML = '';
    data.stack.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        modalStack.appendChild(li);
    });

    modalLinks.innerHTML = '';
    data.links.forEach((link) => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener';
        anchor.textContent = link.label;
        modalLinks.appendChild(anchor);
    });

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

projectCards.forEach((card) => {
    card.classList.add('fade-in');
    card.addEventListener('click', () => openModal(card.dataset.project));
    card.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal(card.dataset.project);
        }
    });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
    }
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.2
    }
);

sections.forEach((section) => {
    section.classList.add('fade-in');
    observer.observe(section);
});

function validateEmail(email) {
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}

if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = form.querySelector('#name');
        const emailInput = form.querySelector('#email');
        const messageInput = form.querySelector('#message');
        const inputs = [nameInput, emailInput, messageInput];
        let valid = true;

        inputs.forEach((input) => {
            const errorEl = input.nextElementSibling;
            errorEl.textContent = '';

            if (!input.value.trim()) {
                errorEl.textContent = 'Required field';
                valid = false;
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                errorEl.textContent = 'Please enter a valid email address';
                valid = false;
            }
        });

        if (!valid) {
            statusMessage.textContent = 'Please resolve validation errors.';
            statusMessage.style.color = '#ff7aa2';
            return;
        }

        statusMessage.textContent = 'Transmitting...';
        statusMessage.style.color = 'var(--accent)';

        setTimeout(() => {
            statusMessage.textContent = 'Message received! I will reach out soon.';
            form.reset();
        }, 1000);
    });
}

function createStarfield() {
    const ctx = starfield.getContext('2d');
    let width = (starfield.width = window.innerWidth);
    let height = (starfield.height = window.innerHeight);
    const stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.2,
        velocity: Math.random() * 0.35 + 0.05
    }));

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
        gradient.addColorStop(0, 'rgba(10, 0, 40, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ffffff';
        stars.forEach((star) => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.globalAlpha = Math.random() * 0.6 + 0.2;
            ctx.fill();
            ctx.globalAlpha = 1;
            star.y += star.velocity;
            if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
            }
        });

        requestAnimationFrame(draw);
    }

    function resize() {
        width = starfield.width = window.innerWidth;
        height = starfield.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    draw();
}

if (starfield) {
    createStarfield();
}
