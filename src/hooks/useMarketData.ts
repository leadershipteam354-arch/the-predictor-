import { useState, useEffect } from 'react';
import { Asset, ChartData } from '../types/trading';

const INITIAL_ASSETS: Asset[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 65432.50, change24h: 2.5 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3450.75, change24h: -1.2 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.20, change24h: 5.8 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: 0.5 },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.20, change24h: -2.1 },
];

export function useMarketData() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(INITIAL_ASSETS[0].id);
  const [chartData, setChartData] = useState<Record<string, ChartData[]>>({});

  // Initialize chart data
  useEffect(() => {
    const initialChartData: Record<string, ChartData[]> = {};
    INITIAL_ASSETS.forEach(asset => {
      const data: ChartData[] = [];
      let lastPrice = asset.price;
      for (let i = 0; i < 20; i++) {
        lastPrice = lastPrice * (1 + (Math.random() * 0.02 - 0.01));
        data.push({
          time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: lastPrice
        });
      }
      initialChartData[asset.id] = data;
    });
    setChartData(initialChartData);
  }, []);

  // Update prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(currentAssets => 
        currentAssets.map(asset => {
          const change = 1 + (Math.random() * 0.002 - 0.001);
          const newPrice = asset.price * change;
          
          // Update chart data for this asset
          setChartData(prev => {
            const history = prev[asset.id] || [];
            const newData = [...history.slice(1), {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              price: newPrice
            }];
            return { ...prev, [asset.id]: newData };
          });

          return {
            ...asset,
            price: newPrice,
            change24h: asset.change24h + (Math.random() * 0.1 - 0.05)
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];
  const selectedChartData = chartData[selectedAssetId] || [];

  return {
    assets,
    selectedAsset,
    setSelectedAssetId,
    chartData: selectedChartData
  };
}
