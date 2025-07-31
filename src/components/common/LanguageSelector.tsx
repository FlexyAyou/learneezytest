
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-3 py-2 h-auto hover:bg-gray-100 transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg">{currentLang?.flag}</span>
          <span className="hidden sm:inline text-sm font-medium">
            {currentLang?.name}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={currentLanguage === language.code ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start gap-3 h-auto py-2"
              onClick={() => {
                setLanguage(language.code);
                setIsOpen(false);
              }}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
