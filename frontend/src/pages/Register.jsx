import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import { Spinner } from "../components/ui/LoadingSkeleton";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/discover", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-glow" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <GlassCard className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Create your account</h1>
            <p className="mt-2 text-sm text-white/55">Save favorites and get personalized picks.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="input-glass pl-11"
              />
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="input-glass pl-11"
              />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="input-glass pl-11"
              />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="input-glass pl-11"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner className="h-4 w-4 border-white/40 border-t-white" /> : <UserPlus className="h-4 w-4" />}
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-accent hover:underline">
              Login
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
