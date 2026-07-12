"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Loader, toast } from "@/components/ui";

function SectionLabel({ label }) {
  return (
    <div className="inline-block font-mono text-[9px] text-[#888] tracking-widest uppercase border border-[#ccc] px-2 py-0.5 mb-2">
      {label}
    </div>
  );
}

function WireBox({ h, label, className = "" }) {
  return (
    <div
      className={`w-full bg-[#d9d9d9] border border-[#999] flex items-center justify-center ${className}`}
      style={{ height: h }}
    >
      {label && (
        <span className="text-[#555] text-[10px] text-center px-2 leading-tight font-mono">
          {label}
        </span>
      )}
    </div>
  );
}

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const url = search.trim()
          ? `/api/products/search?q=${encodeURIComponent(search.trim())}`
          : "/api/products";
        const res = await api.get(url);
        if (res.data && res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Products error:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    const delayDebounce = setTimeout(fetchProducts, search ? 300 : 0);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f8fbf7] flex flex-col font-mono">
        <Navbar />
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <SectionLabel label="Inventory" />
              <h1 className="text-3xl font-bold text-herb-900 sm:text-4xl">Inventory Management</h1>
              <p className="mt-1 text-xs text-slate-500">
                Track and manage your herbal products inventory.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory items..."
              className="h-9 flex-1 min-w-[200px] border border-[#999] bg-white px-3 font-mono text-[10px] text-[#333] outline-none placeholder:text-[#777] focus:border-[#333]"
            />
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center border border-[#bbb] bg-white shadow-sm">
              <Loader label="LOADING INVENTORY ITEMS..." />
            </div>
          ) : products.length === 0 ? (
            <div className="border border-[#bbb] bg-white p-10 text-center font-mono text-[11px] text-[#666] shadow-sm">
              No inventory products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => {
                const sku = `HS-${String(p._id).substring(20).padStart(3, "0")}`;
                return (
                  <div key={p._id} className="border border-[#ccc] bg-white p-4 shadow-sm hover:border-[#999] transition">
                    <WireBox h="120px" label={`[ ${sku} ]`} className="mb-3" />
                    <div className="font-mono text-[10px] font-bold text-[#222] mb-1 truncate">{p.name}</div>
                    <div className="font-mono text-[9px] text-[#888] mb-2">{p.category}</div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-herb-700">
                      <span>Rs. {p.price}</span>
                      <span className="font-normal text-[#666]">{p.stock} units</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        <Footer />
      </main>
    </ProtectedRoute>
  );
}
