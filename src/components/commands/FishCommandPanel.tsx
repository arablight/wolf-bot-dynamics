
import { useState } from 'react';
import { Fish, Play, AlertTriangle, Bot, Square, Clock, Users } from 'lucide-react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OFFICIAL_BOT_IDS } from '@/api/wolfAPI';
import StatusIndicator from '../ui/StatusIndicator';
import { Separator } from '@/components/ui/separator';

const FISHING_LOCATIONS = [
  { id: 'wolf_ocean', name: 'Wolf Ocean', command: '!صيد 3' },
  { id: 'black_lake', name: 'Black Lake', command: '!صيد بحيرة 3' },
  { id: 'atlantis_island', name: 'Atlantis Island', command: '!صيد جزيرة 3' },
  { id: 'small_gulf', name: 'Small Gulf', command: '!صيد خليج 3' },
  { id: 'amazon_forest', name: 'Amazon Forest', command: '!صيد امازون 3' },
  { id: 'tropical_forest', name: 'Tropical Forest', command: '!صيد غابة 3' },
  { id: 'hunters_horizon', name: "Hunter's Horizon", command: '!صيد افق 3' },
  { id: 'lerna_lake', name: 'Lerna Lake', command: '!صيد ليرنا 3' },
];

const FishCommandPanel = () => {
  const [autoDetect, setAutoDetect] = useState(true);
  const [fishingSystem, setFishingSystem] = useState('default'); // 'default' or 'bonus'
  const [location, setLocation] = useState('wolf_ocean');
  
  const { 
    activeAccount,
    accounts,
    startFishCommand,
    stopFishCommand,
    isFishCommandActive,
    isFishBonusActive,
    fishSystemType
  } = useAccounts();
  
  const { toast } = useToast();
  
  const participatingAccounts = accounts.filter(acc => acc.status === 'online');
  const selectedLocation = FISHING_LOCATIONS.find(loc => loc.id === location) || FISHING_LOCATIONS[0];
  
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
    
    const success = await startFishCommand(selectedLocation.command, fishingSystem);
    if (success) {
      toast({
        title: "تم تشغيل نظام الصيد",
        description: fishingSystem === 'bonus'
          ? "تم تفعيل نظام معززات الصيد، سيتم الانتقال تلقائيًا للغرف التي تحتوي على معززات"
          : `تم تفعيل نظام الصيد الأساسي في ${selectedLocation.name}`,
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Fish className="h-5 w-5 text-wolf-primary" />
        <h2 className="text-xl font-semibold">بوت الصيد (Fishing Bot)</h2>
        <StatusIndicator 
          status={(isFishCommandActive || isFishBonusActive) ? "online" : "offline"} 
          label={(isFishCommandActive || isFishBonusActive) 
            ? (fishSystemType === 'bonus' ? "معززات" : "أساسي") 
            : "غير نشط"} 
          size="sm" 
          className="mr-auto"
        />
      </div>
      
      <Separator className="my-4" />
      
      {!activeAccount && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-sm text-yellow-600">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>الرجاء تحديد حساب نشط أولاً للتحكم بالأوامر</p>
          </div>
        </div>
      )}
      
      {activeAccount && !activeAccount.activeRoom && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-sm text-yellow-600">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>يجب الاتصال بغرفة أولاً لتتمكن من استخدام الأوامر</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium mb-2">نظام الصيد</h4>
                <RadioGroup 
                  value={fishingSystem} 
                  onValueChange={setFishingSystem} 
                  className="flex flex-col space-y-3" 
                  disabled={isFishCommandActive || isFishBonusActive}
                >
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <RadioGroupItem value="default" id="fish-default" />
                    <div className="grid gap-1">
                      <Label htmlFor="fish-default" className="font-medium">نظام الصيد الأساسي</Label>
                      <p className="text-xs text-gray-500">
                        يعمل تلقائيًا كل 3630 ثانية في الموقع المحدد.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <RadioGroupItem value="bonus" id="fish-bonus" />
                    <div className="grid gap-1">
                      <Label htmlFor="fish-bonus" className="font-medium">نظام معززات الصيد</Label>
                      <p className="text-xs text-gray-500">
                        يتفاعل مع رسائل بوت الصيد الخاصة وينتقل للغرف التي تحتوي على معززات.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              {fishingSystem === 'default' && (
                <div className="mt-6">
                  <Label htmlFor="fishing-location" className="text-sm font-medium mb-2 block">
                    موقع الصيد
                  </Label>
                  <Select 
                    value={location} 
                    onValueChange={setLocation}
                    disabled={isFishCommandActive || isFishBonusActive}
                  >
                    <SelectTrigger id="fishing-location" className="w-full">
                      <SelectValue placeholder="اختر موقع الصيد" />
                    </SelectTrigger>
                    <SelectContent>
                      {FISHING_LOCATIONS.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name} - {loc.command}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {fishingSystem === 'bonus' && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2 space-x-reverse gap-2">
                    <Switch
                      id="fish-auto-detect"
                      checked={autoDetect}
                      onCheckedChange={setAutoDetect}
                      disabled={isFishCommandActive || isFishBonusActive}
                    />
                    <Label htmlFor="fish-auto-detect" className="text-sm">الكشف التلقائي عن رسائل بوت الصيد</Label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 pr-7">
                    عند تفعيل هذا الخيار، سيقوم البوت بالانتقال تلقائيًا إلى غرفة المعزز وإرسال أمر الصيد
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {fishingSystem === 'default' && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium mb-1">معلومات الأمر</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      value={selectedLocation.command}
                      readOnly
                      className="w-full rounded bg-gray-50 p-2 text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      سيتم إرسال الأمر كل 3630 ثانية (حوالي 60.5 دقيقة)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          {participatingAccounts.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-wolf-primary" />
                    <h4 className="text-sm font-medium">الحسابات المشاركة ({participatingAccounts.length})</h4>
                  </div>
                  <div className="max-h-36 overflow-y-auto pr-2">
                    {participatingAccounts.map(account => (
                      <div key={account.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                        <span className="text-sm">{account.username}</span>
                        <StatusIndicator status={account.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-600">
            <p className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              <span>معرّف بوت الصيد الرسمي: <strong>{OFFICIAL_BOT_IDS.FISH_BOT}</strong></span>
            </p>
            <p className="mt-1 text-xs">
              {fishingSystem === 'bonus' 
                ? "سيقوم البوت بالتفاعل تلقائيًا مع رسائل بوت الصيد والانتقال إلى غرف المعززات."
                : "سيقوم البوت بإرسال أمر الصيد تلقائيًا كل 60.5 دقيقة."}
            </p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium mb-4">مواقع الصيد المتاحة</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {FISHING_LOCATIONS.map(loc => (
                  <div key={loc.id} className="p-2 bg-gray-50 rounded-lg">
                    <div className="font-medium">{loc.name}</div>
                    <div className="text-gray-600 mt-1">{loc.command}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-6">
        {(isFishCommandActive || isFishBonusActive) ? (
          <Button 
            className="w-full gap-2 mt-2 bg-red-500 hover:bg-red-600"
            onClick={stopFishCommand}
          >
            <Square className="h-4 w-4" />
            <span>إيقاف نظام الصيد</span>
          </Button>
        ) : (
          <Button 
            className="w-full gap-2 mt-2"
            onClick={handleStartFishCommand}
            disabled={!activeAccount || !activeAccount.activeRoom}
          >
            <Play className="h-4 w-4" />
            <span>بدء تشغيل نظام الصيد</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default FishCommandPanel;
