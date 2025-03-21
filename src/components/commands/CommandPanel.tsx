
import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Plus, Clock, Terminal, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const CommandPanel = () => {
  const [commandText, setCommandText] = useState('');
  const [isRaceCommand, setIsRaceCommand] = useState(false);
  const [interval, setInterval] = useState(10);
  
  return (
    <GlassCard className="w-full">
      <h3 className="text-lg font-semibold mb-4">لوحة الأوامر</h3>
      
      <Tabs defaultValue="race" className="mt-4">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="race">أوامر السباق</TabsTrigger>
          <TabsTrigger value="custom">أوامر مخصصة</TabsTrigger>
        </TabsList>
        
        <TabsContent value="race" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <Label htmlFor="race-command" className="text-sm font-medium">أمر السباق</Label>
              <div className="flex items-center gap-2">
                <Switch id="race-active" checked={isRaceCommand} onCheckedChange={setIsRaceCommand} />
                <Label htmlFor="race-active" className="text-xs">تفعيل</Label>
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
          
          <div className="space-y-4 pt-4 border-t border-gray-100">
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
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                سيتم إرسال الأمر كل {interval} دقائق و 10 ثوانٍ
              </span>
            </div>
          </div>
          
          <Button className="w-full gap-2 mt-2">
            <Play className="h-4 w-4" />
            <span>بدء تشغيل أمر السباق</span>
          </Button>
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
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="command-type" className="text-sm font-medium">نوع الأمر</Label>
              <Select defaultValue="public">
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
              <Select defaultValue="once">
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
          
          <div className="flex justify-between gap-2 mt-2">
            <Button variant="outline" className="gap-2 flex-1">
              <Plus className="h-4 w-4" />
              <span>إضافة أمر</span>
            </Button>
            <Button className="gap-2 flex-1">
              <Save className="h-4 w-4" />
              <span>حفظ</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default CommandPanel;
