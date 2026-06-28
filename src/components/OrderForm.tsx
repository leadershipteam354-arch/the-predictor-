import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Asset } from '../types/trading';

interface OrderFormProps {
  asset: Asset;
  balance: number;
  onTrade: (amount: number, type: 'buy' | 'sell') => void;
}

export function OrderForm({ asset, balance, onTrade }: OrderFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'buy' | 'sell'>('buy');

  const numAmount = parseFloat(amount) || 0;
  const total = numAmount * asset.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;
    onTrade(numAmount, type);
    setAmount('');
  };

  return (
    <Card className="border-none shadow-none bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Trade {asset.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full" onValueChange={(v) => setType(v as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Buy</TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Sell</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Amount ({asset.symbol})</Label>
              <span className="text-xs text-muted-foreground">
                Balance: ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
              className="font-mono"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span>${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <Button 
            type="submit" 
            className={`w-full h-12 text-lg font-bold transition-colors ${
              type === 'buy' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {type === 'buy' ? 'Buy' : 'Sell'} {asset.symbol}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
