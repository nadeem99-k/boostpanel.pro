/**
 * PROVIDER HUB
 * This is where you connect your panel to a real wholesale provider.
 * Most SMM providers use the same API structure (Perfect Panel, etc.)
 */

const PROVIDER_API_URL = "https://provider-site.com/api/v2"; // Replace with your provider's API URL
const PROVIDER_API_KEY = "YOUR_API_KEY_HERE"; // Get this from your provider settings

export async function forwardOrderToProvider(orderData: {
  service: string;
  link: string;
  quantity: number;
}) {
  // If no API key is set, we stay in "Mock Mode"
  if (PROVIDER_API_KEY === "YOUR_API_KEY_HERE") {
    console.log("Mock Mode: Order stored locally, but not sent to provider.");
    return { success: true, provider_order_id: "mock_" + Math.random().toString(36).substr(2, 9) };
  }

  try {
    const params = new URLSearchParams();
    params.append('key', PROVIDER_API_KEY);
    params.append('action', 'add');
    params.append('service', orderData.service); // This must match the ID on the provider site
    params.append('link', orderData.link);
    params.append('quantity', orderData.quantity.toString());

    const response = await fetch(PROVIDER_API_URL, {
      method: "POST",
      body: params
    });

    const data = await response.json();
    
    if (data.order) {
      return { success: true, provider_order_id: data.order };
    } else {
      return { success: false, error: data.error || "Provider error" };
    }
  } catch (err) {
    return { success: false, error: "Connection to provider failed" };
  }
}

/**
 * Sync Services from Provider
 * Run this to automatically fetch the latest prices and services from your source.
 */
export async function getProviderServices() {
  if (PROVIDER_API_KEY === "YOUR_API_KEY_HERE") return [];

  try {
    const response = await fetch(`${PROVIDER_API_URL}?key=${PROVIDER_API_KEY}&action=services`);
    return await response.json();
  } catch (err) {
    return [];
  }
}
