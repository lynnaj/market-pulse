import { Sparkles, TrendingUp, Target, BarChart3, Loader2, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { marketApi, StockRecommendation } from "@/lib/api/market";
import { Button } from "@/components/ui/button";

export const StockRecommendations = () => {
  const { data: indices } = useQuery({
    queryKey: ["market-indices"],
    queryFn: marketApi.getIndices,
    staleTime: 30000,
  });

  const { data: topMovers } = useQuery({
    queryKey: ["top-movers"],
    queryFn: marketApi.getTopMovers,
    staleTime: 120000,
  });

  const { data: news } = useQuery({
    queryKey: ["market-news"],
    queryFn: marketApi.getNews,
    staleTime: 120000,
  });

  const { data: aiData, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: () => marketApi.getAIRecommendations(indices || [], topMovers || {}, news || []),
    enabled: !!indices && !!topMovers && !!news,
    staleTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading || (!aiData && !error)) {
    return (
      <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="p-2 rounded-lg"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-green)" }}
          >
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">AI Stock Picks</h2>
            <p className="text-sm text-muted-foreground">Analyzing market data...</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">AI is analyzing current market conditions...</p>
          <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="p-2 rounded-lg"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-green)" }}
          >
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">AI Stock Picks</h2>
            <p className="text-sm text-muted-foreground">Top 3 high-growth recommendations</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Unable to generate recommendations at this time.</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-green)" }}
          >
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">AI Stock Picks</h2>
            <p className="text-sm text-muted-foreground">Top 3 high-growth recommendations for 2025</p>
          </div>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isFetching}>
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {aiData?.marketSummary && (
        <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">{aiData.marketSummary}</p>
        </div>
      )}

      <div className="grid gap-4">
        {aiData?.recommendations?.map((stock: StockRecommendation) => (
          <div
            key={stock.ticker}
            className="relative p-5 bg-secondary/50 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">#{stock.rank}</span>
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-muted">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">{stock.ticker}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-sm">{stock.name}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {stock.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              {stock.reasoning}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                <p className="text-foreground font-semibold">{stock.currentPrice}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Target Price</p>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-accent" />
                  <p className="text-foreground font-semibold">{stock.targetPrice}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Upside Potential</p>
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <p className="font-bold">+{stock.upside.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        AI recommendations are for informational purposes only. Always conduct your own research before investing.
      </p>
    </div>
  );
};
