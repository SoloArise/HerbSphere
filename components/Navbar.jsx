"use client";

import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-herb-100 bg-white/95 shadow-sm backdrop-blur">
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

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition hover:text-herb-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open profile"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-herb-100 text-herb-700 transition hover:border-herb-300 hover:bg-herb-50 sm:flex"
          >
            <UserRound size={20} />
          </button>
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-herb-100 text-herb-700 transition hover:border-herb-300 hover:bg-herb-50 md:hidden"
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
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
                className="rounded-md px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-herb-50 hover:text-herb-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
