"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface AdminForm {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  role: string;
}

export default function AdminEditPage() {
  const [formData, setFormData] = useState<AdminForm>({
    fullName: "",
    email: "",
    password: "",
    gender: "male",
    phone: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // GET current admin data to pre-fill the form
  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const admin = res.data;
      // Pre-fill form with existing data
      setFormData({
        fullName: admin.fullName || "",
        email: admin.email || "",
        password: "", // Password left blank — user enters new one if they want to change
        gender: admin.gender || "male",
        phone: String(admin.phone) || "",
        role: admin.role || "admin",
      });
    } catch {
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  // PUT — update admin by ID
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.password) {
      setError("Please enter a new password to update.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/update/${id}`,
        {
          ...formData,
          phone: Number(formData.phone), // Convert phone string to number for backend DTO
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuccess("Admin updated successfully!");
      // Redirect to dashboard after short delay
      setTimeout(() => router.push("/admin/dashboard"), 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // useEffect AFTER fetchAdmin is declared
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) fetchAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
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
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </div>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="border border-white/20 hover:border-yellow-400 hover:text-yellow-400 px-4 py-2 rounded-xl text-xs font-bold transition"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-500 font-semibold">Loading admin data...</p>
          </div>
        )}

        {/* Edit Form */}
        {!loading && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gray-900 px-8 py-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-full bg-yellow-400 opacity-10 skew-x-6" />
              <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2 relative">
                Edit Admin
              </p>
              <h1 className="text-2xl font-black text-white relative">
                Update Admin Details
              </h1>
              <p className="text-gray-400 text-sm mt-1 relative">
                Changes will be saved immediately after submission
              </p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password (required to update)"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Must be at least 8 characters with 1 uppercase letter
                  </p>
                </div>

                {/* Gender + Phone side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 uppercase tracking-wider block mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full p-4 border-2 border-gray-100 focus:border-yellow-400 rounded-xl text-sm outline-none transition bg-gray-50 focus:bg-white"
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

                {/* Success message */}
                {success && (
                  <div className="bg-green-50 border-2 border-green-100 text-green-600 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <span>✅</span> {success}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex-1 py-4 rounded-xl font-black text-sm transition
                      ${
                        saving
                          ? "bg-yellow-200 text-yellow-600 cursor-not-allowed"
                          : "bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow-lg shadow-yellow-200"
                      }`}
                  >
                    {saving ? "Saving Changes..." : "Save Changes →"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/admin/dashboard")}
                    className="flex-1 border-2 border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 py-4 rounded-xl font-black text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
