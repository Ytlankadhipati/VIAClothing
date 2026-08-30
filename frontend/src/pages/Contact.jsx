import React, { useState } from "react";
import { MessageCircle, Mail, MapPin, Clock, Send, ChevronDown, ChevronUp } from "lucide-react";
import InstagramIcon from "../components/InstagramIcon";
import { WHATSAPP_NUMBER, getGeneralWhatsAppUrl } from "../utils/whatsapp";
import { useToast } from "../context/ToastContext";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState(null);
  const { addToast } = useToast();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    addToast("Inquiry submitted! Our team will respond shortly.", "success");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "Order Inquiry",
      message: "",
    });
  };

  const faqs = [
    {
      q: "How do I place an order on VIA?",
      a: "Browse our shop, choose your desired product and size, then click 'ORDER ON WHATSAPP'. You will be redirected to WhatsApp with a prefilled message containing your product, size, and quantity. Our concierge will confirm payment details (UPI, Netbanking, Cards) and shipping address immediately.",
    },
    {
      q: "What is your shipping timeline?",
      a: "All orders are processed and dispatched within 24 to 48 hours. Express delivery takes 3–5 working days for metro cities across India, and 5–7 days for all other pin codes.",
    },
    {
      q: "Can I exchange for a different size if it doesn't fit?",
      a: "Yes! We offer a 7-Day Size Exchange policy. As long as the garment is unworn and unwashed with original tags attached, simply message us on WhatsApp to initiate a smooth doorstep pickup and exchange.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all UPI applications (Google Pay, PhonePe, Paytm), Netbanking, Credit/Debit Cards, and Bank Transfer.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-700 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
            Direct Concierge
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-zinc-900 mt-1 mb-3">
            CONTACT & ORDERS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 uppercase tracking-widest leading-relaxed font-medium">
            Need sizing advice, custom order inquiries, or instant checkout assistance? Connect directly with our team.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {/* WhatsApp Card */}
          <a
            href={getGeneralWhatsAppUrl("Hi VIA, I have an inquiry about my order.")}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white border border-emerald-500/40 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="p-3 bg-emerald-50 text-emerald-600 w-fit mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-1">
                WhatsApp Orders
              </h3>
              <p className="text-xs text-zinc-600">Instant VIP response</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 mt-4 group-hover:underline">
              +{WHATSAPP_NUMBER} →
            </span>
          </a>

          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/via.clothing.brand/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white border border-zinc-200 hover:border-black shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="p-3 bg-zinc-100 text-zinc-900 w-fit mb-4">
                <InstagramIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-1">
                Instagram Direct
              </h3>
              <p className="text-xs text-zinc-600">Official Drops & Custom Inquiries</p>
            </div>
            <span className="text-xs font-bold text-zinc-900 mt-4 group-hover:underline flex items-center gap-1">
              @via.clothing.brand →
            </span>
          </a>

          {/* Email Card */}
          <div className="p-6 bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-3 bg-zinc-100 text-zinc-900 w-fit mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-1">
                Email Support
              </h3>
              <p className="text-xs text-zinc-600">For business & collabs</p>
            </div>
            <span className="text-xs font-mono text-zinc-800 mt-4 font-semibold">
              orders@viaclothing.in
            </span>
          </div>

          {/* Hours Card */}
          <div className="p-6 bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-3 bg-zinc-100 text-zinc-900 w-fit mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-1">
                Operational Hours
              </h3>
              <p className="text-xs text-zinc-600">Mon – Sat, 10 AM – 8 PM IST</p>
            </div>
            <span className="text-xs text-zinc-500 mt-4 font-medium">
              Pan-India Dispatch
            </span>
          </div>
        </div>

        {/* Contact Form & FAQ Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Inquiry Form */}
          <div className="lg:col-span-6 bg-white border border-zinc-200 shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-2">
              Send An Inquiry
            </h2>
            <p className="text-xs text-zinc-600 mb-6 uppercase tracking-wider font-medium">
              Fill in your details below and our customer team will respond via Email or WhatsApp.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@email.com"
                    className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-700 mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-700 mb-1.5">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-xs text-zinc-900 focus:outline-none focus:border-black transition-colors"
                >
                  <option value="Order Inquiry">Order Inquiry</option>
                  <option value="Size Recommendation">Size Recommendation</option>
                  <option value="Exchange / Return">Exchange / Return</option>
                  <option value="Bulk & Custom Order">Bulk & Custom Order</option>
                  <option value="Brand Partnership">Brand Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry
              </button>
            </form>
          </div>

          {/* FAQ Accordion */}
          <div id="faq" className="lg:col-span-6">
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-600 mb-6 uppercase tracking-wider font-medium">
              Quick answers about our orders, shipping, and fabric specifications.
            </p>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-zinc-200 bg-white shadow-2xs overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
