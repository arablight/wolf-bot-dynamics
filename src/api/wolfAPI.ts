import { toast } from "@/components/ui/use-toast";

// تعريف الأنواع
export type WolfAccount = {
  id: string;
  username: string;
  password: string;
  status: 'online' | 'offline' | 'idle' | 'error';
  activeRoom?: string;
  authToken?: string;
  lastActive?: Date;
  privateMessages?: PrivateMessage[];
};

export type PrivateMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  containsRoomLink?: string;
};

export type WolfAPIResponse = {
  success: boolean;
  message: string;
  data?: any;
};

// معرفات البوتات الرسمية
export const OFFICIAL_BOT_IDS = {
  RACE_BOT: "80277459", // بوت سباق
  GUESS_BOT: "45578849", // بوت خمن - updated ID
  FISH_BOT: "76305584", // بوت صيد
};

// فئات بوت التخمين
export const GUESS_CATEGORIES = [
  { id: "mixed", name: "منوع", command: "!ج منوع" },
  { id: "celebrities", name: "مشاهير", command: "!ج مشاهير" },
  { id: "closeup", name: "عن قرب", command: "!ج عن قرب" },
  { id: "4x4", name: "4 في 4", command: "!ج 4 في 4" },
  { id: "food", name: "طعام", command: "!ج طعام" },
  { id: "sports", name: "رياضة", command: "!ج رياضة" },
];

// محاكاة تأخير الشبكة للاختبار
const simulateNetworkDelay = () => new Promise<void>(resolve => setTimeout(resolve, 1000));

// محاكاة بوت ولف للاختبار
const simulateWolfBot = (botType: 'race' | 'guess' | 'fish', authToken: string) => {
  const timestamp = new Date();
  let messages: PrivateMessage[] = [];
  
  if (botType === 'race') {
    messages = [
      {
        id: `pm-${Date.now()}-1`,
        senderId: OFFICIAL_BOT_IDS.RACE_BOT,
        senderName: "بوت سباق",
        content: "عاد حيوانك لطاقته الكاملة!",
        timestamp: new Date(timestamp.getTime() - 2 * 60000),
        read: false
      },
      {
        id: `pm-${Date.now()}-2`,
        senderId: OFFICIAL_BOT_IDS.RACE_BOT,
        senderName: "بوت سباق",
        content: "انتهت الجولة! الفائزون هم: @المتسابق1 @المتسابق2 @المتسابق3",
        timestamp,
        read: false
      }
    ];
  } else if (botType === 'guess') {
    messages = [
      {
        id: `pm-${Date.now()}-1`,
        senderId: OFFICIAL_BOT_IDS.GUESS_BOT,
        senderName: "بوت خمن",
        content: "إليك صورة جديدة للتخمين!",
        timestamp,
        read: false
      }
    ];
  } else if (botType === 'fish') {
    messages = [
      {
        id: `pm-${Date.now()}-1`,
        senderId: OFFICIAL_BOT_IDS.FISH_BOT,
        senderName: "بوت صيد",
        content: "يوجد طعم جديد في الغرفة: https://wolf.live/g/12345678",
        timestamp,
        read: false,
        containsRoomLink: "https://wolf.live/g/12345678"
      }
    ];
  }
  
  return messages;
};

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
    
    // نسمح بأنواع مختلفة من روابط الغرف: wolf.live/g/ID أو wolf.live/roomname
    const isValid = roomUrl.includes('wolf.live/') || roomUrl.includes('http://wolf.live/') || roomUrl.includes('https://wolf.live/');
    
    if (!isValid) {
      return {
        success: false,
        message: "رابط الغرفة غير صالح. يجب أن يحتوي على wolf.live"
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
   * إرسال أمر معين
   */
  async sendCommand(authToken: string, roomUrl: string, command: string): Promise<WolfAPIResponse> {
    console.log(`إرسال الأمر "${command}" إلى الغرفة ${roomUrl}`);
    
    // محاكاة تأخير الشبكة
    await simulateNetworkDelay();
    
    return {
      success: true,
      message: "تم إرسال الأمر بنجاح",
      data: {
        command,
        timestamp: new Date().toISOString()
      }
    };
  },

  /**
   * إرسال أمر السباق
   */
  async sendRaceCommand(authToken: string, roomUrl: string): Promise<WolfAPIResponse> {
    return this.sendCommand(authToken, roomUrl, "!س جلد");
  },

  /**
   * إرسال أمر الصيد
   */
  async sendFishCommand(authToken: string, roomUrl: string, baitLevel: number = 3): Promise<WolfAPIResponse> {
    return this.sendCommand(authToken, roomUrl, `!صيد ${baitLevel}`);
  },

  /**
   * إرسال أمر التخمين
   */
  async sendGuessCommand(authToken: string, roomUrl: string, category: string): Promise<WolfAPIResponse> {
    const guessCategory = GUESS_CATEGORIES.find(c => c.id === category);
    const command = guessCategory ? guessCategory.command : "!ج منوع";
    return this.sendCommand(authToken, roomUrl, command);
  },

  /**
   * الحصول على الرسائل الخاصة
   */
  async getPrivateMessages(authToken: string, botType?: 'race' | 'guess' | 'fish'): Promise<WolfAPIResponse> {
    console.log(`الحصول على الرسائل الخاصة`);
    
    // محاكاة تأخير الشبكة
    await simulateNetworkDelay();
    
    let messages: PrivateMessage[] = [];
    
    // إذا تم تحديد نوع البوت، فقم بمحاكاة رسائل من ذلك البوت
    if (botType) {
      messages = simulateWolfBot(botType, authToken);
    } else {
      // محاكاة رسائل من جميع البوتات
      messages = [
        ...simulateWolfBot('race', authToken),
        ...simulateWolfBot('guess', authToken),
        ...simulateWolfBot('fish', authToken)
      ];
    }
    
    return {
      success: true,
      message: "تم الحصول على الرسائل الخاصة بنجاح",
      data: messages
    };
  },

  /**
   * تحديد الرسالة كمقروءة
   */
  async markMessageAsRead(authToken: string, messageId: string): Promise<WolfAPIResponse> {
    console.log(`تحديد الرسالة ${messageId} كمقروءة`);
    
    // محاكاة تأخير الشبكة
    await simulateNetworkDelay();
    
    return {
      success: true,
      message: "تم تحديد الرسالة كمقروءة بنجاح"
    };
  }
};

// مدير الحسابات
export class WolfAccountManager {
  private accounts: Map<string, WolfAccount> = new Map();
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();
  private privateMessageListeners: Map<string, NodeJS.Timeout> = new Map();
  
  // حفظ الحسابات في التخزين المحلي
  private saveAccounts() {
    const accountsArray = Array.from(this.accounts.values());
    // حذف كلمات المرور قبل الحفظ في التخزين المحلي للأمان
    const secureAccounts = accountsArray.map(acc => ({
      ...acc,
      password: "********", // إخفاء كلمة المرور للتخزين
      privateMessages: undefined // لا نحفظ الرسائل الخاصة في التخزين المحلي
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
          this.accounts.set(account.id, {
            ...account,
            privateMessages: [] // تهيئة مصفوفة الرسائل الخاصة فارغة
          });
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
          authToken: loginResult.data?.authToken,
          privateMessages: []
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
    this.stopPrivateMessageListener(accountId);
    
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
          account.privateMessages = [];
          
          this.accounts.set(accountId, account);
          this.saveAccounts();
          
          // بدء الاستماع للرسائل الخاصة
          this.startPrivateMessageListener(accountId);
          
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
      this.stopPrivateMessageListener(accountId);
      
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
  
  // بدء الاستماع للرسائل الخاصة
  startPrivateMessageListener(accountId: string): void {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken) return;
    
    // إيقاف أي مستمع سابق
    this.stopPrivateMessageListener(accountId);
    
    // إنشاء مؤقت للتحقق من الرسائل الخاصة كل 15 ثانية
    const timerId = setInterval(async () => {
      // التحقق من حالة الحساب قبل المتابعة
      const currentAccount = this.accounts.get(accountId);
      if (!currentAccount || currentAccount.status !== 'online' || !currentAccount.authToken) {
        this.stopPrivateMessageListener(accountId);
        return;
      }
      
      try {
        // الحصول على الرسائل الخاصة
        const response = await wolfAPI.getPrivateMessages(currentAccount.authToken);
        
        if (response.success && Array.isArray(response.data)) {
          const newMessages = response.data as PrivateMessage[];
          
          // فلترة الرسائل غير المقروءة فقط
          const unreadMessages = newMessages.filter(msg => !msg.read);
          
          if (unreadMessages.length > 0) {
            // تحديث قائمة الرسائل الخاصة
            currentAccount.privateMessages = [
              ...unreadMessages,
              ...(currentAccount.privateMessages || []).slice(0, 50) // الاحتفاظ بآخر 50 رسالة فقط
            ];
            
            this.accounts.set(accountId, currentAccount);
            
            // إرسال حدث عندما تصل رسائل جديدة
            window.dispatchEvent(new CustomEvent('new-private-messages', {
              detail: {
                accountId,
                messages: unreadMessages
              }
            }));
            
            // معالجة الرسائل حسب نوع البوت
            this.handleBotMessages(accountId, unreadMessages);
          }
        }
      } catch (error) {
        console.error("خطأ في الحصول على الرسائل الخاصة:", error);
      }
    }, 15000);
    
    // تخزين مرجع المؤقت
    this.privateMessageListeners.set(accountId, timerId);
  }
  
  // إيقاف الاستماع للرسائل الخاصة
  stopPrivateMessageListener(accountId: string): void {
    const timerId = this.privateMessageListeners.get(accountId);
    if (timerId) {
      clearInterval(timerId);
      this.privateMessageListeners.delete(accountId);
    }
  }
  
  // معالجة الرسائل من البوتات الرسمية
  private async handleBotMessages(accountId: string, messages: PrivateMessage[]): Promise<void> {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) return;
    
    // معالجة رسائل بوت السباق
    const raceMessages = messages.filter(msg => msg.senderId === OFFICIAL_BOT_IDS.RACE_BOT);
    // معالجة رسائل بوت التخمين
    const guessMessages = messages.filter(msg => msg.senderId === OFFICIAL_BOT_IDS.GUESS_BOT);
    // معالجة رسائل بوت الصيد
    const fishMessages = messages.filter(msg => msg.senderId === OFFICIAL_BOT_IDS.FISH_BOT);
    
    // معالجة رسائل بوت السباق
    for (const message of raceMessages) {
      if (message.content.includes("عاد حيوانك لطاقته الكاملة")) {
        // إرسال أمر السباق عندما يعود الحيوان لطاقته الكاملة
        await wolfAPI.sendRaceCommand(account.authToken, account.activeRoom);
        
        // إرسال حدث لسجل النشاط
        window.dispatchEvent(new CustomEvent('app-log', {
          detail: {
            type: 'info',
            message: "تم استشعار استعادة طاقة الحيوان وإرسال أمر السباق"
          }
        }));
      } else if (message.content.includes("انتهت الجولة")) {
        // إرسال حدث لسجل النشاط
        window.dispatchEvent(new CustomEvent('app-log', {
          detail: {
            type: 'info',
            message: "تم استشعار انتهاء جولة السباق"
          }
        }));
        
        // إعادة تشغيل المؤقت لإرسال أمر السباق بعد 10 دقائق و 10 ثوانٍ
        const timerId = setTimeout(async () => {
          const currentAccount = this.accounts.get(accountId);
          if (currentAccount?.status === 'online' && currentAccount.authToken && currentAccount.activeRoom) {
            await wolfAPI.sendRaceCommand(currentAccount.authToken, currentAccount.activeRoom);
            
            window.dispatchEvent(new CustomEvent('app-log', {
              detail: {
                type: 'info',
                message: "تم إرسال أمر السباق بعد انتهاء المهلة"
              }
            }));
          }
        }, 10 * 60 * 1000 + 10 * 1000); // 10 دقائق و 10 ثوانٍ
        
        // تخزين مرجع المؤقت
        this.activeTimers.set(`race-cooldown-${accountId}`, timerId);
      }
      
      // تحديد الرسالة كمقروءة
      await wolfAPI.markMessageAsRead(account.authToken, message.id);
    }
    
    // معالجة رسائل بوت التخمين - إضافة تفاعل مع صور التخمين
    for (const message of guessMessages) {
      // يمكن إضافة منطق للتفاعل مع صور التخمين هنا
      
      // تحديد الرسالة كمقروءة
      await wolfAPI.markMessageAsRead(account.authToken, message.id);
    }
    
    // معالجة رسائل بوت الصيد
    for (const message of fishMessages) {
      if (message.containsRoomLink) {
        // الانتقال إلى الغرفة التي تحتوي على طعم
        const roomLinkSuccess = await this.connectToRoom(accountId, message.containsRoomLink);
        
        if (roomLinkSuccess) {
          // إرسال أمر الصيد
          await wolfAPI.sendFishCommand(account.authToken, message.containsRoomLink, 3);
          
          // إرسال حدث لسجل النشاط
          window.dispatchEvent(new CustomEvent('app-log', {
            detail: {
              type: 'info',
              message: `تم الانتقال إلى غرفة الصيد وإرسال أمر الصيد: ${message.containsRoomLink}`
            }
          }));
        }
      }
      
      // تحديد الرسالة كمقروءة
      await wolfAPI.markMessageAsRead(account.authToken, message.id);
    }
  }
  
  // تشغيل أمر السباق بشكل دوري
  startRaceCommand(accountId: string, intervalMinutes: number, automaticDetection: boolean = false): boolean {
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
    
    // إذا كان الكشف التلقائي مفعل، نكتفي بالاستماع للرسائل
    if (automaticDetection) {
      // إرسال حدث لسجل النشاط
      window.dispatchEvent(new CustomEvent('app-log', {
        detail: {
          type: 'info',
          message: "تم تفعيل الكشف التلقائي لأوامر السباق"
        }
      }));
      
      // تخزين إعداد وضع الكشف التلقائي
      this.activeTimers.set(`race-auto-${accountId}`, setTimeout(() => {}, 0));
      
      return true;
    }
    
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
          
          // إرسال حدث لسجل النشاط
          window.dispatchEvent(new CustomEvent('app-log', {
            detail: {
              type: 'info',
              message: "تم إرسال أمر السباق بشكل يدوي"
            }
          }));
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
              
              // إرسال حدث لسجل النشاط
              window.dispatchEvent(new CustomEvent('app-log', {
                detail: {
                  type: 'info',
                  message: "تم إرسال أمر السباق الدوري"
                }
              }));
            }
          })
          .catch(console.error);
      } else {
        // إيقاف المؤقت إذا أصبح الحساب غير نشط
        this.stopRaceCommand(accountId);
      }
    }, intervalMs);
    
    // تخزين مرجع المؤقت
    this.activeTimers.set(`race-timer-${accountId}`, timer);
    
    return true;
  }
  
  // إيقاف أمر السباق
  stopRaceCommand(accountId: string): void {
    // إيقاف مؤقت الكشف التلقائي
    const autoTimer = this.activeTimers.get(`race-auto-${accountId}`);
    if (autoTimer) {
      clearTimeout(autoTimer);
      this.activeTimers.delete(`race-auto-${accountId}`);
    }
    
    // إيقاف مؤقت السباق الدوري
    const timer = this.activeTimers.get(`race-timer-${accountId}`);
    if (timer) {
      clearInterval(timer);
      this.activeTimers.delete(`race-timer-${accountId}`);
    }
    
    // إيقاف مؤقت مهلة السباق
    const cooldownTimer = this.activeTimers.get(`race-cooldown-${accountId}`);
    if (cooldownTimer) {
      clearTimeout(cooldownTimer);
      this.activeTimers.delete(`race-cooldown-${accountId}`);
    }
  }
  
  // بدء أمر التخمين
  async startGuessCommand(accountId: string, category: string): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) {
      toast({
        title: "لا يمكن بدء أمر التخمين",
        description: "الحساب غير متصل بأي غرفة",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const result = await wolfAPI.sendGuessCommand(account.authToken, account.activeRoom, category);
      
      if (result.success) {
        // إرسال حدث لسجل النشاط
        window.dispatchEvent(new CustomEvent('app-log', {
          detail: {
            type: 'info',
            message: `تم إرسال أمر التخمين للفئة: ${category}`
          }
        }));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("خطأ في إرسال أمر التخمين:", error);
      return false;
    }
  }
  
  // بدء أمر الصيد
  async startFishCommand(accountId: string, baitLevel: number = 3): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) {
      toast({
        title: "لا يمكن بدء أمر الصيد",
        description: "الحساب غير متصل بأي غرفة",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const result = await wolfAPI.sendFishCommand(account.authToken, account.activeRoom, baitLevel);
      
      if (result.success) {
        // إرسال حدث لسجل النشاط
        window.dispatchEvent(new CustomEvent('app-log', {
          detail: {
            type: 'info',
            message: `تم إرسال أمر الصيد بمستوى طعم: ${baitLevel}`
          }
        }));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("خطأ في إرسال أمر الصيد:", error);
      return false;
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
    return this.activeTimers.has(`race-timer-${accountId}`) || this.activeTimers.has(`race-auto-${accountId}`);
  }
  
  // التحقق مما إذا كان وضع الكشف التلقائي مفعل
  isRaceAutoDetectionActive(accountId: string): boolean {
    return this.activeTimers.has(`race-auto-${accountId}`);
  }
  
  // الحصول على الرسائل الخاصة لحساب معين
  getPrivateMessagesForAccount(accountId: string): PrivateMessage[] {
    const account = this.accounts.get(accountId);
    return account?.privateMessages || [];
  }
}

// إنشاء مدير حسابات عالمي
export const accountManager = new WolfAccountManager();
