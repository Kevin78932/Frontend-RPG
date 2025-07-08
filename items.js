const apiBase = 'http://localhost:3000';

// Cargar ítems y mostrar en tabla
async function cargarItems() {
  const res = await fetch(`${apiBase}/items`);
  const items = await res.json();

  const tbody = document.getElementById('tabla-items');
  tbody.innerHTML = '';

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nombre}</td>
      <td>${item.tipo}</td>
      <td>${item.poder}</td>
      <td>
        <button onclick="editarItem(${item.id})">Editar</button>
        <button onclick="eliminarItem(${item.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Crear o actualizar ítem
document.getElementById('form-item').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('item-id').value;
  const nombre = document.getElementById('nombre').value;
  const tipo = document.getElementById('tipo').value;
  const poder = Number(document.getElementById('poder').value);

  const data = { nombre, tipo, poder };
  let url = `${apiBase}/items`;
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
    cargarItems();
    limpiarFormulario();
  } else {
    alert('Error al guardar ítem');
  }
});

// Editar ítem (llenar formulario)
async function editarItem(id) {
  const res = await fetch(`${apiBase}/items/${id}`);
  if (!res.ok) return alert('Ítem no encontrado');
  const item = await res.json();

  document.getElementById('item-id').value = item.id;
  document.getElementById('nombre').value = item.nombre;
  document.getElementById('tipo').value = item.tipo;
  document.getElementById('poder').value = item.poder;

  document.getElementById('cancelar').style.display = 'inline-block';
}

// Cancelar edición
document.getElementById('cancelar').addEventListener('click', () => {
  limpiarFormulario();
});

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById('item-id').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('tipo').value = '';
  document.getElementById('poder').value = '';
  document.getElementById('cancelar').style.display = 'none';
}

// Eliminar ítem
async function eliminarItem(id) {
  if (!confirm('¿Eliminar ítem?')) return;
  const res = await fetch(`${apiBase}/items/${id}`, { method: 'DELETE' });
  if (res.ok) {
    cargarItems();
  } else {
    alert('Error al eliminar ítem');
  }
}

// Cargar datos al iniciar
window.onload = () => {
  cargarItems();
};
