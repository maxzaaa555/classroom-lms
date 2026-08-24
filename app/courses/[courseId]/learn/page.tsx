export default function CourseLearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = React.use(params);
  const courseId = resolvedParams.courseId;
  // ... โค้ดส่วนที่เหลือ



import { markLessonComplete, claimCertificate } from '@/actions/learning';

// ใน CourseLearnPage Component:
const handleVideoEnded = async () => {
  try {
    // 1. อัปเดต UI ทันที
    setLessons((prev) =>
      prev.map((l) => (l.id === activeLesson.id ? { ...l, is_completed: true } : l))
    );

    // 2. บันทึกลง Supabase จริง
    await markLessonComplete('usr_student_01', activeLesson.id);
  } catch (err) {
    console.error('Failed to mark lesson complete:', err);
  }
};

const handleClaimCert = async () => {
  try {
    const res = await claimCertificate('usr_student_01', courseId);
    if (res.success && res.certNumber) {
      window.open(`/verify/${res.certNumber}`, '_blank');
    } else {
      alert(res.message || 'เกิดข้อผิดพลาดในการออกใบรับรอง');
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
  }
};