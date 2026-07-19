-- Seed the missing Supabase Auth demo accounts and align them with profile rows.
-- This keeps the app login flow unchanged and only provisions the required auth identities.

BEGIN;

WITH superadmin_auth AS (
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    is_anonymous
  )
  VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'superadmin@yovialschool.edu.in',
    '$2b$10$91m39dRAAN2endq2C0uLFurbINBRxvmGqDJkC8pI9NG3YiW.13Z0O',
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email_verified":true}'::jsonb,
    false,
    false,
    false
  )
  ON CONFLICT (email) DO UPDATE
  SET encrypted_password = EXCLUDED.encrypted_password,
      email_confirmed_at = EXCLUDED.email_confirmed_at,
      confirmed_at = EXCLUDED.confirmed_at,
      raw_app_meta_data = EXCLUDED.raw_app_meta_data,
      raw_user_meta_data = EXCLUDED.raw_user_meta_data,
      aud = EXCLUDED.aud,
      role = EXCLUDED.role,
      is_super_admin = EXCLUDED.is_super_admin,
      is_sso_user = EXCLUDED.is_sso_user,
      is_anonymous = EXCLUDED.is_anonymous
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone, active)
SELECT
  sa.id,
  sa.email,
  'superadmin',
  'Neha Verma',
  NULL,
  NULL,
  TRUE
FROM superadmin_auth sa
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    active = EXCLUDED.active;

WITH principal_auth AS (
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    is_anonymous
  )
  VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'principal@yovialschool.edu.in',
    '$2b$10$Jr/2knoOGa77uyuz06Xf9.eiGaZhDoVrtwLmT4GYU5S0exO5BHUv.',
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email_verified":true}'::jsonb,
    false,
    false,
    false
  )
  ON CONFLICT (email) DO UPDATE
  SET encrypted_password = EXCLUDED.encrypted_password,
      email_confirmed_at = EXCLUDED.email_confirmed_at,
      confirmed_at = EXCLUDED.confirmed_at,
      raw_app_meta_data = EXCLUDED.raw_app_meta_data,
      raw_user_meta_data = EXCLUDED.raw_user_meta_data,
      aud = EXCLUDED.aud,
      role = EXCLUDED.role,
      is_super_admin = EXCLUDED.is_super_admin,
      is_sso_user = EXCLUDED.is_sso_user,
      is_anonymous = EXCLUDED.is_anonymous
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone, active)
SELECT
  pa.id,
  pa.email,
  'principal',
  'Dr. Vikram Rao',
  NULL,
  NULL,
  TRUE
FROM principal_auth pa
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    active = EXCLUDED.active;

WITH reception_auth AS (
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    is_anonymous
  )
  VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'reception@yovialschool.edu.in',
    '$2b$10$Jr/2knoOGa77uyuz06Xf9.eiGaZhDoVrtwLmT4GYU5S0exO5BHUv.',
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email_verified":true}'::jsonb,
    false,
    false,
    false
  )
  ON CONFLICT (email) DO UPDATE
  SET encrypted_password = EXCLUDED.encrypted_password,
      email_confirmed_at = EXCLUDED.email_confirmed_at,
      confirmed_at = EXCLUDED.confirmed_at,
      raw_app_meta_data = EXCLUDED.raw_app_meta_data,
      raw_user_meta_data = EXCLUDED.raw_user_meta_data,
      aud = EXCLUDED.aud,
      role = EXCLUDED.role,
      is_super_admin = EXCLUDED.is_super_admin,
      is_sso_user = EXCLUDED.is_sso_user,
      is_anonymous = EXCLUDED.is_anonymous
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone, active)
SELECT
  ra.id,
  ra.email,
  'receptionist',
  'Priya Nair',
  NULL,
  NULL,
  TRUE
FROM reception_auth ra
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    active = EXCLUDED.active;

WITH teacher_auth AS (
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    is_anonymous
  )
  VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'anjali.reddy@yovialschool.edu.in',
    '$2b$10$Jr/2knoOGa77uyuz06Xf9.eiGaZhDoVrtwLmT4GYU5S0exO5BHUv.',
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email_verified":true}'::jsonb,
    false,
    false,
    false
  )
  ON CONFLICT (email) DO UPDATE
  SET encrypted_password = EXCLUDED.encrypted_password,
      email_confirmed_at = EXCLUDED.email_confirmed_at,
      confirmed_at = EXCLUDED.confirmed_at,
      raw_app_meta_data = EXCLUDED.raw_app_meta_data,
      raw_user_meta_data = EXCLUDED.raw_user_meta_data,
      aud = EXCLUDED.aud,
      role = EXCLUDED.role,
      is_super_admin = EXCLUDED.is_super_admin,
      is_sso_user = EXCLUDED.is_sso_user,
      is_anonymous = EXCLUDED.is_anonymous
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone, active)
SELECT
  ta.id,
  ta.email,
  'teacher',
  'Anjali Reddy',
  NULL,
  NULL,
  TRUE
FROM teacher_auth ta
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    active = EXCLUDED.active;

WITH parent_auth AS (
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    is_anonymous
  )
  VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'ramesh.sharma@yovialschool.edu.in',
    '$2b$10$Jr/2knoOGa77uyuz06Xf9.eiGaZhDoVrtwLmT4GYU5S0exO5BHUv.',
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email_verified":true}'::jsonb,
    false,
    false,
    false
  )
  ON CONFLICT (email) DO UPDATE
  SET encrypted_password = EXCLUDED.encrypted_password,
      email_confirmed_at = EXCLUDED.email_confirmed_at,
      confirmed_at = EXCLUDED.confirmed_at,
      raw_app_meta_data = EXCLUDED.raw_app_meta_data,
      raw_user_meta_data = EXCLUDED.raw_user_meta_data,
      aud = EXCLUDED.aud,
      role = EXCLUDED.role,
      is_super_admin = EXCLUDED.is_super_admin,
      is_sso_user = EXCLUDED.is_sso_user,
      is_anonymous = EXCLUDED.is_anonymous
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone, active)
SELECT
  pa.id,
  pa.email,
  'parent',
  'Ramesh Sharma',
  NULL,
  NULL,
  TRUE
FROM parent_auth pa
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    active = EXCLUDED.active;

WITH student_rahul_auth AS (
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    is_anonymous
  )
  VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'rahul10@yovialschool.edu.in',
    '$2b$10$sW/bmgVorq0kGXrCapDCY.HmNbI7JJoeRhcApq4G2JoCnbj8rYaee',
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email_verified":true}'::jsonb,
    false,
    false,
    false
  )
  ON CONFLICT (email) DO UPDATE
  SET encrypted_password = EXCLUDED.encrypted_password,
      email_confirmed_at = EXCLUDED.email_confirmed_at,
      confirmed_at = EXCLUDED.confirmed_at,
      raw_app_meta_data = EXCLUDED.raw_app_meta_data,
      raw_user_meta_data = EXCLUDED.raw_user_meta_data,
      aud = EXCLUDED.aud,
      role = EXCLUDED.role,
      is_super_admin = EXCLUDED.is_super_admin,
      is_sso_user = EXCLUDED.is_sso_user,
      is_anonymous = EXCLUDED.is_anonymous
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone, active)
SELECT
  sra.id,
  sra.email,
  'student',
  'Rahul Kumar',
  NULL,
  NULL,
  TRUE
FROM student_rahul_auth sra
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    active = EXCLUDED.active;

WITH student_priya_auth AS (
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    is_anonymous
  )
  VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'priya09@yovialschool.edu.in',
    '$2b$10$TutsC0GqLjgYUyxbLXGDOONYnlaO7fOWnDaaVATDE9NrItp6kXddW',
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email_verified":true}'::jsonb,
    false,
    false,
    false
  )
  ON CONFLICT (email) DO UPDATE
  SET encrypted_password = EXCLUDED.encrypted_password,
      email_confirmed_at = EXCLUDED.email_confirmed_at,
      confirmed_at = EXCLUDED.confirmed_at,
      raw_app_meta_data = EXCLUDED.raw_app_meta_data,
      raw_user_meta_data = EXCLUDED.raw_user_meta_data,
      aud = EXCLUDED.aud,
      role = EXCLUDED.role,
      is_super_admin = EXCLUDED.is_super_admin,
      is_sso_user = EXCLUDED.is_sso_user,
      is_anonymous = EXCLUDED.is_anonymous
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone, active)
SELECT
  spa.id,
  spa.email,
  'student',
  'Priya Sharma',
  NULL,
  NULL,
  TRUE
FROM student_priya_auth spa
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    active = EXCLUDED.active;

WITH student_arjun_auth AS (
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    is_sso_user,
    is_anonymous
  )
  VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'arjun08@yovialschool.edu.in',
    '$2b$10$lxJEja9skj0.xOxHH03QAeyO5jo8BnJaqvet4Nd941PAYLh3D/mpe',
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email_verified":true}'::jsonb,
    false,
    false,
    false
  )
  ON CONFLICT (email) DO UPDATE
  SET encrypted_password = EXCLUDED.encrypted_password,
      email_confirmed_at = EXCLUDED.email_confirmed_at,
      confirmed_at = EXCLUDED.confirmed_at,
      raw_app_meta_data = EXCLUDED.raw_app_meta_data,
      raw_user_meta_data = EXCLUDED.raw_user_meta_data,
      aud = EXCLUDED.aud,
      role = EXCLUDED.role,
      is_super_admin = EXCLUDED.is_super_admin,
      is_sso_user = EXCLUDED.is_sso_user,
      is_anonymous = EXCLUDED.is_anonymous
  RETURNING id, email
)
INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone, active)
SELECT
  saa.id,
  saa.email,
  'student',
  'Arjun Reddy',
  NULL,
  NULL,
  TRUE
FROM student_arjun_auth saa
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    active = EXCLUDED.active;

WITH parent_profile AS (
  SELECT id FROM public.profiles WHERE email = 'ramesh.sharma@yovialschool.edu.in'
),
rahul_profile AS (
  SELECT id FROM public.profiles WHERE email = 'rahul10@yovialschool.edu.in'
),
priya_profile AS (
  SELECT id FROM public.profiles WHERE email = 'priya09@yovialschool.edu.in'
),
arjun_profile AS (
  SELECT id FROM public.profiles WHERE email = 'arjun08@yovialschool.edu.in'
)
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
SELECT 'YS2025-025', rp.id, '10', 'A', 25, pp.id, '2023-06-15', 'active'
FROM rahul_profile rp
CROSS JOIN parent_profile pp
ON CONFLICT (admission_number) DO UPDATE
SET profile_id = EXCLUDED.profile_id,
    class_grade = EXCLUDED.class_grade,
    section = EXCLUDED.section,
    roll_number = EXCLUDED.roll_number,
    parent_id = EXCLUDED.parent_id,
    admission_date = EXCLUDED.admission_date,
    status = EXCLUDED.status;

WITH parent_profile AS (
  SELECT id FROM public.profiles WHERE email = 'ramesh.sharma@yovialschool.edu.in'
),
priya_profile AS (
  SELECT id FROM public.profiles WHERE email = 'priya09@yovialschool.edu.in'
)
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
SELECT 'YS2025-026', pp.id, '10', 'A', 26, parent_profile.id, '2023-06-16', 'active'
FROM priya_profile pp
CROSS JOIN parent_profile
ON CONFLICT (admission_number) DO UPDATE
SET profile_id = EXCLUDED.profile_id,
    class_grade = EXCLUDED.class_grade,
    section = EXCLUDED.section,
    roll_number = EXCLUDED.roll_number,
    parent_id = EXCLUDED.parent_id,
    admission_date = EXCLUDED.admission_date,
    status = EXCLUDED.status;

WITH parent_profile AS (
  SELECT id FROM public.profiles WHERE email = 'ramesh.sharma@yovialschool.edu.in'
),
arjun_profile AS (
  SELECT id FROM public.profiles WHERE email = 'arjun08@yovialschool.edu.in'
)
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
SELECT 'YS2025-027', ap.id, '10', 'A', 27, parent_profile.id, '2023-06-17', 'active'
FROM arjun_profile ap
CROSS JOIN parent_profile
ON CONFLICT (admission_number) DO UPDATE
SET profile_id = EXCLUDED.profile_id,
    class_grade = EXCLUDED.class_grade,
    section = EXCLUDED.section,
    roll_number = EXCLUDED.roll_number,
    parent_id = EXCLUDED.parent_id,
    admission_date = EXCLUDED.admission_date,
    status = EXCLUDED.status;

COMMIT;
