import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trade } from '../types/trading';

interface TradeHistoryProps {
  history: Trade[];
}

export function TradeHistory({ history }: TradeHistoryProps) {
  return (
    <Card className="border-none shadow-none bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground italic">
            No trades executed yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-bold">{trade.symbol}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      trade.type === 'buy' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {trade.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">{trade.amount.toFixed(4)}</TableCell>
                  <TableCell className="text-right font-mono">${trade.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${(trade.amount * trade.price).toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {new Date(trade.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
