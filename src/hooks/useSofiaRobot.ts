import { useState, useEffect, useCallback, useRef } from 'react';
import { Asset, BotSettings, BotLog, Portfolio } from '../types/trading';
import { toast } from 'sonner';

const INITIAL_SETTINGS: BotSettings = {
  enabled: false,
  strategy: 'scalper',
  riskPerTrade: 2,
  maxDrawdown: 10,
  tp: 5,
  sl: 2,
};

export function useSofiaRobot(
  assets: Asset[],
  portfolio: Portfolio,
  executeTrade: (asset: Asset, amount: number, type: 'buy' | 'sell') => boolean
) {
  const [settings, setSettings] = useState<BotSettings>(() => {
    const saved = localStorage.getItem('sofia_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [logs, setLogs] = useState<BotLog[]>([]);
  const lastPrices = useRef<Record<string, number>>({});

  useEffect(() => {
    localStorage.setItem('sofia_settings', JSON.stringify(settings));
  }, [settings]);

  const addLog = useCallback((message: string, type: BotLog['type'] = 'info') => {
    const newLog: BotLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message,
      type,
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  // Initialize prices
  useEffect(() => {
    if (Object.keys(lastPrices.current).length === 0 && assets.length > 0) {
      assets.forEach(asset => {
        lastPrices.current[asset.id] = asset.price;
      });
      addLog('Sofia AI initialized. Scanning markets...', 'info');
    }
  }, [assets, addLog]);

  // Main robot logic loop
  useEffect(() => {
    if (!settings.enabled) return;

    assets.forEach(asset => {
      const prevPrice = lastPrices.current[asset.id];
      if (!prevPrice) {
        lastPrices.current[asset.id] = asset.price;
        return;
      }

      const priceChange = ((asset.price - prevPrice) / prevPrice) * 100;
      
      // Strategy logic
      if (settings.strategy === 'spike_hunter' && Math.abs(priceChange) > 0.5) {
        const type = priceChange > 0 ? 'buy' : 'sell';
        handleBotTrade(asset, type, `Market spike detected on ${asset.symbol}: ${priceChange.toFixed(2)}%`);
      } else if (settings.strategy === 'scalper' && Math.abs(priceChange) > 0.2) {
        // Simple scalping logic - mean reversion for this mock
        const type = priceChange > 0 ? 'sell' : 'buy';
        handleBotTrade(asset, type, `Scalping opportunity on ${asset.symbol}`);
      }

      lastPrices.current[asset.id] = asset.price;
    });
  }, [assets, settings.enabled, settings.strategy]);

  const handleBotTrade = (asset: Asset, type: 'buy' | 'sell', reason: string) => {
    // Calculate risk
    const tradeAmountValue = (portfolio.balance * (settings.riskPerTrade / 100));
    const amount = tradeAmountValue / asset.price;

    addLog(`${reason}. Preparing ${type.toUpperCase()} order...`, 'info');
    
    const success = executeTrade(asset, amount, type);
    if (success) {
      addLog(`Robot executed ${type.toUpperCase()} ${amount.toFixed(4)} ${asset.symbol} at $${asset.price.toLocaleString()}`, 'trade');
    } else {
      addLog(`Failed to execute bot trade on ${asset.symbol}: Insufficient funds or error`, 'warning');
    }
  };

  const toggleBot = () => {
    setSettings(prev => {
      const newState = !prev.enabled;
      addLog(`Sofia AI Trading ${newState ? 'STARTED' : 'STOPPED'}`, newState ? 'info' : 'warning');
      return { ...prev, enabled: newState };
    });
  };

  const updateSettings = (newSettings: Partial<BotSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addLog('Bot configuration updated', 'info');
  };

  return {
    settings,
    logs,
    toggleBot,
    updateSettings,
    addLog
  };
}
