import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Boxes,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <p className="text-xs uppercase font-bold tracking-widest text-zinc-400">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-zinc-950 text-white">
        <ShieldCheck className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black uppercase mb-2">Access Denied</h1>
        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-6">
          Administrator privileges are required to access this portal.
        </p>
        <Link
          to="/auth/login"
          className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest"
        >
          Login as Admin
        </Link>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard, end: true },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Inventory", path: "/admin/inventory", icon: Boxes },
    { name: "Coupons", path: "/admin/coupons", icon: Tag },
    { name: "Customers", path: "/admin/customers", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-white selection:text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-800">
            <img src="/assets/via-logo.png" alt="VIA" className="h-8 w-auto filter invert brightness-200" />
            <div>
              <span className="font-heading font-black tracking-[0.25em] text-base text-white block leading-none">
                VIA ADMIN
              </span>
              <span className="text-[8px] uppercase tracking-widest text-emerald-400 font-bold mt-1 block">
                Command Center
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-white text-black font-black"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-zinc-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}
