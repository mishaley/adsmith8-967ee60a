// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/deploy/docs/serve-function

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Edge function handler
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Parse request body
    const { code, accountType = "client", managerCustomerId } = await req.json();

    // Validate required parameters
    if (!code) {
      throw new Error("Missing required parameter: code");
    }

    // Get environment variables
    const clientId = Deno.env.get("GOOGLE_ADS_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_ADS_CLIENT_SECRET");
    const redirectUri = Deno.env.get("GOOGLE_ADS_REDIRECT_URI");
    const developerToken = Deno.env.get("GOOGLE_ADS_DEVELOPER_TOKEN");

    if (!clientId || !clientSecret || !redirectUri || !developerToken) {
      throw new Error("Missing required environment variables");
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Failed to exchange token: ${errorData.error_description || errorData.error}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Calculate token expiration
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    // Fetch Google Ads customer ID
    const customerResponse = await fetch(
      "https://googleads.googleapis.com/v16/customers:listAccessibleCustomers",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "developer-token": developerToken,
        },
      }
    );

    if (!customerResponse.ok) {
      const errorData = await customerResponse.json();
      throw new Error(`Failed to fetch customer ID: ${JSON.stringify(errorData)}`);
    }

    const customerData = await customerResponse.json();
    const customerIds = customerData.resourceNames || [];

    // Get the first customer ID or throw an error if none found
    if (customerIds.length === 0) {
      throw new Error("No Google Ads accounts found for this user");
    }

    // Extract the customer ID from the resource name (format: customers/1234567890)
    const customerId = customerIds[0].split("/")[1];

    // Fetch account details
    const customerInfoResponse = await fetch(
      `https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:searchStream`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "developer-token": developerToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            SELECT
              customer.id,
              customer.descriptive_name
            FROM customer
            LIMIT 1
          `,
        }),
      }
    );

    // Extract account name
    let accountName = "Google Ads Account";
    if (customerInfoResponse.ok) {
      const customerInfo = await customerInfoResponse.json();
      if (customerInfo.results && customerInfo.results.length > 0 && customerInfo.results[0].customer) {
        accountName = customerInfo.results[0].customer.descriptive_name || accountName;
      }
    }

    // Return the account details
    return new Response(
      JSON.stringify({
        account_type: accountType,
        name: accountName,
        customer_id: customerId,
        manager_customer_id: managerCustomerId || null,
        access_token,
        refresh_token,
        expires_at: expiresAt.toISOString(),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in Google Ads OAuth token exchange:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to complete OAuth flow",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}); 