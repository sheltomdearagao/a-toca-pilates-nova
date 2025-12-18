import { useState } from 'react';
import { useOrganization } from '@/contexts/OrganizationProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const OrganizationSwitcher = () => {
  const { organization, organizations, isLoading, switchOrganization } = useOrganization();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-10 w-48" />;
  }

  if (!organization || organizations.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
        <Building className="h-4 w-4" />
        <span className="font-medium">{organization?.name || 'Organização'}</span>
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-48 justify-between"
        >
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="font-medium truncate">{organization.name}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => switchOrganization(org.id)}
            className={org.id === organization.id ? 'bg-accent' : ''}
          >
            <Building className="mr-2 h-4 w-4" />
            <span className="truncate">{org.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;