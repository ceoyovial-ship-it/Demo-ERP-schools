import { students, teachers, parents, subjects, classes } from '@/lib/erp-data';
import { ALL_NAV_ITEMS } from '@/lib/navigation';

export interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  type: 'student' | 'teacher' | 'parent' | 'class' | 'subject' | 'page';
  href: string;
  icon: string;
}

export function searchAll(query: string, rolePrefix: string = '/principal'): SearchResult[] {
  if (!query || query.trim().length < 1) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const s of students.slice(0, 200)) {
    if (
      s.name.toLowerCase().includes(q) ||
      s.admissionNumber.toLowerCase().includes(q)
    ) {
      results.push({
        id: `student-${s.id}`,
        label: s.name,
        sublabel: `${s.classSection} · ${s.admissionNumber}`,
        type: 'student',
        href: `${rolePrefix}/students/${s.id}`,
        icon: 'Users',
      });
    }
  }

  for (const t of teachers) {
    if (
      t.name.toLowerCase().includes(q) ||
      t.employeeId.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
    ) {
      results.push({
        id: `teacher-${t.id}`,
        label: t.name,
        sublabel: `${t.subject} · ${t.employeeId}`,
        type: 'teacher',
        href: `${rolePrefix}/teachers`,
        icon: 'GraduationCap',
      });
    }
  }

  for (const p of parents.slice(0, 200)) {
    if (
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone.includes(q)
    ) {
      results.push({
        id: `parent-${p.id}`,
        label: p.name,
        sublabel: `${p.occupation} · ${p.email}`,
        type: 'parent',
        href: `${rolePrefix}/parents`,
        icon: 'UserCog',
      });
    }
  }

  for (const c of classes) {
    const label = `Grade ${c.grade}`;
    if (label.toLowerCase().includes(q) || c.room.toLowerCase().includes(q)) {
      results.push({
        id: `class-${c.id}`,
        label,
        sublabel: `${c.sections.join(', ')} · ${c.students} students · ${c.room}`,
        type: 'class',
        href: `${rolePrefix}/academics`,
        icon: 'BookOpen',
      });
    }
  }

  for (const sub of subjects) {
    if (
      sub.name.toLowerCase().includes(q) ||
      sub.code.toLowerCase().includes(q)
    ) {
      results.push({
        id: `subject-${sub.id}`,
        label: sub.name,
        sublabel: `${sub.code} · ${sub.teacher}`,
        type: 'subject',
        href: `${rolePrefix}/academics`,
        icon: 'BookOpen',
      });
    }
  }

  for (const item of ALL_NAV_ITEMS) {
    if (item.label.toLowerCase().includes(q)) {
      results.push({
        id: `page-${item.href}`,
        label: item.label,
        sublabel: 'Page',
        type: 'page',
        href: `${rolePrefix}${item.href === '/dashboard' ? '/dashboard' : item.href}`,
        icon: 'LayoutDashboard',
      });
    }
  }

  return results.slice(0, 12);
}
