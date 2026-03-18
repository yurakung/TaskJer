import React, { useState } from 'react';

export default function CreateTaskModal({ isOpen, onClose, onSuccess, projectId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert('กรุณากรอกชื่องานย่อย');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('projectId', Number(projectId));
    if (description.trim()) formData.append('description', description);
    if (file) formData.append('file', file);
    try {
      // ยิงข้อมูลไปหา NestJS ที่เราเพิ่งสร้างเมื่อกี้
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setFile(null);
        onSuccess(); // เรียกฟังก์ชันโหลดข้อมูลใหม่
        onClose();   // ปิด Modal
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างงานย่อย');
      }
    } catch (error) {
      console.error(error);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }finally {
      setIsLoading(false);
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

          <div>
            <label className="text-sm text-gray-400 mb-1 block">รายละเอียดงาน</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors"
              placeholder="พิมพ์อธิบายงานเพิ่มเติม..."
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">ไฟล์อ้างอิง (Reference)</label>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer bg-[#1C0D33] border border-[#301C5E] hover:border-[#7B5CFF] px-4 py-3 rounded-xl text-sm text-[#A68CFF] transition-colors flex items-center justify-center gap-2">
                📎 {file ? 'เปลี่ยนไฟล์แนบ' : 'คลิกเพื่อเลือกไฟล์'}
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  className="hidden" 
                />
              </label>
              {/* โชว์ชื่อไฟล์ที่เลือก */}
              {file && (
                <span className="text-xs text-[#00FFD1] bg-[#00FFD1]/10 px-3 py-1.5 rounded-lg border border-[#00FFD1]/20 truncate">
                  {file.name}
                </span>
              )}
            </div>
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