import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Heart, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import Loader from '../components/Loader.jsx';

export default function CareerDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get(`/careers/${id}`).then(r => setC(r.data)).catch(e => setErr(e.response?.data?.message || 'Not found'));
    api.get('/saved').then(r => setSaved(r.data.some(s => s.career._id === id))).catch(() => {});
  }, [id]);

  const toggleSave = async () => {
    try {
      if (saved) await api.delete(`/saved/${id}`); else await api.post(`/saved/${id}`);
      setSaved(!saved);
    } catch {}
  };
  const del = async () => {
    if (!confirm('Delete this career?')) return;
    await api.delete(`/careers/${id}`); nav('/careers');
  };

  if (err) return <div className="text-red-600">{err}</div>;
  if (!c) return <Loader label="Loading career details" />;

  return (
    <div className="max-w-4xl">
      <Link to="/careers" className="inline-flex items-center text-sm text-gray-500 mb-4"><ArrowLeft size={14} className="mr-1" /> Back</Link>
      <div className="card overflow-hidden">
        {c.image && <img src={c.image} alt={c.title} className="w-full h-64 object-cover" />}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-brand-700 font-medium">{c.category?.name}</div>
              <h1 className="text-2xl font-bold">{c.title}</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleSave} className="btn-outline"><Heart size={16} className={saved ? 'fill-red-500 text-red-500' : ''} /></button>
              <Link to={`/careers/${c._id}/edit`} className="btn-outline"><Pencil size={16} /></Link>
              <button onClick={del} className="btn-outline text-red-600"><Trash2 size={16} /></button>
            </div>
          </div>
          <p className="text-gray-600 mt-4">{c.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <Stat label="Avg. Salary" value={`$${c.avgSalary?.toLocaleString()}`} />
            <Stat label="Demand" value={c.demand} />
            <Stat label="Views" value={c.views} />
          </div>
          {c.skills?.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-semibold mb-2">Required Skills</div>
              <div className="flex flex-wrap gap-2">
                {c.skills.map(s => <span key={s._id} className="chip bg-brand-50 text-brand-700">{s.name}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-gray-50 p-4">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="font-semibold mt-1">{value}</div>
  </div>
);
