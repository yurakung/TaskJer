import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
// อย่าลืม import โลโก้ของคุณ (เช็ค path ให้ตรงกับเครื่องคุณนะครับ)
// import logo from '../components/image/Taskjer_Logo.png'; 

export default function Register() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ส่งไปทั้ง name, email, password
        body: JSON.stringify({ name, email, password }), 
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message); // แจ้งเตือนว่าสมัครสำเร็จ
        // สมัครเสร็จ เด้งกลับไปหน้า Login เพื่อให้ผู้ใช้ล็อกอินเองอีกรอบ
        navigate('/'); 
      } else {
        alert(data.message || 'สมัครสมาชิกไม่สำเร็จ');
      }

    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#060411] text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Topbar />

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10 relative">
            
            {/* โลโก้และหัวข้อ */}
            <div className="flex flex-col items-center gap-2 mb-6"> 
              {/* <img src={logo} alt="TASKJER Logo" className="h-40 w-auto mb-4" /> */}
              <div className="w-32 h-32 border-t-4 border-l-4 border-b-4 border-r-4 border-[#7B5CFF] flex items-center justify-center mb-4">
                 <span className="text-7xl text-[#7B5CFF] font-light">T</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7B5CFF] to-[#D1C4FF]">
                Create an Account
              </h1>
            </div>

            {/* กล่องแบบฟอร์ม Register */}
            <div className="bg-[#0C0822] p-8 rounded-2xl border border-[#2A2359] shadow-2xl w-full max-w-md flex flex-col items-center mt-4">
                <div className="text-[#A68CFF] tracking-[0.1em] mb-6 text-sm font-semibold">
                  สมัครสมาชิกใหม่
                </div>
                
                <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
                  {/* ช่อง Name */}
                  <input 
                    type="text" 
                    placeholder="Name" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#120E1E] text-white px-4 py-3 rounded-lg border border-[#2A2359] focus:outline-none focus:border-[#7B5CFF] transition-colors"
                  />

                  {/* ช่อง Email */}
                  <input 
                    type="email" 
                    placeholder="Email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#120E1E] text-white px-4 py-3 rounded-lg border border-[#2A2359] focus:outline-none focus:border-[#7B5CFF] transition-colors"
                  />

                  {/* ช่อง Password */}
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#120E1E] text-white px-4 py-3 rounded-lg border border-[#2A2359] focus:outline-none focus:border-[#7B5CFF] transition-colors"
                  />

                  {/* ปุ่ม REGISTER */}
                  <button 
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-[#6B4BFF] to-[#8A6DFF] hover:from-[#5A3EE0] hover:to-[#7B5CFF] transition-all text-white rounded-lg py-3 font-bold tracking-wider"
                  >
                    REGISTER
                  </button>

                  {/* ปุ่มย้อนกลับไปหน้า Login */}
                  <button 
                    type="button"
                    onClick={() => navigate('/')}
                    className="w-full mt-2 bg-[#1A152E] hover:bg-[#2A2359] transition-all text-white rounded-lg py-3 font-medium tracking-wider border border-[#2A2359]"
                  >
                    Back to Login
                  </button>
                </form>

            </div>
        </div>
      </div>
    </div>
  );
}