
const loginCard = document.querySelector('#login-card');
const casesCard = document.querySelector('#cases-card');
const loginForm = document.querySelector('#login-form');
const loginStatus = document.querySelector('#login-status');
const casesStatus = document.querySelector('#cases-status');
const casesList = document.querySelector('#cases-list');
const logout = document.querySelector('#logout');

async function api(url, options = {}) {
  const r = await fetch(url, {
    credentials: 'same-origin',
    ...options
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Error(d.error || `Error HTTP ${r.status}`);
  return d;
}

function showLogin() {
  loginCard.classList.remove('hide');
  casesCard.classList.add('hide');
  logout.classList.add('hide');
}

async function loadCases() {
  casesStatus.textContent = 'Cargando casos…';
  casesList.replaceChildren();

  try {
    const d = await api('/api/admin/casos');
    const items = d.casos || [];

    casesStatus.textContent = items.length
      ? `${items.length} caso(s) en total.`
      : 'No hay casos.';

    for (const c of items) {
      const a = document.createElement('article');
      a.className = 'case';

      const meta = document.createElement('div');
      meta.className = 'story-meta';
      meta.textContent =
        `${c.categoria} · ${c.ubicacion || 'Sin ubicación'} · ` +
        `${c.creado_en ? new Date(c.creado_en).toLocaleString('es-ES') : ''} · ` +
        `${c.anonimo ? 'Anónimo' : 'No marcado como anónimo'} · Estado: ${c.estado}`;

      const h = document.createElement('h3');
      h.textContent = c.titulo;

      const p = document.createElement('p');
      p.textContent = c.historia;

      const acts = document.createElement('div');
      acts.className = 'actions';

      if (c.estado === 'pendiente') {
        for (const [label, state, cls] of [
          ['Aprobar publicación', 'publicado', 'approve'],
          ['Rechazar', 'rechazado', 'reject']
        ]) {
          const b = document.createElement('button');
          b.textContent = label;
          b.className = cls;

          b.onclick = async () => {
            if (state === 'rechazado' &&
                !confirm('¿Rechazar este caso?')) return;

            b.disabled = true;

            try {
              await api(`/api/admin/${c.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: state })
              });
              await loadCases();
            } catch (e) {
              casesStatus.textContent = e.message;
              b.disabled = false;
            }
          };

          acts.append(b);
        }
      }

      if (c.estado === 'publicado') {
        const published = document.createElement('p');
        published.textContent = '✅ Caso publicado';
        a.append(meta, h, p, published);
      } else {
        a.append(meta, h, p);
      }

      const del = document.createElement('button');
      del.textContent = '🗑️ Eliminar caso';
      del.className = 'reject';

      del.onclick = async () => {
        if (!confirm(
          `¿Eliminar definitivamente «${c.titulo}»? Esta acción no se puede deshacer.`
        )) return;

        del.disabled = true;

        try {
          await api(`/api/admin/${c.id}`, { method: 'DELETE' });
          await loadCases();
          casesStatus.textContent = 'Caso eliminado definitivamente.';
        } catch (e) {
          casesStatus.textContent = `No se pudo eliminar: ${e.message}`;
          del.disabled = false;
        }
      };

      acts.append(del);
      a.append(acts);
      casesList.append(a);
    }
  } catch (e) {
    casesStatus.textContent = e.message;
    if (/autorizado/i.test(e.message)) showLogin();
  }
}

function showAdmin() {
  loginCard.classList.add('hide');
  casesCard.classList.remove('hide');
  logout.classList.remove('hide');
  loadCases();
}

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const b = loginForm.querySelector('button');
  b.disabled = true;

  try {
    await api('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: document.querySelector('#password').value
      })
    });
    loginStatus.textContent = 'Acceso correcto.';
    showAdmin();
  } catch (err) {
    loginStatus.textContent = err.message;
  } finally {
    b.disabled = false;
  }
});

logout.onclick = async () => {
  try {
    await api('/api/login', { method: 'DELETE' });
  } catch (_) {}
  showLogin();
  loginForm.reset();
  loginStatus.textContent = 'Sesión cerrada.';
};

document.querySelector('#refresh').onclick = loadCases;
