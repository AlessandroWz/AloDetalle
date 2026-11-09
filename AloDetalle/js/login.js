const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorEl = document.getElementById('error');
const submit = document.getElementById('submit');
const toggle = document.getElementById('pw-toggle');

// Mostrar / ocultar contraseña
toggle.addEventListener('click', () => {
  const show = password.type === 'password';
  password.type = show ? 'text' : 'password';
  toggle.textContent = show ? 'Ocultar' : 'Ver';
  toggle.setAttribute('aria-pressed', String(show));
  toggle.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
});

// Envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errorEl.textContent = 'Ingresa un correo electrónico válido.';
    return email.focus();
  }
  if (password.value.length < 6) {
    errorEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    return password.focus();
  }

  submit.disabled = true;
  try {
    // TODO: conecta aquí tu backend
    // const res = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     email: email.value,
    //     password: password.value,
    //     remember: form.remember.checked,
    //   }),
    // });
    // if (!res.ok) throw new Error('Credenciales incorrectas');

    // --- SESIÓN SIMULADA (solo para la demo; se reemplaza cuando exista el backend) ---
    console.log('Login enviado', { email: email.value, remember: form.remember.checked });
    localStorage.setItem('loggedIn', 'true');
    window.location.href = 'index.html';
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    submit.disabled = false;
  }
});

document.getElementById('google').addEventListener('click', () => {
  // TODO: inicia el flujo OAuth de Google
  console.log('Login con Google');
});