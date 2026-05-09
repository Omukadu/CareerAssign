import { useEffect, useState } from 'react';
import api from '../api/client';
import { Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: '', icon: 'briefcase', color: '#7c3aed' });
  const load = () => api.get('/categories').then(r => setCats(r.data));
  useEffect(() => { load(); }, []);
  const create = async (e) => { e.preventDefault(); await api.post('/categories', form); setForm({ name: '', icon: 'briefcase', color: '#7c3aed' }); load(); };
  const del = async (id) => { if (confirm('Delete?')) { await api.delete(`/categories/${id}`); load(); } };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <form onSubmit={create} className="card p-4 mb-6 grid sm:grid-cols-4 gap-3">
        <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
        <input className="input" placeholder="Icon (cpu/heart/briefcase…)" value={form.icon} onChange={e => setForm({...form, icon:e.target.value})} />
        <input type="color" className="h-10 rounded-lg border border-gray-200" value={form.color} onChange={e => setForm({...form, color:e.target.value})} />
        <button className="btn-primary"><Plus size={16} className="mr-1" /> Add</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cats.map(c => (
          <div key={c._id} className="card p-4 flex items-center justify-between">
            <Link to={`/careers?category=${c._id}`} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl" style={{ background: `${c.color}20` }} />
              <div><div className="font-semibold">{c.name}</div><div className="text-xs text-gray-500">{c.careerCount} careers</div></div>
            </Link>
            <button onClick={() => del(c._id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
