import { useEffect, useState } from 'react';
import api from '../api/client';
import CareerCard from '../components/CareerCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { Link } from 'react-router-dom';
import { Cpu, Briefcase, Heart, Palette, Wrench, BookOpen, GraduationCap, Tag, ChevronRight } from 'lucide-react';

const iconMap = { cpu: Cpu, briefcase: Briefcase, heart: Heart, palette: Palette, wrench: Wrench, book: BookOpen, graduation: GraduationCap };

export default function Home() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).catch(e => setErr(e.response?.data?.message || 'Failed to load'));
    api.get('/saved').then(r => setSavedIds(new Set(r.data.map(s => s.career._id)))).catch(() => {});
  }, []);

  if (err) return <div className="text-red-600">{err}</div>;
  if (!data) return <Skeleton />;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-8">
        <section className="rounded-3xl bg-gradient-to-br from-brand-100 via-brand-50 to-blue-100 p-6 sm:p-8 lg:p-10 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Discover careers that fit you best
              </h1>

              <p className="text-gray-600 mt-4 text-base sm:text-lg max-w-xl">
                Explore career options, learn key skills, and build your path to
                a successful future.
              </p>

              <Link to="/careers" className="btn-primary mt-6 inline-flex">
                Explore Careers
              </Link>
            </div>

            <div className="flex flex-wrap justify-start lg:justify-end gap-3">
              {[
                "Data Analyst",
                "Product Manager",
                "Cybersecurity Analyst",
                "UI/UX Designer",
                "Marketing Specialist",
              ].map((t, i) => (
                <div
                  key={t}
                  className="bg-white/80 backdrop-blur rounded-2xl px-4 py-3 shadow-sm text-[14px] tracking-[1.5px] font-medium text-gray-700"
                >
                  ● {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Explore by Category</h2>
            <Link
              to="/categories"
              className="text-sm text-brand-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {data.categories.map((c) => {
              const Icon = iconMap[c.icon] || Tag;
              return (
                <Link
                  key={c._id}
                  to={`/careers?category=${c._id}`}
                  className="card p-4 hover:shadow-lg transition"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${c.color}20`, color: c.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.careerCount ?? 0} careers
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Popular Careers</h2>
            <Link to="/careers" className="text-sm text-brand-700 font-medium">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.popular.map((c) => (
              <CareerCard key={c._id} career={c} savedIds={savedIds} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recommended for You</h2>
            <Link to="/careers" className="text-sm text-brand-700 font-medium">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recommended.map((c, i) => (
              <Link
                key={c._id}
                to={`/careers/${c._id}`}
                className="rounded-2xl p-5 text-white relative overflow-hidden min-h-[140px] flex flex-col justify-between"
                style={{
                  background: `linear-gradient(135deg, ${["#312e81", "#7c2d12", "#1e3a8a", "#5b21b6", "#7c3aed", "#0f172a"][i % 6]}, ${["#7c3aed", "#be185d", "#2563eb", "#9333ea", "#db2777", "#1e293b"][i % 6]})`,
                }}
              >
                <div className="font-semibold text-lg">{c.title}</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-80">{c.category?.name}</span>
                  <ChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <div className="card p-5">
          <div className="font-bold mb-4">Continue Your Journey</div>
          <div className="space-y-4">
            {data.progress.length === 0 && (
              <div className="text-sm text-gray-500">
                No progress yet.{" "}
                <Link to="/skills" className="text-brand-700">
                  Start a skill
                </Link>
              </div>
            )}
            {data.progress.map((p) => (
              <div key={p._id}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">
                    {p.label || p.skill?.name}
                  </span>
                  <span className="text-gray-500">{p.percent}% Complete</span>
                </div>
                <ProgressBar value={p.percent} />
              </div>
            ))}
          </div>
          <Link
            to="/progress"
            className="block text-sm text-brand-700 font-medium mt-4"
          >
            View all progress
          </Link>
        </div>

        <div className="card p-5">
          <div className="font-bold mb-4">Top Skills in Demand</div>
          <div className="space-y-3">
            {data.topSkills.map((s, i) => (
              <div key={s._id} className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-4">{i + 1}</span>
                <span className="text-sm font-medium flex-1">{s.name}</span>
                <div className="w-24">
                  <ProgressBar value={s.demandScore} />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">
                  {s.demandScore}%
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/skills"
            className="block text-sm text-brand-700 font-medium mt-4"
          >
            View all skills
          </Link>
        </div>
      </aside>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-56 rounded-3xl bg-gray-100" />
      <div className="grid grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-gray-100" />)}</div>
      <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-100" />)}</div>
    </div>
  );
}
