import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Careers from './pages/Careers.jsx';
import CareerDetail from './pages/CareerDetail.jsx';
import CareerForm from './pages/CareerForm.jsx';
import Skills from './pages/Skills.jsx';
import Saved from './pages/Saved.jsx';
import Progress from './pages/Progress.jsx';
import Categories from './pages/Categories.jsx';

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-gray-500">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Private><Layout /></Private>}>
        <Route path="/" element={<Home />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/new" element={<CareerForm />} />
        <Route path="/careers/:id/edit" element={<CareerForm />} />
        <Route path="/careers/:id" element={<CareerDetail />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/progress" element={<Progress />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
