import { supabase } from "@/integrations/supabase/client";

export interface IndexData {
  name: string;
  symbol: string;
  value: string;
  change: number;
  changePercent: number;
}

export interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  category: "bullish" | "bearish" | "neutral";
  url?: string;
}

export interface StockRecommendation {
  rank: number;
  ticker: string;
  name: string;
  currentPrice: string;
  targetPrice: string;
  upside: number;
  reasoning: string;
  tags: string[];
}

export interface AIRecommendations {
  recommendations: StockRecommendation[];
  marketSummary: string;
}

export const marketApi = {
  async getIndices(): Promise<IndexData[]> {
    const { data, error } = await supabase.functions.invoke("market-data", {
      body: { type: "indices" },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getNews(): Promise<NewsItem[]> {
    const { data, error } = await supabase.functions.invoke("market-data", {
      body: { type: "news" },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getTopMovers() {
    const { data, error } = await supabase.functions.invoke("market-data", {
      body: { type: "top_movers" },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getQuote(symbol: string) {
    const { data, error } = await supabase.functions.invoke("market-data", {
      body: { type: "quote", symbol },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getAIRecommendations(
    marketData: IndexData[],
    topMovers: any,
    news: NewsItem[]
  ): Promise<AIRecommendations> {
    const { data, error } = await supabase.functions.invoke("ai-recommendations", {
      body: { marketData, topMovers, news },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  },
};
