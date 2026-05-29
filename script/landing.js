const themeToggler = document.getElementById('themeToggler');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Load saved theme when page opens
const savedTheme = localStorage.getItem('theme') || 'dark';

html.setAttribute('data-bs-theme', savedTheme);

if (savedTheme === 'light') {
  themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
} else {
  themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
}

themeToggler.addEventListener('click', () => {

  const currentTheme = html.getAttribute('data-bs-theme');

  if (currentTheme === 'light') {

    html.setAttribute('data-bs-theme', 'dark');
    themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');

    localStorage.setItem('theme', 'dark');

  } else {

    html.setAttribute('data-bs-theme', 'light');
    themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');

    localStorage.setItem('theme', 'light');
  }

});