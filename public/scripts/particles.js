class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mode = 'hero'; // hero, education, events, management
        this.resize();

        // Configuration per mode
        this.configs = {
            hero: {
                count: 100,
                speed: 0.5,
                color: 'rgba(255, 255, 255, 0.5)',
                connectionDistance: 150,
                behavior: 'float'
            },
            education: {
                count: 80,
                speed: 2,
                color: 'rgba(255, 215, 0, 0.6)', // Gold
                connectionDistance: 100,
                behavior: 'circuit' // 90 degree turns
            },
            events: {
                count: 60,
                speed: 3,
                color: ['#6a1b9a', '#ff9800', '#00e5ff'], // Purple, Orange, Cyan
                connectionDistance: 0, // No connections
                behavior: 'confetti'
            },
            management: {
                count: 100,
                speed: 1,
                color: 'rgba(176, 190, 197, 0.4)', // Silver
                connectionDistance: 100,
                behavior: 'grid'
            }
        };

        this.init();
        window.addEventListener('resize', () => this.resize());
        this.animate();
        this.setupObserver();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Clear and rebuild particles based on current mode
        this.particles = [];
        const config = this.configs[this.mode];
        let count = config.count;

        // Reduce particles on mobile
        if (window.innerWidth < 768) {
            count = Math.floor(count * 0.3);
        }

        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this.canvas, this.mode, config));
        }
    }

    switchMode(newMode) {
        if (this.mode === newMode) return;
        console.log(`Switching particle mode to: ${newMode}`);
        this.mode = newMode;

        // Transition effect: re-init particles with new config
        // In a more advanced version, we could morphed existing particles
        this.init();
    }

    setupObserver() {
        const sections = document.querySelectorAll('section');
        const options = {
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    if (['hero', 'education', 'events', 'management'].includes(id)) {
                        this.switchMode(id);
                    }
                }
            });
        }, options);

        sections.forEach(s => observer.observe(s));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const config = this.configs[this.mode];

        this.particles.forEach(p => {
            p.update(this.mode);
            p.draw(this.ctx);
        });

        // Draw connections if enabled
        if (config.connectionDistance > 0) {
            this.drawConnections(config.connectionDistance, config.color);
        }

        requestAnimationFrame(() => this.animate());
    }

    drawConnections(dist, color) {
        // Simple O(N^2) connection check
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < dist) {
                    this.ctx.beginPath();
                    // Use particle color or global config color
                    this.ctx.strokeStyle = typeof color === 'string' ? color : color[0];
                    this.ctx.lineWidth = 0.5;
                    this.ctx.globalAlpha = 1 - (distance / dist);
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
    }
}

class Particle {
    constructor(canvas, mode, config) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.config = config;

        // Velocity
        const speed = config.speed;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;

        // Color
        if (Array.isArray(config.color)) {
            this.color = config.color[Math.floor(Math.random() * config.color.length)];
        } else {
            this.color = config.color;
        }

        this.size = Math.random() * 3 + 1;

        // Specific properties for behaviors
        this.angle = 0; // For circular motion
        this.gridTargetX = null;
        this.gridTargetY = null;
    }

    update(mode) {
        if (mode === 'hero') {
            this.x += this.vx;
            this.y += this.vy;
        }
        else if (mode === 'education') {
            // Circuit: Move in straight lines, random turn 90 deg
            if (Math.random() < 0.05) {
                if (Math.random() < 0.5) { this.vx = 0; this.vy = (Math.random() - 0.5) * this.config.speed * 2; }
                else { this.vy = 0; this.vx = (Math.random() - 0.5) * this.config.speed * 2; }
            }
            this.x += this.vx;
            this.y += this.vy;
        }
        else if (mode === 'events') {
            // Confetti: Chaotic with gravity/swirl
            this.angle += 0.1;
            this.x += Math.cos(this.angle) * 2 + this.vx;
            this.y += Math.sin(this.angle) * 2 + this.vy;
        }
        else if (mode === 'management') {
            // Grid: Slowly drift towards nearest grid point (e.g. every 100px)
            const gridSize = 100;
            if (!this.gridTargetX) {
                this.gridTargetX = Math.round(this.x / gridSize) * gridSize;
                this.gridTargetY = Math.round(this.y / gridSize) * gridSize;
            }

            // Move towards target
            this.x += (this.gridTargetX - this.x) * 0.05;
            this.y += (this.gridTargetY - this.y) * 0.05;

            // Should also jiggle a bit
            this.x += (Math.random() - 0.5);
            this.y += (Math.random() - 0.5);

            // Reroaming if too close
            if (Math.abs(this.x - this.gridTargetX) < 1 && Math.abs(this.y - this.gridTargetY) < 1) {
                // Pick new random neighbor
                if (Math.random() > 0.5) this.gridTargetX += (Math.random() > 0.5 ? gridSize : -gridSize);
                else this.gridTargetY += (Math.random() > 0.5 ? gridSize : -gridSize);
            }
        }

        // Boundary Wrap
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Start System
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
