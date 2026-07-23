import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, CalendarDays, Heart, History as HistoryIcon, Film } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import { Spinner } from "../components/ui/LoadingSkeleton";
import { authService } from "../services/authService";

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authService.getProfile();
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const { user, stats } = data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <GlassCard className="mb-8 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
        <span className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-primary font-display text-3xl font-extrabold uppercase shadow-glow">
          {user.name?.[0] || "U"}
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold">{user.name}</h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-white/55 sm:justify-start">
            <Mail className="h-3.5 w-3.5" /> {user.email}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-white/40 sm:justify-start">
            <CalendarDays className="h-3.5 w-3.5" /> Joined{" "}
            {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </p>
        </div>
      </GlassCard>

      <div className="mb-8 grid grid-cols-2 gap-5">
        <StatCard icon={Heart} label="Favorite Movies" value={stats.favoritesCount} to="/favorites" tint="text-highlight" />
        <StatCard icon={Film} label="Movies Viewed" value={stats.historyCount} to="/history" tint="text-accent" />
      </div>

      <GlassCard className="p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <HistoryIcon className="h-5 w-5 text-white/50" /> Recently Viewed
        </h2>
        {stats.recentHistory.length === 0 ? (
          <p className="text-sm text-white/50">Nothing viewed yet — go discover something great.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {stats.recentHistory.map((h) => (
              <div key={h._id} className="text-center">
                <img src={h.poster || "https://picsum.photos/200/300"} alt={h.title} className="aspect-[2/3] w-full rounded-lg object-cover" />
                <p className="mt-2 truncate text-xs text-white/60">{h.title}</p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, to, tint }) {
  return (
    <Link to={to}>
      <GlassCard hover className="flex items-center gap-4 p-6">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ${tint}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-2xl font-extrabold">{value}</p>
          <p className="text-xs text-white/50">{label}</p>
        </div>
      </GlassCard>
    </Link>
  );
}
