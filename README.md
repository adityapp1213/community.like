# community like

Community Like is a plain HTML, CSS, and JavaScript student project community app.

## Run

Serve this folder with any static web server, then open `landing.html`.

## Main files

- `landing.html` starts Clerk sign in.
- `index.html` is the project feed and composer.
- `event.html` lists events and creates new ones.
- `event-detail.html` shows one event with its banner, host, timing, location, and Join action.
- `friends.html` lists community members.
- `profile.html` shows a profile, joined events, projects, and profile editing.
- `settings.html` contains Clerk account controls and logout.
- `app.js` renders shared pages and handles interactions.
- `data.js` stores demo data and local changes.
- `auth.js` loads Clerk and protects signed-in pages.
- `styles.css` contains the shared visual system.

The app uses localStorage for demo persistence. Keep `.env.local` private if it is used for local tooling.
