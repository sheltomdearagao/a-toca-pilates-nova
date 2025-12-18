import { useState } from 'react';
import { useOrganization } from '@/contexts/OrganizationProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Building, ChevronDown, CheckCircle, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const OrganizationSwitcher = () => {
  const { organization, organizations, isLoading, switchOrganization } = useOrganization();
  const [open, setOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-10 w-48" />;
  }

  if (!organization) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <span className="font-medium text-destructive text-sm">Sem organização</span>
      </div>
    );
  }

  const handleSwitch = async (orgId: string) => {
    if (orgId === organization.id) {
      setOpen(false);
      return;
    }

    setIsSwitching(true);
    try {
      await switchOrganization(orgId);
      setOpen(false);
    } catch (error) {
      console.error('Failed to switch organization:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  if (organizations.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
        <Building className="h-4 w-4 text-primary" />
        <span className="font-medium">{organization.name}</span>
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
          className="w-full justify-between"
          disabled={isSwitching}
        >
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="font-medium truncate">{organization.name}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Suas Organizações
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => handleSwitch(org.id)}
            className={cn(
              "cursor-pointer",
              org.id === organization.id && "bg-accent"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Building className="mr-2 h-4 w-4" />
                <span className="truncate">{org.name}</span>
              </div>
              {org.id === organization.id && (
                <CheckCircle className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        {organizations.length > 1 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              <AlertTriangle className="inline h-3 w-3 mr-1" />
              Trocar organização recarregará a página
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;