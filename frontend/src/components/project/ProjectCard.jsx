import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  if (!project) return null;
  return (
    // เมื่อกดที่การ์ด จะให้เปลี่ยนหน้าไปที่หน้ารายละเอียดโปรเจค (เดี๋ยวเราค่อยไปสร้างหน้านี้กันทีหลัง)
    <div 
      onClick={() => navigate('/project')}
      className="w-72 bg-[#0C1438] rounded-xl p-5 border border-[#2A2359] hover:border-[#6B4BFF] hover:shadow-[0_0_15px_rgba(107,75,255,0.2)] transition-all cursor-pointer flex flex-col justify-between"
    >
      {/* ส่วนบน: ชื่อโปรเจค และ จำนวนงานย่อย */}
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-white font-medium text-lg truncate pr-2">
          {project.name}
        </h3>
        <span className="bg-[#8A8A8A]/40 text-[10px] px-2.5 py-1 rounded-full text-gray-200 whitespace-nowrap">
          0 งานย่อย
        </span>
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