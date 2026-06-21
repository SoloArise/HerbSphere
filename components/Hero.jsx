import Link from "next/link";
import { ArrowRight, BarChart3, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-herb-50 via-white to-amber-50">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-herb-100 bg-white px-4 py-2 text-sm font-semibold text-herb-700 shadow-sm">
            <Sparkles size={16} />
            AI tools for herbal and aromatics businesses
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-normal text-herb-900 sm:text-5xl lg:text-6xl">
            Empowering Herbal Businesses with AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
            Manage products, discover insights, and grow your herbal business through an intelligent digital platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-herb-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-herb-700"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-md border border-herb-200 bg-white px-6 py-3 text-sm font-semibold text-herb-700 transition hover:-translate-y-0.5 hover:border-herb-300 hover:bg-herb-50"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-lg border border-white/80 bg-white/75 p-5 shadow-soft backdrop-blur">
            <div className="rounded-md bg-herb-900 p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-herb-100">Business Growth</p>
                  <p className="mt-2 text-3xl font-bold">+42%</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <BarChart3 size={26} />
                </span>
              </div>
              <div className="mt-8 grid grid-cols-4 items-end gap-3">
                {[42, 64, 50, 86].map((height, index) => (
                  <div key={height} className="rounded-t-md bg-white/15 p-1">
                    <div
                      className="rounded-t bg-pollen"
                      style={{ height: `${height + index * 4}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-herb-100 bg-white p-4">
                <p className="text-sm font-semibold text-herb-900">Product Catalog</p>
                <p className="mt-2 text-sm text-slate-600">Organized SKUs, batches, and seasonal inventory.</p>
              </div>
              <div className="rounded-md border border-herb-100 bg-white p-4">
                <p className="text-sm font-semibold text-herb-900">Smart Signals</p>
                <p className="mt-2 text-sm text-slate-600">Clear recommendations for stronger digital reach.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
