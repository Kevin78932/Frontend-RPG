const apiBase = 'http://localhost:3000';

// Traer clases para el select
async function cargarClases() {
  const res = await fetch(`${apiBase}/clases`);
  const clases = await res.json();
  const select = document.getElementById('claseId');
  select.innerHTML = '';
  clases.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.nombre;
    select.appendChild(option);
  });
}

// Cargar personajes y mostrar en tabla
async function cargarPersonajes() {
  const res = await fetch(`${apiBase}/personajes`);
  const personajes = await res.json();
  const tbody = document.getElementById('tabla-personajes');
  tbody.innerHTML = '';

  personajes.forEach(p => {
    const cantidadItems = p.items.length;
    const nombresItems = p.items.map(inv => inv.item.nombre).join(', ');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.nivel}</td>
      <td>${p.clase?.nombre || ''}</td>
      <td>${cantidadItems} (${nombresItems})</td>
      <td>
        <button onclick="editarPersonaje(${p.id})">Editar</button>
        <button onclick="eliminarPersonaje(${p.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Crear o actualizar personaje
document.getElementById('form-personaje').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('personaje-id').value;
  const nombre = document.getElementById('nombre').value;
  const nivel = Number(document.getElementById('nivel').value);
  const claseId = Number(document.getElementById('claseId').value);

  const data = { nombre, nivel, claseId };
  let url = `${apiBase}/personajes`;
  let method = 'POST';

  if (id) {
    url += `/${id}`;
    method = 'PUT';
  }

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    cargarPersonajes();
    limpiarFormulario();
  } else {
    alert('Error al guardar personaje');
  }
});

// Editar personaje (llenar formulario)
async function editarPersonaje(id) {
  const res = await fetch(`${apiBase}/personajes/${id}`);
  if (!res.ok) return alert('Personaje no encontrado');
  const p = await res.json();

  document.getElementById('personaje-id').value = p.id;
  document.getElementById('nombre').value = p.nombre;
  document.getElementById('nivel').value = p.nivel;
  document.getElementById('claseId').value = p.claseId;

  document.getElementById('cancelar').style.display = 'inline-block';
}

// Cancelar edición
document.getElementById('cancelar').addEventListener('click', () => {
  limpiarFormulario();
});

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById('personaje-id').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('nivel').value = '';
  document.getElementById('claseId').selectedIndex = 0;
  document.getElementById('cancelar').style.display = 'none';
}

// Eliminar personaje
async function eliminarPersonaje(id) {
  if (!confirm('¿Eliminar personaje?')) return;
  const res = await fetch(`${apiBase}/personajes/${id}`, { method: 'DELETE' });
  if (res.ok) {
    cargarPersonajes();
  } else {
    alert('Error al eliminar personaje');
  }
}

// Al cargar la página
window.onload = () => {
  cargarClases().then(() => {
    cargarPersonajes();
  });
};
