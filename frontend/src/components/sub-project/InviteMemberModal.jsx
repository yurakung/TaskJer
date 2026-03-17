import React, { useState } from 'react';

export default function InviteMemberModal({ isOpen, onClose, onSuccess, projectId }) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return alert('กรุณากรอก Email ที่ต้องการเชิญ');

    try {
      // ยิง Email ไปให้หลังบ้านเช็คและบันทึกลง Database
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('เชิญสมาชิกสำเร็จแล้ว! 🎉');
        setEmail('');
        onSuccess(); // สั่งให้หน้าหลักดึงข้อมูลสมาชิกมาโชว์ใหม่
        onClose();   // ปิดหน้าต่าง
      } else {
        // ถ้าไม่เจอ Email ในระบบ หรือเชิญซ้ำ มันจะพ่นข้อความจากหลังบ้านมาบอกครับ
        alert(data.message || 'เกิดข้อผิดพลาดในการเชิญ');
      }
    } catch (error) {
      console.error(error);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#1C0D33] to-[#0A0414] p-8 rounded-2xl border border-[#301C5E] shadow-2xl w-full max-w-md transform transition-all">
        <h2 className="text-2xl font-bold text-[#A68CFF] mb-2 tracking-wide">เชิญเพื่อนร่วมทีม</h2>
        <p className="text-sm text-gray-400 mb-6">พิมพ์ Email ของคนที่มีบัญชี TaskJer อยู่แล้วเพื่อดึงเข้าโปรเจค</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email ผู้ใช้งาน <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors"
              placeholder="เช่น friend@example.com"
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
              ส่งคำเชิญ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}