import { useEffect, useState } from "react";
import api from "../api/client";
import { Plus, Trash2, Edit2 } from "lucide-react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: "", icon: "", color: "#7c3aed" });
  const [editId, setEditId] = useState(null);
  const load = () => api.get("/categories").then((r) => setCats(r.data));
  useEffect(() => {
    load();
  }, []);
  const create = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/categories/${editId}`, form);
      setEditId(null);
    } else {
      await api.post("/categories", form);
    }
    setForm({ name: "", icon: "", color: "#7c3aed" });
    load();
  };
  const startEdit = (c) => {
    setForm({ name: c.name, icon: c.icon, color: c.color });
    setEditId(c._id);
  };
  const del = async (id) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      await api.delete(`/categories/${id}`);
      load();
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <form
        onSubmit={create}
        className="card p-4 mb-6 grid sm:grid-cols-4 gap-3"
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
          placeholder="Icon (Cpu/Heart/Briefcase…)"
          value={form.icon}
          onChange={(e) =>
            setForm({
              ...form,
              icon:
                e.target.value.charAt(0).toUpperCase() +
                e.target.value.slice(1),
            })
          }
        />
        <input
          type="color"
          className="h-10 rounded-lg border border-gray-200"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">
            {editId ? (
              "Update"
            ) : (
              <>
                <Plus size={16} className="mr-1" /> Add
              </>
            )}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({ name: "", icon: "", color: "#7c3aed" });
              }}
              className="btn-outline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cats.map((c) => {
          const Icon = Icons[c.icon];

          return (
            <div
              key={c._id}
              className="card p-4 flex items-center justify-between"
            >
              <Link
                to={`/careers?category=${c._id}`}
                className="flex items-center gap-3"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${c.color}20` }}
                >
                  {Icon && <Icon size={20} color={c.color} />}
                </div>

                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.careerCount} careers
                  </div>
                </div>
              </Link>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(c)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => del(c._id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
