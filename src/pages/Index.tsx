import { DashboardHeader } from "@/components/DashboardHeader";
import { MarketIndices } from "@/components/MarketIndices";
import { MarketNews } from "@/components/MarketNews";
import { MarketTrends } from "@/components/MarketTrends";
import { StockRecommendations } from "@/components/StockRecommendations";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-7xl mx-auto px-4">
        <DashboardHeader />
        
        {/* Market Indices */}
        <section className="mb-8">
          <MarketIndices />
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* News Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <MarketNews />
          </div>

          {/* Trends Sidebar */}
          <div className="lg:col-span-1">
            <MarketTrends />
          </div>
        </div>

        {/* AI Stock Recommendations */}
        <section className="mt-8">
          <StockRecommendations />
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Market Pulse. Data is for informational purposes only.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
