"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { customerRegistrationSchema } from "./schema";

export default function CustomerRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validate with Zod then POST to backend
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const result = customerRegistrationSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      // Only send name, email, password — confirmPassword is frontend-only
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Registration successful! Please login.");
        router.push("/customer/login");
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

      {/* ── Left Decorative Panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gray-900 p-12 relative overflow-hidden">
        {/* Unsplash background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80')" }}
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
            Join thousands of businesses that trust us for their equipment rental needs.
          </p>
          <p className="text-gray-400 text-sm">
            Sign up today and get access to 500+ heavy machines across Bangladesh.
          </p>

          {/* Feature checklist */}
          <ul className="mt-6 space-y-3">
            {[
              "Free account — no setup fee",
              "Instant access to all equipment",
              "24/7 customer support",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-black text-xs flex-shrink-0">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
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
            <p className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-2">
              Customer Portal
            </p>
            <h1 className="text-3xl font-black text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-2">
              Register to start renting equipment today
            </p>
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
                placeholder="Enter your full name"
                className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password + Confirm Password — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min 8 chars"
                  className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                  Confirm
                </label>
                <input
                  type="password"
                  placeholder="Re-enter"
                  className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            {/* Password hint */}
            <p className="text-xs text-gray-400">
              Password must be at least 8 characters long
            </p>

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
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400 font-semibold">OR</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Sign in CTA */}
          <button
            onClick={() => router.push("/customer/login")}
            className="w-full py-4 rounded-xl font-black text-sm border-2 border-gray-200 hover:border-yellow-400 text-gray-700 hover:text-yellow-600 transition"
          >
            Already have an account? Sign In
          </button>

          {/* Back to home */}
          <p className="text-center text-sm text-gray-400 mt-5">
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
