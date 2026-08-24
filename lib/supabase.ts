import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client สำหรับฝั่งหน้าบ้าน (Browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client สำหรับ Server Actions ที่ต้องใช้สิทธิ์สูงสุด (Admin / Service Role)
export const getAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
};