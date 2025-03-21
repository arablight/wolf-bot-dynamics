
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export type BotRule = {
  id: string;
  name: string;
  condition: string;
  response: string;
  isActive: boolean;
  usesAI: boolean;
  triggerWords: string[];
  botType: string;
};

const SAMPLE_RULES: BotRule[] = [
  {
    id: '1',
    name: 'الرد على بوت التخمين',
    condition: 'خمن اسم صاحب/ة الصورة',
    response: '{name} طبعا واضح!',
    isActive: true,
    usesAI: false,
    triggerWords: ['صورة', 'خمن'],
    botType: 'guess'
  },
  {
    id: '2',
    name: 'الرد على بوت السباق',
    condition: 'بدأت جولة جديدة من لعبة سباق الكلمات',
    response: '!س كلمة',
    isActive: true,
    usesAI: false,
    triggerWords: ['سباق', 'جولة'],
    botType: 'race'
  }
];

const BotRules = () => {
  const [rules, setRules] = useState<BotRule[]>(SAMPLE_RULES);
  const [editingRule, setEditingRule] = useState<BotRule | null>(null);
  const [newTriggerWord, setNewTriggerWord] = useState('');
  const { toast } = useToast();

  const handleEditRule = (rule: BotRule) => {
    setEditingRule({...rule});
  };

  const handleSaveRule = () => {
    if (!editingRule) return;
    
    const updatedRules = rules.map(rule => 
      rule.id === editingRule.id ? editingRule : rule
    );
    
    setRules(updatedRules);
    setEditingRule(null);
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ القاعدة بنجاح",
    });
  };

  const handleAddRule = () => {
    const newRule: BotRule = {
      id: Date.now().toString(),
      name: 'قاعدة جديدة',
      condition: '',
      response: '',
      isActive: true,
      usesAI: false,
      triggerWords: [],
      botType: 'general'
    };
    
    setRules([...rules, newRule]);
    setEditingRule(newRule);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    if (editingRule && editingRule.id === id) {
      setEditingRule(null);
    }
    
    toast({
      title: "تم الحذف",
      description: "تم حذف القاعدة بنجاح",
    });
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? {...rule, isActive: !rule.isActive} : rule
    ));
  };

  const handleAddTriggerWord = () => {
    if (!editingRule || !newTriggerWord.trim()) return;
    
    setEditingRule({
      ...editingRule,
      triggerWords: [...editingRule.triggerWords, newTriggerWord.trim()]
    });
    
    setNewTriggerWord('');
  };

  const handleRemoveTriggerWord = (word: string) => {
    if (!editingRule) return;
    
    setEditingRule({
      ...editingRule,
      triggerWords: editingRule.triggerWords.filter(w => w !== word)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">قواعد البوت</h3>
        <Button onClick={handleAddRule} className="gap-1">
          <Plus className="h-4 w-4" />
          <span>إضافة قاعدة</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* قائمة القواعد */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>القواعد المتاحة</CardTitle>
            <CardDescription>اضغط على قاعدة لتعديلها</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {rules.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>لا توجد قواعد مضافة</p>
              </div>
            ) : (
              rules.map(rule => (
                <div 
                  key={rule.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    editingRule?.id === rule.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'
                  } ${!rule.isActive ? 'opacity-60' : ''}`}
                  onClick={() => handleEditRule(rule)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rule.condition}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={rule.isActive}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                        onClick={e => e.stopPropagation()}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRule(rule.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {rule.botType && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {rule.botType === 'race' ? 'سباق' : 
                         rule.botType === 'guess' ? 'تخمين' : 'عام'}
                      </span>
                    )}
                    {rule.usesAI && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center">
                        <Brain className="h-3 w-3 mr-1" />
                        ذكاء اصطناعي
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        
        {/* تفاصيل تحرير القاعدة */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>تفاصيل القاعدة</CardTitle>
            <CardDescription>
              {editingRule ? 'قم بتعديل تفاصيل القاعدة' : 'اختر قاعدة من القائمة للتعديل'}
            </CardDescription>
          </CardHeader>
          {editingRule ? (
            <>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">اسم القاعدة</Label>
                  <Input
                    id="rule-name"
                    value={editingRule.name}
                    onChange={e => setEditingRule({...editingRule, name: e.target.value})}
                    placeholder="أدخل اسماً وصفياً للقاعدة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rule-type">نوع البوت</Label>
                  <Select 
                    value={editingRule.botType}
                    onValueChange={value => setEditingRule({...editingRule, botType: value})}
                  >
                    <SelectTrigger id="rule-type">
                      <SelectValue placeholder="اختر نوع البوت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">عام</SelectItem>
                      <SelectItem value="race">سباق</SelectItem>
                      <SelectItem value="guess">تخمين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rule-condition">الشرط</Label>
                  <Textarea
                    id="rule-condition"
                    value={editingRule.condition}
                    onChange={e => setEditingRule({...editingRule, condition: e.target.value})}
                    placeholder="أدخل النص أو الكلمة التي تريد التفاعل معها"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trigger-words">الكلمات المفتاحية</Label>
                    <div className="flex items-center">
                      <Input
                        id="new-trigger-word"
                        value={newTriggerWord}
                        onChange={e => setNewTriggerWord(e.target.value)}
                        placeholder="كلمة جديدة"
                        className="h-8 text-sm w-32 mr-2"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleAddTriggerWord}
                      >
                        إضافة
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[60px]">
                    {editingRule.triggerWords.length === 0 ? (
                      <span className="text-gray-400 text-sm">لا توجد كلمات مفتاحية</span>
                    ) : (
                      editingRule.triggerWords.map(word => (
                        <div key={word} className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm">
                          <span>{word}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 ml-1" 
                            onClick={() => handleRemoveTriggerWord(word)}
                          >
                            <Trash2 className="h-3 w-3 text-gray-500" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="rule-response">الرد</Label>
                  <Textarea
                    id="rule-response"
                    value={editingRule.response}
                    onChange={e => setEditingRule({...editingRule, response: e.target.value})}
                    placeholder="أدخل النص الذي سيتم إرساله كرد"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500">يمكنك استخدام {'{name}'} لإدراج اسم المستخدم</p>
                </div>
                
                <div className="flex items-center space-x-2 gap-2">
                  <Checkbox 
                    id="use-ai"
                    checked={editingRule.usesAI}
                    onCheckedChange={(checked) => 
                      setEditingRule({...editingRule, usesAI: checked === true})
                    }
                  />
                  <Label htmlFor="use-ai" className="cursor-pointer">استخدام الذكاء الاصطناعي في الرد</Label>
                </div>
              </CardContent>
              
              <CardFooter className="justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingRule(null)}>إلغاء</Button>
                <Button onClick={handleSaveRule} className="gap-1">
                  <Save className="h-4 w-4" />
                  <span>حفظ القاعدة</span>
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent>
              <div className="text-center py-12 text-gray-400">
                <p>اختر قاعدة من القائمة للتعديل</p>
                <p>أو</p>
                <Button 
                  variant="outline" 
                  onClick={handleAddRule} 
                  className="mt-2 gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة قاعدة جديدة</span>
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BotRules;
