const atoken = 'username1'; // Текущий пользователь

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

    // Функция для обработки сообщений через WebSocket с использованием async/await
    socket.addEventListener('message', async function (event) {
        try {
            console.log('Получены данные через WebSocket:', event.data);
            const chat = JSON.parse(event.data);

            const chatName = chat.account1 === atoken ? chat.account2 : chat.account1;

            const existingChat = chatData.find(c => c.id === chat.id);
            if (existingChat) {
                existingChat.lastMessageTimestamp = chat.lastMessageTimestamp;
            } else {
                chatData.push({
                    name: chatName,
                    id: chat.id,
                    lastMessageTimestamp: chat.lastMessageTimestamp
                });
            }

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

// Запускаем тестовый запрос и WebSocket при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    await getChatListService(); // Изначальный GET-запрос
    await connectWebSocket(); // Подключение к WebSocket
});
