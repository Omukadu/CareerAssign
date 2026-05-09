import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function CareerForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [cats, setCats] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', skills: [], avgSalary: 0, demand: 'Medium', image: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then(r => setCats(r.data));
    api.get('/skills').then(r => setSkills(r.data));
    if (id) api.get(`/careers/${id}`).then(r => {
      const c = r.data;
      setForm({ title: c.title, description: c.description, category: c.category?._id || '', skills: c.skills?.map(s => s._id) || [], avgSalary: c.avgSalary || 0, demand: c.demand, image: c.image || '' });
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const payload = { ...form, avgSalary: Number(form.avgSalary) };
      if (id) await api.put(`/careers/${id}`, payload); else await api.post('/careers', payload);
      nav('/careers');
    } catch (e) { setErr(e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const toggleSkill = (sid) => setForm(f => ({ ...f, skills: f.skills.includes(sid) ? f.skills.filter(x => x !== sid) : [...f.skills, sid] }));

  return (
    <form onSubmit={submit} className="card p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{id ? 'Edit' : 'New'} Career</h1>
      {err && <div className="rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">{err}</div>}
      <div><label className="block text-sm font-medium mb-1">Title</label><input className="input" value={form.title} onChange={e => setForm({...form, title:e.target.value})} required /></div>
      <div><label className="block text-sm font-medium mb-1">Description</label><textarea className="input min-h-[100px]" value={form.description} onChange={e => setForm({...form, description:e.target.value})} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">Category</label>
          <select className="input" value={form.category} onChange={e => setForm({...form, category:e.target.value})} required>
            <option value="">Select…</option>{cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select></div>
        <div><label className="block text-sm font-medium mb-1">Demand</label>
          <select className="input" value={form.demand} onChange={e => setForm({...form, demand:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Avg Salary (USD)</label>
          <input type="number" className="input" value={form.avgSalary} onChange={e => setForm({...form, avgSalary:e.target.value})} /></div>
        <div><label className="block text-sm font-medium mb-1">Image URL</label>
          <input className="input" value={form.image} onChange={e => setForm({...form, image:e.target.value})} /></div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Skills</label>
        <div className="flex flex-wrap gap-2">
          {skills.map(s => (
            <button type="button" key={s._id} onClick={() => toggleSkill(s._id)}
              className={`chip ${form.skills.includes(s._id) ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{s.name}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-3"><button disabled={loading} className="btn-primary">{loading ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={() => nav(-1)} className="btn-outline">Cancel</button></div>
    </form>
  );
}
