"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface Admin {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  phone: number;
  role: string;
}

export default function AdminViewPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // GET single admin by ID
  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAdmin(res.data);
    } catch {
      setError("Failed to load admin details.");
    } finally {
      setLoading(false);
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
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="border border-white/20 hover:border-yellow-400 hover:text-yellow-400 px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-500 font-semibold">
              Loading admin details...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 p-5 rounded-2xl flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="font-black">Failed to load</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Admin Details Card */}
        {!loading && admin && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gray-900 px-8 py-8 flex items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-full bg-yellow-400 opacity-10 skew-x-6" />
              {/* Avatar */}
              <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center font-black text-gray-900 text-3xl shadow-lg flex-shrink-0">
                {admin.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="relative">
                <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-1">
                  Admin Profile
                </p>
                <h1 className="text-2xl font-black text-white">
                  {admin.fullName}
                </h1>
                <span className="bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full mt-2 inline-block">
                  {admin.role}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-8">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-5">
                Admin Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: admin.fullName, icon: "👤" },
                  { label: "Email Address", value: admin.email, icon: "✉️" },
                  { label: "Phone Number", value: admin.phone, icon: "📞" },
                  { label: "Gender", value: admin.gender, icon: "⚥" },
                  { label: "Role", value: admin.role, icon: "🏷️" },
                  { label: "Admin ID", value: `#${admin.id}`, icon: "🔑" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{item.icon}</span>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-wider">
                        {item.label}
                      </p>
                    </div>
                    <p className="font-black text-gray-900 text-lg capitalize">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => router.push(`/admin/dashboard/${id}/edit`)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-xl font-black text-sm transition shadow hover:shadow-md"
                >
                  Edit Admin →
                </button>
                <button
                  onClick={() => router.push("/admin/dashboard")}
                  className="flex-1 border-2 border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 py-4 rounded-xl font-black text-sm transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
