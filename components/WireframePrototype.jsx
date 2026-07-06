"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Loader, toast } from "@/components/ui";

const API_HOST = typeof window === "undefined" ? "localhost" : window.location.hostname;
const API_BASE_URL = `http://${API_HOST}:5000`;
const PRODUCTS_API_URL = `${API_BASE_URL}/api/products`;
const DASHBOARD_API_URL = `${API_BASE_URL}/api/dashboard`;
const INSIGHTS_API_URL = `${API_BASE_URL}/api/insights`;

// Shared Components

function WireBox({
  h,
  label,
  className = "",
}) {
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

function WireButton({
  label,
  dark,
  onClick,
  small,
  full,
}) {
  return (
    <button
      onClick={onClick}
      className={`border cursor-pointer font-mono text-[10px] tracking-wide whitespace-nowrap ${
        small ? "px-3 py-1" : "px-4 py-2"
      } ${full ? "w-full" : ""} ${
        dark
          ? "bg-[#333] text-white border-[#333]"
          : "bg-white text-[#333] border-[#999]"
      }`}
    >
      [ {label} ]
    </button>
  );
}

function BrandLogo({ size = "md" }) {
  const frameSize = size === "lg" ? "w-14 h-14" : "w-8 h-8";

  return (
    <div className={`${frameSize} brand-logo-frame overflow-hidden border border-[#999] bg-white shrink-0`}>
      <img
        src="/logo.png"
        alt="HerbSphere logo"
        className="brand-logo h-full w-full scale-[1.85] object-cover"
      />
    </div>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative inline-flex h-7 w-14 shrink-0 items-center border border-[#999] bg-white px-1 transition-colors duration-300 hover:bg-[#f5f5f5]"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
    >
      <span className="absolute left-2 text-[#777] transition-opacity duration-300">
        <Sun size={12} strokeWidth={2} />
      </span>
      <span className="absolute right-2 text-[#777] transition-opacity duration-300">
        <Moon size={12} strokeWidth={2} />
      </span>
      <span
        className={`relative z-10 flex h-5 w-5 items-center justify-center border border-[#777] bg-[#333] text-white transition-transform duration-300 ease-out ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon size={11} strokeWidth={2} /> : <Sun size={11} strokeWidth={2} />}
      </span>
    </button>
  );
}

function NavBar({
  current,
  navigate,
  theme,
  onToggleTheme,
}) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Home", screen: "home" },
    { label: "Dashboard", screen: "dashboard" },
    { label: "Products", screen: "products" },
    { label: "AI Insights", screen: "ai-insights" },
  ];
  return (
    <header className="w-full border-b border-[#bbb] bg-white">
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-10 py-4">
        <div className="flex items-center gap-3">
          <BrandLogo />
          <span className="font-mono text-sm font-bold tracking-widest text-[#222]">
            HerbSphere
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {links.map((l) => (
            <button
              key={l.screen}
              onClick={() => navigate(l.screen)}
              className={`font-mono text-xs tracking-wide cursor-pointer border-b-2 pb-0.5 ${
                current === l.screen
                  ? "border-[#333] text-[#111]"
                  : "border-transparent text-[#666] hover:text-[#333]"
              }`}
            >
              {l.label}
            </button>
          ))}
          <WireButton label="Login" onClick={() => navigate("login")} small />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            className="font-mono text-xs border border-[#bbb] px-3 py-1 text-[#555]"
            onClick={() => setOpen(!open)}
          >
            {open ? "[ X ]" : "[ Menu ]"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-[#ddd] bg-white">
          {links.map((l) => (
            <button
              key={l.screen}
              onClick={() => { navigate(l.screen); setOpen(false); }}
              className={`w-full text-left px-5 py-3 font-mono text-xs border-b border-[#f0f0f0] ${
                current === l.screen ? "bg-[#f0f0f0] text-[#111]" : "text-[#555]"
              }`}
            >
              {l.label}
            </button>
          ))}
          <div className="px-5 py-3">
            <WireButton label="Login" onClick={() => { navigate("login"); setOpen(false); }} small />
          </div>
        </div>
      )}
    </header>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="inline-block font-mono text-[9px] text-[#888] tracking-widest uppercase border border-[#ccc] px-2 py-0.5 mb-2">
      {label}
    </div>
  );
}

function Divider() {
  return <div className="w-full border-t border-dashed border-[#ccc] my-5" />;
}

function getStockStatus(stock) {
  if (stock === 0) {
    return "Out of Stock";
  }

  if (stock <= 20) {
    return "Low Stock";
  }

  return "In Stock";
}

// Screen 1: Home

function HomeScreen({ navigate, theme, onToggleTheme, products, loadingProducts }) {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <NavBar current="home" navigate={navigate} theme={theme} onToggleTheme={onToggleTheme} />

      {/* Hero */}
      <section className="w-full border-b border-[#ddd] px-4 sm:px-8 lg:px-20 py-10 lg:py-16 bg-[#f5f5f5]">
        <SectionLabel label="Hero Section" />
        <div className="max-w-2xl">
          <div className="h-3 bg-[#bbb] w-full sm:w-[520px] mb-3 rounded-sm" />
          <div className="h-3 bg-[#bbb] w-4/5 sm:w-[380px] mb-5 rounded-sm" />
          <div className="h-2 bg-[#ccc] w-full sm:w-[460px] mb-2 rounded-sm" />
          <div className="h-2 bg-[#ccc] w-3/4 sm:w-[320px] mb-6 rounded-sm" />
          <div className="flex flex-wrap gap-3">
            <WireButton label="Get Started" dark onClick={() => navigate("dashboard")} />
            <WireButton label="Learn More" />
          </div>
        </div>
        <div className="mt-8">
          <WireBox h="160px" label="[ Hero Banner Placeholder ]" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 sm:px-8 lg:px-20 py-10 border-b border-[#ddd]">
        <SectionLabel label="Featured Products Section" />
        <div className="h-2 bg-[#bbb] w-40 mb-6 rounded-sm" />
        {loadingProducts ? (
          <div className="flex min-h-[180px] items-center justify-center border border-[#bbb] bg-white">
            <Loader label="LOADING PRODUCTS" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProducts.map((product) => (
                <div key={product.id} className="border border-[#bbb] p-4 bg-white">
                  <WireBox h="140px" label="[ Product Image ]" className="mb-4" />
                  <div className="h-2 bg-[#bbb] w-36 mb-2 rounded-sm" />
                  <div className="font-mono text-xs text-[#555] mb-1">{product.name}</div>
                  <div className="font-mono text-[9px] text-[#777] mb-1">{product.category}</div>
                  <div className="font-mono text-[9px] text-[#777] mb-4">{product.description}</div>
                  <WireButton label="View Product" small onClick={() => navigate("products")} />
                </div>
              ))}
          </div>
        )}
      </section>

      {/* AI Insights Preview */}
      <section className="px-4 sm:px-8 lg:px-20 py-10 border-b border-[#ddd] bg-[#f5f5f5]">
        <SectionLabel label="AI Insights Preview" />
        <div className="border border-[#bbb] bg-white p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="h-3 bg-[#bbb] w-56 mb-3 rounded-sm" />
              <div className="h-2 bg-[#ccc] w-full mb-2 rounded-sm" />
              <div className="h-2 bg-[#ccc] w-5/6 mb-2 rounded-sm" />
              <div className="h-2 bg-[#ccc] w-4/6 mb-6 rounded-sm" />
              <WireButton label="Explore AI Insights" dark onClick={() => navigate("ai-insights")} />
            </div>
            <div className="w-full lg:w-80 shrink-0">
              <WireBox h="160px" label="[ AI Analytics Preview Chart ]" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 lg:px-20 py-10 bg-[#eee] border-t border-[#ccc] mt-auto">
        <SectionLabel label="Footer" />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#333] mb-3">QUICK LINKS</div>
            {["Home", "Dashboard", "Products", "AI Insights", "About"].map((l) => (
              <div key={l} className="h-2 bg-[#bbb] w-24 mb-2 rounded-sm" />
            ))}
          </div>
          <div>
            <div className="font-mono text-[10px] font-bold text-[#333] mb-3">PRODUCTS</div>
            {["Essential Oils", "Aromatics", "Herbal Blends", "Wellness Kits"].map((l) => (
              <div key={l} className="h-2 bg-[#bbb] w-28 mb-2 rounded-sm" />
            ))}
          </div>
          <div>
            <div className="font-mono text-[10px] font-bold text-[#333] mb-3">CONTACT</div>
            <div className="h-2 bg-[#bbb] w-36 mb-2 rounded-sm" />
            <div className="h-2 bg-[#bbb] w-28 mb-2 rounded-sm" />
            <div className="h-2 bg-[#bbb] w-40 mb-2 rounded-sm" />
          </div>
          <div>
            <div className="font-mono text-[10px] font-bold text-[#333] mb-3">NEWSLETTER</div>
            <WireBox h="36px" label="[ Email Input ]" className="mb-2" />
            <WireButton label="Subscribe" small />
          </div>
        </div>
        <Divider />
        <div className="font-mono text-[9px] text-[#999] text-center">
          (c) 2026 HerbSphere. All rights reserved. | Privacy Policy | Terms of Use
        </div>
      </footer>
    </div>
  );
}

// Screen 2: Dashboard

function DashboardScreen({ navigate, theme, onToggleTheme, dashboardData, loadingDashboard }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const metrics = dashboardData?.metrics || [];
  const orders = dashboardData?.orders || [];

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <NavBar current="dashboard" navigate={navigate} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="flex flex-1 relative">
        {/* Mobile sidebar toggle */}
        <button
          className="lg:hidden absolute top-3 left-3 z-30 font-mono text-[10px] border border-[#bbb] bg-white px-2 py-1"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "[ X Close ]" : "[ Menu ]"}
        </button>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "flex" : "hidden"
          } lg:flex absolute lg:relative z-20 top-0 left-0 h-full w-52 border-r border-[#ddd] bg-[#f8f8f8] flex-col pt-6 shrink-0`}
        >
          <div className="px-5 mb-4">
            <div className="font-mono text-[9px] text-[#999] tracking-widest">NAVIGATION</div>
          </div>
          {[
            { label: "Dashboard", screen: "dashboard", active: true },
            { label: "Products", screen: "products" },
            { label: "Orders", screen: null },
            { label: "Analytics", screen: null },
            { label: "Settings", screen: null },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => { item.screen && navigate(item.screen); setSidebarOpen(false); }}
              className={`w-full text-left px-5 py-3 font-mono text-xs cursor-pointer border-l-2 ${
                item.active
                  ? "border-[#333] bg-[#ebebeb] text-[#111]"
                  : "border-transparent text-[#555] hover:bg-[#eee]"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-auto px-5 pb-6">
            <WireBox h="80px" label="[ User Profile ]" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6 pt-8 lg:pt-0">
            <div>
              <SectionLabel label="Main Content" />
              <h1 className="font-mono text-base lg:text-lg font-bold text-[#222]">Business Dashboard</h1>
              <div className="font-mono text-[9px] text-[#999]">
                Overview - {dashboardData?.period || "Loading"}
              </div>
            </div>
            <WireButton label="Export Report" small />
          </div>

          {/* KPI Cards */}
          {loadingDashboard ? (
            <div className="mb-6 flex min-h-[120px] items-center justify-center border border-[#bbb] bg-white">
              <Loader label="LOADING DASHBOARD" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {metrics.map((card) => (
                <div key={card.label} className="border border-[#bbb] bg-[#fafafa] p-4">
                  <div className="font-mono text-[9px] text-[#888] tracking-wide uppercase mb-2">
                    {card.label}
                  </div>
                  <div className="font-mono text-xl lg:text-2xl font-bold text-[#222] mb-1">{card.value}</div>
                  <div className="font-mono text-[9px] text-[#666]">{card.sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          <div className="border border-[#bbb] bg-white p-4 lg:p-5 mb-6">
            <SectionLabel label="Sales Analytics Chart" />
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="h-2 bg-[#bbb] w-36 rounded-sm" />
              <div className="flex gap-1">
                {["7D", "30D", "90D", "1Y"].map((t) => (
                  <span key={t} className="font-mono text-[9px] border border-[#bbb] px-2 py-0.5 text-[#666]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <WireBox h="200px" label="[ Sales Analytics Bar / Line Chart Placeholder ]" />
            <div className="flex gap-4 mt-3">
              {["Revenue", "Orders", "Returns"].map((l) => (
                <div key={l} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#bbb] border border-[#999] shrink-0" />
                  <span className="font-mono text-[9px] text-[#666]">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="border border-[#bbb] bg-white p-4 lg:p-5">
            <SectionLabel label="Recent Orders Table" />
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="h-2 bg-[#bbb] w-32 rounded-sm" />
              <WireButton label="View All Orders" small />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-[10px] text-[#444] min-w-[560px]">
                <thead>
                  <tr className="border-b border-[#ddd]">
                    {["Order ID", "Customer", "Product", "Amount", "Date", "Status"].map((h) => (
                      <th key={h} className="text-left py-2 px-2 text-[#999] font-normal tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loadingDashboard ? (
                    <tr>
                      <td colSpan={6} className="py-10">
                        <Loader label="LOADING ORDERS" />
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-[#f0f0f0]">
                        {[order.id, order.customer, order.product, order.amount, order.date, order.status].map((cell, j) => (
                          <td key={`${order.id}-${j}`} className="py-2 px-2 whitespace-nowrap">
                            {j === 5 ? (
                            <span className={`border px-2 py-0.5 text-[9px] ${
                              cell === "Fulfilled"
                                ? "border-[#aaa] text-[#444]"
                                : cell === "Processing"
                                ? "border-[#888] bg-[#eee] text-[#555]"
                                : "border-[#bbb] text-[#999]"
                            }`}>
                              {cell}
                            </span>
                            ) : cell}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Screen 3: Products

function ProductsScreen({
  navigate,
  theme,
  onToggleTheme,
  products,
  loadingProducts,
  searchQuery,
  onSearchQueryChange,
  refreshProducts,
}) {
  const [selected, setSelected] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [addForm, setAddForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    if (selected >= products.length) {
      setSelected(products.length ? 0 : null);
    }
  }, [products.length, selected]);

  const sel = selected !== null ? products[selected] : null;

  useEffect(() => {
    if (sel) {
      setEditForm({
        name: sel.name || "",
        category: sel.category || "",
        price: sel.price !== undefined ? String(sel.price) : "",
        stock: sel.stock !== undefined ? String(sel.stock) : "",
        description: sel.description || "",
      });
    }
  }, [sel, isEditOpen]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { name, category, price, stock, description } = addForm;
    if (!name || !category || price === "" || stock === "" || !description) {
      toast.error("All fields are required");
      return;
    }
    try {
      const response = await fetch(PRODUCTS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          price: Number(price),
          stock: Number(stock),
          description: description.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create product");
      }
      toast.success("Product created successfully!");
      setIsAddOpen(false);
      setAddForm({ name: "", category: "", price: "", stock: "", description: "" });
      if (refreshProducts) refreshProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { name, category, price, stock, description } = editForm;
    if (!name || !category || price === "" || stock === "" || !description) {
      toast.error("All fields are required");
      return;
    }
    try {
      const id = sel._id || sel.id;
      const response = await fetch(`${PRODUCTS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          price: Number(price),
          stock: Number(stock),
          description: description.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update product");
      }
      toast.success("Product updated successfully!");
      setIsEditOpen(false);
      if (refreshProducts) refreshProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const id = sel._id || sel.id;
      const response = await fetch(`${PRODUCTS_API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      toast.success("Product deleted successfully!");
      setIsDeleteOpen(false);
      setDetailOpen(false);
      setSelected(products.length > 1 ? 0 : null);
      if (refreshProducts) refreshProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <NavBar current="products" navigate={navigate} theme={theme} onToggleTheme={onToggleTheme} />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Product List */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 lg:border-r border-[#ddd] min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <SectionLabel label="Product List Section" />
              <h1 className="font-mono text-base lg:text-lg font-bold text-[#222]">Products</h1>
            </div>
            <WireButton label="+ Add Product" dark onClick={() => setIsAddOpen(true)} />
          </div>

          {/* Search + Filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search products..."
              className="h-9 flex-1 min-w-[160px] border border-[#999] bg-white px-3 font-mono text-[10px] text-[#333] outline-none placeholder:text-[#777] focus:border-[#333]"
            />
            <div className="w-[120px]">
              <WireBox h="36px" label="[ Category ]" />
            </div>
            <div className="w-[100px]">
              <WireBox h="36px" label="[ Stock ]" />
            </div>
          </div>

          {loadingProducts ? (
            <div className="flex min-h-[260px] items-center justify-center border border-[#bbb] bg-white">
              <Loader label="LOADING PRODUCTS" />
            </div>
          ) : products.length === 0 ? (
            <div className="border border-[#bbb] bg-white p-6 font-mono text-[10px] text-[#666]">
              No products available.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
              {products.map((p, i) => {
                const stockStatus = getStockStatus(p.stock);
                const sku = `HS-${String(p.id || p._id).substring(p.id ? 0 : 20).padStart(3, "0")}`;

                return (
                  <div
                    key={p._id || p.id}
                    className={`border p-3 cursor-pointer ${
                      selected === i ? "border-[#333] bg-[#f0f0f0]" : "border-[#ccc] bg-white hover:bg-[#fafafa]"
                    }`}
                    onClick={() => { setSelected(i); setDetailOpen(true); }}
                  >
                    <WireBox h="110px" label={`[ ${sku} ]`} className="mb-3" />
                    <div className="font-mono text-[10px] font-bold text-[#222] mb-1 leading-tight">{p.name}</div>
                    <div className="font-mono text-[9px] text-[#888] mb-2">{p.category}</div>
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className={`font-mono text-[9px] border px-1.5 py-0.5 ${
                        stockStatus === "In Stock"
                           ? "border-[#aaa] text-[#444]"
                           : stockStatus === "Low Stock"
                           ? "border-[#888] bg-[#eee] text-[#555]"
                           : "border-[#ccc] text-[#aaa]"
                      }`}>
                        {stockStatus}
                      </span>
                      <WireButton label="View" small onClick={() => { setSelected(i); setDetailOpen(true); }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel - drawer on mobile, sidebar on desktop */}
        {sel && (
          <aside className={`${
            detailOpen ? "fixed inset-0 z-30 bg-white overflow-auto lg:static lg:inset-auto lg:z-auto" : "hidden lg:block"
          } w-full lg:w-80 p-5 lg:p-6 bg-[#f8f8f8] shrink-0 lg:border-l border-[#ddd]`}>
            <div className="flex items-center justify-between mb-4 lg:mb-0">
              <SectionLabel label="Product Detail Panel" />
              <button
                className="lg:hidden font-mono text-[10px] border border-[#bbb] px-2 py-1"
                onClick={() => setDetailOpen(false)}
              >
                [ X Close ]
              </button>
            </div>
            <WireBox h="180px" label="[ Product Image ]" className="mb-4" />
            <div className="font-mono text-sm font-bold text-[#111] mb-1">{sel.name}</div>
            <div className="font-mono text-[9px] text-[#999] mb-3">SKU: HS-{String(sel.id || sel._id).substring(sel.id ? 0 : 20).padStart(3, "0")}</div>
            <Divider />
            <div className="font-mono text-[10px] text-[#555] mb-4 leading-relaxed">
              {sel.description}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-[#ccc] bg-white p-3">
                <div className="font-mono text-[9px] text-[#999] mb-1">PRICE</div>
                <div className="font-mono text-sm font-bold text-[#222]">Rs. {sel.price}</div>
              </div>
              <div className="border border-[#ccc] bg-white p-3">
                <div className="font-mono text-[9px] text-[#999] mb-1">QTY IN STOCK</div>
                <div className="font-mono text-sm font-bold text-[#222]">{sel.stock} units</div>
              </div>
            </div>
            <div className="border border-[#ccc] bg-white p-3 mb-4">
              <div className="font-mono text-[9px] text-[#999] mb-1">STOCK STATUS</div>
              <div className="font-mono text-[10px] text-[#444]">{getStockStatus(sel.stock)}</div>
            </div>
            <div className="flex flex-col gap-2">
              <WireButton label="Update Product" onClick={() => setIsEditOpen(true)} dark full />
              <WireButton label="Delete Product" onClick={() => setIsDeleteOpen(true)} full />
              <WireButton label="View AI Insights" onClick={() => navigate("ai-insights")} full />
            </div>
          </aside>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border border-[#999] bg-white p-6 shadow-md font-mono">
            <div className="flex justify-between items-center border-b border-[#ddd] pb-2 mb-4">
              <span className="font-bold text-xs">[ Add Product ]</span>
              <button className="text-[10px] border border-[#bbb] px-2 py-0.5" onClick={() => setIsAddOpen(false)}>[ Close ]</button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[9px] text-[#777] block mb-1">NAME</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#777] block mb-1">CATEGORY</label>
                <input
                  type="text"
                  required
                  value={addForm.category}
                  onChange={e => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-[#777] block mb-1">PRICE (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={addForm.price}
                    onChange={e => setAddForm({ ...addForm, price: e.target.value })}
                    className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333]"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-[#777] block mb-1">STOCK (Units)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={addForm.stock}
                    onChange={e => setAddForm({ ...addForm, stock: e.target.value })}
                    className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] text-[#777] block mb-1">DESCRIPTION</label>
                <textarea
                  required
                  rows="3"
                  value={addForm.description}
                  onChange={e => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333] resize-none"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-[#333] text-white border border-[#333] py-2 text-[10px] font-bold">[ Create ]</button>
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 bg-white text-[#333] border border-[#999] py-2 text-[10px] font-bold">[ Cancel ]</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border border-[#999] bg-white p-6 shadow-md font-mono">
            <div className="flex justify-between items-center border-b border-[#ddd] pb-2 mb-4">
              <span className="font-bold text-xs">[ Edit Product ]</span>
              <button className="text-[10px] border border-[#bbb] px-2 py-0.5" onClick={() => setIsEditOpen(false)}>[ Close ]</button>
            </div>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[9px] text-[#777] block mb-1">NAME</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#777] block mb-1">CATEGORY</label>
                <input
                  type="text"
                  required
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-[#777] block mb-1">PRICE (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.price}
                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333]"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-[#777] block mb-1">STOCK (Units)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.stock}
                    onChange={e => setEditForm({ ...editForm, stock: e.target.value })}
                    className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] text-[#777] block mb-1">DESCRIPTION</label>
                <textarea
                  required
                  rows="3"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border border-[#999] px-2 py-1.5 text-[10px] outline-none focus:border-[#333] resize-none"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-[#333] text-white border border-[#333] py-2 text-[10px] font-bold">[ Update ]</button>
                <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 bg-white text-[#333] border border-[#999] py-2 text-[10px] font-bold">[ Cancel ]</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm border border-[#999] bg-white p-6 shadow-md font-mono">
            <div className="flex justify-between items-center border-b border-[#ddd] pb-2 mb-4">
              <span className="font-bold text-xs">[ Delete Product ]</span>
              <button className="text-[10px] border border-[#bbb] px-2 py-0.5" onClick={() => setIsDeleteOpen(false)}>[ Close ]</button>
            </div>
            <div className="text-[10px] text-[#333] mb-4">
              Are you sure you want to delete <span className="font-bold">{sel.name}</span>? This action cannot be undone.
            </div>
            <div className="flex gap-2">
              <button onClick={handleDeleteConfirm} className="flex-1 bg-[#333] text-white border border-[#333] py-2 text-[10px] font-bold">[ Delete ]</button>
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-white text-[#333] border border-[#999] py-2 text-[10px] font-bold">[ Cancel ]</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Screen 4: Login / Signup

function LoginScreen({ navigate, theme, onToggleTheme }) {
  const [mode, setMode] = useState("login");
  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col relative">
      <header className="w-full border-b border-[#ccc] bg-white px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo />
          <span className="font-mono text-sm font-bold tracking-widest text-[#222]">HerbSphere</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("home")}
            className="font-mono text-[10px] text-[#666] cursor-pointer hover:text-[#333]"
          >
            &lt;- Back to Home
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-[440px]">
          <div className="flex border border-[#bbb] mb-6 bg-white">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 font-mono text-[10px] tracking-widest uppercase cursor-pointer ${
                  mode === m ? "bg-[#333] text-white" : "text-[#666] hover:bg-[#f5f5f5]"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div className="border border-[#bbb] bg-white p-6 sm:p-10">
            <SectionLabel label="Authentication Card" />
            <div className="flex justify-center mb-5">
              <BrandLogo size="lg" />
            </div>

            <div className="font-mono text-center text-sm font-bold text-[#222] mb-5">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </div>

            {mode === "signup" && (
              <div className="mb-3">
                <label className="font-mono text-[9px] text-[#666] block mb-1 tracking-wide">FULL NAME</label>
                <WireBox h="40px" label="[ Full name input field ]" />
              </div>
            )}
            <div className="mb-3">
              <label className="font-mono text-[9px] text-[#666] block mb-1 tracking-wide">EMAIL ADDRESS</label>
              <WireBox h="40px" label="[ Email input field ]" />
            </div>
            <div className="mb-4">
              <label className="font-mono text-[9px] text-[#666] block mb-1 tracking-wide">PASSWORD</label>
              <WireBox h="40px" label="[ Password input field ]" />
            </div>

            {mode === "login" && (
              <div className="flex justify-end mb-4">
                <span className="font-mono text-[9px] text-[#666] underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
            )}

            <WireButton label={mode === "login" ? "Log In" : "Create Account"} dark full onClick={() => navigate("dashboard")} />

            <Divider />

            <div className="font-mono text-[9px] text-center text-[#888]">
              {mode === "login" ? (
                <>Don&apos;t have an account?{" "}
                  <span className="underline cursor-pointer text-[#555]" onClick={() => setMode("signup")}>Sign Up</span>
                </>
              ) : (
                <>Already have an account?{" "}
                  <span className="underline cursor-pointer text-[#555]" onClick={() => setMode("login")}>Log In</span>
                </>
              )}
            </div>
          </div>

          <div className="font-mono text-[9px] text-center text-[#bbb] mt-5">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}

// Screen 5: AI Insights

function AIInsightsScreen({ navigate, theme, onToggleTheme, insightsData, loadingInsights }) {
  const recommendations = insightsData?.recommendations || [];
  const forecastSummary = insightsData?.forecastSummary || [];
  const suggestions = insightsData?.suggestions || [];

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <NavBar current="ai-insights" navigate={navigate} theme={theme} onToggleTheme={onToggleTheme} />

      <main className="px-4 sm:px-8 lg:px-20 py-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-7">
          <div>
            <SectionLabel label="AI Insights Header" />
            <h1 className="font-mono text-base lg:text-lg font-bold text-[#111]">AI Business Assistant</h1>
            <div className="font-mono text-[9px] text-[#888] mt-1">
              Powered by HerbSphere Intelligence Engine - Last updated: {insightsData?.lastUpdated || "Loading"}
            </div>
          </div>
          <div className="flex gap-2">
            <WireButton label="Refresh" small />
            <WireButton label="Export" dark small />
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Section 1: Upload */}
            <div className="border border-[#bbb] p-4 lg:p-5 bg-[#fafafa]">
              <SectionLabel label="Section 1 - Upload Data" />
              <div className="font-mono text-xs font-bold text-[#222] mb-3">Upload Sales Data</div>
              <WireBox h="90px" label="[ Drag & Drop - CSV, XLSX, JSON ]" className="mb-3" />
              <div className="font-mono text-[9px] text-[#999] mb-3">
                Supported: .csv / .xlsx / .json / Max 10MB
              </div>
              <WireButton label="Upload File" dark />
            </div>

            {/* Section 3: Recommendations */}
            <div className="border border-[#bbb] p-4 lg:p-5 bg-[#fafafa]">
              <SectionLabel label="Section 3 - Product Recommendations" />
              <div className="font-mono text-xs font-bold text-[#222] mb-3">AI Product Recommendations</div>
              {loadingInsights ? (
                <div className="flex min-h-[120px] items-center justify-center border border-[#ccc] bg-white">
                  <Loader label="LOADING INSIGHTS" />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recommendations.map((rec) => (
                    <div key={rec.name} className="border border-[#ccc] bg-white p-3">
                      <div className="font-mono text-[10px] font-bold text-[#222] mb-1">{rec.name}</div>
                      <div className="font-mono text-[9px] text-[#777]">{rec.reason}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right columns */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Section 2: Demand Forecasting */}
            <div className="border border-[#bbb] p-4 lg:p-5 bg-white">
              <SectionLabel label="Section 2 - Demand Forecasting" />
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="font-mono text-xs font-bold text-[#222]">30-Day Demand Forecast</div>
                <div className="flex gap-1 flex-wrap">
                  {["All Products", "Top 10", "Low Stock"].map((f) => (
                    <span key={f} className="font-mono text-[9px] border border-[#bbb] px-2 py-0.5 text-[#666]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <WireBox h="160px" label="[ Demand Forecast Line Chart - AI Prediction Overlay ]" className="mb-4" />
              <div className="border border-[#ddd] bg-[#f7f7f7] p-4">
                <div className="font-mono text-[9px] text-[#888] tracking-wide mb-2">AI PREDICTION SUMMARY</div>
                <div className="flex flex-wrap gap-4 lg:gap-6">
                  {loadingInsights ? (
                    <Loader label="LOADING FORECAST" />
                  ) : forecastSummary.map((s) => (
                    <div key={s.label}>
                      <div className="font-mono text-[9px] text-[#999]">{s.label}</div>
                      <div className="font-mono text-[10px] font-bold text-[#333]">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Marketing Generator */}
            <div className="border border-[#bbb] p-4 lg:p-5 bg-white">
              <SectionLabel label="Section 4 - Marketing Content Generator" />
              <div className="font-mono text-xs font-bold text-[#222] mb-4">AI Marketing Content Generator</div>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] text-[#666] block mb-1 tracking-wide">
                    DESCRIBE YOUR PRODUCT / CAMPAIGN
                  </label>
                  <WireBox h="80px" label="[ Text input - describe product or goal... ]" className="mb-3" />
                  <div className="flex gap-2 mb-3">
                    <WireBox h="32px" label="[ Tone ]" className="flex-1" />
                    <WireBox h="32px" label="[ Channel ]" className="flex-1" />
                  </div>
                  <WireButton label="Generate Content" dark />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-[#666] block mb-1 tracking-wide">
                    GENERATED MARKETING CONTENT
                  </label>
                  <WireBox h="130px" label="[ AI-generated marketing copy will appear here ]" />
                </div>
              </div>
            </div>

            {/* Section 5: AI Suggestions */}
            <div className="border border-[#bbb] p-4 lg:p-5 bg-[#fafafa]">
              <SectionLabel label="Section 5 - AI Suggestions" />
              <div className="font-mono text-xs font-bold text-[#222] mb-4">AI-Generated Business Recommendations</div>
              {loadingInsights ? (
                <div className="flex min-h-[160px] items-center justify-center border border-[#ddd] bg-white">
                  <Loader label="LOADING SUGGESTIONS" />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {suggestions.map((tip, i) => (
                    <div key={tip} className="flex gap-2 items-start border border-[#ddd] bg-white p-3">
                      <div className="font-mono text-[9px] text-[#888] shrink-0 w-4">{i + 1}.</div>
                      <div className="font-mono text-[9px] text-[#444] leading-relaxed flex-1">{tip}</div>
                      <WireButton label="Apply" small />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Root App

export default function App() {
  const [screen, setScreen] = useState("home");
  const [theme, setTheme] = useState("light");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [insightsData, setInsightsData] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoadingProducts(true);

      try {
        const query = searchQuery.trim();
        const url = query
          ? `${PRODUCTS_API_URL}/search?q=${encodeURIComponent(query)}`
          : PRODUCTS_API_URL;
        const response = await fetch(url, { signal: controller.signal });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load products");
        }

        setProducts(result.data);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        toast.error(error.message || "Unable to load products");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProducts(false);
        }
      }
    }

    const debounceId = window.setTimeout(loadProducts, searchQuery ? 300 : 0);

    return () => {
      controller.abort();
      window.clearTimeout(debounceId);
    };
  }, [searchQuery, refreshTrigger]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        const response = await fetch(DASHBOARD_API_URL, { signal: controller.signal });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load dashboard");
        }

        setDashboardData(result.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error(error.message || "Unable to load dashboard");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingDashboard(false);
        }
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, [refreshTrigger]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInsights() {
      try {
        const response = await fetch(INSIGHTS_API_URL, { signal: controller.signal });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load insights");
        }

        setInsightsData(result.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error(error.message || "Unable to load insights");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingInsights(false);
        }
      }
    }

    loadInsights();

    return () => controller.abort();
  }, []);

  function navigate(s) {
    setScreen(s);
    window.scrollTo(0, 0);
  }

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <div className={`w-full font-mono wireframe-theme-${theme}`}>
      {screen === "home" && (
        <HomeScreen
          navigate={navigate}
          theme={theme}
          onToggleTheme={toggleTheme}
          products={products}
          loadingProducts={loadingProducts}
        />
      )}
      {screen === "dashboard" && (
        <DashboardScreen
          navigate={navigate}
          theme={theme}
          onToggleTheme={toggleTheme}
          dashboardData={dashboardData}
          loadingDashboard={loadingDashboard}
        />
      )}
      {screen === "products" && (
        <ProductsScreen
          navigate={navigate}
          theme={theme}
          onToggleTheme={toggleTheme}
          products={products}
          loadingProducts={loadingProducts}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          refreshProducts={() => {
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}
      {screen === "login" && <LoginScreen navigate={navigate} theme={theme} onToggleTheme={toggleTheme} />}
      {screen === "ai-insights" && (
        <AIInsightsScreen
          navigate={navigate}
          theme={theme}
          onToggleTheme={toggleTheme}
          insightsData={insightsData}
          loadingInsights={loadingInsights}
        />
      )}
    </div>
  );
}
