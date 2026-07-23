import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Compass,
  Radar,
  Smartphone,
  ListChecks,
  Wand2,
  Telescope,
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const POSTERS = [
  "https://picsum.photos/seed/neon-horizon/500/750",
  "https://picsum.photos/seed/glasswing/500/750",
  "https://picsum.photos/seed/static-bloom/500/750",
  "https://picsum.photos/seed/salt-marigold/500/750",
  "https://picsum.photos/seed/crimson-ledger/500/750",
  "https://picsum.photos/seed/summit-static/500/750",
];

const FEATURES = [
  {
    icon: Wand2,
    title: "Smart Recommendations",
    desc: "A transparent, rule-based engine reads your mood and taste to rank films — no black box, just honest matching.",
  },
  {
    icon: Telescope,
    title: "Movie Discovery",
    desc: "Explore beyond your usual genres with curated picks that stretch your watchlist in the right direction.",
  },
  {
    icon: Radar,
    title: "Real-time Movie Data",
    desc: "Ratings, runtimes, and release details stay fresh, sourced straight from a live movie database.",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    desc: "The same premium experience, perfectly tuned for desktop, tablet, and mobile.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Choose your preferences",
    desc: "Answer a few quick, visual questions — mood, genre, runtime, and more.",
  },
  {
    step: "2",
    title: "AI recommends movies",
    desc: "Our engine scores every film against your answers and ranks the best matches.",
  },
  {
    step: "3",
    title: "Explore movie details",
    desc: "Dive into cast, ratings, trailers, and see exactly why each pick fits you.",
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-4 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-glow" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full glass px-4 py-1.5 text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Smart Movie Discovery
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
              Find your next{" "}
              <span className="text-gradient">favorite movie.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-white/60 sm:text-lg">
              Answer a few quick questions about your mood and taste.
              CineMatch's recommendation engine does the rest — curated picks,
              matched and ranked, ready to watch tonight.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/discover" className="btn-primary">
                Start Exploring <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto grid w-full max-w-md grid-cols-3 gap-4"
          >
            {POSTERS.map((src, i) => (
              <motion.img
                key={src}
                src={src}
                alt=""
                className={`aspect-[2/3] w-full rounded-xl2 object-cover shadow-soft ring-1 ring-white/10 ${
                  i % 2 === 0 ? "animate-float" : "animate-float-slow"
                }`}
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="glass-card absolute -bottom-6 -left-6 flex items-center gap-3 px-4 py-3 sm:-left-10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-white/50">AI Match</p>
                <p className="text-sm font-bold text-accent">97% for you</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto mt-32 max-w-6xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Everything a movie night needs
          </h2>
          <p className="mt-3 text-white/60">
            Built with the same care as the recommendations it gives you.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <GlassCard
              key={f.title}
              hover
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-base font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/55">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto mt-32 max-w-5xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-white/60">
            Three steps between you and your next favorite film.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <GlassCard
              key={s.step}
              hover
              className="relative p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary font-display text-xl font-extrabold shadow-glow">
                {s.step}
              </span>
              <h3 className="font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/55">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <ListChecks className="mx-auto mt-6 hidden h-5 w-5 text-white/20 md:block" />
              )}
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-32 max-w-4xl px-4 pb-8">
        <GlassCard className="gradient-border relative overflow-hidden px-8 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-glow" />
          <Compass className="mx-auto mb-5 h-9 w-9 text-accent" />
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Ready to find it?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/60">
            It takes less than a minute. Your next favorite movie is a few taps
            away.
          </p>
          <Link to="/discover" className="btn-primary mt-8 inline-flex">
            Start Exploring <ArrowRight className="h-4 w-4" />
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
