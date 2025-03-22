import { toast } from "@/components/ui/use-toast";

// Define types
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

// Timer settings interface for storing data with timers
interface TimerSettings {
  timer?: NodeJS.Timeout;
  data?: string;
}

// Official bot IDs
export const OFFICIAL_BOT_IDS = {
  RACE_BOT: "80277459", // Race bot
  GUESS_BOT: "45578849", // Guess bot - updated ID
  FISH_BOT: "76305584", // Fish bot
};

// Guess categories
export const GUESS_CATEGORIES = [
  { id: "mixed", name: "منوع", command: "!ج منوع" },
  { id: "celebrities", name: "مشاهير", command: "!ج مشاهير" },
  { id: "closeup", name: "عن قرب", command: "!ج عن قرب" },
  { id: "4x4", name: "4 في 4", command: "!ج 4 في 4" },
  { id: "food", name: "طعام", command: "!ج طعام" },
  { id: "sports", name: "رياضة", command: "!ج رياضة" },
];

// Fishing locations
export const FISHING_LOCATIONS = [
  { id: 'wolf_ocean', name: 'Wolf Ocean', command: '!صيد 3' },
  { id: 'black_lake', name: 'Black Lake', command: '!صيد بحيرة 3' },
  { id: 'atlantis_island', name: 'Atlantis Island', command: '!صيد جزيرة 3' },
  { id: 'small_gulf', name: 'Small Gulf', command: '!صيد خليج 3' },
  { id: 'amazon_forest', name: 'Amazon Forest', command: '!صيد امازون 3' },
  { id: 'tropical_forest', name: 'Tropical Forest', command: '!صيد غابة 3' },
  { id: 'hunters_horizon', name: "Hunter's Horizon", command: '!صيد افق 3' },
  { id: 'lerna_lake', name: 'Lerna Lake', command: '!صيد ليرنا 3' },
];

// AI response words for guessing
const AI_GUESS_RESPONSES = [
  "أعتقد أنه", "هذا يبدو مثل", "أظن أنه", "ممكن يكون", "شكله", 
  "هذا", "واضح أنه", "بالتأكيد هذا", "يشبه", "يمكن أنه"
];

// Simulate network delay for testing
const simulateNetworkDelay = () => new Promise<void>(resolve => setTimeout(resolve, 1000));

// Simulate Wolf bot
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
      },
      {
        id: `pm-${Date.now()}-2`,
        senderId: OFFICIAL_BOT_IDS.FISH_BOT,
        senderName: "بوت صيد",
        content: "يوجد معزز إضافي متاح لك في القناة [غرفة صيد] (https://wolf.live/g/87654321)",
        timestamp: new Date(timestamp.getTime() - 3 * 60000),
        read: false,
        containsRoomLink: "https://wolf.live/g/87654321"
      },
      {
        id: `pm-${Date.now()}-3`,
        senderId: OFFICIAL_BOT_IDS.FISH_BOT,
        senderName: "بوت صيد",
        content: "There's a Bonus-Cast available for you in [Fishing Room] (ID: 13579246)",
        timestamp: new Date(timestamp.getTime() - 5 * 60000),
        read: false,
        containsRoomLink: "https://wolf.live/g/13579246"
      }
    ];
  }
  
  return messages;
};

// Helper function to generate random guesses
const generateRandomGuess = (): string => {
  const randomWords = [
    "محمد", "أحمد", "سيارة", "باريس", "القاهرة", "كرة قدم", "عنب", "تفاح", 
    "برج إيفل", "الأهرامات", "شمس", "قمر", "نجوم", "كتاب", "قلم", "طاولة", 
    "كرسي", "حاسوب", "هاتف", "عصير", "ماء", "قهوة", "شاي", "سمك", "دجاج", 
    "لحم", "أرز", "خبز", "جبن", "برتقال", "موز", "فراولة", "توت", "بطيخ"
  ];
  
  const randomResponse = AI_GUESS_RESPONSES[Math.floor(Math.random() * AI_GUESS_RESPONSES.length)];
  const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
  
  return `${randomResponse} ${randomWord}`;
};

/**
 * Wolf API interface
 * Note: These are simulation functions and need to be replaced with real API integration
 */
export const wolfAPI = {
  /**
   * Login to WOLF account
   */
  async login(username: string, password: string): Promise<WolfAPIResponse> {
    console.log(`محاولة تسجيل الدخول لـ ${username}`);
    
    // Simulate network delay
    await simulateNetworkDelay();
    
    // Simulate login process (should be replaced with real API request)
    if (username && password) {
      // For testing, accept any non-empty credentials
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
   * Logout from WOLF account
   */
  async logout(authToken: string): Promise<WolfAPIResponse> {
    console.log(`تسجيل الخروج من الحساب مع الرمز: ${authToken}`);
    
    // Simulate network delay
    await simulateNetworkDelay();
    
    return {
      success: true,
      message: "تم تسجيل الخروج بنجاح"
    };
  },

  /**
   * Connect to WOLF room
   */
  async connectToRoom(authToken: string, roomUrl: string): Promise<WolfAPIResponse> {
    console.log(`محاولة الاتصال بالغرفة: ${roomUrl}`);
    
    // Simulate network delay
    await simulateNetworkDelay();
    
    // Allow different types of room links: wolf.live/g/ID or wolf.live/roomname
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
   * Send message in room
   */
  async sendMessage(authToken: string, roomUrl: string, message: string): Promise<WolfAPIResponse> {
    console.log(`إرسال الرسالة "${message}" إلى الغرفة ${roomUrl}`);
    
    // Simulate network delay
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
   * Send command
   */
  async sendCommand(authToken: string, roomUrl: string, command: string): Promise<WolfAPIResponse> {
    console.log(`إرسال الأمر "${command}" إلى الغرفة ${roomUrl}`);
    
    // Simulate network delay
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
   * Send race command
   */
  async sendRaceCommand(authToken: string, roomUrl: string): Promise<WolfAPIResponse> {
    return this.sendCommand(authToken, roomUrl, "!س جلد");
  },

  /**
   * Send fish command
   */
  async sendFishCommand(authToken: string, roomUrl: string, command: string = '!صيد 3'): Promise<WolfAPIResponse> {
    return this.sendCommand(authToken, roomUrl, command);
  },

  /**
   * Send guess command
   */
  async sendGuessCommand(authToken: string, roomUrl: string, category: string): Promise<WolfAPIResponse> {
    const guessCategory = GUESS_CATEGORIES.find(c => c.id === category);
    const command = guessCategory ? guessCategory.command : "!ج منوع";
    return this.sendCommand(authToken, roomUrl, command);
  },
  
  /**
   * Send guess answer
   */
  async sendGuessAnswer(authToken: string, roomUrl: string): Promise<WolfAPIResponse> {
    const randomGuess = generateRandomGuess();
    return this.sendMessage(authToken, roomUrl, randomGuess);
  },

  /**
   * Get private messages
   */
  async getPrivateMessages(authToken: string, botType?: 'race' | 'guess' | 'fish'): Promise<WolfAPIResponse> {
    console.log(`الحصول على الرسائل الخاصة`);
    
    // Simulate network delay
    await simulateNetworkDelay();
    
    let messages: PrivateMessage[] = [];
    
    // If bot type is specified, simulate messages from that bot
    if (botType) {
      messages = simulateWolfBot(botType, authToken);
    } else {
      // Simulate messages from all bots
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
   * Mark message as read
   */
  async markMessageAsRead(authToken: string, messageId: string): Promise<WolfAPIResponse> {
    console.log(`تحديد الرسالة ${messageId} كمقروءة`);
    
    // Simulate network delay
    await simulateNetworkDelay();
    
    return {
      success: true,
      message: "تم تحديد الرسالة كمقروءة بنجاح"
    };
  }
};

// Account Manager
export class WolfAccountManager {
  private accounts: Map<string, WolfAccount> = new Map();
  private activeTimers: Map<string, TimerSettings> = new Map();
  private privateMessageListeners: Map<string, NodeJS.Timeout> = new Map();
  
  // Save accounts to local storage
  private saveAccounts() {
    const accountsArray = Array.from(this.accounts.values());
    // Remove passwords before saving to local storage for security
    const secureAccounts = accountsArray.map(acc => ({
      ...acc,
      password: "********", // Hide password for storage
      privateMessages: undefined // Don't save private messages in local storage
    }));
    localStorage.setItem('wolf_accounts', JSON.stringify(secureAccounts));
  }
  
  // Load accounts from local storage
  private loadAccounts() {
    const savedAccounts = localStorage.getItem('wolf_accounts');
    if (savedAccounts) {
      try {
        const accountsArray = JSON.parse(savedAccounts) as WolfAccount[];
        accountsArray.forEach(account => {
          this.accounts.set(account.id, {
            ...account,
            privateMessages: [] // Initialize private messages array empty
          });
        });
      } catch (error) {
        console.error("Error loading accounts:", error);
      }
    }
  }
  
  constructor() {
    this.loadAccounts();
  }
  
  // Add new account
  async addAccount(username: string, password: string): Promise<WolfAccount | null> {
    try {
      // Try to login to verify credentials
      const loginResult = await wolfAPI.login(username, password);
      
      if (loginResult.success) {
        const newAccount: WolfAccount = {
          id: `account-${Date.now()}`,
          username,
          password, // Note: In a real app, passwords should be encrypted
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
      console.error("Error adding account:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الحساب. الرجاء المحاولة مرة أخرى.",
        variant: "destructive"
      });
      return null;
    }
  }
  
  // Delete account
  deleteAccount(accountId: string): boolean {
    // Stop any timers associated with the account
    this.stopRaceCommand(accountId);
    this.stopGuessCommand(accountId);
    this.stopFishCommand(accountId);
    this.stopPrivateMessageListener(accountId);
    
    const account = this.accounts.get(accountId);
    if (account && account.status === 'online' && account.authToken) {
      // Logout account if active
      wolfAPI.logout(account.authToken).catch(console.error);
    }
    
    const deleted = this.accounts.delete(accountId);
    if (deleted) {
      this.saveAccounts();
    }
    return deleted;
  }
  
  // Toggle account active state
  async toggleAccount(accountId: string, active: boolean): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account) return false;
    
    if (active && account.status !== 'online') {
      // Activate account
      try {
        // Re-login to get new auth token
        const loginResult = await wolfAPI.login(account.username, account.password);
        
        if (loginResult.success) {
          account.status = 'online';
          account.authToken = loginResult.data?.authToken;
          account.lastActive = new Date();
          account.privateMessages = [];
          
          this.accounts.set(accountId, account);
          this.saveAccounts();
          
          // Start listening for private messages
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
        console.error("Error activating account:", error);
        account.status = 'error';
        this.accounts.set(accountId, account);
        this.saveAccounts();
        return false;
      }
    } else if (!active && account.status === 'online') {
      // Deactivate account
      if (account.authToken) {
        try {
          await wolfAPI.logout(account.authToken);
        } catch (error) {
          console.error("Error logging out:", error);
        }
      }
      
      // Stop any timers associated with the account
      this.stopRaceCommand(accountId);
      this.stopGuessCommand(accountId);
      this.stopFishCommand(accountId);
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
  
  // Connect to room
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
      console.error("Error connecting to room:", error);
      return false;
    }
  }
  
  // Send message in room
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
      console.error("Error sending message:", error);
      return false;
    }
  }
  
  // Start listening for private messages
  startPrivateMessageListener(accountId: string): void {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken) return;
    
    // Stop any previous listener
    this.stopPrivateMessageListener(accountId);
    
    // Create timer to check for private messages every 15 seconds
    const timerId = setInterval(async () => {
      // Check account status before proceeding
      const currentAccount = this.accounts.get(accountId);
      if (!currentAccount || currentAccount.status !== 'online' || !currentAccount.authToken) {
        this.stopPrivateMessageListener(accountId);
        return;
      }
      
      try {
        // Get private messages
        const response = await wolfAPI.getPrivateMessages(currentAccount.authToken);
        
        if (response.success && Array.isArray(response.data)) {
          const newMessages = response.data as PrivateMessage[];
          
          // Filter only unread messages
          const unreadMessages = newMessages.filter(msg => !msg.read);
          
          if (unreadMessages.length > 0) {
            // Update private messages list
            currentAccount.privateMessages = [
              ...unreadMessages,
              ...(currentAccount.privateMessages || []).slice(0, 50) // Keep only last 50 messages
            ];
            
            this.accounts.set(accountId, currentAccount);
            
            // Dispatch event when new messages arrive
            window.dispatchEvent(new CustomEvent('new-private-messages', {
              detail: {
                accountId,
                messages: unreadMessages
              }
            }));
            
            // Handle messages by bot type
            this.handleBotMessages(accountId, unreadMessages);
          }
        }
      } catch (error) {
        console.error("Error getting private messages:", error);
      }
    }, 15000);
    
    // Store timer reference
    this.privateMessageListeners.set(accountId, timerId);
  }
  
  // Stop listening for private messages
  stopPrivateMessageListener(accountId: string): void {
    const timerId = this.privateMessageListeners.get(accountId);
    if (timerId) {
      clearInterval(timerId);
      this.privateMessageListeners.delete(accountId);
    }
  }
  
  // Handle messages from official bots
  private async handleBotMessages(accountId: string, messages: PrivateMessage[]): Promise<void> {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) return;
    
    // Handle Race bot messages
    const raceMessages = messages.filter(msg => msg.senderId === OFFICIAL_BOT_IDS.RACE_BOT);
    // Handle Guess bot messages
    const guessMessages = messages.filter(msg => msg.senderId === OFFICIAL_BOT_IDS.GUESS_BOT);
    // Handle Fish bot messages
    const fishMessages = messages.filter(msg => msg.senderId === OFFICIAL_BOT_IDS.FISH_BOT);
    
    // Handle Race bot messages
    for (const message of raceMessages) {
      if (message.content.includes("عاد حيوانك لطاقته الكاملة")) {
        // Send race command when pet energy is restored
        if (this.isRaceAutoDetectionActive(accountId)) {
          await wolfAPI.sendRaceCommand(account.authToken, account.activeRoom);
          
          // Dispatch event for activity log
          window.dispatchEvent(new CustomEvent('app-log', {
            detail: {
              type: 'info',
              message: "تم استشعار استعادة طاقة الحيوان وإرسال أمر السباق"
            }
          }));
        }
      } else if (message.content.includes("انتهت الجولة")) {
        // Dispatch event for activity log
        window.dispatchEvent(new CustomEvent('app-log', {
          detail: {
            type: 'info',
            message: "تم استشعار انتهاء جولة السباق"
          }
        }));
        
        // If auto detection is active, restart race command after cooldown
        if (this.isRaceAutoDetectionActive(accountId)) {
          // Restart race command after 10 minutes and 10 seconds
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
          }, 10 * 60 * 1000 + 10 * 1000); // 10 minutes and 10 seconds
          
          // Store timer reference
          this.activeTimers.set(`race-cooldown-${accountId}`, timerId);
        }
      }
      
      // Mark message as read
      await wolfAPI.markMessageAsRead(account.authToken, message.id);
    }
    
    // Handle Guess bot messages - add interaction with guess images
    for (const message of guessMessages) {
      // Mark message as read
      await wolfAPI.markMessageAsRead(account.authToken, message.id);
    }
    
    // Handle Fish bot messages
    for (const message of fishMessages) {
      // Check for bonus-cast messages
      const isBonusCastMessage = 
        message.content.includes("معزز إضافي متاح") || 
        message.content.includes("Bonus-Cast available");
      
      // Handle fish bot messages based on active system
      if ((isBonusCastMessage && this.isFishBonusActive(accountId)) || 
          (message.containsRoomLink && this.isFishBonusActive(accountId))) {
        
        // Extract room link
        let roomLink = message.containsRoomLink;
        
        // If no direct link is available, try to extract from message content
        if (!roomLink) {
          // Extract room link from message content
          const urlMatch = message.content.match(/https:\/\/wolf\.live\/[^\s\)]+/);
          if (urlMatch) {
            roomLink = urlMatch[0];
          } else {
            // Look for room ID pattern
            const idMatch = message.content.match(/\(ID:\s*(\d+)\)/);
            if (idMatch) {
              roomLink = `https://wolf.live/g/${idMatch[1]}`;
            }
          }
        }
        
        if (roomLink) {
          // Navigate to the room with the bonus-cast
          const roomLinkSuccess = await this.connectToRoom(accountId, roomLink);
          
          if (roomLinkSuccess) {
            // Get the active fish command
            const activeCommand = this.getFishCommand(accountId) || '!صيد 3';
            
            // Send fish command
            await wolfAPI.sendFishCommand(account.authToken, roomLink, activeCommand);
            
            // Dispatch event for activity log
            window.dispatchEvent(new CustomEvent('app-log', {
              detail: {
                type: 'info',
                message: `تم الانتقال إلى غرفة المعزز وإرسال أمر الصيد: ${roomLink}`
              }
            }));
          }
        }
      }
      
      // Mark message as read
      await wolfAPI.markMessageAsRead(account.authToken, message.id);
    }
  }
  
  // RACE COMMAND FUNCTIONS
  
  // Start race command periodically
  async startRaceCommand(accountId: string, intervalMinutes: number, automaticDetection: boolean = false, raceSystem: string = 'queue'): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) {
      toast({
        title: "لا يمكن بدء تشغيل السباق",
        description: "الحساب غير متصل بأي غرفة",
        variant: "destructive"
      });
      return false;
    }
    
    // Stop any previous timers
    this.stopRaceCommand(accountId);
    
    // Store race system type using new TimerSettings interface
    this.activeTimers.set(`race-system-${accountId}`, { data: raceSystem });

    // If auto detection is enabled, just listen for messages
    if (automaticDetection) {
      // Dispatch event for activity log
      window.dispatchEvent(new CustomEvent('app-log', {
        detail: {
          type: 'info',
          message: "تم تفعيل الكشف التلقائي لأوامر السباق"
        }
      }));
      
      // Store auto detection setting
      this.activeTimers.set(`race-auto-${accountId}`, {});
      
      return true;
    }
    
    // Convert minutes to milliseconds + 40 seconds for race queue
    const intervalMs = (intervalMinutes * 60 * 1000) + 40000;
    
    // Send first race command immediately
    wolfAPI.sendRaceCommand(account.authToken, account.activeRoom)
      .then(result => {
        if (result.success) {
          toast({
            title: "أمر السباق",
            description: "تم إرسال أمر السباق بنجاح"
          });
          
          // Dispatch event for activity log
          window.dispatchEvent(new CustomEvent('app-log', {
            detail: {
              type: 'info',
              message: `تم إرسال أمر السباق بشكل يدوي (${raceSystem === 'train' ? 'قطار السباق' : 'قائمة انتظار السباق'})`
            }
          }));
        }
      })
      .catch(console.error);
    
    // If using race train system, send commands to all online accounts
    if (raceSystem === 'train') {
      // Get all online accounts
      const onlineAccounts = Array.from(this.accounts.values())
        .filter(acc => acc.id !== accountId && acc.status === 'online' && acc.authToken && acc.activeRoom);
      
      // Send race command to all other accounts with a small delay
      onlineAccounts.forEach((acc, index) => {
        setTimeout(() => {
          if (acc.authToken && acc.activeRoom) {
            wolfAPI.sendRaceCommand(acc.authToken, acc.activeRoom)
              .then(result => {
                if (result.success) {
                  console.log(`تم إرسال أمر السباق للحساب ${acc.username} بنجاح`);
                  
                  // Dispatch event for activity log
                  window.dispatchEvent(new CustomEvent('app-log', {
                    detail: {
                      type: 'info',
                      message: `تم إرسال أمر السباق للحساب ${acc.username} (قطار السباق)`
                    }
                  }));
                }
              })
              .catch(console.error);
          }
        }, 500 * (index + 1)); // 500ms delay between each account
      });
    }
    
    // Create timer to send command periodically
    const timer = setInterval(() => {
      const currentAccount = this.accounts.get(accountId);
      
      if (currentAccount?.status === 'online' && currentAccount.authToken && currentAccount.activeRoom) {
        wolfAPI.sendRaceCommand(currentAccount.authToken, currentAccount.activeRoom)
          .then(result => {
            if (result.success) {
              console.log("تم إرسال أمر السباق بنجاح");
              
              // Dispatch event for activity log
              window.dispatchEvent(new CustomEvent('app-log', {
                detail: {
                  type: 'info',
                  message: `تم إرسال أمر السباق الدوري (${raceSystem === 'train' ? 'قطار السباق' : 'قائمة انتظار السباق'})`
                }
              }));
            }
          })
          .catch(console.error);
        
        // If using race train system, send commands to all online accounts
        if (raceSystem === 'train') {
          // Get all online accounts
          const onlineAccounts = Array.from(this.accounts.values())
            .filter(acc => acc.id !== accountId && acc.status === 'online' && acc.authToken && acc.activeRoom);
          
          // Send race command to all other accounts with a small delay
          onlineAccounts.forEach((acc, index) => {
            setTimeout(() => {
              if (acc.authToken && acc.activeRoom) {
                wolfAPI.sendRaceCommand(acc.authToken, acc.activeRoom)
                  .then(result => {
                    if (result.success) {
                      console.log(`تم إرسال أمر السباق للحساب ${acc.username} بنجاح`);
                      
                      // Dispatch event for activity log
                      window.dispatchEvent(new CustomEvent('app-log', {
                        detail: {
                          type: 'info',
                          message: `تم إرسال أمر السباق للحساب ${acc.username} (قطار السباق)`
                        }
                      }));
                    }
                  })
                  .catch(console.error);
              }
            }, 500 * (index + 1)); // 500ms delay between each account
          });
        }
      } else {
        // Stop timer if account becomes inactive
        this.stopRaceCommand(accountId);
      }
    }, intervalMs);
    
    // Store timer reference
    this.activeTimers.set(`race-timer-${accountId}`, timer);
    
    return true;
  }
  
  // Stop race command
  stopRaceCommand(accountId: string): void {
    // Stop auto detection timer
    const autoTimer = this.activeTimers.get(`race-auto-${accountId}`);
    if (autoTimer) {
      clearTimeout(autoTimer);
      this.activeTimers.delete(`race-auto-${accountId}`);
    }
    
    // Stop race system type timer
    const systemTimer = this.activeTimers.get(`race-system-${accountId}`);
    if (systemTimer) {
      clearTimeout(systemTimer);
      this.activeTimers.delete(`race-system-${accountId}`);
    }
    
    // Stop race timer
    const timer = this.activeTimers.get(`race-timer-${accountId}`);
    if (timer) {
      clearInterval(timer);
      this.activeTimers.delete(`race-timer-${accountId}`);
    }
    
    // Stop race cooldown timer
    const cooldownTimer = this.activeTimers.get(`race-cooldown-${accountId}`);
    if (cooldownTimer) {
      clearTimeout(cooldownTimer);
      this.activeTimers.delete(`race-cooldown-${accountId}`);
    }
  }
  
  // GUESS COMMAND FUNCTIONS
  
  // Start guess command
  async startGuessCommand(accountId: string, category: string, autoAnswer: boolean = true, responseDelay: number = 1): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) {
      toast({
        title: "لا يمكن بدء أمر التخمين",
        description: "الحساب غير متصل بأي غرفة",
        variant: "destructive"
      });
      return false;
    }
    
    // Stop any previous timers
    this.stopGuessCommand(accountId);
    
    try {
      // Send initial guess command
      const result = await wolfAPI.sendGuessCommand(account.authToken, account.activeRoom, category);
      
      if (result.success) {
        // Store guess settings using TimerSettings interface
        this.activeTimers.set(`guess-category-${accountId}`, { data: category });
        this.activeTimers.set(`guess-auto-${accountId}`, { data: autoAnswer ? "true" : "false" });
        this.activeTimers.set(`guess-delay-${accountId}`, { data: responseDelay.toString() });
        
        // Dispatch event for activity log
        window.dispatchEvent(new CustomEvent('app-log', {
          detail: {
            type: 'info',
            message: `تم إرسال أمر التخمين للفئة: ${category}`
          }
        }));
        
        // If auto answer is enabled, set up listener for guess bot messages in public chat
        if (autoAnswer) {
          // Watch for room messages containing images
          this.startGuessImageListener(accountId, responseDelay);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error sending guess command:", error);
      return false;
    }
  }
  
  // Start listening for guess images
  private startGuessImageListener(accountId: string, responseDelay: number): void {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) return;
    
    // Create timer to check for new images every 5 seconds
    const timerId = setInterval(async () => {
      // Check account status before proceeding
      const currentAccount = this.accounts.get(accountId);
      if (!currentAccount || currentAccount.status !== 'online' || !currentAccount.authToken || !currentAccount.activeRoom) {
        this.stopGuessCommand(accountId);
        return;
      }
      
      // For simulation purposes, we'll randomly decide if there's a new image
      // In a real implementation, this would analyze room messages for images
      const hasNewImage = Math.random() > 0.7; // 30% chance of detecting a new image
      
      if (hasNewImage && this.isGuessCommandActive(accountId)) {
        // Wait for response delay before guessing
        setTimeout(async () => {
          // Check if bot is still active before sending guess
          if (this.isGuessCommandActive(accountId)) {
            // Send random guess
            await wolfAPI.sendGuessAnswer(currentAccount.authToken, currentAccount.activeRoom);
            
            // Dispatch event for activity log
            window.dispatchEvent(new CustomEvent('app-log', {
              detail: {
                type: 'info',
                message: "تم إرسال تخمين للصورة"
              }
            }));
          }
        }, responseDelay * 1000);
      }
    }, 5000);
    
    // Store timer reference
    this.activeTimers.set(`guess-timer-${accountId}`, timerId);
  }
  
  // Stop guess command
  stopGuessCommand(accountId: string): void {
    // Stop category timer
    const categoryTimer = this.activeTimers.get(`guess-category-${accountId}`);
    if (categoryTimer) {
      clearTimeout(categoryTimer);
      this.activeTimers.delete(`guess-category-${accountId}`);
    }
    
    // Stop auto timer
    const autoTimer = this.activeTimers.get(`guess-auto-${accountId}`);
    if (autoTimer) {
      clearTimeout(autoTimer);
      this.activeTimers.delete(`guess-auto-${accountId}`);
    }
    
    // Stop delay timer
    const delayTimer = this.activeTimers.get(`guess-delay-${accountId}`);
    if (delayTimer) {
      clearTimeout(delayTimer);
      this.activeTimers.delete(`guess-delay-${accountId}`);
    }
    
    // Stop guess timer
    const timer = this.activeTimers.get(`guess-timer-${accountId}`);
    if (timer) {
      clearInterval(timer);
      this.activeTimers.delete(`guess-timer-${accountId}`);
    }
  }
  
  // FISH COMMAND FUNCTIONS
  
  // Start fish command
  async startFishCommand(accountId: string, command: string = '!صيد 3', system: string = 'default'): Promise<boolean> {
    const account = this.accounts.get(accountId);
    if (!account || account.status !== 'online' || !account.authToken || !account.activeRoom) {
      toast({
        title: "لا يمكن بدء أمر الصيد",
        description: "الحساب غير متصل بأي غرفة",
        variant: "destructive"
      });
      return false;
    }
    
    // Stop any previous timers
    this.stopFishCommand(accountId);
    
    try {
      // Store fishing settings using TimerSettings interface
      this.activeTimers.set(`fish-command-${accountId}`, { data: command });
      this.activeTimers.set(`fish-system-${accountId}`, { data: system });
      
      // Handle different fishing systems
      if (system === 'default') {
        // Send initial fish command
        const result = await wolfAPI.sendFishCommand(account.authToken, account.activeRoom, command);
        
        if (result.success) {
          // Dispatch event for activity log
          window.dispatchEvent(new CustomEvent('app-log', {
            detail: {
              type: 'info',
              message: `تم إرسال أمر الصيد: ${command}`
            }
          }));
          
          // Set up timer for regular fishing (every 3630 seconds)
          const timer = setInterval(async () => {
            const currentAccount = this.accounts.get(accountId);
            if (currentAccount?.status === 'online' && currentAccount.authToken && currentAccount.activeRoom) {
              // Get the current fish command
              const currentCommand = this.getFishCommand(accountId) || command;
              
              await wolfAPI.sendFishCommand(currentAccount.authToken, currentAccount.activeRoom, currentCommand);
              
              // Dispatch event for activity log
              window.dispatchEvent(new CustomEvent('app-log', {
                detail: {
                  type: 'info',
                  message: `تم إرسال أمر الصيد الدوري: ${currentCommand}`
                }
              }));
            } else {
              // Stop timer if account becomes inactive
              this.stopFishCommand(accountId);
            }
          }, 3630 * 1000); // 3630 seconds = 60.5 minutes
          
          // Store timer reference
          this.activeTimers.set(`fish-timer-${accountId}`, timer);
        }
      } else if (system === 'bonus') {
        // For bonus system, just enable the detection of bonus-cast messages
        // Dispatch event for activity log
        window.dispatchEvent(new CustomEvent('app-log', {
          detail: {
            type: 'info',
            message: "تم تفعيل نظام معززات الصيد"
          }
        }));
        
        // Store bonus timer (just a placeholder)
        this.activeTimers.set(`fish-bonus-${accountId}`, {});
      }
      
      return true;
    } catch (error) {
      console.error("Error sending fish command:", error);
      return false;
    }
  }
  
  // Stop fish command
  stopFishCommand(accountId: string): void {
    // Stop command timer
    const commandTimer = this.activeTimers.get(`fish-command-${accountId}`);
    if (commandTimer) {
      clearTimeout(commandTimer);
      this.activeTimers.delete(`fish-command-${accountId}`);
    }
    
    // Stop system timer
    const systemTimer = this.activeTimers.get(`fish-system-${accountId}`);
    if (systemTimer) {
      clearTimeout(systemTimer);
      this.activeTimers.delete(`fish-system-${accountId}`);
    }
    
    // Stop fish timer
    const timer = this.activeTimers.get(`fish-timer-${accountId}`);
    if (timer) {
      clearInterval(timer);
      this.activeTimers.delete(`fish-timer-${accountId}`);
    }
    
    // Stop bonus timer
    const bonusTimer = this.activeTimers.get(`fish-bonus-${accountId}`);
    if (bonusTimer) {
      clearTimeout(bonusTimer);
      this.activeTimers.delete(`fish-bonus-${accountId}`);
    }
  }
  
  // Get accounts list
  getAccounts(): WolfAccount[] {
    return Array.from(this.accounts.values());
  }
  
  // Get specific account
  getAccount(accountId: string): WolfAccount | undefined {
    return this.accounts.get(accountId);
  }
  
  // Check if race command is active
  isRaceCommandActive(accountId: string): boolean {
    return this.activeTimers.has(`race-timer-${accountId}`) || 
           this.activeTimers.has(`race-auto-${accountId}`) ||
           this.activeTimers.has(`race-cooldown-${accountId}`);
  }
  
  // Check if race auto detection is active
  isRaceAutoDetectionActive(accountId: string): boolean {
    return this.activeTimers.has(`race-auto-${accountId}`);
  }
  
  // Check if guess command is active
  isGuessCommandActive(accountId: string): boolean {
    return this.activeTimers.has(`guess-category-${accountId}`);
  }
  
  // Check if fish command is active
  isFishCommandActive(accountId: string): boolean {
    return this.activeTimers.has(`fish-timer-${accountId}`);
  }
  
  // Check if fish bonus system is active
  isFishBonusActive(accountId: string): boolean {
    return this.activeTimers.has(`fish-bonus-${accountId}`);
  }
  
  // Get fish system type
  getFishSystemType(accountId: string): 'default' | 'bonus' | null {
    const systemTimer = this.activeTimers.get(`fish-system-${accountId}`);
    if (!systemTimer) return null;
    
    const systemType = systemTimer.data;
    return (systemType === 'default' || systemType === 'bonus') ? systemType : null;
  }
  
  // Get fish command
  getFishCommand(accountId: string): string | null {
    const commandTimer = this.activeTimers.get(`fish-command-${accountId}`);
    if (!commandTimer) return null;
    
    return commandTimer.data || null;
  }
  
  // Get private messages for specific account
  getPrivateMessagesForAccount(accountId: string): PrivateMessage[] {
    const account = this.accounts.get(accountId);
    return account?.privateMessages || [];
  }
}

// Create global account manager
export const accountManager = new WolfAccountManager();
