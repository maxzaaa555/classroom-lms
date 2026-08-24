'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { signup } from '@/actions/auth';

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await signup(formData);
      if (res?.error) {
        setErrorMessage(res.error);
      } else if (res?.success) {
        setSuccessMessage(res.success);
      }
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
            Classroom LMS
          </span>
          <h1 className="text-2xl font-bold text-white mt-4">สมัครสมาชิกใหม่</h1>
          <p className="text-xs text-slate-400 mt-1">
            สร้างบัญชีเพื่อเริ่มเรียนและรับใบประกาศนียบัตร
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400">
            🎉 {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              ชื่อ - นามสกุล (สำหรับออกใบ Certificate)
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="นายสมชาย สายโค้ด"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              อีเมล (Email)
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="student@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2"
          >
            {isPending ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชีผู้ใช้'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" className="text-emerald-400 hover:underline font-semibold">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </main>
  );
}