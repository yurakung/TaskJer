# 🚀 TaskJer - การติดตั้งและวิธีรันโปรเจค

คู่มือสำหรับการติดตั้งและรันโปรเจค **TaskJer** บนเครื่องของคุณ (Local Environment)

---

## ⚠️ สิ่งที่ต้องมีก่อนเริ่ม (Prerequisites)

โปรดตรวจสอบให้แน่ใจว่าคุณได้ติดตั้ง:

* Node.js (เวอร์ชัน 16 ขึ้นไป)
* Database (MySQL หรือ PostgreSQL)
* Git (แนะนำ)

---

## 🧩 โครงสร้างโปรเจค

โปรเจคนี้แบ่งออกเป็น 2 ส่วนหลัก:

* `backend` → API + Database
* `frontend` → หน้าเว็บ (UI)

> 💡 **คำแนะนำ:** ควรเปิด Terminal 2 หน้าต่าง เพื่อรัน Backend และ Frontend แยกกัน

---

## ⚙️ วิธีการติดตั้ง (Installation Setup)

### 🛠️ ส่วนที่ 1: Backend (API & Database)

เปิด Terminal หน้าต่างที่ 1 แล้วรันคำสั่ง:

```bash
# 1. เข้าไปที่โฟลเดอร์ backend
cd backend

# 2. ติดตั้ง dependencies
npm install

# 3. ซิงค์ schema กับ database
npx prisma db push

# 4. รันเซิร์ฟเวอร์
npm run start:dev
```

---

### 🎨 ส่วนที่ 2: Frontend (Web UI)

เปิด Terminal หน้าต่างที่ 2 แล้วรันคำสั่ง:

```bash
# 1. เข้าไปที่โฟลเดอร์ frontend
cd frontend

# 2. ติดตั้ง dependencies
npm install

# 3. รันแอป
npm run dev
```

---

## 🌐 การเข้าใช้งานระบบ

เมื่อรันสำเร็จ:

* Frontend → http://localhost:3000
* Backend → http://localhost:3001 (หรือ port ที่ตั้งไว้)

---

## 📝 หมายเหตุเพิ่มเติม

* หากมีการแก้ไข schema ของ Prisma ให้รัน:

  ```bash
  npx prisma db push
  ```
* ตรวจสอบไฟล์ `.env` ให้ถูกต้องก่อนรันโปรเจค
* หากเจอปัญหา port ชนกัน ให้เปลี่ยน port ใน config

---

## ✅ พร้อมใช้งาน!

ตอนนี้คุณสามารถเริ่มใช้งานระบบ **TaskJer** ได้แล้ว 🎉
