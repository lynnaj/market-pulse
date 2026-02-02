import { Activity, RefreshCw } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-xl"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-green)" }}
        >
          <Activity className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Pulse</h1>
          <p className="text-sm text-muted-foreground">Real-time market intelligence</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span>Markets Open</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>
    </header>
  );
};
