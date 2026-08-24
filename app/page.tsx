'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [fileId, setFileId] = useState('');
  const [activeId, setActiveId] = useState('');
  const [watermarkPos, setWatermarkPos] = useState({ top: '20%', left: '20%' });

  // สุ่มย้ายตำแหน่งลายน้ำทุก 5 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      setWatermarkPos({
        top: `${Math.floor(Math.random() * 60) + 15}%`,
        left: `${Math.floor(Math.random() * 50) + 15}%`,
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-6 sm:p-12">
      {/* Header Banner */}
      <div className="max-w-4xl w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
            Next.js • Supabase • Google Drive LMS
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-3">
            ระบบห้องเรียนออนไลน์ (Classroom LMS)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            รองรับการสตรีมวิดีโอแบบป้องกันการดาวน์โหลด ป้องกันคลิกขวา และลายน้ำเคลื่อนที่
          </p>
        </div>

        {/* ปุ่มลิงก์ตรงไปยังหน้าห้องเรียนเต็มรูปแบบ */}
        <Link
          href="/courses/demo-course-01/learn"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2 shrink-0"
        >
          🎓 เข้าสู่ห้องเรียนจำลอง →
        </Link>
      </div>

      {/* กล่องทดสอบสตรีมวิดีโอจาก Google Drive File ID */}
      <div className="max-w-4xl w-full mt-10 flex flex-col gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-2">
            🎬 ทดสอบเล่นวิดีโอจาก Google Drive (Drive File ID)
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            นำ File ID จาก Google Drive (ที่แชร์สิทธิ์กับ Service Account แล้ว) มาวางเพื่อทดสอบการสตรีมผ่าน Next.js API
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="วาง Google Drive File ID ที่นี่..."
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              onClick={() => setActiveId(fileId)}
              disabled={!fileId.trim()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-all"
            >
              โหลดวิดีโอ
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        {activeId ? (
          <div
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 select-none shadow-2xl"
            onContextMenu={(e) => e.preventDefault()}
          >
            <video
              key={activeId}
              controls
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              className="w-full h-full object-contain pointer-events-auto"
              src={`/api/video/${activeId}`}
            >
              เบราว์เซอร์ไม่รองรับการเล่นวิดีโอ
            </video>

            {/* Dynamic Floating Watermark */}
            <div
              className="absolute pointer-events-none transition-all duration-1000 ease-in-out z-20 flex flex-col opacity-35 text-left"
              style={{ top: watermarkPos.top, left: watermarkPos.left }}
            >
              <span className="text-xs font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded shadow">
                Tester (demo@classroom.io)
              </span>
              <span className="text-[9px] font-mono text-slate-300 mt-0.5">
                Classroom LMS • Protected Stream
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-xs">
            <span className="text-3xl mb-2">📺</span>
            ยังไม่มีการโหลดวิดีโอ (กรุณากรอก File ID หรือกดปุ่ม &quot;เข้าสู่ห้องเรียนจำลอง&quot;)
          </div>
        )}
      </div>
    </main>
  );
}