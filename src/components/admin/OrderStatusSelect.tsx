
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>;
  disabled?: boolean;
}

const STATUS_OPTIONS = [
  { value: "Processing", label: "Processing" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
  onStatusChange,
  disabled = false,
}: OrderStatusSelectProps) {
  const handleValueChange = (newStatus: string) => {
    if (newStatus !== currentStatus) {
      onStatusChange(orderId, newStatus);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentStatus}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full h-9 text-xs">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {disabled && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
