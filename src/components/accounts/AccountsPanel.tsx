
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, RefreshCw, MoreHorizontal } from 'lucide-react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/components/ui/use-toast';
import AddAccountModal from '@/components/accounts/AddAccountModal';
import { Card } from '@/components/ui/card';
import StatusIndicator from '@/components/ui/StatusIndicator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import RoomConnector from '@/components/rooms/RoomConnector';

const AccountsPanel = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { accounts, deleteAccount, toggleAccount, setActiveAccount, activeAccount } = useAccounts();
  const { toast } = useToast();
  
  const handleAddAccount = (account: { username: string; password: string }) => {
    toast({
      title: "جاري إضافة الحساب",
      description: "يتم الآن التحقق من بيانات الحساب...",
    });
  };
  
  const handleEditAccount = (id: string) => {
    toast({
      title: "تعديل الحساب",
      description: "سيتم تنفيذ وظيفة التعديل قريبًا",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">الحسابات المسجلة</h2>
        <Button 
          onClick={() => setIsAddModalOpen(true)} 
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة حساب</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(account => (
          <Card key={account.id} className="p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <StatusIndicator 
                    status={account.status} 
                    size="sm" 
                  />
                  <h3 className="font-semibold">{account.username}</h3>
                </div>
                {account.id === activeAccount?.id && (
                  <span className="text-xs text-green-600 font-medium mt-1">
                    الحساب النشط حالياً
                  </span>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveAccount(account)}>
                    تعيين كحساب نشط
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditAccount(account.id)}>
                    تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteAccount(account.id)}
                    className="text-red-600"
                  >
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {account.activeRoom && (
              <div className="bg-gray-50 p-2 rounded-lg text-sm mb-3">
                <p className="text-gray-600">الغرفة النشطة:</p>
                <p className="truncate font-medium">{account.activeRoom}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={account.status === 'online'} 
                  onCheckedChange={(checked) => toggleAccount(account.id, checked)}
                  id={`toggle-${account.id}`}
                />
                <label 
                  htmlFor={`toggle-${account.id}`}
                  className="text-sm cursor-pointer"
                >
                  {account.status === 'online' ? 'نشط' : 'غير نشط'}
                </label>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs gap-1"
                onClick={() => setActiveAccount(account)}
              >
                <RefreshCw className="h-3 w-3" />
                <span>تحديث</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {accounts.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">لا توجد حسابات مسجلة</p>
          <Button 
            onClick={() => setIsAddModalOpen(true)} 
            variant="outline"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة حساب جديد</span>
          </Button>
        </div>
      )}
      
      {activeAccount && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">اتصال الغرفة</h3>
          <RoomConnector />
        </div>
      )}
      
      <AddAccountModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
        onAddAccount={handleAddAccount} 
      />
    </div>
  );
};

export default AccountsPanel;
