'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  order_index: number;
  drive_video_id: string;
  pdf_file_id?: string;
  is_completed?: boolean;
}

export default function CourseLearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  const currentUser = {
    fullName: 'สมชาย สายโค้ด',
    email: 'somchai@dev.th',
  };

  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 'les-01',
      title: 'บทที่ 1: แนะนำสถาปัตยกรรมระบบ LMS & Next.js App Router',
      order_index: 1,
      drive_video_id: '1aBcDeFgHiJkLmNoPqRsTuVwXyZ', // แทนที่ด้วย Drive File ID จริง
      is_completed: true,
    },
    {
      id: 'les-02',
      title: 'บทที่ 2: การออกแบบฐานข้อมูลและ Row Level Security (RLS)',
      order_index: 2,
      drive_video_id: '1XyZAbCdEfGhIjKlMnOpQrStUvW',
      is_completed: false,
    },
  ]);

  const [activeLesson, setActiveLesson] = useState<Lesson>(lessons[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignment' | 'quiz' | 'certificate'>('overview');
  const [watermarkPos, setWatermarkPos] = useState({ top: '15%', left: '20%' });

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Assignment State
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [hwStatus, setHwStatus] = useState<string | null>(null);

  // Floating Watermark Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setWatermarkPos({
        top: `${Math.floor(Math.random() * 60) + 15}%`,
        left: `${Math.floor(Math.random() * 50) + 15}%`,
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleVideoEnded = () => {
    setLessons((prev) =>
      prev.map((l) => (l.id === activeLesson.id ? { ...l, is_completed: true } : l))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors text-xs flex items-center gap-1.5"
          >
            ← กลับหน้าหลัก
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <h1 className="text-sm font-semibold text-white truncate max-w-md hidden sm:block">
            Fullstack Next.js & Supabase Masterclass
          </h1>
        </div>

        <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          กำลังเรียน: บทที่ {activeLesson.order_index}
        </span>
      </header>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Player Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 gap-6">
          <div
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            <video
              key={activeLesson.drive_video_id}
              controls
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              className="w-full h-full object-contain"
              src={`/api/video/${activeLesson.drive_video_id}`}
              onEnded={handleVideoEnded}
            >
              เบราว์เซอร์ไม่รองรับการเล่นวิดีโอ
            </video>

            {/* Dynamic Watermark */}
            <div
              className="absolute pointer-events-none transition-all duration-1000 ease-in-out z-20 flex flex-col opacity-35 text-left"
              style={{ top: watermarkPos.top, left: watermarkPos.left }}
            >
              <span className="text-xs font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded shadow">
                {currentUser.fullName} ({currentUser.email})
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            {(['overview', 'assignment', 'quiz', 'certificate'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'overview' && '📖 รายละเอียด'}
                {tab === 'assignment' && '✍️ ส่งการบ้าน'}
                {tab === 'quiz' && '❓ ทำแบบทดสอบ'}
                {tab === 'certificate' && '🎓 ใบประกาศนียบัตร'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-bold text-white">{activeLesson.title}</h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  เนื้อหาบทเรียนการสร้างระบบห้องเรียนออนไลน์ เชื่อมต่อ Google Drive API และจัดการสิทธิ์ความปลอดภัย
                </p>
              </div>
            )}

            {activeTab === 'assignment' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white">ส่งการบ้านประจำบท</h3>
                <input
                  type="file"
                  onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-300"
                />
                {hwStatus && <p className="text-xs text-emerald-400">{hwStatus}</p>}
                <button
                  onClick={() => setHwStatus('บันทึกการส่งการบ้านสำเร็จเรียบร้อย! 🎉')}
                  disabled={!assignmentFile}
                  className="w-fit px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-all"
                >
                  ส่งการบ้าน
                </button>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white">แบบทดสอบ: RLS ใน Supabase คืออะไร?</h3>
                <div className="flex flex-col gap-2">
                  {['A. เพิ่มความเร็ววิดีโอ', 'B. จำกัดสิทธิ์การเข้าถึงแถวข้อมูลตามระดับสิทธิ์ของผู้ใช้'].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setQuizAnswers({ q1: opt.slice(0, 1) })}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        quizAnswers.q1 === opt.slice(0, 1)
                          ? 'border-emerald-500 bg-emerald-600/20 text-emerald-300'
                          : 'border-slate-800 bg-slate-950 text-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizSubmitted && <p className="text-xs text-emerald-400 font-semibold">คุณตอบถูกต้อง! (1/1 ข้อ)</p>}
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={!quizAnswers.q1}
                  className="w-fit px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold"
                >
                  ตรวจคำตอบ
                </button>
              </div>
            )}

            {activeTab === 'certificate' && (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">ใบประกาศนียบัตรสำเร็จหลักสูตร</h3>
                  <p className="text-xs text-slate-400 mt-1">รับรองผลการเรียนคอร์ส ID: {courseId}</p>
                </div>
                <button
                  onClick={() => alert('ดาวน์โหลด Certificate สำเร็จ')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40"
                >
                  📥 รับ Certificate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">เนื้อหาหลักสูตร</span>
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                activeLesson.id === lesson.id
                  ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}
            >
              <span className="truncate">{lesson.title}</span>
              {lesson.is_completed && <span className="text-emerald-400 font-bold ml-2">✓</span>}
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}