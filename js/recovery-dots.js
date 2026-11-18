/* Decorative recovery background: speed 1, opacity 63%, 150 dots, size 8px. */
(() => {
  'use strict';

  const section = document.getElementById('recovery-simulator');
  const field = section?.querySelector('.recovery-glow-dots');
  if (!field || field.childElementCount) return;

  const count = 150;
  const size = 8;
  const duration = 4.5;
  const dots = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'recovery-glow-dot';
    dot.style.setProperty('--dot-left', (2 + ((i * 61.803398875 + 11) % 96)).toFixed(2) + '%');
    dot.style.setProperty('--dot-top', (3 + ((i * 37.197 + 7) % 94)).toFixed(2) + '%');
    dot.style.setProperty('--dot-size', (size * (.7 + (i % 7) / 12)).toFixed(1) + 'px');
    dot.style.setProperty('--dot-duration', (duration * (1 + (i % 7) * .09)) + 's');
    dot.style.setProperty('--dot-delay', (-duration * i / count) + 's');
    dots.appendChild(dot);
  }
  field.appendChild(dots);

  let visible = true;
  function updatePlayback() {
    field.classList.toggle('is-paused', document.hidden || !visible);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    }).observe(section);
  }
  document.addEventListener('visibilitychange', updatePlayback);
  updatePlayback();
})();
