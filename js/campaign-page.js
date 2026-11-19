(function () {
  'use strict';
  const status = document.getElementById('campaign-page-status');
  const details = document.getElementById('campaign-page-details');
  if (!status || !details) return;
  const title = document.getElementById('campaign-page-title');
  const location = document.getElementById('campaign-page-location');
  const date = document.getElementById('campaign-page-date');
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'campaign-details-link campaign-retry';
  retry.hidden = true;
  status.insertAdjacentElement('afterend', retry);
  let state = 'loading';
  let current = null;
  let unsubscribe = null;
  let timer = null;
  let attempt = 0;
  const text = {
    ar: { loading: 'جارٍ التحقق من معلومات الحملة...', unavailable: 'تعذر التحقق من الحملة حالياً. تحقق من اتصالك وحاول مجدداً.', empty: 'لا توجد حملة معلنة حالياً.', missing: 'غير محدد', retry: 'إعادة المحاولة' },
    fr: { loading: 'Vérification des informations de la campagne...', unavailable: 'Impossible de vérifier la campagne pour le moment. Vérifiez votre connexion et réessayez.', empty: 'Aucune campagne annoncée pour le moment.', missing: 'Non précisé', retry: 'Réessayer' }
  };
  function render() {
    const lang = document.documentElement.lang === 'fr' ? 'fr' : 'ar';
    const words = text[lang];
    retry.textContent = words.retry;
    retry.hidden = state !== 'unavailable';
    details.hidden = state !== 'ready';
    status.hidden = state === 'ready';
    if (state !== 'ready') { status.textContent = words[state]; return; }
    title.textContent = (lang === 'fr' ? current.titleFr || current.titleAr || current.title : current.titleAr || current.titleFr || current.title) || '';
    location.textContent = (lang === 'fr' ? current.locFr || current.locAr : current.locAr || current.locFr) || words.missing;
    date.textContent = (lang === 'fr' ? current.dateFr || current.dateAr || current.dateText : current.dateAr || current.dateText || current.dateFr) || words.missing;
  }
  async function start() {
    const id = ++attempt;
    if (unsubscribe) { unsubscribe(); unsubscribe = null; }
    clearTimeout(timer);
    current = null;
    state = 'loading'; render();
    timer = setTimeout(() => { if (id === attempt && state === 'loading') { state = 'unavailable'; render(); } }, 15000);
    try {
      const [firebase, firestore] = await Promise.all([import('./firebase-config.js'), import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js')]);
      if (id !== attempt) return;
      if (!firebase.db) throw new Error('Firebase unavailable');
      const ref = firestore.doc(firebase.db, firebase.SITE_SETTINGS_COLLECTION, firebase.CAMPAIGN_DOC_ID);
      unsubscribe = firestore.onSnapshot(ref, { includeMetadataChanges: true }, snap => {
        if (id !== attempt || snap.metadata.fromCache || snap.metadata.hasPendingWrites) return;
        clearTimeout(timer);
        current = snap.exists() ? snap.data() : null;
        state = current && (current.titleAr || current.titleFr || current.title) ? 'ready' : 'empty';
        render();
      }, () => { if (id === attempt) { clearTimeout(timer); state = 'unavailable'; render(); } });
    } catch (error) { if (id === attempt) { clearTimeout(timer); state = 'unavailable'; render(); } }
  }
  document.addEventListener('languageChanged', render);
  retry.addEventListener('click', start);
  render();
  start();
})();
