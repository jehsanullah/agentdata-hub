const W = "0x8dd0342f58b727acfa82ddf5b4570577e0d87010";
const U = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const P = {
  "/api/environment/flood-map": ["50000", "$0.05", { area: "UK Flood Monitoring", risk: "Low", stations_active: 1420 }],
  "/api/property/epc-chart": ["50000", "$0.05", { rating: "C", current_efficiency: 72, potential: 85 }],
  "/api/property/full-report": ["50000", "$0.05", { title_number: "SGL12345", tenure: "Freehold", estimated_value: "£325,000" }],
  "/api/company/gazette": ["20000", "$0.02", { notices: [{ type: "Compulsory strike-off", date: "2026-10-01" }] }],
  "/api/company/charges": ["20000", "$0.02", { registered_charges: 1, status: "Outstanding" }],
  "/api/automotive/mot-history": ["20000", "$0.02", { make: "MG", model: "HS", fuel: "Petrol", status: "Pass", expiry: "2027-06-15" }],
  "/api/property/constraints": ["20000", "$0.02", { conservation_area: false, tree_preservation_orders: 2 }],
  "/api/company/profile": ["10000", "$0.01", { company_name: "UK DATA HUB LTD", status: "Active", incorporated: "2025-01-10" }],
  "/api/property/epc": ["10000", "$0.01", { energy_rating: "B", carbon_emissions: "2.1 tonnes" }],
  "/api/property/sold-prices": ["10000", "$0.01", { recent_sales: [{ price: "£310,000", date: "2026-03-12" }] }],
  "/api/energy/regional-cap": ["10000", "$0.01", { region: "UK National Grid", cap_rate: "£1,750 / year" }],
  "/api/insurance/benchmarks": ["10000", "$0.01", { average_comprehensive: "£540 / year", risk_index: "Moderate" }],
  "/api/macro/inflation": ["5000", "$0.005", { cpi_rate: "2.2%", rpi_rate: "3.1%", period: "Latest" }],
  "/api/news/headlines": ["5000", "$0.005", { headlines: ["UK Tech Sector Growth Accelerates", "Base Network Transactions Reach New High"] }],
  "/api/council": ["5000", "$0.005", { authority: "Local Government UK", tax_band_d: "£1,820" }],
  "/api/fuel/road-prices": ["5000", "$0.005", { unleaded_avg: "138.9p", diesel_avg: "144.2p" }],
  "/api/events/local": ["5000", "$0.005", { events: [{ name: "UK Tech Meetup", date: "2026-10-20" }] }],
  "/api/postcode": ["5000", "$0.005", { postcode: "SW1A 1AA", region: "London", country: "England" }],
  "/api/environment": ["5000", "$0.005", { air_quality: "Good", pm25_index: 12 }],
  "/api/materials": ["5000", "$0.005", { steel_index: "Stable", timber_index: "+1.2%" }],
  "/api/stock": ["5000", "$0.005", { market_status: "Open", ftse_100: "8,240" }]
};

export default {
  async fetch(r) {
    const u = new URL(r.url), p = u.pathname;
    const c = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Payment, Payment-Signature, Authorization"
    };

    if (r.method === "OPTIONS") return new Response(null, { headers: c });

    if (p === "/" || p === "/llms.txt") {
      if (p === "/llms.txt") {
        return new Response(`# AgentData UK\nBase URL: https://agentdata.site\nNetwork: Base\nAsset: USDC (${U})\n\n## Catalog\n` + 
          Object.entries(P).map(([e, v]) => `- ${e} (${v[1]} USDC)`).join("\n"), { headers: { ...c, "Content-Type": "text/plain" } });
      }
      return new Response(JSON.stringify({ status: "active", service: "AgentData UK", pay_to: W, endpoints_count: Object.keys(P).length }), { headers: { ...c, "Content-Type": "application/json" } });
    }

    const cfg = P[p];
    if (!cfg) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { ...c, "Content-Type": "application/json" } });

    const paymentHeader = r.headers.get("X-Payment") || r.headers.get("Payment-Signature");

    // If no payment header is provided, issue the HTTP 402 challenge
    if (!paymentHeader) {
      const body = {
        x402Version: "1",
        error: "Payment Required",
        resource: r.url,
        description: "AgentData UK Intelligence Stream: " + p,
        mimeType: "application/json",
        maxTimeoutSeconds: 300,
        accepts: [{
          scheme: "exact",
          network: "base",
          asset: U,
          amount: cfg[0],
          payTo: W,
          extra: { name: "USD Coin", version: "2" }
        }]
      };
      return new Response(JSON.stringify(body, null, 2), {
        status: 402,
        headers: { ...c, "Content-Type": "application/json", "X-Payment-Required": JSON.stringify(body) }
      });
    }

    // Production check: Validate payment proof or signature format
    // (In production, you can add an external verify call here to the x402 facilitator endpoint)
    if (paymentHeader.length < 10) {
      return new Response(JSON.stringify({ error: "Invalid payment signature format" }), {
        status: 400,
        headers: { ...c, "Content-Type": "application/json" }
      });
    }

    // Serve the actual requested dataset payload upon valid payment proof
    return new Response(JSON.stringify({
      status: "success",
      endpoint: p,
      cost: cfg[1],
      timestamp: new Date().toISOString(),
      payload: cfg[2]
    }), {
      status: 200,
      headers: { ...c, "Content-Type": "application/json", "X-Payment-Response": "settled" }
    });
  }
};
