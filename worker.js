const openApiSpec = {
  "openapi": "3.1.0",
  "info": {
    "title": "AgentData AI Intelligence Gateway",
    "version": "1.0.0",
    "description": "Production-grade UK data intelligence streams for autonomous AI agents paying over x402.",
    "contact": {
      "name": "AgentData Support",
      "email": "support@agentdata.site"
    },
    "x-guidance": "Use this API to query live UK intelligence streams including postcodes, property EPCs, vehicle MOT histories, and market metrics. Agents can evaluate free response structures at /api/sample before making paid requests. Paid endpoints enforce x402 micro-payments in USDC on Base (Chain ID 8453). Return 402 challenges when payment headers are omitted."
  },
  "servers": [
    {
      "url": "https://agentdata.site",
      "description": "Production Live Gateway"
    }
  ],
  "externalDocs": {
    "description": "Full AgentData Integration & Endpoint Documentation",
    "url": "https://agentdata.site/llms.txt"
  },
  "paths": {
    "/api/sample": {
      "get": {
        "summary": "Free Schema & Endpoint Discovery",
        "description": "Returns free sample response payloads and schemas for all 21 intelligence streams without requiring x402 payment.",
        "operationId": "getSampleSchemas",
        "responses": {
          "200": {
            "description": "Successfully retrieved free endpoint schemas."
          }
        }
      }
    },
    "/api/postcode": {
      "get": {
        "summary": "UK Postcode & Location Intelligence",
        "description": "Retrieves spatial, administrative, and demographic metrics for a specified UK postcode.",
        "operationId": "getPostcodeData",
        "x-payment-info": {
          "price": {
            "mode": "fixed",
            "currency": "USDC",
            "amount": "0.005000"
          },
          "protocols": [
            {
              "x402": {
                "networks": ["base", "ethereum", "arbitrum", "polygon"],
                "payTo": "0x8dd0342f58b727acfa82ddf5b4570577e0d87010"
              }
            },
            {
              "mpp": {}
            }
          ]
        },
        "parameters": [
          {
            "name": "postcode",
            "in": "query",
            "required": true,
            "description": "Valid UK postcode (e.g., SW1A 1AA)",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful postcode intelligence lookup."
          },
          "402": {
            "description": "Payment Required - x402 USDC micro-payment challenge."
          }
        }
      }
    },
    "/api/property/epc": {
      "get": {
        "summary": "UK Property Energy Performance Certificate (EPC) Search",
        "description": "Returns property energy ratings, efficiency scores, and building details.",
        "operationId": "getPropertyEpc",
        "x-payment-info": {
          "price": {
            "mode": "fixed",
            "currency": "USDC",
            "amount": "0.010000"
          },
          "protocols": [
            {
              "x402": {
                "networks": ["base", "ethereum", "arbitrum", "polygon"],
                "payTo": "0x8dd0342f58b727acfa82ddf5b4570577e0d87010"
              }
            },
            {
              "mpp": {}
            }
          ]
        },
        "parameters": [
          {
            "name": "uprn",
            "in": "query",
            "required": false,
            "description": "Unique Property Reference Number",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful EPC record lookup."
          },
          "402": {
            "description": "Payment Required - x402 USDC micro-payment challenge."
          }
        }
      }
    }
  }
};

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
        headers: { 
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*' 
        }
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
    return new Response(JSON.stringify({ data: "Verified Payload Delivered" }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};
