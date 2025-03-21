
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WolfAccount, WolfAccountManager, accountManager, PrivateMessage, GUESS_CATEGORIES } from '@/api/wolfAPI';
import { useToast } from '@/components/ui/use-toast';

interface AccountContextType {
  accounts: WolfAccount[];
  isLoading: boolean;
  activeAccount: WolfAccount | null;
  addAccount: (username: string, password: string) => Promise<boolean>;
  deleteAccount: (id: string) => void;
  toggleAccount: (id: string, active: boolean) => Promise<void>;
  connectToRoom: (roomUrl: string) => Promise<boolean>;
  sendMessage: (message: string) => Promise<boolean>;
  startRaceCommand: (intervalMinutes: number, automaticDetection?: boolean) => boolean;
  stopRaceCommand: () => void;
  isRaceCommandActive: boolean;
  isRaceAutoDetectionActive: boolean;
  startGuessCommand: (category: string) => Promise<boolean>;
  startFishCommand: (baitLevel?: number) => Promise<boolean>;
  setActiveAccount: (account: WolfAccount | null) => void;
  getPrivateMessages: () => PrivateMessage[];
  guessCategories: typeof GUESS_CATEGORIES;
}

const AccountContext = createContext<AccountContextType | null>(null);

export const useAccounts = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
};

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<WolfAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccount, setActiveAccount] = useState<WolfAccount | null>(null);
  const { toast } = useToast();

  // تحميل الحسابات عند بدء التشغيل
  useEffect(() => {
    refreshAccounts();
  }, []);

  const refreshAccounts = () => {
    const loadedAccounts = accountManager.getAccounts();
    setAccounts(loadedAccounts);
    
    // تحديث الحساب النشط إذا تغير
    if (activeAccount) {
      const updatedActiveAccount = loadedAccounts.find(acc => acc.id === activeAccount.id);
      if (updatedActiveAccount) {
        setActiveAccount(updatedActiveAccount);
      } else {
        setActiveAccount(null);
      }
    }
  };

  const addAccount = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newAccount = await accountManager.addAccount(username, password);
      if (newAccount) {
        refreshAccounts();
        return true;
      }
      return false;
    } catch (error) {
      console.error("خطأ في إضافة الحساب:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الحساب. الرجاء المحاولة مرة أخرى.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = (id: string) => {
    // إذا كان الحساب النشط هو الذي يتم حذفه، قم بإزالته
    if (activeAccount?.id === id) {
      setActiveAccount(null);
    }
    
    const result = accountManager.deleteAccount(id);
    if (result) {
      refreshAccounts();
      toast({
        title: "تم الحذف",
        description: "تم حذف الحساب بنجاح",
      });
    }
  };

  const toggleAccount = async (id: string, active: boolean) => {
    setIsLoading(true);
    try {
      const success = await accountManager.toggleAccount(id, active);
      if (success) {
        refreshAccounts();
        toast({
          title: active ? "تم تفعيل الحساب" : "تم إيقاف الحساب",
          description: `تم ${active ? 'تفعيل' : 'إيقاف'} الحساب بنجاح`,
        });
      }
    } catch (error) {
      console.error("خطأ في تبديل حالة الحساب:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تبديل حالة الحساب",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectToRoom = async (roomUrl: string): Promise<boolean> => {
    if (!activeAccount) {
      toast({
        title: "خطأ",
        description: "الرجاء تحديد حساب نشط أولاً",
        variant: "destructive"
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      const success = await accountManager.connectToRoom(activeAccount.id, roomUrl);
      if (success) {
        refreshAccounts();
        toast({
          title: "تم الاتصال",
          description: `تم الاتصال بالغرفة بنجاح: ${roomUrl}`,
        });
      }
      return success;
    } catch (error) {
      console.error("خطأ في الاتصال بالغرفة:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string): Promise<boolean> => {
    if (!activeAccount) {
      toast({
        title: "خطأ",
        description: "الرجاء تحديد حساب نشط أولاً",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      return await accountManager.sendMessage(activeAccount.id, message);
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error);
      return false;
    }
  };

  const startRaceCommand = (intervalMinutes: number, automaticDetection: boolean = false): boolean => {
    if (!activeAccount) {
      toast({
        title: "خطأ",
        description: "الرجاء تحديد حساب نشط أولاً",
        variant: "destructive"
      });
      return false;
    }
    
    return accountManager.startRaceCommand(activeAccount.id, intervalMinutes, automaticDetection);
  };

  const stopRaceCommand = () => {
    if (activeAccount) {
      accountManager.stopRaceCommand(activeAccount.id);
      toast({
        title: "تم الإيقاف",
        description: "تم إيقاف أمر السباق بنجاح",
      });
    }
  };

  const startGuessCommand = async (category: string): Promise<boolean> => {
    if (!activeAccount) {
      toast({
        title: "خطأ",
        description: "الرجاء تحديد حساب نشط أولاً",
        variant: "destructive"
      });
      return false;
    }
    
    return await accountManager.startGuessCommand(activeAccount.id, category);
  };

  const startFishCommand = async (baitLevel: number = 3): Promise<boolean> => {
    if (!activeAccount) {
      toast({
        title: "خطأ",
        description: "الرجاء تحديد حساب نشط أولاً",
        variant: "destructive"
      });
      return false;
    }
    
    return await accountManager.startFishCommand(activeAccount.id, baitLevel);
  };

  const isRaceCommandActive = activeAccount 
    ? accountManager.isRaceCommandActive(activeAccount.id)
    : false;

  const isRaceAutoDetectionActive = activeAccount
    ? accountManager.isRaceAutoDetectionActive(activeAccount.id)
    : false;

  const getPrivateMessages = (): PrivateMessage[] => {
    if (!activeAccount) return [];
    return accountManager.getPrivateMessagesForAccount(activeAccount.id);
  };

  // الاستماع للرسائل الجديدة
  useEffect(() => {
    const handleNewMessages = (event: any) => {
      const { accountId } = event.detail;
      
      // إذا كانت الرسائل للحساب النشط، قم بتحديث الحالة
      if (activeAccount && accountId === activeAccount.id) {
        refreshAccounts();
      }
    };
    
    window.addEventListener('new-private-messages', handleNewMessages as EventListener);
    
    return () => {
      window.removeEventListener('new-private-messages', handleNewMessages as EventListener);
    };
  }, [activeAccount]);

  // تحديث القائمة عند تغيير الحسابات
  useEffect(() => {
    // إنشاء مستمع لتحديث القائمة كل 5 ثوانٍ
    const interval = setInterval(refreshAccounts, 5000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    accounts,
    isLoading,
    activeAccount,
    addAccount,
    deleteAccount,
    toggleAccount,
    connectToRoom,
    sendMessage,
    startRaceCommand,
    stopRaceCommand,
    isRaceCommandActive,
    isRaceAutoDetectionActive,
    startGuessCommand,
    startFishCommand,
    setActiveAccount,
    getPrivateMessages,
    guessCategories: GUESS_CATEGORIES,
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};
