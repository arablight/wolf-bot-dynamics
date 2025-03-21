
import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, Plus, Clock, Terminal, Save, Square, Settings, Database, AlertTriangle,
  Fish, MessageSquare, Car, Puzzle, Bot
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CommandPanel = () => {
  const [commandText, setCommandText] = useState('');
  const [interval, setInterval] = useState(10);
  const [commandType, setCommandType] = useState('public');
  const [commandRepeat, setCommandRepeat] = useState('once');
  const [autoReplies, setAutoReplies] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoDetection, setAutoDetection] = useState(false);
  const [guessCategory, setGuessCategory] = useState('mixed');
  const [fishBaitLevel, setFishBaitLevel] = useState(3);
  const { 
    activeAccount, 
    startRaceCommand, 
    stopRaceCommand, 
    isRaceCommandActive,
    isRaceAutoDetectionActive,
    startGuessCommand,
    startFishCommand,
    guessCategories
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
  
  const handleStartGuessCommand = async () => {
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
    
    const selectedCategory = guessCategories.find(c => c.id === guessCategory);
    
    const success = await startGuessCommand(guessCategory);
    if (success) {
      toast({
        title: "تم إرسال أمر التخمين",
        description: `تم إرسال الأمر "${selectedCategory?.command}" بنجاح`,
      });
    }
  };
  
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
    
    const success = await startFishCommand(fishBaitLevel);
    if (success) {
      toast({
        title: "تم إرسال أمر الصيد",
        description: `تم إرسال الأمر "!صيد ${fishBaitLevel}" بنجاح`,
      });
    }
  };
  
  const handleSendCustomCommand = () => {
    if (!commandText.trim()) {
      toast({
        title: "تحذير",
        description: "الرجاء إدخال أمر مخصص أولاً",
        variant: "destructive"
      });
      return;
    }
    
    if (!activeAccount || !activeAccount.activeRoom) {
      toast({
        title: "تحذير",
        description: "الرجاء تحديد حساب نشط والاتصال بغرفة أولاً",
        variant: "destructive"
      });
      return;
    }
    
    // سيتم تنفيذ الأمر هنا لاحقاً
    
    toast({
      title: "تم إرسال الأمر",
      description: `تم إرسال الأمر "${commandText}" بنجاح`,
    });
    
    if (commandRepeat === 'repeat') {
      toast({
        title: "تنبيه",
        description: `سيتم تكرار الأمر كل ${interval} دقائق`,
      });
    }
  };
  
  const handleAddCommand = () => {
    if (!commandText.trim()) {
      toast({
        title: "تحذير",
        description: "الرجاء إدخال أمر مخصص أولاً",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الأمر المخصص في قائمة الأوامر",
    });
  };
  
  return (
    <GlassCard className="w-full">
      <h3 className="text-lg font-semibold mb-4">لوحة الأوامر</h3>
      
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
      
      <Tabs defaultValue="race" className="mt-4">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="race" className="flex items-center gap-1">
            <Car className="h-3 w-3" />
            <span className="hidden sm:inline">سباق</span>
          </TabsTrigger>
          <TabsTrigger value="guess" className="flex items-center gap-1">
            <Puzzle className="h-3 w-3" />
            <span className="hidden sm:inline">خمن</span>
          </TabsTrigger>
          <TabsTrigger value="fish" className="flex items-center gap-1">
            <Fish className="h-3 w-3" />
            <span className="hidden sm:inline">صيد</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-1">
            <Terminal className="h-3 w-3" />
            <span className="hidden sm:inline">مخصص</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="race" className="space-y-4">
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
                  <Input
                    id="race-command"
                    value="!س جلد"
                    readOnly
                    className="rounded bg-gray-50"
                  />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Terminal className="h-4 w-4" />
                  </Button>
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
            <p className="text-xs">
              معرّف بوت السباق الرسمي: <strong>80277459</strong>
              <br />
              سيقوم البوت بالتفاعل تلقائيًا مع الرسائل الخاصة من بوت السباق عند تفعيل الكشف التلقائي.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="guess" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Puzzle className="h-4 w-4 text-wolf-primary" />
                  <Label className="text-sm font-medium">أمر التخمين</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guess-category" className="text-sm">اختر فئة التخمين:</Label>
                  <Select value={guessCategory} onValueChange={setGuessCategory}>
                    <SelectTrigger id="guess-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {guessCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} - {category.command}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse gap-2 mt-3">
                  <Switch id="guess-ai" defaultChecked />
                  <Label htmlFor="guess-ai" className="text-sm">استخدام الذكاء الاصطناعي للتخمين</Label>
                </div>
                <p className="text-xs text-gray-500 pr-7">
                  سيحاول البوت تخمين الصور باستخدام الذكاء الاصطناعي وإرسال الإجابات تلقائيًا
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">الفاصل الزمني بين التخمينات (ثوانٍ)</Label>
                <Slider
                  value={[3]}
                  min={1}
                  max={10}
                  step={1}
                  disabled={false}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>سريع (1 ثانية)</span>
                  <span>بطيء (10 ثوانٍ)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            className="w-full gap-2 mt-2"
            onClick={handleStartGuessCommand}
            disabled={!activeAccount || !activeAccount.activeRoom}
          >
            <Play className="h-4 w-4" />
            <span>بدء أمر التخمين</span>
          </Button>
          
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-600 mt-4">
            <p className="text-xs">
              معرّف بوت التخمين الرسمي: <strong>79216477</strong>
              <br />
              سيقوم البوت بالتفاعل تلقائيًا مع صور التخمين ومحاولة التعرف عليها.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="fish" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Fish className="h-4 w-4 text-wolf-primary" />
                  <Label className="text-sm font-medium">أمر الصيد</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fish-bait" className="text-sm">مستوى الطعم:</Label>
                  <Select value={fishBaitLevel.toString()} onValueChange={value => setFishBaitLevel(parseInt(value))}>
                    <SelectTrigger id="fish-bait">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">مستوى 1</SelectItem>
                      <SelectItem value="2">مستوى 2</SelectItem>
                      <SelectItem value="3">مستوى 3</SelectItem>
                      <SelectItem value="4">مستوى 4</SelectItem>
                      <SelectItem value="5">مستوى 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse gap-2 mt-3">
                  <Switch id="fish-auto-detect" defaultChecked />
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
            <p className="text-xs">
              معرّف بوت الصيد الرسمي: <strong>76305584</strong>
              <br />
              سيقوم البوت بالتفاعل تلقائيًا مع رسائل بوت الصيد والانتقال إلى غرف الطعم.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-command" className="text-sm font-medium">الأمر المخصص</Label>
            <Textarea
              id="custom-command"
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              placeholder="أدخل الأمر المخصص هنا..."
              className="min-h-[100px] resize-none"
              disabled={!activeAccount}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="command-type" className="text-sm font-medium">نوع الأمر</Label>
              <Select 
                value={commandType} 
                onValueChange={setCommandType}
                disabled={!activeAccount}
              >
                <SelectTrigger id="command-type">
                  <SelectValue placeholder="اختر نوع الأمر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">رسالة عامة</SelectItem>
                  <SelectItem value="private">رسالة خاصة</SelectItem>
                  <SelectItem value="response">رد تلقائي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="command-interval" className="text-sm font-medium">التكرار</Label>
              <Select 
                value={commandRepeat} 
                onValueChange={setCommandRepeat}
                disabled={!activeAccount}
              >
                <SelectTrigger id="command-interval">
                  <SelectValue placeholder="اختر نوع التكرار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">مرة واحدة</SelectItem>
                  <SelectItem value="repeat">تكرار كل فترة</SelectItem>
                  <SelectItem value="condition">عند تحقق شرط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {commandRepeat === 'repeat' && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <Label htmlFor="repeat-interval" className="text-sm font-medium">الفاصل الزمني (دقائق)</Label>
                <span className="text-sm text-gray-600">{interval} دقائق</span>
              </div>
              <Slider
                id="repeat-interval"
                value={[interval]}
                min={1}
                max={30}
                step={1}
                onValueChange={(values) => setInterval(values[0])}
              />
            </div>
          )}
          
          {commandRepeat === 'condition' && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-md">
              <Label htmlFor="condition-text" className="text-sm font-medium">نص الشرط</Label>
              <Input
                id="condition-text"
                placeholder="أدخل النص الذي يجب أن يظهر لتنفيذ الأمر"
              />
              <p className="text-xs text-gray-500 mt-1">
                سيتم تنفيذ الأمر عندما يظهر هذا النص في الدردشة
              </p>
            </div>
          )}
          
          <div className="flex justify-between gap-2 mt-2">
            <Button 
              variant="outline" 
              className="gap-2 flex-1"
              onClick={handleAddCommand}
              disabled={!activeAccount || !commandText.trim()}
            >
              <Plus className="h-4 w-4" />
              <span>حفظ الأمر</span>
            </Button>
            <Button 
              className="gap-2 flex-1"
              onClick={handleSendCustomCommand}
              disabled={!activeAccount || !activeAccount.activeRoom || !commandText.trim()}
            >
              <Terminal className="h-4 w-4" />
              <span>إرسال</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default CommandPanel;
