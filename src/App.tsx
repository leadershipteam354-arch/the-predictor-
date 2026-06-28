import { useState } from 'react';
import { useMarketData } from './hooks/useMarketData';
import { usePortfolio } from './hooks/usePortfolio';
import { useKalaharianRobot } from './hooks/useKalaharianRobot';
import { MarketChart } from './components/MarketChart';
import { OrderForm } from './components/OrderForm';
import { MarketList } from './components/MarketList';
import { PortfolioOverview } from './components/PortfolioOverview';
import { TradeHistory } from './components/TradeHistory';
import { BotControl } from './components/KalaharianBot/BotControl';
import { ActivityTerminal } from './components/KalaharianBot/ActivityTerminal';
import { Sidebar } from './components/Sidebar';
import { Toaster } from 'sonner';
import { Bell, Search, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { assets, selectedAsset, setSelectedAssetId, chartData } = useMarketData();
  const { portfolio, executeTrade } = usePortfolio();
  const { settings, logs, toggleBot, updateSettings } = useKalaharianRobot(assets, portfolio, executeTrade);

  const handleTrade = (amount: number, type: 'buy' | 'sell') => {
    executeTrade(selectedAsset, amount, type);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-foreground flex font-sans selection:bg-primary/30 dark">
      <Toaster position="top-right" richColors />
      
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 w-1/3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search assets, news..." 
                className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {settings.enabled && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <Zap size={14} className="text-green-500 fill-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Kalaharian Active</span>
              </div>
            )}
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold">Alex Trader</div>
                <div className="text-xs text-muted-foreground font-mono">ID: 882410</div>
              </div>
              <Avatar className="border border-border">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <div className="max-w-[1600px] mx-auto space-y-6">
              <PortfolioOverview portfolio={portfolio} assets={assets} />
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                  <MarketChart asset={selectedAsset} data={chartData} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OrderForm 
                      asset={selectedAsset} 
                      balance={portfolio.balance} 
                      onTrade={handleTrade} 
                    />
                    <BotControl 
                      settings={settings} 
                      onToggle={toggleBot} 
                      onUpdate={updateSettings} 
                    />
                  </div>
                  <ActivityTerminal logs={logs} />
                </div>
                
                <div className="lg:col-span-1">
                  <MarketList 
                    assets={assets} 
                    selectedId={selectedAsset.id} 
                    onSelect={setSelectedAssetId} 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'markets' && (
            <div className="max-w-[1200px] mx-auto">
              <h2 className="text-3xl font-black mb-8">Markets Explorer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map(asset => (
                  <button 
                    key={asset.id}
                    onClick={() => {
                      setSelectedAssetId(asset.id);
                      setActiveTab('dashboard');
                    }}
                    className="group bg-card/40 hover:bg-card/60 transition-all p-6 rounded-2xl border border-border/50 hover:border-primary/50 text-left"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                        {asset.symbol[0]}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${asset.change24h >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    </div>
                    <div className="font-black text-xl mb-1">{asset.name}</div>
                    <div className="text-muted-foreground text-sm font-medium mb-4">{asset.symbol} / USD</div>
                    <div className="text-2xl font-mono tracking-tighter">${asset.price.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="max-w-[1200px] mx-auto space-y-6">
              <h2 className="text-3xl font-black mb-8">My Portfolio</h2>
              <PortfolioOverview portfolio={portfolio} assets={assets} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <TradeHistory history={portfolio.history} />
                 </div>
                 <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-none">
                      <CardHeader>
                        <CardTitle>Asset Allocation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.values(portfolio.positions).map(pos => {
                            const asset = assets.find(a => a.id === pos.assetId);
                            const value = pos.amount * (asset?.price || pos.avgPrice);
                            return (
                              <div key={pos.assetId} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                  <span className="font-bold">{pos.symbol}</span>
                                </div>
                                <span className="font-mono">${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              </div>
                            );
                          })}
                          {Object.keys(portfolio.positions).length === 0 && (
                            <div className="text-muted-foreground text-sm italic">No assets held yet.</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-[1000px] mx-auto">
              <h2 className="text-3xl font-black mb-8">Order History</h2>
              <TradeHistory history={portfolio.history} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
