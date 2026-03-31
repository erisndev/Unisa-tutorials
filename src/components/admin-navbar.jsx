import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const adminNavItems = [{ to: "/admin", label: "Dashboard" }];

export function AdminNavbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20">
            A
          </span>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">Admin</div>
            <div className="text-[11px] text-muted-foreground">Erisn UNISA Tutorials</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="btn-outline">
          Back to site
        </Link>
      </div>
    </motion.header>
  );
}
