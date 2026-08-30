import React from "react";
import { X, Ruler } from "lucide-react";

export default function SizeGuideModal({ isOpen, onClose, category }) {
  if (!isOpen) return null;

  const isBottom = category?.toLowerCase().includes("bottom") || category?.toLowerCase().includes("cargo") || category?.toLowerCase().includes("pant");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-zinc-200 w-full max-w-2xl p-6 md:p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-black transition-colors"
          aria-label="Close size guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <Ruler className="w-5 h-5 text-zinc-900" />
          <h3 className="text-xl font-black uppercase tracking-widest text-zinc-900">
            Size Chart & Fit Guide
          </h3>
        </div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-6">
          All measurements are in inches. Designed for an authentic boxy/oversized drop-shoulder streetwear fit.
        </p>

        {isBottom ? (
          /* Bottoms/Cargos Size Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-zinc-200">
              <thead className="bg-zinc-100 text-zinc-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b border-zinc-200">Size</th>
                  <th className="p-3 border-b border-zinc-200">Waist (Inches)</th>
                  <th className="p-3 border-b border-zinc-200">Length (Inches)</th>
                  <th className="p-3 border-b border-zinc-200">Thigh / Leg Opening</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700">
                <tr>
                  <td className="p-3 font-black text-zinc-900">S (30)</td>
                  <td className="p-3">28 - 30"</td>
                  <td className="p-3">39.5"</td>
                  <td className="p-3">Relaxed Wide / Cinch Toggle</td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-zinc-900">M (32)</td>
                  <td className="p-3">30 - 32"</td>
                  <td className="p-3">40.5"</td>
                  <td className="p-3">Relaxed Wide / Cinch Toggle</td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-zinc-900">L (34)</td>
                  <td className="p-3">32 - 34"</td>
                  <td className="p-3">41.5"</td>
                  <td className="p-3">Relaxed Wide / Cinch Toggle</td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-zinc-900">XL (36)</td>
                  <td className="p-3">34 - 36"</td>
                  <td className="p-3">42.5"</td>
                  <td className="p-3">Relaxed Wide / Cinch Toggle</td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-zinc-900">XXL (38)</td>
                  <td className="p-3">36 - 38"</td>
                  <td className="p-3">43.0"</td>
                  <td className="p-3">Relaxed Wide / Cinch Toggle</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          /* Tops (Tees, Hoodies, Sweatshirts) Size Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-zinc-200">
              <thead className="bg-zinc-100 text-zinc-800 uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b border-zinc-200">Size</th>
                  <th className="p-3 border-b border-zinc-200">Chest (Inches)</th>
                  <th className="p-3 border-b border-zinc-200">Length (Inches)</th>
                  <th className="p-3 border-b border-zinc-200">Shoulder Drop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-zinc-700">
                <tr>
                  <td className="p-3 font-black text-zinc-900">S</td>
                  <td className="p-3">42"</td>
                  <td className="p-3">28.5"</td>
                  <td className="p-3">21.5"</td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-zinc-900">M</td>
                  <td className="p-3">44"</td>
                  <td className="p-3">29.5"</td>
                  <td className="p-3">22.5"</td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-zinc-900">L</td>
                  <td className="p-3">46"</td>
                  <td className="p-3">30.5"</td>
                  <td className="p-3">23.5"</td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-zinc-900">XL</td>
                  <td className="p-3">48"</td>
                  <td className="p-3">31.5"</td>
                  <td className="p-3">24.5"</td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-zinc-900">XXL</td>
                  <td className="p-3">50"</td>
                  <td className="p-3">32.0"</td>
                  <td className="p-3">25.5"</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 p-4 bg-zinc-50 border border-zinc-200">
          <h4 className="text-xs font-bold uppercase text-zinc-900 tracking-widest mb-1">
            Fit Recommendation:
          </h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Our items are pre-shrunk and already tailored to fit **relaxed & oversized**. If you prefer your standard oversized streetwear look, order your true size. For a more regular fitted appearance, size down one size.
          </p>
        </div>
      </div>
    </div>
  );
}
