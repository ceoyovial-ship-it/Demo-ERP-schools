'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { teachers } from '@/lib/erp-data';

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------

const CLASS_OPTIONS = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
const SECTION_OPTIONS = ['A', 'B'];
const SUBJECT_OPTIONS = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Hindi',
  'Computer Science',
  'Physical Education',
];

const selectClass =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary';

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NewLessonPlanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [teacher, setTeacher] = useState<string>('');
  const [classGrade, setClassGrade] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [chapter, setChapter] = useState<string>('');
  const [learningObjective, setLearningObjective] = useState<string>('');
  const [activities, setActivities] = useState<string>('');
  const [homework, setHomework] = useState<string>('');
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const isValid =
    teacher.trim().length > 0 &&
    classGrade.trim().length > 0 &&
    subject.trim().length > 0 &&
    chapter.trim().length > 0;

  // --- handlers ------------------------------------------------------------

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      setAttachmentNames((prev) => [...prev, ...files.map((f) => f.name)]);
      toast.success(
        `${files.length} file${files.length > 1 ? 's' : ''} attached`
      );
    }
    // reset so the same file can be picked again later
    e.target.value = '';
  }

  function validate(): boolean {
    if (!isValid) {
      toast.error('Please fill in Teacher, Class, Subject, and Chapter');
      return false;
    }
    return true;
  }

  function handleSaveDraft() {
    if (!validate()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Draft saved');
      router.push('/principal/academics/lesson-plans');
    }, 900);
  }

  function handlePublish() {
    if (!validate()) return;
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      toast.success('Lesson plan published successfully');
      router.push('/principal/academics/lesson-plans');
    }, 900);
  }

  // --- render --------------------------------------------------------------

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-8">
      <PageHeader
        title="Lesson Plan Builder"
        description="Create a detailed lesson plan for your class"
      >
        <Button
          variant="outline"
          onClick={() => router.push('/principal/academics/lesson-plans')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lesson Plans
        </Button>
      </PageHeader>

      <SectionCard
        title="Lesson Details"
        description="Fill in the core details and content of the lesson plan"
        delay={0.05}
      >
        <div className="space-y-5">
          {/* Teacher + Class + Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher</Label>
              <select
                id="teacher"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className={selectClass}
              >
                <option value="">Select teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <select
                id="class"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                className={selectClass}
              >
                <option value="">Select class</option>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <select
                id="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className={selectClass}
              >
                <option value="">Select section</option>
                {SECTION_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject + Chapter */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={selectClass}
              >
                <option value="">Select subject</option>
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Input
                id="chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Chapter 5 — Algebraic Expressions"
              />
            </div>
          </div>

          {/* Learning Objective */}
          <div className="space-y-2">
            <Label htmlFor="objective">Learning Objective</Label>
            <Textarea
              id="objective"
              rows={3}
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
              placeholder="What should students learn or be able to do by the end of this lesson?"
              className="resize-none"
            />
          </div>

          {/* Activities */}
          <div className="space-y-2">
            <Label htmlFor="activities">Activities</Label>
            <Textarea
              id="activities"
              rows={4}
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="Outline the teaching activities, group work, and exercises for the session…"
              className="resize-none"
            />
          </div>

          {/* Homework */}
          <div className="space-y-2">
            <Label htmlFor="homework">Homework</Label>
            <Textarea
              id="homework"
              rows={3}
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              placeholder="Assignments or practice questions for students to complete at home…"
              className="resize-none"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-accent/40"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">
                Click to upload or drag files here
              </span>
              <span className="text-xs text-muted-foreground">
                PDF, DOCX, PPTX, images up to 10MB
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFilePick}
            />
            {attachmentNames.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                {attachmentNames.map((name, i) => (
                  <li
                    key={`${name}-${i}`}
                    className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm"
                  >
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{name}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
      >
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSaving || isPublishing}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Draft
            </>
          )}
        </Button>

        <Button
          onClick={handlePublish}
          disabled={isSaving || isPublishing}
          className="gap-2"
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing…
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4" />
              Publish
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
