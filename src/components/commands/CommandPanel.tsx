
import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Fish, Puzzle, Terminal } from 'lucide-react';
import RaceCommandPanel from './RaceCommandPanel';
import GuessCommandPanel from './GuessCommandPanel';
import FishCommandPanel from './FishCommandPanel';
import CustomCommandPanel from './CustomCommandPanel';

const CommandPanel = () => {
  return (
    <GlassCard className="w-full">
      <h3 className="text-lg font-semibold mb-4">لوحة الأوامر</h3>
      
      <Tabs defaultValue="race" className="mt-4">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="race" className="flex items-center gap-1">
            <Car className="h-3 w-3" />
            <span className="hidden sm:inline">سباق</span>
          </TabsTrigger>
          <TabsTrigger value="guess" className="flex items-center gap-1">
            <Puzzle className="h-3 w-3" />
            <span className="hidden sm:inline">خمن</span>
          </TabsTrigger>
          <TabsTrigger value="fish" className="flex items-center gap-1">
            <Fish className="h-3 w-3" />
            <span className="hidden sm:inline">صيد</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-1">
            <Terminal className="h-3 w-3" />
            <span className="hidden sm:inline">مخصص</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="race">
          <RaceCommandPanel />
        </TabsContent>
        
        <TabsContent value="guess">
          <GuessCommandPanel />
        </TabsContent>
        
        <TabsContent value="fish">
          <FishCommandPanel />
        </TabsContent>
        
        <TabsContent value="custom">
          <CustomCommandPanel />
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default CommandPanel;
