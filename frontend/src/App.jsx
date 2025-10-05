// Utilidad para formatear fecha a 'dd/MMMM/yyyy' en español
function formatDateES(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date)) return isoString;
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = meses[date.getMonth()];
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
}


import React, { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/v1/api';

function App() {
  const [view, setView] = useState('startups');
  return (
    <div className="app-root">
      <header className="navbar">
        <h1 className="navbar-title">Panel CRUD Startups & Technologies</h1>
        <nav className="navbar-nav">
          <button
            className={view === 'startups' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setView('startups')}
          >
            Startups
          </button>
          <button
            className={view === 'technologies' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setView('technologies')}
          >
            Technologies
          </button>
        </nav>
      </header>
      <div className="main-content">
        {view === 'startups' ? <CrudPanel entity="startups" /> : <CrudPanel entity="technologies" />}
      </div>
    </div>
  );
}

function CrudPanel({ entity }) {
  // Estado para errores de validación por campo
  const [fieldErrors, setFieldErrors] = useState({});

  // Reglas de validación por campo
  const validators = {
    name: v => {
      if (!v.trim()) return 'El nombre es obligatorio';
      if (entity === 'technologies') {
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(v)) return 'Debe empezar con una letra';
        if (v.trim().length < 3) return 'Mínimo 3 letras';
      } else {
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(v)) return 'Solo letras';
        if (v.trim().length < 3) return 'Mínimo 3 letras';
      }
      return '';
    },
    foundedAt: v => {
      if (!v) return 'La fecha es obligatoria';
      const year = Number(v.split('-')[0]);
      if (isNaN(year) || year < 1800) return 'Año mínimo: 1800';
      return '';
    },
    location: v => {
      if (!v.trim()) return 'La ubicación es obligatoria';
      // Permitir letras, números, espacios, comas, acentos y hashtags, y debe empezar con letra
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ][A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,#áéíóúÁÉÍÓÚñÑ]*$/.test(v)) return 'Solo letras, números, espacios, comas y #, debe empezar con letra';
      if (v.trim().length < 5) return 'Mínimo 5 caracteres';
      return '';
    },
    category: v => {
      if (!v.trim()) return 'La categoría es obligatoria';
      if (v.trim().length < 4) return 'Mínimo 4 letras';
      return '';
    },
    fundingAmount: v => {
      if (!v.trim()) return 'El financiamiento es obligatorio';
      if (!/^[0-9]+$/.test(v)) return 'Solo números';
      return '';
    },
    id: v => v.trim() ? '' : 'El ID es obligatorio',
    sector: v => {
      if (!v.trim()) return 'El sector es obligatorio';
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(v)) return 'Solo letras';
      return '';
    },
    description: v => {
      if (!v.trim()) return 'La descripción es obligatoria';
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(v)) return 'Debe empezar con una letra';
      return '';
    },
    level: v => {
      if (!v.trim()) return 'El nivel es obligatorio';
      if (!['Avanzado', 'Medio', 'Bajo'].includes(v)) return 'Nivel inválido';
      return '';
    },
  };

  // Validar un campo específico
  const validateField = (name, value) => {
    if (validators[name]) {
      return validators[name](value || '');
    }
    return '';
  };

  // Validar todo el formulario
  const validateForm = formObj => {
    const errors = {};
    Object.keys(formObj).forEach(key => {
      const err = validateField(key, formObj[key]);
      if (err) errors[key] = err;
    });
    return errors;
  };
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
        { name: 'id', label: 'ID', hideInForm: true },
        { name: 'name', label: 'Nombre' },
        { name: 'sector', label: 'Sector' },
        { name: 'description', label: 'Descripción' },
        { name: 'level', label: 'Nivel' },
      ];

  React.useEffect(() => {
    fetchItems();
    setForm({});
    setEditId(null);
    setError('');
  }, [entity]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Validación dinámica
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Validar todo el formulario antes de enviar
    const errors = validateForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    setError('');
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId
        ? `${API_URL}/${entity}/update/${editId}`
        : `${API_URL}/${entity}/create`;
      let body = { ...form };
      if (entity === 'startups') {
        if (body.fundingAmount !== undefined) {
          body.fundingAmount = Number(body.fundingAmount);
        }
        // Enviar fecha como 'YYYY-MM-DD' (sin hora ni zona horaria)
        // No modificar body.foundedAt, ya que el input date ya da ese formato
      } else if (entity === 'technologies') {
        // El backend espera adoptionLevel, no level
        if (body.level) {
          body.adoptionLevel = body.level;
          delete body.level;
        }
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
    const newForm = { ...item };
    if (entity === 'startups') {
      // Buscar foundedAt en variantes
      let foundedAt = item.foundedAt || item.founded_at || item.FoundedAt;
      if (foundedAt) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(foundedAt)) {
          newForm.foundedAt = foundedAt;
        } else {
          const d = new Date(foundedAt);
          if (!isNaN(d)) {
            newForm.foundedAt = d.toISOString().slice(0, 10);
          } else {
            newForm.foundedAt = '';
          }
        }
      } else {
        newForm.foundedAt = '';
      }
      // Buscar fundingAmount en variantes
      let funding = item.fundingAmount ?? item.funding_amount ?? item.FundingAmount;
      if (funding !== undefined && funding !== null) {
        newForm.fundingAmount = String(funding);
      } else {
        newForm.fundingAmount = '';
      }
    }
    setForm(newForm);
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

  return (
    <div style={{ textAlign: 'left', margin: '0 auto', maxWidth: 800 }}>
      <h2 className="crud-title">{entity === 'startups' ? 'Startups' : 'Technologies'}</h2>
      <form onSubmit={handleSubmit} className="crud-form">
        {fields.filter(f => !(entity === 'technologies' && f.hideInForm)).map(f => {
          // Ejemplos por campo
          const examples = {
            name: 'Ej: Acme Corp',
            foundedAt: 'Ej: 2020-01-01',
            location: 'Ej: Ciudad de México',
            category: 'Ej: Fintech',
            fundingAmount: 'Ej: 1000000',
            id: 'Ej: T001',
            sector: 'Ej: Software',
            description: 'Ej: Plataforma de IA',
            level: 'Ej: Avanzado',
          };
          return (
            <div key={f.name} style={{ width: '100%' }}>
              <label style={{ fontWeight: 500, marginBottom: 2 }} className="crud-title">
                {entity === 'startups' && f.name === 'foundedAt' ? 'Fecha de fundación' : f.label}
              </label>
              {entity === 'startups' && f.name === 'foundedAt' ? (
                <input
                  type="date"
                  name="foundedAt"
                  className="crud-input"
                  value={form.foundedAt ? form.foundedAt : ''}
                  onChange={handleChange}
                  required
                  placeholder={examples.foundedAt}
                />
              ) : entity === 'technologies' && f.name === 'level' ? (
                <select
                  name="level"
                  className="crud-input"
                  value={form.level || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Selecciona nivel</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Medio">Medio</option>
                  <option value="Bajo">Bajo</option>
                </select>
              ) : (
                <input
                  name={f.name}
                  className="crud-input"
                  placeholder={examples[f.name] || f.label}
                  value={form[f.name] || ''}
                  onChange={handleChange}
                  required
                />
              )}
              {fieldErrors[f.name] && (
                <div className="crud-error">{fieldErrors[f.name]}</div>
              )}
            </div>
          );
        })}
        <button type="submit" disabled={loading}>
          {editId ? 'Actualizar' : 'Crear'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setForm({}); setEditId(null); }}>
            Cancelar
          </button>
        )}
      </form>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
  
      {loading ? <p>Cargando...</p> : (
        <table border="1" cellPadding="6" style={{ width: '100%', background: '#fff', margin: '0 auto', textAlign: 'center' }}>
          <thead>
            <tr>
              {fields.map(f => <th key={f.name} style={{ textAlign: 'center' }}>{f.label}</th>)}
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={fields.length + 2} style={{ textAlign: 'center', color: '#888' }}>Sin datos</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.id || item._id || Math.random()}>
                  {fields.map(f => {
                    let value =
                      item[f.name] ??
                      item[f.name.toLowerCase()] ??
                      item[f.name.replace(/([A-Z])/g, '_$1').toLowerCase()] ??
                      item[f.name === 'id' ? '_id' : ''] ??
                      '';
                    if (f.name === 'level' && !value) {
                      value = item['adoptionLevel'] ?? item['adoption_level'] ?? item['adoptionlevel'] ?? '';
                    }
                    // Mostrar fecha legible para startups en foundedAt
                    if (entity === 'startups' && f.name === 'foundedAt') {
                      value = formatDateES(value);
                    }
                    return <td key={f.name} style={{ textAlign: 'center' }}>{value}</td>;
                  })}
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => handleEdit(item)}>Editar</button>
                    <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <div style={{ marginBottom: 8 }}>
        <button onClick={fetchItems} disabled={loading}>Refrescar</button>
      </div>
    </div>
  );
}

export default App;
