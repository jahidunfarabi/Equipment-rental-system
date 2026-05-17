"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginSchema } from "./schema";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle form submission — validate then call backend
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate with Zod schema first
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/login`,
        { email, password }
      );

      if (response.status === 200 || response.status === 201) {
        // Save token to localStorage for protected routes
        localStorage.setItem("token", response.data.accessToken);
        router.push("/admin/dashboard");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Left Decorative Panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gray-900 p-12 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1661758211006-d41106e4be4d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFkbWluaXN0cmF0aW9uJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D')" }}
        />
        {/* Yellow diagonal accent */}
        <div className="absolute top-0 right-0 w-40 h-full bg-yellow-400 opacity-10 skew-x-6" />

        {/* Logo */}
        <div
          className="relative flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-11 h-11 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-gray-900 text-lg">
            ER
          </div>
          <div>
            <div className="font-black text-white text-lg leading-tight">
              Equipment <span className="text-yellow-400">Rental</span>
            </div>
            <div className="text-xs text-gray-400">System Ltd.</div>
          </div>
        </div>

        {/* Quote */}
        <div className="relative">
          <div className="text-yellow-400 text-5xl font-black mb-4">&quot;</div>
          <p className="text-white text-xl font-bold leading-snug mb-4">
            Full control over your equipment rental business — all in one place.
          </p>
          <p className="text-gray-400 text-sm">
            Admin portal for managing inventory, customers, and operations efficiently.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[["500+", "Equipments"], ["50+", "Clients"], ["24/7", "Support"]].map(([num, label]) => (
            <div key={label} className="border border-white/10 rounded-2xl p-4 text-center bg-white/5">
              <div className="text-xl font-black text-yellow-400">{num}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div
            className="flex items-center gap-2 mb-8 lg:hidden cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-gray-900 text-sm">
              ER
            </div>
            <span className="font-black text-gray-900">EquipmentRental</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <p className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-2">Admin Portal</p>
            <h1 className="text-3xl font-black text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-2">Sign in to access the admin dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email field */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="name@aiub.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
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
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Footer links */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/admin/registration")}
              className="text-yellow-600 font-black hover:underline"
            >
              Register
            </button>
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            <button
              onClick={() => router.push("/")}
              className="hover:text-gray-600 transition"
            >
              ← Back to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
