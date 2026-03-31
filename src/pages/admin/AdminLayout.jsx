import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useTheme } from "../../components/theme-provider";
import { AdminToastProvider } from "./AdminToast";

const sidebarNav = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/faculties", label: "Faculties" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/modules", label: "Modules" },
  { to: "/admin/packages", label: "Packages" },
  { to: "/admin/orders", label: "Orders" },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}

function SidebarContent({ onLogout, onNavClick }) {
  return (
    <>
      <div className="flex h-16 items-center gap-2.5 border-b px-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20">
          E
        </span>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight">Admin</div>
          <div className="text-[11px] text-muted-foreground">Dashboard</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {sidebarNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavClick}
            className={({ isActive }) =>
              [
                "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-3 space-y-1">
        <Link
          to="/"
          onClick={onNavClick}
          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Back to site
        </Link>
        <button
          onClick={() => {
            onLogout();
            onNavClick?.();
          }}
          className="block w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          type="button"
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default function AdminLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <AdminToastProvider>
      <div className="flex h-screen overflow-hidden bg-muted/30">
        <aside className="hidden w-64 shrink-0 flex-col border-r bg-background lg:flex">
          <SidebarContent onLogout={onLogout} onNavClick={() => {}} />
        </aside>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeSidebar}
            />
            <aside className="relative z-10 flex h-full w-64 flex-col bg-background shadow-xl">
              <SidebarContent onLogout={onLogout} onNavClick={closeSidebar} />
            </aside>
          </div>
        )}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors lg:hidden"
                aria-label="Open menu"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
              <div className="text-lg font-bold tracking-tight">Dashboard</div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                to="/"
                className="btn-outline text-xs hidden sm:inline-flex"
              >
                Back to site
              </Link>
              <button
                onClick={onLogout}
                className="btn-outline text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 hidden sm:inline-flex"
                type="button"
              >
                Logout
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminToastProvider>
  );
}
