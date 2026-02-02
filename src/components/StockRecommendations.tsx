import { Sparkles, TrendingUp, Target, BarChart3 } from "lucide-react";

interface StockRecommendation {
  rank: number;
  ticker: string;
  name: string;
  currentPrice: string;
  targetPrice: string;
  upside: number;
  reasoning: string;
  tags: string[];
}

const recommendations: StockRecommendation[] = [
  {
    rank: 1,
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    currentPrice: "$876.42",
    targetPrice: "$1,250.00",
    upside: 42.6,
    reasoning: "Dominant position in AI chips, data center growth, and expanding automotive AI segment. Strong partnerships with major cloud providers.",
    tags: ["AI Leader", "Data Center", "High Growth"],
  },
  {
    rank: 2,
    ticker: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: "$428.15",
    targetPrice: "$580.00",
    upside: 35.5,
    reasoning: "Azure cloud growth accelerating, Copilot AI integration across product suite, and strong enterprise demand for AI solutions.",
    tags: ["Cloud", "AI Integration", "Enterprise"],
  },
  {
    rank: 3,
    ticker: "PLTR",
    name: "Palantir Technologies",
    currentPrice: "$24.83",
    targetPrice: "$38.00",
    upside: 53.0,
    reasoning: "Growing government contracts, expanding commercial segment, and leading AI/ML platform for enterprise data analytics.",
    tags: ["AI Analytics", "Government", "Breakout"],
  },
];

export const StockRecommendations = () => {
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
          <p className="text-sm text-muted-foreground">Top 3 high-growth recommendations for 2025</p>
        </div>
      </div>

      <div className="grid gap-4">
        {recommendations.map((stock) => (
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
                  <p className="font-bold">+{stock.upside}%</p>
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
