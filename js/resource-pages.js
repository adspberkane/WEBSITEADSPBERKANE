(function () {
  'use strict';
  try {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) { /* Storage can be disabled by the browser. */ }
  function updateTitle() {
    const heading = document.querySelector('h1[data-i18n]');
    const key = heading.getAttribute('data-i18n');
    const lang = document.documentElement.lang === 'fr' ? 'fr' : 'ar';
    const dict = window.translations && window.translations[lang];
    document.title = (dict ? dict[key] : heading.textContent) + (lang === 'fr' ? ' | Donneurs de Berkane' : ' | متبرعو بركان');
  }
  document.addEventListener('languageChanged', updateTitle);
  updateTitle();
})();
