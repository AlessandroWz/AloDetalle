const form = document.getElementById('cotizacion');
const msg = document.getElementById('qmsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  msg.className = 'qmsg';
  const d = Object.fromEntries(new FormData(form));

  if (d.empresa.trim().length < 2) return fail('Ingresa el nombre de la empresa.', form.empresa);
  if (d.contacto.trim().length < 2) return fail('Ingresa el nombre del contacto.', form.contacto);
  if (!/^\S+@\S+\.\S+$/.test(d.email)) return fail('Ingresa un email corporativo válido.', form.email);
  if (!(Number(d.cantidad) >= 1)) return fail('Indica cuántos regalos necesitas.', form.cantidad);

  // TODO: conecta aquí tu backend
  // fetch('/api/cotizaciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
  console.log('Cotización enviada', d);
  msg.textContent = '¡Listo! Te responderemos en menos de 24 horas.';
  msg.classList.add('ok');
  form.reset();
});

function fail(text, field) {
  msg.textContent = text;
  field.focus();
}