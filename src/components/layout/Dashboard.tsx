
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Car, Fish, Settings } from "lucide-react";
import RaceCommandPanel from "@/components/commands/RaceCommandPanel";
import FishCommandPanel from "@/components/commands/FishCommandPanel";
import { Separator } from "@/components/ui/separator";
import AccountsPanel from "@/components/accounts/AccountsPanel";
import { useAccounts } from "@/contexts/AccountContext";
import SettingsPanel from "@/components/settings/SettingsPanel";

export function Dashboard() {
  const { isRaceCommandActive, isFishCommandActive } = useAccounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">إدارة الحسابات والبوتات</p>
      </div>

      <Separator />

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span>الحسابات</span>
          </TabsTrigger>
          <TabsTrigger value="race" className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            <span>بوت السباق {isRaceCommandActive && "🟢"}</span>
          </TabsTrigger>
          <TabsTrigger value="fish" className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            <span>بوت الصيد {isFishCommandActive && "🟢"}</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>الإعدادات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          <AccountsPanel />
        </TabsContent>

        <TabsContent value="race" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RaceCommandPanel />
            </div>
            <div>
              <RaceStats />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fish" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FishCommandPanel />
            </div>
            <div>
              <FishingStats />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RaceStats() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Car className="h-4 w-4 text-wolf-primary" />
        <span>إحصائيات السباق</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600">عدد الجولات</div>
          <div className="text-lg font-bold text-wolf-primary">24</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600">المركز الحالي</div>
          <div className="text-lg font-bold text-wolf-primary">3</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600">أفضل مركز</div>
          <div className="text-lg font-bold text-wolf-primary">1</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600">الجوائز</div>
          <div className="text-lg font-bold text-wolf-primary">2</div>
        </div>
      </div>
    </div>
  );
}

function FishingStats() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Fish className="h-4 w-4 text-wolf-primary" />
        <span>إحصائيات الصيد</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600">عدد عمليات الصيد</div>
          <div className="text-lg font-bold text-wolf-primary">12</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600">مرات الانتقال</div>
          <div className="text-lg font-bold text-wolf-primary">8</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600">الأسماك المصطادة</div>
          <div className="text-lg font-bold text-wolf-primary">25</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600">المكافآت</div>
          <div className="text-lg font-bold text-wolf-primary">3</div>
        </div>
      </div>
    </div>
  );
}
