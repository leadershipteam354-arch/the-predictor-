import { BotLog } from '../../types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal } from 'lucide-react';

interface ActivityTerminalProps {
  logs: BotLog[];
}

export function ActivityTerminal({ logs }: ActivityTerminalProps) {
  return (
    <Card className="border-primary/20 bg-black/80 backdrop-blur-xl font-mono text-[10px] sm:text-xs">
      <CardHeader className="py-3 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-primary uppercase tracking-[0.2em] font-bold">
          <Terminal size={14} /> Kalaharian Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] p-4">
          <div className="space-y-1">
            {logs.length === 0 && (
              <div className="text-muted-foreground opacity-50 italic animate-pulse">
                [KALAHARIAN] Waiting for initialization...
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2 leading-relaxed">
                <span className="text-muted-foreground shrink-0">
                  [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]
                </span>
                <span className={`
                  ${log.type === 'trade' ? 'text-green-400 font-bold' : ''}
                  ${log.type === 'warning' ? 'text-yellow-400' : ''}
                  ${log.type === 'error' ? 'text-red-400' : ''}
                  ${log.type === 'info' ? 'text-blue-300' : ''}
                `}>
                  {log.type === 'trade' && '> '}
                  {log.message}
                </span>
              </div>
            ))}
            <div className="flex gap-2">
              <span className="text-primary animate-pulse">_</span>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
