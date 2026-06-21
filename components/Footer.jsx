import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Sprout } from "lucide-react";

const footerLinks = ["About", "Contact", "Privacy Policy", "GitHub"];

export default function Footer() {
  return (
    <footer className="border-t border-herb-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-herb-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-herb-50 text-herb-600">
              <Sprout size={21} />
            </span>
            HerbSphere
          </Link>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
            {footerLinks.map((link) => (
              <Link
                key={link}
                href={link === "About" ? "/about" : "#"}
                className="transition hover:text-herb-600"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 border-t border-herb-100 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500">© 2026 HerbSphere</p>
          <div className="flex gap-3 text-slate-500">
            {[Github, Linkedin, Instagram, Facebook].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label="Social profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-herb-100 transition hover:border-herb-300 hover:bg-herb-50 hover:text-herb-700"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
