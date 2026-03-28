const fs = require('fs');

// 1. Update script.js
let scriptCode = fs.readFileSync('script.js', 'utf8');

scriptCode = scriptCode.replace(
    `    // Handle "Apply for Membership" click
    applyBtn.addEventListener('click', () => {
        // 1. Start the button expansion visual effect
        applyBtn.classList.add('expanding');

        // Remove animation class so CSS transitions can take over
        initialContent.classList.remove('fade-in-on-load');

        // 2. Fade out text elements in initial content slightly before button
        document.querySelector('.tagline').style.opacity = '0';
        document.querySelector('.secondary-line').style.opacity = '0';

        setTimeout(() => {
            // 3. Fade out the rest of the initial container
            initialContent.classList.remove('active');

            // Wait for fade out transition
            setTimeout(() => {
                // 4. Fade in form content smoothly
                formContent.classList.add('active');

                // Focus the first input field for accessibility
                setTimeout(() => {
                    document.getElementById('email').focus();
                }, 100);
            }, 500); // Shorter delay since button expansion bridges the gap
        }, 300);
    });`,
    `    // Handle "Apply for Membership" click
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
    });`
);

fs.writeFileSync('script.js', scriptCode);

// 2. Update styles.css
let cssCode = fs.readFileSync('styles.css', 'utf8');

cssCode = cssCode.replace(
    `.cta-button.expanding {
    color: transparent;
    border-color: transparent;
    background-color: transparent;
    transform: translateY(0); /* reset hover transform */
    transition: all var(--transition-slow);
}`,
    `.cta-button.expanding {
    color: transparent;
    border-color: transparent;
    background-color: transparent;
    transform: translateY(0); /* reset hover transform */
    transition: width 0.6s cubic-bezier(0.25, 0.1, 0.25, 1),
                height 0.6s cubic-bezier(0.25, 0.1, 0.25, 1),
                color 0.3s ease-out,
                border-color 0.6s ease-out,
                background-color 0.6s ease-out;
    cursor: default;
}`
);

fs.writeFileSync('styles.css', cssCode);

console.log("Patched animation logic");
