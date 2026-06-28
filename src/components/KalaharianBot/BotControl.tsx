import { BotSettings, BotStrategy } from '../../types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Power, Settings2, ShieldCheck } from 'lucide-react';

interface BotControlProps {
  settings: BotSettings;
  onToggle: () => void;
  onUpdate: (settings: Partial<BotSettings>) => void;
}

export function BotControl({ settings, onToggle, onUpdate }: BotControlProps) {
  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${settings.enabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} animate-pulse`}>
            <ShieldCheck size={20} />
          </div>
          <CardTitle className="text-xl font-black tracking-tighter">KALAHARIAN v3.0</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="bot-power" className="text-xs font-bold uppercase text-muted-foreground">
            {settings.enabled ? 'Active' : 'Offline'}
          </Label>
          <Switch 
            id="bot-power" 
            checked={settings.enabled} 
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
            <Settings2 size={12} /> Strategy Mode
          </Label>
          <Select 
            value={settings.strategy} 
            onValueChange={(v) => onUpdate({ strategy: v as BotStrategy })}
          >
            <SelectTrigger className="bg-background/50 border-primary/20">
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scalper">Kalaharian Scalper Pro</SelectItem>
              <SelectItem value="spike_hunter">Spike Hunter EA</SelectItem>
              <SelectItem value="manual">Monitoring Mode</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Risk per Trade (%)</Label>
            <Input 
              type="number" 
              value={settings.riskPerTrade} 
              onChange={(e) => onUpdate({ riskPerTrade: parseFloat(e.target.value) })}
              className="bg-background/50 border-primary/20 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Max Drawdown (%)</Label>
            <Input 
              type="number" 
              value={settings.maxDrawdown} 
              onChange={(e) => onUpdate({ maxDrawdown: parseFloat(e.target.value) })}
              className="bg-background/50 border-primary/20 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground text-green-500">Take Profit (%)</Label>
            <Input 
              type="number" 
              value={settings.tp} 
              onChange={(e) => onUpdate({ tp: parseFloat(e.target.value) })}
              className="bg-background/50 border-green-500/20 font-mono text-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground text-red-500">Stop Loss (%)</Label>
            <Input 
              type="number" 
              value={settings.sl} 
              onChange={(e) => onUpdate({ sl: parseFloat(e.target.value) })}
              className="bg-background/50 border-red-500/20 font-mono text-red-500"
            />
          </div>
        </div>

        <Button 
          variant={settings.enabled ? "destructive" : "default"} 
          className="w-full font-black uppercase tracking-widest gap-2 h-12"
          onClick={onToggle}
        >
          <Power size={18} />
          {settings.enabled ? 'Shutdown System' : 'Initiate Kalaharian AI'}
        </Button>
      </CardContent>
    </Card>
  );
}
