
import { useState } from 'react';
import { Fish, Play, AlertTriangle, Bot } from 'lucide-react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { OFFICIAL_BOT_IDS } from '@/api/wolfAPI';

const FishCommandPanel = () => {
  const [autoDetect, setAutoDetect] = useState(true);
  const { 
    activeAccount, 
    startFishCommand
  } = useAccounts();
  const { toast } = useToast();
  
  const handleStartFishCommand = async () => {
    if (!activeAccount) {
      toast({
        title: "تحذير",
        description: "الرجاء تحديد حساب نشط أولاً",
        variant: "destructive"
      });
      return;
    }
    
    if (!activeAccount.activeRoom) {
      toast({
        title: "تحذير",
        description: "الرجاء الاتصال بغرفة أولاً",
        variant: "destructive"
      });
      return;
    }
    
    const success = await startFishCommand(3);
    if (success) {
      toast({
        title: "تم إرسال أمر الصيد",
        description: `تم إرسال الأمر "!صيد 3" بنجاح`,
      });
    }
  };

  return (
    <div className="space-y-4">
      {!activeAccount && (
        <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-sm text-yellow-600">
          <p>الرجاء تحديد حساب نشط أولاً للتحكم بالأوامر</p>
        </div>
      )}
      
      {activeAccount && !activeAccount.activeRoom && (
        <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-sm text-yellow-600">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <p>يجب الاتصال بغرفة أولاً لتتمكن من استخدام الأوامر</p>
          </div>
        </div>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Fish className="h-4 w-4 text-wolf-primary" />
              <Label className="text-sm font-medium">أمر الصيد</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                value="!صيد 3"
                readOnly
                className="w-full rounded bg-gray-50 p-2 text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse gap-2 mt-3">
              <Switch id="fish-auto-detect" checked={autoDetect} onCheckedChange={setAutoDetect} />
              <Label htmlFor="fish-auto-detect" className="text-sm">الكشف التلقائي عن رسائل بوت الصيد</Label>
            </div>
            <p className="text-xs text-gray-500 pr-7">
              عند تفعيل هذا الخيار، سيقوم البوت بالانتقال تلقائيًا إلى غرفة الطعم وإرسال أمر الصيد
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Button 
        className="w-full gap-2 mt-2"
        onClick={handleStartFishCommand}
        disabled={!activeAccount || !activeAccount.activeRoom}
      >
        <Play className="h-4 w-4" />
        <span>إرسال أمر الصيد</span>
      </Button>
      
      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-600 mt-4">
        <p className="flex items-center gap-1">
          <Bot className="h-4 w-4" />
          <span>معرّف بوت الصيد الرسمي: <strong>{OFFICIAL_BOT_IDS.FISH_BOT}</strong></span>
        </p>
        <p className="mt-1 text-xs">
          سيقوم البوت بالتفاعل تلقائيًا مع رسائل بوت الصيد والانتقال إلى غرف الطعم.
        </p>
      </div>
    </div>
  );
};

export default FishCommandPanel;
