document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const loginButton = document.querySelector('.login-btn');

    loginButton.addEventListener('click', function(event) {
        event.preventDefault(); // Останавливаем стандартное поведение кнопки

        if (email.value && password.value) {
            // Если оба поля заполнены, переадресовываем на chat.html
            window.location.href = 'chat.html';
        } else {
            // Если поля не заполнены, выводим сообщение об ошибке
            alert('Пожалуйста, заполните все поля.');
        }
    });
});
