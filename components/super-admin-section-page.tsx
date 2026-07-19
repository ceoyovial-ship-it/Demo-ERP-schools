'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Trash2, ToggleLeft, Plus, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { superAdminSections } from '@/lib/super-admin-data';

interface SuperAdminSectionPageProps<T extends { id: string; status?: string }> {
  sectionKey: keyof typeof superAdminSections;
  title: string;
  description: string;
  data: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  emptyMessage?: string;
}

export function SuperAdminSectionPage<T extends { id: string; status?: string }>({
  sectionKey,
  title,
  description,
  data,
  columns,
  searchKeys,
  emptyMessage = 'No matching records found',
}: SuperAdminSectionPageProps<T>) {
  const [records, setRecords] = useState<T[]>(data);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionLabel, setActionLabel] = useState('');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setRecords(data);
  }, [data]);

  const exportColumns = useMemo(
    () =>
      columns.map((column) => ({
        key: String(column.key),
        label: column.header,
      })),
    [columns]
  );

  const onAction = (action: 'add' | 'edit' | 'delete' | 'view' | 'toggle') => {
    if (action === 'delete') {
      setActionLabel('Delete record');
      setConfirmOpen(true);
      return;
    }

    if (action === 'toggle') {
      setRecords((current) =>
        current.map((record) => {
          if (!record.status) return record;
          return {
            ...record,
            status: record.status === 'active' ? 'inactive' : 'active',
          };
        })
      );
      toast.success('Status updated successfully');
      return;
    }

    toast.info(`${action.charAt(0).toUpperCase() + action.slice(1)} action triggered for ${title}`);
  };

  const sectionMeta = superAdminSections[sectionKey];

  return (
    <div className="space-y-6">
      <PageHeader title={sectionMeta.title} description={sectionMeta.description}>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => onAction('add')}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => onAction('edit')}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => onAction('view')}>
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => onAction('toggle')}>
            <ToggleLeft className="h-4 w-4" />
            Status Toggle
          </Button>
        </div>
      </PageHeader>

      <SectionCard title={title} description={description}>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search records"
                className="w-full sm:w-72"
              />
              <Button variant="outline" size="sm" onClick={() => toast.info('Filters opened for the selected section')}>
                Filters
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info('Sorting applied in the list header')}>
                Sorting
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ExportButtons label={title} data={records as unknown as Record<string, unknown>[]} columns={exportColumns} filename={title.toLowerCase().replace(/\s+/g, '-')} />
              <Button variant="outline" size="sm" onClick={() => onAction('delete')} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-xl border bg-muted/20 p-4">
                  <div className="mb-3 h-4 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-8 animate-pulse rounded bg-muted/60" />
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/20 py-12 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <DataTable
              data={records}
              columns={columns}
              pageSize={5}
              searchKeys={searchKeys}
              searchPlaceholder={`Search ${title.toLowerCase()}`}
              emptyMessage={emptyMessage}
              initialSort={{ key: 'id', dir: 'asc' }}
            />
          )}
        </div>
      </SectionCard>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
            <DialogDescription>
              This will trigger the {actionLabel.toLowerCase()} action for the selected super admin section.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setConfirmOpen(false);
              toast.success(`${actionLabel} completed successfully`);
            }}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
