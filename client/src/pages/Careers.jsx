import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/client";
import CareerCard from "../components/CareerCard.jsx";
import { Plus } from "lucide-react";

export default function Careers() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0, pages: 1, page: 1 });
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());

  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const demand = params.get("demand") || "";
  const page = params.get("page") || "1";

  useEffect(() => {
    api.get("/categories").then((r) => setCats(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/careers", { params: { q, category, demand, page } }),
      api.get("/saved"),
    ])
      .then(([careersRes, savedRes]) => {
        setData(careersRes.data);
        setSavedIds(new Set(savedRes.data.map((s) => s.career._id)));
      })
      .finally(() => setLoading(false));
  }, [q, category, demand, page]);

  const set = (k, v) => {
    const p = new URLSearchParams(params);
    v ? p.set(k, v) : p.delete(k);
    p.delete("page");
    setParams(p);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Explore Careers</h1>
        <Link to="/careers/new" className="btn-primary">
          <Plus size={16} className="mr-1" /> New Career
        </Link>
      </div>

      <div className="card p-4 mb-6 flex flex-wrap gap-3">
        <input
          className="input flex-1 min-w-[200px]"
          placeholder="Search…"
          defaultValue={q}
          onKeyDown={(e) => e.key === "Enter" && set("q", e.target.value)}
        />
        <select
          className="input max-w-[200px]"
          value={category}
          onChange={(e) => set("category", e.target.value)}
        >
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="input max-w-[160px]"
          value={demand}
          onChange={(e) => set("demand", e.target.value)}
        >
          <option value="">Any demand</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          No careers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.items.map((c) => (
            <CareerCard key={c._id} career={c} savedIds={savedIds} />
          ))}
        </div>
      )}

      {data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: data.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => set("page", String(i + 1))}
              className={`h-9 w-9 rounded-lg text-sm ${data.page === i + 1 ? "bg-brand-600 text-white" : "bg-white border border-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
