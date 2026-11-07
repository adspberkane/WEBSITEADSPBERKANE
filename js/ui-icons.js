/* Shared presentation layer. Keep saved team symbols and translated text intact;
   render their visual equivalents without changing form values or cloud data. */
(() => {
  'use strict';

  const symbols = {
    '👨‍⚕️': ['user-doctor', 'medical'],
    '➡️': ['arrow-right', 'primary'], '⬅️': ['arrow-left', 'primary'],
    '⏱️': ['stopwatch', 'info'], '⏳': ['hourglass-half', 'warning'],
    '🩸': ['droplet', 'primary'], '💧': ['droplet', 'info'],
    '🛡️': ['shield-halved', 'warning'], '🏥': ['hospital', 'medical'],
    '🏆': ['trophy', 'gold'], '🥇': ['medal', 'gold'],
    '🥈': ['medal', 'silver'], '🥉': ['medal', 'bronze'],
    '🏫': ['school', 'info'], '🤝': ['handshake', 'medical'],
    '🏢': ['building', 'info'], '⚽': ['futbol', 'medical'],
    '🏛️': ['landmark', 'info'], '👥': ['users', 'primary'],
    '🎉': ['circle-check', 'success'], '✅': ['circle-check', 'success'],
    '⚠️': ['triangle-exclamation', 'warning'], '❌': ['circle-xmark', 'danger'],
    '➕': ['plus', 'inherit'], '✏️': ['pen-to-square', 'inherit'],
    '🗑️': ['trash-can', 'danger'], '💾': ['floppy-disk', 'inherit'],
    '📄': ['file-lines', 'info'], '📝': ['file-pen', 'info'],
    '📭': ['inbox', 'muted'], '🌐': ['globe', 'info'],
    '🚪': ['right-from-bracket', 'inherit'], '📋': ['clipboard-list', 'primary'],
    '🚨': ['bell', 'danger'], '📸': ['camera', 'info'],
    '🌅': ['images', 'info'], '🖼️': ['images', 'info'],
    '📊': ['chart-column', 'info'], '🔄': ['arrows-rotate', 'inherit'],
    '📥': ['file-arrow-down', 'inherit'], '🎯': ['bullseye', 'primary'],
    '🔍': ['magnifying-glass', 'muted']
  };
  // Match the complete emoji first, including optional variation selectors.
  const pattern = new RegExp(Object.keys(symbols)
    .sort((a, b) => b.length - a.length)
    .map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\uFE0F/g, '') + '\uFE0F?')
    .join('|'), 'gu');
  const byBase = new Map(Object.entries(symbols).map(([s, icon]) => [s.replace(/\uFE0F/g, ''), icon]));
  const excluded = 'script,style,textarea,input,svg,[contenteditable],.site-icon';

  function renderText(node) {
    if (!node.parentElement || node.parentElement.closest(excluded)) return;
    const text = node.nodeValue;
    pattern.lastIndex = 0;
    if (!pattern.test(text)) return;
    pattern.lastIndex = 0;
    // Native select options cannot contain icon elements. Their values remain
    // unchanged for compatibility with existing team records.
    if (node.parentElement.closest('option')) {
      node.nodeValue = text.replace(pattern, '').trim();
      return;
    }
    const fragment = document.createDocumentFragment();
    let start = 0;
    for (const match of text.matchAll(pattern)) {
      if (match.index > start) fragment.append(text.slice(start, match.index));
      const [name, tone] = byBase.get(match[0].replace(/\uFE0F/g, ''));
      const icon = document.createElement('i');
      icon.className = `fa-solid fa-${name} site-icon site-icon--${tone}`;
      icon.setAttribute('aria-hidden', 'true');
      fragment.append(icon);
      start = match.index + match[0].length;
    }
    if (start < text.length) fragment.append(text.slice(start));
    node.replaceWith(fragment);
  }

  function render(root) {
    if (root.nodeType === Node.TEXT_NODE) { renderText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE || root.closest(excluded)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(renderText);
  }

  render(document.body);
  // Covers language switches, recovery stages, alerts and cloud-loaded teams.
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') render(record.target);
      else record.addedNodes.forEach(render);
    }
  }).observe(document.body, { childList: true, characterData: true, subtree: true });
})();
