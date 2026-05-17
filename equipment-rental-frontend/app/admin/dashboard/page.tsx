"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Pusher from "pusher-js";
import { toast, Toaster } from "react-hot-toast";

interface Admin {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  phone: number;
  role: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export default function AdminDashboardPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"admins" | "customers">("admins");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  // ── useRef prevents Pusher from being created more than once ──────────────
  const pusherRef = useRef<Pusher | null>(null);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAdmins(res.data);
    } catch {
      console.error("Failed to fetch admins");
    } finally {
      setLoadingAdmins(false);
    }
  };

  const fetchCustomers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCustomers(res.data);
    } catch {
      console.error("Failed to fetch customers");
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    setDeletingAdminId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Delete failed. Make sure you are authorized.");
    } finally {
      setDeletingAdminId(null);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    setDeletingCustomerId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Delete failed.");
    } finally {
      setDeletingCustomerId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ── Pusher init — only once using useRef guard ────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdmins();
    fetchCustomers();

    // Guard: don't create a second Pusher instance (React StrictMode fix)
    if (pusherRef.current) return;

    Pusher.logToConsole = true; // shows connection logs in browser console

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    pusherRef.current = pusher;

    const channel = pusher.subscribe("admin-notifications");

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Pusher: subscribed to admin-notifications");
    });

    channel.bind(
      "new-customer",
      (data: {
        message: string;
        customerName: string;
        customerEmail: string;
      }) => {
        // Toast popup
        toast.success(`${data.message}\n👤 ${data.customerName}`, {
          duration: 5000,
          position: "top-right",
        });

        // Add to bell notification list
        setNotifications((prev) => [
          {
            id: Date.now(),
            title: data.message || "🆕 New Customer Registered!",
            body: `${data.customerName} — ${data.customerEmail}`,
            time: new Date().toLocaleTimeString(),
            read: false,
          },
          ...prev,
        ]);

        // Auto-refresh customers table
        fetchCustomers();
      },
    );

    // Cleanup only unsubscribes — does NOT disconnect (avoids StrictMode issue)
    return () => {
      channel.unbind_all();
      pusher.unsubscribe("admin-notifications");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster />

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-white fixed h-full z-40">
        <div
          className="flex items-center gap-3 px-6 py-6 border-b border-white/10 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-gray-900 text-lg">
            ER
          </div>
          <div>
            <div className="font-black text-white leading-tight">
              Equipment <span className="text-yellow-400">Rental</span>
            </div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-black mb-3 px-3">
            Management
          </p>
          {[
            { label: "All Admins", icon: "👥", tab: "admins" as const },
            { label: "All Customers", icon: "👤", tab: "customers" as const },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === item.tab
                  ? "bg-yellow-400 text-gray-900"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
          <button
            onClick={() => router.push("/admin/registration")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition"
          >
            <span>➕</span> Add Admin
          </button>
        </nav>
        <div className="px-4 py-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div>
            <h1 className="font-black text-gray-900 text-xl">
              {activeTab === "admins"
                ? "Admin Management"
                : "Customer Management"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeTab === "admins"
                ? "View, edit and manage all administrators"
                : "View and manage all registered customers"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "admins" && (
              <button
                onClick={() => router.push("/admin/registration")}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-4 py-2 rounded-xl text-sm font-black transition shadow-sm"
              >
                + Add Admin
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAllRead();
                }}
                className="relative w-10 h-10 bg-gray-100 hover:bg-yellow-100 rounded-xl flex items-center justify-center transition"
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-black text-gray-900 text-sm">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-xs text-gray-400 hover:text-red-500 font-bold transition"
                    >
                      Clear all
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-400">
                      <div className="text-3xl mb-2">🔔</div>
                      <p className="text-sm font-semibold">
                        No notifications yet
                      </p>
                      <p className="text-xs mt-1">
                        New customer registrations will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition ${
                            !n.read ? "bg-yellow-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">
                              🆕
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-gray-900 text-xs">
                                {n.title}
                              </p>
                              <p className="text-gray-500 text-xs mt-0.5 truncate">
                                {n.body}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                {n.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="lg:hidden bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Admins",
                value: admins.length,
                icon: "👥",
                bg: "bg-yellow-400 text-gray-900",
              },
              {
                label: "Total Customers",
                value: customers.length,
                icon: "👤",
                bg: "bg-gray-900 text-white",
              },
              {
                label: "Active Customers",
                value: customers.filter((c) => c.isActive).length,
                icon: "✅",
                bg: "bg-gray-900 text-white",
              },
              {
                label: "Notifications",
                value: unreadCount,
                icon: "🔔",
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

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit shadow-sm">
            {[
              { key: "admins" as const, label: "👥 Admins" },
              { key: "customers" as const, label: "👤 Customers" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black transition ${
                  activeTab === tab.key
                    ? "bg-yellow-400 text-gray-900 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Admins Table */}
          {activeTab === "admins" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-black text-gray-900">All Admins</h2>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-black px-3 py-1 rounded-full">
                  {admins.length} total
                </span>
              </div>
              {loadingAdmins ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-3">⏳</div>
                  <p className="font-semibold">Loading...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {[
                          "Name",
                          "Email",
                          "Gender",
                          "Phone",
                          "Role",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {admins.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-16 text-gray-400"
                          >
                            <div className="text-4xl mb-3">👥</div>
                            <p>No admins found</p>
                          </td>
                        </tr>
                      ) : (
                        admins.map((admin) => (
                          <tr
                            key={admin.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center font-black text-yellow-700 text-sm">
                                  {admin.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-gray-900">
                                  {admin.fullName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {admin.email}
                            </td>
                            <td className="px-6 py-4 capitalize text-gray-500">
                              {admin.gender}
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {admin.phone}
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-black">
                                {admin.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    router.push(`/admin/dashboard/${admin.id}`)
                                  }
                                  className="bg-gray-900 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/admin/dashboard/${admin.id}/edit`,
                                    )
                                  }
                                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  disabled={deletingAdminId === admin.id}
                                  className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-40"
                                >
                                  {deletingAdminId === admin.id
                                    ? "..."
                                    : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Customers Table */}
          {activeTab === "customers" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-black text-gray-900">All Customers</h2>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-black px-3 py-1 rounded-full">
                  {customers.length} total
                </span>
              </div>
              {loadingCustomers ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-3">⏳</div>
                  <p className="font-semibold">Loading...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["Customer", "Email", "Status", "Actions"].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-16 text-gray-400"
                          >
                            <div className="text-4xl mb-3">👤</div>
                            <p>No customers yet</p>
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr
                            key={customer.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center font-black text-blue-700 text-sm">
                                  {customer.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900">
                                    {customer.name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    ID: #{customer.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {customer.email}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black ${
                                  customer.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {customer.isActive ? "✓ Active" : "✗ Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() =>
                                  handleDeleteCustomer(customer.id)
                                }
                                disabled={deletingCustomerId === customer.id}
                                className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-40"
                              >
                                {deletingCustomerId === customer.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
