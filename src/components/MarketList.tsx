import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Asset } from '../types/trading';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketListProps {
  assets: Asset[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function MarketList({ assets, selectedId, onSelect }: MarketListProps) {
  return (
    <Card className="h-full border-none shadow-none bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Markets</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="flex flex-col">
            {assets.map((asset) => {
              const isPositive = asset.change24h >= 0;
              return (
                <button
                  key={asset.id}
                  onClick={() => onSelect(asset.id)}
                  className={`flex items-center justify-between p-4 transition-colors hover:bg-accent/50 text-left border-l-4 ${
                    selectedId === asset.id ? 'bg-accent border-primary' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold">{asset.symbol}</div>
                      <div className="text-xs text-muted-foreground">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-medium">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className={`text-xs flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
