import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// นำเข้า Components ที่เราหั่นไว้
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import logo from '../components/image/Taskjer_Logo.png';

export default function Home() {
  const navigate = useNavigate();
  
  // สร้าง State สำหรับเก็บค่าที่ผู้ใช้พิมพ์ในช่อง Email และ Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ฟังก์ชันนี้จะทำงานตอนที่กดปุ่ม LOGIN
  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    try {
      // ยิงข้อมูลไปหา Backend ที่พอร์ต 5000
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // แปลงข้อมูลเป็น JSON
      });

      const data = await response.json(); // รอรับคำตอบจาก Backend

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        alert(data.message); // แจ้งเตือนว่าล็อกอินสำเร็จ
        console.log('Token ที่ได้:', data.token);
        // ล็อกอินผ่าน ค่อยให้เปลี่ยนหน้าไป Dashboard
        navigate('/dashboard'); 
      } else {
        // ถ้ารหัสผิด หรือไม่มีอีเมลนี้
        alert(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }

    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  return (
    // โครงสร้างหลักคลุมทั้งเว็บ
    <div className="flex min-h-screen bg-[#060411] text-white font-sans overflow-hidden">
      
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10 relative">
            
            {/* แสงพื้นหลัง */}
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#4E29A6] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
            
            <div className="flex flex-col items-center gap-2 mb-6"> 
              <img src={logo} alt="TASKJER Logo" className="h-80 w-auto" />
              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7B5CFF] to-[#D1C4FF] drop-shadow-lg">
                Welcome to TASKJER
              </h1>
            </div>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              แพลตฟอร์มจัดการโปรเจคและติดตามงานที่ออกแบบมาเพื่อทีมของคุณ แบ่ง Role ชัดเจน พร้อมระบบ Sub-project ที่ทำให้การทำงานง่ายขึ้น
            </p>

            {/* กล่องแบบฟอร์ม Login */}
            <div className="bg-gradient-to-b from-[#1C0D33] to-[#0A0414] p-8 rounded-2xl border border-[#301C5E] shadow-[0_0_40px_rgba(107,75,255,0.15)] w-full max-w-md flex flex-col items-center">
                <div className="text-[#A68CFF] tracking-[0.2em] mb-6 text-sm font-semibold uppercase">
                  เข้าสู่ระบบ
                </div>
                
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                  {/* ช่องกรอก Email */}
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#121212] text-white px-4 py-3.5 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors placeholder-gray-500"
                    />
                  </div>

                  {/* ช่องกรอก Password */}
                  <div>
                    <input 
                      type="password" 
                      placeholder="Password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#121212] text-white px-4 py-3.5 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors placeholder-gray-500"
                    />
                  </div>

                  {/* ปุ่มกดเข้าสู่ระบบ */}
                  <button 
                    type="submit"
                    className="w-full mt-2 bg-[#6B4BFF] hover:bg-[#5A3EE0] transition-all text-white rounded-xl py-3.5 font-bold tracking-wider shadow-[0_0_20px_rgba(107,75,255,0.3)] hover:shadow-[0_0_30px_rgba(107,75,255,0.5)]"
                  >
                    LOGIN
                  </button>
                  <button 
                    type="buttton"
                    onClick={() => navigate('/Register')}
                    className="w-full mt-2 hover:bg-[#5A3EE0] transition-all text-white rounded-xl py-3.5 font-bold tracking-wider shadow-[0_0_20px_rgba(107,75,255,0.3)] hover:shadow-[0_0_30px_rgba(107,75,255,0.5)]"
                  >
                    Register
                  </button>
                </form>

            </div>
        </div>
      </div>
      
    </div>
  );
}