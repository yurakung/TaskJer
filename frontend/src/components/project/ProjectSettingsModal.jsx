import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectSettingsModal({ isOpen, onClose, project, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [confirmName, setConfirmName] = useState('');
  const navigate = useNavigate();

  // โหลดข้อมูลเดิมมาใส่ช่องพิมพ์ตอนเปิดหน้าต่าง
  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
      setConfirmName(''); // ล้างช่องยืนยันการลบทุกครั้งที่เปิด
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  // ฟังก์ชันกดเซฟการแก้ไข
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (response.ok) {
        onSuccess(); // สั่งให้หน้าหลักโหลดข้อมูลใหม่
        onClose();
      } else {
        alert('บันทึกไม่สำเร็จ');
      }
    } catch (error) {
      console.error(error);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
  };

  // ฟังก์ชันกดลบโปรเจค
  const handleDelete = async () => {
    if (confirmName !== project.name) {
      alert('พิมพ์ชื่อโปรเจคไม่ตรงกัน กรุณาลองใหม่!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${project.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onClose();
        navigate('/dashboard'); // ลบเสร็จ เด้งกลับหน้า Dashboard ทันที
      } else {
        alert('ลบโปรเจคไม่สำเร็จ');
      }
    } catch (error) {
      console.error(error);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0A0414] border border-[#301C5E] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        <div className="bg-gradient-to-r from-[#1C0D33] to-[#0A0414] border-b border-[#301C5E] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">⚙️ ตั้งค่าโปรเจค</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* โซนที่ 1: แก้ไขข้อมูลทั่วไป */}
          <form onSubmit={handleSave} className="space-y-4 mb-8">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">ชื่อโปรเจค <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">รายละเอียด (ถ้ามี)</label>
              <textarea 
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors"
              />
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg">
              SAVE
            </button>
          </form>

          {/* โซนที่ 2: โซนอันตราย (Danger Zone) */}
          <div className="border-t border-red-900/50 pt-6">
            <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
              ⚠️ โซนอันตราย (Danger Zone)
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              การลบโปรเจคจะไม่สามารถกู้คืนได้ ข้อมูลงานย่อย แชท และไฟล์ทั้งหมดจะถูกลบทิ้งอย่างถาวร
            </p>
            <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl">
              <label className="block text-gray-300 text-sm mb-2">
                พิมพ์ชื่อ <span className="font-bold text-white">"{project.name}"</span> เพื่อยืนยันการลบ
              </label>
              <input 
                type="text" 
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder="พิมพ์ชื่อโปรเจคที่นี่..."
                className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-red-900/50 focus:outline-none focus:border-red-500 transition-colors mb-3"
              />
              <button 
                type="button"
                onClick={handleDelete}
                disabled={confirmName !== project.name}
                className={`w-full font-bold py-3 px-4 rounded-xl transition-all 
                  ${confirmName === project.name ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-red-900/30 text-red-500/50 cursor-not-allowed'}
                `}
              >
                DELETE PROJECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}