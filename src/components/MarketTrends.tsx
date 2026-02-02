import { TrendingUp, TrendingDown, Minus, Activity, Zap, Shield } from "lucide-react";

interface TrendItem {
  label: string;
  value: string;
  status: "bullish" | "bearish" | "neutral";
  icon: React.ReactNode;
}

const trends: TrendItem[] = [
  {
    label: "Market Sentiment",
    value: "Bullish",
    status: "bullish",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    label: "Volatility (VIX)",
    value: "14.32",
    status: "bullish",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    label: "Fear & Greed",
    value: "72 - Greed",
    status: "neutral",
    icon: <Shield className="w-5 h-5" />,
  },
];

const sectorPerformance = [
  { name: "Technology", change: 2.34 },
  { name: "Healthcare", change: 1.12 },
  { name: "Finance", change: 0.87 },
  { name: "Energy", change: -0.45 },
  { name: "Consumer", change: 0.23 },
];

const statusStyles = {
  bullish: "text-success",
  bearish: "text-danger",
  neutral: "text-warning",
};

const statusIcons = {
  bullish: <TrendingUp className="w-4 h-4" />,
  bearish: <TrendingDown className="w-4 h-4" />,
  neutral: <Minus className="w-4 h-4" />,
};

export const MarketTrends = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <h2 className="text-xl font-bold text-foreground mb-4">Market Trends</h2>
      
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

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">SECTOR PERFORMANCE</h3>
        <div className="space-y-2">
          {sectorPerformance.map((sector) => (
            <div key={sector.name} className="flex items-center justify-between">
              <span className="text-foreground text-sm">{sector.name}</span>
              <span className={`font-medium ${sector.change >= 0 ? 'text-success' : 'text-danger'}`}>
                {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
