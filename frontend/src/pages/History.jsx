import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { History as HistoryIcon, Trash2, Sparkles } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import RatingBadge from "../components/ui/RatingBadge";
import { historyService } from "../services/movieService";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await historyService.list();
        setHistory(data.history);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleClear = async () => {
    if (!window.confirm("Clear your entire watch history? This can't be undone.")) return;
    setClearing(true);
    try {
      await historyService.clear();
      setHistory([]);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-extrabold sm:text-4xl">
            <HistoryIcon className="h-7 w-7 text-accent" /> Watch History
          </h1>
          <p className="mt-2 text-white/55">Movies you've recently viewed the details of.</p>
        </div>
        {history.length > 0 && (
          <button onClick={handleClear} disabled={clearing} className="btn-secondary text-sm text-red-300">
            <Trash2 className="h-4 w-4" /> Clear History
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full rounded-xl2" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <GlassCard className="flex flex-col items-center gap-4 px-8 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
            <HistoryIcon className="h-6 w-6 text-white/40" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">No history yet</p>
            <p className="mt-1 text-sm text-white/50">Movies you view will show up here.</p>
          </div>
          <Link to="/discover" className="btn-primary mt-2 text-sm">
            <Sparkles className="h-4 w-4" /> Discover Movies
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <GlassCard key={entry._id} hover className="flex items-center gap-4 p-3">
              <img
                src={entry.poster || "https://picsum.photos/100/150"}
                alt={entry.title}
                className="h-20 w-14 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate font-display text-sm font-bold">{entry.title}</p>
                <p className="mt-1 text-xs text-white/45">
                  Viewed {new Date(entry.viewedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
