
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function getAccessToken() {
  try {
    const credentials = JSON.parse(Deno.env.get('GOOGLE_APPLICATION_CREDENTIALS_JSON') || '');
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await createJWT(credentials),
      }),
    });

    const { access_token } = await tokenResponse.json();
    return access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get Google Cloud access token');
  }
}

async function createJWT(credentials: any) {
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const header = { alg: 'RS256', typ: 'JWT' };
  const encoder = new TextEncoder();
  
  const headerB64 = btoa(JSON.stringify(header));
  const claimsB64 = btoa(JSON.stringify(claims));
  const message = `${headerB64}.${claimsB64}`;
  
  // Convert private key from PEM to CryptoKey
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    parsePrivateKey(credentials.private_key),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    privateKey,
    encoder.encode(message)
  );
  
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${message}.${signatureB64}`;
}

function parsePrivateKey(pem: string) {
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = pem
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, '');
  return Uint8Array.from(atob(pemContents), c => c.charCodeAt(0)).buffer;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log("1. Received prompt:", prompt);

    const accessToken = await getAccessToken();
    console.log("2. Got access token");

    const project = 'projects/YOUR_PROJECT_ID'; // Replace with your Google Cloud project ID
    const location = 'us-central1';
    const model = 'imagegeneration@002';

    const generateUrl = `https://${location}-aiplatform.googleapis.com/v1/${project}/locations/${location}/publishers/google/models/${model}:predict`;

    console.log("3. Making request to Vertex AI...");
    const response = await fetch(generateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{
          prompt: prompt || "A cute doggy",
        }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
        },
      }),
    });

    console.log("4. Response status:", response.status);
    const responseData = await response.json();
    console.log("5. Response data:", responseData);

    if (!response.ok) {
      throw new Error(`Vertex AI error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    // The response contains base64-encoded image data
    const image_url = `data:image/png;base64,${responseData.predictions[0].bytesBase64Encoded}`;

    return new Response(JSON.stringify({ 
      image_url,
      status: response.status,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
