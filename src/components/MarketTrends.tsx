import { TrendingUp, TrendingDown, Loader2, Activity, Zap, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { marketApi } from "@/lib/api/market";

export const MarketTrends = () => {
  const { data: topMovers, isLoading } = useQuery({
    queryKey: ["top-movers"],
    queryFn: marketApi.getTopMovers,
    refetchInterval: 300000,
    staleTime: 120000,
  });

  const trends = [
    {
      label: "Market Sentiment",
      value: topMovers?.gainers?.length > topMovers?.losers?.length ? "Bullish" : "Mixed",
      status: topMovers?.gainers?.length > topMovers?.losers?.length ? "bullish" : "neutral" as const,
      icon: <Activity className="w-5 h-5" />,
    },
    {
      label: "Top Gainer",
      value: topMovers?.gainers?.[0]?.ticker || "Loading...",
      status: "bullish" as const,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: "Top Loser",
      value: topMovers?.losers?.[0]?.ticker || "Loading...",
      status: "bearish" as const,
      icon: <TrendingDown className="w-5 h-5" />,
    },
  ];

  const statusStyles = {
    bullish: "text-success",
    bearish: "text-danger",
    neutral: "text-warning",
  };

  const statusIcons = {
    bullish: <TrendingUp className="w-4 h-4" />,
    bearish: <TrendingDown className="w-4 h-4" />,
    neutral: <Zap className="w-4 h-4" />,
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Market Trends</h2>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>
      
      <div className="space-y-4 mb-6">
        {trends.map((trend) => (
          <div
            key={trend.label}
            className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                {trend.icon}
              </div>
              <span className="text-foreground font-medium">{trend.label}</span>
            </div>
            <div className={`flex items-center gap-2 ${statusStyles[trend.status]}`}>
              {statusIcons[trend.status]}
              <span className="font-semibold">{trend.value}</span>
            </div>
          </div>
        ))}
      </div>

      {topMovers?.gainers && (
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">TOP GAINERS TODAY</h3>
          <div className="space-y-2">
            {topMovers.gainers.slice(0, 5).map((stock: any) => (
              <div key={stock.ticker} className="flex items-center justify-between">
                <span className="text-foreground text-sm font-medium">{stock.ticker}</span>
                <span className="font-medium text-success">
                  +{parseFloat(stock.change_percentage).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
