export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon?: string;
}

export interface ChartData {
  time: string;
  price: number;
}

export interface Trade {
  id: string;
  assetId: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
}

export interface Position {
  assetId: string;
  symbol: string;
  amount: number;
  avgPrice: number;
}

export interface Portfolio {
  balance: number;
  positions: Record<string, Position>;
  history: Trade[];
}

export type BotStrategy = 'scalper' | 'spike_hunter' | 'manual';

export interface BotSettings {
  enabled: boolean;
  strategy: BotStrategy;
  riskPerTrade: number; // Percentage of balance
  maxDrawdown: number; // Percentage
  tp: number; // Take Profit percentage
  sl: number; // Stop Loss percentage
}

export interface BotLog {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'trade' | 'warning' | 'error';
}

