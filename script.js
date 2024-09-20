const bubbleGrid = document.getElementById('bubble-grid');
const modal = document.getElementById('modal');
const descriptionInput = document.getElementById('bubble-description');
const colorInput = document.getElementById('bubble-color');
const titleInput = document.getElementById('bubble-title');
const saveButton = document.getElementById('save-bubble');
const closeButton = document.getElementById('close-modal');

let activeBubble = null;

// Function to save bubble data to localStorage
function saveToLocalStorage(bubbleId, title, description, color) {
    const bubbleData = {
        title: title,
        description: description,
        color: color
    };
    localStorage.setItem(bubbleId, JSON.stringify(bubbleData));
}

// Function to load bubble data from localStorage
function loadFromLocalStorage() {
    for (let i = 1; i <= 60; i++) {
        const bubble = document.getElementById(`bubble-${i}`);
        const bubbleData = JSON.parse(localStorage.getItem(`bubble-${i}`));
        if (bubbleData) {
            bubble.setAttribute('data-title', bubbleData.title);
            bubble.setAttribute('data-description', bubbleData.description);
            bubble.style.backgroundColor = bubbleData.color;

            const titleSpan = bubble.querySelector('span');
            titleSpan.textContent = bubbleData.title;  // Set the title text
        }
    }
}

// Dynamically create 60 bubbles
for (let i = 1; i <= 60; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.id = `bubble-${i}`;
    bubble.setAttribute('data-title', '');
    bubble.setAttribute('data-description', '');
    bubble.style.backgroundColor = '#ccc';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = '';
    bubble.appendChild(titleSpan);

    bubble.addEventListener('click', () => openModal(bubble));
    bubbleGrid.appendChild(bubble);
}

// Function to open the modal with animation
function openModal(bubble) {
    activeBubble = bubble;

    const currentTitle = activeBubble.getAttribute('data-title') || '';
    const currentDescription = activeBubble.getAttribute('data-description') || '';
    const currentColor = activeBubble.style.backgroundColor || '#ffffff';

    titleInput.value = currentTitle;
    descriptionInput.value = currentDescription;
    colorInput.value = rgbToHex(currentColor);

    const bubbleRect = activeBubble.getBoundingClientRect();

    // Position the modal over the bubble
    modal.style.top = `${bubbleRect.top + window.scrollY}px`;
    modal.style.left = `${bubbleRect.left + window.scrollX}px`;

    // Start modal size same as bubble
    modal.style.width = `${bubbleRect.width}px`;
    modal.style.height = `${bubbleRect.height}px`;
    modal.style.borderRadius = '50%';
    modal.style.display = 'block';  // Ensure modal is visible
    
    // Animate modal expanding
    modal.classList.add('open');
    setTimeout(() => {
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.width = '400px';  // Expands
        modal.style.height = '400px';
        modal.style.transform = 'translate(-50%, -50%)';  // Center it
    }, 100);  // Delay to trigger the animation
}

// Save bubble details and animate modal closing
saveButton.addEventListener('click', () => {
    const newTitle = titleInput.value;
    const newDescription = descriptionInput.value;
    const newColor = colorInput.value;

    activeBubble.setAttribute('data-title', newTitle);
    activeBubble.setAttribute('data-description', newDescription);
    activeBubble.style.backgroundColor = newColor;

    const titleSpan = activeBubble.querySelector('span');
    titleSpan.textContent = newTitle;  // Set the title text

    // Save to localStorage
    saveToLocalStorage(activeBubble.id, newTitle, newDescription, newColor);

    closeModal();
});

// Animate modal back into the bubble on close
function closeModal() {
    const bubbleRect = activeBubble.getBoundingClientRect();

    modal.style.top = `${bubbleRect.top + window.scrollY}px`;
    modal.style.left = `${bubbleRect.left + window.scrollX}px`;
    modal.style.width = `${bubbleRect.width}px`;
    modal.style.height = `${bubbleRect.height}px`;

    setTimeout(() => {
        modal.classList.remove('open');
        modal.style.display = 'none';  // Ensure modal is hidden after closing
        activeBubble = null;  // Reset active bubble so new bubbles can be clicked
    }, 400);  // Close after animation
}

// Close modal without saving
closeButton.addEventListener('click', closeModal);

// Convert RGB to HEX for color input
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    return `#${((1 << 24) + (parseInt(rgbValues[0]) << 16) + (parseInt(rgbValues[1]) << 8) + parseInt(rgbValues[2])).toString(16).slice(1)}`;
}
function randomVibration() {
    const bubbles = document.querySelectorAll('.bubble');
    
    bubbles.forEach(bubble => {
        const randomX = Math.random() * 2 - 1;  // Random value between -1 and 1
        const randomY = Math.random() * 2 - 1;  // Random value between -1 and 1
        
        // Apply small random translations
        bubble.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });
}

// Call the randomVibration function every 100ms
setInterval(randomVibration, 100);

document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.bubble');
    
    bubbles.forEach(bubble => {
        const randomDelay = Math.random() * 2;  // Generate a random delay between 0 and 2 seconds
        bubble.style.animationDelay = `${randomDelay}s`;  // Apply random delay
    });
});



// Load the saved bubble data on page load
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);
document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.bubble');
    const attractionRadius = 200;  // Max distance (in px) where attraction will happen
    const attractionStrength = 50; // Max translation distance for the bubbles (in px)
    
    // Store initial positions of bubbles
    const bubblePositions = [];

    bubbles.forEach((bubble, index) => {
        const bubbleRect = bubble.getBoundingClientRect();
        bubblePositions[index] = {
            x: bubbleRect.left + bubbleRect.width / 2,
            y: bubbleRect.top + bubbleRect.height / 2
        };
    });

    // Track mouse movement
    document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // For each bubble, calculate the distance to the cursor
        bubbles.forEach((bubble, index) => {
            const bubbleCenterX = bubblePositions[index].x;
            const bubbleCenterY = bubblePositions[index].y;

            // Calculate the distance between the cursor and the center of the bubble
            const distanceX = mouseX - bubbleCenterX;
            const distanceY = mouseY - bubbleCenterY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            // If the cursor is within the attraction radius, apply a translation
            if (distance < attractionRadius) {
                const strength = (1 - distance / attractionRadius) * attractionStrength;
                const translateX = (distanceX / distance) * strength;
                const translateY = (distanceY / distance) * strength;

                // Apply translation based on original position
                bubble.style.transform = `translate(${translateX}px, ${translateY}px)`;
            } else {
                // Return to original position if out of radius
                bubble.style.transform = `translate(0, 0)`;
            }
        });
    });
});
