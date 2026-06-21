import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f8fbf7]">
      <Navbar />
      <section className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-4xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-herb-600">Access</p>
        <h1 className="mt-3 text-4xl font-bold text-herb-900 sm:text-5xl">Login</h1>
        <p className="mt-6 text-lg leading-8 text-slate-700">
          Secure authentication functionality will be implemented in upcoming development phases.
        </p>
      </section>
      <Footer />
    </main>
  );
}
