// El carrito solo existe con sesión iniciada (demo: ver index.js)
let logged = false;
try { logged = localStorage.getItem('loggedIn') === 'true'; } catch (e) {}
if (!logged) window.location.replace('login.html');

const KEY = 'cartState';
const money = (n) => 'S/.' + n;

// Productos de ejemplo (los del diseño). Luego vendrán del backend.
const DEMO = {
  items: [
    { id: 'kit-romantico', name: 'Kit Conexión Romántica Premium', sub: 'Pareja + Caja premium', price: 214, qty: 1, emoji: '🎁' },
    { id: 'kit-bienestar', name: 'Kit Bienestar Premium', sub: 'Bienestar + Caja premium', price: 104, qty: 1, emoji: '🌿' },
  ],
  extras: { caja: false, tarjeta: false },
};
const IDEAS = [
  { id: 'set-aromaterapia', name: 'Set Aromaterapia', sub: 'Bienestar', price: 69, emoji: '🕯️' },
  { id: 'chocolates', name: 'Chocolates Artesanales', sub: 'Dulces', price: 49, emoji: '🍫' },
];
const EXTRA_PRICE = { caja: 25, tarjeta: 15 };
const DISCOUNT = 40; // descuento de ejemplo

let state;
try { state = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
if (!state || !Array.isArray(state.items)) state = JSON.parse(JSON.stringify(DEMO));

const $ = (id) => document.getElementById(id);

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    localStorage.setItem('cartItems', String(state.items.reduce((n, i) => n + i.qty, 0)));
  } catch (e) {}
}

function render() {
  const list = $('items');
  if (state.items.length === 0) {
    list.innerHTML = '<div class="empty">Tu carrito está vacío.<br /><a href="index.html">Ver la tienda</a></div>';
  } else {
    list.innerHTML = state.items.map((i) => `
      <article class="item">
        <div class="item__img" aria-hidden="true">${i.emoji}</div>
        <div>
          <h3>${i.name}</h3>
          <p class="item__sub">${i.sub}</p>
          <div class="item__ctl">
            <div class="qty">
              <button type="button" data-act="dec" data-id="${i.id}" aria-label="Quitar uno">-</button>
              <span aria-live="polite">${i.qty}</span>
              <button type="button" data-act="inc" data-id="${i.id}" aria-label="Agregar uno">+</button>
            </div>
            <button type="button" class="del" data-act="del" data-id="${i.id}">Eliminar</button>
          </div>
        </div>
        <p class="item__price">${money(i.price * i.qty)}</p>
      </article>`).join('');
  }

  const subtotal = state.items.reduce((n, i) => n + i.price * i.qty, 0);
  const discount = subtotal > 0 ? DISCOUNT : 0;
  const extras = (state.extras.caja ? EXTRA_PRICE.caja : 0) + (state.extras.tarjeta ? EXTRA_PRICE.tarjeta : 0);
  const total = subtotal > 0 ? subtotal - discount + extras : 0;

  $('subtotal').textContent = money(subtotal);
  $('discount').textContent = '-' + money(discount);
  $('total').textContent = money(total);
  $('x-caja').checked = state.extras.caja;
  $('x-tarjeta').checked = state.extras.tarjeta;
  $('checkout').setAttribute('aria-disabled', String(subtotal === 0));

  // Contador del menú
  const qty = state.items.reduce((n, i) => n + i.qty, 0);
  const badge = $('cart-count');
  if (badge) { badge.textContent = String(qty); badge.hidden = qty === 0; }
  save();
}

$('items').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const item = state.items.find((i) => i.id === btn.dataset.id);
  if (!item) return;
  if (btn.dataset.act === 'inc') item.qty += 1;
  if (btn.dataset.act === 'dec') item.qty = Math.max(1, item.qty - 1);
  if (btn.dataset.act === 'del') state.items = state.items.filter((i) => i.id !== item.id);
  render();
});

$('ideas').innerHTML = IDEAS.map((p) => `<button type="button" data-id="${p.id}">${p.emoji}  ${p.name} ${money(p.price)}</button>`).join('');
$('ideas').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const idea = IDEAS.find((p) => p.id === btn.dataset.id);
  const existing = state.items.find((i) => i.id === idea.id);
  if (existing) existing.qty += 1; else state.items.push({ ...idea, qty: 1 });
  render();
});

$('x-caja').addEventListener('change', (e) => { state.extras.caja = e.target.checked; render(); });
$('x-tarjeta').addEventListener('change', (e) => { state.extras.tarjeta = e.target.checked; render(); });

render();