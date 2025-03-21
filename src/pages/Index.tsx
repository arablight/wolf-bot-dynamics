import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Bot, Users, MessageSquare, ActivitySquare, Play } from 'lucide-react';
import AccountCard from '@/components/accounts/AccountCard';
import AddAccountModal from '@/components/accounts/AddAccountModal';
import RoomConnector from '@/components/rooms/RoomConnector';
import CommandPanel from '@/components/commands/CommandPanel';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { AccountProvider, useAccounts } from '@/contexts/AccountContext';

// مكون لسجل النشاط
const ActivityLog = () => {
  const [logs, setLogs] = useState<{type: string; message: string; timestamp: Date}[]>([
    {type: 'info', message: 'تم بدء تشغيل التطبيق', timestamp: new Date()},
  ]);
  
  // استماع للأحداث وإضافتها إلى السجل
  useEffect(() => {
    const handleLog = (event: CustomEvent) => {
      setLogs(prev => [
        {
          type: event.detail.type || 'info',
          message: event.detail.message,
          timestamp: new Date()
        },
        ...prev
      ].slice(0, 50)); // الاحتفاظ بآخر 50 سجل فقط
    };
    
    window.addEventListener('app-log' as any, handleLog);
    return () => {
      window.removeEventListener('app-log' as any, handleLog);
    };
  }, []);
  
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `منذ ${seconds} ثانية`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };
  
  const getLogClass = (type: string) => {
    switch(type) {
      case 'success': return 'border-green-500 bg-green-50';
      case 'warning': return 'border-amber-500 bg-amber-50';
      case 'error': return 'border-red-500 bg-red-50';
      case 'info':
      default: return 'border-blue-500 bg-blue-50';
    }
  };
  
  return (
    <GlassCard>
      <div className="flex items-center mb-4">
        <ActivitySquare className="h-5 w-5 text-wolf-primary mr-2" />
        <h3 className="text-lg font-semibold">سجل النشاط</h3>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>لا توجد أحداث مسجلة</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`text-sm p-2 border-l-2 rounded ${getLogClass(log.type)}`}>
              <p className="font-medium">{log.message}</p>
              <p className="text-xs text-gray-500">{getTimeAgo(log.timestamp)}</p>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};

// مكون لمعاينة الدردشة
const ChatPreview = () => {
  const { activeAccount } = useAccounts();
  
  return (
    <GlassCard>
      <div className="flex items-center mb-4">
        <MessageSquare className="h-5 w-5 text-wolf-primary mr-2" />
        <h3 className="text-lg font-semibold">معاينة الدردشة</h3>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 h-60 flex flex-col">
        {!activeAccount || !activeAccount.activeRoom ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">
              سيتم عرض معاينة الدردشة هنا عند الاتصال بغرفة
            </p>
          </div>
        ) : (
          <>
            <div className="bg-wolf-primary text-white text-sm p-2 rounded mb-2 text-center">
              متصل بالغرفة: {activeAccount.activeRoom}
            </div>
            <div className="flex-grow overflow-y-auto space-y-2 py-2">
              <div className="bg-wolf-light rounded p-2 text-sm max-w-[80%]">
                <div className="font-bold text-xs">مستخدم 1</div>
                <p>مرحباً بالجميع!</p>
              </div>
              <div className="bg-wolf-light rounded p-2 text-sm max-w-[80%] mr-auto">
                <div className="font-bold text-xs">مستخدم 2</div>
                <p>أهلاً وسهلاً</p>
              </div>
              <div className="bg-wolf-primary bg-opacity-10 rounded p-2 text-sm max-w-[80%] border border-wolf-primary">
                <div className="font-bold text-xs text-wolf-primary">{activeAccount.username}</div>
                <p>!س جلد</p>
              </div>
            </div>
            <div className="mt-auto">
              <Input
                placeholder="اكتب رسالة..."
                className="rounded-full bg-white"
                disabled
              />
              <p className="text-xs text-center mt-1 text-gray-400">المعاينة للعرض فقط</p>
            </div>
          </>
        )}
      </div>
    </GlassCard>
  );
};

// مكون لوحة تحكم البوت
const BotDashboard = () => {
  const { activeAccount, isRaceCommandActive } = useAccounts();
  
  return (
    <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center mb-4">
        <Bot className="h-5 w-5 text-wolf-primary mr-2" />
        <h2 className="text-xl font-semibold">لوحة تحكم البوت</h2>
      </div>
      
      <Tabs defaultValue="race">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="race">سباق</TabsTrigger>
          <TabsTrigger value="custom">أوامر مخصصة</TabsTrigger>
          <TabsTrigger value="settings">إعدادات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="race" className="space-y-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-2">حالة السباق</h3>
            <div className="space-y-2">
              <div className="bg-wolf-light p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">الحالة:</span>
                  <span className={`text-sm ${isRaceCommandActive ? 'text-green-600' : 'text-gray-500'} font-medium`}>
                    {isRaceCommandActive ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">الحساب النشط:</span>
                  <span className="text-sm text-wolf-primary font-medium">
                    {activeAccount ? activeAccount.username : 'لم يتم تحديد حساب'}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">الغرفة النشطة:</span>
                  <span className="text-sm text-wolf-primary font-medium truncate max-w-[150px]">
                    {activeAccount?.activeRoom ? activeAccount.activeRoom : 'لم يتم تحديد غرفة'}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-2">الأوامر المخصصة</h3>
            <p className="text-sm text-gray-600 mb-4">
              قم بإنشاء وإدارة الأوامر المخصصة للبوت الخاص بك
            </p>
            
            <div className="space-y-2">
              <div className="bg-wolf-light p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">الأوامر النشطة:</span>
                  <span className="text-sm text-wolf-primary font-medium">0</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>إنشاء أمر جديد</span>
                </Button>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-2">إعدادات البوت</h3>
            <p className="text-sm text-gray-600 mb-4">
              قم بتخصيص إعدادات البوت حسب احتياجاتك
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">وضع التشغيل التلقائي</span>
                <Switch id="auto-mode" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">الرد على الرسائل الخاصة</span>
                <Switch id="auto-reply" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">تفعيل السجلات</span>
                <Switch id="logs" defaultChecked />
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </section>
  );
};

// مكون قسم الحسابات
const AccountsSection = () => {
  const { accounts, deleteAccount, toggleAccount, setActiveAccount, activeAccount } = useAccounts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-wolf-primary mr-2" />
          <h2 className="text-xl font-semibold">الحسابات</h2>
        </div>
        
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          <span>إضافة حساب</span>
        </Button>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {accounts.map(account => (
          <AccountCard
            key={account.id}
            account={account}
            onDelete={deleteAccount}
            onToggle={toggleAccount}
            onEdit={handleEditAccount}
            isActive={activeAccount?.id === account.id}
            onSetActive={setActiveAccount}
          />
        ))}
      </div>
      
      {accounts.length === 0 && (
        <GlassCard className="text-center py-8">
          <p className="text-gray-500 mb-4">لا توجد حسابات مضافة</p>
          <Button onClick={() => setIsAddModalOpen(true)} variant="outline" className="gap-1">
            <Plus className="h-4 w-4" />
            <span>إضافة حساب جديد</span>
          </Button>
        </GlassCard>
      )}
      
      <AddAccountModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
        onAddAccount={handleAddAccount} 
      />
    </section>
  );
};

// الصفحة الرئيسية
const Index = () => {
  return (
    <AccountProvider>
      <div className="min-h-screen pb-20 bg-gradient-to-b from-blue-50 to-white bg-mesh-pattern">
        <Header />
        
        <main className="pt-24 container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col gap-8">
            {/* Hero Section */}
            <section className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-wolf-primary to-wolf-secondary bg-clip-text text-transparent">
                WOLF Dynamics
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                منصة احترافية متكاملة لإدارة بوتات منصة WOLF بكفاءة عالية
              </p>
            </section>
            
            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Left Column */}
              <div className="lg:col-span-2 space-y-6 animate-slide-up">
                {/* Accounts Section */}
                <AccountsSection />
                
                {/* Bot Operation Dashboard */}
                <BotDashboard />
              </div>
              
              {/* Right Sidebar */}
              <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <RoomConnector />
                
                <CommandPanel />
                
                {/* Activity Log */}
                <ActivityLog />
                
                {/* Chat Preview */}
                <ChatPreview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AccountProvider>
  );
};

export default Index;
