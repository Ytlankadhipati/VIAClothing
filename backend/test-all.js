import axios from "axios";

const API_BASE = "http://localhost:5001/api";

const testSuite = async () => {
  console.log("==================================================");
  console.log("🚀 STARTING VIA COMPREHENSIVE TEST SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  const assert = (name, condition, errorMsg = "") => {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} - ${errorMsg}`);
      failed++;
    }
  };

  try {
    // 1. Test Categories Endpoint
    console.log("\n--- Testing Categories ---");
    const catRes = await axios.get(`${API_BASE}/categories`);
    assert("Categories endpoint returns 200", catRes.status === 200);
    const catNames = catRes.data.data.categories.map((c) => c.name);
    assert("Contains 'Bottles' category", catNames.includes("Bottles"));
    assert("Contains 'Mugs' category", catNames.includes("Mugs"));
    assert("Contains 'Caps & Headwear' category", catNames.includes("Caps & Headwear"));
    assert("Contains 'Custom Print' category", catNames.includes("Custom Print"));
    assert("Contains 'T-Shirts' category", catNames.includes("T-Shirts"));

    // 2. Test Collections Endpoint
    console.log("\n--- Testing Collections ---");
    const colRes = await axios.get(`${API_BASE}/collections`);
    assert("Collections endpoint returns 200", colRes.status === 200);
    assert("Returns at least 4 collections", colRes.data.data.collections.length >= 4);

    // 3. Test Products Endpoint & Filtering
    console.log("\n--- Testing Products Catalog ---");
    const allProdRes = await axios.get(`${API_BASE}/products`);
    assert("Products list returns 200", allProdRes.status === 200);
    assert("Products count >= 12", allProdRes.data.data.products.length >= 12);

    // Filter by Bottles
    const bottleRes = await axios.get(`${API_BASE}/products?category=Bottles`);
    assert("Filter by category=Bottles works", bottleRes.data.data.products.length > 0);

    // Filter by Mugs
    const mugRes = await axios.get(`${API_BASE}/products?category=Mugs`);
    assert("Filter by category=Mugs works", mugRes.data.data.products.length > 0);

    // Filter by Caps
    const capRes = await axios.get(`${API_BASE}/products?category=Caps+%26+Headwear`);
    assert("Filter by category=Caps & Headwear works", capRes.data.data.products.length > 0);

    // Filter by Custom Print
    const custRes = await axios.get(`${API_BASE}/products?category=Custom+Print`);
    assert("Filter by category=Custom Print works", custRes.data.data.products.length > 0);

    // 4. Test Single Product by ID or Slug
    console.log("\n--- Testing Single Product Lookups ---");
    const sampleSlug = "via-thermal-vacuum-flask-bottle";
    const singleRes = await axios.get(`${API_BASE}/products/${sampleSlug}`);
    assert(`Fetch product by slug '${sampleSlug}'`, singleRes.status === 200 && singleRes.data.data.product.name.includes("Thermal Vacuum"));

    // 5. Test Customer Authentication
    console.log("\n--- Testing Customer Auth ---");
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: "customer@viaclothing.in",
      password: "Customer@VIA2026",
    });
    const authToken = loginRes.data.token || loginRes.data.data?.token;
    assert("Customer login returns 200 and token", loginRes.status === 200 && Boolean(authToken));
    const authHeaders = { headers: { Authorization: `Bearer ${authToken}` } };

    // 6. Test Cart CRUD & Custom Print Details
    console.log("\n--- Testing Cart CRUD with Custom Print Specs ---");
    // Clear initial cart
    await axios.delete(`${API_BASE}/cart`, authHeaders);

    // Add a custom printed bottle to cart
    const addCartRes = await axios.post(
      `${API_BASE}/cart/items`,
      {
        productId: "via-custom-print-hydro-bottle",
        size: "750ml",
        color: "Matte Black",
        quantity: 2,
        customDetails: {
          isCustom: true,
          itemType: "Bottle",
          placement: "360° Cylindrical Wrap",
          printTechnique: "Precision Laser Engraving",
          customText: "VIA PROTOCOL 2026",
          font: "TECH MONOSPACE",
          textColor: "#FFFFFF",
        },
      },
      authHeaders
    );
    assert("Add custom product to cart returns 200", addCartRes.status === 200);
    assert("Cart contains 1 item", addCartRes.data.data.cart.items.length === 1);
    assert("Cart item preserves customDetails", addCartRes.data.data.cart.items[0].customDetails?.customText === "VIA PROTOCOL 2026");

    // Add a standard mug to cart
    const addMugRes = await axios.post(
      `${API_BASE}/cart/items`,
      {
        productId: "via-cyberpunk-matte-ceramic-mug",
        size: "350ml",
        color: "Obsidian Matte",
        quantity: 1,
      },
      authHeaders
    );
    assert("Add standard product to cart works", addMugRes.status === 200 && addMugRes.data.data.cart.items.length === 2);

    // Update quantity
    const itemId = addMugRes.data.data.cart.items[1]._id;
    const updateQtyRes = await axios.put(`${API_BASE}/cart/items/${itemId}`, { quantity: 3 }, authHeaders);
    assert("Update cart item quantity works", updateQtyRes.status === 200);

    // 7. Test Coupon Validation
    console.log("\n--- Testing Coupon Engine ---");
    const couponRes = await axios.post(`${API_BASE}/coupons/validate`, { code: "VIA10", orderAmount: 2500 }, authHeaders);
    assert("Validate coupon 'VIA10' returns valid discount", couponRes.status === 200 && couponRes.data.data.coupon.discountAmount > 0);

    // 8. Test Razorpay Order Creation
    console.log("\n--- Testing Razorpay / Checkout Order Initialization ---");
    const cartForOrder = addMugRes.data.data.cart;
    const cartItems = cartForOrder.items;

    // Build items payload compatible with the server's expected shape
    const itemsPayload = cartItems.map((i) => ({
      product: i.product,
      productId: i.product,
      name: i.name,
      image: i.image,
      size: i.size,
      color: i.color,
      price: i.price,
      quantity: i.quantity,
      customDetails: i.customDetails || null,
    }));

    const shippingAddress = {
      fullName: "Aryan Sharma",
      phone: "919876543210",
      addressLine1: "Tower 4, Apt 1102",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122002",
      country: "India",
    };

    const createOrderRes = await axios.post(
      `${API_BASE}/payments/create-order`,
      { items: itemsPayload, shippingAddress, couponCode: "VIA10" },
      authHeaders
    );
    const rzpOrderId = createOrderRes.data.data?.razorpayOrderId;
    assert("Create payment order returns 200 with razorpayOrderId", createOrderRes.status === 200 && Boolean(rzpOrderId));

    // 9. Test COD Order Placement
    console.log("\n--- Testing Order Placement & Fulfillment Flow ---");
    const placeOrderRes = await axios.post(
      `${API_BASE}/payments/verify`,
      {
        paymentMethod: "cod",
        razorpayOrderId: rzpOrderId,
        items: itemsPayload,
        shippingAddress,
        couponCode: "VIA10",
      },
      authHeaders
    );
    assert("Place order returns 201 with orderNumber", placeOrderRes.status === 201 && Boolean(placeOrderRes.data.data.order.orderNumber));
    assert("Order preserves customDetails in items", placeOrderRes.data.data.order.items[0].customDetails?.customText === "VIA PROTOCOL 2026");

    // 10. Test My Orders
    console.log("\n--- Testing Customer Order History ---");
    const myOrdersRes = await axios.get(`${API_BASE}/orders`, authHeaders);
    assert("Fetch my orders returns list", myOrdersRes.status === 200 && myOrdersRes.data.data.orders.length >= 1);

    console.log("\n==================================================");
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("❌ UNEXPECTED ERROR IN TEST RUNNER:", err.response?.data || err.message);
    process.exit(1);
  }
};

testSuite();
