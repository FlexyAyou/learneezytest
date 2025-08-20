
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation, useLanguages } from '@/hooks/useTranslation';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, changeLanguage } = useTranslation();
  const { languages } = useLanguages();

  const handleLanguageChange = async (value: string) => {
    await changeLanguage(value);
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-500" />
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px] h-8 text-sm border-gray-200">
          <SelectValue>
            <div className="flex items-center space-x-1">
              <span>{currentLanguage?.flag}</span>
              <span>{currentLanguage?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
