import React, { useState, useRef, useEffect} from 'react';


export default function ProfileModal({ isOpen, onClose, currentUser }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser?.avatarUrl || null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(currentUser?.avatarUrl || null);
}, [currentUser]);

  if (!isOpen) return null;

  // ฟังก์ชันพรีวิวรูปภาพตอนเลือกไฟล์
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // สร้าง URL จำลองให้ดูรูปก่อนกดเซฟ
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง!');
      return;
    }

    const formData = new FormData();
    // 💡 ส่งค่าไปเท่าที่มีการเปลี่ยนแปลง
    if (name) formData.append('name', name);
    if (password) formData.append('password', password);
    if (file) formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}/profile`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        const updatedUserFromBackend = await response.json();
        
        // 1. ดึงข้อมูล User ปัจจุบันจาก LocalStorage
        const currentData = JSON.parse(localStorage.getItem('user') || '{}');
        
        // 2. รวมข้อมูลเก่ากับข้อมูลใหม่ที่ได้จาก Backend
        // 💡 ใส่ ?t=... หลัง URL รูปภาพเพื่อแก้ปัญหา Browser จำรูปเก่า (Cache)
        if (updatedUserFromBackend.avatarUrl) {
           updatedUserFromBackend.avatarUrl = `${updatedUserFromBackend.avatarUrl}?t=${new Date().getTime()}`;
        }

        const newUserData = { ...currentData, ...updatedUserFromBackend };
        
        // 3. เซฟลง LocalStorage
        localStorage.setItem('user', JSON.stringify(newUserData));
        
        alert('อัปเดตโปรไฟล์เรียบร้อยแล้ว!');
        
        // 4. ปิด Modal ก่อนแล้วค่อยโหลดหน้าใหม่ (เพื่อความเนียน)
        onClose(); 
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        alert(`อัปเดตไม่สำเร็จ: ${errorData.message || 'เกิดข้อผิดพลาด'}`);
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-black/80 pt-20 backdrop-blur-sm">
      <div className="bg-[#0A0414] border border-[#301C5E] w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1C0D33] to-[#0A0414] border-b border-[#301C5E] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">👤 แก้ไขโปรไฟล์</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
        </div>

        {/* ฟอร์มแก้ไขข้อมูล */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[70vh]">
          
          {/* โซนเปลี่ยนรูปโปรไฟล์ */}
          <div className="flex flex-col items-center mb-6">
            <div 
              className="w-24 h-24 rounded-full border-4 border-[#301C5E] bg-[#1C0D33] flex items-center justify-center text-3xl font-bold text-[#A68CFF] overflow-hidden mb-3 cursor-pointer relative group shadow-[0_0_15px_rgba(123,92,255,0.3)] hover:border-[#7B5CFF] transition-all"
              onClick={() => fileInputRef.current.click()}
            >
            {previewUrl ? (
            <img 
                src={
                previewUrl.startsWith('http') || previewUrl.startsWith('blob:')
                    ? previewUrl
                    : `http://localhost:5000${previewUrl}`
                } 
                alt="Profile" 
                className="w-full h-full object-cover" 
                />
            ) : (
                name.charAt(0).toUpperCase()
            )}
              {/* Overlay ตอนเอาเมาส์ชี้ */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-white font-bold">เปลี่ยนรูป</span>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">ชื่อผู้ใช้ (Name)</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors"
              />
            </div>
            
            <div className="pt-4 border-t border-[#301C5E]/50">
              <label className="block text-gray-300 text-sm font-bold mb-2">รหัสผ่านใหม่ <span className="text-gray-500 font-normal text-xs">(เว้นว่างหากไม่เปลี่ยน)</span></label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านใหม่..."
                className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors mb-3"
              />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่านใหม่..."
                className="w-full bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF] transition-colors"
                disabled={!password} // ล็อกไว้ถ้ายังไม่ได้พิมพ์รหัสผ่านใหม่
              />
            </div>
          </div>

          <button type="submit" className="w-full mt-8 bg-[#7B5CFF] hover:bg-[#6A4BE5] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg">
            💾 บันทึกการเปลี่ยนแปลง
          </button>
        </form>

      </div>
    </div>
  );
}