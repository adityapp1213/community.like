(() => {
  const { repository } = window.Community;
  const root = document.querySelector('[data-event-detail]');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]));
  const images = {
    'robotics-lab': 'assets/event-iit-delhi.png',
    'project-showcase': 'assets/event-workshop.png'
  };
  const id = new URLSearchParams(location.search).get('id');
  const db = repository.get();
  const event = db.events.find(item => item.id === id) || db.events[0];
  const host = db.users.find(item => item.id === event?.host);
  const current = repository.get().activity[window.Community.auth.current()?.id] || { events: [] };
  if (!event || !root) return;
  const date = new Date(event.date);
  const joined = current.events.includes(event.id);
  const owned = event.host === window.Community.auth.current()?.id;
  root.innerHTML = `<article class="event-detail-card">
    <img class="event-detail-banner" src="${event.image || images[event.id] || 'assets/project-iot.png'}" alt="${esc(event.title)} banner">
    <div class="event-detail-body">
      <div class="event-detail-host">
        <img src="${host?.image || 'assets/profile.png'}" alt="${esc(host?.name || 'Community host')}" class="event-detail-host-avatar">
        <div><strong>${esc(host?.name || 'Community host')}</strong><span class="event-detail-host-handle">${host ? esc(host.handle?.startsWith('@') ? host.handle : `@${host.handle}`) : '@community'}</span></div>
      </div>
      <a class="back-link" href="event.html">← All events</a>
      <p class="event-category">${esc(event.category)}</p>
      <h1>${esc(event.title)}</h1>
      <p class="event-detail-description">${esc(event.text)}</p>
      <dl class="event-detail-meta">
        <div><dt>When</dt><dd>${date.toLocaleDateString('en-IN',{weekday:'long', day:'numeric', month:'long', year:'numeric'})}<br><strong>${date.toLocaleTimeString('en-IN',{hour:'numeric', minute:'2-digit', timeZone:'Asia/Kolkata'})} IST</strong></dd></div>
        <div><dt>Where</dt><dd>${esc(event.location)}</dd></div>
        <div><dt>Hosted by</dt><dd>${host ? `<a href="profile.html?user=${encodeURIComponent(host.id)}">${esc(host.name)}</a>` : 'Community team'}</dd></div>
        <div><dt>Attendance</dt><dd><strong>${event.going}</strong> people going</dd></div>
      </dl>
      <div class="event-detail-actions"><button class="event-detail-rsvp" type="button" data-detail-rsvp data-id="${esc(event.id)}" aria-pressed="${joined}">${joined ? 'Joined ✓' : 'Join'}</button>${owned ? '<button class="event-detail-delete" type="button" data-detail-delete>Delete event</button>' : ''}</div>
    </div>
  </article>`;
  root.querySelector('[data-detail-rsvp]').addEventListener('click', button => {
    repository.update((data, activity) => {
      activity.events = activity.events.includes(event.id) ? activity.events.filter(item => item !== event.id) : [...activity.events, event.id];
    });
    const active = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? 'Joined ✓' : 'Join';
  });
  root.querySelector('[data-detail-delete]')?.addEventListener('click', () => {
    if (!confirm('Delete this event?')) return;
    repository.update(data => { data.events = data.events.filter(item => item.id !== event.id); });
    location.href = 'event.html';
  });
  window.addEventListener('community-auth-ready', () => {
    const activeEvents = repository.get().activity[window.Community.auth.current()?.id]?.events || [];
    const active = activeEvents.includes(event.id);
    const button = root.querySelector('[data-detail-rsvp]');
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? 'Joined ✓' : 'Join';
    const actions = root.querySelector('.event-detail-actions');
    if (event.host === window.Community.auth.current()?.id && !actions.querySelector('[data-detail-delete]')) {
      const deleteButton = document.createElement('button');
      deleteButton.className = 'event-detail-delete';
      deleteButton.type = 'button';
      deleteButton.dataset.detailDelete = '';
      deleteButton.textContent = 'Delete event';
      actions.append(deleteButton);
      deleteButton.addEventListener('click', () => { if (confirm('Delete this event?')) { repository.update(data => { data.events = data.events.filter(item => item.id !== event.id); }); location.href = 'event.html'; } });
    }
  });
})();
