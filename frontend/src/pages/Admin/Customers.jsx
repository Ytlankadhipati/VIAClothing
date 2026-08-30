import React, { useState, useEffect } from "react";
import { Search, User, Mail, Phone, MapPin } from "lucide-react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await adminService.getCustomers();
        if (res.success && res.data.customers) {
          setCustomers(res.data.customers);
        }
      } catch (err) {
        addToast(err.message || "Failed to load customers", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
          User Accounts
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
          Registered Customers ({customers.length})
        </h1>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 pl-10 text-xs bg-zinc-900 border border-zinc-800 focus:border-white text-white outline-hidden"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-black tracking-wider text-[10px] bg-zinc-950/60">
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Addresses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-zinc-500">
                    Loading customer directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-zinc-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      {c.name}
                    </td>
                    <td className="p-4 text-zinc-300">{c.email}</td>
                    <td className="p-4 text-zinc-400">{c.phone || "—"}</td>
                    <td className="p-4 text-zinc-400">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-zinc-400">{c.addresses?.length || 0} saved</td>
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
