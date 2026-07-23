import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <GlassCard className="flex flex-col items-center gap-4 px-10 py-16 text-center">
        <Compass className="h-10 w-10 text-white/40" />
        <h1 className="font-display text-3xl font-extrabold">404</h1>
        <p className="text-white/55">This scene doesn't exist. Let's get you back on track.</p>
        <Link to="/" className="btn-primary mt-2 text-sm">
          Back to Home
        </Link>
      </GlassCard>
    </div>
  );
}
