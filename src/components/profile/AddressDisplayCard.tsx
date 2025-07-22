
'use client';

import type { Address } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Trash2, Edit3, CheckCircle } from 'lucide-react';

// Updated to accept a more generic address type that might come from DB (with id, full_name, zip_code)
// or from frontend state (fullName, zipCode).
interface AddressDisplayCardProps {
  address: Partial<Address> & { id?: string; full_name?: string; zip_code?: string; };
  onSelect?: (addressWithId: Partial<Address> & { id?: string }) => void;
  onEdit?: (addressWithId: Partial<Address> & { id: string }) => void;
  onDelete?: (addressId: string) => void;
  isSelected?: boolean;
  className?: string;
  showActions?: boolean;
  showSelectButton?: boolean;
}

export default function AddressDisplayCard({
  address,
  onSelect,
  onEdit,
  onDelete,
  isSelected,
  className,
  showActions = false,
  showSelectButton = false,
}: AddressDisplayCardProps) {
  // Prioritize specific props if available (e.g., full_name from DB, fallback to fullName)
  const displayName = address.full_name || address.fullName || "N/A";
  const displayZip = address.zip_code || address.zipCode || "N/A";

  return (
    <Card className={`transition-all ${isSelected ? 'ring-2 ring-primary border-primary shadow-lg' : 'border-border hover:shadow-md'} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-md font-semibold flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          {displayName}
        </CardTitle>
        {isSelected && <CheckCircle className="h-5 w-5 text-green-500" />}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground pb-4 px-4 space-y-0.5">
        <p>{address.street || "N/A"}</p>
        <p>
          {address.city || "N/A"}, {address.state || "N/A"} {displayZip}
        </p>
        <p>{address.country || "N/A"}</p>
        {(showActions && address.id) && (
          <div className="flex gap-2 pt-3">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(address as Address & { id: string })}>
                <Edit3 className="mr-1 h-3 w-3" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(address.id!)}>
                <Trash2 className="mr-1 h-3 w-3" /> Delete
              </Button>
            )}
          </div>
        )}
        {showSelectButton && onSelect && !isSelected && (
             <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => onSelect(address)}>
                Select this Address
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
