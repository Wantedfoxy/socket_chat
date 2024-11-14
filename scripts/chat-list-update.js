// Функция для отправки запроса с использованием Request API
async function getChatListService() {
    const url = `http://localhost:8080/v1/chat/list/?atoken=${atoken}`;

    // Создаем объект запроса с необходимыми параметрами
    const request = new Request(url, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json' // Заголовки
        }),
        mode: 'cors' // Используем CORS для запросов между доменами
    });

    try {
        // Выполняем запрос
        const response = await fetch(request);

        // Проверка статуса ответа
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json(); // Попытка распарсить JSON
        console.log('Данные, полученные от сервера:', data); // Выводим данные в консоль
        updateChatList(data.chats); // Обновляем список чатов
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Функция для обновления списка чатов
function updateChatList(chats) {
    const chatList = document.querySelector('.chat-list ul');
    chatList.innerHTML = '';

    chats.forEach(chat => {
        const li = document.createElement('li');
        li.classList.add('item');
        li.setAttribute('data-chat-id', chat.id); // Сохраняем ID в data-атрибуте

        const chatName = chat.name ? chat.name : 'Неизвестный пользователь';

        const span = document.createElement('span');
        span.classList.add('item-chat-name');
        span.textContent = `${chatName}`;

        const pointerDiv = document.createElement('div');
        pointerDiv.classList.add('item-chat-pointer');

        li.appendChild(span);
        li.appendChild(pointerDiv);
        chatList.appendChild(li);
    });

    // Перезапускаем поиск после добавления новых чатов
    const searchInput = document.querySelector('.search-input');
    searchInput.dispatchEvent(new Event('input')); // Инициируем событие input вручную для обновления поиска
}

// Функция для подключения к WebSocket с использованием async/await
async function connectWebSocket() {
    const socket = new WebSocket('ws://localhost:8080/echo');
    let chatData = [];

    // Ожидание подключения WebSocket
    await new Promise((resolve, reject) => {
        socket.addEventListener('open', function () {
            console.log('WebSocket соединение установлено.');
            resolve();
        });

        socket.addEventListener('error', function (event) {
            console.error('Ошибка WebSocket:', event);
            reject(new Error('Ошибка при установлении WebSocket соединения.'));
        });
    });

    // Функция для обработки сообщений через WebSocket
    socket.addEventListener('message', async function (event) {
        try {
            console.log('Получены данные через WebSocket:', event.data);
            const chat = JSON.parse(event.data);

            const chatName = chat.account1 === atoken ? chat.account2 : chat.account1;

            // Проверяем, есть ли уже такой чат в chatData
            const existingChat = chatData.find(c => c.id === chat.id);

            if (existingChat) {
                // Если чат существует, обновляем только время последнего сообщения
                existingChat.lastMessageTimestamp = chat.lastMessageTimestamp;
            } else {
                // Если чата нет, добавляем новый объект в chatData
                chatData.push({
                    name: chatName,
                    id: chat.id,
                    lastMessageTimestamp: chat.lastMessageTimestamp
                });
            }

            // Обновляем список чатов
            updateChatList(chatData);
        } catch (error) {
            console.error('Ошибка при обработке данных WebSocket:', error);
        }
    });

    // Обработка закрытия соединения
    socket.addEventListener('close', function () {
        console.log('WebSocket соединение закрыто.');
        setTimeout(connectWebSocket, 5000); // Переподключение через 5 секунд
    });
}

// Запускаем изначальный запрос и WebSocket при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    await getChatListService(); // Изначальный GET-запрос
    await connectWebSocket(); // Подключение к WebSocket
});
