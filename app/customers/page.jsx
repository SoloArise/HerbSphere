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

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await api.get("/api/customers");
        if (res.data && res.data.success) {
          setCustomers(res.data.data);
        }
      } catch (error) {
        console.error("Customers error:", error);
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f8fbf7] flex flex-col font-mono">
        <Navbar />
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <SectionLabel label="CRM" />
              <h1 className="text-3xl font-bold text-herb-900 sm:text-4xl">Customers</h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage your customer relations and profiles.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center border border-[#bbb] bg-white shadow-sm">
              <Loader label="LOADING CUSTOMERS..." />
            </div>
          ) : customers.length === 0 ? (
            <div className="border border-[#bbb] bg-white p-10 text-center font-mono text-[11px] text-[#666] shadow-sm">
              No customers found.
            </div>
          ) : (
            <div className="border border-[#bbb] bg-white p-4 lg:p-5 shadow-sm overflow-x-auto">
              <table className="w-full font-mono text-[10px] text-[#444] min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#ddd]">
                    {["Customer Name", "Email Address", "Phone Number", "Physical Address"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-2 text-[#999] font-normal tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c._id} className="border-b border-[#f0f0f0]">
                      <td className="py-3 px-2 font-bold">{c.name}</td>
                      <td className="py-3 px-2">{c.email}</td>
                      <td className="py-3 px-2">{c.phone}</td>
                      <td className="py-3 px-2 max-w-[240px] truncate">{c.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <Footer />
      </main>
    </ProtectedRoute>
  );
}
