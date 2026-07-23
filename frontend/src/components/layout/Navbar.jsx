import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clapperboard, Menu, X, ChevronDown, Heart, History, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/discover", label: "Discover" },
  { to: "/favorites", label: "Favorites", authOnly: true },
  { to: "/history", label: "History", authOnly: true },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 shadow-soft">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <Clapperboard className="h-[18px] w-[18px] text-white" size={18} />
          </span>
          CineMatch
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks
            .filter((l) => !l.authOnly || isAuthenticated)
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-white/70 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="btn-primary px-5 py-2.5 text-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full glass px-2 py-1.5 pr-3 hover:bg-white/10"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold uppercase">
                  {user?.name?.[0] || "U"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-white/60" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="glass-card absolute right-0 mt-2 w-52 overflow-hidden p-1.5"
                  >
                    <p className="truncate px-3 py-2 text-xs text-white/50">{user?.email}</p>
                    <DropdownLink to="/profile" icon={User} label="Profile" onClick={() => setDropdownOpen(false)} />
                    <DropdownLink to="/favorites" icon={Heart} label="Favorites" onClick={() => setDropdownOpen(false)} />
                    <DropdownLink to="/history" icon={History} label="Watch History" onClick={() => setDropdownOpen(false)} />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card mx-auto mt-2 max-w-6xl overflow-hidden p-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks
                .filter((l) => !l.authOnly || isAuthenticated)
                .map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </NavLink>
                ))}
              <div className="my-1 h-px bg-white/10" />
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary mx-4 mt-1 text-sm">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-white/5">
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DropdownLink({ to, icon: Icon, label, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
