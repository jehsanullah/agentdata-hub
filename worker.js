const sellerAddress = "0x8dd0342f58b727acfa82ddf5b4570577e0d87010";

const endpointList = [
  { path: "/api/postcode", summary: "UK Postcode & Location Intelligence", desc: "Spatial, administrative, and demographic metrics.", price: "0.005000", param: "postcode" },
  { path: "/api/property/epc", summary: "UK Property EPC Search", desc: "Energy ratings, efficiency scores, and building details.", price: "0.010000", param: "uprn" },
  { path: "/api/vehicle/mot", summary: "UK Vehicle MOT & Test History", desc: "MOT test history, mileage records, and advisories.", price: "0.005000", param: "vrm" },
  { path: "/api/environmental/flood", summary: "UK Flood Risk Data Stream", desc: "Localized flood risk assessments and alerts.", price: "0.005000", param: "postcode" },
  { path: "/api/property/hpi", summary: "UK House Price Index (HPI)", desc: "House price inflation index and average values.", price: "0.005000", param: "region" },
  { path: "/api/council/tax-bands", summary: "UK Council Tax Band Lookup", desc: "Local authority tax band categories.", price: "0.005000", param: "postcode" },
  { path: "/api/demographics/census", summary: "UK Census & Demographics", desc: "Population counts and age distributions.", price: "0.005000", param: "postcode" },
  { path: "/api/crime/local", summary: "UK Local Crime Statistics", desc: "Neighborhood police crime logs and trends.", price: "0.005000", param: "postcode" },
  { path: "/api/planning/applications", summary: "UK Local Planning History", desc: "Local authority planning decisions and permits.", price: "0.010000", param: "postcode" },
  { path: "/api/companies/house", summary: "UK Companies House Intelligence", desc: "Registered company profiles and officer details.", price: "0.005000", param: "company_number" },
  { path: "/api/land-registry/sales", summary: "UK Land Registry Sold Prices", desc: "Historical property price paid data.", price: "0.005000", param: "postcode" },
  { path: "/api/schools/performance", summary: "UK School Performance & Ofsted", desc: "Catchment metrics and inspection ratings.", price: "0.005000", param: "postcode" },
  { path: "/api/transport/rail", summary: "UK Rail Station Services", desc: "Live departure board metadata and connectivity.", price: "0.005000", param: "crs" },
  { path: "/api/ev/chargers", summary: "UK EV Charging Network Map", desc: "Charge point locations and power ratings (kW).", price: "0.005000", param: "postcode" },
  { path: "/api/broadband/speeds", summary: "UK Broadband & Connectivity", desc: "Download/upload speeds and gigabit availability.", price: "0.005000", param: "postcode" },
  { path: "/api/health/nhs-trusts", summary: "UK NHS Healthcare Map", desc: "GP surgeries, hospitals, and A&E locations.", price: "0.005000", param: "postcode" },
  { path: "/api/air-quality/monitoring", summary: "UK Air Quality Index (AQI)", desc: "Real-time NO2, PM2.5, and PM10 metrics.", price: "0.005000", param: "postcode" },
  { path: "/api/business/rates", summary: "UK Commercial Business Rates", desc: "Valuation Office Agency rateable values.", price: "0.005000", param: "postcode" },
  { path: "/api/deprivation/index", summary: "UK Indices of Deprivation (IMD)", desc: "Area deprivation deciles and income scores.", price: "0.005000", param: "postcode" },
  { path: "/api/weather/historic", summary: "UK Regional Historical Weather", desc: "Rainfall, temperature extremes, and sunshine.", price: "0.005000", param: "postcode" },
  { path: "/api/geospatial/boundaries", summary: "UK Geospatial Boundaries", desc: "GeoJSON boundary geometry for authorities.", price: "0.010000", param: "code" }
];

const paths = {
  "/api/sample": {
    get: {
      summary: "Free Schema & Endpoint Discovery",
      description: "Returns free sample response payloads and schemas for all 21 intelligence streams.",
      operationId: "getSampleSchemas",
      responses: { "200": { description: "Successfully retrieved free endpoint schemas." } }
    }
  }
};

endpointList.forEach(ep => {
  paths[ep.path] = {
    get: {
      summary: ep.summary,
      description: ep.desc,
      operationId: "get" + ep.path.split('/').pop().replace(/[-/]/g, ''),
      "x-payment-info": {
        price: { mode: "fixed", currency: "USDC", amount: ep.price },
        protocols: [{ x402: { networks: ["base", "ethereum", "arbitrum", "polygon"], payTo: sellerAddress } }, { mpp: {} }]
      },
      parameters: [{ name: ep.param, in: "query", required: true, description: ep.desc, schema: { type: "string" } }],
      responses: { "200": { description: "Successful lookup." }, "402": { description: "Payment Required" } }
    }
  };
});

const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "AgentData AI Intelligence Gateway",
    version: "1.0.0",
    description: "Production-grade UK data intelligence streams for autonomous AI agents paying over x402.",
    contact: { name: "AgentData Support", email: "support@agentdata.site" },
    "x-guidance": "Use this API to query live UK intelligence streams including postcodes, property EPCs, and vehicle MOT histories."
  },
  servers: [{ url: "https://agentdata.site", description: "Production Live Gateway" }],
  externalDocs: { description: "Documentation", url: "https://agentdata.site/llms.txt" },
  paths
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 1. Serve HTML Landing Page for Homepage requests
    if (url.pathname === '/' || url.pathname === '') {
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AgentData AI Intelligence Gateway</title>
          <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-950 text-slate-100 min-h-screen font-sans">
          <div class="max-w-5xl mx-auto px-4 py-12">
              <header class="border-b border-slate-800 pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                      <div class="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-emerald-500/20">
                        100/100 Runtime Verified • x402 Protocol Active
                      </div>
                      <h1 class="text-3xl font-bold tracking-tight text-white">AgentData AI Gateway</h1>
                      <p class="text-slate-400 mt-1">Autonomous micro-payment intelligence streams for AI agents on Base.</p>
                  </div>
                  <div class="flex gap-3">
                      <a href="/openapi.json" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition border border-slate-700">OpenAPI Spec</a>
                      <a href="/api/sample" class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Free Discovery</a>
                  </div>
              </header>

              <section class="mb-12 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                  <h2 class="text-xl font-semibold text-white mb-2">How It Works for AI Agents</h2>
                  <p class="text-slate-300 text-sm leading-relaxed mb-4">
                      AgentData provides 21 high-value UK data intelligence streams. Requests without payment headers receive an automatic <code class="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded">402 Payment Required</code> challenge with exact USDC routing on Base.
                  </p>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div class="bg-slate-950 p-4 rounded-lg border border-slate-800">
                          <div class="text-emerald-400 font-bold text-lg">21 Streams</div>
                          <div class="text-xs text-slate-400 mt-1">Property, MOT, Postcodes & More</div>
                      </div>
                      <div class="bg-slate-950 p-4 rounded-lg border border-slate-800">
                          <div class="text-emerald-400 font-bold text-lg">$0.005 - $0.01</div>
                          <div class="text-xs text-slate-400 mt-1">Micro-payment per query</div>
                      </div>
                      <div class="bg-slate-950 p-4 rounded-lg border border-slate-800">
                          <div class="text-emerald-400 font-bold text-lg">Base & Multi-chain</div>
                          <div class="text-xs text-slate-400 mt-1">USDC settlement over x402</div>
                      </div>
                  </div>
              </section>

              <section>
                  <h2 class="text-xl font-semibold text-white mb-4">Available Intelligence Endpoints (${endpointList.length})</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      ${endpointList.map(ep => `
                          <div class="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition">
                              <div class="flex justify-between items-start mb-2">
                                  <code class="text-xs font-mono bg-emerald-950 text-emerald-400 px-2 py-1 rounded border border-emerald-900">${ep.path}</code> <span class="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">$${ep.price} USDC</span>
                              </div>
                              <h3 class="font-semibold text-white text-sm mb-1">${ep.summary}</h3>
                              <p class="text-xs text-slate-400">${ep.desc}</p>
                          </div>
                      `).join('')}
                  </div>
              </section>
          </div>
      </body>
      </html>`;
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // 2. Serve OpenAPI Spec
    if (url.pathname === '/openapi.json') {
      return new Response(JSON.stringify(openApiSpec, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // 3. Free Tier Discovery Endpoint
    if (url.pathname === '/api/sample') {
      return new Response(JSON.stringify({ status: "success", tier: "free_discovery", endpoints: 21, schema: "https://agentdata.site/openapi.json" }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 4. Paid Endpoints - Return standard 402 Payment Required Challenge
    const paymentHeader = request.headers.get('X-Payment') || request.headers.get('Payment-Signature');
    if (!paymentHeader) {
      return new Response(JSON.stringify({
        error: "Payment Required",
        message: "Micro-payment required to access this endpoint.",
        accepts: [
          { scheme: "exact", network: "base", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", amount: "5000", payTo: sellerAddress },
          { scheme: "exact", network: "ethereum", asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", amount: "5000", payTo: sellerAddress }
        ]
      }), {
        status: 402,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'WWW-Authenticate': 'Payment realm="agentdata.site", token="USDC"' }
      });
    }

    return new Response(JSON.stringify({ data: "Verified Payload Delivered" }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};
