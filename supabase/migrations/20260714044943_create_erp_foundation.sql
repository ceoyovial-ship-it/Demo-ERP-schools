/*
# Yovial School ERP - Foundation Schema

## Overview
Creates the core schema for the Yovial School ERP system with role-based authentication.
Six roles: principal, receptionist, teacher, student, parent, superadmin.

## New Tables
1. `profiles` - Extends auth.users with role, full_name, avatar_url, phone, and active status.
2. `students` - Student records linked to profiles and parents.
3. `attendance` - Daily attendance records per student.
4. `marks` - Examination marks per student per subject.
5. `fees` - Fee records per student.

## Security
- RLS enabled on all tables.
- Role-based access: principals see all, receptionists manage students/fees, teachers manage attendance/marks, students/parents see own data.
- All policies scoped to authenticated users.
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('principal', 'receptionist', 'teacher', 'student', 'parent', 'superadmin')),
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = id OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('principal', 'superadmin')
    )
  );

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- ============ STUDENTS ============
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_number text UNIQUE NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  class_grade text NOT NULL,
  section text NOT NULL DEFAULT 'A',
  roll_number integer,
  parent_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  admission_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_students" ON students;
CREATE POLICY "select_students" ON students FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist', 'teacher'))
    OR profile_id = auth.uid()
    OR parent_id = auth.uid()
  );

DROP POLICY IF EXISTS "insert_students" ON students;
CREATE POLICY "insert_students" ON students FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist'))
  );

DROP POLICY IF EXISTS "update_students" ON students;
CREATE POLICY "update_students" ON students FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist'))
  );

DROP POLICY IF EXISTS "delete_students" ON students;
CREATE POLICY "delete_students" ON students FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'principal')
  );

-- ============ ATTENDANCE ============
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (student_id, date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_attendance" ON attendance;
CREATE POLICY "select_attendance" ON attendance FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist', 'teacher'))
    OR EXISTS (SELECT 1 FROM students s WHERE s.id = attendance.student_id AND (s.profile_id = auth.uid() OR s.parent_id = auth.uid()))
  );

DROP POLICY IF EXISTS "insert_attendance" ON attendance;
CREATE POLICY "insert_attendance" ON attendance FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'teacher'))
  );

DROP POLICY IF EXISTS "update_attendance" ON attendance;
CREATE POLICY "update_attendance" ON attendance FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'teacher'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'teacher'))
  );

DROP POLICY IF EXISTS "delete_attendance" ON attendance;
CREATE POLICY "delete_attendance" ON attendance FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'teacher'))
  );

-- ============ MARKS ============
CREATE TABLE IF NOT EXISTS marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_name text NOT NULL,
  subject text NOT NULL,
  max_marks integer NOT NULL DEFAULT 100,
  obtained_marks numeric(6,2) NOT NULL,
  grade text,
  recorded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_marks" ON marks;
CREATE POLICY "select_marks" ON marks FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist', 'teacher'))
    OR EXISTS (SELECT 1 FROM students s WHERE s.id = marks.student_id AND (s.profile_id = auth.uid() OR s.parent_id = auth.uid()))
  );

DROP POLICY IF EXISTS "insert_marks" ON marks;
CREATE POLICY "insert_marks" ON marks FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'teacher'))
  );

DROP POLICY IF EXISTS "update_marks" ON marks;
CREATE POLICY "update_marks" ON marks FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'teacher'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'teacher'))
  );

DROP POLICY IF EXISTS "delete_marks" ON marks;
CREATE POLICY "delete_marks" ON marks FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'teacher'))
  );

-- ============ FEES ============
CREATE TABLE IF NOT EXISTS fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_type text NOT NULL,
  amount numeric(10,2) NOT NULL,
  paid_amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  due_date date,
  payment_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_fees" ON fees;
CREATE POLICY "select_fees" ON fees FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist'))
    OR EXISTS (SELECT 1 FROM students s WHERE s.id = fees.student_id AND (s.profile_id = auth.uid() OR s.parent_id = auth.uid()))
  );

DROP POLICY IF EXISTS "insert_fees" ON fees;
CREATE POLICY "insert_fees" ON fees FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist'))
  );

DROP POLICY IF EXISTS "update_fees" ON fees;
CREATE POLICY "update_fees" ON fees FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist'))
  );

DROP POLICY IF EXISTS "delete_fees" ON fees;
CREATE POLICY "delete_fees" ON fees FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('principal', 'receptionist'))
  );

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_students_profile_id ON students(profile_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON students(parent_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_marks_student_id ON marks(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_student_id ON fees(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
