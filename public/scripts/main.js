document.addEventListener('DOMContentLoaded', () => {
    // Role Switcher Logic
    // Language Switcher Logic
    const langToggle = document.getElementById('lang-toggle');
    const thumb = document.querySelector('.toggle-thumb');

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.lang;
            if (currentLang === 'fr') {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'index-fr.html';
            }
        });
    }

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
