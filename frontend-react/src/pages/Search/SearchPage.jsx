import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, MapPin, Star, ChevronDown, Package } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import ServiceResultCard from '../../components/ServiceResultCard/ServiceResultCard';
import './SearchPage.css';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('cat') || '');
  const [port, setPort] = useState(searchParams.get('port') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalogs = async () => {
    try {
      const resCat = await fetch('http://localhost:3000/catalogs/SERVICE_CATEGORIES');
      if (resCat.ok) {
        const data = await resCat.json();
        setCategories(data.items || []);
      }
      const resPorts = await fetch('http://localhost:3000/catalogs/PORTS');
      if (resPorts.ok) {
        const data = await resPorts.json();
        setPorts(data.items || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);
      if (port) params.append('port', port);
      
      const res = await fetch(`http://localhost:3000/services/search?${params.toString()}`);
      if (res.ok) {
        setServices(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [query, category, port]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (query) params.q = query;
    if (category) params.cat = category;
    if (port) params.port = port;
    setSearchParams(params);
  };

  const clearFilter = (type) => {
    if (type === 'query') setQuery('');
    if (type === 'category') setCategory('');
    if (type === 'port') setPort('');
  };

  const hasFilters = query || category || port;

  return (
    <AppLayout>
      {/* Search Header */}
      <div className="search-header">
        <div className="container">
          <form className="search-bar-row" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar servicios logísticos..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="search-main-input"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="search-clear-btn">
                  <X size={16} />
                </button>
              )}
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="search-select">
              <option value="">Todas las categorías</option>
              {categories.map(c => (
                <option key={c.id} value={c.code}>{c.name}</option>
              ))}
            </select>
            <select value={port} onChange={e => setPort(e.target.value)} className="search-select">
              <option value="">Todos los puertos</option>
              {ports.map(p => (
                <option key={p.id} value={p.code}>{p.name}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">
              <Search size={16} /> Buscar
            </button>
            <button type="button" className="btn btn-ghost search-filter-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Filter size={16} /> Filtros
            </button>
          </form>

          {/* Active Filters */}
          {hasFilters && (
            <div className="search-active-filters">
              <span className="text-sm text-muted">Filtros activos:</span>
              {query && <span className="filter-chip">"{query}" <button onClick={() => clearFilter('query')}><X size={12} /></button></span>}
              {category && <span className="filter-chip">{category} <button onClick={() => clearFilter('category')}><X size={12} /></button></span>}
              {port && <span className="filter-chip"><MapPin size={11} />{port} <button onClick={() => clearFilter('port')}><X size={12} /></button></span>}
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="search-layout">
          {/* Sidebar Filters */}
          <aside className={`filter-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="filter-section">
              <h4 className="filter-title">Categorías</h4>
              {categories.map(cat => (
                <label key={cat.id} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat.code}
                    onChange={() => setCategory(cat.code === category ? '' : cat.code)}
                  />
                  <span><Package size={14} /> {cat.name}</span>
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Puerto</h4>
              {ports.map(p => (
                <label key={p.id} className="filter-option">
                  <input
                    type="radio"
                    name="port"
                    checked={port === p.code}
                    onChange={() => setPort(p.code === port ? '' : p.code)}
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Calificación mínima</h4>
              {[4.5, 4.0, 3.5].map(r => (
                <label key={r} className="filter-option">
                  <input type="radio" name="rating" />
                  <span>⭐ {r}+ estrellas</span>
                </label>
              ))}
            </div>

            {hasFilters && (
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: '8px' }}
                onClick={() => { setQuery(''); setCategory(''); setPort(''); }}>
                <X size={14} /> Limpiar filtros
              </button>
            )}
          </aside>

          {/* Results */}
          <main className="search-results">
            {/* Results Header */}
            <div className="results-header">
              <p className="results-count">
                <strong>{services.length}</strong> servicio{services.length !== 1 ? 's' : ''} encontrado{services.length !== 1 ? 's' : ''}
                {category && ` en "${categories.find(c=>c.code===category)?.name}"`}
                {port && ` · ${ports.find(p=>p.code===port)?.name}`}
              </p>
              <div className="results-sort">
                <label>Ordenar por:</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
                  <option value="rating">Mejor calificados</option>
                  <option value="orders">Más pedidos</option>
                  <option value="response">Tiempo de respuesta</option>
                </select>
              </div>
            </div>

            {loading ? (
               <div className="search-empty"><h3>Cargando...</h3></div>
            ) : services.length === 0 ? (
              <div className="search-empty">
                <div className="search-empty-icon">🔍</div>
                <h3>Sin resultados</h3>
                <p>No encontramos servicios que coincidan con tu búsqueda. Intenta con otros filtros.</p>
                <button className="btn btn-primary" onClick={() => { setQuery(''); setCategory(''); setPort(''); }}>
                  Ver todos los servicios
                </button>
              </div>
            ) : (
              <div className="results-grid">
                {services.map(service => (
                  <ServiceResultCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
