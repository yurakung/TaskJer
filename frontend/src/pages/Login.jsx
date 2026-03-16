import React, { useState } from 'react';
import axios from 'axios'; // อย่าลืม import axios นะครับ

export default function Login() {
  // 1. สร้าง State มารอรับข้อมูล (เดี๋ยวเราค่อยทำช่องกรอกทีหลัง)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. สร้างฟังก์ชัน async สำหรับจัดการตอนกดปุ่ม
  const handleLoginClick = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      if (response.data.success) {
        // เซฟข้อมูล user ลง localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);

        alert('เข้าสู่ระบบสำเร็จ!');
        window.location.href = '/'; // เปลี่ยนไปหน้าแรก
      }
    } catch (error) {
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    // คลุมทั้งหน้าด้วยพื้นหลังสีน้ำเงิน/ม่วงเข้มมากๆ
    <div className="min-h-screen bg-[#060411] text-white flex font-sans">
      
      {/* ---------------- Sidebar (เมนูด้านซ้าย) ---------------- */}
      <div className="w-64 bg-[#0A0714] flex flex-col border-r border-[#1C1438]">
        {/* โลโก้ TaskJer บนซ้าย */}
        <div className="h-16 flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-l border-t border-[#6B4BFF] flex items-center justify-center">
              <span className="text-[#6B4BFF] text-xs font-bold ml-1 mt-1">T</span>
            </div>
            <span className="text-[#6B4BFF] text-sm tracking-[0.2em]">TASKJER</span>
          </div>
        </div>

        {/* ปุ่ม Home */}
        <div className="px-4 mt-4">
          <button className="w-full flex items-center gap-3 px-4 py-2 bg-[#2A1B66] hover:bg-[#352382] transition-colors rounded-lg text-sm text-gray-200">
            {/* ไอคอนบ้าน */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            HOME
          </button>
        </div>
      </div>

      {/* ---------------- Main Content (พื้นที่หลักด้านขวา) ---------------- */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Topbar (แถบด้านบน) */}
        <div className="h-16 flex justify-end items-center px-8 border-b border-[#1C1438]">
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors tracking-wide">
              LOGIN
            </button>
            <button className="bg-[#D9D9D9] hover:bg-white transition-colors text-black px-4 py-1.5 rounded-full font-medium flex items-center gap-1">
              create <span className="text-xl leading-none mb-0.5">+</span>
            </button>
          </div>
        </div>

        {/* ส่วนกล่อง Login ตรงกลาง */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-[420px] h-[520px] bg-gradient-to-b from-[#230C46] to-[#120524] rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 border border-[#301C5E]">

            {/* โลโก้ตัว T ใหญ่ในกรอบ */}
            <div className="relative w-36 h-36 mb-10 flex items-center justify-center">
              {/* เส้นกรอบขาด (มุมซ้ายบน) */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#7B5CFF]"></div>
              {/* เส้นกรอบขาด (มุมขวาล่าง) */}
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#7B5CFF]"></div>
              {/* ตัวอักษร T */}
              <span className="text-7xl text-[#7B5CFF] font-light">T</span>
            </div>

            {/* ชื่อระบบ TASKJER */}
            <h1 className="text-2xl font-light tracking-[0.4em] text-[#A68CFF] mb-12">
              TASKJER
            </h1>

            {/* 3. ใส่ onClick ให้ปุ่ม เพื่อเรียกใช้ฟังก์ชัน handleLoginClick */}
            <button 
              onClick={handleLoginClick} 
              className="w-[80%] bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors text-white rounded-2xl py-3.5 px-4 flex items-center justify-center gap-4 border border-gray-800 shadow-lg"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>

          </div>
        </div>
      </div>
      
    </div>
  );
}