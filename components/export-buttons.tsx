'use client';

import { useState } from 'react';
import { FileDown, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  exportData,
  type ExportColumn,
  type ExportFormat,
} from '@/lib/export-utils';

interface ExportButtonsProps {
  label?: string;
  data?: Record<string, unknown>[];
  columns?: ExportColumn[];
  filename?: string;
}

export function ExportButtons({
  label = 'data',
  data = [],
  columns = [],
  filename,
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const fileBase = filename || label.toLowerCase().replace(/\s+/g, '-');

  const handleExport = (format: ExportFormat) => {
    if (data.length === 0 || columns.length === 0) {
      toast.info('No data available to export.');
      return;
    }

    setIsExporting(true);
    try {
      exportData(data, columns, fileBase, format, label);
      const formatLabel =
        format === 'pdf' ? 'PDF' : format === 'excel' ? 'Excel' : format === 'csv' ? 'CSV' : 'Print';
      toast.success(`${label} exported as ${formatLabel}`, {
        description: data.length > 0 ? `${data.length} records exported` : undefined,
      });
    } catch {
      toast.error(`Failed to export ${label}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={isExporting}
        onClick={() => handleExport('pdf')}
      >
        <FileDown className="h-4 w-4" />
        <span className="hidden sm:inline">PDF</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={isExporting}
        onClick={() => handleExport('excel')}
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden sm:inline">Excel</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={isExporting}
        onClick={() => handleExport('print')}
      >
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>
    </div>
  );
}
