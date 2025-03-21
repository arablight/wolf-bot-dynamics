
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-200 flex items-center justify-between",
      scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-wolf-primary to-wolf-secondary bg-clip-text text-transparent">
          WOLF Dynamics
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
