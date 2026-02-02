import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Fallback data when API is rate-limited
const fallbackIndices = [
  { name: "S&P 500", symbol: "SPY", value: "584.32", change: 4.28, changePercent: 0.74 },
  { name: "NASDAQ", symbol: "QQQ", value: "492.15", change: -1.23, changePercent: -0.25 },
  { name: "DOW JONES", symbol: "DIA", value: "432.75", change: 2.56, changePercent: 0.59 },
  { name: "RUSSELL 2000", symbol: "IWM", value: "228.45", change: 1.84, changePercent: 0.81 },
];

const fallbackNews = [
  { id: 1, title: "Fed signals cautious approach on rate cuts as inflation remains sticky", source: "Bloomberg", time: "2h ago", category: "neutral" as const },
  { id: 2, title: "Tech stocks rally on strong earnings from semiconductor sector", source: "Reuters", time: "3h ago", category: "bullish" as const },
  { id: 3, title: "AI chip demand continues to surge, boosting NVIDIA outlook", source: "CNBC", time: "4h ago", category: "bullish" as const },
  { id: 4, title: "Treasury yields edge higher amid economic uncertainty", source: "WSJ", time: "5h ago", category: "bearish" as const },
  { id: 5, title: "Global markets mixed as investors await key economic data", source: "Financial Times", time: "6h ago", category: "neutral" as const },
];

const fallbackTopMovers = {
  gainers: [
    { ticker: "SMCI", change_percentage: "12.45" },
    { ticker: "MSTR", change_percentage: "8.32" },
    { ticker: "ARM", change_percentage: "6.78" },
    { ticker: "PLTR", change_percentage: "5.91" },
    { ticker: "AMD", change_percentage: "4.23" },
  ],
  losers: [
    { ticker: "NFLX", change_percentage: "-3.45" },
    { ticker: "TSLA", change_percentage: "-2.18" },
    { ticker: "META", change_percentage: "-1.95" },
    { ticker: "GOOGL", change_percentage: "-1.67" },
    { ticker: "AAPL", change_percentage: "-1.23" },
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, symbol } = await req.json();
    const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");
    
    if (!ALPHA_VANTAGE_API_KEY) {
      console.log("No API key, using fallback data");
      return getFallbackResponse(type);
    }

    let data;

    if (type === "quote") {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();
      
      if (result.Note || result.Information) {
        console.log("Rate limited, using fallback");
        return getFallbackResponse(type);
      }
      
      if (result["Global Quote"]) {
        const quote = result["Global Quote"];
        data = {
          symbol: quote["01. symbol"],
          price: parseFloat(quote["05. price"]),
          change: parseFloat(quote["09. change"]),
          changePercent: parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
          high: parseFloat(quote["03. high"]),
          low: parseFloat(quote["04. low"]),
          volume: parseInt(quote["06. volume"]),
          previousClose: parseFloat(quote["08. previous close"]),
        };
      }
    } else if (type === "indices") {
      const indices = [
        { symbol: "SPY", name: "S&P 500" },
        { symbol: "QQQ", name: "NASDAQ" },
        { symbol: "DIA", name: "DOW JONES" },
        { symbol: "IWM", name: "RUSSELL 2000" },
      ];

      const results = [];
      for (const index of indices) {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${index.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
          );
          const result = await response.json();
          
          if (result.Note || result.Information) {
            console.log("Rate limited, using fallback indices");
            return getFallbackResponse(type);
          }
          
          if (result["Global Quote"] && result["Global Quote"]["05. price"]) {
            const quote = result["Global Quote"];
            results.push({
              name: index.name,
              symbol: index.symbol,
              value: parseFloat(quote["05. price"]).toFixed(2),
              change: parseFloat(quote["09. change"]),
              changePercent: parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
            });
          }
        } catch (e) {
          console.error(`Error fetching ${index.symbol}:`, e);
        }
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      data = results.length > 0 ? results : fallbackIndices;
    } else if (type === "news") {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=technology,finance&sort=LATEST&limit=5&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();
      
      if (result.Note || result.Information || !result.feed) {
        console.log("Rate limited or no news, using fallback");
        return getFallbackResponse(type);
      }
      
      data = result.feed.slice(0, 5).map((item: any, index: number) => ({
        id: index + 1,
        title: item.title,
        source: item.source,
        time: getRelativeTime(item.time_published),
        category: getSentimentCategory(item.overall_sentiment_score),
        url: item.url,
      }));
    } else if (type === "top_movers") {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const result = await response.json();
      
      if (result.Note || result.Information || !result.top_gainers) {
        console.log("Rate limited, using fallback top movers");
        return getFallbackResponse(type);
      }
      
      data = {
        gainers: result.top_gainers?.slice(0, 5) || [],
        losers: result.top_losers?.slice(0, 5) || [],
      };
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Market data error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getFallbackResponse(type: string) {
  let data;
  switch (type) {
    case "indices":
      data = fallbackIndices;
      break;
    case "news":
      data = fallbackNews;
      break;
    case "top_movers":
      data = fallbackTopMovers;
      break;
    default:
      data = null;
  }
  return new Response(JSON.stringify({ success: true, data, fallback: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(
    timestamp.slice(0, 4) + "-" +
    timestamp.slice(4, 6) + "-" +
    timestamp.slice(6, 8) + "T" +
    timestamp.slice(9, 11) + ":" +
    timestamp.slice(11, 13) + ":" +
    timestamp.slice(13, 15) + "Z"
  );
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function getSentimentCategory(score: number): "bullish" | "bearish" | "neutral" {
  if (score > 0.15) return "bullish";
  if (score < -0.15) return "bearish";
  return "neutral";
}
