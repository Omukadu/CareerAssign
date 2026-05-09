import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import api from '../api/client';

const demandColor = { High: 'bg-emerald-50 text-emerald-700', Medium: 'bg-amber-50 text-amber-700', Low: 'bg-gray-100 text-gray-600' };

export default function CareerCard({ career, savedIds = new Set(), onToggleSaved }) {
  const [saved, setSaved] = useState(savedIds.has(career._id));
  const toggle = async (e) => {
    e.preventDefault();
    try {
      if (saved) await api.delete(`/saved/${career._id}`); else await api.post(`/saved/${career._id}`);
      setSaved(!saved); onToggleSaved?.(career._id, !saved);
    } catch {}
  };
  return (
    <Link to={`/careers/${career._id}`} className="card overflow-hidden group block">
      <div className="relative h-40 bg-gray-100">
        {career.image && <img src={career.image} alt={career.title} className="h-full w-full object-cover" />}
        <button onClick={toggle} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white shadow flex items-center justify-center">
          <Heart size={16} className={saved ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
        </button>
      </div>
      <div className="p-4">
        <div className="font-semibold group-hover:text-brand-700">{career.title}</div>
        <div className="text-xs text-gray-500 mt-0.5">{career.category?.name}</div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{career.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className={`chip ${demandColor[career.demand] || ''}`}>● {career.demand} Demand</span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-500">Avg. Salary</span>
          <span className="font-semibold">${career.avgSalary?.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
