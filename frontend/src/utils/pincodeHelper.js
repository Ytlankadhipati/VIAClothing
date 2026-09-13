/**
 * Indian Postal PIN Code Auto-Verification & City/State Lookup
 * Uses official Indian Postal API with Zippopotam fallback
 */
export const fetchCityStateFromPincode = async (pincode) => {
  const clean = String(pincode || "").replace(/\D/g, "");
  if (clean.length !== 6) return null;

  // 1. Try Primary Indian Postal Service API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (
        Array.isArray(data) &&
        data[0]?.Status === "Success" &&
        Array.isArray(data[0].PostOffice) &&
        data[0].PostOffice.length > 0
      ) {
        const po = data[0].PostOffice[0];
        const city = po.District || po.Block || po.Circle || "";
        const state = po.State || "";
        return {
          city,
          state,
          area: po.Name || "",
          success: true,
        };
      }
    }
  } catch (err) {
    // Timeout or network glitch, fall through to fallback
  }

  // 2. Fallback to Zippopotam API
  try {
    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 3000);

    const res2 = await fetch(`https://api.zippopotam.us/in/${clean}`, {
      signal: controller2.signal,
    });
    clearTimeout(timeout2);

    if (res2.ok) {
      const data2 = await res2.json();
      if (data2?.places?.length > 0) {
        const place = data2.places[0];
        return {
          city: place["place name"] || place.state || "",
          state: place.state || "",
          area: place["place name"] || "",
          success: true,
        };
      }
    }
  } catch (err) {
    // Both failed
  }

  return { success: false, message: "Invalid PIN code" };
};
