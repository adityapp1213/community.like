/* Small local data layer. Swap these methods for API calls when auth is added. */
(() => {
  const dbKey = 'community-like.db.v1';
  const sessionKey = 'community-like.session.v1';
  const seed = {
    users: [
      { id: 'fredy', name: 'Fredy Mercury', handle: 'fredy', image: 'assets/profile.png', bio: 'A UI/UX designer sharing little moments and creative experiments.' },
      { id: 'maya', name: 'Maya Chen', handle: 'mayachen', image: 'assets/dummy-profile-01.png', bio: 'Photography, parks, and a good cup of coffee.' },
      { id: 'sam', name: 'Sam Rivera', handle: 'samrivera', image: 'assets/dummy-profile-02.png', bio: 'Always taking the scenic route. Snapshots from everyday walks.' },
      { id: 'jordan', name: 'Jordan Lee', handle: 'jordanlee', image: 'assets/dummy-profile-03.png', bio: 'Creative experiments and a different perspective on familiar places.' },
      { id: 'noah', name: 'Noah Williams', handle: 'noahwilliams', image: 'assets/dummy-profile-04.png', bio: 'Weekend wanderer. Fresh air, open roads, and little discoveries.' }
    ],
    posts: [
      { id: 'rover', author: 'maya', title: 'I built this campus rover', text: 'I built this small rover for my robotics class. I want help with smoother turns and better obstacle sensing.', location: 'IIT Delhi', image: 'assets/project-rover.png', likes: 48, comments: 12, shares: 5, saves: 8 },
      { id: 'circuit', author: 'sam', title: 'I need help with this circuit', text: 'I am testing a smart lamp with an ESP32. Can someone help me find why the relay keeps dropping?', location: 'BITS Pilani', image: 'assets/project-circuit.png', likes: 32, comments: 9, shares: 3, saves: 6 },
      { id: 'study-app', author: 'jordan', title: 'I am building a study app', text: 'I am building a simple study planner for students. I want feedback on the first screen and the flow.', location: 'VIT Vellore', image: 'assets/project-workbench.png', likes: 26, comments: 7, shares: 4, saves: 5 },
      { id: 'water-filter', author: 'noah', title: 'I am testing a smart lamp', text: 'I am testing an IoT lamp with a relay and an ESP32. I want help checking the wiring before I make the next version.', location: 'NIT Trichy', image: 'assets/project-iot.png', likes: 64, comments: 14, shares: 8, saves: 10 }
    ],
    events: [
      { id: 'robotics-lab', host: 'maya', title: 'Robotics project help', category: 'Build session', date: '2026-10-10T10:00:00+05:30', location: 'IIT Delhi · Innovation Lab', text: 'Bring your robot, your wiring, or your questions. We will test ideas together.', going: 12 },
      { id: 'circuit-clinic', host: 'sam', title: 'Circuit debugging clinic', category: 'Peer help', date: '2026-10-11T11:00:00+05:30', location: 'Online', text: 'Share a circuit that is not working. We will read the diagram and debug it together.', going: 8 },
      { id: 'project-showcase', host: 'jordan', title: 'Student project showcase', category: 'Show and tell', date: '2026-10-17T14:00:00+05:30', location: 'Online', text: 'Show what you built, ask for feedback, and find people who want to help.', going: 16 }
    ], activity: {}
  };
  let db;
  try { db = JSON.parse(localStorage.getItem(dbKey)) || structuredClone(seed); } catch { db = structuredClone(seed); }
  // Migrate older local copies without clearing the user's saved activity.
  db.users ||= structuredClone(seed.users);
  db.posts ||= structuredClone(seed.posts);
  db.events ||= structuredClone(seed.events);
  db.activity ||= {};
  if (db.posts.some(post => post.title === 'A quieter kind of morning' || String(post.image).includes('dummy-post'))) db.posts = structuredClone(seed.posts);
  if (db.events.some(event => event.title === 'A slower Saturday')) db.events = structuredClone(seed.events);
  db.users.forEach(user => { db.activity[user.id] ||= { likes: [], saved: [], events: [], friends: db.users.filter(item => item.id !== user.id).map(item => item.id) }; });
  try { localStorage.setItem(dbKey, JSON.stringify(db)); } catch {}
  let session = null;
  try { session = localStorage.getItem(sessionKey); } catch {}
  const save = () => { try { localStorage.setItem(dbKey, JSON.stringify(db)); return true; } catch { return false; } };
  const auth = { current: () => db.users.find(user => user.id === session) || db.users[0], signIn(id) { session = id; try { localStorage.setItem(sessionKey, id); } catch {} }, signOut() { session = db.users[0].id; try { localStorage.setItem(sessionKey, session); } catch {} } };
  const repository = { get: () => structuredClone(db), persistent: () => { try { return !!window.localStorage; } catch { return false; } }, update(change) { const user = auth.current(); if (!user) throw new Error('Sign in first'); db.activity[user.id] ||= { likes: [], saved: [], events: [], friends: db.users.filter(item => item.id !== user.id).map(item => item.id) }; change(db, db.activity[user.id], user.id); return save(); } };
  window.Community = { auth, repository };
})();
