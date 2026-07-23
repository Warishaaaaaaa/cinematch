import { motion } from "framer-motion";
import { Sparkles, Database, ShieldCheck, Layers } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const POINTS = [
  { icon: Sparkles, title: "Rule-based, transparent AI", desc: "Every recommendation shows exactly why it matched your answers — no black box scoring." },
  { icon: Database, title: "Real movie data", desc: "Metadata is sourced from a live movie database, kept fresh with every request." },
  { icon: ShieldCheck, title: "Your data, protected", desc: "Passwords are hashed, sessions use http-only cookies, and your favorites stay yours." },
  { icon: Layers, title: "Built to grow", desc: "A modular, full-stack architecture ready for chatbots, social features, and more." },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14 text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">About CineMatch</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          CineMatch pairs a clean, cinematic interface with an honest recommendation engine — built to help you
          spend less time scrolling and more time watching.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {POINTS.map((p, i) => (
          <GlassCard
            key={p.title}
            hover
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="font-display text-base font-bold">{p.title}</h3>
            <p className="mt-2 text-sm text-white/55">{p.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
