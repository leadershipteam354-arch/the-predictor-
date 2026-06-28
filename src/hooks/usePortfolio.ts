import { useState, useEffect } from 'react';
import { Portfolio, Trade, Asset } from '../types/trading';
import { toast } from 'sonner';

const INITIAL_PORTFOLIO: Portfolio = {
  balance: 100000, // $100k starting balance
  positions: {},
  history: []
};

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    const saved = localStorage.getItem('trading_portfolio');
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
  });

  useEffect(() => {
    localStorage.setItem('trading_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const executeTrade = (asset: Asset, amount: number, type: 'buy' | 'sell') => {
    const totalCost = amount * asset.price;

    if (type === 'buy') {
      if (portfolio.balance < totalCost) {
        toast.error('Insufficient balance');
        return false;
      }

      setPortfolio(prev => {
        const currentPosition = prev.positions[asset.id] || { assetId: asset.id, symbol: asset.symbol, amount: 0, avgPrice: 0 };
        const newAmount = currentPosition.amount + amount;
        const newAvgPrice = ((currentPosition.amount * currentPosition.avgPrice) + (amount * asset.price)) / newAmount;

        const trade: Trade = {
          id: Math.random().toString(36).substr(2, 9),
          assetId: asset.id,
          symbol: asset.symbol,
          type: 'buy',
          amount,
          price: asset.price,
          timestamp: Date.now()
        };

        return {
          ...prev,
          balance: prev.balance - totalCost,
          positions: {
            ...prev.positions,
            [asset.id]: { ...currentPosition, amount: newAmount, avgPrice: newAvgPrice }
          },
          history: [trade, ...prev.history]
        };
      });
      toast.success(`Bought ${amount} ${asset.symbol}`);
      return true;
    } else {
      const currentPosition = portfolio.positions[asset.id];
      if (!currentPosition || currentPosition.amount < amount) {
        toast.error(`Insufficient ${asset.symbol} balance`);
        return false;
      }

      setPortfolio(prev => {
        const currentPos = prev.positions[asset.id];
        const newAmount = currentPos.amount - amount;
        
        const trade: Trade = {
          id: Math.random().toString(36).substr(2, 9),
          assetId: asset.id,
          symbol: asset.symbol,
          type: 'sell',
          amount,
          price: asset.price,
          timestamp: Date.now()
        };

        const newPositions = { ...prev.positions };
        if (newAmount === 0) {
          delete newPositions[asset.id];
        } else {
          newPositions[asset.id] = { ...currentPos, amount: newAmount };
        }

        return {
          ...prev,
          balance: prev.balance + totalCost,
          positions: newPositions,
          history: [trade, ...prev.history]
        };
      });
      toast.success(`Sold ${amount} ${asset.symbol}`);
      return true;
    }
  };

  return {
    portfolio,
    executeTrade
  };
}
