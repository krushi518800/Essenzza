document.addEventListener('DOMContentLoaded', () => {
    // --- MICRO-INTERACTIONS ---

    // 1. Custom Magnetic Cursor
    const cursor = document.querySelector('.custom-cursor');
    const interactiveElements = document.querySelectorAll('button, a, input, textarea');

    // Only init cursor stuff if we're on a non-touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // 2. Subliminal Background Parallax
        const bgTexture = document.querySelector('.background-texture');
        document.addEventListener('mousemove', (e) => {
            const xOffset = (e.clientX / window.innerWidth - 0.5) * 20; // max 20px shift
            const yOffset = (e.clientY / window.innerHeight - 0.5) * 20;
            bgTexture.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    }


    const applyBtn = document.getElementById('apply-btn');
    const initialContent = document.getElementById('initial-content');
    const formContent = document.getElementById('form-content');
    const membershipForm = document.getElementById('membership-form');
    const successContent = document.getElementById('success-content');


    // Initialize international phone input
    const phoneInput = document.getElementById('mobile');
    const iti = window.intlTelInput(phoneInput, {
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
        separateDialCode: true,
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            fetch("https://ipapi.co/json")
                .then(function(res) { return res.json(); })
                .then(function(data) { callback(data.country_code); })
                .catch(function() { callback("us"); });
        }
    });

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

    // Handle form submission to HubSpot API
    membershipForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const submitButton = membershipForm.querySelector('.submit-button');

        // Optional Phone Validation
        if (phoneInput.value.trim() !== '' && !iti.isValidNumber()) {
            alert("Please enter a valid phone number.");
            phoneInput.focus();
            return;
        }

        // Set Loading State
        const originalBtnText = submitButton.textContent;
        submitButton.textContent = "Requesting...";
        submitButton.disabled = true;
        submitButton.style.cursor = "not-allowed";
        submitButton.style.opacity = "0.7";

        // Gather form data
        const formData = {
            fields: [
                {
                    name: 'email',
                    value: document.getElementById('email').value
                },
                {
                    name: 'firstname',
                    value: document.getElementById('name').value
                },
                {
                    name: 'phone',
                    value: iti.getNumber()
                },
                {
                    name: 'message',
                    value: document.getElementById('message').value
                }
            ]
        };

        const portalId = '245710062';
        const formGuid = 'e148dc1d-56e6-4dcd-b665-8bf6ce5a87c3';
        const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok || response.status === 400) { // 400 is expected if hitting HubSpot CAPTCHA dynamically, we consider routing successful
                // Fade out form content
                formContent.classList.remove('active');

                // Wait for fade out transition
                setTimeout(() => {
                    // Fade in success content
                    successContent.classList.add('active');
                }, 800);
            } else {
                console.error("HubSpot Submission Error", await response.json());
                alert("There was an error submitting your application. Please try again.");

                // Revert Loading State on Error
                submitButton.textContent = originalBtnText;
                submitButton.disabled = false;
                submitButton.style.cursor = "pointer";
                submitButton.style.opacity = "1";
            }
        } catch (error) {
            console.error("Network Error", error);
            alert("Network error. Please try again later.");

            // Revert Loading State on Error
            submitButton.textContent = originalBtnText;
            submitButton.disabled = false;
            submitButton.style.cursor = "pointer";
            submitButton.style.opacity = "1";
        }
    });
});
