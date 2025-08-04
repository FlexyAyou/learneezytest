
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, Download, Calendar as CalendarIcon, X } from 'lucide-react';
import { SubscriptionFilters } from '@/types/subscription';

interface SubscriptionFiltersProps {
  filters: SubscriptionFilters;
  onFiltersChange: (filters: SubscriptionFilters) => void;
  onExport: () => void;
  totalResults: number;
}

export const SubscriptionFiltersComponent: React.FC<SubscriptionFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport,
  totalResults
}) => {
  const statusOptions = [
    { value: 'active', label: 'Actif', color: 'bg-green-100 text-green-800' },
    { value: 'trial', label: 'Essai', color: 'bg-blue-100 text-blue-800' },
    { value: 'expired', label: 'Expiré', color: 'bg-red-100 text-red-800' },
    { value: 'cancelled', label: 'Annulé', color: 'bg-gray-100 text-gray-800' },
    { value: 'suspended', label: 'Suspendu', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const planTypeOptions = [
    { value: 'individual', label: 'Individuel' },
    { value: 'team', label: 'Équipe' },
    { value: 'enterprise', label: 'Entreprise' },
    { value: 'education', label: 'Éducation' }
  ];

  const clearFilters = () => {
    onFiltersChange({});
  };

  const removeStatusFilter = (status: string) => {
    const newStatuses = filters.status?.filter(s => s !== status) || [];
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const removePlanTypeFilter = (planType: string) => {
    const newPlanTypes = filters.planType?.filter(p => p !== planType) || [];
    onFiltersChange({
      ...filters,
      planType: newPlanTypes.length > 0 ? newPlanTypes : undefined
    });
  };

  const activeFiltersCount = [
    filters.status?.length || 0,
    filters.planType?.length || 0,
    filters.search ? 1 : 0,
    filters.dateRange ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Barre de recherche et actions principales */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par email, nom ou organisation..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Filtre par statut */}
        <Select
          value=""
          onValueChange={(status) => {
            const currentStatuses = filters.status || [];
            if (!currentStatuses.includes(status)) {
              onFiltersChange({
                ...filters,
                status: [...currentStatuses, status]
              });
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`}></div>
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre par type de plan */}
        <Select
          value=""
          onValueChange={(planType) => {
            const currentPlanTypes = filters.planType || [];
            if (!currentPlanTypes.includes(planType)) {
              onFiltersChange({
                ...filters,
                planType: [...currentPlanTypes, planType]
              });
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type de plan" />
          </SelectTrigger>
          <SelectContent>
            {planTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre par date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px]">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {filters.dateRange ? 'Période sélectionnée' : 'Période'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={{
                from: filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined,
                to: filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined
              }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onFiltersChange({
                    ...filters,
                    dateRange: {
                      start: range.from.toISOString().split('T')[0],
                      end: range.to.toISOString().split('T')[0]
                    }
                  });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Tri */}
        <Select
          value={`${filters.sortBy || 'created'}_${filters.sortOrder || 'desc'}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('_');
            onFiltersChange({
              ...filters,
              sortBy: sortBy as any,
              sortOrder: sortOrder as 'asc' | 'desc'
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_desc">Plus récents</SelectItem>
            <SelectItem value="created_asc">Plus anciens</SelectItem>
            <SelectItem value="revenue_desc">Revenus (↓)</SelectItem>
            <SelectItem value="revenue_asc">Revenus (↑)</SelectItem>
            <SelectItem value="expiry_asc">Expiration proche</SelectItem>
            <SelectItem value="users_desc">Plus d'utilisateurs</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Badges des filtres actifs */}
      {(filters.status?.length || filters.planType?.length || filters.search || filters.dateRange) && (
        <div className="flex flex-wrap gap-2">
          {filters.status?.map(status => {
            const option = statusOptions.find(o => o.value === status);
            return (
              <Badge key={status} variant="secondary" className="flex items-center gap-1">
                {option?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeStatusFilter(status)}
                />
              </Badge>
            );
          })}
          {filters.planType?.map(planType => {
            const option = planTypeOptions.find(o => o.value === planType);
            return (
              <Badge key={planType} variant="secondary" className="flex items-center gap-1">
                {option?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removePlanTypeFilter(planType)}
                />
              </Badge>
            );
          })}
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              "{filters.search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, search: undefined })}
              />
            </Badge>
          )}
          {filters.dateRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.dateRange.start} - {filters.dateRange.end}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, dateRange: undefined })}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Résultats */}
      <div className="text-sm text-gray-600">
        {totalResults} abonnement{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
      </div>
    </div>
  );
};
