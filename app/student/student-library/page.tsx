'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Library, BookOpen, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { getStudentKey, studentLibrary } from '@/lib/student-data';

export default function StudentLibraryPage() {
  const { profile } = useAuth();
  const key = getStudentKey(profile?.email?.split('@')[0]);
  const [books, setBooks] = useState(studentLibrary[key]);

  const borrowedCount = books.filter((b) => b.status === 'borrowed').length;
  const overdueCount = books.filter((b) => b.status === 'overdue').length;
  const returnedCount = books.filter((b) => b.status === 'returned').length;
  const totalFine = books.reduce((sum, b) => sum + b.fine, 0);

  const handleReturn = (id: string, title: string) => {
    const today = new Date().toISOString().split('T')[0];
    setBooks((prev) => prev.map((book) =>
      book.id === id ? { ...book, status: 'returned', returnDate: today, fine: 0 } : book
    ));
    toast.success('Book returned successfully', { description: `"${title}" has been marked as returned` });
  };

  const statusConfig = {
    borrowed: { icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    returned: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    overdue: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Library" description="Your borrowed books and library records" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Books" value={books.length} icon={Library} delay={0} />
        <StatCard title="Borrowed" value={borrowedCount} icon={BookOpen} delay={0.05} />
        <StatCard title="Overdue" value={overdueCount} icon={AlertCircle} changeType="negative" delay={0.1} />
        <StatCard title="Total Fine" value={`₹${totalFine}`} icon={AlertCircle} changeType={totalFine > 0 ? 'negative' : 'neutral'} delay={0.15} />
      </div>

      <SectionCard title="My Books" description={`${books.length} books`} delay={0.2}>
        <div className="space-y-3">
          {books.map((book, i) => {
            const config = statusConfig[book.status];
            const StatusIcon = config.icon;
            return (
              <motion.div key={book.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`rounded-xl border p-4 ${book.status === 'overdue' ? 'border-destructive/30' : ''} transition-all hover:shadow-premium`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}><StatusIcon className={`h-5 w-5 ${config.color}`} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{book.title}</p><Badge variant="secondary" className={`text-xs capitalize ${config.bg} ${config.color}`}>{book.status}</Badge></div>
                    <p className="mt-1 text-xs text-muted-foreground">By {book.author} · ISBN: {book.isbn}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Issued: {book.issueDate}</span><span>Due: {book.dueDate}</span>
                      {book.returnDate && <span>Returned: {book.returnDate}</span>}
                      {book.fine > 0 && <Badge variant="secondary" className="bg-destructive/10 text-destructive text-xs">Fine: ₹{book.fine}</Badge>}
                    </div>
                  </div>
                  {book.status !== 'returned' && <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => handleReturn(book.id, book.title)}><Download className="h-3.5 w-3.5" />Return</Button>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
