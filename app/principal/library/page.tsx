'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Library,
  BookOpen,
  BookCheck,
  AlertCircle,
  BookX,
} from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { DataTable, type Column } from '@/components/data-table';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { libraryBooks, issuedBooks } from '@/lib/erp-data';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types & derived data                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = 'books' | 'issued' | 'fines';

interface LibraryBookRow {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  available: number;
  shelf: string;
  status: string;
}

interface IssuedBookRow {
  id: string;
  bookTitle: string;
  isbn: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  issueDate: string;
  dueDate: string;
  status: 'issued' | 'overdue';
  fine: number;
}

/** Normalise libraryBooks into rows that satisfy DataTable's `{ id }` constraint. */
const bookRows: LibraryBookRow[] = libraryBooks.map((b) => ({
  id: b.id,
  isbn: b.isbn,
  title: b.title,
  author: b.author,
  category: b.category,
  copies: b.copies,
  available: b.available ? b.copies : 0,
  shelf: b.shelf,
  status: b.status,
}));

/** Normalise issuedBooks into rows for the Issued tab. */
const issuedRows: IssuedBookRow[] = issuedBooks.map((b) => ({
  id: b.id,
  bookTitle: b.bookTitle,
  isbn: b.isbn,
  studentName: b.studentName,
  admissionNumber: b.admissionNumber,
  class: b.class,
  issueDate: b.issueDate,
  dueDate: b.dueDate,
  status: b.status as 'issued' | 'overdue',
  fine: b.fine,
}));

/** Aggregate stats derived from the datasets. */
const totalBooksCount = libraryBooks.reduce((acc, b) => acc + b.copies, 0);
const issuedCount = issuedBooks.length;
const availableCount = totalBooksCount - issuedBooks.length;
const initialTotalFinesAmount = issuedBooks.reduce((acc, b) => acc + b.fine, 0);

/* -------------------------------------------------------------------------- */
/*  Tab configuration                                                         */
/* -------------------------------------------------------------------------- */

const tabs: { key: TabKey; label: string; icon: typeof Library }[] = [
  { key: 'books', label: 'Books', icon: BookOpen },
  { key: 'issued', label: 'Issued', icon: BookCheck },
  { key: 'fines', label: 'Fines', icon: AlertCircle },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('books');
  const [issuedItems, setIssuedItems] = useState(issuedRows);

  /* ------------------------------ Books columns ----------------------------- */
  const bookColumns: Column<LibraryBookRow>[] = [
    {
      key: 'isbn',
      header: 'ISBN',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.isbn}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (row) => <span className="font-medium">{row.title}</span>,
      className: 'min-w-[180px]',
    },
    {
      key: 'author',
      header: 'Author',
      sortable: true,
      className: 'whitespace-nowrap',
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {row.category}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'copies',
      header: 'Copies',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums font-medium">{row.copies}</span>
      ),
      className: 'tabular-nums',
    },
    {
      key: 'available',
      header: 'Available',
      sortable: true,
      render: (row) => (
        <span
          className={cn(
            'tabular-nums font-medium',
            row.available > 0 ? 'text-success' : 'text-destructive'
          )}
        >
          {row.available}
        </span>
      ),
      className: 'tabular-nums',
    },
    {
      key: 'shelf',
      header: 'Shelf',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs">{row.shelf}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.status}
          variant={row.status === 'available' ? 'success' : 'warning'}
        />
      ),
      className: 'whitespace-nowrap',
    },
  ];

  /* ----------------------------- Issued columns ----------------------------- */
  const issuedColumns: Column<IssuedBookRow>[] = [
    {
      key: 'bookTitle',
      header: 'Book Title',
      sortable: true,
      render: (row) => <span className="font-medium">{row.bookTitle}</span>,
      className: 'min-w-[180px]',
    },
    {
      key: 'isbn',
      header: 'ISBN',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.isbn}</span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'studentName',
      header: 'Student Name',
      sortable: true,
      render: (row) => <span className="font-medium">{row.studentName}</span>,
      className: 'whitespace-nowrap',
    },
    {
      key: 'admissionNumber',
      header: 'Admission No',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.admissionNumber}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'class',
      header: 'Class',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
          {row.class}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums text-muted-foreground">{row.issueDate}</span>
      ),
      className: 'whitespace-nowrap tabular-nums',
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (row) => (
        <span
          className={cn(
            'tabular-nums',
            row.status === 'overdue' ? 'font-medium text-destructive' : 'text-muted-foreground'
          )}
        >
          {row.dueDate}
        </span>
      ),
      className: 'whitespace-nowrap tabular-nums',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.status}
          variant={row.status === 'overdue' ? 'destructive' : 'warning'}
        />
      ),
      className: 'whitespace-nowrap',
    },
    {
      key: 'fine',
      header: 'Fine',
      sortable: true,
      render: (row) =>
        row.fine > 0 ? (
          <span className="tabular-nums font-medium text-destructive">
            ₹{row.fine.toLocaleString('en-IN')}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
      className: 'whitespace-nowrap tabular-nums',
    },
  ];

  /* ------------------------------- Fines data ------------------------------- */
  const finesList = useMemo(
    () => issuedItems.filter((b) => b.fine > 0),
    [issuedItems]
  );

  const pendingFines = useMemo(
    () => finesList.reduce((sum, item) => sum + item.fine, 0),
    [finesList]
  );
  const collectedFines = useMemo(
    () => Math.max(0, initialTotalFinesAmount - pendingFines),
    [pendingFines]
  );

  const handleCollectFine = (studentName: string, bookTitle: string, amount: number) => {
    setIssuedItems((prev) =>
      prev.map((item) =>
        item.studentName === studentName && item.bookTitle === bookTitle && item.fine > 0
          ? { ...item, fine: 0, status: 'issued' }
          : item
      )
    );
    toast.success('Fine collected', {
      description: `₹${amount.toLocaleString('en-IN')} collected from ${studentName} for "${bookTitle}"`,
    });
  };

  /* --------------------------------- Render --------------------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Library Management"
        description="Manage books, issues, returns, and fines"
      >
        <ExportButtons
          label="library data"
          data={issuedItems as unknown as Record<string, unknown>[]}
          columns={[
            { key: 'bookTitle', label: 'Book Title' },
            { key: 'isbn', label: 'ISBN' },
            { key: 'studentName', label: 'Student Name' },
            { key: 'admissionNumber', label: 'Admission No' },
            { key: 'class', label: 'Class' },
            { key: 'issueDate', label: 'Issue Date' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'status', label: 'Status' },
            { key: 'fine', label: 'Fine' },
          ]}
          filename="library-report"
        />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Books"
          value={totalBooksCount.toLocaleString('en-IN')}
          icon={Library}
          change={`${libraryBooks.length} unique titles`}
          changeType="neutral"
          delay={0}
        />
        <StatCard
          title="Issued"
          value={issuedCount}
          icon={BookOpen}
          change={`${issuedRows.filter((b) => b.status === 'overdue').length} overdue`}
          changeType="negative"
          delay={0.05}
        />
        <StatCard
          title="Available"
          value={availableCount}
          icon={BookCheck}
          change={`${Math.round((availableCount / totalBooksCount) * 100)}% of stock`}
          changeType="positive"
          delay={0.1}
        />
        <StatCard
          title="Total Fines"
          value={`₹${pendingFines.toLocaleString('en-IN')}`}
          icon={AlertCircle}
          change={`${finesList.length} students fined`}
          changeType="negative"
          delay={0.15}
        />
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-1.5 shadow-premium">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                toast.info(`Switched to ${tab.label} view`);
              }}
              className={cn(
                'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TabIcon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'books' && (
          <motion.div
            key="books"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Book Catalog"
              description="Complete inventory of books in the library collection"
            >
              <DataTable
                data={bookRows}
                columns={bookColumns}
                pageSize={10}
                searchKeys={['title', 'author', 'isbn', 'category']}
                searchPlaceholder="Search by title, author, ISBN..."
                initialSort={{ key: 'title', dir: 'asc' }}
              />
            </SectionCard>
          </motion.div>
        )}

        {activeTab === 'issued' && (
          <motion.div
            key="issued"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SectionCard
              title="Issued Books"
              description="Books currently issued to students with due dates and fines"
            >
              <DataTable
                data={issuedItems}
                columns={issuedColumns}
                pageSize={10}
                searchKeys={['bookTitle', 'studentName', 'isbn', 'admissionNumber']}
                searchPlaceholder="Search by book, student, ISBN..."
                initialSort={{ key: 'dueDate', dir: 'asc' }}
              />
            </SectionCard>
          </motion.div>
        )}

        {activeTab === 'fines' && (
          <motion.div
            key="fines"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Summary card */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SectionCard title="Total Fines" delay={0}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight">
                    ₹{initialTotalFinesAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Combined value of all outstanding fines
                </p>
              </SectionCard>

              <SectionCard title="Collected" delay={0.05}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-success">
                    ₹{collectedFines.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Fines collected this term
                </p>
              </SectionCard>

              <SectionCard title="Pending" delay={0.1}>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-destructive">
                    ₹{pendingFines.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Across {finesList.length} overdue students
                </p>
              </SectionCard>
            </div>

            {/* Overdue students list */}
            <SectionCard
              title="Overdue Students"
              description="Students with overdue books and outstanding fine amounts"
            >
              {finesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                    <BookX className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No outstanding fines</p>
                    <p className="text-xs text-muted-foreground">
                      All library dues have been cleared
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {finesList.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <p className="truncate font-medium">{item.studentName}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {item.bookTitle}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                              {item.class}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {item.admissionNumber}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-lg font-bold text-destructive">
                            ₹{item.fine.toLocaleString('en-IN')}
                          </span>
                          <StatusBadge status="overdue" variant="destructive" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t pt-3">
                        <div className="text-xs text-muted-foreground">
                          Due: <span className="font-medium text-foreground">{item.dueDate}</span>
                        </div>
                        <button
                          onClick={() =>
                            handleCollectFine(item.studentName, item.bookTitle, item.fine)
                          }
                          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <BookCheck className="h-3.5 w-3.5" />
                          Collect Fine
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
