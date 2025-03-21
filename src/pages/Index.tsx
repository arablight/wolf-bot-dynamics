
import { useState } from 'react';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Plus, Bot, Users, MessageSquare, ActivitySquare } from 'lucide-react';
import AccountCard from '@/components/accounts/AccountCard';
import AddAccountModal from '@/components/accounts/AddAccountModal';
import RoomConnector from '@/components/rooms/RoomConnector';
import CommandPanel from '@/components/commands/CommandPanel';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Mock data for initial accounts
const initialAccounts = [
  { id: '1', username: 'WolfUser_01', status: 'online' as const, activeRoom: 'https://wolf.live/g/12345678' },
  { id: '2', username: 'WolfUser_02', status: 'offline' as const, activeRoom: undefined },
];

const Index = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddAccount = (account: { username: string; password: string }) => {
    const newAccount = {
      id: Date.now().toString(),
      username: account.username,
      status: 'offline' as const,
      activeRoom: undefined,
    };
    
    setAccounts([...accounts, newAccount]);
    
    toast({
      title: "تم إضافة الحساب",
      description: `تم إضافة الحساب ${account.username} بنجاح`,
      duration: 3000,
    });
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    
    toast({
      title: "تم حذف الحساب",
      description: "تم حذف الحساب بنجاح",
      duration: 3000,
    });
  };

  const handleToggleAccount = (id: string, active: boolean) => {
    setAccounts(accounts.map(account => 
      account.id === id 
        ? { ...account, status: active ? 'online' : 'offline' } 
        : account
    ));
    
    const account = accounts.find(acc => acc.id === id);
    
    toast({
      title: active ? "تم تفعيل الحساب" : "تم إيقاف الحساب",
      description: `تم ${active ? 'تفعيل' : 'إيقاف'} الحساب ${account?.username}`,
      duration: 3000,
    });
  };

  const handleEditAccount = (id: string) => {
    // Placeholder for edit functionality
    toast({
      title: "تعديل الحساب",
      description: "سيتم تنفيذ وظيفة التعديل قريبًا",
      duration: 3000,
    });
  };

  const handleConnectRoom = (roomUrl: string) => {
    toast({
      title: "جاري الاتصال",
      description: `جاري الاتصال بالغرفة: ${roomUrl}`,
      duration: 3000,
    });
  };

  return (
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
                      {...account}
                      onDelete={handleDeleteAccount}
                      onToggle={handleToggleAccount}
                      onEdit={handleEditAccount}
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
              </section>
              
              {/* Bot Operation Dashboard */}
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
                            <span className="text-sm text-wolf-primary font-medium">غير نشط</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">آخر تنفيذ:</span>
                            <span className="text-sm text-gray-600">لم يتم التنفيذ بعد</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">التنفيذ التالي:</span>
                            <span className="text-sm text-gray-600">-</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button variant="default" className="gap-1">
                            <Play className="h-4 w-4" />
                            <span>تشغيل السباق</span>
                          </Button>
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
            </div>
            
            {/* Right Sidebar */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <RoomConnector onConnect={handleConnectRoom} />
              
              <CommandPanel />
              
              {/* Activity Log */}
              <GlassCard>
                <div className="flex items-center mb-4">
                  <ActivitySquare className="h-5 w-5 text-wolf-primary mr-2" />
                  <h3 className="text-lg font-semibold">سجل النشاط</h3>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  <div className="text-sm p-2 border-l-2 border-green-500 bg-green-50 rounded">
                    <p className="font-medium">تم تشغيل الحساب WolfUser_01</p>
                    <p className="text-xs text-gray-500">منذ 5 دقائق</p>
                  </div>
                  
                  <div className="text-sm p-2 border-l-2 border-blue-500 bg-blue-50 rounded">
                    <p className="font-medium">تم الاتصال بالغرفة #12345678</p>
                    <p className="text-xs text-gray-500">منذ 5 دقائق</p>
                  </div>
                  
                  <div className="text-sm p-2 border-l-2 border-amber-500 bg-amber-50 rounded">
                    <p className="font-medium">تم إرسال أمر السباق "!س جلد"</p>
                    <p className="text-xs text-gray-500">منذ 3 دقائق</p>
                  </div>
                </div>
              </GlassCard>
              
              {/* Chat Preview */}
              <GlassCard>
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-5 w-5 text-wolf-primary mr-2" />
                  <h3 className="text-lg font-semibold">معاينة الدردشة</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 h-60 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">
                    سيتم عرض معاينة الدردشة هنا عند الاتصال بغرفة
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
      
      <AddAccountModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
        onAddAccount={handleAddAccount} 
      />
    </div>
  );
};

export default Index;
