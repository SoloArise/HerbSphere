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

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get("/api/orders");
        if (res.data && res.data.success) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.error("Orders error:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f8fbf7] flex flex-col font-mono">
        <Navbar />
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <SectionLabel label="Operations" />
              <h1 className="text-3xl font-bold text-herb-900 sm:text-4xl">Orders</h1>
              <p className="mt-1 text-xs text-slate-500">
                Monitor and process customer transactions.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center border border-[#bbb] bg-white shadow-sm">
              <Loader label="LOADING ORDERS..." />
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-[#bbb] bg-white p-10 text-center font-mono text-[11px] text-[#666] shadow-sm">
              No orders found.
            </div>
          ) : (
            <div className="border border-[#bbb] bg-white p-4 lg:p-5 shadow-sm overflow-x-auto">
              <table className="w-full font-mono text-[10px] text-[#444] min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#ddd]">
                    {["Order ID", "Customer", "Items", "Total Amount", "Status", "Created At"].map((h) => (
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
                  {orders.map((o) => {
                    const sku = `HS-${o._id.substring(19).toUpperCase()}`;
                    const productNames = o.products
                      ?.map((p) => p.product?.name || "Unknown Product")
                      .join(", ") || "N/A";
                    const formattedDate = new Date(o.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <tr key={o._id} className="border-b border-[#f0f0f0]">
                        <td className="py-3 px-2 font-bold">{sku}</td>
                        <td className="py-3 px-2">{o.customer?.name || "Guest"}</td>
                        <td className="py-3 px-2 truncate max-w-[200px]">{productNames}</td>
                        <td className="py-3 px-2 font-bold">Rs. {o.totalAmount.toLocaleString()}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`border px-2 py-0.5 text-[9px] ${
                              o.status === "Fulfilled"
                                ? "border-[#8aa399] text-herb-700 bg-herb-50/50"
                                : o.status === "Processing"
                                ? "border-[#888] bg-[#eee] text-[#555]"
                                : "border-[#bbb] text-[#999]"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">{formattedDate}</td>
                      </tr>
                    );
                  })}
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
