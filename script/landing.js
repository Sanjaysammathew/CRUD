    const themeToggler = document.getElementById('themeToggler');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    themeToggler.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-bs-theme');
      if (currentTheme === 'light') {
        html.setAttribute('data-bs-theme', 'dark');
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
      } else {
        html.setAttribute('data-bs-theme', 'light');
        themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
      }
    });