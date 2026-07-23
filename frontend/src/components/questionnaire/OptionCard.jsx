import { motion } from "framer-motion";

/**
 * A single selectable option in the questionnaire (mood, genre, language...).
 * Works for both single-select and multi-select questions via `selected`.
 */
export default function OptionCard({ icon: Icon, label, sublabel, selected, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`glass-card relative flex flex-col items-center gap-3 px-6 py-8 text-center transition-colors duration-200 ${
        selected ? "border-primary/70 bg-primary/10 shadow-glow" : "hover:border-white/25"
      }`}
    >
      {Icon && (
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
            selected ? "bg-gradient-primary" : "bg-white/10"
          }`}
        >
          <Icon className="h-7 w-7" />
        </span>
      )}
      <div>
        <p className="font-display text-sm font-bold sm:text-base">{label}</p>
        {sublabel && <p className="mt-0.5 text-xs text-white/50">{sublabel}</p>}
      </div>
      {selected && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold"
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  );
}
