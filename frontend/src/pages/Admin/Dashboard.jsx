import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  Package,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { adminService } from "../../services/adminService";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboardStats();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
        Loading Command Center Analytics...
      </div>
    );
  }

  const { metrics, recentOrders = [], categoryBreakdown = [] } = data || {};

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
          Executive Overview
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
          Store Analytics & Operations
        </h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            ₹{metrics?.totalRevenue?.toLocaleString("en-IN") || 0}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">
            Today: ₹{metrics?.todayRevenue?.toLocaleString("en-IN") || 0}
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.totalOrders || 0}</p>
          <p className="text-[11px] text-amber-400 mt-1 font-semibold">
            {metrics?.pendingOrders || 0} Pending Fulfillment
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock SKUs</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.lowStockProducts || 0}</p>
          <Link
            to="/admin/inventory"
            className="text-[11px] text-zinc-400 hover:text-white underline mt-1 block"
          >
            Review Inventory
          </Link>
        </div>

        {/* Total Customers */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{metrics?.totalCustomers || 0}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Total Registered Members</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 shadow-md">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <h2 className="font-heading font-black text-base uppercase tracking-wider text-white">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-black tracking-wider text-[10px]">
                <th className="pb-3">Order #</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-zinc-500">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-white">{order.orderNumber}</td>
                    <td className="py-3 text-zinc-300">
                      {order.shippingAddress?.fullName || order.user?.name}
                    </td>
                    <td className="py-3 text-zinc-400">{order.items?.length || 0} items</td>
                    <td className="py-3 font-bold text-white">
                      ₹{order.total?.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-black uppercase">
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[9px] font-black uppercase">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/orders`}
                        className="text-xs font-bold text-white hover:underline uppercase"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
