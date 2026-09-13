import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { productService } from "../../services/productService";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "Oversized Tees",
    collection: "Essentials",
    price: 1299,
    compareAtPrice: 1999,
    discount: "35% OFF",
    sku: "",
    gsm: "240 GSM Super Combed Cotton",
    fit: "Relaxed Boxy Drop-Shoulder Fit",
    description: "",
    images: [],
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 50,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({ limit: 100 });
      if (res.success && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      addToast(err.message || "Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setImageUrlInput("");
    setFormData({
      name: "",
      category: "Oversized Tees",
      collection: "Essentials",
      price: 1299,
      compareAtPrice: 1999,
      discount: "35% OFF",
      sku: `VIA-PROD-${Date.now().toString().slice(-4)}`,
      gsm: "240 GSM Super Combed Cotton",
      fit: "Relaxed Boxy Drop-Shoulder Fit",
      description: "Engineered from heavyweight cotton with signature boxy drape.",
      images: [],
      sizes: ["S", "M", "L", "XL", "XXL"],
      featured: false,
      bestseller: false,
      newArrival: true,
      stock: 50,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setImageUrlInput("");
    setFormData({
      name: p.name,
      category: p.category,
      collection: p.collection,
      price: p.price,
      compareAtPrice: p.compareAtPrice || "",
      discount: p.discount || "",
      sku: p.sku,
      gsm: p.gsm || "",
      fit: p.fit || "",
      description: p.description,
      images: p.images || [],
      sizes: p.sizes || ["S", "M", "L", "XL", "XXL"],
      featured: !!p.featured,
      bestseller: !!p.bestseller,
      newArrival: !!p.newArrival,
      stock: p.stock || 50,
    });
    setModalOpen(true);
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images.filter(Boolean), trimmed],
    }));
    setImageUrlInput("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData((prev) => {
      const imgs = [...prev.images];
      const [chosen] = imgs.splice(index, 1);
      return {
        ...prev,
        images: [chosen, ...imgs],
      };
    });
  };

  const compressImageFile = (file) => {
    return new Promise((resolve) => {
      if (!file.type || !file.type.startsWith("image/") || file.type === "image/svg+xml") {
        return resolve(file);
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressed);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.82
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadingImage(true);
      const uploadedUrls = [];
      for (const file of files) {
        const optimizedFile = await compressImageFile(file);
        const data = new FormData();
        data.append("image", optimizedFile);
        const res = await adminService.uploadImage(data);
        if (res.success && res.data.url) {
          uploadedUrls.push(res.data.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images.filter(Boolean), ...uploadedUrls],
        }));
        addToast(`${uploadedUrls.length} photo(s) added successfully`, "success");
      }
    } catch (err) {
      addToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.images || formData.images.filter(Boolean).length === 0) {
      addToast("Please upload or add at least one product photo", "error");
      return;
    }
    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct._id, formData);
        addToast("Product updated successfully", "success");
      } else {
        await adminService.createProduct(formData);
        addToast("Product created successfully", "success");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      addToast(err.message || "Failed to save product", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminService.deleteProduct(id);
      addToast("Product deleted", "info");
      fetchProducts();
    } catch (err) {
      addToast(err.message || "Failed to delete product", "error");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
            Catalog Management
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
            Streetwear Products ({products.length})
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products by title, SKU, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 pl-10 text-xs bg-zinc-900 border border-zinc-800 focus:border-white text-white outline-hidden"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900 border border-zinc-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-black tracking-wider text-[10px] bg-zinc-950/60">
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-zinc-500">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-zinc-500">
                    No matching products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.images?.[0] || "/assets/via-logo.png"}
                        alt={p.name}
                        className="w-10 h-12 object-cover bg-zinc-800 border border-zinc-700"
                      />
                      <span className="font-bold text-white max-w-xs truncate">{p.name}</span>
                    </td>
                    <td className="p-4 font-mono text-zinc-400 font-semibold">{p.sku}</td>
                    <td className="p-4 text-zinc-300">{p.category}</td>
                    <td className="p-4 font-black text-white">₹{p.price?.toLocaleString("en-IN")}</td>
                    <td className="p-4">
                      <span
                        className={`font-bold ${
                          p.stock <= 10 ? "text-amber-400" : "text-emerald-400"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {p.featured && (
                          <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 uppercase">
                            Featured
                          </span>
                        )}
                        {p.newArrival && (
                          <span className="text-[9px] bg-white text-black font-bold px-1.5 py-0.5 uppercase">
                            New Drop
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-sm"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-sm"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <h3 className="font-heading font-black text-lg uppercase tracking-wider text-white">
                {editingProduct ? "Edit Streetwear Piece" : "Create New Streetwear Piece"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden focus:border-white"
                  >
                    <option value="Oversized Tees">Oversized Tees</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Hoodies & Sweatshirts">Hoodies & Sweatshirts</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Mugs">Mugs</option>
                    <option value="Caps & Headwear">Caps & Headwear</option>
                    <option value="Custom Print">Custom Print</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Collection *
                  </label>
                  <select
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden focus:border-white"
                  >
                    <option value="Essentials">Essentials</option>
                    <option value="Street">Street</option>
                    <option value="Oversized">Oversized</option>
                    <option value="New Drop">New Drop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const c = formData.compareAtPrice;
                      const disc = c && c > p && p > 0 ? `${Math.round(((c - p) / c) * 100)}% OFF` : "";
                      setFormData({ ...formData, price: p, discount: disc });
                    }}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden focus:border-white"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold uppercase tracking-wider text-zinc-400">
                      MRP / Compare (₹)
                    </label>
                    {formData.discount && (
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-1 py-0.2 border border-emerald-800">
                        {formData.discount}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) => {
                      const c = Number(e.target.value);
                      const p = formData.price;
                      const disc = c && c > p && p > 0 ? `${Math.round(((c - p) / c) * 100)}% OFF` : "";
                      setFormData({ ...formData, compareAtPrice: c, discount: disc });
                    }}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden focus:border-white"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    GSM Spec
                  </label>
                  <input
                    type="text"
                    value={formData.gsm}
                    onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}
                    placeholder="240 GSM Super Combed Cotton"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden focus:border-white"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Fit Silhouette
                  </label>
                  <input
                    type="text"
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    placeholder="Relaxed Boxy Drop-Shoulder Fit"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden focus:border-white"
                />
              </div>

              {/* Multiple Images Upload & Gallery */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 text-xs">
                    Product Photos ({formData.images?.filter(Boolean).length || 0}) *
                  </label>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Add front, back & side angles
                  </span>
                </div>

                {/* Upload & URL Input Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <label className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 shrink-0 border border-zinc-700 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingImage ? "Uploading..." : "Upload Photos (Multiple)"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste photo URL (https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 text-white text-xs outline-hidden focus:border-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-zinc-800 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-colors border border-zinc-700"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Thumbnails Preview Grid */}
                {formData.images && formData.images.filter(Boolean).length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2 p-3 bg-zinc-950 border border-zinc-800/80">
                    {formData.images.filter(Boolean).map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square bg-zinc-900 border border-zinc-700 overflow-hidden shadow-sm"
                      >
                        <img
                          src={imgUrl}
                          alt={`Angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Angle Label Badge */}
                        <span
                          className={`absolute top-1 left-1 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 shadow-sm ${
                            idx === 0
                              ? "bg-amber-400 text-black font-extrabold"
                              : "bg-black/80 text-zinc-300"
                          }`}
                        >
                          {idx === 0 ? "Main / Front" : idx === 1 ? "Back" : `Angle ${idx + 1}`}
                        </span>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        {/* Make Primary action for non-first items */}
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="absolute bottom-0 inset-x-0 py-1 bg-black/85 hover:bg-black text-[8px] text-amber-300 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity text-center"
                          >
                            Set Main
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
                    No product photos added yet. Upload files or paste URLs above.
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-white"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="accent-white"
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="accent-white"
                  />
                  Best Seller
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-zinc-700 text-zinc-300 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black font-black uppercase tracking-wider"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
