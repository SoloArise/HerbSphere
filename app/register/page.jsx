"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader } from "@/components/ui";

export default function RegisterPage() {
  const { user, register, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register(name.trim(), email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fbf7]">
        <Loader label="VERIFYING AUTHENTICATION..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fbf7] flex flex-col font-mono">
      <Navbar />
      <section className="mx-auto flex flex-1 flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 w-full max-w-[440px]">
        <div className="border border-[#bbb] bg-white p-6 sm:p-10 shadow-sm">
          <div className="inline-block font-mono text-[9px] text-[#888] tracking-widest uppercase border border-[#ccc] px-2 py-0.5 mb-4">
            AUTHENTICATION CARD
          </div>
          
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 overflow-hidden border border-[#999] bg-white flex items-center justify-center rounded-full shadow-sm">
              <img
                src="/logo.png"
                alt="HerbSphere logo"
                className="h-full w-full scale-[1.85] object-cover"
              />
            </div>
          </div>

          <h1 className="text-center text-sm font-bold text-[#222] mb-6">
            Create an Account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[9px] text-[#666] block mb-1 tracking-wide uppercase font-bold">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                className={`w-full border px-3 py-2 text-[11px] outline-none focus:border-[#333] ${
                  errors.name ? "border-red-500" : "border-[#999]"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-[9px] text-red-600 font-bold">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-[9px] text-[#666] block mb-1 tracking-wide uppercase font-bold">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`w-full border px-3 py-2 text-[11px] outline-none focus:border-[#333] ${
                  errors.email ? "border-red-500" : "border-[#999]"
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-[9px] text-red-600 font-bold">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-[9px] text-[#666] block mb-1 tracking-wide uppercase font-bold">
                PASSWORD (MIN 8 CHARS)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`w-full border px-3 py-2 text-[11px] outline-none focus:border-[#333] ${
                  errors.password ? "border-red-500" : "border-[#999]"
                }`}
                placeholder="Create a strong password"
              />
              {errors.password && (
                <p className="mt-1 text-[9px] text-red-600 font-bold">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="text-[9px] text-[#666] block mb-1 tracking-wide uppercase font-bold">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                }}
                className={`w-full border px-3 py-2 text-[11px] outline-none focus:border-[#333] ${
                  errors.confirmPassword ? "border-red-500" : "border-[#999]"
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-[9px] text-red-600 font-bold">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full cursor-pointer border border-[#333] bg-[#333] text-white font-mono text-[10px] tracking-wide py-2.5 transition hover:bg-[#444] disabled:opacity-50"
            >
              {isSubmitting ? "[ REGISTERING... ]" : "[ REGISTER ]"}
            </button>
          </form>

          <p className="font-mono text-[9px] text-center text-[#888] mt-6">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="underline cursor-pointer text-[#555] font-bold"
            >
              Log In
            </span>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
