import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoomFilters as RoomFiltersType } from '@/hooks/useRooms';
import { Constants, Database } from '@/integrations/supabase/types';

type PropertyType = Database['public']['Enums']['property_type'];
type TenantPreference = Database['public']['Enums']['tenant_preference'];

interface RoomFiltersProps {
  onFilterChange: (filters: RoomFiltersType) => void;
}

const propertyTypes = Constants.public.Enums.property_type;
const tenantPreferences = Constants.public.Enums.tenant_preference;

export function RoomFilters({ onFilterChange }: RoomFiltersProps) {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [tenantPreference, setTenantPreference] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onFilterChange({
      city: city || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      propertyType: propertyType && propertyType !== 'all' ? (propertyType as PropertyType) : undefined,
      tenantPreference: tenantPreference && tenantPreference !== 'all' ? (tenantPreference as TenantPreference) : undefined,
    });
  };

  const handleClear = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('');
    setTenantPreference('');
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg border-2 border-border/50 p-3 shadow-sm">
      {/* Compact Main Search */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-9 h-10 text-sm bg-background border-border/50"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button
          onClick={handleSearch}
          size="sm"
          className="h-10 px-6 gradient-warm text-primary-foreground shadow-warm font-semibold"
        >
          Search
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="h-10 px-4"
        >
          <SlidersHorizontal className="w-4 h-4 mr-1.5" />
          Filters
        </Button>
      </div>

      {/* Compact Advanced Filters */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-border/50 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Price Range */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Min Price (₹)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-9 text-sm bg-background"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Max Price (₹)
              </label>
              <Input
                type="number"
                placeholder="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-9 text-sm bg-background"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Property Type
              </label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-9 text-sm bg-background">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tenant Preference */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">
                Tenant Type
              </label>
              <Select value={tenantPreference} onValueChange={setTenantPreference}>
                <SelectTrigger className="h-9 text-sm bg-background">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  {tenantPreferences.map((pref) => (
                    <SelectItem key={pref} value={pref}>
                      {pref}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={handleSearch} className="gradient-warm text-primary-foreground h-9">
              Apply
            </Button>
            <Button size="sm" variant="outline" onClick={handleClear} className="h-9">
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
