const form = document.getElementById('register-form');
const errorEl = document.getElementById('error');
const submit = document.getElementById('submit');
const password = document.getElementById('password');
const toggle = document.getElementById('pw-toggle');

// Mostrar / ocultar contraseña
toggle.addEventListener('click', () => {
  const show = password.type === 'password';
  password.type = show ? 'text' : 'password';
  toggle.textContent = show ? 'Ocultar' : 'Ver';
  toggle.setAttribute('aria-pressed', String(show));
  toggle.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
});

function fail(message, field) {
  errorEl.textContent = message;
  if (field) field.focus();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  const nombre = form.nombre;
  const apellido = form.apellido;
  const email = form.email;
  const telefono = form.telefono;

  if (nombre.value.trim().length < 2) return fail('Ingresa tu nombre.', nombre);
  if (apellido.value.trim().length < 2) return fail('Ingresa tu apellido.', apellido);
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return fail('Ingresa un correo electrónico válido.', email);
  if (!/^\+?[\d\s]{9,15}$/.test(telefono.value.trim())) return fail('Ingresa un número de teléfono válido (ej. +51 999 999 999).', telefono);
  if (password.value.length < 8) return fail('La contraseña debe tener al menos 8 caracteres.', password);
  if (!form.terminos.checked) return fail('Debes aceptar los Términos de servicio y la Política de privacidad.', form.terminos);

  submit.disabled = true;
  try {
    const datos = {
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      email: email.value.trim(),
      telefono: telefono.value.trim(),
      password: password.value,
      marketing: form.marketing.checked,
    };

    // TODO: conecta aquí tu backend
    // const res = await fetch('/api/registro', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(datos),
    // });
    // if (!res.ok) throw new Error('No se pudo crear la cuenta');
    // window.location.href = 'login.html';

    console.log('Registro enviado', { ...datos, password: '***' });
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    submit.disabled = false;
  }
});

document.getElementById('google').addEventListener('click', () => {
  // TODO: inicia el flujo OAuth de Google
  console.log('Registro con Google');
});