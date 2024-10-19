const messageInput = document.querySelector('.message');
const sendMessageButton = document.querySelector('.send-message-btn');
const contextMenu = document.querySelector('#context-menu');
const chatBox = document.querySelector('.chat-box ul');

// Показ контекстного меню при правом клике
sendMessageButton.addEventListener('contextmenu', function (event) {
    event.preventDefault(); // Отменяем стандартное контекстное меню
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
});

// Закрываем контекстное меню при клике вне него
window.addEventListener('click', function (event) {
    if (event.target !== contextMenu && !contextMenu.contains(event.target)) {
        contextMenu.style.display = 'none';
    }
});

// Отправка сообщения при нажатии на кнопку отправки левой кнопкой мыши
sendMessageButton.addEventListener('click', async function () {
    await chatMessageSendService(false); // Отправляем сообщение без контекста короткого ответа
});

// Обработчик отправки сообщения при нажатии Enter
messageInput.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        await chatMessageSendService(false); // Отправляем сообщение с полным ответом по Enter
    }
});

// Функция для отправки сообщения
async function chatMessageSendService(isShortResponse = false) {
    const messageInputData = messageInput.value.trim();

    if (messageInputData !== '') {
        const currentTime = new Date();
        const timeString = currentTime.getHours() + ':' + currentTime.getMinutes().toString().padStart(2, '0');

        // Добавляем классы в зависимости от типа ответа
        let messageBoxClass = 'message-box';
        if (isShortResponse) {
            messageBoxClass += ' short'; // Если короткий ответ, добавляем класс short
        }

        const newMessageElement = document.createElement('li');
        newMessageElement.innerHTML = `
            <div class="${messageBoxClass}">
                <span class="sender-name">You</span>
                <span class="message-text">${messageInputData}</span>
                <span class="send-message-time">${timeString}</span>
            </div>
        `;

        chatBox.appendChild(newMessageElement);
        messageInput.value = ''; // Очищаем поле после отправки
        messageInput.focus(); // Фокус на поле ввода
        chatBox.scrollTop = chatBox.scrollHeight; // Прокрутка вниз

        // Если короткий ответ, показываем кнопки "Да", "Нет", "Хорошо" внутри message-text
        if (isShortResponse) {
            addShortResponseButtons(newMessageElement.querySelector('.message-text'), messageInputData);
        }
    }
}

// Функция отправки данных сообщения на сервер
async function httpClientPost(messageData) {
    // В дальнейшем можно добавить реальную отправку данных на сервер
    return messageData;
}

// Функция добавления кнопок для короткого ответа
function addShortResponseButtons(messageTextElement, originalMessage) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('response-buttons');

    const buttons = ['Да', 'Нет', 'Хорошо'];
    buttons.forEach(text => {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', async function () {
            await sendMessageWithButtonResponse(text, originalMessage);
        });
        buttonContainer.appendChild(button);
    });

    messageTextElement.appendChild(buttonContainer);
}

// Функция для отправки короткого ответа и скрытия кнопок
async function sendMessageWithButtonResponse(responseText, originalMessage) {
    const currentTime = new Date();
    const timeString = currentTime.getHours() + ':' + currentTime.getMinutes().toString().padStart(2, '0');

    const responseMessageData = {
        senderName: 'You',
        messageText: `Ответ на сообщение "${originalMessage}" ${responseText}`,
        time: timeString,
    };

    // Создаем новый элемент сообщения, где будет текст ответа на вопрос
    const newMessageElement = document.createElement('li');
    newMessageElement.innerHTML = `
        <div class="message-box">
            <span class="sender-name">You</span>
            <span class="message-text">${responseMessageData.messageText}</span>
            <span class="send-message-time">${responseMessageData.time}</span>
        </div>
    `;

    chatBox.appendChild(newMessageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Прокрутка вниз

    // Скрываем кнопки после нажатия
    const buttonContainer = document.querySelector('.response-buttons');
    if (buttonContainer) {
        buttonContainer.style.display = 'none';
    }
}

// Обработка нажатий кнопок в контекстном меню
document.querySelector('#short-response-btn').addEventListener('click', async function () {
    await chatMessageSendService(true); // Отправляем сообщение с коротким ответом
    contextMenu.style.display = 'none'; // Скрываем меню
});

document.querySelector('#full-response-btn').addEventListener('click', async function () {
    await chatMessageSendService(false); // Отправляем обычное сообщение
    contextMenu.style.display = 'none'; // Скрываем меню
});
