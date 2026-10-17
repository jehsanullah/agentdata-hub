const sellerAddress = "0x8dd0342f58b727acfa82ddf5b4570577e0d87010";

const endpointList = [
  { path: "/api/postcode", summary: "UK Postcode & Location Intelligence", desc: "Retrieves spatial, administrative, and demographic metrics for a specified UK postcode.", price: "0.005000", param: "postcode", descP: "Valid UK postcode (e.g., SW1A 1AA)" },
  { path: "/api/property/epc", summary: "UK Property Energy Performance Certificate (EPC) Search", desc: "Returns property energy ratings, efficiency scores, and building details.", price: "0.010000", param: "uprn", descP: "Unique Property Reference Number" },
  { path: "/api/vehicle/mot", summary: "UK Vehicle MOT & Test History", desc: "Retrieves MOT test history, mileage records, advisories, and defects.", price: "0.005000", param: "vrm", descP: "Vehicle Registration Mark (e.g., AB12CDE)" },
  { path: "/api/environmental/flood", summary: "UK Flood Risk Data Stream", desc: "Provides localized flood risk assessments and historical flood alerts.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/property/hpi", summary: "UK House Price Index (HPI) Trends", desc: "Returns regional house price inflation index and average property values.", price: "0.005000", param: "region", descP: "UK Local Authority or Region Code" },
  { path: "/api/council/tax-bands", summary: "UK Council Tax Band Lookup", desc: "Returns current local authority council tax band categories.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/demographics/census", summary: "UK Census & Demographic Intelligence", desc: "Retrieves population counts, age distributions, and socio-economic classifications.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/crime/local", summary: "UK Local Crime Statistics", desc: "Provides neighborhood police crime logs and category breakdowns.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/planning/applications", summary: "UK Local Planning Application History", desc: "Fetches local authority planning decisions and development permits.", price: "0.010000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/companies/house", summary: "UK Companies House Intelligence", desc: "Retrieves registered company profiles, officer details, and SIC classifications.", price: "0.005000", param: "company_number", descP: "8-digit UK Company Registration Number" },
  { path: "/api/land-registry/sales", summary: "UK Land Registry Sold Price History", desc: "Provides historical property price paid data including completion dates.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/schools/performance", summary: "UK School Performance & Ofsted Ratings", desc: "Retrieves school catchment metrics, inspection ratings, and exam performance.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/transport/rail", summary: "UK Rail Station Accessibility & Services", desc: "Provides train station live departure board metadata and line connectivity.", price: "0.005000", param: "crs", descP: "3-letter Station CRS Code (e.g., LBG)" },
  { path: "/api/ev/chargers", summary: "UK Electric Vehicle Charging Network Stream", desc: "Maps EV charge point locations, power ratings (kW), and connection types.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/broadband/speeds", summary: "UK Broadband & Connectivity Coverage", desc: "Returns average download/upload speeds and gigabit availability.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/health/nhs-trusts", summary: "UK NHS Trust & Healthcare Facility Map", desc: "Provides local GP surgeries, hospitals, A&E locations, and performance metrics.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/air-quality/monitoring", summary: "UK Air Quality Index (AQI) Stream", desc: "Returns real-time and historical NO2, PM2.5, and PM10 pollution level metrics.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/business/rates", summary: "UK Commercial Property Business Rates", desc: "Retrieves Valuation Office Agency rateable values.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/deprivation/index", summary: "UK Indices of Multiple Deprivation (IMD)", desc: "Provides local authority area deprivation deciles and income scores.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/weather/historic", summary: "UK Regional Historical Weather", desc: "Retrieves historical rainfall, temperature extremes, and sunshine hours.", price: "0.005000", param: "postcode", descP: "UK Postcode" },
  { path: "/api/geospatial/boundaries", summary: "UK Geospatial Boundary Coordinates", desc: "Provides GeoJSON boundary geometry for wards and authorities.", price: "0.010000", param: "code", descP: "GSS Area Code (e.g., E09000001)" }
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
      parameters: [{ name: ep.param, in: "query", required: true, description: ep.descP, schema: { type: "string" } }],
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
    "x-guidance": "Use this API to query live UK intelligence streams including postcodes, property EPCs, and vehicle MOT histories. Agents can evaluate free response structures at /api/sample before making paid requests."
  },
  servers: [{ url: "https://agentdata.site", description: "Production Live Gateway" }],
  externalDocs: { description: "Documentation", url: "https://agentdata.site/llms.txt" },
  paths
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/openapi.json') {
      return new Response(JSON.stringify(openApiSpec, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    if (url.pathname === '/api/sample') {
      return new Response(JSON.stringify({ status: "success", tier: "free_discovery", endpoints: 21, schema: "https://agentdata.site/openapi.json" }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

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
