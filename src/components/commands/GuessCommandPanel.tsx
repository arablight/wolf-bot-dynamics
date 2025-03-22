
import { useState } from 'react';
import { Puzzle, Play, AlertTriangle, Bot, Square, Clock, Users } from 'lucide-react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OFFICIAL_BOT_IDS, GUESS_CATEGORIES } from '@/api/wolfAPI';
import StatusIndicator from '../ui/StatusIndicator';

const GuessCommandPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState('mixed');
  const [autoAnswer, setAutoAnswer] = useState(true);
  const [responseDelay, setResponseDelay] = useState(1);
  
  const { 
    activeAccount,
    accounts,
    startGuessCommand,
    stopGuessCommand,
    isGuessCommandActive,
    guessCategories
  } = useAccounts();
  
  const { toast } = useToast();
  
  const participatingAccounts = accounts.filter(acc => acc.status === 'online');
  const selectedCategoryObject = guessCategories.find(cat => cat.id === selectedCategory) || guessCategories[0];
  
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
    
    const success = await startGuessCommand(selectedCategory, autoAnswer, responseDelay);
    if (success) {
      toast({
        title: "تم تشغيل أمر التخمين",
        description: `تم إرسال أمر التخمين "${selectedCategoryObject.command}" بنجاح${autoAnswer ? ' وتفعيل التخمين التلقائي' : ''}`,
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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Puzzle className="h-4 w-4 text-wolf-primary" />
                <Label className="text-sm font-medium">أمر التخمين</Label>
              </div>
              <StatusIndicator 
                status={isGuessCommandActive ? "online" : "offline"} 
                label={isGuessCommandActive ? "نشط" : "غير نشط"} 
                size="sm" 
              />
            </div>
            
            <div className="mt-3">
              <Label htmlFor="guess-category" className="text-sm font-medium mb-2 block">
                فئة التخمين
              </Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                disabled={isGuessCommandActive}
              >
                <SelectTrigger id="guess-category" className="w-full">
                  <SelectValue placeholder="اختر فئة التخمين" />
                </SelectTrigger>
                <SelectContent>
                  {guessCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} - {cat.command}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 my-3">
              <input
                value={selectedCategoryObject.command}
                readOnly
                className="w-full rounded bg-gray-50 p-2 text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse gap-2 mt-3">
              <Switch
                id="auto-answer"
                checked={autoAnswer}
                onCheckedChange={setAutoAnswer}
                disabled={isGuessCommandActive}
              />
              <Label htmlFor="auto-answer" className="text-sm">التخمين التلقائي للصور</Label>
            </div>
            <p className="text-xs text-gray-500 pr-7">
              عند تفعيل هذا الخيار، سيقوم البوت بمحاولة تخمين الصور المعروضة تلقائيًا
            </p>
          </div>
        </CardContent>
      </Card>
      
      {autoAnswer && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">سرعة الاستجابة (ثوانٍ)</Label>
                <span className="text-sm text-gray-600">{responseDelay} ثانية</span>
              </div>
              <Slider
                value={[responseDelay]}
                min={1}
                max={5}
                step={0.5}
                onValueChange={(values) => setResponseDelay(values[0])}
                disabled={isGuessCommandActive}
              />
              <p className="text-xs text-gray-500 mt-1">
                فترة الانتظار قبل محاولة التخمين، للمساعدة في منع التقارير
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
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
      
      {isGuessCommandActive ? (
        <Button 
          className="w-full gap-2 mt-2 bg-red-500 hover:bg-red-600"
          onClick={stopGuessCommand}
        >
          <Square className="h-4 w-4" />
          <span>إيقاف أمر التخمين</span>
        </Button>
      ) : (
        <Button 
          className="w-full gap-2 mt-2"
          onClick={handleStartGuessCommand}
          disabled={!activeAccount || !activeAccount.activeRoom}
        >
          <Play className="h-4 w-4" />
          <span>بدء تشغيل أمر التخمين</span>
        </Button>
      )}
      
      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-600 mt-4">
        <p className="flex items-center gap-1">
          <Bot className="h-4 w-4" />
          <span>معرّف بوت التخمين الرسمي: <strong>{OFFICIAL_BOT_IDS.GUESS_BOT}</strong></span>
        </p>
        <p className="mt-1 text-xs">
          سيقوم البوت بالتفاعل تلقائيًا مع صور بوت التخمين الرسمي ومحاولة تخمينها.
        </p>
      </div>
    </div>
  );
};

export default GuessCommandPanel;
