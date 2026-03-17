import React, { useState } from 'react';

export default function CreateTaskModal({ isOpen, onClose, onSuccess, projectId }) {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert('กรุณากรอกชื่องานย่อย');

    try {
      // ยิงข้อมูลไปหา NestJS ที่เราเพิ่งสร้างเมื่อกี้
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: title, 
          projectId: Number(projectId) // ส่ง ID โปรเจคไปผูกด้วย
        }),
      });

      if (response.ok) {
        setTitle('');
        onSuccess(); // เรียกฟังก์ชันโหลดข้อมูลใหม่
        onClose();   // ปิด Modal
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างงานย่อย');
      }
    } catch (error) {
      console.error(error);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#1C0D33] to-[#0A0414] p-8 rounded-2xl border border-[#301C5E] shadow-2xl w-full max-w-md transform transition-all">
        <h2 className="text-2xl font-bold text-[#A68CFF] mb-6 tracking-wide">สร้างงานย่อย (Task)</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">ชื่องานที่ต้องทำ <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors"
              placeholder="เช่น ออกแบบหน้า Login, ทำระบบ Database"
              required
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-[#301C5E] transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#6B4BFF] hover:bg-[#5A3EE0] text-white rounded-xl py-3 font-bold shadow-[0_0_15px_rgba(107,75,255,0.4)] transition-all"
            >
              เพิ่มงาน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}