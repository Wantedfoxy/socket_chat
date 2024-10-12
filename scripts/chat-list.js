document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.chat-list .item');

    items.forEach(item => {
        item.addEventListener('click', function() {
            // Удаляем класс 'active' у всех элементов
            items.forEach(i => i.classList.remove('active'));
            // Добавляем класс 'active' к текущему элементу
            this.classList.add('active');
        });
    });
});
