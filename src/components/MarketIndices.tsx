import { TrendingUp, TrendingDown } from "lucide-react";

interface IndexData {
  name: string;
  value: string;
  change: number;
  changePercent: number;
}

const indices: IndexData[] = [
  { name: "S&P 500", value: "5,842.91", change: 42.28, changePercent: 0.73 },
  { name: "NASDAQ", value: "18,932.47", change: -23.15, changePercent: -0.12 },
  { name: "DOW JONES", value: "43,275.91", change: 156.82, changePercent: 0.36 },
  { name: "RUSSELL 2000", value: "2,284.35", change: 18.42, changePercent: 0.81 },
];

export const MarketIndices = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {indices.map((index) => (
        <div
          key={index.name}
          className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <p className="text-muted-foreground text-sm font-medium mb-1">{index.name}</p>
          <p className="text-foreground text-2xl font-bold mb-2">{index.value}</p>
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
