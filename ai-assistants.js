document.addEventListener('DOMContentLoaded', () => {
    const aiSelector = document.getElementById('aiSelector');
    const aiContainer = document.getElementById('aiContainer');
    const aiNotification = document.getElementById('aiNotification');

    // Функция переключения ассистентов
    const switchAI = (selectedAI) => {
        console.log(`Переключение на ассистента: ${selectedAI}`);
        const assistants = aiContainer.querySelectorAll('.card');
        assistants.forEach(assistant => {
            assistant.classList.add('hidden');
            assistant.classList.remove('opacity-100');
            assistant.classList.add('opacity-0');
        });

        const selectedAssistant = document.getElementById(`${selectedAI}Assistant`);
        if (selectedAssistant instanceof Element) {
            console.log(`Найден ассистент: ${selectedAI}Assistant`);
            selectedAssistant.classList.remove('hidden');
            setTimeout(() => {
                selectedAssistant.classList.remove('opacity-0');
                selectedAssistant.classList.add('opacity-100');
            }, 10); // Небольшая задержка для плавного перехода
        } else {
            console.error(`Ассистент с ID ${selectedAI}Assistant не найден!`);
        }
    };

    // Инициализация: показать Дизайн-Ассистента по умолчанию
    switchAI('design');

    // Обработчик выбора ассистента
    aiSelector.addEventListener('change', (event) => {
        switchAI(event.target.value);
    });

    // Функция показа уведомления
    function showAINotification() {
        aiNotification.classList.remove('opacity-0');
        aiNotification.classList.add('opacity-100');
        setTimeout(() => {
            aiNotification.classList.remove('opacity-100');
            aiNotification.classList.add('opacity-0');
        }, 3000); // Уведомление исчезает через 3 секунды
    }

    // Функция добавления сообщения в чат
    function addMessageToChat(chatId) {
        console.log(`Добавление сообщения в чат: ${chatId}`);
        const chatMessages = document.getElementById(chatId);
        if (!chatMessages) {
            console.error('Чат не найден для ID:', chatId);
            return;
        }

        const newMessage = document.createElement('div');
        newMessage.className = 'bot-message';
        newMessage.innerHTML = `
            <div class="text-sm text-gray-500 mb-2">Ассистент</div>
            <div class="bg-white p-3 rounded-lg shadow-sm">
                Я пока не подключён! Мой разработчик ищет сервер для моего обучения — видимо, я слишком умён для обычного оборудования 😉
            </div>
        `;
        chatMessages.appendChild(newMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Обработчик кнопок чата
    const buttons = document.querySelectorAll('.ai-action-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const chatId = button.getAttribute('data-chat-id');
            if (chatId) {
                addMessageToChat(chatId);
                showAINotification();
            }
        });
    });
});