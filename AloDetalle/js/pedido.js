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
const items = (state && state.items) || [];
const extras = (state && state.extras) || {};
const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
const extraTotal = (extras.caja ? EXTRA_PRICE.caja : 0) + (extras.tarjeta ? EXTRA_PRICE.tarjeta : 0);
const total = subtotal - DISCOUNT + extraTotal;

$('sum-items').innerHTML = items.map((i) => `
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
      items, extras, total,
    };

    // TODO: conecta aquí tu backend (y una pasarela de pago real para las tarjetas)
    // const res = await fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    // if (!res.ok) throw new Error('No se pudo crear el pedido');
    console.log('Pedido confirmado', order);

    const code = 'AD-' + String(Date.now()).slice(-6);
    try { localStorage.removeItem('cartState'); localStorage.setItem('cartItems', '0'); } catch (err) {}

    $('co').innerHTML = `
      <div class="done">
        <div class="big" aria-hidden="true">🎉</div>
        <h1>¡Pedido confirmado!</h1>
        <p>Gracias, <span id="d-name"></span>. Enviaremos los detalles a <strong id="d-mail"></strong>.</p>
        <p class="num">N° de pedido: <strong>${code}</strong></p>
        <a href="index.html">Volver a la tienda</a>
      </div>`;
    $('d-name').textContent = order.cliente.nombre;
    $('d-mail').textContent = order.cliente.email;
    const badge = $('cart-count'); if (badge) badge.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    $('co-err').textContent = err.message;
    $('co-btn').disabled = false;
  }
});