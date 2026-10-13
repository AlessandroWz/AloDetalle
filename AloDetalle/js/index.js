// Menú móvil
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Sesión (demo). Cuando exista el backend, reemplaza esto por la respuesta real del servidor.
// Para probar como usuario con sesión, ejecuta en la consola: localStorage.setItem('loggedIn', 'true')
let isLoggedIn = false;
try { isLoggedIn = localStorage.getItem('loggedIn') === 'true'; } catch (e) {}

const cartLink = document.getElementById('cart-link');
const loginLink = document.getElementById('login-link');
cartLink.hidden = !isLoggedIn;   // el carrito solo se ve con sesión
loginLink.hidden = isLoggedIn;   // el invitado ve "Iniciar Sesión"

// Contador del carrito (demo; luego se conecta al backend)
const count = document.getElementById('cart-count');
let items = 0;
try { items = Number(localStorage.getItem('cartItems')) || 0; } catch (e) {}

function renderCart() {
  count.textContent = String(items);
  count.hidden = items === 0; // sin productos, no se muestra el número
  try { localStorage.setItem('cartItems', String(items)); } catch (e) {}
}

document.querySelectorAll('.js-add').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!isLoggedIn) {
      window.location.href = 'login.html';
      return;
    }
    items += 1;
    renderCart();
  });
});

renderCart();