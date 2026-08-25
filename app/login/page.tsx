'use client';

import React, { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login } from '@/actions/auth';
import { createClient } from '@/utils/supabase/client';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEmailLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.append('redirectTo', redirectTo);

    startTransition(async () => {
      const res = await login(formData);
      if (res?.error) {
        setErrorMessage(res.error);
      }
    });
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <span className="text-[10px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
          Classroom LMS
        </span>
        <h1 className="text-2xl font-bold text-white mt-4">เข้าสู่ระบบ</h1>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full mb-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-3"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        เข้าสู่ระบบด้วย Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-slate-800"></div>
        <span className="text-xs text-slate-500">หรือใช้อีเมล</span>
        <div className="flex-1 h-px bg-slate-800"></div>
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">อีเมล</label>
          <input type="email" name="email" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">รหัสผ่าน</label>
          <input type="password" name="password" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white" />
        </div>
        <button type="submit" disabled={isPending} className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold">
          {isPending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-slate-400">กำลังโหลด...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
