import { Clock, ExternalLink, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { marketApi, NewsItem } from "@/lib/api/market";

const categoryColors = {
  bullish: "bg-success/10 text-success border-success/20",
  bearish: "bg-danger/10 text-danger border-danger/20",
  neutral: "bg-accent/10 text-accent border-accent/20",
};

export const MarketNews = () => {
  const { data: newsItems, isLoading, error } = useQuery({
    queryKey: ["market-news"],
    queryFn: marketApi.getNews,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 120000,
  });

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Market News</h2>
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 bg-secondary/50 rounded-lg animate-pulse">
              <div className="h-5 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="flex gap-3">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !newsItems) {
    return (
      <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="text-xl font-bold text-foreground mb-4">Market News</h2>
        <p className="text-muted-foreground text-center py-8">Unable to load news. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Market News</h2>
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Live
        </span>
      </div>
      <div className="space-y-3">
        {newsItems.map((item: NewsItem) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-foreground font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[item.category]}`}>
                    {item.category}
                  </span>
                  <span className="text-muted-foreground text-sm">{item.source}</span>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.time}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
