
import { useState } from 'react';
import { Terminal, Plus } from 'lucide-react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const CustomCommandPanel = () => {
  const [commandText, setCommandText] = useState('');
  const [interval, setInterval] = useState(10);
  const [commandType, setCommandType] = useState('public');
  const [commandRepeat, setCommandRepeat] = useState('once');
  const { activeAccount, sendMessage } = useAccounts();
  const { toast } = useToast();
  
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
    
    // إرسال الأمر المخصص
    sendMessage(commandText).then(success => {
      if (success) {
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
      }
    });
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
    <div className="space-y-4">
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
    </div>
  );
};

export default CustomCommandPanel;
