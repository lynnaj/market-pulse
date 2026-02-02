import { Clock, ExternalLink } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  category: "bullish" | "bearish" | "neutral";
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Fed signals potential rate cuts in 2025 as inflation cools",
    source: "Bloomberg",
    time: "2h ago",
    category: "bullish",
  },
  {
    id: 2,
    title: "Tech sector leads market rally on strong earnings reports",
    source: "Reuters",
    time: "3h ago",
    category: "bullish",
  },
  {
    id: 3,
    title: "Oil prices surge amid Middle East tensions",
    source: "CNBC",
    time: "4h ago",
    category: "neutral",
  },
  {
    id: 4,
    title: "China's economic growth slows to 4.6% in Q4",
    source: "Financial Times",
    time: "5h ago",
    category: "bearish",
  },
  {
    id: 5,
    title: "AI chip demand drives semiconductor stocks higher",
    source: "WSJ",
    time: "6h ago",
    category: "bullish",
  },
];

const categoryColors = {
  bullish: "bg-success/10 text-success border-success/20",
  bearish: "bg-danger/10 text-danger border-danger/20",
  neutral: "bg-accent/10 text-accent border-accent/20",
};

export const MarketNews = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Market News</h2>
        <span className="text-sm text-muted-foreground">Live</span>
      </div>
      <div className="space-y-3">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="group p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-foreground font-medium group-hover:text-primary transition-colors">
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
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
