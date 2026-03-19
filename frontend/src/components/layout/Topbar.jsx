import React, { useState, useEffect } from 'react';
import ProfileModal from '../profile/ProfileModal';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const [user, setUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div className="h-16 flex justify-end items-center px-8 border-b border-[#1C1438] bg-[#060411]/80 backdrop-blur-sm z-10 w-full text-white relative">
      <div className="flex items-center gap-6">
        
        {user ? (
          <div className="flex items-center gap-4">
            
            {/* 🌟 1. เปลี่ยนตรงนี้เป็นปุ่ม (button) เพื่อให้กดเปิด Modal ได้ */}
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-3 hover:bg-[#301C5E]/60 p-1.5 px-3 rounded-xl transition-all cursor-pointer text-left"
              title="แก้ไขโปรไฟล์"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-[#7B5CFF] rounded-full font-bold text-white shadow-[0_0_10px_rgba(123,92,255,0.5)] overflow-hidden border border-[#301C5E]">
                {/* 🌟 2. เช็คว่ามีรูปโปรไฟล์ไหม ถ้ามีโชว์รูป ถ้าไม่มีโชว์ตัวอักษร */}
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  (user.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span className="text-sm font-medium tracking-wide text-gray-200 block">
                  {user.name || 'User'}
                </span>
                <span className="text-[10px] text-[#A68CFF] block -mt-1 opacity-80">
                  แก้ไขโปรไฟล์
                </span>
              </div>
            </button>
            
            <button 
              onClick={handleLogout}
              className="text-xs text-[#FF5C5C] hover:text-[#FF8A8A] underline tracking-wide transition-colors ml-2"
            >
              Logout
            </button>
          </div>

        ) : (
          <>
            {/* ซ่อนปุ่ม Login/Register ไว้เหมือนเดิม */}
          </>
        )}

      </div>

      {/* 🌟 3. เรียกใช้ ProfileModal ไว้ล่างสุด */}
      {user && (
        <ProfileModal 
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={user}
        />
      )}
    </div>
  );
}