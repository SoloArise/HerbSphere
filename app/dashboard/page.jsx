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

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get("/api/dashboard");
        if (res.data && res.data.success) {
          setData(res.data.data);
        } else {
          toast.error("Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const metrics = data?.metrics || [];
  const orders = data?.orders || [];

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#f8fbf7] flex flex-col font-mono">
        <Navbar />
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <SectionLabel label="Workspace" />
              <h1 className="text-3xl font-bold text-herb-900 sm:text-4xl">Dashboard</h1>
              <p className="mt-1 text-xs text-slate-500">
                Overview - {data?.period || "Loading..."}
              </p>
            </div>
            <button
              onClick={() => toast.info("Report export started")}
              className="border border-[#999] bg-white text-[#333] cursor-pointer font-mono text-[10px] tracking-wide whitespace-nowrap px-4 py-2"
            >
              [ Export Report ]
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center border border-[#bbb] bg-white shadow-sm">
              <Loader label="LOADING BUSINESS METRICS..." />
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {metrics.map((card) => (
                  <div key={card.label} className="border border-[#bbb] bg-white p-4 shadow-sm">
                    <div className="font-mono text-[9px] text-[#888] tracking-wide uppercase mb-2">
                      {card.label}
                    </div>
                    <div className="font-mono text-xl lg:text-2xl font-bold text-[#111] mb-1">
                      {card.value}
                    </div>
                    <div className="font-mono text-[9px] text-[#666]">{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="border border-[#bbb] bg-white p-4 lg:p-5 mb-6 shadow-sm">
                <SectionLabel label="Sales Analytics Chart" />
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="h-2 bg-[#bbb] w-36 rounded-sm" />
                  <div className="flex gap-1">
                    {["7D", "30D", "90D", "1Y"].map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[9px] border border-[#bbb] px-2 py-0.5 text-[#666] cursor-pointer hover:bg-slate-50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <WireBox h="200px" label="[ Live Sales Analytics Bar / Line Chart ]" />
              </div>

              {/* Orders Table */}
              <div className="border border-[#bbb] bg-white p-4 lg:p-5 shadow-sm">
                <SectionLabel label="Recent Orders Table" />
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-[10px] text-[#444] min-w-[560px]">
                    <thead>
                      <tr className="border-b border-[#ddd]">
                        {["Order ID", "Customer", "Product", "Amount", "Date", "Status"].map((h) => (
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
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-[#999]">
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="border-b border-[#f0f0f0]">
                            {[
                              order.id,
                              order.customer,
                              order.product,
                              order.amount,
                              order.date,
                              order.status,
                            ].map((cell, j) => (
                              <td key={`${order.id}-${j}`} className="py-2 px-2 whitespace-nowrap">
                                {j === 5 ? (
                                  <span
                                    className={`border px-2 py-0.5 text-[9px] ${
                                      cell === "Fulfilled"
                                        ? "border-[#8aa399] text-herb-700 bg-herb-50/50"
                                        : cell === "Processing"
                                        ? "border-[#888] bg-[#eee] text-[#555]"
                                        : "border-[#bbb] text-[#999]"
                                    }`}
                                  >
                                    {cell}
                                  </span>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
        <Footer />
      </main>
    </ProtectedRoute>
  );
}
