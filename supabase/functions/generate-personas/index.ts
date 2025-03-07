
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
    const { product } = await req.json();
    
    if (!product) {
      throw new Error('Product name is required');
    }

    console.log(`Generating personas for product: ${product}`);

    const prompt = `Generate 5 target customer personas for ${product}. 
    For each persona, provide:
    1. A catchy 3-word title
    2. Gender (IMPORTANT: Choose either Men or Women, do NOT use "Both")
    3. Age range (min-max)
    4. Three main interests
    
    Format the response as a JSON array with objects having these fields: 
    title, gender, ageMin, ageMax, interests (as array of strings)`;

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
