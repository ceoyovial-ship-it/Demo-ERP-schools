/*
# Fix infinite recursion in profiles RLS policy

## Problem
The `select_own_profile` policy on `profiles` queries `profiles` itself
inside a subquery (`EXISTS (SELECT 1 FROM profiles p WHERE ...)`), which
causes infinite recursion when Postgres evaluates RLS.

## Fix
Drop the recursive policy and replace it with two non-recursive policies:
1. Users can always SELECT their own profile row (`auth.uid() = id`).
2. Principals can SELECT all profiles — but instead of a subquery on
   `profiles` (which recurses), we use `auth.jwt() ->> 'user_role'` to
   check the role from JWT metadata. This avoids touching the table.

## Security
- No change to INSERT/UPDATE policies.
- SELECT remains owner-scoped + principal-scoped, just without recursion.
*/

DROP POLICY IF EXISTS "select_own_profile" ON profiles;

-- Owner can read their own row
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

-- Principal can read all profiles (role checked via JWT metadata, no table recursion)
CREATE POLICY "select_all_profiles_principal" ON profiles FOR SELECT
  TO authenticated USING (
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'principal')
    OR (auth.jwt() -> 'raw_user_meta_data' ->> 'role' = 'principal')
  );
