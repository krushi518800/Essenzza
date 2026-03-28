document.addEventListener('DOMContentLoaded', () => {
    const applyBtn = document.getElementById('apply-btn');
    const initialContent = document.getElementById('initial-content');
    const formContent = document.getElementById('form-content');
    const membershipForm = document.getElementById('membership-form');
    const successContent = document.getElementById('success-content');

    // Handle "Apply for Membership" click
    applyBtn.addEventListener('click', () => {
        // Remove animation class so CSS transitions can take over
        initialContent.classList.remove('fade-in-on-load');

        // Stop CSS animations on text so JS opacity transition works smoothly
        const tagline = document.querySelector('.tagline');
        const secondaryLine = document.querySelector('.secondary-line');
        const microDivider = document.querySelector('.micro-divider');

        [tagline, secondaryLine, microDivider].forEach(el => {
            if(el) {
                el.style.animation = 'none';
                el.style.transition = 'opacity 0.4s ease-out';
                el.style.opacity = '0';
            }
        });

        // Get target dimensions from the form content
        formContent.style.visibility = 'hidden';
        formContent.style.display = 'flex'; // Ensure it has dimensions
        const formRect = formContent.getBoundingClientRect();
        formContent.style.display = '';
        formContent.style.visibility = '';

        // 1. Start the button expansion visual effect physically
        applyBtn.style.width = formRect.width + 'px';
        applyBtn.style.height = formRect.height + 'px';
        applyBtn.classList.add('expanding');

        setTimeout(() => {
            // 3. Fade out the rest of the initial container
            initialContent.classList.remove('active');

            // Wait for fade out transition
            setTimeout(() => {
                // Reset button styles just in case it's needed again
                applyBtn.style.width = '';
                applyBtn.style.height = '';
                applyBtn.classList.remove('expanding');

                // 4. Fade in form content smoothly
                formContent.classList.add('active');

                // Focus the first input field for accessibility
                setTimeout(() => {
                    document.getElementById('email').focus();
                }, 100);
            }, 400);
        }, 400); // Wait for the physical expansion to mostly complete
    });

    // Handle form submission
    membershipForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        // Fade out form content
        formContent.classList.remove('active');

        // Wait for fade out transition
        setTimeout(() => {
            // Fade in success content
            successContent.classList.add('active');
        }, 800);
    });
});
