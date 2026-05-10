import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Compass,
  Home,
  Briefcase,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Bookmark,
  Heart,
  Bell,
  Search,
  LogOut,
  Layers,
  Tag,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { to: "/", icon: Home, label: "Home", end: true },
  { to: "/careers", icon: Briefcase, label: "Explore Careers" },
  { to: "/categories", icon: Tag, label: "Categories" },
  { to: "/skills", icon: BookOpen, label: "Skills Library" },
  { to: "/progress", icon: ClipboardList, label: "Progress" },
  { to: "/saved", icon: Heart, label: "Saved" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav2 = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex">
      {/* Mobile / Tablet drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-80 max-w-[86vw] bg-white border-r border-gray-100 p-6 transform transition-transform flex flex-col ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between gap-3 mb-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white">
                <Compass size={20} />
              </div>
              <div>
                <div className="font-bold leading-tight">Career Discover</div>
                <div className="text-xs text-gray-500">Library</div>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900"
              title="Close menu"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {nav.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>

          {location.pathname !== "/careers" && (
            <div className="mt-auto rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-semibold mb-1">Not sure where to start?</div>
              <p className="text-xs text-white/80 mb-3">
                Take an assessment and get personalized career recommendations.
              </p>
              <button
                onClick={() => nav2("/careers")}
                className="w-full rounded-lg bg-white/15 hover:bg-white/25 py-2 text-sm font-medium"
              >
                Explore Careers
              </button>
            </div>
          )}
        </aside>
      </div>

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-gray-100 bg-white p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white">
            <Compass size={20} />
          </div>
          <div>
            <div className="font-bold leading-tight">Career Discover</div>
            <div className="text-xs text-gray-500">Library</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        {location.pathname !== "/careers" && (
          <div className="mt-auto rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
            <div className="text-3xl mb-2">🚀</div>
            <div className="font-semibold mb-1">Not sure where to start?</div>
            <p className="text-xs text-white/80 mb-3">
              Take an assessment and get personalized career recommendations.
            </p>
            <button
              onClick={() => nav2("/careers")}
              className="w-full rounded-lg bg-white/15 hover:bg-white/25 py-2 text-sm font-medium"
            >
              Explore Careers
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 min-w-0 lg:ml-64">
        <header className="sticky top-0 z-10 bg-[#fafaf7]/80 backdrop-blur border-b border-gray-100">
          <div
            className={`flex items-center  gap-4 px-6 lg:px-10 py-4 ${location.pathname !== "/careers" ? "justify-between" : "justify-end"}`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900"
                title="Open menu"
                aria-label="Open menu"
                type="button"
              >
                <Menu size={20} />
              </button>

              <div className="relative flex-1 max-w-2xl min-w-0">
                <input
                  className="input pl-10"
                  placeholder="Search careers, skills, categories..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim() !== "")
                      nav2(`/search?q=${encodeURIComponent(e.target.value)}`);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* <button
                className="relative p-2 text-gray-500 hover:text-gray-800"
                title="Notifications"
              >
                <Bell size={20} />
              </button> */}
              {/* <button
                onClick={() => nav2("/saved")}
                className="p-2 text-gray-500 hover:text-gray-800"
                title="Saved Careers"
              >
                <Bookmark size={20} />
              </button> */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-200 text-brand-800 font-semibold flex items-center justify-center">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold leading-tight">
                    {user?.name}
                  </div>
                  {/* <div className="text-xs text-gray-500">{user?.role}</div> */}
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-gray-500 hover:text-red-600"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="px-6 lg:px-10 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
