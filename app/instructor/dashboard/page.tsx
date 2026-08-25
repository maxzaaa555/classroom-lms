'use client';
import React from 'react';
import Link from 'next/link';

export default function InstructorDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">แผงควบคุมผู้สอน (Instructor)</h1>
          <p className="text-xs text-slate-400 mt-1">จัดการคอร์สเรียน วิดีโอ และเอกสาร</p>
        </div>
        <Link href="/instructor/assignments" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold text-white">
          📝 ตรวจการบ้านนักเรียน
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mock Course Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">Active</span>
          <h3 className="text-lg font-bold text-white mt-4">Fullstack Next.js Masterclass</h3>
          <p className="text-xs text-slate-400 mt-2">นักเรียนลงทะเบียน: 124 คน</p>
          <div className="mt-6 flex gap-2">
            <button className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-semibold">แก้ไขคอร์ส</button>
            <button className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-semibold">เพิ่มบทเรียน</button>
          </div>
        </div>

        {/* Add New Course */}
        <button className="bg-slate-900/40 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors">
          <span className="text-3xl mb-2">+</span>
          <span className="text-sm font-semibold">สร้างคอร์สเรียนใหม่</span>
        </button>
      </div>
    </div>
  );
}
