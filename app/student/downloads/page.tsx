'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, FileImage, Search } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import { getStudentKey, studentDownloads } from '@/lib/student-data';

const selectClassStyle = 'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

export default function DownloadsPage() {
  const { profile } = useAuth();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const downloads = studentDownloads[key];
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredDownloads = useMemo(() => {
    return downloads.filter((d) => {
      if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.subject.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [downloads, search, categoryFilter]);

  const categories = Array.from(new Set(downloads.map((d) => d.category)));
  const totalSize = downloads.length;

  const handleDownload = (name: string, type: string) => {
    toast.success('Download started', { description: `${name} (${type})` });
  };

  const getFileIcon = (type: string) => {
    if (type === 'PDF') return FileText;
    if (type === 'XLSX' || type === 'Excel') return FileSpreadsheet;
    return FileImage;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Downloads" description="Study materials and documents" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Files" value={totalSize} icon={Download} delay={0} />
        <StatCard title="Categories" value={categories.length} icon={FileText} delay={0.05} />
        <StatCard title="Subjects" value={Array.from(new Set(downloads.map((d) => d.subject))).length} icon={FileText} delay={0.1} />
      </div>

      <SectionCard title="Available Downloads" description={`${filteredDownloads.length} files`} delay={0.2}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Category</Label><select className={selectClassStyle} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option value="all">All Categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="space-y-1.5 sm:min-w-[200px]">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 pl-10" /></div>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredDownloads.map((file, i) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <motion.div key={file.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3 rounded-xl border p-4 transition-all hover:shadow-premium">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><FileIcon className="h-5 w-5 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{file.subject}</span><span>·</span><span>{file.fileSize}</span><span>·</span><span>{file.uploadedDate}</span>
                    <Badge variant="secondary" className="text-xs">{file.category}</Badge>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => handleDownload(file.name, file.type)}><Download className="h-4 w-4" /></Button>
              </motion.div>
            );
          })}
          {filteredDownloads.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground sm:col-span-2">No files found</div>}
        </div>
      </SectionCard>
    </div>
  );
}
