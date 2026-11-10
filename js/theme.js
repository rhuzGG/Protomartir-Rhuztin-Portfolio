(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');

  if (!themeButton || !themeIcon) return;

  function setTheme(themeName) {
    root.dataset.theme = themeName;

    try {
      localStorage.setItem('portfolio-theme', themeName);
    } catch (error) {
      // Storage may be unavailable in private browsing contexts.
    }

    const isLight = themeName === 'light';
    themeButton.setAttribute(
      'aria-label',
      isLight ? 'Switch to dark mode' : 'Switch to light mode'
    );
    themeIcon.textContent = isLight ? '\u263E' : '\u263C';
  }

  setTheme(root.dataset.theme || 'dark');
  themeButton.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
})();
