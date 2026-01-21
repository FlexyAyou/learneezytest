import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  BookOpen, 
  Building2, 
  Calendar, 
  Award, 
  Search, 
  Copy, 
  CheckCircle,
  Info
} from 'lucide-react';
import { DYNAMIC_FIELDS, DynamicField } from './types';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DynamicFieldsPanelProps {
  onInsertField: (field: string) => void;
}

export const DynamicFieldsPanel: React.FC<DynamicFieldsPanelProps> = ({ onInsertField }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = [
    { id: 'apprenant', label: 'Apprenant', icon: User, color: 'text-blue-500' },
    { id: 'formation', label: 'Formation', icon: BookOpen, color: 'text-green-500' },
    { id: 'of', label: 'Organisme', icon: Building2, color: 'text-purple-500' },
    { id: 'dates', label: 'Dates', icon: Calendar, color: 'text-orange-500' },
    { id: 'evaluation', label: 'Évaluation', icon: Award, color: 'text-teal-500' },
  ];

  const handleInsertField = (field: DynamicField) => {
    onInsertField(field.key);
    setCopiedField(field.key);
    toast({
      title: "Champ inséré",
      description: `Le champ "${field.label}" a été inséré dans le document`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyField = (field: DynamicField) => {
    navigator.clipboard.writeText(field.key);
    setCopiedField(field.key);
    toast({
      title: "Copié !",
      description: `${field.key} copié dans le presse-papier`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredFields = DYNAMIC_FIELDS.filter(field =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFieldsByCategory = (category: string) => {
    return filteredFields.filter(field => field.category === category);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Champs dynamiques
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Cliquez pour insérer un champ dans le document
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un champ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="apprenant" className="w-full">
          <TabsList className="grid grid-cols-5 w-full h-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="flex flex-col items-center gap-1 py-2 px-1"
                >
                  <Icon className={`h-4 w-4 ${cat.color}`} />
                  <span className="text-xs">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-3">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {getFieldsByCategory(cat.id).map((field) => (
                    <TooltipProvider key={field.key}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`group p-3 rounded-lg border transition-all cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              copiedField === field.key ? 'border-green-500 bg-green-50' : ''
                            }`}
                            onClick={() => handleInsertField(field)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{field.label}</span>
                                  {copiedField === field.key && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                                <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded mt-1 inline-block">
                                  {field.key}
                                </code>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyField(field);
                                }}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="font-medium">{field.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Exemple: <span className="font-mono">{field.example}</span>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  
                  {getFieldsByCategory(cat.id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Aucun champ trouvé</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <div className="pt-3 border-t">
          <Badge variant="outline" className="text-xs">
            {DYNAMIC_FIELDS.length} champs disponibles
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
