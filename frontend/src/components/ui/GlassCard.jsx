import { motion } from "framer-motion";

/**
 * Base glassmorphism card used across the app (feature cards, movie cards,
 * modal panels, etc). Accepts a `hover` flag to enable a lift-on-hover
 * micro-interaction, and `glow` to tint the border on hover.
 */
export default function GlassCard({ children, className = "", hover = false, glow = "primary", as: Tag = "div", ...props }) {
  const glowClass = glow === "accent" ? "hover:shadow-glow-cyan" : "hover:shadow-glow";

  const Component = motion[Tag] || motion.div;

  return (
    <Component
      className={`glass-card ${hover ? `transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 ${glowClass}` : ""} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
