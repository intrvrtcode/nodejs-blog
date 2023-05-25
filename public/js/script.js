document.addEventListener('DOMContentLoaded', () => {

  const searchBtn = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  searchBtn.forEach(item => {
    item.addEventListener('click', (e) => {
      searchBar.style.visibility = 'visible';
      searchBar.classList.add('open');
      e.target.setAttribute('aria-expanded', 'true');
      searchInput.focus();
    })
  })

  searchClose.addEventListener('click', (e) => {
    searchBar.style.visibility = 'hidden';
    searchBar.classList.remove('open');
    e.target('aria-expanded', 'false');
  })
})

// admin page
const loginSection = document.getElementById('login-section');
const RegisterSection = document.getElementById('register-section');

// toggle register
document.getElementById('toggle-register').addEventListener('click', () => {
  RegisterSection.style.display = 'block';
  loginSection.style.display = 'none';
});

// toggle login
document.getElementById('toggle-login').addEventListener('click', () => {
  RegisterSection.style.display = 'none';
  loginSection.style.display = 'block';
})

const errorAlert = document.getElementById('error-alert');

document.getElementById('close-alert').addEventListener('click', () => {
  errorAlert.style.display = 'none';
})
