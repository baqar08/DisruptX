(function () {
    'use strict';

    const THEME_KEY = 'disruptx-theme';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';

    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        const theme = savedTheme || (prefersDark ? DARK_THEME : LIGHT_THEME);

        applyTheme(theme);
    }

    function applyTheme(theme) {
        if (theme === DARK_THEME) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateToggleIcon(true);
        } else {
            document.documentElement.removeAttribute('data-theme');
            updateToggleIcon(false);
        }
        localStorage.setItem(THEME_KEY, theme);
    }

    function updateToggleIcon(isDark) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            if (isDark) {
                toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
                toggleBtn.setAttribute('aria-label', 'Switch to light mode');
            } else {
                toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
                toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        applyTheme(newTheme);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    function attachToggleListener() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachToggleListener);
    } else {
        attachToggleListener();
    }

    window.themeManager = {
        toggle: toggleTheme,
        setTheme: applyTheme,
        getTheme: () => localStorage.getItem(THEME_KEY) || LIGHT_THEME
    };
})();
