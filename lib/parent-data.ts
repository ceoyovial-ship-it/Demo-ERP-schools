import { studentProfiles } from '@/lib/student-data';

export type ParentChildKey = 'rahul' | 'priya' | 'arjun';

export interface ParentChildSummary {
  key: ParentChildKey;
  name: string;
  admissionNumber: string;
  classGrade: string;
  section: string;
}

export const PARENT_CHILD_STORAGE_KEY = 'yovial-parent-selected-child';

export const parentChildrenByParent: Record<string, ParentChildSummary[]> = {
  'ramesh.sharma': [
    {
      key: 'rahul',
      name: studentProfiles.rahul.name,
      admissionNumber: studentProfiles.rahul.admissionNumber,
      classGrade: studentProfiles.rahul.classGrade,
      section: studentProfiles.rahul.section,
    },
    {
      key: 'priya',
      name: studentProfiles.priya.name,
      admissionNumber: studentProfiles.priya.admissionNumber,
      classGrade: studentProfiles.priya.classGrade,
      section: studentProfiles.priya.section,
    },
    {
      key: 'arjun',
      name: studentProfiles.arjun.name,
      admissionNumber: studentProfiles.arjun.admissionNumber,
      classGrade: studentProfiles.arjun.classGrade,
      section: studentProfiles.arjun.section,
    },
  ],
};

export function getParentChildren(email?: string): ParentChildSummary[] {
  const username = email?.split('@')[0];
  return parentChildrenByParent[username ?? ''] ?? [];
}

export function getStoredParentChildKey(username?: string): ParentChildKey | null {
  if (typeof window === 'undefined') return null;
  const usernameKey = username ?? '';
  const storedKey = window.localStorage.getItem(`${PARENT_CHILD_STORAGE_KEY}-${usernameKey}`);
  if (storedKey === 'rahul' || storedKey === 'priya' || storedKey === 'arjun') {
    return storedKey;
  }
  return null;
}

export function setStoredParentChildKey(username: string | undefined, childKey: ParentChildKey): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${PARENT_CHILD_STORAGE_KEY}-${username ?? ''}`, childKey);
}
