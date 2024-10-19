document.addEventListener('DOMContentLoaded', function () {
    // Находим поле ввода поиска и список чатов
    const searchInput = document.querySelector('.search-input');
    const chatItems = document.querySelectorAll('.chat-list .item');

    // Добавляем обработчик события для отслеживания ввода текста
    searchInput.addEventListener('input', function () {
        const searchText = searchInput.value.toLowerCase(); // Преобразуем введенный текст в нижний регистр для поиска

        // Проходим по каждому элементу списка чатов
        chatItems.forEach(function (item) {
            const chatName = item.querySelector('.item-chat-name').textContent.toLowerCase(); // Получаем имя чата

            // Если имя чата содержит текст из поиска, показываем элемент, иначе скрываем
            if (chatName.includes(searchText)) {
                item.style.display = ''; // Показываем элемент
            } else {
                item.style.display = 'none'; // Скрываем элемент
            }
        });
    });
});
