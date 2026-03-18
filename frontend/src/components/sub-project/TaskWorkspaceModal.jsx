import React, { useState, useEffect } from 'react';

export default function TaskWorkspaceModal({ isOpen, onClose, taskId, projectMembers, currentUserRole, currentUserId, onSuccess }) {
  const [taskDetail, setTaskDetail] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [file, setFile] = useState(null);

  const fetchTaskDetail = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/detail/${taskId}`);
      if (res.ok) setTaskDetail(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) fetchTaskDetail();
  }, [isOpen, taskId]);

  if (!isOpen || !taskDetail) return null;

  const isOwnerOrViceHead = currentUserRole === 'owner' || currentUserRole === 'vice-head';

  // ส่งแชท
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    // 1. จัดของลงกล่องพัสดุ
    const formData = new FormData();
    formData.append('userId', currentUserId);
    if (message.trim()) formData.append('text', message);
    if (file) formData.append('file', file);

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/message`, {
        method: 'POST',
        // ✅ 2. ลบ headers ออก และเปลี่ยน body ให้ส่งกล่อง formData ไปเลยแบบนี้ครับ!
        body: formData, 
      });
      
      if (res.ok) {
        setMessage('');
        setFile(null); // ล้างไฟล์ที่เลือกไว้
        document.getElementById('file-upload').value = ''; // ล้างค่าใน input
        fetchTaskDetail(); // โหลดแชทใหม่
      } else {
        const errorData = await res.json();
        alert(`ส่งไม่สำเร็จ: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  };

  // มอบหมายงาน
  const handleAssign = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: Number(selectedUser), requesterId: currentUserId }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedUser('');
        fetchTaskDetail(); // โหลดรายชื่อใหม่
        onSuccess(); // อัปเดตหน้าหลักด้วย
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0A0414] border border-[#301C5E] w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1C0D33] to-[#0A0414] border-b border-[#301C5E] p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#A68CFF]">{taskDetail.title}</h2>
            <span className="text-sm text-gray-400">สถานะ: {taskDetail.status}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* ส่วนแชท (ซ้าย) */}
          <div className="flex-1 flex flex-col border-r border-[#301C5E]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#060411]">
              {taskDetail.messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">ยังไม่มีข้อความ เริ่มต้นคุยงานกันเลย!</p>
              ) : (
                taskDetail.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl p-3 ${msg.userId === currentUserId ? 'bg-[#7B5CFF] text-white rounded-br-none' : 'bg-[#1C0D33] text-gray-200 border border-[#301C5E] rounded-bl-none'}`}>
                      <p className="text-xs text-[#D1C4FF] mb-1 font-bold">{msg.user.name}</p>
                      {msg.text && <p>{msg.text}</p>}
                      {msg.fileUrl && (
                        <div className="mt-2">
                          {msg.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) != null ? (
                            <img src={msg.fileUrl} alt="attachment" className="max-w-full h-auto rounded-lg border border-[#301C5E]/50" />
                          ) : (
                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline text-sm hover:text-white flex items-center gap-1">
                              📎 โหลดไฟล์แนบ
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* กล่องพิมพ์แชท */}
            <form onSubmit={handleSendMessage} className="p-4 bg-[#0A0414] border-t border-[#301C5E] flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-[#121212] text-white px-4 py-3 rounded-xl border border-[#301C5E] focus:outline-none focus:border-[#7B5CFF]"
                placeholder="พิมพ์ข้อความ หรือแปะลิงก์ไฟล์..."
              />
              <button type="submit" className="bg-[#6B4BFF] hover:bg-[#5A3EE0] text-white px-6 py-3 rounded-xl font-bold transition-all">
                ส่ง
              </button>
              <div className="flex items-center gap-2 px-2">
                <label className="text-xs text-gray-400 cursor-pointer hover:text-[#A68CFF] transition-colors flex items-center gap-1">
                  📎 แนบไฟล์/รูปภาพ
                  <input 
                    type="file" 
                    id="file-upload" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    className="hidden" // ซ่อน input จริงไว้
                  />
                </label>
                {/* โชว์ชื่อไฟล์ที่เลือก */}
                {file && <span className="text-xs text-[#00FFD1] bg-[#00FFD1]/10 px-2 py-1 rounded border border-[#00FFD1]/20 truncate max-w-[200px]">{file.name}</span>}
              </div>
            </form>
          </div>

          {/* ส่วนรายชื่อคนทำงาน (ขวา) */}
          <div className="w-72 bg-[#0A0414] p-6 flex flex-col gap-6 overflow-y-auto">
            <div>
              <h3 className="text-white font-bold mb-4 border-b border-[#301C5E] pb-2">ผู้รับผิดชอบงาน</h3>
              <div className="flex flex-col gap-2">
                {taskDetail.assignees.length === 0 ? (
                  <p className="text-sm text-gray-500">ยังไม่มีคนรับผิดชอบ</p>
                ) : (
                  taskDetail.assignees.map(a => (
                    <div key={a.id} className="flex items-center gap-2 text-sm text-gray-300 bg-[#1C0D33] p-2 rounded-lg border border-[#301C5E]">
                      <div className="w-6 h-6 rounded-full bg-[#7B5CFF] flex items-center justify-center text-xs text-white font-bold">
                        {a.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{a.user.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ส่วนเชิญคนเข้างาน (โชว์เฉพาะ Owner/Vice-Head) */}
            {isOwnerOrViceHead && (
              <div className="mt-auto bg-[#1C0D33] p-4 rounded-xl border border-[#301C5E]">
                <h4 className="text-sm font-bold text-[#A68CFF] mb-3">มอบหมายงานเพิ่ม</h4>
                <select 
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full bg-[#121212] text-white text-sm px-3 py-2 rounded-lg border border-[#301C5E] mb-3 focus:outline-none"
                >
                  <option value="">-- เลือกสมาชิก --</option>
                  {projectMembers.map(m => (
                    <option key={m.userId} value={m.userId}>{m.user.name} ({m.role})</option>
                  ))}
                </select>
                <button 
                  onClick={handleAssign}
                  className="w-full bg-[#00FFD1]/20 hover:bg-[#00FFD1]/30 text-[#00FFD1] border border-[#00FFD1]/50 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  + เพิ่มเข้างาน
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}