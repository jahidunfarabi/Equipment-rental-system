"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { registrationSchema } from "./schema";

export default function AdminRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "male",
    phone: "",
    role: "admin", // Default role is admin — read only
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form using Zod schema
    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      // Convert phone from string to number before sending to backend
      const payload = {
        ...formData,
        phone: Number(formData.phone),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/create`,
        payload
      );

      if (response.status === 201 || response.status === 200) {
        alert("Admin Registered Successfully!");
        router.push("/admin/login");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Left Panel (decorative) ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gray-900 p-12 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80')" }}
        />
        {/* Yellow diagonal accent */}
        <div className="absolute top-0 right-0 w-40 h-full bg-yellow-400 opacity-10 skew-x-6" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-11 h-11 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-gray-900 text-lg">
            ER
          </div>
          <div>
            <div className="font-black text-white text-lg leading-tight">
              Equipment<span className="text-yellow-400">Rental</span>
            </div>
            <div className="text-xs text-gray-400">System Ltd.</div>
          </div>
        </div>

        {/* Middle: quote */}
        <div className="relative">
          <div className="text-yellow-400 text-5xl font-black mb-4">&quot;</div>
          <p className="text-white text-xl font-bold leading-snug mb-4">
            Manage your equipment rental system with ease and efficiency.
          </p>
          <p className="text-gray-400 text-sm">
            Admin portal — full control over inventory, customers, and operations.
          </p>
        </div>

        {/* Bottom: stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[["500+", "Equipments"], ["50+", "Clients"], ["24/7", "Support"]].map(([num, label]) => (
            <div key={label} className="border border-white/10 rounded-2xl p-4 text-center bg-white/5">
              <div className="text-xl font-black text-yellow-400">{num}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 lg:hidden cursor-pointer" onClick={() => router.push("/")}>
              <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-gray-900 text-sm">ER</div>
              <span className="font-black text-gray-900">EquipmentRental</span>
            </div>
            <p className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-2">Admin Portal</p>
            <h1 className="text-3xl font-black text-gray-900">Create Admin Account</h1>
            <p className="text-gray-500 text-sm mt-2">Fill in the details below to register a new admin</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@aiub.edu"
                className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Only @aiub.edu emails are allowed</p>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Min 8 chars, 1 uppercase"
                className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {/* Gender + Phone — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                  Gender
                </label>
                <select
                  className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Role — read only */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                readOnly
                className="w-full p-4 border-2 border-gray-100 rounded-xl text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-100 text-red-600 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black text-sm transition
                ${loading
                  ? "bg-yellow-200 text-yellow-600 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow-lg shadow-yellow-200 hover:shadow-xl"
                }`}
            >
              {loading ? "Creating Account..." : "Create Admin Account →"}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/admin/login")}
              className="text-yellow-600 font-black hover:underline"
            >
              Sign In
            </button>
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            <button onClick={() => router.push("/")} className="hover:text-gray-600 transition">
              ← Back to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
