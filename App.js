// chat screen control
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.chats-container');
    const screens = Array.from(document.querySelectorAll('.chat-screen'));
    const links = document.querySelectorAll('[data-target]');
    const backButtons = document.querySelectorAll('.fa-chevron-left');

    let currentIndex = 0; // Current screen index
    const screenWidth = 21.5; // Percentage for each screen width (adjustable)

    // Function to navigate forward (next clip-path)
    function updateNextClipPath() {
        if (currentIndex < screens.length - 1) {
            currentIndex++; // Move to the next screen
            updateContainerPosition();
            adjustClipPath("next");
        }
    }

    // Function to navigate backward (last clip-path)
    function updateLastClipPath() {
        if (currentIndex > 0) {
            currentIndex--; // Move to the previous screen
            updateContainerPosition();
            adjustClipPath("last");
        }
    }

    // Function to update transform property
    function updateContainerPosition() {
        const translateX = -screenWidth * currentIndex; // Move container
        container.style.transform = `translateX(${translateX}%)`;
    }

    // Function to adjust clip-path values
    function adjustClipPath(direction) {
        let leftClip, rightClip;

        if (direction === "next") {
            leftClip = currentIndex * screenWidth;
            rightClip = 100 - (currentIndex + 1) * screenWidth;
        } else if (direction === "last") {
            leftClip = currentIndex * screenWidth;
            rightClip = 100 - (currentIndex + 1) * screenWidth;
        }

        // Update clip-path on the container
        container.style.clipPath = `inset(0% ${rightClip}% 0% ${leftClip}%)`;
    }

    // Add event listeners for hyperlinks
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            updateNextClipPath();
        });
    });

    // Add event listeners for back chevron buttons
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateLastClipPath();
        });
    });

    // Initialize clip-path for the first screen
    adjustClipPath("next");
});

// media modal control
document.addEventListener('DOMContentLoaded', () => {
    const chatsContainer = document.querySelector('.chats-container');
    const mediaModal = document.getElementById('media-modal');
    const mediaContent = document.querySelector('.media-content'); // Container for media
    const closeButton = document.getElementById('close-modal');

    let animationFrame;

    // Easing Function (Ease-In-Out Cubic)
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Function to animate modal and blur effect
    function animateModal(opening, mediaElement) {
        const duration = 500;
        const startTime = performance.now();

        function step(currentTime) {
            const elapsedTime = currentTime - startTime;
            let t = Math.min(elapsedTime / duration, 1);
            t = opening ? easeInOutCubic(t) : 1 - easeInOutCubic(t);

            // Apply blur and modal animations
            chatsContainer.style.filter = `blur(${t * 10}px)`;
            mediaElement.style.transform = `scale(${0.9 + t * 0.1})`;
            mediaElement.style.opacity = t;

            if ((opening && t < 1) || (!opening && t > 0)) {
                animationFrame = requestAnimationFrame(step);
            } else {
                cancelAnimationFrame(animationFrame);
                if (!opening) {
                    mediaModal.style.display = 'none'; // Hide modal after closing animation
                    mediaContent.innerHTML = ''; // Clear modal content
                }
            }
        }

        animationFrame = requestAnimationFrame(step);
    }

    // Function to open the modal for images or videos
    function openMediaModal(mediaSrc, type) {
        mediaModal.style.display = 'flex';

        let mediaElement;
        if (type === 'video') {
            // Create video element dynamically
            mediaElement = document.createElement('video');
            mediaElement.src = mediaSrc;
            mediaElement.controls = true; // Add video controls
            mediaElement.autoplay = true; // Auto-play video
        } else {
            // Create image element dynamically
            mediaElement = document.createElement('img');
            mediaElement.src = mediaSrc;
        }

        mediaElement.style.opacity = 0; // Start fully transparent
        mediaElement.style.transform = 'scale(0.9)'; // Start slightly smaller
        mediaElement.style.transition = 'none';

        // Append media to the modal content container
        mediaContent.innerHTML = '';
        mediaContent.appendChild(mediaElement);

        animateModal(true, mediaElement);
    }

    // Function to close the modal
    function closeMediaModal() {
        const mediaElement = mediaContent.firstChild;
        if (mediaElement.tagName.toLowerCase() === 'video') {
            mediaElement.pause(); // Stop video playback
        }
        animateModal(false, mediaElement);
    }

    // Add event listeners for images and videos inside messages
    const mediaElements = document.querySelectorAll('.messages .message img, .messages .message video');
    mediaElements.forEach(media => {
        media.addEventListener('click', (e) => {
            const mediaType = e.target.tagName.toLowerCase();
            openMediaModal(e.target.src, mediaType);
        });
    });

    // Event listener for close button
    closeButton.addEventListener('click', closeMediaModal);

    // Close modal when clicking outside modal content
    mediaModal.addEventListener('click', (e) => {
        if (e.target === mediaModal) {
            closeMediaModal();
        }
    });
});

// fade overlay
document.addEventListener('DOMContentLoaded', () => {
    const fadeOverlay = document.getElementById('fade-overlay');
    const fadeLinks = document.querySelectorAll('a[data-target="fadeOut"]');

    // Function to handle fade-out and redirect
    function fadeOutAndRedirect(targetUrl) {
        fadeOverlay.style.transition = 'opacity 1s ease-in-out';
        fadeOverlay.style.opacity = '1'; // Fade to black

        setTimeout(() => {
            window.location.href = targetUrl; // Navigate after fade-out
        }, 1000); // Match the transition duration (1s)
    }

    // Attach fade-out behavior to links
    fadeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default navigation
            const targetUrl = link.getAttribute('href');
            fadeOutAndRedirect(targetUrl); // Trigger fade-out
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const fadeOverlay = document.getElementById('fade-overlay');

    // Start with overlay fully black
    fadeOverlay.style.opacity = '1';

    // Fade-in to reveal the page
    setTimeout(() => {
        fadeOverlay.style.transition = 'opacity 1s ease-in-out';
        fadeOverlay.style.opacity = '0'; // Fade to visible content
    }, 100); // Small delay to ensure the transition works
});
