/* ═══════════════════════════════════════════
   GATHER — Community Events Platform
   script.js — Full Application Logic
═══════════════════════════════════════════ */

// ─── STATE ────────────────────────────────
let currentUser = null;
let users = JSON.parse(localStorage.getItem('gather_users') || '[]');
let events = JSON.parse(localStorage.getItem('gather_events') || 'null') || getSeedEvents();
let visibleCount = 6;
let editingEventId = null;

// ─── SEED DATA ────────────────────────────
function getSeedEvents() {
  const today = new Date();
  const d = (offset) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + offset);
    return dt.toISOString().split('T')[0];
  };
  return [
    { id: 'ev1', title: 'Mumbai City Marathon 2026', desc: 'Join thousands of runners in the annual Mumbai City Marathon. A celebration of endurance, community and city spirit. All fitness levels welcome!', category: '🏃 Marathon', date: d(3), time: '06:00', location: 'Marine Lines, Mumbai', maxParticipants: 500, price: 0, organizer: 'sys', participants: ['u1','u2','u3','u4','u5'], featured: true, image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&q=80' },
    { id: 'ev2', title: 'AI & Web3 Hackathon', desc: 'Build the future in 48 hours! This hackathon brings together developers, designers and founders to create AI-powered decentralized applications.', category: '💻 Tech', date: d(5), time: '09:00', location: 'BKC Tech Hub, Bengaluru', maxParticipants: 200, price: 0, organizer: 'sys', participants: ['u1','u6'], featured: true, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80' },
    { id: 'ev3', title: 'Bollywood Beats Live Night', desc: 'An electric evening of live Bollywood performances, dance, food stalls, and cultural fun. Bring your whole family for a memorable night under the stars.', category: '🎵 Music', date: d(7), time: '19:00', location: 'Nehru Stadium, Delhi', maxParticipants: 1000, price: 499, organizer: 'sys', participants: ['u2','u3'], featured: true, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80' },
    { id: 'ev4', title: 'Weekend Yoga & Meditation Retreat', desc: 'Escape the city buzz for a tranquil weekend of yoga, breathing exercises and mindfulness meditation. Instructors from Rishikesh lead sessions.', category: '🧘 Wellness', date: d(10), time: '07:00', location: 'Aravalli Hills, Gurugram', maxParticipants: 40, price: 1200, organizer: 'sys', participants: ['u1'], featured: false, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80' },
    { id: 'ev5', title: 'Photography Walk — Old Delhi', desc: 'Explore the lanes of Chandni Chowk with a camera in hand. Learn composition, street photography and storytelling from professional photographers.', category: '📸 Photography', date: d(12), time: '07:30', location: 'Chandni Chowk, Delhi', maxParticipants: 25, price: 299, organizer: 'sys', participants: [], featured: false, image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&q=80' },
    { id: 'ev6', title: 'Book Club: "The Alchemist"', desc: 'Monthly gathering of book lovers to discuss Paulo Coelho\'s timeless masterpiece. Coffee, conversation, and community in a cozy café setting.', category: '📚 Books', date: d(14), time: '11:00', location: 'Blue Tokai Coffee, Pune', maxParticipants: 20, price: 0, organizer: 'sys', participants: ['u3','u4','u5','u6'], featured: false, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80' },
    { id: 'ev7', title: 'Street Football Tournament', desc: 'Show off your skills in a 5-a-side street football tournament. Teams of up to 5 players. Trophies and prizes for top 3 teams.', category: '⚽ Sports', date: d(6), time: '16:00', location: 'Shivaji Park, Mumbai', maxParticipants: 100, price: 0, organizer: 'sys', participants: ['u1','u5'], featured: false, image: 'https://images.unsplash.com/photo-1570498839593-e565b39455fc?w=600&q=80' },
    { id: 'ev8', title: 'Startup Pitch Night', desc: 'Present your startup idea to a panel of investors and industry veterans. Network, get feedback, and potentially secure funding.', category: '💼 Business', date: d(9), time: '18:00', location: 'The Hub, Hyderabad', maxParticipants: 60, price: 200, organizer: 'sys', participants: [], featured: false, image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80' },
    { id: 'ev9', title: 'Himalayan Trek — Kedarkantha', desc: 'A 6-day guided trek to Kedarkantha summit (3950m). All experience levels welcome. Snow camping, stunning ridgelines, and unforgettable sunrises.', category: '🏔️ Adventure', date: d(20), time: '05:00', location: 'Sankri Village, Uttarakhand', maxParticipants: 15, price: 8500, organizer: 'sys', participants: ['u2'], featured: false, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
    { id: 'ev10', title: 'Diwali Cultural Festival', desc: 'Celebrate the festival of lights with art exhibitions, traditional food, classical dance performances, and a spectacular fireworks display.', category: '🎭 Culture', date: d(15), time: '17:00', location: 'Lalbagh, Bengaluru', maxParticipants: 2000, price: 0, organizer: 'sys', participants: ['u1','u2','u3','u4'], featured: false, image: 'https://images.unsplash.com/photo-1604155932133-9c18cdaa12e7?w=600&q=80' },
    { id: 'ev11', title: 'Gaming LAN Party', desc: 'Bring your setup or use ours for a full-day LAN party featuring CS2, Valorant, and FIFA tournaments. Prizes for winners!', category: '🎮 Gaming', date: d(8), time: '12:00', location: 'Cyber Hub, Pune', maxParticipants: 80, price: 150, organizer: 'sys', participants: [], featured: false, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80' },
    { id: 'ev12', title: 'Beach Clean-up Drive', desc: 'Join our community volunteers to clean up Juhu Beach. Equipment provided. Let\'s give back to nature and enjoy a morning by the sea.', category: '🤝 Volunteering', date: d(4), time: '07:00', location: 'Juhu Beach, Mumbai', maxParticipants: 150, price: 0, organizer: 'sys', participants: ['u3','u6'], featured: false, image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&q=80' },
  ];
}

// ─── PERSIST ─────────────────────────────
function saveEvents() { localStorage.setItem('gather_events', JSON.stringify(events)); }
function saveUsers()  { localStorage.setItem('gather_users', JSON.stringify(users)); }

// ─── CATEGORIES ───────────────────────────
const CATEGORIES = [
  { icon:'🏃', name:'Marathon', count:12 },
  { icon:'⚽', name:'Sports', count:34 },
  { icon:'💻', name:'Tech', count:28 },
  { icon:'🎵', name:'Music', count:19 },
  { icon:'📚', name:'Books', count:15 },
  { icon:'🎨', name:'Art', count:22 },
  { icon:'🍕', name:'Food', count:31 },
  { icon:'🧘', name:'Wellness', count:17 },
  { icon:'✈️', name:'Travel', count:9 },
  { icon:'🎭', name:'Culture', count:24 },
  { icon:'🐾', name:'Pets', count:8 },
  { icon:'🌿', name:'Nature', count:13 },
  { icon:'🎮', name:'Gaming', count:21 },
  { icon:'💼', name:'Business', count:16 },
  { icon:'📸', name:'Photography', count:11 },
  { icon:'🎬', name:'Film', count:7 },
  { icon:'🏔️', name:'Adventure', count:14 },
  { icon:'🤝', name:'Volunteering', count:18 },
  { icon:'👨‍👩‍👧', name:'Family', count:10 },
  { icon:'🔬', name:'Science', count:6 },
];

// ─── INIT ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderFeatured();
  renderUpcoming();
  animateStats();
  setupScrollNav();

  // restore session
  const saved = localStorage.getItem('gather_session');
  if (saved) {
    currentUser = JSON.parse(saved);
    setLoggedInUI();
  }
});

// ─── STATS COUNTER ────────────────────────
function animateStats() {
  const countUp = (el, target) => {
    let n = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = n < 1000 ? n : (n/1000).toFixed(1)+'k';
      if (n >= target) clearInterval(t);
    }, 24);
  };
  const te = document.getElementById('totalEvents');
  const tu = document.getElementById('totalUsers');
  if (te) countUp(te, events.length);
  if (tu) countUp(tu, users.length + 3200);
}

// ─── NAV SCROLL ───────────────────────────
function setupScrollNav() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
  });
}

// ─── SECTIONS ────────────────────────────
function showSection(name) {
  ['home','discover','myevents','joined'].forEach(s => {
    const el = document.getElementById(s === 'home' ? 'homeSection' : s+'Section');
    if (el) el.classList.add('hidden');
  });
  const map = { home:'homeSection', discover:'discoverSection', myevents:'myeventsSection', joined:'joinedSection' };
  const target = document.getElementById(map[name]);
  if (target) target.classList.remove('hidden');

  if (name === 'discover') renderDiscover();
  if (name === 'myevents') renderMyEvents();
  if (name === 'joined') renderJoined();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeUserMenu();
}

// ─── CATEGORIES RENDER ────────────────────
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(c => `
    <div class="category-card" onclick="filterByCategory('${c.icon} ${c.name}')">
      <span class="cat-icon">${c.icon}</span>
      <span class="cat-name">${c.name}</span>
      <span class="cat-count">${c.count + events.filter(e => e.category && e.category.includes(c.name)).length} events</span>
    </div>
  `).join('');
}

function filterByCategory(cat) {
  showSection('discover');
  setTimeout(() => {
    const el = document.getElementById('dFilterCategory');
    if (el) { el.value = cat; renderDiscover(); }
  }, 100);
}

// ─── EVENT CARD HTML ─────────────────────
function getCategoryEmoji(cat) {
  if (!cat) return '🎪';
  const m = cat.match(/^(\S+)/);
  return m ? m[1] : '🎪';
}

function eventCardHTML(ev, opts = {}) {
  const joined = currentUser && ev.participants.includes(currentUser.id);
  const isMine = currentUser && ev.organizer === currentUser.id;
  const pct = Math.round((ev.participants.length / ev.maxParticipants) * 100);
  const isFull = ev.participants.length >= ev.maxParticipants;
  const dateStr = ev.date ? new Date(ev.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric' }) : '';
  const priceTag = ev.price == 0 ? `<span class="event-tag free">Free</span>` : `<span class="event-tag paid">₹${ev.price}</span>`;
  const catTag = ev.category ? `<span class="event-tag">${ev.category}</span>` : '';
  const imgContent = ev.image
    ? `<img class="event-card-img" src="${ev.image}" alt="${ev.title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="event-card-img-placeholder" style="display:none">${getCategoryEmoji(ev.category)}</div>`
    : `<div class="event-card-img-placeholder">${getCategoryEmoji(ev.category)}</div>`;

  let actionBtn = '';
  if (isMine) {
    actionBtn = `<div class="org-actions">
      <button class="btn-participants" onclick="event.stopPropagation();viewParticipants('${ev.id}')">👥 ${ev.participants.length}</button>
      <button class="btn-edit" onclick="event.stopPropagation();editEvent('${ev.id}')">✏️</button>
      <button class="btn-delete" onclick="event.stopPropagation();deleteEvent('${ev.id}')">🗑️</button>
    </div>`;
  } else if (isFull && !joined) {
    actionBtn = `<button class="btn-join full-ev" disabled>Full</button>`;
  } else {
    actionBtn = `<button class="btn-join ${joined ? 'leave' : 'join'}" onclick="event.stopPropagation();toggleJoin('${ev.id}')">${joined ? 'Leave' : 'Join'}</button>`;
  }

  return `
    <div class="event-card" onclick="openDetail('${ev.id}')">
      ${imgContent}
      <div class="event-card-body">
        <div class="event-card-tags">${catTag}${priceTag}</div>
        <div class="event-card-title">${ev.title}</div>
        <div class="event-card-meta">
          <span>📅 ${dateStr}${ev.time ? ' · ' + formatTime(ev.time) : ''}</span>
          <span>📍 ${ev.location || 'TBD'}</span>
        </div>
        <div class="progress-bar-wrap" title="${pct}% full">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>
      <div class="event-card-footer">
        <span class="event-participants"><strong>${ev.participants.length}</strong>/${ev.maxParticipants} joined</span>
        ${actionBtn}
      </div>
    </div>
  `;
}

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2,'0')} ${ampm}`;
}

// ─── FEATURED ────────────────────────────
function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = events.filter(e => e.featured).slice(0, 3);
  grid.innerHTML = featured.map(e => eventCardHTML(e)).join('');
}

// ─── UPCOMING ────────────────────────────
function renderUpcoming() {
  const grid = document.getElementById('upcomingGrid');
  if (!grid) return;
  const filtered = getFilteredEvents('filterCategory','filterDate','filterPrice');
  const slice = filtered.slice(0, visibleCount);
  grid.innerHTML = slice.map(e => eventCardHTML(e)).join('');
}

function applyFilters() {
  visibleCount = 6;
  renderUpcoming();
}

function loadMore() {
  visibleCount += 6;
  renderUpcoming();
}

function getFilteredEvents(catId, dateId, priceId, searchId) {
  const cat   = document.getElementById(catId)?.value || '';
  const date  = document.getElementById(dateId)?.value || '';
  const price = document.getElementById(priceId)?.value || '';
  const q     = searchId ? (document.getElementById(searchId)?.value || '').toLowerCase() : '';

  const today = new Date(); today.setHours(0,0,0,0);
  const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + 7);
  const monthEnd = new Date(today); monthEnd.setDate(monthEnd.getDate() + 30);

  return events.filter(e => {
    if (cat && e.category !== cat) return false;
    if (price === 'free' && e.price != 0) return false;
    if (price === 'paid' && e.price == 0) return false;
    if (date) {
      const ed = new Date(e.date + 'T12:00:00');
      if (date === 'today' && ed.toDateString() !== today.toDateString()) return false;
      if (date === 'week' && (ed < today || ed > weekEnd)) return false;
      if (date === 'month' && (ed < today || ed > monthEnd)) return false;
    }
    if (q) {
      const searchable = (e.title + e.desc + e.category + e.location).toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  }).sort((a,b) => new Date(a.date) - new Date(b.date));
}

// ─── DISCOVER ────────────────────────────
function renderDiscover() {
  const grid = document.getElementById('discoverGrid');
  const empty = document.getElementById('discoverEmpty');
  if (!grid) return;
  const filtered = getFilteredEvents('dFilterCategory','dFilterDate','dFilterPrice','discoverSearch');
  grid.innerHTML = filtered.map(e => eventCardHTML(e)).join('');
  if (empty) empty.classList.toggle('hidden', filtered.length > 0);
}

// ─── MY EVENTS ────────────────────────────
function renderMyEvents() {
  const grid = document.getElementById('myEventsGrid');
  const empty = document.getElementById('myEventsEmpty');
  if (!grid || !currentUser) return;
  const mine = events.filter(e => e.organizer === currentUser.id);
  grid.innerHTML = mine.map(e => eventCardHTML(e)).join('');
  if (empty) empty.classList.toggle('hidden', mine.length > 0);
}

// ─── JOINED EVENTS ────────────────────────
function renderJoined() {
  const grid = document.getElementById('joinedGrid');
  const empty = document.getElementById('joinedEmpty');
  if (!grid || !currentUser) return;
  const joined = events.filter(e => e.participants.includes(currentUser.id) && e.organizer !== currentUser.id);
  grid.innerHTML = joined.map(e => eventCardHTML(e)).join('');
  if (empty) empty.classList.toggle('hidden', joined.length > 0);
}

// ─── HERO SEARCH ─────────────────────────
function heroSearchHandler(e) { if (e.key === 'Enter') performHeroSearch(); }
function performHeroSearch() {
  const q = document.getElementById('heroSearch')?.value?.trim();
  if (!q) return;
  showSection('discover');
  setTimeout(() => {
    const el = document.getElementById('discoverSearch');
    if (el) { el.value = q; renderDiscover(); }
  }, 150);
}

// ─── AUTH ─────────────────────────────────
function openAuth(tab) {
  document.getElementById('authModal').classList.remove('hidden');
  switchTab(tab || 'login');
}
function closeAuth() { document.getElementById('authModal').classList.add('hidden'); }

function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t, i) => t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup')));
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  if (!email || !pass) { showToast('Please fill all fields'); return; }
  const user = users.find(u => u.email === email && u.password === pass);
  if (!user) { showToast('Invalid credentials'); return; }
  loginUser(user);
}

function handleSignup() {
  const first = document.getElementById('signupFirst').value.trim();
  const last  = document.getElementById('signupLast').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPassword').value;
  const city  = document.getElementById('signupCity').value.trim();
  if (!first || !last || !email || !pass) { showToast('Please fill all required fields'); return; }
  if (users.find(u => u.email === email)) { showToast('Email already registered'); return; }
  const user = { id: 'u_' + Date.now(), firstName: first, lastName: last, email, password: pass, city, joined: Date.now() };
  users.push(user);
  saveUsers();
  loginUser(user);
}

function loginUser(user) {
  currentUser = user;
  localStorage.setItem('gather_session', JSON.stringify(user));
  setLoggedInUI();
  closeAuth();
  showToast(`Welcome back, ${user.firstName}! 🎉`);
  renderFeatured(); renderUpcoming();
  animateStats();
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('gather_session');
  setLoggedOutUI();
  showSection('home');
  showToast('Logged out successfully');
  renderFeatured(); renderUpcoming();
}

function setLoggedInUI() {
  document.getElementById('guestActions').classList.add('hidden');
  document.getElementById('userActions').classList.remove('hidden');
  document.getElementById('myEventsLink').classList.remove('hidden');
  document.getElementById('mobileLogin').classList.add('hidden');
  document.getElementById('mobileSignup').classList.add('hidden');
  document.getElementById('mobileCreate').classList.remove('hidden');
  document.getElementById('mobileLogout').classList.remove('hidden');
  const av = document.getElementById('navAvatar');
  const name = document.getElementById('userMenuName');
  if (av) av.textContent = currentUser.firstName[0].toUpperCase();
  if (name) name.textContent = currentUser.firstName + ' ' + currentUser.lastName;
}

function setLoggedOutUI() {
  document.getElementById('guestActions').classList.remove('hidden');
  document.getElementById('userActions').classList.add('hidden');
  document.getElementById('myEventsLink').classList.add('hidden');
  document.getElementById('mobileLogin').classList.remove('hidden');
  document.getElementById('mobileSignup').classList.remove('hidden');
  document.getElementById('mobileCreate').classList.add('hidden');
  document.getElementById('mobileLogout').classList.add('hidden');
}

function toggleUserMenu() {
  const menu = document.getElementById('userMenu');
  if (menu) menu.classList.toggle('hidden');
}
function closeUserMenu() {
  const menu = document.getElementById('userMenu');
  if (menu) menu.classList.add('hidden');
}
document.addEventListener('click', e => {
  const wrap = document.querySelector('.avatar-wrap');
  if (wrap && !wrap.contains(e.target)) closeUserMenu();
});

// ─── CREATE EVENT ─────────────────────────
function openCreate() {
  if (!currentUser) { openAuth('login'); return; }
  editingEventId = null;
  clearCreateForm();
  document.getElementById('createModal').classList.remove('hidden');
  document.querySelector('#createModal h2').textContent = 'Create New Event';
}
function closeCreate() { document.getElementById('createModal').classList.add('hidden'); editingEventId = null; }

function clearCreateForm() {
  ['evTitle','evDesc','evCategory','evDate','evTime','evLocation','evMax','evPrice','evImage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function handleCreateEvent() {
  const title    = document.getElementById('evTitle').value.trim();
  const desc     = document.getElementById('evDesc').value.trim();
  const category = document.getElementById('evCategory').value;
  const date     = document.getElementById('evDate').value;
  const time     = document.getElementById('evTime').value;
  const location = document.getElementById('evLocation').value.trim();
  const max      = parseInt(document.getElementById('evMax').value);
  const price    = parseFloat(document.getElementById('evPrice').value) || 0;
  const image    = document.getElementById('evImage').value.trim();

  if (!title || !category || !date || !location || !max) { showToast('Please fill all required fields'); return; }

  if (editingEventId) {
    const idx = events.findIndex(e => e.id === editingEventId);
    if (idx !== -1) {
      events[idx] = { ...events[idx], title, desc, category, date, time, location, maxParticipants: max, price, image };
      saveEvents();
      showToast('Event updated! ✅');
    }
  } else {
    const ev = { id: 'ev_'+Date.now(), title, desc, category, date, time, location, maxParticipants: max, price, image, organizer: currentUser.id, participants: [], featured: false };
    events.push(ev);
    saveEvents();
    showToast('Event created! 🎉');
  }

  closeCreate();
  renderFeatured(); renderUpcoming(); renderDiscover(); renderMyEvents();
  animateStats();
}

function editEvent(id) {
  if (!currentUser) return;
  const ev = events.find(e => e.id === id);
  if (!ev || ev.organizer !== currentUser.id) return;
  editingEventId = id;
  document.getElementById('evTitle').value = ev.title || '';
  document.getElementById('evDesc').value = ev.desc || '';
  document.getElementById('evCategory').value = ev.category || '';
  document.getElementById('evDate').value = ev.date || '';
  document.getElementById('evTime').value = ev.time || '';
  document.getElementById('evLocation').value = ev.location || '';
  document.getElementById('evMax').value = ev.maxParticipants || '';
  document.getElementById('evPrice').value = ev.price || 0;
  document.getElementById('evImage').value = ev.image || '';
  document.getElementById('createModal').classList.remove('hidden');
  document.querySelector('#createModal h2').textContent = 'Edit Event';
}

function deleteEvent(id) {
  if (!currentUser) return;
  const ev = events.find(e => e.id === id);
  if (!ev || ev.organizer !== currentUser.id) return;
  if (!confirm('Delete this event? This cannot be undone.')) return;
  events = events.filter(e => e.id !== id);
  saveEvents();
  showToast('Event deleted');
  renderFeatured(); renderUpcoming(); renderDiscover(); renderMyEvents();
  document.getElementById('detailModal').classList.add('hidden');
}

// ─── JOIN / LEAVE ─────────────────────────
function toggleJoin(id) {
  if (!currentUser) { openAuth('login'); return; }
  const ev = events.find(e => e.id === id);
  if (!ev) return;
  const idx = ev.participants.indexOf(currentUser.id);
  if (idx === -1) {
    if (ev.participants.length >= ev.maxParticipants) { showToast('This event is full!'); return; }
    ev.participants.push(currentUser.id);
    showToast('You joined the event! 🎟️');
  } else {
    ev.participants.splice(idx, 1);
    showToast('You left the event');
  }
  saveEvents();
  renderFeatured(); renderUpcoming(); renderDiscover(); renderMyEvents(); renderJoined();
  // refresh detail modal if open
  if (!document.getElementById('detailModal').classList.contains('hidden')) openDetail(id);
}

// ─── EVENT DETAIL ─────────────────────────
function openDetail(id) {
  const ev = events.find(e => e.id === id);
  if (!ev) return;
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('detailContent');
  const joined = currentUser && ev.participants.includes(currentUser.id);
  const isMine = currentUser && ev.organizer === currentUser.id;
  const isFull = ev.participants.length >= ev.maxParticipants;
  const pct = Math.round((ev.participants.length / ev.maxParticipants) * 100);
  const dateStr = ev.date ? new Date(ev.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : 'TBD';
  const organizer = ev.organizer === 'sys' ? { firstName:'Gather', lastName:'Team' } : users.find(u => u.id === ev.organizer) || { firstName:'Unknown', lastName:'' };

  const imgContent = ev.image
    ? `<img class="detail-img" src="${ev.image}" alt="${ev.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="detail-img-placeholder" style="display:none">${getCategoryEmoji(ev.category)}</div>`
    : `<div class="detail-img-placeholder">${getCategoryEmoji(ev.category)}</div>`;

  let actionHTML = '';
  if (isMine) {
    actionHTML = `
      <button class="btn-participants" onclick="viewParticipants('${ev.id}')">👥 View Participants (${ev.participants.length})</button>
      <button class="btn-edit" onclick="editEvent('${ev.id}');document.getElementById('detailModal').classList.add('hidden')">✏️ Edit</button>
      <button class="btn-delete" onclick="deleteEvent('${ev.id}')">🗑️ Delete</button>
    `;
  } else if (isFull && !joined) {
    actionHTML = `<button class="btn-join full-ev" disabled>Event Full</button>`;
  } else {
    actionHTML = `<button class="btn-join ${joined ? 'leave' : 'join'}" onclick="toggleJoin('${ev.id}')">${joined ? '✅ Leave Event' : '🎟️ Join Event'}</button>`;
  }

  content.innerHTML = `
    <button class="modal-close" onclick="document.getElementById('detailModal').classList.add('hidden')">✕</button>
    ${imgContent}
    <div class="detail-title">${ev.title}</div>
    <div class="detail-tags">
      ${ev.category ? `<span class="event-tag">${ev.category}</span>` : ''}
      ${ev.price == 0 ? `<span class="event-tag free">Free Entry</span>` : `<span class="event-tag paid">₹${ev.price}</span>`}
      ${joined ? `<span class="event-tag free">✅ Joined</span>` : ''}
    </div>
    <div class="detail-meta">
      <div class="detail-meta-item"><span class="label">📅 Date</span><span class="value">${dateStr}</span></div>
      <div class="detail-meta-item"><span class="label">⏰ Time</span><span class="value">${ev.time ? formatTime(ev.time) : 'TBD'}</span></div>
      <div class="detail-meta-item"><span class="label">📍 Location</span><span class="value">${ev.location || 'TBD'}</span></div>
      <div class="detail-meta-item"><span class="label">👥 Capacity</span><span class="value">${ev.participants.length} / ${ev.maxParticipants} joined</span></div>
    </div>
    <div class="progress-bar-wrap" title="${pct}% full" style="margin-bottom:16px">
      <div class="progress-bar-fill" style="width:${pct}%"></div>
    </div>
    ${ev.desc ? `<div class="detail-desc">${ev.desc}</div>` : ''}
    <div class="org-badge">🏅 Organized by <strong style="margin-left:4px">${organizer.firstName} ${organizer.lastName}</strong></div>
    <div class="detail-actions" style="margin-top:20px">${actionHTML}</div>
  `;

  modal.classList.remove('hidden');
}

// ─── PARTICIPANTS MODAL ───────────────────
function viewParticipants(id) {
  const ev = events.find(e => e.id === id);
  if (!ev) return;
  const list = document.getElementById('participantsList');
  if (!list) return;

  if (ev.participants.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">👥</div><p>No participants yet</p></div>`;
  } else {
    const colors = ['#e85d2f','#2d9e6b','#2563eb','#7c3aed','#d97706','#db2777'];
    list.innerHTML = ev.participants.map((uid, i) => {
      const u = users.find(x => x.id === uid);
      const name = u ? `${u.firstName} ${u.lastName}` : `Participant ${i+1}`;
      const email = u ? u.email : '';
      const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      const color = colors[i % colors.length];
      return `
        <div class="participant-item">
          <div class="participant-av" style="background:${color}">${initials}</div>
          <div>
            <div class="participant-name">${name}</div>
            ${email ? `<div class="participant-email">${email}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  document.getElementById('participantsModal').classList.remove('hidden');
}

// ─── DARK MODE ────────────────────────────
function toggleDark() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const btn = document.querySelector('.dark-toggle');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('gather_theme', isDark ? 'light' : 'dark');
}
// Load saved theme
const savedTheme = localStorage.getItem('gather_theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  const btn = document.querySelector('.dark-toggle');
  if (btn) btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// ─── MOBILE MENU ─────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
}

// ─── TOAST ───────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ─── MODAL BACKDROP CLOSE ────────────────
document.addEventListener('click', e => {
  ['authModal','createModal','detailModal','participantsModal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal && e.target === modal) modal.classList.add('hidden');
  });
});

// ─── ESC KEY ─────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['authModal','createModal','detailModal','participantsModal'].forEach(id => {
      document.getElementById(id)?.classList.add('hidden');
    });
    closeUserMenu();
  }
});
