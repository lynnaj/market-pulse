import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { marketData, topMovers, news } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert financial analyst AI. Based on current market data, news sentiment, and market trends, provide exactly 3 stock recommendations for high growth potential over the next year. 

Your recommendations should:
1. Be based on the provided market data and news
2. Include a mix of established growth stocks and emerging opportunities
3. Provide specific reasoning tied to current market conditions
4. Be realistic and well-reasoned

Always respond using the suggest_stocks function with exactly 3 recommendations.`;

    const userPrompt = `Current Market Context:
- Market Indices: ${JSON.stringify(marketData)}
- Top Movers: ${JSON.stringify(topMovers)}
- Recent News: ${JSON.stringify(news)}

Based on this real-time market data, recommend 3 stocks for high growth potential over the next year.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_stocks",
              description: "Return exactly 3 stock recommendations with analysis",
              parameters: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        rank: { type: "number", description: "Ranking 1-3" },
                        ticker: { type: "string", description: "Stock ticker symbol" },
                        name: { type: "string", description: "Company full name" },
                        currentPrice: { type: "string", description: "Estimated current price with $ prefix" },
                        targetPrice: { type: "string", description: "12-month target price with $ prefix" },
                        upside: { type: "number", description: "Percentage upside potential" },
                        reasoning: { type: "string", description: "2-3 sentence analysis explaining the recommendation based on current market conditions" },
                        tags: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "3 short tags describing key investment themes"
                        },
                      },
                      required: ["rank", "ticker", "name", "currentPrice", "targetPrice", "upside", "reasoning", "tags"],
                      additionalProperties: false,
                    },
                  },
                  marketSummary: { 
                    type: "string", 
                    description: "Brief 1-2 sentence summary of current market conditions"
                  },
                },
                required: ["recommendations", "marketSummary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_stocks" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    
    // Extract the function call result
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const recommendations = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ success: true, data: recommendations }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Failed to parse AI response");
  } catch (error) {
    console.error("AI recommendations error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
