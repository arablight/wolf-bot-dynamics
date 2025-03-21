
import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link2, ArrowRight } from 'lucide-react';

interface RoomConnectorProps {
  onConnect: (roomUrl: string) => void;
}

const RoomConnector = ({ onConnect }: RoomConnectorProps) => {
  const [roomUrl, setRoomUrl] = useState('');
  const [roomId, setRoomId] = useState('');
  
  const handleUrlConnect = () => {
    if (roomUrl) {
      onConnect(roomUrl);
    }
  };
  
  const handleIdConnect = () => {
    if (roomId) {
      onConnect(`https://wolf.live/g/${roomId}`);
    }
  };
  
  return (
    <GlassCard className="w-full">
      <h3 className="text-lg font-semibold mb-4">الاتصال بغرفة</h3>
      
      <Tabs defaultValue="url" className="mt-4">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="url">عن طريق الرابط</TabsTrigger>
          <TabsTrigger value="id">عن طريق المعرف</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-4">
          <div className="flex items-center">
            <Input
              value={roomUrl}
              onChange={(e) => setRoomUrl(e.target.value)}
              placeholder="أدخل رابط الغرفة"
              className="rounded-r-none focus-visible:ring-0 border-r-0"
            />
            <Button 
              className="rounded-l-none"
              onClick={handleUrlConnect}
              disabled={!roomUrl}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            <Link2 className="h-3 w-3 inline mr-1" />
            مثال: https://wolf.live/g/23456789
          </p>
        </TabsContent>
        
        <TabsContent value="id" className="space-y-4">
          <div className="flex items-center">
            <Input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="أدخل معرف الغرفة"
              className="rounded-r-none focus-visible:ring-0 border-r-0"
            />
            <Button 
              className="rounded-l-none"
              onClick={handleIdConnect}
              disabled={!roomId}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            مثال: 23456789
          </p>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default RoomConnector;
