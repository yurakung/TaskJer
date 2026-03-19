import React, { useState, useEffect } from 'react';

export default function Topbar() {
  const [user, setUser] = useState(null);

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
    <div className="h-16 flex justify-end items-center px-8 border-b border-[#1C1438] bg-[#060411]/80 backdrop-blur-sm z-10 w-full text-white">
      <div className="flex items-center gap-6">
        
        {user ? (
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* 🟢 แก้ตรงนี้: ใส่ (user.name || 'U') เพื่อกันพัง */}
              <div className="w-8 h-8 flex items-center justify-center bg-[#7B5CFF] rounded-full font-bold text-white shadow-[0_0_10px_rgba(123,92,255,0.5)]">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium tracking-wide text-gray-200">
                {/* 🟢 แก้ตรงนี้: ถ้าไม่มีชื่อ ให้แสดงคำว่า User แทน */}
                {user.name || 'User'}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="text-xs text-[#FF5C5C] hover:text-[#FF8A8A] underline tracking-wide transition-colors ml-2"
            >
              Logout
            </button>
          </div>

        ) : (
          <>
            {/* <a href="/login" className="text-gray-400 hover:text-white transition-colors tracking-wide text-sm font-medium cursor-pointer">
              LOGIN
            </a>
            <a href="/register" className="bg-[#D9D9D9] hover:bg-white text-black px-4 py-1.5 rounded-full font-bold flex items-center gap-1 transition-transform hover:scale-105 shadow-lg cursor-pointer">
              Register <span className="text-xl leading-none mb-0.5">+</span>
            </a> */}
          </>
        )}

      </div>
    </div>
  );
}