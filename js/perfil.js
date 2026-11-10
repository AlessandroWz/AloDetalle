// Perfil: solo con sesión iniciada
(function () {
  let logged = false;
  try { logged = localStorage.getItem('loggedIn') === 'true'; } catch (e) {}
  if (!logged) { window.location.replace('login.html'); return; }

  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Pedidos de ejemplo (los del diseño). Luego vendrán del backend.
  const DEMO_ORDERS = [
    { name: 'Kit Conexión Romántica Premium', date: '15 Nov 2025', code: 'ALO-2026-4782', status: 'ok', emoji: '🎁' },
    { name: 'Pack Bienestar Zen', date: '3 Nov 2026', code: 'ALO-2026-4610', status: 'ok', emoji: '🌿' },
    { name: 'Caja Premium Élite', date: '20 Oct 2026', code: 'ALO-2026-4481', status: 'go', emoji: '💎' },
  ];
  const DATES = [
    { name: 'Aniversario con Carlos', date: '14 de Febrero, 2026', left: 'En 87 días' },
    { name: 'Cumpleaños de Mamá', date: '28 de Marzo, 2026', left: 'En 129 días' },
    { name: 'Cumpleaños a Ana (amiga)', date: '5 de Enero, 2026', left: 'En 47 días' },
  ];
  const STATUS = { ok: ['Entregado', 'tag--ok'], go: ['En camino', 'tag--go'], prep: ['Preparando', 'tag--prep'] };

  // Pedidos hechos en esta sesión (los guarda pedido.js) + los de ejemplo
  let mine = [];
  try { mine = JSON.parse(localStorage.getItem('orders')) || []; } catch (e) {}
  const orders = mine.concat(DEMO_ORDERS);

  document.getElementById('orders').innerHTML = orders.map((o) => {
    const [label, cls] = STATUS[o.status] || STATUS.prep;
    return `
      <article class="order">
        <div class="order__img" aria-hidden="true">${esc(o.emoji || '🎁')}</div>
        <div class="order__info"><h3>${esc(o.name)}</h3><p>${esc(o.date)} - #${esc(o.code)}</p></div>
        <span class="tag ${cls}">${label}</span>
      </article>`;
  }).join('');

  document.getElementById('dates').innerHTML = DATES.map((d) => `
    <div class="date"><i aria-hidden="true"></i><div><h3>${esc(d.name)}</h3><p>${esc(d.date)}</p></div><b>${esc(d.left)}</b></div>`).join('');

  // Cerrar sesión: borra la sesión y vuelve al login
  document.getElementById('logout').addEventListener('click', () => {
    try { localStorage.removeItem('loggedIn'); } catch (e) {}
    window.location.replace('login.html');
  });
})();