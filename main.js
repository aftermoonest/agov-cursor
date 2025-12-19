import viewUrl from './cursor-view.webp';
import nextUrl from './cursor-next.webp';

(function initCursor() {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        /* Ensure ALL elements hide cursor when active */
        body.cursor-active,
        body.cursor-active * {
            cursor: none !important;
        }

        .custom-cursor-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 150px; 
            height: 150px;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            display: none; /* Hidden by default */
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease;
            will-change: transform, opacity;
        }
        
        /* Show when active and loaded */
        .custom-cursor-container.is-visible.is-loaded {
            display: flex;
            opacity: 1;
        }

        .custom-cursor-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transform: scale(1);
            transition: transform 0.3s ease;
            will-change: transform;
            backface-visibility: hidden;
        }

        /* Scale up when visible */
        .custom-cursor-container.is-visible img {
            transform: scale(1.5);
        }
    `;
    document.head.appendChild(style);

    // 2. Create DOM Elements for each cursor
    const createCursor = (id, url) => {
        const container = document.createElement('div');
        container.id = `custom-cursor-${id}`;
        container.className = 'custom-cursor-container';

        const img = document.createElement('img');
        img.src = url;
        img.alt = `Custom Cursor ${id}`;
        img.onload = () => container.classList.add('is-loaded');

        container.appendChild(img);
        document.body.appendChild(container);
        return container;
    };

    const cursors = {
        view: {
            el: createCursor('view', viewUrl),
            class: 'cursor-view'
        },
        next: {
            el: createCursor('next', nextUrl),
            class: 'cursor-next'
        }
    };

    // 3. State
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    const LERP_FACTOR = 0.15;
    let activeCursorKey = null;

    // 4. Event Listeners
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const hideAllCursors = () => {
        activeCursorKey = null;
        document.body.classList.remove('cursor-active');
        Object.values(cursors).forEach(c => c.el.classList.remove('is-visible'));
    };

    const handleMouseOver = (e) => {
        // Find which target we are in
        let targetKey = null;
        let targetContainer = null;

        for (const key in cursors) {
            targetContainer = e.target.closest(`.${cursors[key].class}`);
            if (targetContainer) {
                targetKey = key;
                break;
            }
        }

        if (targetKey) {
            const excludedElement = e.target.closest('a, button, input, select, textarea, [role="button"]');
            const isExcluded = excludedElement &&
                excludedElement !== targetContainer &&
                targetContainer.contains(excludedElement);

            if (isExcluded) {
                hideAllCursors();
            } else {
                // Show specific cursor
                if (activeCursorKey !== targetKey) {
                    hideAllCursors(); // Hide previous if any
                    activeCursorKey = targetKey;
                    document.body.classList.add('cursor-active');
                    cursors[targetKey].el.classList.add('is-visible');
                }
            }
        } else {
            hideAllCursors();
        }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) hideAllCursors();
    });

    // 5. Animation Loop
    function animate() {
        cursorX += (mouseX - cursorX) * LERP_FACTOR;
        cursorY += (mouseY - cursorY) * LERP_FACTOR;

        if (activeCursorKey) {
            cursors[activeCursorKey].el.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }

        requestAnimationFrame(animate);
    }

    animate();

})();