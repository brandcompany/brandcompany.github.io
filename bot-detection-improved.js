(function() {
  'use strict';

  // Инициализация
  let hasInteraction = false;
  let scrollDepth = 0;
  const startTime = Date.now();

  // Проверка User-Agent
  const isBotAgent = /bot|crawler|spider|click|scraper|checker|monitoring|headless|yahoo|bing|duckduckgo|google|yandex|baidu/i.test(navigator.userAgent);
  const isBrowser = /chrome|safari|firefox|edge|opera/i.test(navigator.userAgent);

  // Проверка поддержки JavaScript
  const supportsJS = 'querySelector' in document && 'addEventListener' in window;

  // Проверка сенсорных устройств
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Отслеживание взаимодействий
  document.addEventListener('click', () => hasInteraction = true);
  document.addEventListener('mousemove', () => hasInteraction = true);
  document.addEventListener('keydown', () => hasInteraction = true);
  if (isTouchDevice) {
    document.addEventListener('touchstart', () => hasInteraction = true);
  }

  // Отслеживание глубины прокрутки
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    scrollDepth = Math.max(scrollDepth, scrolled);
  });

  // Функция для отправки данных
  function reportBot() {
    const timeSpent = (Date.now() - startTime) / 1000;
    const isBotDetected = (isBotAgent && !isBrowser) || !supportsJS || (timeSpent < 10 && !hasInteraction);

    if (isBotDetected) {
      console.log('Bot detected, sending report:', {
        isBot: true,
        userAgent: navigator.userAgent,
        timeSpent: timeSpent,
        scrollDepth: scrollDepth,
        hasInteraction: hasInteraction,
        timestamp: new Date().toISOString()
      });
      fetch('https://script.google.com/macros/s/AKfycbyOPTs44b7YZb38kSISHyEol0sAicxGtQBU3_JADesnY8f6A6lC4zhN2q5m84BONe8jHQ/exec', {
        method: 'POST',
        mode: 'no-cors', // Для обхода CORS
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isBot: true,
          userAgent: navigator.userAgent,
          timeSpent: timeSpent,
          scrollDepth: scrollDepth,
          hasInteraction: hasInteraction,
          timestamp: new Date().toISOString()
        })
      })
      .then(response => console.log('Bot reported'))
      .catch(error => console.error('Error reporting bot:', error));
    }
  }

  // Проверка через 10 секунд
  setTimeout(reportBot, 10000);
})();