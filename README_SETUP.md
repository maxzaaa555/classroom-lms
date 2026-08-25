# การตั้งค่าระบบ Classroom LMS แบบสมบูรณ์

ไฟล์ที่แนบมานี้ประกอบด้วย:
1. ระบบ Login ด้วย Google OAuth (Gmail)
2. หน้า Dashboard สำหรับผู้สอน
3. ระบบตรวจการบ้านและให้คะแนน

## วิธีติดตั้งและนำไปใช้งาน:

1. นำไฟล์ทั้งหมดในโฟลเดอร์ `app`, `utils`, `actions` ไปวางทับในโปรเจกต์ Next.js ของคุณ
2. รันคำสั่งติดตั้ง Package เพิ่มเติม (หากยังไม่มี):
   `npm install @supabase/ssr`

## วิธีเปิดใช้งาน Google Login (Gmail) บน Supabase

1. ไปที่เว็บไซต์ **Google Cloud Console** (console.cloud.google.com)
2. สร้าง Project ใหม่ -> ไปที่ **APIs & Services** -> **Credentials**
3. สร้าง **OAuth client ID** เลือก Application type เป็น "Web application"
4. ในช่อง **Authorized redirect URIs** ให้ใส่:
   `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
   *(ดู URL นี้ได้จากเมนู Authentication > Providers > Google ในหน้าเว็บ Supabase)*
5. นำ `Client ID` และ `Client Secret` ที่ได้จาก Google ไปใส่ในหน้าต่างตั้งค่า Google Provider บน Supabase แล้วกด Save

## การอัปเดตขึ้น Vercel

เมื่อวางไฟล์เสร็จและตั้งค่า Google เรียบร้อยแล้ว ให้ Push โค้ด:
`git add .`
`git commit -m "Add Google OAuth and Instructor system"`
`git push origin main`
