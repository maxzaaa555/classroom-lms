import React from 'react';
import { getAdminClient } from '@/lib/supabase';
import Link from 'next/link';

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = getAdminClient();

  // ค้นหาข้อมูลใบรับรอง
  const { data: cert } = await supabase
    .from('certificates')
    .select(`
      certificate_number,
      issued_at,
      profiles (full_name),
      courses (title)
    `)
    .eq('certificate_number', code)
    .single();

  if (!cert) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 text-center">
          <span className="text-4xl block mb-3">⚠️</span>
          <h1 className="text-lg font-bold text-rose-400">ไม่พบข้อมูลใบประกาศนียบัตร</h1>
          <p className="text-xs text-slate-400 mt-2">
            รหัส <strong>{code}</strong> ไม่ถูกต้องหรือไม่มีอยู่ในระบบ
          </p>
          <Link
            href="/"
            className="mt-6 inline-block px-5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </main>
    );
  }

  const studentName = (cert.profiles as any)?.full_name || 'ผู้เรียน';
  const courseTitle = (cert.courses as any)?.title || 'หลักสูตรออนไลน์';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-slate-900/80 backdrop-blur border border-emerald-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center">
          <span className="text-4xl block mb-2">🎓</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Verified Credential
          </span>
          <h1 className="text-xl font-bold text-white mt-4">ใบรับรองผ่านการตรวจสอบถูกต้อง</h1>
        </div>

        <div className="mt-6 space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">ชื่อผู้สำเร็จการศึกษา:</span>
            <span className="font-semibold text-white">{studentName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">หลักสูตร:</span>
            <span className="font-semibold text-emerald-300 text-right">{courseTitle}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">รหัสใบรับรอง:</span>
            <span className="font-mono text-slate-200">{cert.certificate_number}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">วันที่ออกเอกสาร:</span>
            <span className="text-slate-200">{new Date(cert.issued_at).toLocaleDateString('th-TH')}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
          >
            เข้าสู่ระบบ LMS
          </Link>
        </div>
      </div>
    </main>
  );
}