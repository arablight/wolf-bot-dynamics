
import { useState } from 'react';
import { Puzzle, Play, AlertTriangle, Bot } from 'lucide-react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { OFFICIAL_BOT_IDS, GUESS_CATEGORIES } from '@/api/wolfAPI';

const GuessCommandPanel = () => {
  const [guessCategory, setGuessCategory] = useState('mixed');
  const [responseDelay, setResponseDelay] = useState(3);
  const [useAI, setUseAI] = useState(true);
  const { 
    activeAccount, 
    startGuessCommand,
    guessCategories
  } = useAccounts();
  const { toast } = useToast();
  
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
              <Switch id="guess-ai" checked={useAI} onCheckedChange={setUseAI} />
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
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">الفاصل الزمني بين التخمينات (ثوانٍ)</Label>
              <span className="text-sm text-gray-600">{responseDelay} ثوانٍ</span>
            </div>
            <Slider
              value={[responseDelay]}
              min={1}
              max={10}
              step={1}
              onValueChange={(values) => setResponseDelay(values[0])}
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
        <p className="flex items-center gap-1">
          <Bot className="h-4 w-4" />
          <span>معرّف بوت التخمين الرسمي: <strong>{OFFICIAL_BOT_IDS.GUESS_BOT}</strong></span>
        </p>
        <p className="mt-1 text-xs">
          سيقوم البوت بالتفاعل تلقائيًا مع صور التخمين ومحاولة التعرف عليها.
        </p>
      </div>
    </div>
  );
};

export default GuessCommandPanel;
