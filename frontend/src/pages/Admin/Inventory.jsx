import React, { useState, useEffect } from "react";
import { Boxes, AlertTriangle, Check, Save } from "lucide-react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedStock, setEditedStock] = useState({});
  const { addToast } = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await adminService.getInventory();
      if (res.success && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      addToast(err.message || "Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (productId, newStock) => {
    setEditedStock((prev) => ({
      ...prev,
      [productId]: Number(newStock),
    }));
  };

  const handleSaveStock = async (productId) => {
    const stockToSave = editedStock[productId];
    if (stockToSave === undefined) return;

    try {
      await adminService.updateInventory(productId, { stock: stockToSave });
      addToast("Stock updated successfully", "success");
      setEditedStock((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      fetchInventory();
    } catch (err) {
      addToast(err.message || "Failed to save stock", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
          Stock Management
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
          Inventory Control ({products.length} Products)
        </h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-black tracking-wider text-[10px] bg-zinc-950/60">
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-zinc-500">
                    Loading inventory records...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-zinc-500">
                    No products in inventory.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const currentStockVal =
                    editedStock[p._id] !== undefined ? editedStock[p._id] : p.stock;
                  const isLow = currentStockVal <= 10;
                  const isOut = currentStockVal <= 0;
                  const isDirty = editedStock[p._id] !== undefined;

                  return (
                    <tr key={p._id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.images?.[0] || "/assets/via-logo.png"}
                          alt={p.name}
                          className="w-10 h-12 object-cover bg-zinc-800 border border-zinc-700"
                        />
                        <div>
                          <p className="font-bold text-white max-w-xs truncate">{p.name}</p>
                          {p.variants?.length > 0 && (
                            <p className="text-[10px] text-zinc-400">
                              {p.variants.map((v) => `${v.size}: ${v.stock}`).join(" | ")}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-zinc-400 font-semibold">{p.sku}</td>
                      <td className="p-4 text-zinc-300">{p.category}</td>
                      <td className="p-4 font-black text-white">{p.stock} units</td>
                      <td className="p-4">
                        {isOut ? (
                          <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 text-[9px] font-black uppercase">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 text-[9px] font-black uppercase">
                            Low Stock (≤10)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-black uppercase">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            value={currentStockVal}
                            onChange={(e) => handleStockChange(p._id, e.target.value)}
                            className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-700 text-white text-xs text-center font-bold outline-hidden focus:border-white"
                          />
                          {isDirty && (
                            <button
                              onClick={() => handleSaveStock(p._id)}
                              className="px-3 py-1 bg-white hover:bg-zinc-200 text-black font-black text-[10px] uppercase tracking-wider flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" /> Save
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
