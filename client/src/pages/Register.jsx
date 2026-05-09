import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Compass } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try { await register(form.name, form.email, form.password); nav('/'); }
    catch (e) { setErr(e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-brand-50 to-white p-6">
      <form onSubmit={submit} className="card w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white"><Compass size={20} /></div>
          <div><div className="font-bold">Career Discover</div><div className="text-xs text-gray-500">Library</div></div>
        </div>
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Discover careers that fit you best</p>
        {err && <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">{err}</div>}
        <label className="block text-sm font-medium mb-1">Name</label>
        <input className="input mb-4" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" className="input mb-4" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" minLength={6} className="input mb-6" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating…' : 'Create account'}</button>
        <p className="text-sm text-gray-500 text-center mt-4">Already a member? <Link to="/login" className="text-brand-700 font-medium">Login</Link></p>
      </form>
    </div>
  );
}
