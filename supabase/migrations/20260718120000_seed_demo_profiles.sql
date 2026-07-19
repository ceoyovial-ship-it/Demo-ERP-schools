-- Seed all demo auth/profile rows required by the Yovial School ERP demo app.
-- This migration links profiles to the existing auth.users rows by email and keeps
-- the auth flow untouched.

BEGIN;

INSERT INTO public.profiles (
  id,
  email,
  role,
  full_name,
  avatar_url,
  phone,
  active
)
SELECT
  u.id,
  u.email,
  CASE u.email
    WHEN 'superadmin@yovialschool.edu.in' THEN 'superadmin'
    WHEN 'principal@yovialschool.edu.in' THEN 'principal'
    WHEN 'reception@yovialschool.edu.in' THEN 'receptionist'
    WHEN 'anjali.reddy@yovialschool.edu.in' THEN 'teacher'
    WHEN 'rahul10@yovialschool.edu.in' THEN 'student'
    WHEN 'priya09@yovialschool.edu.in' THEN 'student'
    WHEN 'arjun08@yovialschool.edu.in' THEN 'student'
    WHEN 'ramesh.sharma@yovialschool.edu.in' THEN 'parent'
    ELSE NULL
  END AS role,
  CASE u.email
    WHEN 'superadmin@yovialschool.edu.in' THEN 'Neha Verma'
    WHEN 'principal@yovialschool.edu.in' THEN 'Dr. Vikram Rao'
    WHEN 'reception@yovialschool.edu.in' THEN 'Priya Nair'
    WHEN 'anjali.reddy@yovialschool.edu.in' THEN 'Anjali Reddy'
    WHEN 'rahul10@yovialschool.edu.in' THEN 'Rahul Kumar'
    WHEN 'priya09@yovialschool.edu.in' THEN 'Priya Sharma'
    WHEN 'arjun08@yovialschool.edu.in' THEN 'Arjun Reddy'
    WHEN 'ramesh.sharma@yovialschool.edu.in' THEN 'Ramesh Sharma'
    ELSE u.email
  END AS full_name,
  NULL AS avatar_url,
  NULL AS phone,
  TRUE AS active
FROM auth.users u
WHERE u.email IN (
  'superadmin@yovialschool.edu.in',
  'principal@yovialschool.edu.in',
  'reception@yovialschool.edu.in',
  'anjali.reddy@yovialschool.edu.in',
  'rahul10@yovialschool.edu.in',
  'priya09@yovialschool.edu.in',
  'arjun08@yovialschool.edu.in',
  'ramesh.sharma@yovialschool.edu.in'
)
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  phone = EXCLUDED.phone,
  active = EXCLUDED.active;

-- Seed the demo student records linked to the parent account.
-- These rows are required for Student and Parent portal flows that rely on
-- the `students` table for relationships and authorization.
INSERT INTO public.students (
  admission_number,
  profile_id,
  class_grade,
  section,
  roll_number,
  parent_id,
  admission_date,
  status
)
SELECT
  'YS2025-025',
  rahul.profile_id,
  '10',
  'A',
  25,
  parent.profile_id,
  '2023-06-15',
  'active'
FROM (
  SELECT p.id AS profile_id
  FROM public.profiles p
  WHERE p.email = 'rahul10@yovialschool.edu.in'
) AS rahul
CROSS JOIN (
  SELECT p.id AS profile_id
  FROM public.profiles p
  WHERE p.email = 'ramesh.sharma@yovialschool.edu.in'
) AS parent
ON CONFLICT (admission_number) DO UPDATE
SET
  profile_id = EXCLUDED.profile_id,
  class_grade = EXCLUDED.class_grade,
  section = EXCLUDED.section,
  roll_number = EXCLUDED.roll_number,
  parent_id = EXCLUDED.parent_id,
  admission_date = EXCLUDED.admission_date,
  status = EXCLUDED.status;

INSERT INTO public.students (
  admission_number,
  profile_id,
  class_grade,
  section,
  roll_number,
  parent_id,
  admission_date,
  status
)
SELECT
  'YS2025-026',
  priya.profile_id,
  '10',
  'A',
  26,
  parent.profile_id,
  '2023-06-16',
  'active'
FROM (
  SELECT p.id AS profile_id
  FROM public.profiles p
  WHERE p.email = 'priya09@yovialschool.edu.in'
) AS priya
CROSS JOIN (
  SELECT p.id AS profile_id
  FROM public.profiles p
  WHERE p.email = 'ramesh.sharma@yovialschool.edu.in'
) AS parent
ON CONFLICT (admission_number) DO UPDATE
SET
  profile_id = EXCLUDED.profile_id,
  class_grade = EXCLUDED.class_grade,
  section = EXCLUDED.section,
  roll_number = EXCLUDED.roll_number,
  parent_id = EXCLUDED.parent_id,
  admission_date = EXCLUDED.admission_date,
  status = EXCLUDED.status;

INSERT INTO public.students (
  admission_number,
  profile_id,
  class_grade,
  section,
  roll_number,
  parent_id,
  admission_date,
  status
)
SELECT
  'YS2025-027',
  arjun.profile_id,
  '10',
  'A',
  27,
  parent.profile_id,
  '2023-06-17',
  'active'
FROM (
  SELECT p.id AS profile_id
  FROM public.profiles p
  WHERE p.email = 'arjun08@yovialschool.edu.in'
) AS arjun
CROSS JOIN (
  SELECT p.id AS profile_id
  FROM public.profiles p
  WHERE p.email = 'ramesh.sharma@yovialschool.edu.in'
) AS parent
ON CONFLICT (admission_number) DO UPDATE
SET
  profile_id = EXCLUDED.profile_id,
  class_grade = EXCLUDED.class_grade,
  section = EXCLUDED.section,
  roll_number = EXCLUDED.roll_number,
  parent_id = EXCLUDED.parent_id,
  admission_date = EXCLUDED.admission_date,
  status = EXCLUDED.status;

COMMIT;
