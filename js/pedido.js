// Checkout: solo con sesión y con productos en el carrito
let logged = false, state = null;
try { logged = localStorage.getItem('loggedIn') === 'true'; } catch (e) {}
try { state = JSON.parse(localStorage.getItem('cartState')); } catch (e) {}
if (!logged) window.location.replace('login.html');
else if (!state || !Array.isArray(state.items) || state.items.length === 0) window.location.replace('carrito.html');

const $ = (id) => document.getElementById(id);
const money = (n) => 'S/.' + n;
const EXTRA_PRICE = { caja: 25, tarjeta: 15 };
const DISCOUNT = 40; // igual que en carrito.js (demo)

// ---------- Resumen del pedido ----------
const orderItems = (state && state.items) || [];
const extras = (state && state.extras) || {};
const subtotal = orderItems.reduce((n, i) => n + i.price * i.qty, 0);
const extraTotal = (extras.caja ? EXTRA_PRICE.caja : 0) + (extras.tarjeta ? EXTRA_PRICE.tarjeta : 0);
const total = subtotal - DISCOUNT + extraTotal;

$('sum-items').innerHTML = orderItems.map((i) => `
  <div class="sum__item">
    <div class="sum__img" aria-hidden="true">${i.emoji}</div>
    <div><h3>${i.name}</h3><p>${i.qty > 1 ? 'x' + i.qty + ' · ' : ''}${i.sub}</p></div>
    <b>${money(i.price * i.qty)}</b>
  </div>`).join('');
$('s-sub').textContent = money(subtotal);
$('s-dis').textContent = '-' + money(DISCOUNT);
$('s-total').textContent = money(total);
$('s-caja-row').hidden = !extras.caja;
$('s-tar-row').hidden = !extras.tarjeta;
$('co-btn').textContent = 'Confirmar pedido - S/. ' + total;

// ---------- Fecha mínima: hoy ----------
const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
$('fecha').min = today.toISOString().slice(0, 10);

// ---------- Método de pago ----------
const form = $('order-form');
function togglePay() {
  const tarjeta = form.pago.value === 'tarjeta';
  $('card-fields').hidden = !tarjeta;
  $('other-note').hidden = tarjeta;
}
form.querySelectorAll('input[name="pago"]').forEach((r) => r.addEventListener('change', togglePay));
togglePay();

// Formato de tarjeta y vencimiento
$('cc-num').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
});
$('cc-exp').addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
  e.target.value = v;
});
$('cc-cvv').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });

// ---------- Indicador de pasos (según la sección donde estés escribiendo) ----------
form.querySelectorAll('section[data-step]').forEach((sec) => {
  sec.addEventListener('focusin', () => {
    const n = Number(sec.dataset.step);
    document.querySelectorAll('.steps li[data-s]').forEach((li) => li.classList.toggle('on', Number(li.dataset.s) <= n));
  });
});

// ---------- Validación y confirmación ----------
function bad(el, msg) {
  document.querySelectorAll('.bad').forEach((x) => x.classList.remove('bad'));
  el.classList.add('bad');
  $('co-err').textContent = msg;
  el.focus();
  return false;
}

function validate() {
  $('co-err').textContent = '';
  document.querySelectorAll('.bad').forEach((x) => x.classList.remove('bad'));
  const v = (id) => $(id).value.trim();

  if (v('nombre').length < 2) return bad($('nombre'), 'Ingresa tu nombre.');
  if (v('apellido').length < 2) return bad($('apellido'), 'Ingresa tu apellido.');
  if (!/^\S+@\S+\.\S+$/.test(v('email'))) return bad($('email'), 'Ingresa un correo electrónico válido.');
  if (!/^\+?[\d\s]{9,15}$/.test(v('celular'))) return bad($('celular'), 'Ingresa un celular válido (ej. +51 999 999 999).');
  if (v('direccion').length < 5) return bad($('direccion'), 'Ingresa tu dirección completa.');
  if (v('distrito').length < 2) return bad($('distrito'), 'Ingresa el distrito.');
  if (!v('fecha')) return bad($('fecha'), 'Elige cuándo quieres que llegue.');
  if (v('fecha') < $('fecha').min) return bad($('fecha'), 'La fecha de entrega no puede ser pasada.');

  if (form.pago.value === 'tarjeta') {
    const num = v('cc-num').replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(num)) return bad($('cc-num'), 'Ingresa un número de tarjeta válido.');
    if (v('cc-name').length < 3) return bad($('cc-name'), 'Ingresa el nombre que aparece en la tarjeta.');
    const m = v('cc-exp').match(/^(\d{2})\/(\d{2})$/);
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return bad($('cc-exp'), 'Ingresa el vencimiento como MM/AA.');
    const now = new Date();
    if (2000 + Number(m[2]) < now.getFullYear() || (2000 + Number(m[2]) === now.getFullYear() && Number(m[1]) < now.getMonth() + 1)) {
      return bad($('cc-exp'), 'La tarjeta está vencida.');
    }
    if (!/^\d{3,4}$/.test(v('cc-cvv'))) return bad($('cc-cvv'), 'Ingresa el CVV (3 o 4 dígitos).');
  }
  return true;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate()) return;

  $('co-btn').disabled = true;
  try {
    // Nunca se guardan ni se envían los datos de la tarjeta en esta demo.
    const order = {
      cliente: { nombre: $('nombre').value.trim(), apellido: $('apellido').value.trim(), email: $('email').value.trim(), celular: $('celular').value.trim() },
      entrega: { direccion: $('direccion').value.trim(), distrito: $('distrito').value.trim(), referencia: $('referencia').value.trim(), fecha: $('fecha').value },
      pago: form.pago.value,
      items: orderItems, extras, total,
    };

    // TODO: conecta aquí tu backend (y una pasarela de pago real para las tarjetas)
    // const res = await fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    // if (!res.ok) throw new Error('No se pudo crear el pedido');
    console.log('Pedido confirmado', order);

    const code = 'ALO-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-4);
    try { localStorage.removeItem('cartState'); localStorage.setItem('cartItems', '0'); } catch (err) {}

    // Fecha elegida por el cliente, en texto legible (ej. "miércoles, 12 de noviembre")
    const [fy, fm, fd] = order.entrega.fecha.split('-').map(Number);
    const fechaTxt = new Date(fy, fm - 1, fd).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });

    $('co').classList.add('co--done');
    $('co').innerHTML = `
      <div class="done">
        <div class="done__icon" aria-hidden="true">🎁</div>
        <p class="done__code">PEDIDO # ${code}</p>
        <h1>¡Tu detalle está<br>en camino! 🚀</h1>
        <p class="done__msg">Recibimos tu pedido con éxito. Estamos preparando cada detalle con el cuidado que merece la persona especial en tu vida.</p>
        <p class="done__mail">Enviaremos los detalles a <strong id="d-mail"></strong></p>
        <div class="track" role="group" aria-label="Estado del pedido">
          <h2>ESTADO DEL PEDIDO</h2>
          <ol>
            <li class="on"><span>✓</span>Confirmado</li>
            <li class="on"><span>📦</span>Preparando</li>
            <li><span>🚚</span>En camino</li>
            <li><span>🏠</span>Entregado</li>
          </ol>
          <p class="track__eta">Entrega estimada: <b id="d-fecha"></b></p>
        </div>
        <div class="done__btns">
          <a class="done__b done__b--gold" href="index.html">Seguir comprando</a>
          <a class="done__b done__b--ghost" href="perfil.html">Ver mi perfil</a>
        </div>
      </div>`;
    $('d-mail').textContent = order.cliente.email;
    $('d-fecha').textContent = fechaTxt;
    const badge = $('cart-count'); if (badge) badge.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    $('co-err').textContent = err.message;
    $('co-btn').disabled = false;
  }
});