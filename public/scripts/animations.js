document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Fade-in elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Dynamic selection of elements to animate
    const animatedElements = document.querySelectorAll('.timeline-item, .event-card, .stat-card, .section-header');
    animatedElements.forEach(el => {
        el.classList.add('animate-fade-in');
        observer.observe(el);
    });

    console.log("Animation Controller Loaded");

    // Add particle effects (Optional / Extended feature)
    // Could add simple canvas particles here if requested
});
