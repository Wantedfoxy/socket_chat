document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.querySelector('.chat-list');

    // Делегирование событий
    chatList.addEventListener('click', function(event) {
        const clickedItem = event.target.closest('.item');
        if (!clickedItem) return; // Клик был не по элементу .item

        // Удаляем класс 'active' у всех элементов
        const items = chatList.querySelectorAll('.item');
        items.forEach(item => item.classList.remove('active'));

        // Добавляем класс 'active' к текущему элементу
        clickedItem.classList.add('active');
    });
});