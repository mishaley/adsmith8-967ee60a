
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      product, 
      count = 1,
      organization = {}, 
      offering = {}
    } = await req.json();
    
    if (!product) {
      throw new Error('Product name is required');
    }

    console.log(`Generating ${count} personas for product: ${product}`);
    
    // Extract organization and offering details with fallbacks
    const orgName = organization.name || "Your organization";
    const orgIndustry = organization.industry || "general";
    const offeringName = offering.name || product;
    const keySellingPoints = offering.keySellingPoints || "No information provided";
    const problemSolved = offering.problemSolved || "No information provided";
    const uniqueAdvantages = offering.uniqueAdvantages || "No information provided";

    // Build the enhanced prompt
    const prompt = `
ROLE: You are a world class marketing strategist.
TASK: Generate target personas for an offering.

ORGANIZATION
${orgName}

INDUSTRY
${orgIndustry}

OFFERING
${offeringName}

KEY SELLING POINTS
${keySellingPoints}

PROBLEM SOLVED
${problemSolved}

UNIQUE ADVANTAGES
${uniqueAdvantages}

Generate ${count} target customer personas who would be most likely to benefit from this offering.

For each persona, provide:
1. Gender (IMPORTANT: Choose either Men or Women, do NOT use "Both")
2. Age range (min-max)
3. Two main interests that align with the offering's value proposition

Format the response as a JSON array with objects having these fields:
gender, ageMin, ageMax, interests (as array of strings)
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a marketing expert who specializes in identifying target demographics.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI response received.');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid response format from OpenAI');
    }
    
    const generatedText = data.choices[0].message.content;
    
    // Parse the JSON content
    const personasData = JSON.parse(generatedText);
    console.log('Personas data parsed successfully. Sending response.');

    return new Response(JSON.stringify(personasData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-personas function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
