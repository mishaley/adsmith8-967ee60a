
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PersonaInfo {
  name: string;
  age: string | number;
  gender: string;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messageType, persona } = await req.json();
    
    if (!openAIApiKey) {
      console.error('Missing OpenAI API key');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!messageType) {
      return new Response(
        JSON.stringify({ error: 'Message type is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const personaInfo: PersonaInfo = persona || {
      name: 'Generic Customer',
      age: 'unknown',
      gender: 'unknown',
      description: 'A potential customer'
    };

    // Construct prompt based on message type
    let prompt = '';
    switch (messageType) {
      case 'pain-point':
        prompt = `Generate a 3-4 word marketing tagline that addresses a pain point for ${personaInfo.name}, a ${personaInfo.age} year old ${personaInfo.gender}. ${personaInfo.description || ''}. The tagline should be catchy, memorable, and suitable for an advertisement. Focus on a problem they might have that our product could solve.`;
        break;
      case 'unique-offering':
        prompt = `Generate a 3-4 word marketing tagline that highlights a unique offering for ${personaInfo.name}, a ${personaInfo.age} year old ${personaInfo.gender}. ${personaInfo.description || ''}. The tagline should be catchy, memorable, and suitable for an advertisement. Focus on what makes our product or service special.`;
        break;
      case 'value-prop':
        prompt = `Generate a 3-4 word marketing tagline that emphasizes the value proposition for ${personaInfo.name}, a ${personaInfo.age} year old ${personaInfo.gender}. ${personaInfo.description || ''}. The tagline should be catchy, memorable, and suitable for an advertisement. Focus on the benefit they'll get from our product.`;
        break;
      case 'user-provided':
        prompt = `Generate a 3-4 word marketing tagline for an advertisement targeted at ${personaInfo.name}, a ${personaInfo.age} year old ${personaInfo.gender}. ${personaInfo.description || ''}. The tagline should be catchy, memorable, and suitable for an advertisement.`;
        break;
      default:
        prompt = `Generate a 3-4 word marketing tagline related to ${messageType} for ${personaInfo.name}, a ${personaInfo.age} year old ${personaInfo.gender}. ${personaInfo.description || ''}. The tagline should be catchy, memorable, and suitable for an advertisement.`;
    }

    console.log('Generating tagline for:', { messageType, persona: personaInfo });
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a marketing expert who specializes in creating short, catchy taglines for advertising campaigns. Your taglines should be 3-4 words, memorable, and impactful. Do not include any explanation, just return the tagline.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 30,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);
    
    const generatedTagline = data.choices[0].message.content.trim().replace(/^"|"$/g, '');
    
    // Format tagline: strip quotes if present and trim whitespace
    const cleanTagline = generatedTagline.replace(/^["'](.*)["']$/, '$1').trim();
    
    return new Response(
      JSON.stringify({ tagline: cleanTagline }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-marketing-taglines function:', error);
    return new Response(
      JSON.stringify({ error: error.message, tagline: "Smart. Simple. Effective." }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
