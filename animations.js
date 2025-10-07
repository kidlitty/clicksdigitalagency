document.addEventListener('DOMContentLoaded', () => {
    // Reusable animation function
    const animate = (element, animation) => {
        gsap.from(element, {
            ...animation,
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none none'
            }
        });
    };

    // Animation definitions
    const animations = {
        'fade-in-up': { opacity: 0, y: 100, duration: 1, ease: 'power3.out', force3D: true },
        'fade-in-left': { opacity: 0, x: -100, duration: 1, ease: 'power3.out', force3D: true },
        'fade-in-right': { opacity: 0, x: 100, duration: 1, ease: 'power3.out', force3D: true },
        'zoom-in': { opacity: 0, scale: 0.5, duration: 1, ease: 'power3.out', force3D: true }
    };

    // Apply animations to elements with data-animation attribute
    document.querySelectorAll('[data-animation]').forEach(element => {
        const animationType = element.dataset.animation;
        if (animations[animationType]) {
            animate(element, animations[animationType]);
        }
    });

    // Staggered animations for elements with data-stagger attribute
    document.querySelectorAll('[data-stagger]').forEach(container => {
        const animationType = container.dataset.stagger;
        const elements = container.querySelectorAll('[data-stagger-child]');
        if (animations[animationType]) {
            gsap.from(elements, {
                ...animations[animationType],
                stagger: 0.2,
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play reverse play reverse'
                }
            });
        }
    });
});
