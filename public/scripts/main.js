document.addEventListener('DOMContentLoaded', () => {
    // Role Switcher Logic
    const roleToggle = document.getElementById('role-toggle');
    const roleText = document.getElementById('role-text');
    const root = document.documentElement;
    const thumb = document.querySelector('.toggle-thumb');
    let isEventMode = false;

    // Content/Text Maps
    const roleTitles = {
        edu: "Educator & Mentor",
        event: "Event Manager & Leader"
    };

    roleToggle.addEventListener('click', () => {
        isEventMode = !isEventMode;

        // Move Thumb
        thumb.style.transform = isEventMode ? 'translateX(24px)' : 'translateX(0)';
        thumb.style.background = isEventMode ? 'var(--event-accent)' : 'var(--edu-accent)';

        // Change Text
        // Reset animation
        roleText.style.animation = 'none';
        roleText.offsetHeight; /* trigger reflow */
        roleText.textContent = isEventMode ? roleTitles.event : roleTitles.edu;
        roleText.style.animation = 'typewriter 2s steps(30, end) forwards, blink 0.75s step-end infinite';
        roleText.style.borderColor = isEventMode ? 'var(--event-accent)' : 'var(--edu-accent)';

        // Optional: Scroll to relevant section priority? 
        // For now just visual theme hints could change if we wanted global theme switching
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // offset for fixed nav
                    behavior: 'smooth'
                });
            }
        });
    });

    // Experience Counter
    const counters = document.querySelectorAll('.counter');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;

                const updateCounter = () => {
                    const increment = target / 50;
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));

    console.log("Main JS Loaded");
});
