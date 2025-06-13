(function() {
  // Инициализация переменных
  let hasInteraction = false;
  let scrollDepth = 0;
  let startTime = Date.now();

  // Проверка User-Agent на признаки ботов
  const isBot = /bot|crawl|spider|click|proxy|scraper|checker|monitoring|headless|yahoo|bing|duckduckgo|yandex|baidu|seo/i.test(navigator.userAgent);

  // Проверка поддержки JavaScript
  const supportsJS = 'querySelector' in document && 'addEventListener' in window;

  // Отслеживание взаимодействий
  document.addEventListener('click', () => hasInteraction = true);
  document.addEventListener('mousemove', () => hasInteraction = true);
  document.addEventListener('keydown', () => hasInteraction = true);

  // Отслеживание глубины прокрутки
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    scrollDepth = Math.max(scrollDepth, scrolled);
  });

  // Функция для отправки данных о боте
  function reportBot() {
    const timeSpent = (Date.now() - startTime) / 1000;
    const isBotDetected = isBot || !supportsJS || (timeSpent < 10 && !hasInteraction && scrollDepth < 0.1);

    if (isBotDetected) {
      // Вариант 1: Перенаправление на пустую страницу
      window.location.href = "/no-track.html";

      // Вариант 2: Отправка на Google Apps Script
      fetch('https://script.google.com/macros/s/AKfycbw2X4QjuFBIjAu53Nt7ZOVi4x7jyz4SpOwKOMGpMZMQGMb5kw_k1MOa405lV7GPPPFa/exec', { // Замени на твой URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Is-Bot': 'true' },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          timeSpent: timeSpent,
          scrollDepth: scrollDepth,
          hasInteraction: hasInteraction,
          timestamp: new Date().toISOString()
        })
      })
      .then(response => response.json())
      .then(data => console.log('Bot reported:', data))
      .catch(error => console.error('Error reporting bot:', error));
    }
  }

  // Проверка через 5 секунд после загрузки
  setTimeout(reportBot, 5000);
})();