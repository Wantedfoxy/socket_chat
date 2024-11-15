document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.querySelector('.chat-list');
    const chatBox = document.querySelector('.chat-box');

    // Делегирование событий
    chatList.addEventListener('click', async function(event) {
        const clickedItem = event.target.closest('.item');
        if (!clickedItem) return; // Клик был не по элементу .item

        // Удаляем класс 'active' у всех элементов
        const items = chatList.querySelectorAll('.item');
        items.forEach(item => item.classList.remove('active'));

        // Добавляем класс 'active' к текущему элементу
        clickedItem.classList.add('active');

        // Извлечение идентификатора чата (например, из атрибута data-chat-id)
        const chatId = clickedItem.getAttribute('data-chat-id');
        const atoken = 'username1'; // Текущий пользователь

        if (!chatId || !atoken) return; // Проверяем наличие необходимых данных

        // Вызов функции для получения сообщений чата
        await fetchChatMessages(chatId, atoken);
    });

    // Функция для получения сообщений чата с сервера
    async function fetchChatMessages(chatId, atoken) {
        try {
            // Формируем URL с параметрами
            const url = `http://localhost:8080/v1/chat/messages/list/?atoken=${atoken}&chat=${chatId}&offset=0&limit=20`;

            // Отправляем GET-запрос
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "OK") {
                displayMessages(data.messages);
            } else {
                console.error("Ошибка получения сообщений:", data);
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }
    }

    // Функция для отображения списка сообщений
    function displayMessages(messages) {
        const messageList = chatBox.querySelector('ul'); // Используем существующий ul внутри chatBox

        // Очищаем список перед добавлением новых сообщений
        messageList.innerHTML = '';

        messages.forEach(message => {
            // Создаем элемент li для каждого сообщения
            const listItem = document.createElement('li');

            // Создаем элемент div для сообщения
            const messageElement = document.createElement('div');
            messageElement.classList.add('message-box'); // Добавляем класс для сообщения

            // Создаем элемент span для имени отправителя
            const senderName = document.createElement('span');
            senderName.classList.add('sender-name');
            senderName.textContent = atoken; // Здесь можно поставить имя отправителя

            // Создаем элемент span для текста сообщения
            const messageText = document.createElement('span');
            messageText.classList.add('message-text');
            messageText.textContent = message.text; // Отображаем текст сообщения

            // Добавляем все элементы внутрь div
            messageElement.appendChild(senderName);
            messageElement.appendChild(messageText);

            // Добавляем div внутрь li
            listItem.appendChild(messageElement);

            // Добавляем li в messageList (существующий ul)
            messageList.appendChild(listItem);
        });

        // Прокручиваем список вниз
        messageList.scrollTop = messageList.scrollHeight;
    }
});
