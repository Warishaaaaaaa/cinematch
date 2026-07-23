import { Link } from "react-router-dom";
import { Clapperboard, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-base font-bold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
            <Clapperboard className="h-4 w-4 text-white" />
          </span>
          CineMatch
        </Link>

        <p className="text-center text-sm text-white/40">
          © {new Date().getFullYear()} CineMatch. Built by Warisha Amjad. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
