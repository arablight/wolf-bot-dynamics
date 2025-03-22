
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bot, Home, Users, Menu, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccounts } from '@/contexts/AccountContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { accounts } = useAccounts();
  const activeAccountsCount = accounts.filter(acc => acc.status === 'online').length;

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-b from-blue-50 to-white bg-mesh-pattern">
      {/* Sidebar */}
      <div
        className={cn(
          "h-screen sticky top-0 transition-all duration-300 bg-white border-r border-gray-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            {!collapsed && <h2 className="text-lg font-semibold text-wolf-primary">WOLF Dynamics</h2>}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(!collapsed)}
              className="ml-auto"
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </Button>
          </div>
          
          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="space-y-1 px-2">
              <SidebarItem 
                icon={Home} 
                label="لوحة التحكم" 
                isActive={true} 
                collapsed={collapsed} 
              />
              <SidebarItem 
                icon={Users} 
                label="الحسابات" 
                badge={accounts.length.toString()}
                collapsed={collapsed} 
              />
              <SidebarItem 
                icon={Bot} 
                label="البوتات" 
                badge={activeAccountsCount > 0 ? activeAccountsCount.toString() : undefined}
                collapsed={collapsed} 
              />
              <SidebarItem 
                icon={Settings} 
                label="الإعدادات" 
                collapsed={collapsed} 
              />
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <div className={cn(
              "rounded-lg bg-blue-50 p-3",
              collapsed ? "text-center" : ""
            )}>
              {!collapsed ? (
                <div className="text-xs text-blue-600">
                  <p className="font-medium">WOLF Dynamics</p>
                  <p>v1.0.0</p>
                </div>
              ) : (
                <Bot size={20} className="mx-auto text-blue-600" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        <div className="container px-4 py-6 mx-auto max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  collapsed: boolean;
  badge?: string;
}

function SidebarItem({ icon: Icon, label, isActive, collapsed, badge }: SidebarItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start rounded-lg py-2 text-right",
        isActive 
          ? "bg-blue-50 text-wolf-primary hover:bg-blue-100" 
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      <div className="flex items-center w-full">
        <Icon size={20} className="shrink-0" />
        
        {!collapsed && <span className="mr-3">{label}</span>}
        
        {!collapsed && badge && (
          <span className="mr-auto ml-2 bg-gray-100 text-gray-600 rounded-full text-xs px-2 py-0.5">
            {badge}
          </span>
        )}
      </div>
    </Button>
  );
}
