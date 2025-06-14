document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const notification = document.createElement('div');
    
    // Настройка уведомления
    notification.id = 'form-notification';
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg opacity-0 transition-opacity duration-300 z-50';
    notification.textContent = 'Сообщение отправлено!';
    document.body.appendChild(notification);

    // Функция показа уведомления
    const showNotification = () => {
        notification.classList.remove('opacity-0');
        notification.classList.add('opacity-100');
        setTimeout(() => {
            notification.classList.remove('opacity-100');
            notification.classList.add('opacity-0');
        }, 3000); // Уведомление исчезает через 3 секунды
    };

    // Обработка отправки формы
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Показать уведомление мгновенно
        showNotification();

        // Блокировать кнопку и форму
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
        form.querySelectorAll('input, select, textarea').forEach(input => input.disabled = true);

        // Получить reCAPTCHA токен и отправить данные
        grecaptcha.ready(() => {
            grecaptcha.execute('6Lcqb1orAAAAADar8bV0KX5UEjTQluGarQmDqriS', {action: 'submit'}).then((token) => {
                const data = {
                    name: form.querySelector('#name').value,
                    siteType: form.querySelector('#site-type').value,
                    phone: form.querySelector('#phone').value,
                    message: form.querySelector('#message').value,
                    agree: form.querySelector('#consent').checked,
                    'recaptcha-token': token
                };

                // Отправка данных в фоновом режиме
                fetch('https://script.google.com/macros/s/AKfycbxJZshCO_DLpIIzl2bcNeKvRvmwN3MG-fRoaWSLtvLMrqul5wpWf7ZOvVIuYBEik7Ss/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(() => {
                    // Очистить форму после успешной отправки
                    form.reset();
                }).catch((error) => {
                    console.error('Ошибка отправки:', error);
                    // Не показываем ошибку пользователю, так как уведомление уже показано
                }).finally(() => {
                    // Разблокировать форму и кнопку
                    submitButton.disabled = false;
                    submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
                    form.querySelectorAll('input, select, textarea').forEach(input => input.disabled = false);
                });
            }).catch((error) => {
                console.error('Ошибка reCAPTCHA:', error);
                // Разблокировать форму в случае ошибки reCAPTCHA
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
                form.querySelectorAll('input, select, textarea').forEach(input => input.disabled = false);
            });
        });
    });
});