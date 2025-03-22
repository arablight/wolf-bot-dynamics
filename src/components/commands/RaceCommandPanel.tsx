
import { useState } from 'react';
import { Car, Clock, Square, Play, AlertTriangle, Bot, Users } from 'lucide-react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OFFICIAL_BOT_IDS } from '@/api/wolfAPI';
import StatusIndicator from '../ui/StatusIndicator';

const RaceCommandPanel = () => {
  const [interval, setInterval] = useState(10);
  const [autoDetection, setAutoDetection] = useState(true);
  const [raceSystem, setRaceSystem] = useState('queue'); // 'queue' or 'train'
  
  const { 
    activeAccount,
    accounts,
    startRaceCommand,
    stopRaceCommand,
    isRaceCommandActive,
    isRaceAutoDetectionActive
  } = useAccounts();
  
  const { toast } = useToast();
  
  const participatingAccounts = accounts.filter(acc => acc.status === 'online');
  
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
    
    const success = startRaceCommand(interval, autoDetection, raceSystem);
    if (success) {
      toast({
        title: "تم تشغيل أمر السباق",
        description: autoDetection 
          ? "تم تفعيل الكشف التلقائي لأوامر السباق" 
          : raceSystem === 'queue'
            ? `سيتم إرسال أمر السباق للحسابات بالتتابع كل ${interval} دقائق و 40 ثانية`
            : "سيتم إرسال أمر السباق للحسابات بشكل متزامن مع فاصل زمني صغير",
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
              <StatusIndicator 
                status={isRaceCommandActive ? "online" : "offline"} 
                label={isRaceCommandActive ? "نشط" : "غير نشط"} 
                size="sm" 
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                id="race-command"
                value="!س جلد"
                readOnly
                className="w-full rounded bg-gray-50 p-2 text-sm"
              />
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">نظام السباق</h4>
              <RadioGroup value={raceSystem} onValueChange={setRaceSystem} className="flex flex-col space-y-2" disabled={isRaceCommandActive}>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <RadioGroupItem value="queue" id="race-queue" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="race-queue" className="font-medium">قائمة انتظار السباق</Label>
                    <p className="text-xs text-gray-500">
                      ترتيب الحسابات واحد تلو الآخر، كل حساب ينتظر الحساب السابق.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <RadioGroupItem value="train" id="race-train" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="race-train" className="font-medium">قطار السباق</Label>
                    <p className="text-xs text-gray-500">
                      جميع الحسابات تبدأ السباق في وقت واحد، مع فاصل زمني صغير بين الأوامر.
                    </p>
                  </div>
                </div>
              </RadioGroup>
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
              سيتم إرسال الأمر كل {interval} دقائق و 40 ثانية
            </span>
          </div>
        </CardContent>
      </Card>
      
      {participatingAccounts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-wolf-primary" />
                <h4 className="text-sm font-medium">الحسابات المشاركة ({participatingAccounts.length})</h4>
              </div>
              <div className="max-h-28 overflow-y-auto pr-2">
                {participatingAccounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                    <span className="text-sm">{account.username}</span>
                    <StatusIndicator status={account.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
