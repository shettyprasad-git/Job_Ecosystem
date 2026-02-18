'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { JobStatus } from "@/lib/types";

type StatusDropdownProps = {
  status: JobStatus;
  onStatusChange: (newStatus: JobStatus) => void;
}

export const StatusDropdown = ({ status, onStatusChange }: StatusDropdownProps) => {
  const statusConfig: { [key in JobStatus]: string } = {
    'Not Applied': 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    'Applied': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
    'Selected': 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
  };
  const statuses: JobStatus[] = ['Not Applied', 'Applied', 'Selected', 'Rejected'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${statusConfig[status]}`}>
          {status}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Set Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={(value) => onStatusChange(value as JobStatus)}>
          {statuses.map(s => (
            <DropdownMenuRadioItem key={s} value={s}>{s}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
