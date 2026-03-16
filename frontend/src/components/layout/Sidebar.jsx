import React from 'react';
import logo from '../image/Logo-Taskjer.png';
import { useNavigate,useLocation } from 'react-router-dom';


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <div className="w-64 bg-[#0A0714] flex flex-col border-r border-[#1C1438] z-10 h-screen">
      {/* โลโก้ TaskJer */}
      <div className="h-16 flex items-center px-6">
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="TASKJER Logo"
            className="h-16 w-auto"
          />
        </div>
      </div>

      {/* ปุ่มเมนูต่างๆ */}
      {!isHomePage && (
        <div className="px-4 mt-4 space-y-2" onClick={() => navigate('/dashboard')}>
          <button className="w-full flex items-center gap-3 px-4 py-2 bg-[#2A1B66] hover:bg-[#352382] transition-colors rounded-lg text-sm font-medium shadow-md text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            HOME
          </button>
        </div>
      )}
    </div>
  );
}