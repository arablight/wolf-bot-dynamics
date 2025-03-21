
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';

interface AddAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAccount: (account: { username: string; password: string; }) => void;
}

const AddAccountModal = ({ open, onOpenChange, onAddAccount }: AddAccountModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    
    onAddAccount({ username, password });
    setUsername('');
    setPassword('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">إضافة حساب جديد</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">إدخال يدوي</TabsTrigger>
            <TabsTrigger value="import">استيراد من ملف</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="transition-all duration-200"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm p-2 bg-red-50 rounded">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}
              
              <DialogFooter className="mt-6 flex sm:justify-between">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  إلغاء
                </Button>
                <Button type="submit">إضافة الحساب</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="import">
            <div className="py-4">
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <p className="text-sm text-gray-500 mb-2">قم بإرفاق ملف استيراد الحسابات</p>
                <Button variant="outline" size="sm">استيراد ملف</Button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                صيغة مدعومة: ملف نصي (.txt) يحتوي على اسم المستخدم وكلمة المرور مفصولة بـ (:)
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;
