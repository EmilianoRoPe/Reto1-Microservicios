

import React, { useState } from 'react';

const API_URL = 'http://localhost:8080/v1/api';

function App() {
  const [view, setView] = useState('startups');
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Panel CRUD Startups & Technologies</h1>
      <nav style={{ marginBottom: 24 }}>
        <button onClick={() => setView('startups')}>Startups</button>
        <button onClick={() => setView('technologies')}>Technologies</button>
      </nav>
      {view === 'startups' ? <CrudPanel entity="startups" /> : <CrudPanel entity="technologies" />}
      <footer style={{ marginTop: 32, fontSize: 12, color: '#888' }}>
        <p>Conectado a: <code>{API_URL}</code></p>
      </footer>
    </div>
  );
}

function CrudPanel({ entity }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/${entity}/read`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : [data]);
    } catch (e) {
      setError('Error al cargar datos');
    }
    setLoading(false);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId
        ? `${API_URL}/${entity}/update/${editId}`
        : `${API_URL}/${entity}/create`;
      // Convierte fundingAmount a número si es startups
      let body = { ...form };
      if (entity === 'startups' && body.fundingAmount !== undefined) {
        body.fundingAmount = Number(body.fundingAmount);
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error en la operación');
      setForm({});
      setEditId(null);
      fetchItems();
    } catch (e) {
      setError('Error al guardar');
    }
    setLoading(false);
  };

  const handleEdit = item => {
    setForm(item);
    setEditId(item.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar registro?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/${entity}/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchItems();
    } catch (e) {
      setError('Error al eliminar');
    }
    setLoading(false);
  };

  // Campos por entidad
  const fields = entity === 'startups'
    ? [
        { name: 'name', label: 'Nombre' },
        { name: 'foundedAt', label: 'Fundada en' },
        { name: 'location', label: 'Ubicación' },
        { name: 'category', label: 'Categoría' },
        { name: 'fundingAmount', label: 'Financiamiento' },
      ]
    : [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Nombre' },
        { name: 'sector', label: 'Sector' },
        { name: 'description', label: 'Descripción' },
        { name: 'level', label: 'Nivel' },
      ];

  // Cargar datos al montar
  React.useEffect(() => {
    fetchItems();
    setForm({});
    setEditId(null);
    setError('');
  }, [entity]);

  return (
    <div>
      <h2>{entity === 'startups' ? 'Startups' : 'Technologies'}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        {fields.map(f => (
          <input
            key={f.name}
            name={f.name}
            placeholder={f.label}
            value={form[f.name] || ''}
            onChange={handleChange}
            required
            style={{ marginRight: 8 }}
          />
        ))}
        <button type="submit" disabled={loading}>
          {editId ? 'Actualizar' : 'Crear'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setForm({}); setEditId(null); }}>
            Cancelar
          </button>
        )}
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={fetchItems} disabled={loading} style={{ marginBottom: 8 }}>Refrescar</button>
      {loading ? <p>Cargando...</p> : (
        <table border="1" cellPadding="6" style={{ width: '100%', background: '#fff' }}>
          <thead>
            <tr>
              {/* Mostrar primero los campos definidos en fields, luego los extras */}
              {fields.map(f => <th key={f.name}>{f.label}</th>)}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={fields.length + 2} style={{ textAlign: 'center', color: '#888' }}>Sin datos</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.id || item._id || Math.random()}>
                  {/* Mostrar primero los campos definidos en fields, luego los extras */}
                  {fields.map(f => {
                    let value =
                      item[f.name] ??
                      item[f.name.toLowerCase()] ??
                      item[f.name.replace(/([A-Z])/g, '_$1').toLowerCase()] ??
                      item[f.name === 'id' ? '_id' : ''] ??
                      '';
                    // Si es la columna 'level', buscar también adoptionLevel y adoption_level
                    if (f.name === 'level' && !value) {
                      value = item['adoptionLevel'] ?? item['adoption_level'] ?? item['adoptionlevel'] ?? '';
                    }
                    return <td key={f.name}>{value}</td>;
                  })}
                  <td>
                    <button onClick={() => handleEdit(item)}>Editar</button>
                    <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
