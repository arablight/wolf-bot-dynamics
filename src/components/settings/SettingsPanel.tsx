
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Bell, 
  Bot, 
  Clipboard, 
  Clock, 
  Save, 
  Shield, 
  Volume2 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SettingsPanel = () => {
  const [errorNotifications, setErrorNotifications] = useState(true);
  const [activityLogging, setActivityLogging] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [logRetention, setLogRetention] = useState(7);
  const [commandDelay, setCommandDelay] = useState(3);
  
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الإعدادات بنجاح",
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">إعدادات التطبيق</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-wolf-primary" />
            <span>إعدادات الإشعارات</span>
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="error-notifications" className="font-medium">تنبيهات الأخطاء</Label>
                <p className="text-sm text-gray-500 mt-1">عرض إشعارات عند حدوث أخطاء في عمل البوتات</p>
              </div>
              <Switch 
                id="error-notifications" 
                checked={errorNotifications} 
                onCheckedChange={setErrorNotifications} 
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-alerts" className="font-medium">التنبيهات الصوتية</Label>
                <p className="text-sm text-gray-500 mt-1">تشغيل أصوات تنبيه عند حدوث أحداث مهمة</p>
              </div>
              <Switch 
                id="sound-alerts" 
                checked={soundAlerts} 
                onCheckedChange={setSoundAlerts} 
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="activity-logging" className="font-medium">سجل النشاط</Label>
                <p className="text-sm text-gray-500 mt-1">تسجيل جميع الأنشطة والأحداث في التطبيق</p>
              </div>
              <Switch 
                id="activity-logging" 
                checked={activityLogging} 
                onCheckedChange={setActivityLogging} 
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">مدة الاحتفاظ بالسجلات (أيام)</Label>
                <span className="text-sm">{logRetention} أيام</span>
              </div>
              <Slider
                value={[logRetention]}
                min={1}
                max={30}
                step={1}
                onValueChange={(values) => setLogRetention(values[0])}
              />
              <p className="text-xs text-gray-500">
                سيتم حذف السجلات القديمة تلقائيًا بعد {logRetention} يوم
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-wolf-primary" />
            <span>إعدادات البوتات</span>
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-reconnect" className="font-medium">إعادة الاتصال التلقائي</Label>
                <p className="text-sm text-gray-500 mt-1">محاولة إعادة الاتصال عند انقطاع الاتصال</p>
              </div>
              <Switch 
                id="auto-reconnect" 
                checked={autoReconnect} 
                onCheckedChange={setAutoReconnect} 
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">تأخير إرسال الأوامر (ثواني)</Label>
                <span className="text-sm">{commandDelay} ثواني</span>
              </div>
              <Slider
                value={[commandDelay]}
                min={1}
                max={10}
                step={1}
                onValueChange={(values) => setCommandDelay(values[0])}
              />
              <p className="text-xs text-gray-500">
                فترة التأخير بين إرسال الأوامر المتتالية لتجنب حظر الحساب
              </p>
            </div>
            
            <Separator />
            
            <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">تنبيه أمان</p>
                <p className="mt-1 text-xs">
                  تجنب استخدام عدد كبير من الحسابات في نفس الوقت لتفادي تنبيه أنظمة الحماية
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-wolf-primary" />
            <span>أمان الحسابات</span>
          </h3>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                يحرص التطبيق على حماية معلومات حساباتك وعدم مشاركتها مع أي طرف ثالث.
                يتم تشفير كلمات المرور وتخزينها بشكل آمن على جهازك فقط.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="secure-storage" className="font-medium">التخزين المشفر</Label>
                <p className="text-sm text-gray-500 mt-1">تشفير بيانات الحسابات المخزنة محليًا</p>
              </div>
              <Switch 
                id="secure-storage" 
                checked={true} 
                disabled 
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full gap-2"
            >
              <Clipboard className="h-4 w-4" />
              <span>تصدير قائمة الحسابات (بدون كلمات المرور)</span>
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-wolf-primary" />
            <span>سجل النشاط</span>
          </h3>
          
          <div className="space-y-6">
            <div className="h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 space-y-2">
              <div className="border-r-2 border-blue-500 bg-blue-50 p-2 rounded">
                <p className="text-blue-800">تم بدء تشغيل التطبيق</p>
                <p className="text-xs text-gray-500">منذ 10 دقائق</p>
              </div>
              <div className="border-r-2 border-green-500 bg-green-50 p-2 rounded">
                <p className="text-green-800">تم تفعيل بوت السباق</p>
                <p className="text-xs text-gray-500">منذ 8 دقائق</p>
              </div>
              <div className="border-r-2 border-yellow-500 bg-yellow-50 p-2 rounded">
                <p className="text-yellow-800">تنبيه: انقطاع الاتصال بالحساب user123</p>
                <p className="text-xs text-gray-500">منذ 5 دقائق</p>
              </div>
              <div className="border-r-2 border-green-500 bg-green-50 p-2 rounded">
                <p className="text-green-800">تم استعادة الاتصال بالحساب user123</p>
                <p className="text-xs text-gray-500">منذ 4 دقائق</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                تصفية السجل
              </Button>
              
              <Button variant="outline" size="sm" className="text-red-500">
                مسح السجل
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSaveSettings}>
          <Save className="h-4 w-4" />
          <span>حفظ الإعدادات</span>
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
