import { useEffect, useState } from 'react';
import api from '../api/client';
import CareerCard from '../components/CareerCard.jsx';

export default function Saved() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
const load = () =>
  api
    .get("/saved")
    .then((r) => setItems(r.data))
    .finally(() => setLoading(false));
useEffect(() => {
  load();
}, []);  return (
  <div>
    <h1 className="text-2xl font-bold mb-6">Saved Careers</h1>
    {loading ? (
      <div className="text-gray-500">Loading…</div>
    ) : items.length === 0 ? (
      <div className="card p-10 text-center text-gray-500">
        No saved careers yet.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((s) => (
          <CareerCard
            key={s._id}
            career={s.career}
            savedIds={new Set(items.map((x) => x.career._id))}
            onToggleSaved={() => load()}
          />
        ))}
      </div>
    )}
  </div>
);
}
