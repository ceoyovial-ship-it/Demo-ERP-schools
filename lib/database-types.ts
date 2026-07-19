export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'principal' | 'receptionist' | 'teacher' | 'student' | 'parent' | 'superadmin';
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'principal' | 'receptionist' | 'teacher' | 'student' | 'parent' | 'superadmin';
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          active?: boolean;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      students: {
        Row: {
          id: string;
          admission_number: string;
          profile_id: string | null;
          class_grade: string;
          section: string;
          roll_number: number | null;
          parent_id: string | null;
          admission_date: string;
          status: 'active' | 'inactive' | 'graduated' | 'transferred';
          created_at: string;
        };
        Insert: {
          admission_number: string;
          profile_id?: string | null;
          class_grade: string;
          section?: string;
          roll_number?: number | null;
          parent_id?: string | null;
          admission_date?: string;
          status?: 'active' | 'inactive' | 'graduated' | 'transferred';
        };
        Update: Partial<Database['public']['Tables']['students']['Insert']>;
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          marked_by: string | null;
          created_at: string;
        };
        Insert: {
          student_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          marked_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>;
      };
      marks: {
        Row: {
          id: string;
          student_id: string;
          exam_name: string;
          subject: string;
          max_marks: number;
          obtained_marks: number;
          grade: string | null;
          recorded_by: string | null;
          created_at: string;
        };
        Insert: {
          student_id: string;
          exam_name: string;
          subject: string;
          max_marks?: number;
          obtained_marks: number;
          grade?: string | null;
          recorded_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['marks']['Insert']>;
      };
      fees: {
        Row: {
          id: string;
          student_id: string;
          fee_type: string;
          amount: number;
          paid_amount: number;
          status: 'pending' | 'paid' | 'overdue' | 'partial';
          due_date: string | null;
          payment_date: string | null;
          created_at: string;
        };
        Insert: {
          student_id: string;
          fee_type: string;
          amount: number;
          paid_amount?: number;
          status?: 'pending' | 'paid' | 'overdue' | 'partial';
          due_date?: string | null;
          payment_date?: string | null;
        };
        Update: Partial<Database['public']['Tables']['fees']['Insert']>;
      };
    };
  };
};
