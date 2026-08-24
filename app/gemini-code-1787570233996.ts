'use client';

import React, { useState, useEffect, useTransition, use } from 'react';
import Link from 'next/link';
import CertificateClaimCard from '@/components/CertificateClaimCard';
import QuizPlayer from '@/components/QuizPlayer';

// Mock Interfaces (ให้ตรงกับ Supabase Schema)
interface Lesson {
  id: string;
  title: string;
  order_index: number;
  drive_video_id: string;
  pdf_file_id?: string;
  is_completed?: boolean;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  max_score: number;
}

export default function CourseLearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  // Mock Current User
  const currentUser = {
    id: 'usr_student_01',
    fullName: 'สมชาย สายโค้ด',
    email: 'somchai@dev.th',
  };

  // Mock Course & Lessons Data
  const [courseTitle] = useState('Fullstack Next.js & Supabase Masterclass');
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 'les-01',
      title: 'บทที่ 1: แนะนำสถาปัตยกรรมระบบ LMS & Next.js App Router',
      order_index: 1,
      drive_video_id: '1aBcDeFgHiJkLmNoPqRsTuVwXyZ', // ใส่ Google Drive Video File ID ของคุณ
      pdf_file_id: '1PdfDocumentSampleDriveId01',
      is_completed: true,
    },
    {
      id: 'les-02',
      title: 'บทที่ 2: การออกแบบฐานข้อมูลและ Row Level Security (RLS)',
      order_index: 2,
      drive_video_id: '1XyZAbCdEfGhIjKlMnOpQrStUvW',
      pdf_file_id: '1PdfDocumentSampleDriveId02',
      is_completed: false,
    },
    {
      id: 'les-03',
      title: 'บทที่ 3: เชื่อมต่อ Google Drive API และ Video Streaming',
      order_index: 3,
      drive_video_id: '1MnOpQrStUvWxYzAbCdEfGhIjKl',
      is_completed: false,
    },
  ]);

  const [activeLesson, setActiveLesson] = useState<Lesson>(lessons[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignment' | 'quiz' | 'certificate'>('overview');

  // Watermark Floating Coordinates
  const [watermarkPos, setWatermarkPos] = useState({ top: '15%', left: '20%' });

  // Assignment Upload State
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();

  // ลายน้ำสุ่มขยับตำแหน่งทุก 5 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      setWatermarkPos({
        top: `${Math.floor(Math.random() * 60) + 15}%`,
        left: `${Math.floor(Math.random() * 50) + 15}%`,
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // บันทึกสถานะว่าดูวิดีโอจบแล้ว
  const handleVideoEnded = () => {
    setLessons((prev) =>
      prev.map((l) => (l.id === activeLesson.id ? { ...l, is_completed: true } : l))
    );
  };

  // Mock การส่งการบ้าน
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentFile) return;

    startUploadTransition(async () => {
      setUploadStatus('กำลังอัปโหลดไฟล์ขึ้น Google Drive...');
      // จำลอง Delay อัปโหลด
      setTimeout(() => {
        setUploadStatus('ส่งการบ้านเรียบร้อยแล้ว! อาจารย์จะทำการตรวจและให้คะแนนเร็วๆ นี้ 🎉');
        setAssignmentFile(null);
      }, 1500);
    });
  };

  // Mock Quiz สำหรับบทเรียนปัจจุบัน
  const mockQuiz = {
    id: 'quiz-01',
    title: `แบบทดสอบประจำ: ${activeLesson.title}`,
    time_limit_minutes: 10,
    passing_score: 60,
  };

  const mockQuestions = [
    {
      id: 'q1',
      question_text: 'Row Level Security (RLS) ใน Supabase มีหน้าที่หลักอะไร?',
      options: [
        { id: 'A', text: 'เพิ่มความเร็วในการสตรีมวิดีโอ' },
        { id: 'B', text: 'กำหนดและจำกัดสิทธิ์การเข้าถึงข้อมูลระดับแถวตาม Token ผู้ใช้' },
        { id: 'C', text: 'แปลงไฟล์ PDF เป็นภาพอัตโนมัติ' },
        { id: 'D', text: 'สร้างลายน้ำบนหน้าจอ' },
      ],
      order_index: 1,
    },
    {
      id: 'q2',
      question_text: 'การทำ Anti-Hotlink สำหรับวิดีโอ Google Drive ใช้เทคนิคใด?',
      options: [
        { id: 'A', text: 'เปิด Public Link บน Google Drive' },
        { id: 'B', text: 'ปิด JavaScript บนเบราว์เซอร์' },
        { id: 'C', text: 'สตรีมผ่าน Server Route Handler โดยตรวจสอบ Auth Session ก่อนส่งข้อมูล' },
        { id: 'D', text: 'ฝังวิดีโอลงในฐานข้อมูล Supabase' },
      ],
      order_index: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/student/dashboard"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors text-xs flex items-center gap-1.5"
          >
            ← กลับแดชบอร์ด
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <h1 className="text-sm font-semibold text-white truncate max-w-md hidden sm:block">
            {courseTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            กำลังเรียน: บทที่ {activeLesson.order_index}
          </span>
        </div>
      </header>

      {/* Main Grid Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video Player & Tabs (Main Area) */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 gap-6">
          {/* Protected Video Player */}
          <div
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none group"
            onContextMenu={(e) => e.preventDefault()}
          >
            <video
              key={activeLesson.drive_video_id}
              controls
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              className="w-full h-full object-contain pointer-events-auto"
              src={`/api/video/${activeLesson.drive_video_id}`}
              onEnded={handleVideoEnded}
            >
              เบราว์เซอร์ไม่รองรับการเล่นวิดีโอ
            </video>

            {/* Dynamic Watermark */}
            <div
              className="absolute pointer-events-none transition-all duration-1000 ease-in-out z-20 flex flex-col opacity-30 text-left"
              style={{ top: watermarkPos.top, left: watermarkPos.left }}
            >
              <span className="text-xs font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded shadow">
                {currentUser.fullName} ({currentUser.email})
              </span>
              <span className="text-[9px] font-mono text-slate-300 mt-0.5">
                Classroom LMS • Protected Content
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📖 รายละเอียด & เอกสาร
            </button>
            <button
              onClick={() => setActiveTab('assignment')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'assignment'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✍️ ส่งการบ้านประจำบท
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ❓ ทำแบบทดสอบ Quiz
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'certificate'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 ขอรับ Certificate
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="mt-2">
            {/* Tab 1: Overview & PDF */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div>
                  <h2 className="text-lg font-bold text-white">{activeLesson.title}</h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    ในบทเรียนนี้คุณจะได้เรียนรู้แนวคิดพื้นฐาน การตั้งค่า Serverless API Route บน Next.js
                    เพื่อดึงข้อมูลแบบ Stream จาก Google Drive ร่วมกับ Row Level Security (RLS) ของ Supabase
                  </p>
                </div>

                {activeLesson.pdf_file_id && (
                  <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <h4 className="text-xs font-semibold text-white">เอกสารประกอบการเรียน (PDF)</h4>
                        <p className="text-[11px] text-slate-400">สไลด์บรรยายและโค้ดตัวอย่างประจำบทเรียน</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/attachment/${activeLesson.pdf_file_id}?mode=inline`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-all"
                      >
                        👁️ เปิดอ่าน
                      </a>
                      <a
                        href={`/api/attachment/${activeLesson.pdf_file_id}?mode=download`}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-all"
                      >
                        📥 ดาวน์โหลด PDF
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Assignment Submission */}
            {activeTab === 'assignment' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col gap-5">
                <div>
                  <h3 className="text-base font-bold text-white">ส่งการบ้าน: โจทย์ปฏิบัติการประจำบท</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    ให้ออกแบบ SQL Schema พร้อมเขียน RLS Policy ตามโจทย์ที่กำหนด แล้วบันทึกเป็นไฟล์ PDF หรือ ZIP ส่งที่นี่
                  </p>
                </div>

                <form onSubmit={handleAssignmentSubmit} className="flex flex-col gap-4">
                  <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 text-center transition-colors bg-slate-950/40">
                    <span className="text-3xl block mb-2">📁</span>
                    <input
                      type="file"
                      id="hw-upload"
                      className="hidden"
                      onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)}
                    />
                    <label
                      htmlFor="hw-upload"
                      className="cursor-pointer text-xs font-semibold text-emerald-400 hover:underline"
                    >
                      {assignmentFile ? assignmentFile.name : 'คลิกเพื่อเลือกไฟล์ (PDF, ZIP, DOCX สูงสุด 50MB)'}
                    </label>
                  </div>

                  {uploadStatus && (
                    <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                      {uploadStatus}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUploading || !assignmentFile}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2"
                    >
                      {isUploading ? 'กำลังอัปโหลด...' : 'ส่งการบ้านให้อาจารย์ตรวจ'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 3: Quiz Player */}
            {activeTab === 'quiz' && (
              <QuizPlayer
                quiz={mockQuiz}
                questions={mockQuestions}
                studentId={currentUser.id}
              />
            )}

            {/* Tab 4: Certificate Claim */}
            {activeTab === 'certificate' && (
              <CertificateClaimCard
                userId={currentUser.id}
                courseId={courseId}
              />
            )}
          </div>
        </div>

        {/* Right: Curriculum Sidebar */}
        <aside className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                เนื้อหาหลักสูตร
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                เรียนแล้ว {lessons.filter((l) => l.is_completed).length} จาก {lessons.length} บท
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-400 font-mono">
              {Math.round((lessons.filter((l) => l.is_completed).length / lessons.length) * 100)}%
            </div>
          </div>

          <div className="p-3 flex flex-col gap-2 overflow-y-auto flex-1">
            {lessons.map((lesson) => {
              const isActive = lesson.id === activeLesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isActive
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300 shadow-md'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold ${
                      lesson.is_completed
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {lesson.is_completed ? '✓' : lesson.order_index}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-snug line-clamp-2">
                      {lesson.title}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {lesson.is_completed ? 'เรียนจบแล้ว' : 'วิดีโอยังไม่จบ'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}