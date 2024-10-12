document.querySelector('.group-mailing-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default action
    const popup = document.getElementById('popup');
    // Show the popup first to compute its dimensions
    popup.style.display = 'flex';
    // Calculate position after a short delay to ensure dimensions are set
    setTimeout(() => {
        const buttonRect = event.target.getBoundingClientRect();
        const topPosition = buttonRect.top - popup.offsetHeight - 20;
        const leftPosition = buttonRect.left + (buttonRect.width / 2) - (popup.offsetWidth / 2);
        popup.style.top = `${topPosition}px`;
        popup.style.left = `${leftPosition}px`;
    }, 0); // 0 ms delay to let the browser finish processing the layout
});

document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});