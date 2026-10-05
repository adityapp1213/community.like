document.querySelector('.search-bar').addEventListener('submit', (event) => event.preventDefault());
document.querySelectorAll('.like-button').forEach((button) => {
  button.addEventListener('click', () => {
    const count = button.querySelector('.like-count');
    const liked = button.classList.toggle('liked');
    button.setAttribute('aria-pressed', String(liked));
    button.setAttribute('aria-label', liked ? 'Unlike post' : 'Like post');
    count.textContent = Number(count.textContent) + (liked ? 1 : -1);
  });
});
document.querySelectorAll('.save-action').forEach((button) => {
  button.addEventListener('click', () => {
    const saved = button.classList.toggle('saved');
    button.setAttribute('aria-pressed', String(saved));
    button.setAttribute('aria-label', saved ? 'Unsave post' : 'Save post');
  });
});

// Friend profiles expand in place to keep the directory easy to browse.
document.querySelectorAll('.friend-profile-button').forEach((button) => {
  button.addEventListener('click', () => {
    const bio = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Close profile' : 'View profile';
    bio.hidden = !expanded;
  });
});

// RSVP changes are local to this demo page.
document.querySelectorAll('.rsvp-button').forEach((button) => {
  button.addEventListener('click', () => {
    const joined = button.getAttribute('aria-pressed') !== 'true';
    const count = button.closest('.event-card').querySelector('.going-count');
    count.textContent = Number(count.textContent) + (joined ? 1 : -1);
    button.setAttribute('aria-pressed', String(joined));
    button.textContent = joined ? 'Going ✓' : 'Join event';
  });
});

const directoryItems = [...document.querySelectorAll('[data-search-item]')];
if (directoryItems.length) {
  document.querySelector('#site-search').addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    let visible = 0;
    directoryItems.forEach((item) => {
      item.hidden = !item.textContent.toLowerCase().includes(query);
      if (!item.hidden) visible += 1;
    });
    document.querySelector('.directory-empty').hidden = visible > 0;
  });
}
