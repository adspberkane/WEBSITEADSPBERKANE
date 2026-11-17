/* Decorative waves, confined to the homepage hero. No form or Firebase changes. */
(() => {
  'use strict';

  const hero = document.getElementById('hero');
  const layer = document.getElementById('hero-waves');
  if (!hero || !layer) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let effect = null;
  let libraries = null;
  let failed = false;
  let suspended = false;
  let visible = hero.getBoundingClientRect().bottom > 0 &&
    hero.getBoundingClientRect().top < window.innerHeight;

  function loadScript(src, integrity) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.integrity = integrity;
      script.crossOrigin = 'anonymous';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        script.remove();
        reject(new Error('Wave library unavailable'));
      };
      document.head.appendChild(script);
    });
  }

  function loadLibraries() {
    if (!libraries) {
      libraries = (async () => {
        if (!window.THREE) {
          await loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',
            'sha384-9EQoUIJYrv09/oYhSxnw1VpLcfPw3BM9dE7+D/3wGUPeLLa7F9Z6OAoD+i/M6FK9'
          );
        }
        if (!window.VANTA || !window.VANTA.WAVES) {
          await loadScript(
            'https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js',
            'sha384-fs5VqUnBAfynHwt9bbuBxdgqyNG/vUAEV0bbNR1WkKlgIJLlK+jPRNHPNcpKUkKg'
          );
        }
      })();
    }
    return libraries;
  }

  function stop() {
    const current = effect;
    effect = null;
    if (current) {
      try {
        current.destroy();
      } catch (error) {
        layer.replaceChildren();
      }
    }
  }

  function canAnimate() {
    return visible && !document.hidden && !reducedMotion.matches && !suspended && !failed;
  }

  async function update() {
    if (!canAnimate()) {
      stop();
      return;
    }
    try {
      await loadLibraries();
      if (!canAnimate() || effect) return;
      effect = window.VANTA.WAVES({
        el: layer,
        THREE: window.THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0xe45673,
        shininess: 20,
        waveHeight: 16,
        waveSpeed: 1.5,
        zoom: 1.05
      });
      if (!effect.renderer) throw new Error('WebGL unavailable');
      effect.renderer.setPixelRatio(1);
      effect.resize();
      const canvas = layer.querySelector('canvas');
      if (canvas) canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        failed = true;
        stop();
      }, { once: true });
    } catch (error) {
      failed = true;
      stop();
      // Keep the original background and content if scripts or WebGL are unavailable.
      layer.replaceChildren();
      layer.style.display = 'none';
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      update();
    });
    observer.observe(hero);
  }
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
  window.addEventListener('pagehide', () => { suspended = true; stop(); });
  window.addEventListener('pageshow', () => { suspended = false; update(); });
  update();
})();
