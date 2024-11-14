// Элементы интерфейса
const messageInput = document.querySelector('.message');
const sendMessageButton = document.querySelector('.send-message-btn');
const contextMenu = document.querySelector('#context-menu');
const chatBox = document.querySelector('.chat-box ul');

// Текущий пользователь
const atoken = 'username1';

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

// Получаем ID текущего активного чата
function getActiveChatId() {
    const activeChatItem = document.querySelector('.chat-list ul .item.active');
    return activeChatItem ? activeChatItem.getAttribute('data-chat-id') : null;
}

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
    const messageInputData = messageInput.value.trim(); // Получаем текст из поля ввода

    if (messageInputData !== '') {
        let messageBoxClass = 'message-box';
        if (isShortResponse) {
            messageBoxClass += ' short';
        }

        // Создаем элемент сообщения, который будет добавлен в список
        const newMessageElement = document.createElement('li');
        newMessageElement.innerHTML = `
            <div class="${messageBoxClass}">
                <span class="sender-name">${atoken}</span>
                <span class="message-text">${messageInputData}</span>
            </div>
        `;

        // Добавляем элемент в список чатов до того, как отправим запрос
        chatBox.appendChild(newMessageElement);
        messageInput.value = ''; // Очищаем поле ввода после отправки
        messageInput.focus();
        chatBox.scrollTop = chatBox.scrollHeight; // Прокручиваем список вниз

        // Получаем текущий ID чата
        const chatId = getActiveChatId();

        if (chatId) {
            try {
                // Отправляем сообщение на сервер
                const response = await sendMessageToServer(chatId, messageInputData);

                if (response.status !== 'OK') {
                    // Если сервер вернул ошибку, отображаем ошибку и возвращаем текст в поле ввода
                    throw new Error('Ошибка при отправке сообщения на сервер');
                }
            } catch (error) {
                // Обработка ошибки: показываем сообщение об ошибке
                console.error('Ошибка отправки сообщения:', error);
                alert('Ошибка при отправке сообщения. Текст возвращен в поле ввода.');

                // Возвращаем текст в поле ввода, если отправка не удалась
                messageInput.value = messageInputData;
                chatBox.removeChild(newMessageElement); // Удаляем неотправленное сообщение
                messageInput.focus();
            }
        } else {
            console.error('Нет активного чата для отправки сообщения.');
            alert('Нет активного чата. Пожалуйста, выберите чат.');
        }

        if (isShortResponse) {
            addShortResponseButtons(newMessageElement.querySelector('.message-text'), messageInputData);
        }
    }
}


// Функция отправки сообщения на сервер через API
async function sendMessageToServer(chat, text) {
    try {
        const params = new URLSearchParams();
        params.append('chat', chat);
        params.append('text', text);

        const response = await fetch(`http://localhost:8080/v1/chat/send/text/?atoken=${atoken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString(),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Ошибка при отправке сообщения на сервер');
        }

        const result = await response.json();
        return result; // Возвращаем результат с сервера
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        throw error;
    }
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
        senderName: atoken,
        messageText: `Ответ на сообщение "${originalMessage}" ${responseText}`,
        time: timeString,
    };

    const newMessageElement = document.createElement('li');
    newMessageElement.innerHTML = `
        <div class="message-box">
            <span class="sender-name">${atoken}</span>
            <span class="message-text">${responseMessageData.messageText}</span>
        </div>
    `;

    chatBox.appendChild(newMessageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    const buttonContainer = document.querySelector('.response-buttons');
    if (buttonContainer) {
        buttonContainer.style.display = 'none';
    }
}

// Обработка нажатий кнопок в контекстном меню
document.querySelector('#short-response-btn').addEventListener('click', async function () {
    await chatMessageSendService(true);
    contextMenu.style.display = 'none';
});

document.querySelector('#full-response-btn').addEventListener('click', async function () {
    await chatMessageSendService(false);
    contextMenu.style.display = 'none';
});
