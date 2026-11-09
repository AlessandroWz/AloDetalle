// ---------- Preguntas (del diseño de Figma) ----------
const QUESTIONS = [
  { id: 'dest', title: '¿Para quién es este regalo?', sub: 'Cuéntanos sobre el vínculo que tienes con esa persona especial.',
    opts: [['pareja', '💕', 'Mi pareja', 'Amor romántico'], ['amigo', '👥', 'Un amigo/a', 'Amistad especial'], ['familia', '👨‍👩‍👦', 'Mi familia', 'Lazos de sangre']] },
  { id: 'intencion', title: '¿Cuál es tu intención con este regalo?', sub: 'El propósito emocional define qué tipo de experiencia quieres crear.',
    opts: [['celebrar', '🎉', 'Celebrar', 'Un logro o hito especial'], ['reconciliar', '🕊️', 'Reconciliar', 'Sanar y reconectar'], ['sorprender', '✨', 'Sorprender', 'Sin motivo especial']] },
  { id: 'personalidad', title: '¿Cómo describirías la personalidad de esa persona?', sub: 'Su esencia nos ayuda a encontrar el regalo que más resuene con ella.', cols: 2,
    opts: [['relajada', '🌊', 'Relajada', 'Tranquila, zen, disfruta el silencio'], ['social', '🌟', 'Social', 'Extrovertida, alegre, energía alta'], ['ambiciosa', '🚀', 'Ambiciosa', 'Enfocada, líder, siempre avanzando'], ['mistica', '🔮', 'Mística', 'Espiritual, sensible, introspectiva']] },
  { id: 'estetica', title: '¿Qué estética prefiere esa persona?', sub: 'El estilo visual dice mucho sobre lo que alguien valora en un regalo.',
    opts: [['minimalista', '⬜', 'Minimalista', 'Menos es más, orden y calma'], ['elegante', '💎', 'Elegante', 'Premium, refinado, sin excesos'], ['creativa', '🎨', 'Creativa', 'Colorida, original, artística']] },
  { id: 'emocion', title: '¿Qué quieres que sienta al abrir el regalo?', sub: 'La emoción que despierte el regalo es lo que más se recuerda.', last: true,
    opts: [['sorpresa', '🤩', 'Sorpresa total', 'Que no se lo espera para nada'], ['paz', '☮️', 'Paz profunda', 'Que se sienta cuidada y amada'], ['nostalgia', '🥹', 'Nostalgia bonita', 'Que recuerde algo especial juntos']] },
];

// ---------- Catálogo de demostración y etiquetas de cada pack ----------
const PACKS = [
  { id: 'kit-conexion', name: 'Kit Conexión Romántica', price: 189, emoji: '💕', bg: '#eed9d9', desc: 'Aromaterapia zen, chocolate artesanal y una experiencia de conexión para dos. Diseñado para generar sorpresa genuina.',
    tags: { dest: ['pareja'], intencion: ['sorprender', 'reconciliar'], personalidad: ['mistica', 'relajada'], estetica: ['elegante'], emocion: ['sorpresa', 'paz'] } },
  { id: 'bienestar-calma', name: 'Pack Bienestar Calma', price: 129, emoji: '🌿', bg: '#e1dced', desc: 'Sales de baño premium, vela de soya y ritual de cuidado personal, ideal para personalidades que valoran el silencio y la introspección.',
    tags: { dest: ['pareja', 'amigo', 'familia'], intencion: ['reconciliar', 'sorprender'], personalidad: ['relajada', 'mistica'], estetica: ['minimalista'], emocion: ['paz'] } },
  { id: 'nostalgia', name: 'Caja Nostalgia Especial', price: 159, emoji: '✨', bg: '#e1d9c9', desc: 'Una caja personalizada con fotos, objetos simbólicos y mensaje grabado. Para crear un recuerdo eterno que evoque emociones profundas.',
    tags: { dest: ['pareja', 'familia', 'amigo'], intencion: ['celebrar', 'reconciliar'], personalidad: ['social', 'mistica'], estetica: ['creativa'], emocion: ['nostalgia'] } },
  { id: 'cumple', name: 'Cumpleaños Especial', price: 149, emoji: '🎂', bg: '#f7d7ec', desc: 'Detalles de celebración, dulces y una tarjeta personalizada para festejar un día importante con alegría.',
    tags: { dest: ['amigo', 'familia', 'pareja'], intencion: ['celebrar'], personalidad: ['social', 'ambiciosa'], estetica: ['creativa', 'elegante'], emocion: ['sorpresa'] } },
  { id: 'premium-elite', name: 'Caja Premium Élite', price: 349, emoji: '💎', bg: '#dfe6f1', desc: 'Perfumería de nicho, joyería artesanal y caja con grabado personalizado para quien aprecia lo exclusivo.',
    tags: { dest: ['pareja', 'familia'], intencion: ['celebrar', 'sorprender'], personalidad: ['ambiciosa'], estetica: ['elegante'], emocion: ['sorpresa'] } },
  { id: 'morning-ritual', name: 'Morning Ritual Box', price: 99, emoji: '☕', bg: '#d3e4fb', desc: 'Café, té y pequeños detalles para empezar el día con calma, en una caja sencilla y bien cuidada.',
    tags: { dest: ['amigo', 'familia', 'pareja'], intencion: ['sorprender', 'reconciliar'], personalidad: ['relajada'], estetica: ['minimalista'], emocion: ['paz'] } },
  { id: 'flores-aromas', name: 'Kit Flores & Aromas', price: 79, emoji: '🌸', bg: '#ede8df', desc: 'Flores y aromas suaves para regalar un momento delicado y lleno de significado.',
    tags: { dest: ['pareja', 'familia'], intencion: ['sorprender', 'reconciliar'], personalidad: ['mistica', 'relajada'], estetica: ['minimalista', 'creativa'], emocion: ['paz', 'nostalgia'] } },
];

// ---------- Recomendación: puntúa cuántas respuestas coinciden con las etiquetas del pack ----------
function recommend(answers) {
  const total = QUESTIONS.length;
  return PACKS
    .map((p, i) => ({ p, i, score: QUESTIONS.reduce((n, q) => n + (p.tags[q.id].includes(answers[q.id]) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, 3)
    .map(({ p, score }) => ({ ...p, match: Math.round(55 + (score / total) * 43) }));
}

// ---------- Interfaz ----------
const quiz = document.getElementById('quiz');
const view = document.getElementById('view');
let step = 0, answers = {}, timer = null;

function setView(v) { quiz.dataset.view = v; }
function focusTitle() { const t = view.querySelector('[tabindex="-1"]'); if (t) t.focus({ preventScroll: true }); }

function renderQuestion() {
  const q = QUESTIONS[step];
  setView('q');
  view.innerHTML = `
    <div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${QUESTIONS.length}" aria-valuenow="${step + 1}"><i style="width:${((step + 1) / QUESTIONS.length) * 100}%"></i></div>
    <p class="kicker">${q.last ? 'Último paso' : `Paso ${step + 1} de ${QUESTIONS.length}`}</p>
    <h1 class="q-title" tabindex="-1">${q.title}</h1>
    <p class="q-sub">${q.sub}</p>
    <div class="opts ${q.cols === 2 ? 'opts--2' : ''}">
      ${q.opts.map(([v, e, t, d]) => `<button type="button" class="opt ${answers[q.id] === v ? 'sel' : ''}" data-v="${v}"><span class="e" aria-hidden="true">${e}</span><b>${t}</b><small>${d}</small></button>`).join('')}
    </div>
    <button type="button" class="back" id="back">← ${step === 0 ? 'Inicio' : 'Atrás'}</button>`;
  focusTitle();
}

function renderLoading() {
  setView('q');
  view.innerHTML = `
    <div class="loading" role="status">
      <div class="gift" aria-hidden="true">🎁</div>
      <div class="ring" aria-hidden="true"></div>
      <h2 tabindex="-1">Finalizando recomendaciones...</h2>
      <p>Esto tomará un momento.</p>
    </div>`;
  timer = setTimeout(renderResults, 2200);
}

function renderResults() {
  const recs = recommend(answers);
  setView('results');
  view.innerHTML = `
    <section class="res">
      <p class="kicker">Análisis completado</p>
      <h1 tabindex="-1">Tus recomendaciones <em>personalizadas</em></h1>
      <p class="q-sub">Basado en el perfil emocional que nos compartiste, estos packs tienen la mayor probabilidad de impactar.</p>
      <div class="cards">
        ${recs.map((r, i) => `
          <article class="rc ${i === 0 ? 'best' : ''}">
            ${i === 0 ? '<div class="tab">Mejor elección</div>' : ''}
            <div class="img" style="--c:${r.bg}" aria-hidden="true">${r.emoji}</div>
            <div class="body">
              <span class="match">${r.match}% de compatibilidad</span>
              <h3>${r.name}</h3>
              <p>${r.desc}</p>
              <span class="price">S/. ${r.price}</span>
              <button type="button" class="pick" data-id="${r.id}">Elegir este pack →</button>
            </div>
          </article>`).join('')}
      </div>
      <button type="button" class="again" id="again">🔄 Repetir el quiz</button>
    </section>`;
  focusTitle();
  window.scrollTo({ top: 0 });
}

// El carrito solo existe con sesión; un invitado pasa primero por el login.
function pick(id) {
  const p = PACKS.find((x) => x.id === id);
  let logged = false;
  try { logged = localStorage.getItem('loggedIn') === 'true'; } catch (e) {}
  if (!logged) { window.location.href = 'login.html'; return; }
  let st = null;
  try { st = JSON.parse(localStorage.getItem('cartState')); } catch (e) {}
  if (!st || !Array.isArray(st.items)) st = { items: [], extras: { caja: false, tarjeta: false } };
  const ex = st.items.find((i) => i.id === p.id);
  if (ex) ex.qty += 1;
  else st.items.push({ id: p.id, name: p.name, sub: 'Recomendado por el asistente', price: p.price, qty: 1, emoji: p.emoji });
  try {
    localStorage.setItem('cartState', JSON.stringify(st));
    localStorage.setItem('cartItems', String(st.items.reduce((n, i) => n + i.qty, 0)));
  } catch (e) {}
  window.location.href = 'carrito.html';
}

view.addEventListener('click', (e) => {
  const opt = e.target.closest('.opt');
  if (opt) {
    answers[QUESTIONS[step].id] = opt.dataset.v;
    view.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', b === opt));
    setTimeout(() => { if (step < QUESTIONS.length - 1) { step += 1; renderQuestion(); } else renderLoading(); }, 220);
    return;
  }
  if (e.target.closest('#back')) {
    if (step === 0) window.location.href = 'index.html';
    else { step -= 1; renderQuestion(); }
    return;
  }
  const pk = e.target.closest('.pick');
  if (pk) { pick(pk.dataset.id); return; }
  if (e.target.closest('#again')) { clearTimeout(timer); answers = {}; step = 0; renderQuestion(); }
});
//comprobar
console.log("ASISTENTE JS CARGADO");
console.log("QUIZ:", quiz);
console.log("VIEW:", view);
//iniciar
renderQuestion();

