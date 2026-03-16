import React, { useState } from 'react';

// รับ Props มา 3 ตัว: 
// isOpen (เปิด/ปิด), onClose (ฟังก์ชันตอนกดปิด), onSuccess (ฟังก์ชันตอนสร้างเสร็จ)
export default function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  // ถ้า isOpen เป็น false ให้ return null (ซ่อนหน้าต่างนี้ไปเลย)
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName) return alert('กรุณากรอกชื่อโปรเจค');

    // ดึงข้อมูล User จาก Local Storage เพื่อเอา ID ไปผูกกับโปรเจค
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return alert('กรุณาเข้าสู่ระบบก่อนสร้างโปรเจค');
    const user = JSON.parse(storedUser);

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          description: description,
          userId: user.id // ส่ง ID ไปให้ Backend
        }),
      });

      if (response.ok) {
        setProjectName('');    // ล้างช่องกรอกให้สะอาด
        setDescription('');
        onSuccess();           // 🌟 เรียกใช้ฟังก์ชันรีเฟรชข้อมูลที่ Dashboard ส่งมา
        onClose();             // ปิดหน้าต่าง Modal
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างโปรเจค');
      }
    } catch (error) {
      console.error(error);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#1C0D33] to-[#0A0414] p-8 rounded-2xl border border-[#301C5E] shadow-2xl w-full max-w-md transform transition-all">
        <h2 className="text-2xl font-bold text-[#A68CFF] mb-6 tracking-wide">สร้างโปรเจคใหม่</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">ชื่อโปรเจค <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors"
              placeholder="เช่น ระบบหลังบ้าน E-commerce"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">รายละเอียด (ไม่บังคับ)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors h-24 resize-none"
              placeholder="เขียนอธิบายโปรเจคสั้นๆ..."
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button 
              type="button" 
              onClick={onClose} // กดแล้วเรียกฟังก์ชันปิด Modal
              className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-[#301C5E] transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#6B4BFF] hover:bg-[#5A3EE0] text-white rounded-xl py-3 font-bold shadow-[0_0_15px_rgba(107,75,255,0.4)] transition-all"
            >
              สร้างโปรเจค
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}