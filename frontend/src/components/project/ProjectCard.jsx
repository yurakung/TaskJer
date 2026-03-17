import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = project.userId === currentUser.id;
  console.log('หน้าตาข้อมูลโปรเจค:', project);
  if (!project) return null;
  return (
    // เมื่อกดที่การ์ด จะให้เปลี่ยนหน้าไปที่หน้ารายละเอียดโปรเจค (เดี๋ยวเราค่อยไปสร้างหน้านี้กันทีหลัง)
    <div 
      onClick={() => navigate(`/project/${project.id}`)}
      className="w-72 bg-[#0C1438] rounded-xl p-5 border border-[#2A2359] hover:border-[#6B4BFF] hover:shadow-[0_0_15px_rgba(107,75,255,0.2)] transition-all cursor-pointer flex flex-col justify-between"
    >
      {/* ส่วนบน: ชื่อโปรเจค และ จำนวนงานย่อย */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white truncate pr-4">
            {project.name}
          </h3>
          <span className="bg-[#2A1B66] text-gray-300 text-xs px-3 py-1.5 rounded-full whitespace-nowrap">
            0 งานย่อย
          </span>
        </div>
        
        {/* 🌟 แสดงชื่อเจ้าของโปรเจค หรือ ป้ายบอกสถานะ */}
        <div className="mb-6">
          {isOwner ? (
            <span className="text-xs font-medium text-[#7B5CFF] bg-[#1C0D33] px-2 py-1 rounded-md border border-[#301C5E]">
              👑 โปรเจคของคุณ
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-400">
              รับเชิญจาก: <span className="text-white">{project.user?.name}</span>
            </span>
          )}
        </div>
      </div>

      {/* ส่วนล่าง: หลอดความคืบหน้า (Progress Bar) */}
      <div>
        <p className="text-[10px] text-gray-400 mb-1.5">ความคืบหน้า</p>
        <div className="w-full bg-[#1C1438] h-2.5 rounded-full overflow-hidden">
          {/* ปรับความยาวหลอดสีเขียวตรง width */}
          <div 
            className="bg-[#00FF00] h-2 rounded-full shadow-[0_0_10px_rgba(0,255,0,0.5)]" 
            style={{ width: `${project.progress || 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}