// ULTRA SIMPLE Theme System
(function() {
  'use strict';

  const KEY = 'app-theme';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.className = 'light-mode';
    } else {
      document.documentElement.className = '';
    }
  }

  function getTheme() {
    try {
      return localStorage.getItem(KEY);
    } catch(e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch(e) {}
  }

  // Apply saved theme
  applyTheme(getTheme());

  // Toggle function
  window.toggleTheme = function() {
    const current = getTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    saveTheme(newTheme);
    updateButtons();
  };

  // Update button text
  function updateButtons() {
    const isLight = document.documentElement.className === 'light-mode';
    const html = isLight
      ? '<span class="theme-toggle-icon">🌙</span> Dark Mode'
      : '<span class="theme-toggle-icon">☀️</span> Light Mode';

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = html;
    });
  }

  // Update on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateButtons);
  } else {
    updateButtons();
  }
})();
