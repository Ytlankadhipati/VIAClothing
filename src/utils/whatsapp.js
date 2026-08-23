/**
 * Configurable WhatsApp Configuration & Link Generators for VIA
 */

export const WHATSAPP_NUMBER = "917007470175";

/**
 * Generates direct WhatsApp order URL for a specific product and size
 * @param {Object} product - Product details object
 * @param {string} size - Selected size
 * @param {number} quantity - Selected quantity
 * @returns {string} - WhatsApp click-to-chat URL
 */
export function getProductOrderWhatsAppUrl(product, size, quantity = 1) {
  const message = `Hi VIA, I want to order:

Product: ${product.name}
Price: ₹${product.price.toLocaleString("en-IN")}
Size: ${size}
Quantity: ${quantity}

Please share the ordering details.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Generates floating / general inquiry WhatsApp link
 * @param {string} customMessage - Optional custom query
 * @returns {string} - WhatsApp click-to-chat URL
 */
export function getGeneralWhatsAppUrl(customMessage = "Hi VIA, I have a question about your products.") {
  const encodedMessage = encodeURIComponent(customMessage);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Generates formatted WhatsApp link for direct bag/cart checkout
 * @param {Array} items - List of items in bag
 * @returns {string} - WhatsApp click-to-chat URL
 */
export function getCartOrderWhatsAppUrl(items = []) {
  if (!items.length) {
    return getGeneralWhatsAppUrl();
  }

  const itemsList = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} (Size: ${item.size}, Qty: ${item.quantity}) - ₹${(
          item.price * item.quantity
        ).toLocaleString("en-IN")}`
    )
    .join("\n");

  const total = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const message = `Hi VIA, I want to place an order for the following items:

${itemsList}

Total Amount: ₹${total.toLocaleString("en-IN")}

Please confirm availability and payment details.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
