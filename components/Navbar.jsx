"use client";

import Link from "next/link";
import { Menu, UserRound, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ];

  if (user) {
    navLinks.push(
      { href: "/dashboard", label: "Dashboard" },
      { href: "/inventory", label: "Inventory" },
      { href: "/orders", label: "Orders" },
      { href: "/customers", label: "Customers" }
    );
  } else {
    navLinks.push({ href: "/login", label: "Login" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-herb-100 bg-white/95 shadow-sm backdrop-blur font-mono">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-herb-900">
          <span className="brand-logo-frame flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-herb-100 bg-white">
            <img
              src="/logo.png"
              alt="HerbSphere logo"
              className="brand-logo h-full w-full scale-[1.85] object-cover"
            />
          </span>
          <span>HerbSphere</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-slate-700 transition hover:text-herb-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-slate-600 font-semibold sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                title={user.name}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-herb-100 bg-herb-50 text-herb-700"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <UserRound size={16} />
                )}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                title="Log Out"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-herb-100 text-herb-700 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden items-center justify-center rounded-full border border-herb-100 px-4 py-1.5 text-xs font-bold text-herb-700 transition hover:bg-herb-50 sm:flex"
            >
              [ Sign In ]
            </Link>
          )}

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-herb-100 text-herb-700 transition hover:border-herb-300 hover:bg-herb-50 md:hidden"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-herb-100 bg-white px-4 py-4 shadow-sm md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-herb-50 hover:text-herb-700"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
