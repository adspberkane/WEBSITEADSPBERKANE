(function () {
  'use strict';
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) { /* Browser storage may be unavailable. */ }
  function updateTitle() {
    document.title = document.documentElement.lang === 'fr'
      ? 'Politique de confidentialité | Donneurs de Berkane'
      : 'سياسة الخصوصية | متبرعو بركان';
  }
  document.addEventListener('languageChanged', updateTitle);
  updateTitle();
})();
