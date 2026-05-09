import { useEffect, useState } from 'react';
import api from '../api/client';
import ProgressBar from '../components/ProgressBar.jsx';
import { Trash2 } from 'lucide-react';

export default function Progress() {
  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState('');
  const [percent, setPercent] = useState(0);
  const [label, setLabel] = useState('');

  const load = () => api.get('/progress').then(r => setItems(r.data));
  useEffect(() => { load(); api.get('/skills').then(r => setSkills(r.data)); }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.put(`/progress/${skill}`, { percent: Number(percent), label });
    setSkill(''); setPercent(0); setLabel(''); load();
  };
  const update = async (skillId, p) => { await api.put(`/progress/${skillId}`, { percent: p }); load(); };
  const del = async (skillId) => { if (confirm('Remove?')) { await api.delete(`/progress/${skillId}`); load(); } };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Progress Tracking</h1>
      <form onSubmit={save} className="card p-4 mb-6 grid sm:grid-cols-4 gap-3">
        <select className="input" value={skill} onChange={e => setSkill(e.target.value)} required>
          <option value="">Select skill…</option>{skills.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <input className="input" placeholder="Label (optional)" value={label} onChange={e => setLabel(e.target.value)} />
        <input type="number" min={0} max={100} className="input" placeholder="% complete" value={percent} onChange={e => setPercent(e.target.value)} />
        <button className="btn-primary">Save</button>
      </form>
      <div className="space-y-3">
        {items.length === 0 && <div className="card p-10 text-center text-gray-500">No progress yet.</div>}
        {items.map(p => (
          <div key={p._id} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div><div className="font-semibold">{p.skill?.name}</div>{p.label && <div className="text-xs text-gray-500">{p.label}</div>}</div>
              <div className="flex items-center gap-3">
                <input type="range" min={0} max={100} value={p.percent} onChange={e => update(p.skill._id, Number(e.target.value))} />
                <span className="text-sm font-semibold w-12 text-right">{p.percent}%</span>
                <button onClick={() => del(p.skill._id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
            <ProgressBar value={p.percent} />
          </div>
        ))}
      </div>
    </div>
  );
}
