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
