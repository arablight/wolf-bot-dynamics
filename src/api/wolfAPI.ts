
import { toast } from "@/components/ui/use-toast";

export type WolfAccount = {
  id: string;
  username: string;
  password: string;
  status: 'online' | 'offline' | 'idle' | 'error';
  activeRoom?: string;
  authToken?: string;
  lastActive?: Date;
};

export type WolfAPIResponse = {
  success: boolean;
  message: string;
  data?: any;
};

// محاكاة تأخير الشبكة للاختبار
const simulateNetworkDelay = () => new Promise<void>(resolve => setTimeout(resolve, 1000));

/**
 * واجهة برمجة التطبيق للتعامل مع منصة WOLF
 * ملاحظة: هذه دالات محاكاة وتحتاج لاستبدالها بتكامل API حقيقي
 */
export const wolfAPI = {
  /**
   * تسجيل الدخول إلى حساب WOLF
   */
  async login(username: string, password: string): Promise<WolfAPIResponse> {
    console.log(`محاولة تسجيل الدخول لـ ${username}`);
    
    // محاكاة تأخير الشبكة
    await simulateNetworkDelay();
    
    // محاكاة عملية تسجيل الدخول (يجب استبدالها بطلب API حقيقي)
    if (username && password) {
      // للاختبار، نقبل أي بيانات اعتماد غير فارغة
      console.log(`تم تسجيل الدخول بنجاح لحساب ${username}`);
      return {
        success: true,
        message: `تم تسجيل الدخول بنجاح لحساب ${username}`,
        data: {
          authToken: `mock-token-${Date.now()}`,
          userId: `user-${Date.now()}`
        }
      };
    } else {
      console.error("فشل تسجيل الدخول: اسم المستخدم أو كلمة المرور غير صحيحة");
      return {
        success: false,
        message: "فشل تسجيل الدخول: اسم المستخدم أو كلمة المرور غير صحيحة"
      };
    }
  },

  /**
   * تسجيل الخروج من حساب WOLF
   */
  async logout(authToken: string): Promise<WolfAPIResponse> {
    console.log(`تسجيل الخروج من الحساب مع الرمز: ${authToken}`);
    
    // محاكاة تأخير الشبكة
    await simulateNetworkDelay();
    
    return {
      success: true,
      message: "تم تسجيل الخروج بنجاح"
    };
  },

  /**
   * الاتصال بغرفة WOLF
   */
  async connectToRoom(authToken: string, roomUrl: string): Promise<WolfAPIResponse> {
    console.log(`محاولة الاتصال بالغرفة: ${roomUrl}`);
    
    // محاكاة تأخير الشبكة
    await simulateNetworkDelay();
    
    // التحقق من صحة رابط الغرفة
    if (!roomUrl.includes('wolf.live/g/')) {
      return {
        success: false,
        message: "رابط الغرفة غير صالح. يجب أن يكون بتنسيق https://wolf.live/g/XXXXXXXX"
      };
    }
    
    console.log(`تم الاتصال بنجاح بالغرفة: ${roomUrl}`);
    return {
      success: true,
      message: `تم الاتصال بنجاح بالغرفة: ${roomUrl}`,
      data: {
        roomId: roomUrl.split('/').pop(),
        joined: new Date().toISOString()
      }
    };
  },

  /**
   * إرسال رسالة في غرفة
   */
  async sendMessage(authToken: string, roomUrl: string, message: string): Promise<WolfAPIResponse> {
    console.log(`إرسال الرسالة "${message}" إلى الغرفة ${roomUrl}`);
    
    // محاكاة تأخير الشبكة
    await simulateNetworkDelay();
    
    return {
      success: true,
      message: "تم إرسال الرسالة بنجاح",
      data: {
        timestamp: new Date().toISOString(),
        content: message
      }
    };
  },

  /**
   * إرسال أمر السباق
   */
  async sendRaceCommand(authToken: string, roomUrl: string): Promise<WolfAPIResponse> {
    console.log(`إرسال أمر السباق !س جلد إلى الغرفة ${roomUrl}`);
    
    // محاكاة تأخير الشبكة
    await simulateNetworkDelay();
    
    return {
      success: true,
      message: "تم إرسال أمر السباق بنجاح",
      data: {
        command: "!س جلد",
        timestamp: new Date().toISOString()
      }
    };
  }
};

// مدير الحسابات
export class WolfAccountManager {
  private accounts: Map<string, WolfAccount> = new Map();
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();
  
  // حفظ الحسابات في التخزين المحلي
  private saveAccounts() {
    const accountsArray = Array.from(this.accounts.values());
    // حذف كلمات المرور قبل الحفظ في التخزين المحلي للأمان
    const secureAccounts = accountsArray.map(acc => ({
      ...acc,
      password: "********" // إخفاء كلمة المرور للتخزين
    }));
    localStorage.setItem('wolf_accounts', JSON.stringify(secureAccounts));
  }
  
  // تحميل الحسابات من التخزين المحلي
  private loadAccounts() {
    const savedAccounts = localStorage.getItem('wolf_accounts');
    if (savedAccounts) {
      try {
        const accountsArray = JSON.parse(savedAccounts) as WolfAccount[];
        accountsArray.forEach(account => {
          this.accounts.set(account.id, account);
        });
      } catch (error) {
        console.error("خطأ في تحميل الحسابات:", error);
      }
    }
  }
  
  constructor() {
    this.loadAccounts();
  }
  
  // إضافة حساب جديد
  async addAccount(username: string, password: string): Promise<WolfAccount | null> {
    try {
      // محاولة تسجيل الدخول للتحقق من صحة بيانات الاعتماد
      const loginResult = await wolfAPI.login(username, password);
      
      if (loginResult.success) {
        const newAccount: WolfAccount = {
          id: `account-${Date.now()}`,
          username,
          password, // ملاحظة: في التطبيق الحقيقي يجب تشفير كلمات المرور
          status: 'offline',
          authToken: loginResult.data?.authToken
        };
        
        this.accounts.set(newAccount.id, newAccount);
        this.saveAccounts();
        return newAccount;
      } else {
        toast({
          title: "فشل إضافة الحساب",
          description: loginResult.message,
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("خطأ في إضافة الحساب:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الحساب. الرجاء المحاولة مرة أخرى.",
        variant: "destructive"
      });
      return null;
    }
  }
  
  // حذف حساب
  deleteAccount(accountId: string): boolean {
    // إيقاف أي مؤقتات مرتبطة بالحساب
    this.stopRaceCommand(accountId);
    
    const account = this.accounts.get(accountId);
    if (account && account.status === 'online' && account.authToken) {
      // تسجيل الخروج من الحساب إذا كان نشطًا
      wolfAPI.logout(account.authToken).catch(console.error);
    }
    
    const deleted = this.accounts.delete(accountId);
    if (deleted) {
      this.saveAccounts();
    }
    return deleted;
  }
  
  // تفعيل أو إيقاف حساب
  async toggleAccount(accountId: string, active: boolean): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account) return false;
    
    if (active && account.status !== 'online') {
      // تفعيل الحساب
      try {
        // إعادة تسجيل الدخول للحصول على رمز مصادقة جديد
        const loginResult = await wolfAPI.login(account.username, account.password);
        
        if (loginResult.success) {
          account.status = 'online';
          account.authToken = loginResult.data?.authToken;
          account.lastActive = new Date();
          
          this.accounts.set(accountId, account);
          this.saveAccounts();
          return true;
        } else {
          toast({
            title: "فشل تفعيل الحساب",
            description: loginResult.message,
            variant: "destructive"
          });
          return false;
        }
      } catch (error) {
        console.error("خطأ في تفعيل الحساب:", error);
        account.status = 'error';
        this.accounts.set(accountId, account);
        this.saveAccounts();
        return false;
      }
    } else if (!active && account.status === 'online') {
      // إيقاف الحساب
      if (account.authToken) {
        try {
          await wolfAPI.logout(account.authToken);
        } catch (error) {
          console.error("خطأ في تسجيل الخروج:", error);
        }
      }
      
      // إيقاف أي مؤقتات مرتبطة بالحساب
      this.stopRaceCommand(accountId);
      
      account.status = 'offline';
      account.activeRoom = undefined;
      account.authToken = undefined;
      
      this.accounts.set(accountId, account);
      this.saveAccounts();
      return true;
    }
    
    return false;
  }
  
  // الاتصال بغرفة
  async connectToRoom(accountId: string, roomUrl: string): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken) return false;
    
    try {
      const result = await wolfAPI.connectToRoom(account.authToken, roomUrl);
      
      if (result.success) {
        account.activeRoom = roomUrl;
        this.accounts.set(accountId, account);
        this.saveAccounts();
        return true;
      } else {
        toast({
          title: "فشل الاتصال بالغرفة",
          description: result.message,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("خطأ في الاتصال بالغرفة:", error);
      return false;
    }
  }
  
  // إرسال رسالة في غرفة
  async sendMessage(accountId: string, message: string): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) {
      toast({
        title: "لا يمكن إرسال الرسالة",
        description: "الحساب غير متصل بأي غرفة",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const result = await wolfAPI.sendMessage(account.authToken, account.activeRoom, message);
      return result.success;
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error);
      return false;
    }
  }
  
  // تشغيل أمر السباق بشكل دوري
  startRaceCommand(accountId: string, intervalMinutes: number): boolean {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) {
      toast({
        title: "لا يمكن بدء تشغيل السباق",
        description: "الحساب غير متصل بأي غرفة",
        variant: "destructive"
      });
      return false;
    }
    
    // إيقاف أي مؤقت سابق
    this.stopRaceCommand(accountId);
    
    // تحويل الدقائق إلى مللي ثانية + 10 ثواني
    const intervalMs = (intervalMinutes * 60 * 1000) + 10000;
    
    // إرسال أمر السباق الأول فورًا
    wolfAPI.sendRaceCommand(account.authToken, account.activeRoom)
      .then(result => {
        if (result.success) {
          toast({
            title: "أمر السباق",
            description: "تم إرسال أمر السباق بنجاح"
          });
        }
      })
      .catch(console.error);
    
    // إنشاء مؤقت لإرسال الأمر بشكل دوري
    const timer = setInterval(() => {
      const currentAccount = this.accounts.get(accountId);
      
      if (currentAccount?.status === 'online' && currentAccount.authToken && currentAccount.activeRoom) {
        wolfAPI.sendRaceCommand(currentAccount.authToken, currentAccount.activeRoom)
          .then(result => {
            if (result.success) {
              console.log("تم إرسال أمر السباق بنجاح");
            }
          })
          .catch(console.error);
      } else {
        // إيقاف المؤقت إذا أصبح الحساب غير نشط
        this.stopRaceCommand(accountId);
      }
    }, intervalMs);
    
    // تخزين مرجع المؤقت
    this.activeTimers.set(accountId, timer);
    
    return true;
  }
  
  // إيقاف أمر السباق
  stopRaceCommand(accountId: string): void {
    const timer = this.activeTimers.get(accountId);
    if (timer) {
      clearInterval(timer);
      this.activeTimers.delete(accountId);
    }
  }
  
  // الحصول على قائمة الحسابات
  getAccounts(): WolfAccount[] {
    return Array.from(this.accounts.values());
  }
  
  // الحصول على حساب معين
  getAccount(accountId: string): WolfAccount | undefined {
    return this.accounts.get(accountId);
  }
  
  // التحقق مما إذا كان أمر السباق قيد التشغيل
  isRaceCommandActive(accountId: string): boolean {
    return this.activeTimers.has(accountId);
  }
}

// إنشاء مدير حسابات عالمي
export const accountManager = new WolfAccountManager();
