
import { useState } from 'react';
import { Car, Clock, Square, Play, AlertTriangle, Bot } from 'lucide-react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { OFFICIAL_BOT_IDS } from '@/api/wolfAPI';

const RaceCommandPanel = () => {
  const [interval, setInterval] = useState(10);
  const [autoDetection, setAutoDetection] = useState(false);
  const { 
    activeAccount,
    startRaceCommand,
    stopRaceCommand,
    isRaceCommandActive,
    isRaceAutoDetectionActive
  } = useAccounts();
  const { toast } = useToast();
  
  const handleStartRaceCommand = () => {
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
    
    const success = startRaceCommand(interval, autoDetection);
    if (success) {
      toast({
        title: "تم تشغيل أمر السباق",
        description: autoDetection 
          ? "تم تفعيل الكشف التلقائي لأوامر السباق" 
          : `سيتم إرسال أمر السباق كل ${interval} دقائق و 10 ثوانٍ`,
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
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-wolf-primary" />
                <Label htmlFor="race-command" className="text-sm font-medium">أمر السباق</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="race-active" checked={isRaceCommandActive} disabled={true} />
                <Label htmlFor="race-active" className="text-xs">
                  {isRaceCommandActive ? 'نشط' : 'غير نشط'}
                </Label>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                id="race-command"
                value="!س جلد"
                readOnly
                className="w-full rounded bg-gray-50 p-2 text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse gap-2 mt-3">
              <Switch 
                id="auto-detection" 
                checked={autoDetection}
                onCheckedChange={setAutoDetection}
                disabled={isRaceCommandActive}
              />
              <Label htmlFor="auto-detection" className="text-sm">الكشف التلقائي عن رسائل بوت السباق</Label>
            </div>
            <p className="text-xs text-gray-500 pr-7">
              عند تفعيل هذا الخيار، سيقوم البوت بإرسال أمر السباق تلقائيًا عند استعادة طاقة الحيوان وانتهاء الجولة
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className={autoDetection ? "opacity-50" : ""}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">الفاصل الزمني (دقائق)</Label>
              <span className="text-sm text-gray-600">{interval} دقائق</span>
            </div>
            <Slider
              value={[interval]}
              min={1}
              max={30}
              step={1}
              onValueChange={(values) => setInterval(values[0])}
              disabled={isRaceCommandActive || autoDetection}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              سيتم إرسال الأمر كل {interval} دقائق و 10 ثوانٍ
            </span>
          </div>
        </CardContent>
      </Card>
      
      {isRaceCommandActive ? (
        <Button 
          className="w-full gap-2 mt-2 bg-red-500 hover:bg-red-600"
          onClick={stopRaceCommand}
        >
          <Square className="h-4 w-4" />
          <span>إيقاف أمر السباق</span>
        </Button>
      ) : (
        <Button 
          className="w-full gap-2 mt-2"
          onClick={handleStartRaceCommand}
          disabled={!activeAccount || !activeAccount.activeRoom}
        >
          <Play className="h-4 w-4" />
          <span>بدء تشغيل أمر السباق</span>
        </Button>
      )}
      
      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-600 mt-4">
        <p className="flex items-center gap-1">
          <Bot className="h-4 w-4" />
          <span>معرّف بوت السباق الرسمي: <strong>{OFFICIAL_BOT_IDS.RACE_BOT}</strong></span>
        </p>
        <p className="mt-1 text-xs">
          سيقوم البوت بالتفاعل تلقائيًا مع الرسائل الخاصة من بوت السباق عند تفعيل الكشف التلقائي.
        </p>
      </div>
    </div>
  );
};

export default RaceCommandPanel;
