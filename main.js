import lottie from 'lottie-web/build/player/lottie_light';
import animationData from './cursor-hover.json';

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
        }
        
        /* Only show if active AND loaded */
        #custom-cursor-container.is-visible.is-loaded {
            opacity: 1;
        }

        #custom-cursor-container svg {
            width: 100%;
            height: 100%;
            transform: scale(1);
            transition: transform 0.3s ease;
        }

        /* Scale up when visible/active */
        #custom-cursor-container.is-visible svg {
            transform: scale(1.5);
        }
    `;
    document.head.appendChild(style);

    // 2. Create DOM Elements
    const cursorContainer = document.createElement('div');
    cursorContainer.id = 'custom-cursor-container';
    document.body.appendChild(cursorContainer);

    // 3. State & Logic
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    const LERP_FACTOR = 0.15;
    let isHovering = false;
    let isLoaded = false;
    let animationFrameId;

    // 3. Initialize Lottie
    const animation = lottie.loadAnimation({
        container: cursorContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData
    });

    // Listen for DOMLoaded to ensure it's ready to show
    animation.addEventListener('DOMLoaded', () => {
        isLoaded = true;
        cursorContainer.classList.add('is-loaded');
    });

    // 5. Event Listeners

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Handle Hover Logic
    // We want to activate ONLY when hovering specific elements
    // Handle Hover Logic
    const handleMouseOver = (e) => {
        // 1. Check if we are hovering a "Big Card" target
        const targetContainer = e.target.closest('.lottie-cursor-target');

        // 2. Check if we are hovering a "Normal Button" (which should be EXCLUDED)
        //    This includes links, buttons, inputs, etc.
        const excludedElement = e.target.closest('a, button, input, select, textarea, [role="button"]');

        if (targetContainer && !excludedElement) {
            // We are inside a target AND NOT on a button -> SHOW Custom Cursor
            isHovering = true;
            document.body.classList.add('cursor-active');
            cursorContainer.classList.add('is-visible');
        } else {
            // We are either:
            // a) Not in a target at all
            // b) Inside a target BUT on a button/link -> HIDE Custom Cursor (Show Default)
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