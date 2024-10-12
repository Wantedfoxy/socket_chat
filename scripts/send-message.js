const messageInput = document.querySelector('.message');
const sendMessageButton = document.querySelector('.send-message-btn');

function sendMessage() {
    const message = messageInput.value;
    const chatBox = document.querySelector('.chat-box ul');

    if (message.trim() !== '') {
        const newMessageElement = document.createElement('li');
        const currentTime = new Date();
        const timeString = currentTime.getHours() + ':' + currentTime.getMinutes().toString().padStart(2, '0');

        newMessageElement.innerHTML = `
            <div class="message-box">
                <span class="sender-name">You</span>
                <span class="message-text">${message}</span>
                <span class="send-message-time">${timeString}</span>
            </div>
        `;
        chatBox.appendChild(newMessageElement);
        messageInput.value = ''; // Clear input after sending
        messageInput.focus(); // Keep focus in input field
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
}

sendMessageButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
