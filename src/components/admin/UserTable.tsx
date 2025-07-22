
'use client';

import type { AppUser } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface UserTableProps {
  users: AppUser[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] rounded-md border">
      <Table>
        <TableCaption>A list of all registered users.</TableCaption>
        <TableHeader className="sticky top-0 bg-muted z-10">
          <TableRow>
            <TableHead className="w-[150px] sm:w-[200px] px-2 py-3 sm:px-4">User ID</TableHead>
            <TableHead className="px-2 py-3 sm:px-4">Full Name</TableHead>
            <TableHead className="px-2 py-3 sm:px-4">Email</TableHead>
            <TableHead className="hidden sm:table-cell px-2 py-3 sm:px-4">Phone Number</TableHead>
            <TableHead className="text-right px-2 py-3 sm:px-4">Joined Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium truncate px-2 py-3 sm:px-4" title={user.id}>{user.id}</TableCell>
              <TableCell className="px-2 py-3 sm:px-4">{user.full_name || 'N/A'}</TableCell>
              <TableCell className="truncate px-2 py-3 sm:px-4" title={user.email || undefined}>{user.email || 'N/A'}</TableCell>
              <TableCell className="hidden sm:table-cell px-2 py-3 sm:px-4">{user.phone_number || 'N/A'}</TableCell>
              <TableCell className="text-right text-xs sm:text-sm px-2 py-3 sm:px-4">
                {user.created_at ? format(new Date(user.created_at), "MMM d, yyyy") : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <p className="p-4 text-center text-muted-foreground">No users found.</p>
      )}
    </ScrollArea>
  );
}
