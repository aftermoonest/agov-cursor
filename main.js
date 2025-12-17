import cursorUrl from './cursor-hover.webp';

(function initCursor() {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        /* Ensure ALL elements hide cursor when active */
        body.cursor-active,
        body.cursor-active * {
            cursor: none !important;
        }

        #custom-cursor-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 200px; 
            height: 200px;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0; /* Hidden by default */
            transition: opacity 0.2s ease;
            will-change: transform, opacity;
        }
        
        /* Only show if active AND loaded */
        #custom-cursor-container.is-visible.is-loaded {
            opacity: 1;
        }

        #custom-cursor-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transform: scale(1);
            transition: transform 0.3s ease;
            /* Performance hints */
            will-change: transform;
            backface-visibility: hidden;
        }

        /* Scale up when visible/active */
        #custom-cursor-container.is-visible img {
            transform: scale(1.5);
        }
    `;
    document.head.appendChild(style);

    // 2. Create DOM Elements
    const cursorContainer = document.createElement('div');
    cursorContainer.id = 'custom-cursor-container';

    const cursorImage = document.createElement('img');
    cursorImage.src = cursorUrl;
    cursorImage.alt = "Custom Cursor";

    cursorContainer.appendChild(cursorImage);
    document.body.appendChild(cursorContainer);

    // 3. State & Logic
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    const LERP_FACTOR = 0.15;
    let isHovering = false;
    // let isLoaded = false; // logic handled by img.onload
    let animationFrameId;

    // 4. Loading Logic
    cursorImage.onload = () => {
        cursorContainer.classList.add('is-loaded');
    };

    // 5. Event Listeners

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Handle Hover Logic
    const handleMouseOver = (e) => {
        // 1. Check if we are hovering a "Big Card" target
        const targetContainer = e.target.closest('.lottie-cursor-target');

        // 2. Check if we are hovering a "Normal Button" (which should be EXCLUDED)
        //    This includes links, buttons, inputs, etc.
        const excludedElement = e.target.closest('a, button, input, select, textarea, [role="button"]');

        if (targetContainer) {
            // We are inside a target.
            // Logic: Exclude ONLY if we found an interactive element that is:
            // 1. NOT the target container itself (e.g. if the card is a link, keep custom cursor)
            // 2. INSIDE the target container (e.g. a button inside the card)

            const isExcluded = excludedElement &&
                excludedElement !== targetContainer &&
                targetContainer.contains(excludedElement);

            if (isExcluded) {
                // We are hovering a button INSIDE the card -> Hide custom cursor (Show Default)
                isHovering = false;
                document.body.classList.remove('cursor-active');
                cursorContainer.classList.remove('is-visible');
            } else {
                // We are hovering the card itself (even if it's a link) or content -> Show Custom Cursor
                isHovering = true;
                document.body.classList.add('cursor-active');
                cursorContainer.classList.add('is-visible');
            }
        } else {
            // We are not in a target at all
            isHovering = false;
            document.body.classList.remove('cursor-active');
            cursorContainer.classList.remove('is-visible');
        }
    };

    // We can use a global mouseover listener to delegate
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', (e) => {
        // When leaving the window or generic mouseout, we might want to re-check
        if (e.relatedTarget === null) {
            isHovering = false;
            document.body.classList.remove('cursor-active');
            cursorContainer.classList.remove('is-visible');
        }
    });

    // 6. Animation Loop
    function animate() {
        cursorX += (mouseX - cursorX) * LERP_FACTOR;
        cursorY += (mouseY - cursorY) * LERP_FACTOR;

        cursorContainer.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

})();