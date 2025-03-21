
import { useState } from 'react';
import { useAccounts } from '@/contexts/AccountContext';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Link, History, Loader2, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const COMMON_ROOMS = [
  { name: "سباق غرفة 1", url: "wolf.live/g/19216164" },
  { name: "سباق غرفة 2", url: "wolf.live/u/80277459" },
  { name: "تخمين غرفة 1", url: "wolf.live/g/25345679" },
  { name: "صيد غرفة 1", url: "wolf.live/g/76983214" },
];

const RECENT_ROOMS: string[] = [];

const RoomConnector = () => {
  const { connectToRoom, activeAccount, isLoading } = useAccounts();
  const [roomUrl, setRoomUrl] = useState('');
  
  const handleConnect = async () => {
    if (!roomUrl.trim()) return;
    
    // تنسيق رابط الغرفة
    let formattedUrl = roomUrl.trim();
    if (!formattedUrl.includes('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    const success = await connectToRoom(formattedUrl);
    if (success && !RECENT_ROOMS.includes(formattedUrl)) {
      // حفظ الغرفة في قائمة الغرف الأخيرة
      RECENT_ROOMS.unshift(formattedUrl);
      if (RECENT_ROOMS.length > 5) {
        RECENT_ROOMS.pop();
      }
    }
    
    setRoomUrl('');
  };
  
  return (
    <GlassCard className="w-full">
      <h3 className="text-lg font-semibold mb-4">الاتصال بغرفة</h3>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="url" className="flex items-center gap-1">
            <Link className="h-4 w-4" />
            <span>رابط الغرفة</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span>بحث</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="url">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-url" className="text-sm">رابط الغرفة:</Label>
              <div className="flex gap-2">
                <Input
                  id="room-url"
                  value={roomUrl}
                  onChange={(e) => setRoomUrl(e.target.value)}
                  placeholder="wolf.live/g/12345678"
                  className="flex-1"
                  disabled={isLoading || !activeAccount}
                />
                <Button 
                  onClick={handleConnect} 
                  disabled={isLoading || !roomUrl.trim() || !activeAccount}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "اتصال"
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                يمكنك إدخال رابط الغرفة بصيغة wolf.live/g/ID أو wolf.live/roomname
              </p>
            </div>
            
            {RECENT_ROOMS.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1">
                  <History className="h-4 w-4" />
                  <span>الغرف الأخيرة:</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {RECENT_ROOMS.map((url, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => connectToRoom(url)}
                      disabled={isLoading || !activeAccount}
                    >
                      {url.replace('https://', '').replace('http://', '')}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>غرف شائعة:</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_ROOMS.map((room, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    className="text-xs justify-start"
                    onClick={() => connectToRoom(`https://${room.url}`)}
                    disabled={isLoading || !activeAccount}
                  >
                    {room.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="search">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-search" className="text-sm">ابحث عن غرفة:</Label>
              <div className="flex gap-2">
                <Input
                  id="room-search"
                  placeholder="اكتب اسم الغرفة..."
                  className="flex-1"
                  disabled={isLoading || !activeAccount}
                />
                <Button 
                  disabled={isLoading || !activeAccount}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "بحث"
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                اكتب اسم الغرفة أو جزء منه للبحث عنها
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center py-8">
              <p className="text-sm text-gray-400">ستظهر نتائج البحث هنا</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-4" />
      
      <div className="text-sm">
        <p className="mb-2 font-medium">الحالة:</p>
        {!activeAccount ? (
          <p className="text-amber-600 text-sm">
            لم يتم تحديد حساب نشط
          </p>
        ) : !activeAccount.activeRoom ? (
          <p className="text-amber-600 text-sm">
            غير متصل بأي غرفة
          </p>
        ) : (
          <p className="text-green-600 text-sm flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-600 inline-block"></span>
            متصل بالغرفة: <span dir="ltr" className="font-mono">{activeAccount.activeRoom.replace('https://', '')}</span>
          </p>
        )}
      </div>
    </GlassCard>
  );
};

export default RoomConnector;
