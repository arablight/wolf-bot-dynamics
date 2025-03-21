
import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusIndicator from '@/components/ui/StatusIndicator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { UserCircle, MoreHorizontal, Trash2, RefreshCw, Pencil, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WolfAccount } from '@/api/wolfAPI';
import { cn } from '@/lib/utils';

interface AccountCardProps {
  account: WolfAccount;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onEdit: (id: string) => void;
  isActive: boolean;
  onSetActive: (account: WolfAccount) => void;
}

const AccountCard = ({
  account,
  onDelete,
  onToggle,
  onEdit,
  isActive,
  onSetActive
}: AccountCardProps) => {
  const [isToggling, setIsToggling] = useState(false);
  const { id, username, status, activeRoom } = account;

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true);
    await onToggle(id, checked);
    setIsToggling(false);
  };

  return (
    <GlassCard className={cn(
      "w-full transition-all duration-300",
      isActive && "border-2 border-wolf-primary"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <UserCircle className="w-10 h-10 text-wolf-primary mr-3" />
          <div>
            <h3 className="font-semibold text-lg">{username}</h3>
            <StatusIndicator status={status} size="sm" />
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onSetActive(account)} className="cursor-pointer">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>تحديد كحساب نشط</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(id)} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              <span>تعديل</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(id)} className="cursor-pointer text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>حذف</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isActive && (
        <div className="mb-4 px-3 py-2 bg-green-50 rounded-lg text-sm">
          <p className="font-medium text-green-600">الحساب النشط حالياً</p>
        </div>
      )}

      {activeRoom && (
        <div className="mb-4 px-3 py-2 bg-wolf-light rounded-lg text-sm">
          <p className="font-medium text-gray-700">الغرفة النشطة:</p>
          <p className="text-wolf-primary truncate">{activeRoom}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Switch 
            checked={status === 'online'}
            onCheckedChange={handleToggle}
            id={`account-toggle-${id}`}
            disabled={isToggling}
          />
          <label 
            htmlFor={`account-toggle-${id}`}
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            {status === 'online' ? 'نشط' : 'غير نشط'}
          </label>
        </div>
        
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => onSetActive(account)}>
          <RefreshCw className="h-4 w-4 text-wolf-primary" />
          <span>تحديث</span>
        </Button>
      </div>
    </GlassCard>
  );
};

export default AccountCard;
