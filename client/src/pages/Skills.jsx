import { useEffect, useState } from "react";
import api from "../api/client";
import ProgressBar from "../components/ProgressBar.jsx";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    demandScore: 50,
  });
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const load = () =>
    api.get("/skills", { params: { q } }).then((r) => setSkills(r.data));
  useEffect(() => {
    load();
  }, [q]);

  const create = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/skills/${editId}`, {
        ...form,
        demandScore: Number(form.demandScore),
      });
      setEditId(null);
    } else {
      await api.post("/skills", {
        ...form,
        demandScore: Number(form.demandScore),
      });
    }
    setForm({ name: "", description: "", demandScore: 50 });
    setShow(false);
    load();
  };
  const startEdit = (s) => {
    setForm({
      name: s.name,
      description: s.description,
      demandScore: s.demandScore,
    });
    setEditId(s._id);
    setShow(true);
  };
  const del = async (id) => {
    if (confirm("Delete skill?")) {
      await api.delete(`/skills/${id}`);
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skills Library</h1>
        <button onClick={() => setShow((s) => !s)} className="btn-primary">
          <Plus size={16} className="mr-1" /> New Skill
        </button>
      </div>
      <input
        className="input mb-4 max-w-md"
        placeholder="Search skills…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {show && (
        <form
          onSubmit={create}
          className="card p-4 mb-6 grid sm:grid-cols-3 gap-3"
        >
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            min={0}
            max={100}
            className="input"
            placeholder="Demand %"
            value={form.demandScore}
            onChange={(e) => setForm({ ...form, demandScore: e.target.value })}
          />
          <div className="flex gap-2 sm:col-span-3">
            <button className="btn-primary flex-1">
              {editId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShow(false);
                setEditId(null);
                setForm({ name: "", description: "", demandScore: 50 });
              }}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((s) => (
          <div key={s._id} className="card p-4">
            <div className="flex items-start justify-between">
              <div className="font-semibold">{s.name}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(s)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => del(s._id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {s.description && (
              <p className="text-sm text-gray-500 mt-1">{s.description}</p>
            )}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Demand</span>
                <span>{s.demandScore}%</span>
              </div>
              <ProgressBar value={s.demandScore} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
