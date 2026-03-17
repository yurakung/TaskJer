import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

export default function ProjectDetail() {
  const { id } = useParams(); // 🌟 ดึงเลข ID โปรเจคมาจาก URL (เช่น /project/1 จะได้เลข 1 มา)
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!id || id === 'undefined') {
      console.error('ไม่พบ ID ของโปรเจค');
      return; 
    }

    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // ระหว่างรอข้อมูลโหลด ให้ขึ้นข้อความนี้ไปก่อน
  if (!project) {
    return (
      <div className="flex min-h-screen bg-[#060411] text-white items-center justify-center">
        กำลังโหลดข้อมูลโปรเจค...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#060411] text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Topbar />
        
        <div className="p-10 flex-1 overflow-y-auto">
          {/* ปุ่มย้อนกลับ */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
          >
            ← กลับไปหน้า Dashboard
          </button>

          {/* หัวข้อโปรเจค */}
          <div className="bg-gradient-to-r from-[#1C0D33] to-[#0A0414] border border-[#301C5E] p-8 rounded-2xl shadow-lg mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7B5CFF] to-[#D1C4FF] mb-2">
              {project.name}
            </h1>
            <p className="text-gray-400 text-lg">
              {project.description || 'ไม่มีคำอธิบายโปรเจค'}
            </p>
          </div>

          {/* พื้นที่สำหรับใส่ Task (งานย่อย) ในอนาคต */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-wide">งานย่อย (Tasks)</h2>
            <button className="bg-[#7B5CFF] hover:bg-[#6A4BE5] text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all">
              + สร้างงานย่อย
            </button>
          </div>
          
          <div className="bg-[#0A0714] border border-[#1C1438] rounded-2xl p-8 text-center text-gray-500">
            ยังไม่มีงานย่อยในโปรเจคนี้ กดปุ่มสร้างเพื่อเริ่มต้นได้เลย!
          </div>

        </div>
      </div>
    </div>
  );
}