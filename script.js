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

        // Fade out initial content
        initialContent.classList.remove('active');

        // Wait for fade out transition (0.8s as defined in CSS --transition-slow)
        setTimeout(() => {
            // Fade in form content
            formContent.classList.add('active');

            // Focus the first input field for accessibility
            setTimeout(() => {
                document.getElementById('email').focus();
            }, 100);
        }, 800);
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
