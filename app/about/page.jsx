import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8fbf7]">
      <Navbar />
      <section className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-4xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-herb-600">About</p>
        <h1 className="mt-3 text-4xl font-bold text-herb-900 sm:text-5xl">About HerbSphere</h1>
        <p className="mt-6 text-lg leading-8 text-slate-700">
          HerbSphere is an AI-powered platform designed to digitally empower businesses in the Herbal & Aromatics sector through intelligent management tools and business insights.
        </p>
      </section>
      <Footer />
    </main>
  );
}
