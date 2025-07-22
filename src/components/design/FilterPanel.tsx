
'use client';

import type { ClothingFilters } from '@/types';
import { CLOTHING_SIZES, CLOTHING_MATERIALS } from '@/config/clothingOptions';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface FilterPanelProps {
  filters: ClothingFilters;
  onFilterChange: <K extends keyof ClothingFilters>(filter: K, value: ClothingFilters[K]) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>2. Select Preferences</CardTitle>
        <CardDescription>Choose the size and material for your design.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="clothingMaterial">Material</Label>
          <Select
            value={filters.material}
            onValueChange={(value) => onFilterChange('material', value as ClothingFilters['material'])}
          >
            <SelectTrigger id="clothingMaterial" className="w-full">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {CLOTHING_MATERIALS.map((material) => (
                <SelectItem key={material.value} value={material.value}>
                  {material.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clothingSize">Size</Label>
          <Select
            value={filters.size}
            onValueChange={(value) => onFilterChange('size', value as ClothingFilters['size'])}
          >
            <SelectTrigger id="clothingSize" className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {CLOTHING_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

