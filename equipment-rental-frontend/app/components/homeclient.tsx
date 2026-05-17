/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// ─── Props from SSR parent (page.tsx) ─────────────────────────────────────
interface Props {
  admins: { id: string; fullName: string }[];
}

// ─── Equipment categories ──────────────────────────────────────────────────
const categories = [
  { name: "Forklift", icon: "🏗️", desc: "Brand new & reconditioned forklifts" },
  {
    name: "Excavator",
    icon: "⛏️",
    desc: "Heavy duty excavators for construction",
  },
  {
    name: "Wheel Loader",
    icon: "🚜",
    desc: "Powerful wheel loaders for all terrains",
  },
  {
    name: "Hand Pallet Truck",
    icon: "🛻",
    desc: "Warehouse hydraulic pallet trucks",
  },
  { name: "Road Roller", icon: "🚧", desc: "Road construction & maintenance" },
  { name: "Crane", icon: "🏛️", desc: "Heavy lifting crane solutions" },
];

// ─── Featured products with Unsplash real images ───────────────────────────
const products = [
  {
    id: 1,
    name: "Toyota Forklift 3T",
    category: "Forklift",
    price: "৳ 2,00,000",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1700304759756-05c3ae7551bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Rm9ya2xpZnR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 2,
    name: "Komatsu Excavator",
    category: "Excavator",
    price: "৳ 3,00,000",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1649807533255-bbc9c9fb7d77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S29tYXRzdSUyMEV4Y2F2YXRvcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    name: "Heli Forklift 5T",
    category: "Forklift",
    price: "৳ 1,00,000",
    status: "Rented",
    image:
      "https://plus.unsplash.com/premium_photo-1663076064969-5b7bf2335d7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Rm9ya2xpZnR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 4,
    name: "Doosan Wheel Loader",
    category: "Wheel Loader",
    price: "৳ 3,00,000",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1751054786365-4b02b690d301?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8V2hlZWwlMjBMb2FkZXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 5,
    name: "TCM Forklift 2T",
    category: "Forklift",
    price: "৳ 1,00,000",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1697163253622-91902b24a271?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvcmtsaWZ0fGVufDB8fDB8fHww",
  },
  {
    id: 6,
    name: "Hyundai Excavator",
    category: "Excavator",
    price: "৳ 2,50,000",
    status: "Rented",
    image:
      "https://images.unsplash.com/photo-1771152922597-b4d1246d319b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SHl1bmRhaSUyMEV4Y2F2YXRvcnxlbnwwfHwwfHx8MA%3D%3D",
  },
];

const brands = ["Toyota", "Komatsu", "Hitachi", "Doosan", "TCM", "Hyundai"];

const services = [
  {
    icon: "🔧",
    title: "Equipment Rental",
    desc: "Short & long term rental solutions for all heavy equipment needs.",
  },
  {
    icon: "🛠️",
    title: "Spare Parts",
    desc: "Genuine spare parts for all major brands available in stock.",
  },
  {
    icon: "👨‍🔧",
    title: "Maintenance",
    desc: "Expert technicians for on-site maintenance and repairs.",
  },
  {
    icon: "🚚",
    title: "Delivery & Setup",
    desc: "Nationwide delivery and professional equipment setup.",
  },
];

const stats = [
  { num: "500+", label: "Equipment Units" },
  { num: "50+", label: "Happy Clients" },
  { num: "10+", label: "Years Experience" },
  { num: "24/7", label: "Support" },
];

// ─── HomeClient — CSR component, receives SSR data as props ───────────────
export default function HomeClient({ admins }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setLoginDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* ── Top Info Bar ─────────────────────────────────────────────────── */}
      <div className="bg-gray-900 text-gray-400 text-xs px-6 py-2.5 flex justify-between items-center">
        <div className="flex gap-6">
          <span>📞 09613-747777</span>
          <span className="hidden sm:block">✉️ info@equipmentrental.com</span>
        </div>
        <span className="text-gray-500">Equipment Rental Platform</span>
      </div>

      {/* ── Sticky Navbar ────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-11 h-11 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-gray-900 text-lg shadow-md">
              ER
            </div>
            <div>
              <div className="font-black text-gray-900 text-lg leading-tight">
                Equipment <span className="text-yellow-500">Rental</span>
              </div>
              <div className="text-xs text-gray-400">System Ltd.</div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
            <a href="#" className="text-yellow-500">
              Home
            </a>
            <a href="#categories" className="hover:text-yellow-500 transition">
              Products
            </a>
            <a href="#services" className="hover:text-yellow-500 transition">
              Services
            </a>
            <a href="#about" className="hover:text-yellow-500 transition">
              About
            </a>
            <a href="#contact" className="hover:text-yellow-500 transition">
              Contact
            </a>
          </div>

          {/* Desktop: Login Dropdown + Register */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push("/customer/registration")}
              className="border-2 border-gray-200 hover:border-yellow-400 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold transition"
            >
              Register
            </button>

            {/* Login dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLoginDropdown(!loginDropdown)}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-5 py-2.5 rounded-xl text-sm font-black transition flex items-center gap-2 shadow-md shadow-yellow-200"
              >
                <span>LOGIN</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${loginDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {loginDropdown && (
                <div className="absolute right-0 top-14 bg-white border border-gray-100 rounded-2xl shadow-2xl w-56 py-2 z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      router.push("/customer/login");
                      setLoginDropdown(false);
                    }}
                    className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-yellow-50 transition group"
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm group-hover:text-yellow-600">
                        Login as Customer
                      </div>
                      <div className="text-xs text-gray-400">
                        Rent equipment
                      </div>
                    </div>
                  </button>
                  <div className="mx-4 border-t border-gray-100" />
                  <button
                    onClick={() => {
                      router.push("/admin/login");
                      setLoginDropdown(false);
                    }}
                    className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-yellow-50 transition group"
                  >
                    <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center text-lg">
                      ⚡
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm group-hover:text-yellow-600">
                        Login as Admin
                      </div>
                      <div className="text-xs text-gray-400">Manage system</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-700 text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-5 pt-3 flex flex-col gap-3 text-sm font-semibold text-gray-700">
            <a href="#" className="text-yellow-500">
              Home
            </a>
            <a href="#categories" onClick={() => setMenuOpen(false)}>
              Products
            </a>
            <a href="#services" onClick={() => setMenuOpen(false)}>
              Services
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
            <hr className="border-gray-100" />
            <button
              onClick={() => {
                router.push("/customer/login");
                setMenuOpen(false);
              }}
              className="bg-blue-50 text-blue-700 py-3 rounded-xl text-center font-bold"
            >
              👤 Login as Customer
            </button>
            <button
              onClick={() => {
                router.push("/admin/login");
                setMenuOpen(false);
              }}
              className="bg-yellow-400 text-gray-900 py-3 rounded-xl text-center font-bold"
            >
              ⚡ Login as Admin
            </button>
            <button
              onClick={() => {
                router.push("/customer/registration");
                setMenuOpen(false);
              }}
              className="border-2 border-gray-200 py-3 rounded-xl text-center"
            >
              Register as Customer
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative bg-gray-900 text-white overflow-hidden min-h-[90vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80')",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-full bg-yellow-400 opacity-10 skew-x-6" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full">
          <div>
            <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-6">
              🏆 Top rental company in Bangladesh
            </span>
            <h1 className="text-5xl md:text-6xl font-black leading-[1.1] mb-6">
              Rent Heavy
              <br />
              <span className="text-yellow-400">Equipment</span>
              <br />
              Fast & Safe
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-md">
              Forklifts, Excavators, Wheel Loaders and more — quality machines,
              competitive prices, nationwide delivery.
            </p>
            <div className="flex flex-wrap gap-4 mb-14">
              <button
                onClick={() => router.push("/customer/registration")}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-black text-sm transition shadow-lg shadow-yellow-400/20 flex items-center gap-2"
              >
                Get Started →
              </button>
              <a
                href="#categories"
                className="border-2 border-white/20 hover:border-yellow-400 hover:text-yellow-400 text-white px-8 py-4 rounded-xl font-bold text-sm transition"
              >
                View Equipment
              </a>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {stats.map(({ num, label }) => (
                <div key={label} className="border-l-2 border-yellow-400 pl-4">
                  <div className="text-2xl font-black text-yellow-400">
                    {num}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 leading-tight">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img
                src="https://images.unsplash.com/photo-1642927778267-4e8b787b325a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhdnklMjBtYWNoaW5lcnl8ZW58MHx8MHx8fDA%3D"
                alt="Heavy construction equipment"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur text-gray-900 px-5 py-4 rounded-2xl shadow-xl">
                <div className="font-black text-xl text-yellow-500">
                  500+ Units
                </div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">
                  Ready to Rent Today
                </div>
              </div>
              <div className="absolute top-6 right-6 bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-black text-sm shadow">
                ✓ Available Now
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brands Strip ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-400 text-xs uppercase tracking-widest font-bold mb-5">
            Trusted Brands We Work With
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {brands.map((brand) => (
              <div
                key={brand}
                className="bg-white border-2 border-gray-100 hover:border-yellow-400 hover:shadow-md px-6 py-3 rounded-xl text-gray-600 font-black text-sm transition cursor-default"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SSR Data Section — Admin Count from Server ────────────────────── */}
      {/* This section uses data fetched server-side via SSR in page.tsx */}
      {admins.length > 0 && (
        <section className="bg-yellow-400 py-6 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <span className="text-2xl">⚡</span>
            <p className="font-black text-gray-900 text-sm">
              {admins.length} Expert Admin{admins.length > 1 ? "s" : ""}{" "}
              managing this platform — available 24/7 for support
            </p>
          </div>
        </section>
      )}

      {/* ── Equipment Categories ──────────────────────────────────────────── */}
      <section id="categories" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-yellow-500 text-xs font-black uppercase tracking-widest">
              Browse All
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Equipment Categories
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">
              Wide range of heavy equipment available for short and long term
              rental across Bangladesh
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="group bg-white border-2 border-gray-100 hover:border-yellow-400 rounded-2xl p-5 text-center transition cursor-pointer hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-black text-gray-800 text-sm group-hover:text-yellow-500 transition">
                  {cat.name}
                </div>
                <div className="text-xs text-gray-400 mt-1 hidden md:block leading-snug">
                  {cat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Equipment ────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-yellow-500 text-xs font-black uppercase tracking-widest">
              Top Picks
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Featured Equipment
            </h2>
            <p className="text-gray-500 mt-3 text-sm">
              Available for immediate rental — book now and get same-day
              delivery
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="overflow-hidden h-52 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-4 right-4 text-xs font-black px-3 py-1.5 rounded-full shadow
                    ${product.status === "Available" ? "bg-green-400 text-green-900" : "bg-red-500 text-white"}`}
                  >
                    {product.status === "Available"
                      ? "✓ Available"
                      : "✗ Rented"}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-black text-yellow-500 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-black text-gray-900 text-lg mt-1 mb-1">
                    {product.name}
                  </h3>
                  <div className="text-2xl font-black text-gray-900 mt-3 mb-5">
                    {product.price}
                  </div>
                  <button
                    onClick={() => router.push("/customer/login")}
                    disabled={product.status === "Rented"}
                    className={`w-full py-3 rounded-xl font-black text-sm transition
                      ${
                        product.status === "Available"
                          ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow hover:shadow-lg"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {product.status === "Available"
                      ? "Rent Now →"
                      : "Currently Rented"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-yellow-500 text-xs font-black uppercase tracking-widest">
              What We Do
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Our Services
            </h2>
            <p className="text-gray-500 mt-3 text-sm">
              End-to-end equipment solutions for construction, warehousing, and
              industry
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div
                key={service.title}
                className={`rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 cursor-default
                  ${i === 0 ? "bg-yellow-400 text-gray-900" : i === 3 ? "bg-yellow-400 text-gray-900" : "bg-gray-900 text-white"}`}
              >
                <div className="text-4xl mb-5">{service.icon}</div>
                <h3 className="font-black text-lg mb-3">{service.title}</h3>
                <p
                  className={`text-sm leading-relaxed ${i === 0 || i === 3 ? "text-gray-700" : "text-gray-400"}`}
                >
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ────────────────────────────────────────────────── */}
      <section id="about" className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="Our company"
              className="w-full h-[440px] object-cover"
            />
            <div className="absolute bottom-6 right-6 bg-yellow-400 text-gray-900 px-6 py-4 rounded-2xl shadow-2xl">
              <div className="font-black text-3xl">10+</div>
              <div className="text-xs font-bold mt-0.5">Years in Business</div>
            </div>
          </div>
          <div>
            <span className="bg-yellow-400 text-gray-900 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">
              About Us
            </span>
            <h2 className="text-4xl font-black mt-5 mb-5 leading-tight">
              Bangladesh's Leading Equipment Rental Company
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              With over 10 years of experience, we provide top-quality heavy
              equipment rentals across Bangladesh.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Genuine spare parts for all major brands",
                "24/7 technical support and on-site service",
                "Nationwide delivery and installation",
                "Flexible rental terms and competitive rates",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-gray-300 text-sm"
                >
                  <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-black text-xs flex-shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                ["500+", "Equipments"],
                ["50+", "Clients"],
                ["24/7", "Support"],
              ].map(([num, label]) => (
                <div
                  key={label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
                >
                  <div className="text-2xl font-black text-yellow-400">
                    {num}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-yellow-500 text-xs font-black uppercase tracking-widest">
              Get In Touch
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Contact Us
            </h2>
            <p className="text-gray-500 mt-3 text-sm">
              Reach out for rentals, spare parts, or technical service
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-5">
              {[
                {
                  icon: "📞",
                  title: "Phone",
                  info: "09613-747777",
                  sub: "Mon–Sat, 9am to 6pm",
                },
                {
                  icon: "✉️",
                  title: "Email",
                  info: "info@equipmentrental.com",
                  sub: "We reply within 24 hours",
                },
                {
                  icon: "📍",
                  title: "Address",
                  info: "Kuril, Dhaka, Bangladesh",
                  sub: "Head office location",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white border-2 border-gray-100 hover:border-yellow-400 rounded-2xl p-6 flex gap-5 items-center shadow-sm hover:shadow-md transition"
                >
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <div className="font-black text-gray-900">{item.title}</div>
                    <div className="text-gray-700 text-sm font-semibold">
                      {item.info}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm">
              <h3 className="font-black text-gray-900 text-xl mb-6">
                Send a Message
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition resize-none"
                />
                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-xl font-black text-sm transition shadow hover:shadow-md">
                  Send Message →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-gray-900 text-sm">
                ER
              </div>
              <span className="font-black text-lg">Equipment Rental</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bangladesh's trusted heavy equipment rental company since 2015.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-5 text-yellow-400 uppercase text-xs tracking-widest">
              Services
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                "Equipment Rental",
                "Spare Parts",
                "Maintenance",
                "Delivery & Setup",
              ].map((s) => (
                <li
                  key={s}
                  className="hover:text-yellow-400 cursor-pointer transition"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-5 text-yellow-400 uppercase text-xs tracking-widest">
              Equipment
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                "Forklift",
                "Excavator",
                "Wheel Loader",
                "Pallet Truck",
                "Road Roller",
              ].map((e) => (
                <li
                  key={e}
                  className="hover:text-yellow-400 cursor-pointer transition"
                >
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-5 text-yellow-400 uppercase text-xs tracking-widest">
              Account
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <button
                  onClick={() => router.push("/customer/login")}
                  className="hover:text-yellow-400 transition text-left"
                >
                  👤 Customer Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/customer/registration")}
                  className="hover:text-yellow-400 transition text-left"
                >
                  📝 Customer Register
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/admin/login")}
                  className="hover:text-yellow-400 transition text-left"
                >
                  ⚡ Admin Panel
                </button>
              </li>
            </ul>
            <div className="mt-6 space-y-2 text-gray-400 text-sm">
              <p>📞 09613-747777</p>
              <p>✉️ info@equipmentrental.com</p>
              <p>📍 Kuril, Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          © 2026 All rights reserved —{" "}
          <span className="text-yellow-400 font-bold">
            Equipment Rental System Ltd.
          </span>
        </div>
      </footer>
    </div>
  );
}
