
import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Plus, Clock, Terminal, Save, Square, Settings, Database, AlertTriangle } from 'lucide-react';
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
  const { activeAccount, startRaceCommand, stopRaceCommand, isRaceCommandActive } = useAccounts();
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
    
    const success = startRaceCommand(interval);
    if (success) {
      toast({
        title: "تم تشغيل أمر السباق",
        description: `سيتم إرسال أمر السباق كل ${interval} دقائق و 10 ثوانٍ`,
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
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="race">أوامر السباق</TabsTrigger>
          <TabsTrigger value="custom">أوامر مخصصة</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="race" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="race-command" className="text-sm font-medium">أمر السباق</Label>
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
              </div>
            </CardContent>
          </Card>
          
          <Card>
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
                  disabled={isRaceCommandActive}
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
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="auto-replies" className="text-sm font-medium">الردود التلقائية</Label>
                </div>
                <Switch 
                  id="auto-replies" 
                  checked={autoReplies}
                  onCheckedChange={setAutoReplies}
                />
              </div>
              <p className="text-xs text-gray-500">
                تمكين الردود التلقائية سيسمح للبوت بالرد على الرسائل حسب القواعد المحددة
              </p>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="show-advanced" className="text-sm font-medium">إعدادات متقدمة</Label>
                </div>
                <Switch 
                  id="show-advanced" 
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
              </div>
              
              {showAdvanced && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-md mt-2">
                  <div className="space-y-1">
                    <Label htmlFor="timeout" className="text-xs font-medium">مهلة الاستجابة (بالثواني)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      defaultValue={30}
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="max-retries" className="text-xs font-medium">الحد الأقصى لإعادة المحاولات</Label>
                    <Input
                      id="max-retries"
                      type="number"
                      defaultValue={3}
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="log-level" className="text-xs font-medium">مستوى التسجيل</Label>
                    <Select defaultValue="info">
                      <SelectTrigger id="log-level" className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">تصحيح</SelectItem>
                        <SelectItem value="info">معلومات</SelectItem>
                        <SelectItem value="warn">تحذيرات</SelectItem>
                        <SelectItem value="error">أخطاء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Button className="w-full">
            حفظ الإعدادات
          </Button>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default CommandPanel;
