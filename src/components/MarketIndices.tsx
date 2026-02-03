import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { marketApi, IndexData } from "@/lib/api/market";

export const MarketIndices = () => {
  const { data: indices, isLoading, error } = useQuery({
    queryKey: ["market-indices"],
    queryFn: marketApi.getIndices,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  // Filter out Dow Jones and Russell 2000
  const filteredIndices = indices?.filter(
    (index: IndexData) => !["Dow Jones", "Russell 2000"].includes(index.name)
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-4 animate-pulse"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="h-4 bg-muted rounded w-20 mb-2"></div>
            <div className="h-8 bg-muted rounded w-28 mb-2"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !indices) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-muted-foreground">Unable to load market data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredIndices.map((index: IndexData) => (
        <div
          key={index.name}
          className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <p className="text-muted-foreground text-sm font-medium mb-1">{index.name}</p>
          <p className="text-foreground text-2xl font-bold mb-2">${index.value}</p>
          <div className={`flex items-center gap-1 ${index.change >= 0 ? 'text-success' : 'text-danger'}`}>
            {index.change >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-semibold">
              {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
            </span>
            <span className="text-sm">
              ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
