'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  BookOpen,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Pencil,
  Trash2,
  Copy,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { ExportButtons } from '@/components/export-buttons';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface LessonPlan {
  id: string;
  chapter: string;
  subject: string;
  classGrade: string;
  section: string;
  teacher: string;
  status: 'published' | 'draft';
  createdDate: string;
  objective: string;
}

/* -------------------------------------------------------------------------- */
/*  Inline data                                                               */
/* -------------------------------------------------------------------------- */

const LESSON_PLANS: LessonPlan[] = [
  {
    id: 'LP-001',
    chapter: 'Real Numbers and Euclid’s Division Lemma',
    subject: 'Mathematics',
    classGrade: 'Grade 10',
    section: 'A',
    teacher: 'Anjali Mehta',
    status: 'published',
    createdDate: '2026-07-02',
    objective: 'Prove the fundamental theorem of arithmetic and apply it to HCF/LCM problems.',
  },
  {
    id: 'LP-002',
    chapter: 'Chemical Reactions and Equations',
    subject: 'Science',
    classGrade: 'Grade 10',
    section: 'B',
    teacher: 'Rohit Verma',
    status: 'published',
    createdDate: '2026-07-04',
    objective: 'Balance chemical equations and identify oxidation–reduction reactions.',
  },
  {
    id: 'LP-003',
    chapter: 'A Letter to God — Prose & Comprehension',
    subject: 'English',
    classGrade: 'Grade 10',
    section: 'A',
    teacher: 'Priya Nair',
    status: 'published',
    createdDate: '2026-07-05',
    objective: 'Analyse theme, character, and irony through guided close reading.',
  },
  {
    id: 'LP-004',
    chapter: 'Nationalism in India',
    subject: 'Social Studies',
    classGrade: 'Grade 10',
    section: 'C',
    teacher: 'Suresh Iyer',
    status: 'draft',
    createdDate: '2026-07-06',
    objective: 'Trace the Non-Cooperation and Civil Disobedience movements with map work.',
  },
  {
    id: 'LP-005',
    chapter: 'Polynomials — Zeros and Geometric Meaning',
    subject: 'Mathematics',
    classGrade: 'Grade 9',
    section: 'A',
    teacher: 'Anjali Mehta',
    status: 'published',
    createdDate: '2026-07-07',
    objective: 'Find zeros of polynomials and relate them to the graph of the polynomial.',
  },
  {
    id: 'LP-006',
    chapter: 'Life Processes — Nutrition and Respiration',
    subject: 'Science',
    classGrade: 'Grade 10',
    section: 'A',
    teacher: 'Rohit Verma',
    status: 'draft',
    createdDate: '2026-07-08',
    objective: 'Compare autotrophic and heterotrophic nutrition and diagram respiration.',
  },
  {
    id: 'LP-007',
    chapter: 'Introduction to Python — Variables and Data Types',
    subject: 'Computer Science',
    classGrade: 'Grade 8',
    section: 'B',
    teacher: 'Neha Kapoor',
    status: 'published',
    createdDate: '2026-07-09',
    objective: 'Write basic Python scripts using variables, int, float, and string types.',
  },
  {
    id: 'LP-008',
    chapter: 'Kavya Khand — Bhakti Pad Ki Bhavna',
    subject: 'Hindi',
    classGrade: 'Grade 9',
    section: 'B',
    teacher: 'Meena Sharma',
    status: 'published',
    createdDate: '2026-07-10',
    objective: 'Bhakti kaal ke padon mein ras aur alankar ka abhyaas karwana.',
  },
  {
    id: 'LP-009',
    chapter: 'Light — Reflection and Refraction',
    subject: 'Science',
    classGrade: 'Grade 8',
    section: 'A',
    teacher: 'Rohit Verma',
    status: 'published',
    createdDate: '2026-07-11',
    objective: 'Apply laws of reflection and draw ray diagrams for mirrors and lenses.',
  },
  {
    id: 'LP-010',
    chapter: 'Linear Equations in Two Variables',
    subject: 'Mathematics',
    classGrade: 'Grade 9',
    section: 'C',
    teacher: 'Anjali Mehta',
    status: 'draft',
    createdDate: '2026-07-12',
    objective: 'Solve pairs of linear equations graphically and by substitution.',
  },
  {
    id: 'LP-011',
    chapter: 'The Midnight Visitor — Mystery & Vocabulary',
    subject: 'English',
    classGrade: 'Grade 9',
    section: 'A',
    teacher: 'Priya Nair',
    status: 'published',
    createdDate: '2026-07-13',
    objective: 'Build inference skills and expand suspense/mystery vocabulary.',
  },
  {
    id: 'LP-012',
    chapter: 'Resources and Development — Land Use Patterns',
    subject: 'Social Studies',
    classGrade: 'Grade 8',
    section: 'B',
    teacher: 'Suresh Iyer',
    status: 'published',
    createdDate: '2026-07-14',
    objective: 'Classify resources and evaluate sustainable land-use planning.',
  },
  {
    id: 'LP-013',
    chapter: 'Loops and Conditional Statements in Python',
    subject: 'Computer Science',
    classGrade: 'Grade 9',
    section: 'A',
    teacher: 'Neha Kapoor',
    status: 'draft',
    createdDate: '2026-07-15',
    objective: 'Implement for/while loops and if-elif-else to solve small problems.',
  },
  {
    id: 'LP-014',
    chapter: 'Triangles — Congruence and Similarity Criteria',
    subject: 'Mathematics',
    classGrade: 'Grade 7',
    section: 'A',
    teacher: 'Anjali Mehta',
    status: 'published',
    createdDate: '2026-07-16',
    objective: 'Apply SSS, SAS, ASA, RHS criteria to prove triangle congruence.',
  },
  {
    id: 'LP-015',
    chapter: 'Cells — Structure and Function',
    subject: 'Science',
    classGrade: 'Grade 7',
    section: 'B',
    teacher: 'Rohit Verma',
    status: 'draft',
    createdDate: '2026-07-17',
    objective: 'Label plant and animal cell organelles and explain their functions.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const SUBJECT_OPTIONS = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Hindi',
  'Computer Science',
] as const;

const CLASS_OPTIONS = [
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
] as const;

/** Colored badge per subject — keeps the grid scannable. */
const SUBJECT_STYLES: Record<string, string> = {
  Mathematics:
    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Science:
    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  English:
    'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'Social Studies':
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Hindi:
    'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  'Computer Science':
    'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
};

const selectClass =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function subjectBadgeClass(subject: string): string {
  return (
    SUBJECT_STYLES[subject] ??
    'bg-muted text-muted-foreground border-border'
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function LessonPlansPage() {
  const router = useRouter();

  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  /* ---- Derived stats (computed from the full dataset) -------------------- */
  const stats = useMemo(() => {
    const total = LESSON_PLANS.length;
    const published = LESSON_PLANS.filter((p) => p.status === 'published').length;
    const drafts = total - published;
    const completionRate = Math.round((published / total) * 100);
    return { total, published, drafts, completionRate };
  }, []);

  /* ---- Filtering --------------------------------------------------------- */
  const filteredPlans = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LESSON_PLANS.filter((p) => {
      const subjectMatch =
        subjectFilter === 'all' || p.subject === subjectFilter;
      const classMatch =
        classFilter === 'all' || p.classGrade === classFilter;
      const searchMatch =
        q === '' ||
        p.chapter.toLowerCase().includes(q) ||
        p.teacher.toLowerCase().includes(q) ||
        p.subject.toLowerCase().includes(q);
      return subjectMatch && classMatch && searchMatch;
    });
  }, [subjectFilter, classFilter, search]);

  const lessonPlanExportColumns = [
    { key: 'chapter', label: 'Chapter' },
    { key: 'subject', label: 'Subject' },
    { key: 'classGrade', label: 'Class' },
    { key: 'teacher', label: 'Teacher' },
    { key: 'status', label: 'Status' },
    { key: 'createdDate', label: 'Date' },
  ];

  const hasActiveFilters =
    subjectFilter !== 'all' || classFilter !== 'all' || search !== '';

  const resetFilters = () => {
    setSubjectFilter('all');
    setClassFilter('all');
    setSearch('');
  };

  /* ---- Actions ----------------------------------------------------------- */
  const handleEdit = (plan: LessonPlan) => {
    toast.info('Edit lesson plan', { description: 'Opening editor…' });
    router.push(`/principal/academics/lesson-plans/new?id=${plan.id}`);
  };

  const handleDelete = (plan: LessonPlan) => {
    toast.success('Lesson plan deleted', {
      description: `${plan.chapter.slice(0, 48)}${plan.chapter.length > 48 ? '…' : ''}`,
    });
  };

  const handleDuplicate = (plan: LessonPlan) => {
    toast.success('Lesson plan duplicated', {
      description: `Copy of “${plan.chapter.slice(0, 40)}${plan.chapter.length > 40 ? '…' : ''}” created as a draft`,
    });
  };

  /* ---- Render ------------------------------------------------------------ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Lesson Plans"
        description="Manage and track lesson plans across all classes"
      >
        <Button
          onClick={() => {
            toast.success('New lesson plan', { description: 'Opening the plan builder…' });
            router.push('/principal/academics/lesson-plans/new');
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Lesson Plan</span>
          <span className="sm:hidden">New</span>
        </Button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Plans"
          value={stats.total}
          icon={FileText}
          change="Across all classes"
          changeType="neutral"
          description="Lesson plans on record"
          delay={0}
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={CheckCircle2}
          change={`${Math.round((stats.published / stats.total) * 100)}% of total`}
          changeType="positive"
          description="Ready for classroom use"
          delay={0.05}
        />
        <StatCard
          title="Drafts"
          value={stats.drafts}
          icon={Clock}
          change="Awaiting review"
          changeType="neutral"
          description="Not yet published"
          delay={0.1}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={BookOpen}
          change="+4% vs last term"
          changeType="positive"
          description="Published plans / total"
          delay={0.15}
        />
      </div>

      {/* Plans section */}
      <SectionCard
        title="All Lesson Plans"
        description={`${filteredPlans.length} of ${LESSON_PLANS.length} plans shown`}
        delay={0.1}
      >
        {/* Filter bar */}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Subject filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className={selectClass}
                aria-label="Filter by subject"
              >
                <option value="all">All Subjects</option>
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Class filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className={selectClass}
              aria-label="Filter by class"
            >
              <option value="all">All Classes</option>
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-9 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Search + export */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chapter, teacher, subject…"
                className="h-9 w-full pl-9 sm:w-64"
                aria-label="Search lesson plans"
              />
            </div>
            <ExportButtons
              label="lesson plans"
              data={filteredPlans as unknown as Record<string, unknown>[]}
              columns={lessonPlanExportColumns}
              filename="lesson-plans"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl border lg:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
                  Chapter
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-muted-foreground">
                  Subject
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                  Class
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                  Teacher
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground">
                  Created
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No lesson plans match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="border-b last:border-0 transition-colors hover:bg-muted/30"
                  >
                    <td className="max-w-[320px] px-4 py-3">
                      <p className="truncate font-medium">{plan.chapter}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {plan.objective}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                          subjectBadgeClass(plan.subject)
                        )}
                      >
                        {plan.subject}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                        {plan.classGrade} · {plan.section}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {plan.teacher}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge
                        status={plan.status === 'published' ? 'Published' : 'Draft'}
                        variant={plan.status === 'published' ? 'success' : 'warning'}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-muted-foreground">
                      {formatDate(plan.createdDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Edit ${plan.chapter}`}
                          onClick={() => handleEdit(plan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Duplicate ${plan.chapter}`}
                          onClick={() => handleDuplicate(plan)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          aria-label={`Delete ${plan.chapter}`}
                          onClick={() => handleDelete(plan)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / tablet card grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
          {filteredPlans.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">No lesson plans found</p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your filters or search.
                </p>
              </div>
            </div>
          ) : (
            filteredPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium">{plan.chapter}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {plan.objective}
                    </p>
                  </div>
                  <StatusBadge
                    status={plan.status === 'published' ? 'Published' : 'Draft'}
                    variant={plan.status === 'published' ? 'success' : 'warning'}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                      subjectBadgeClass(plan.subject)
                    )}
                  >
                    {plan.subject}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                    {plan.classGrade} · {plan.section}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 border-t pt-3">
                  <div className="min-w-0 text-xs text-muted-foreground">
                    <p className="truncate">
                      <span className="text-foreground/80">{plan.teacher}</span>
                    </p>
                    <p className="tabular-nums">{formatDate(plan.createdDate)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Edit ${plan.chapter}`}
                      onClick={() => handleEdit(plan)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Duplicate ${plan.chapter}`}
                      onClick={() => handleDuplicate(plan)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      aria-label={`Delete ${plan.chapter}`}
                      onClick={() => handleDelete(plan)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </SectionCard>
    </motion.div>
  );
}
