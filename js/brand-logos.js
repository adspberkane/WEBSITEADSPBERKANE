/* Keep association logos in step with the page language, including dynamic fallbacks. */
(function () {
  'use strict';
  const arabicLogo = 'assets/logo.png';
  const frenchLogo = 'assets/logo-fr.png';
  const logoPath = /(?:^|\/)assets\/logo(?:-fr)?\.(?:png|jpg|ico)(?:[?#].*)?$/i;
  const selector = 'img[src], link[rel~="icon"], link[rel="apple-touch-icon"]';
  const originalIcons = new WeakMap();
  let failedFrench = new WeakSet();

  function syncNode(node) {
    if (!node.matches || !node.matches(selector)) return;
    const image = node.tagName === 'IMG';
    const attribute = image ? 'src' : 'href';
    const path = node.getAttribute(attribute) || '';
    if (!logoPath.test(path)) return;
    const french = document.documentElement.lang === 'fr' && !failedFrench.has(node);
    let target = french ? frenchLogo : arabicLogo;
    if (!image) {
      if (!originalIcons.has(node)) originalIcons.set(node, { href: path, type: node.getAttribute('type') });
      const original = originalIcons.get(node);
      if (!french) target = original.href === frenchLogo ? arabicLogo : original.href;
      const type = french ? 'image/png' : original.type;
      if (type) node.setAttribute('type', type);
      else node.removeAttribute('type');
    } else {
      node.dataset.brandLanguage = french ? 'fr' : 'ar';
      const alt = node.getAttribute('alt') || '';
      if (/^(Logo|شعار الجمعية|جمعية المتبرعين بالدم بإقليم بركان|Association des donneurs de sang de la province de Berkane)$/.test(alt)) {
        node.alt = french ? 'Association des donneurs de sang de la province de Berkane' : 'جمعية المتبرعين بالدم بإقليم بركان';
      }
    }
    if (path !== target) node.setAttribute(attribute, target);
  }

  function syncTree(root) {
    syncNode(root);
    if (root.querySelectorAll) root.querySelectorAll(selector).forEach(syncNode);
  }

  // A missing French asset falls back once, without an image-error retry loop.
  document.addEventListener('error', event => {
    const image = event.target;
    if (image.tagName === 'IMG' && /(?:^|\/)assets\/logo-fr\.png(?:[?#].*)?$/i.test(image.getAttribute('src') || '')) {
      failedFrench.add(image);
      image.src = arabicLogo;
      image.dataset.brandLanguage = 'ar';
    }
  }, true);
  document.addEventListener('languageChanged', () => {
    failedFrench = new WeakSet();
    syncTree(document);
  });
  function init() {
    syncTree(document);
    new MutationObserver(records => {
      records.forEach(record => {
        if (record.type === 'attributes') syncNode(record.target);
        else record.addedNodes.forEach(syncTree);
      });
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'href'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
