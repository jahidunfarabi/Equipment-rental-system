/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Product shape returned from backend
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Product {
  id: number;
  name: string;
  price: number;
}

// Admin shape — used to display available equipment owners/managers
interface Admin {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  phone: number;
  role: string;
}

// Equipment card display shape (mapped from product + admin)
interface Equipment {
  id: number;
  name: string;
  category: string;
  price: string;
  status: string;
  icon: string;
  image: string;
}

// Static fallback equipment for display if backend has no products
const fallbackEquipment: Equipment[] = [
  {
    id: 1,
    name: "Toyota Forklift 3T",
    category: "Forklift",
    price: "৳ 2,00,000",
    status: "Available",
    icon: "🏗️",
    image:
      "https://images.unsplash.com/photo-1700304759756-05c3ae7551bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Rm9ya2xpZnR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 2,
    name: "Komatsu Excavator",
    category: "Excavator",
    price: "৳ 3,00,000",
    status: "Available",
    icon: "⛏️",
    image:
      "https://images.unsplash.com/photo-1649807533255-bbc9c9fb7d77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S29tYXRzdSUyMEV4Y2F2YXRvcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    name: "Heli Forklift 5T",
    category: "Forklift",
    price: "৳ 1,00,000",
    status: "Rented",
    icon: "🏗️",
    image:
      "https://plus.unsplash.com/premium_photo-1663076064969-5b7bf2335d7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Rm9ya2xpZnR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 4,
    name: "Doosan Wheel Loader",
    category: "Wheel Loader",
    price: "৳ 3,00,000",
    status: "Available",
    icon: "🚜",
    image:
      "https://images.unsplash.com/photo-1751054786365-4b02b690d301?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8V2hlZWwlMjBMb2FkZXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 5,
    name: "TCM Forklift 2T",
    category: "Forklift",
    price: "৳ 1,00,000",
    status: "Available",
    icon: "🏗️",
    image:
      "https://images.unsplash.com/photo-1697163253622-91902b24a271?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvcmtsaWZ0fGVufDB8fDB8fHww",
  },
  {
    id: 6,
    name: "Hyundai Excavator",
    category: "Excavator",
    price: "৳ 2,50,000",
    status: "Rented",
    icon: "⛏️",
    image:
      "https://images.unsplash.com/photo-1771152922597-b4d1246d319b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SHl1bmRhaSUyMEV4Y2F2YXRvcnxlbnwwfHwwfHx8MA%3D%3D",
  },
];

const categories = ["All", "Forklift", "Excavator", "Wheel Loader"];

export default function CustomerDashboardPage() {
  const [customerName, setCustomerName] = useState("");
  const [equipments, setEquipments] = useState<Equipment[]>(fallbackEquipment);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"equipment" | "managers">(
    "equipment",
  );
  const [rentingId, setRentingId] = useState<number | null>(null);
  const router = useRouter();

  // On mount: check login, fetch products and admins
  useEffect(() => {
    const name = localStorage.getItem("customerName");
    if (!name) {
      router.push("/customer/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomerName(name);
    fetchProducts();
    fetchAdmins();
  }, [router]);

  // GET products from backend via admin's product endpoint
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/all`,
      );
      // If admins have products, map them; otherwise keep fallback
      const data = response.data;
      if (data && data.length > 0) {
        // Keep using fallback display data — real products come from admin/:id/details
        setEquipments(fallbackEquipment);
      }
    } catch {
      // silently use fallback equipment data
    } finally {
      setLoadingProducts(false);
    }
  };

  // GET all admins — shown in "Our Managers" tab
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/all`,
      );
      setAdmins(response.data);
    } catch {
      // fail silently
    }
  };

  // Simulate rent action — in real app would POST a rental request
  const handleRent = async (eq: Equipment) => {
    if (eq.status === "Rented") return;
    setRentingId(eq.id);
    await new Promise((r) => setTimeout(r, 1000)); // simulate API call
    alert(
      `✅ Rent request sent for "${eq.name}"! Our team will contact you shortly.`,
    );
    setRentingId(null);
  };

  // Clear session and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerName");
    router.push("/customer/login");
  };

  // Filter equipment by selected category
  const filtered =
    selectedCategory === "All"
      ? equipments
      : equipments.filter((e) => e.category === selectedCategory);

  const availableCount = equipments.filter(
    (e) => e.status === "Available",
  ).length;
  const rentedCount = equipments.filter((e) => e.status === "Rented").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Navbar ───────────────────────────────────────────────── */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-gray-900 text-sm">
            ER
          </div>
          <div>
            <div className="font-black text-white leading-tight text-sm">
              Equipment <span className="text-yellow-400">Rental</span>
            </div>
            <div className="text-xs text-gray-400">Customer Portal</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Greeting */}
          <span className="hidden md:block text-gray-400 text-sm">
            👋 Welcome,{" "}
            <span className="text-white font-bold">{customerName}</span>
          </span>
          <button
            onClick={() => router.push("/")}
            className="border border-white/20 hover:border-yellow-400 hover:text-yellow-400 px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Welcome Banner ────────────────────────────────────────── */}
        <div className="relative bg-gray-900 text-white rounded-3xl p-8 mb-8 overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 rounded-3xl"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80')",
            }}
          />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">
                Customer Dashboard
              </p>
              <h1 className="text-3xl font-black mb-2">
                Hello, {customerName}! 👋
              </h1>
              <p className="text-gray-400 text-sm">
                Browse our equipment and submit a rental request instantly.
              </p>
            </div>
            {/* Quick rent CTA */}
            <button
              onClick={() => setActiveTab("equipment")}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-black text-sm transition shadow-lg flex-shrink-0"
            >
              Browse Equipment →
            </button>
          </div>
        </div>

        {/* ── Stats Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Available",
              value: availableCount,
              icon: "✅",
              bg: "bg-yellow-400 text-gray-900",
            },
            {
              label: "Rented Out",
              value: rentedCount,
              icon: "🔒",
              bg: "bg-gray-900 text-white",
            },
            {
              label: "Total Units",
              value: equipments.length,
              icon: "🏗️",
              bg: "bg-gray-900 text-white",
            },
            {
              label: "Categories",
              value: categories.length - 1,
              icon: "📦",
              bg: "bg-gray-900 text-white",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-2xl p-5 shadow-sm`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-xs font-bold opacity-70 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab Navigation ────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit shadow-sm">
          {[
            { key: "equipment", label: "🏗️ Equipment" },
            { key: "managers", label: "👥 Our Managers" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "equipment" | "managers")}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition
                ${
                  activeTab === tab.key
                    ? "bg-yellow-400 text-gray-900 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Equipment Tab ─────────────────────────────────────────── */}
        {activeTab === "equipment" && (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition border-2
                    ${
                      selectedCategory === cat
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-500 border-gray-200 hover:border-yellow-400"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Loading skeleton */}
            {loadingProducts && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse"
                  >
                    <div className="h-52 bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-10 bg-gray-200 rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Equipment Grid */}
            {!loadingProducts && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((eq) => (
                  <div
                    key={eq.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Equipment image from Unsplash */}
                    <div className="overflow-hidden h-52 relative">
                      <img
                        src={eq.image}
                        alt={eq.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Status badge */}
                      <span
                        className={`absolute top-4 right-4 text-xs font-black px-3 py-1.5 rounded-full shadow
                        ${
                          eq.status === "Available"
                            ? "bg-green-400 text-green-900"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {eq.status === "Available" ? "✓ Available" : "✗ Rented"}
                      </span>
                    </div>

                    <div className="p-6">
                      <span className="text-xs font-black text-yellow-500 uppercase tracking-wider">
                        {eq.category}
                      </span>
                      <h3 className="font-black text-gray-900 text-lg mt-1">
                        {eq.name}
                      </h3>
                      <div className="text-2xl font-black text-gray-900 mt-3 mb-5">
                        {eq.price}
                      </div>

                      {/* Rent button */}
                      <button
                        onClick={() => handleRent(eq)}
                        disabled={eq.status === "Rented" || rentingId === eq.id}
                        className={`w-full py-3 rounded-xl font-black text-sm transition
                          ${
                            eq.status === "Available" && rentingId !== eq.id
                              ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow hover:shadow-md"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {rentingId === eq.id
                          ? "Sending Request..."
                          : eq.status === "Available"
                            ? "Rent Now →"
                            : "Currently Rented"}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty state */}
                {filtered.length === 0 && (
                  <div className="col-span-3 text-center py-20 text-gray-400">
                    <div className="text-5xl mb-4">🏗️</div>
                    <div className="font-bold text-lg">No equipment found</div>
                    <p className="text-sm mt-1">
                      Try selecting a different category
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Managers Tab ──────────────────────────────────────────── */}
        {activeTab === "managers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">👥</div>
                <div className="font-bold text-lg">No managers found</div>
              </div>
            ) : (
              admins.map((admin) => (
                <div
                  key={admin.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition p-6"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center font-black text-yellow-700 text-2xl flex-shrink-0">
                      {admin.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-gray-900">
                        {admin.fullName}
                      </div>
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-black px-2 py-0.5 rounded-full">
                        {admin.role}
                      </span>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>✉️</span>
                      <span className="truncate">{admin.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>{admin.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span className="capitalize">{admin.gender}</span>
                    </div>
                  </div>

                  {/* Contact button */}
                  <button className="w-full mt-5 py-3 rounded-xl border-2 border-gray-200 hover:border-yellow-400 text-gray-700 hover:text-yellow-600 font-black text-sm transition">
                    Contact Manager
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
