import openApiSpec from './openapi.json';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Serve OpenAPI Spec for Circle Agent Marketplace Discovery
    if (url.pathname === '/openapi.json') {
      return new Response(JSON.stringify(openApiSpec, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // 2. Free Tier Discovery Endpoint
    if (url.pathname === '/api/sample') {
      return new Response(JSON.stringify({
        status: "success",
        tier: "free_discovery",
        endpoints: 21,
        schema: "https://agentdata.site/openapi.json"
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 3. Paid Endpoints - Return standard 402 Payment Required Challenge
    const paymentHeader = request.headers.get('X-Payment') || request.headers.get('Payment-Signature');

    if (!paymentHeader) {
      return new Response(JSON.stringify({
        error: "Payment Required",
        message: "Micro-payment required to access this endpoint.",
        accepts: [
          {
            scheme: "exact",
            network: "base",
            asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
            amount: "5000", // $0.005 USDC
            payTo: "0x8dd0342f58b727acfa82ddf5b4570577e0d87010"
          },
          {
            scheme: "exact",
            network: "ethereum",
            asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC on Ethereum
            amount: "5000",
            payTo: "0x8dd0342f58b727acfa82ddf5b4570577e0d87010"
          }
        ]
      }), {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'WWW-Authenticate': 'Payment realm="agentdata.site", token="USDC"'
        }
      });
    }

    // 4. Verify & Process Paid Request
    // Send to x402.org/facilitator/verify ...
    return new Response(JSON.stringify({ data: "Verified Payload Delivered" }));
  }
};
