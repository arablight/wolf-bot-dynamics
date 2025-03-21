
import { useState, useEffect } from 'react';
import { PrivateMessage } from '@/api/wolfAPI';
import { useAccounts } from '@/contexts/AccountContext';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bot, Fish, Car, Puzzle, Clock, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OFFICIAL_BOT_IDS } from '@/api/wolfAPI';

const getBotIcon = (senderId: string) => {
  switch (senderId) {
    case OFFICIAL_BOT_IDS.RACE_BOT:
      return <Car className="h-4 w-4 text-blue-500" />;
    case OFFICIAL_BOT_IDS.GUESS_BOT:
      return <Puzzle className="h-4 w-4 text-purple-500" />;
    case OFFICIAL_BOT_IDS.FISH_BOT:
      return <Fish className="h-4 w-4 text-green-500" />;
    default:
      return <Bot className="h-4 w-4 text-gray-500" />;
  }
};

const getBotName = (senderId: string) => {
  switch (senderId) {
    case OFFICIAL_BOT_IDS.RACE_BOT:
      return "بوت سباق";
    case OFFICIAL_BOT_IDS.GUESS_BOT:
      return "بوت خمن";
    case OFFICIAL_BOT_IDS.FISH_BOT:
      return "بوت صيد";
    default:
      return "بوت غير معروف";
  }
};

const PrivateMessages = () => {
  const { getPrivateMessages, activeAccount } = useAccounts();
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // تحديث الرسائل عند تغيير الحساب النشط
    if (activeAccount) {
      const privateMessages = getPrivateMessages();
      setMessages(privateMessages);
      setUnreadCount(privateMessages.filter(msg => !msg.read).length);
    } else {
      setMessages([]);
      setUnreadCount(0);
    }
  }, [activeAccount, getPrivateMessages]);
  
  useEffect(() => {
    const handleNewMessages = () => {
      if (activeAccount) {
        const privateMessages = getPrivateMessages();
        setMessages(privateMessages);
        setUnreadCount(privateMessages.filter(msg => !msg.read).length);
      }
    };
    
    // الاستماع لحدث وصول رسائل جديدة
    window.addEventListener('new-private-messages', handleNewMessages);
    
    // تحديث الرسائل بشكل دوري كل 10 ثوانٍ
    const interval = setInterval(handleNewMessages, 10000);
    
    return () => {
      window.removeEventListener('new-private-messages', handleNewMessages);
      clearInterval(interval);
    };
  }, [activeAccount, getPrivateMessages]);
  
  if (!activeAccount) {
    return null;
  }
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <GlassCard className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-wolf-primary" />
          <h3 className="text-lg font-semibold">الرسائل الخاصة</h3>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="bg-wolf-primary text-white">
            {unreadCount} جديدة
          </Badge>
        )}
      </div>
      
      <ScrollArea className="h-64 overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">لا توجد رسائل خاصة</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-3 border rounded-lg ${message.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getBotIcon(message.senderId)}
                    <span className="font-semibold text-sm">{getBotName(message.senderId)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(message.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm mb-2">{message.content}</p>
                
                {message.containsRoomLink && (
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                    >
                      الانتقال إلى الغرفة
                    </Button>
                  </div>
                )}
                
                {!message.read && (
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-gray-500 flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      <span>تحديد كمقروءة</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </GlassCard>
  );
};

export default PrivateMessages;
