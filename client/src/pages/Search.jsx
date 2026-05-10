import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/client";
import { Briefcase, BookOpen, Tag, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState({
    careers: [],
    skills: [],
    categories: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.trim().length >= 2) {
      setLoading(true);
      api
        .get("/search", { params: { q } })
        .then((r) => setResults(r.data))
        .finally(() => setLoading(false));
    }
  }, [q]);

  const totalResults =
    results.careers.length + results.skills.length + results.categories.length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-500 mb-8">
        {q ? `Showing results for "${q}"` : "Enter a search term"}
        {q && ` (${totalResults} results)`}
      </p>

      {loading && <div className="text-center text-gray-500">Searching...</div>}

      {!loading && totalResults === 0 && q && (
        <div className="card p-10 text-center text-gray-500">
          <p className="text-lg">No results found for "{q}"</p>
          <p className="text-sm mt-2">Try different keywords</p>
        </div>
      )}

      {!loading && totalResults > 0 && (
        <div className="space-y-12">
          {/* Careers */}
          {results.careers.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase size={20} className="text-blue-600" />
                <h2 className="text-2xl font-bold">
                  Careers ({results.careers.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.careers.map((c) => (
                  <Link
                    key={c._id}
                    to={`/careers/${c._id}`}
                    className="card p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{c.title}</h3>
                        {c.category && (
                          <p className="text-sm text-gray-500 mt-1">
                            {c.category.name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {c.description}
                        </p>
                        <div className="flex gap-2 mt-3">
                          {c.demand && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                c.demand === "High"
                                  ? "bg-red-100 text-red-700"
                                  : c.demand === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {c.demand} Demand
                            </span>
                          )}
                          {c.avgSalary && (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                              ${c.avgSalary.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight
                        size={20}
                        className="text-gray-400 flex-shrink-0"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {results.skills.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen size={20} className="text-green-600" />
                <h2 className="text-2xl font-bold">
                  Skills ({results.skills.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.skills.map((s) => (
                  <Link
                    key={s._id}
                    to="/skills"
                    className="card p-4 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-semibold">{s.name}</h3>
                    {s.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {s.description}
                      </p>
                    )}
                    {s.demandScore && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Demand</span>
                          <span>{s.demandScore}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                            style={{ width: `${s.demandScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Categories */}
          {results.categories.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Tag size={20} className="text-purple-600" />
                <h2 className="text-2xl font-bold">
                  Categories ({results.categories.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.categories.map((cat) => {
                  const IconComponent = Icons[cat.icon];
                  return (
                    <Link
                      key={cat._id}
                      to={`/careers?category=${cat._id}`}
                      className="card p-4 hover:shadow-lg transition-shadow text-center"
                    >
                      <div
                        className="h-12 w-12 rounded-lg flex items-center justify-center mx-auto mb-3"
                        style={{ background: `${cat.color}20` }}
                      >
                        {IconComponent && (
                          <IconComponent size={24} color={cat.color} />
                        )}
                      </div>
                      <h3 className="font-semibold">{cat.name}</h3>
                      {cat.careerCount && (
                        <p className="text-xs text-gray-500 mt-1">
                          {cat.careerCount} careers
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
