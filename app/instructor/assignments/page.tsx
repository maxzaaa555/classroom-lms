'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function GradingDashboard() {
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="mb-8 flex items-center gap-4 border-b border-slate-800 pb-4">
        <Link href="/instructor/dashboard" className="text-slate-400 hover:text-white text-xs">← กลับ</Link>
        <h1 className="text-xl font-bold text-white">ระบบตรวจการบ้าน (Grading System)</h1>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-6 py-4 font-semibold">นักเรียน</th>
              <th className="px-6 py-4 font-semibold">คอร์ส / บทเรียน</th>
              <th className="px-6 py-4 font-semibold">ไฟล์แนบ</th>
              <th className="px-6 py-4 font-semibold">สถานะ</th>
              <th className="px-6 py-4 font-semibold text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr className="hover:bg-slate-800/20">
              <td className="px-6 py-4">สมชาย สายโค้ด</td>
              <td className="px-6 py-4">Next.js Masterclass <br/><span className="text-slate-500">บทที่ 2</span></td>
              <td className="px-6 py-4"><a href="#" className="text-emerald-400 hover:underline">hw_schema.pdf</a></td>
              <td className="px-6 py-4"><span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full border border-amber-500/20">รอตรวจ</span></td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => setStatus('ให้คะแนนสำเร็จ')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold">ให้คะแนน</button>
              </td>
            </tr>
          </tbody>
        </table>
        {status && <div className="p-4 bg-emerald-900/30 text-emerald-400 text-xs text-center border-t border-slate-800">{status}</div>}
      </div>
    </div>
  );
}
