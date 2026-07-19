import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DEMO_PASSWORD = "Yovial@2025";
const SUPERADMIN_PASSWORD = "admin123";

const demoUsers = [
  { email: "principal@yovialschool.edu.in", role: "principal", full_name: "Dr. Vikram Rao", phone: "+91 98765 43001" },
  { email: "reception@yovialschool.edu.in", role: "receptionist", full_name: "Priya Nair", phone: "+91 98765 43002" },
  { email: "anjali.reddy@yovialschool.edu.in", role: "teacher", full_name: "Anjali Reddy", phone: "+91 98765 43003" },
  { email: "superadmin@yovialschool.edu.in", role: "superadmin", full_name: "Neha Verma", phone: "+91 98765 43006" },
  { email: "rahul.sharma25@yovialschool.edu.in", role: "student", full_name: "Rahul Sharma", phone: "+91 98765 43004" },
  { email: "ramesh.sharma@yovialschool.edu.in", role: "parent", full_name: "Ramesh Sharma", phone: "+91 98765 43005" },
];

const demoStudents = [
  { email: "rahul10@yovialschool.edu.in", password: "Rahul@123", role: "student", full_name: "Rahul Kumar", phone: "+91 98765 43011" },
  { email: "priya09@yovialschool.edu.in", password: "Priya@123", role: "student", full_name: "Priya Sharma", phone: "+91 98765 43012" },
  { email: "arjun08@yovialschool.edu.in", password: "Arjun@123", role: "student", full_name: "Arjun Reddy", phone: "+91 98765 43013" },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const results = [];

    for (const u of demoUsers) {
      const { data: existing } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("email", u.email)
        .maybeSingle();

      if (existing) {
        results.push({ email: u.email, status: "already_exists" });
        continue;
      }

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.role === "superadmin" ? SUPERADMIN_PASSWORD : DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: u.full_name, role: u.role },
      });

      if (authError) {
        results.push({ email: u.email, status: "error", error: authError.message });
        continue;
      }

      const userId = authData.user.id;

      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: userId,
        email: u.email,
        role: u.role,
        full_name: u.full_name,
        phone: u.phone,
        active: true,
      });

      if (profileError) {
        results.push({ email: u.email, status: "profile_error", error: profileError.message });
        continue;
      }

      results.push({ email: u.email, status: "created", user_id: userId });
    }

    // Create student record for the original student demo user
    const studentProfile = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", "rahul.sharma25@yovialschool.edu.in")
      .maybeSingle();

    const parentProfile = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", "ramesh.sharma@yovialschool.edu.in")
      .maybeSingle();

    if (studentProfile.data && parentProfile.data) {
      const { data: existingStudent } = await supabaseAdmin
        .from("students")
        .select("id")
        .eq("profile_id", studentProfile.data.id)
        .maybeSingle();

      if (!existingStudent) {
        await supabaseAdmin.from("students").insert({
          admission_number: "YS2025-025",
          profile_id: studentProfile.data.id,
          parent_id: parentProfile.data.id,
          class_grade: "10",
          section: "A",
          roll_number: 25,
          admission_date: "2023-06-15",
          status: "active",
        });
        results.push({ email: "rahul.sharma25", status: "student_record_created" });
      }
    }

    // Create the 3 new demo student accounts with individual passwords
    for (const s of demoStudents) {
      const { data: existing } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("email", s.email)
        .maybeSingle();

      if (existing) {
        results.push({ email: s.email, status: "already_exists" });
        continue;
      }

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: s.email,
        password: s.password,
        email_confirm: true,
        user_metadata: { full_name: s.full_name, role: s.role },
      });

      if (authError) {
        results.push({ email: s.email, status: "error", error: authError.message });
        continue;
      }

      const userId = authData.user.id;

      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: userId,
        email: s.email,
        role: s.role,
        full_name: s.full_name,
        phone: s.phone,
        active: true,
      });

      if (profileError) {
        results.push({ email: s.email, status: "profile_error", error: profileError.message });
        continue;
      }

      results.push({ email: s.email, status: "created", user_id: userId });
    }

    return new Response(
      JSON.stringify({ success: true, results, password: DEMO_PASSWORD }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
