import { LayoutDashboard, BarChart3, Wallet, History, Settings, LogOut, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'markets', icon: BarChart3, label: 'Markets' },
    { id: 'portfolio', icon: Wallet, label: 'Portfolio' },
    { id: 'history', icon: History, label: 'History' },
  ];

  return (
    <div className="w-64 border-r border-border h-screen flex flex-col bg-card/30 backdrop-blur-md sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Cpu className="text-primary-foreground h-5 w-5" />
        </div>
        <span className="text-xl font-black tracking-tight uppercase">Kalaharian AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'secondary' : 'ghost'}
            className={`w-full justify-start gap-3 h-11 ${
              activeTab === item.id ? 'bg-secondary' : ''
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
          <Settings size={20} />
          <span>Settings</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-500 hover:bg-red-500/10">
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
