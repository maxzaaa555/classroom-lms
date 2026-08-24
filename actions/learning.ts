'use server';

import { getAdminClient } from '@/lib/supabase';
import crypto from 'crypto';

// บันทึกความคืบหน้าบทเรียน
export async function markLessonComplete(userId: string, lessonId: string) {
  const supabase = getAdminClient();

  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        is_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    );

  if (error) throw new Error(error.message);
  return { success: true };
}

// ตรวจสอบเงื่อนไขและออก Certificate
export async function claimCertificate(userId: string, courseId: string) {
  const supabase = getAdminClient();

  // 1. ดึงจำนวนบทเรียนทั้งหมดของคอร์ส
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId);

  const totalLessons = lessons?.length || 0;

  // 2. ตรวจสอบบทเรียนที่เรียนจบแล้ว
  const { data: completed } = await supabase
    .from('lesson_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('is_completed', true);

  if ((completed?.length || 0) < totalLessons && totalLessons > 0) {
    return { success: false, message: 'กรุณาเรียนให้ครบทุกบทเรียนก่อนขอรับใบรับรอง' };
  }

  // 3. ตรวจสอบว่าเคยออก Certificate ไปแล้วหรือไม่
  const { data: existingCert } = await supabase
    .from('certificates')
    .select('certificate_number')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (existingCert) {
    return { success: true, certNumber: existingCert.certificate_number };
  }

  // 4. สุ่มสร้างรหัส Verification Code และบันทึก
  const certNumber = `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const { error } = await supabase.from('certificates').insert({
    user_id: userId,
    course_id: courseId,
    certificate_number: certNumber,
    issued_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);

  return { success: true, certNumber };
}