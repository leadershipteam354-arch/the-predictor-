import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Portfolio, Asset } from '../types/trading';
import { Wallet, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PortfolioOverviewProps {
  portfolio: Portfolio;
  assets: Asset[];
}

export function PortfolioOverview({ portfolio, assets }: PortfolioOverviewProps) {
  const assetValue = Object.values(portfolio.positions).reduce((acc, pos) => {
    const asset = assets.find(a => a.id === pos.assetId);
    return acc + (pos.amount * (asset?.price || pos.avgPrice));
  }, 0);

  const totalValue = portfolio.balance + assetValue;
  const initialValue = 100000; // Mock initial value
  const totalPL = totalValue - initialValue;
  const totalPLPercent = (totalPL / initialValue) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-none shadow-none bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Net Worth</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className={`text-xs flex items-center gap-1 mt-1 ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalPL >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(totalPLPercent).toFixed(2)}% (${Math.abs(totalPL).toLocaleString()})
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Available Cash</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${portfolio.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {((portfolio.balance / totalValue) * 100).toFixed(1)}% of portfolio
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Asset Holdings</CardTitle>
          <div className="h-4 w-4 text-muted-foreground font-bold">#</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${assetValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {Object.keys(portfolio.positions).length} assets held
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
