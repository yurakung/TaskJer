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

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTaskDetail(); 
        onSuccess();       
      } else {
        alert('เปลี่ยนสถานะไม่สำเร็จ');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  useEffect(() => {
    if (isOpen && taskId) fetchTaskDetail();
  }, [isOpen, taskId]);

  if (!isOpen || !taskDetail) return null;

  const isOwnerOrViceHead = currentUserRole === 'owner' || currentUserRole === 'vice-head';

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    const formData = new FormData();
    formData.append('userId', currentUserId);
    if (message.trim()) formData.append('text', message);
    if (file) formData.append('file', file);

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/message`, {
        method: 'POST',
        body: formData, 
      });
      
      if (res.ok) {
        setMessage('');
        setFile(null); 
        document.getElementById('file-upload').value = ''; 
        fetchTaskDetail(); 
      } else {
        const errorData = await res.json();
        alert(`ส่งไม่สำเร็จ: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  };

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
        fetchTaskDetail(); 
        onSuccess(); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('คุณแน่ใจใช่ไหมว่าจะลบงานนี้? ข้อมูลแชทและไฟล์ทั้งหมดจะหายไปนะ!')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskDetail.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onSuccess(); 
        onClose();   
      } else {
        alert('ลบงานไม่สำเร็จ');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleRemoveAssignee = async (targetUserId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะเตะผู้รับผิดชอบคนนี้ออก?')) return;

    let requesterId = currentUserId; 

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskDetail.id}/assign/${targetUserId}?requesterId=${requesterId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        fetchTaskDetail();
        onSuccess(); 
      } else {
        alert(result.message || 'คุณไม่มีสิทธิ์เตะผู้ใช้งานคนนี้');
      }
    } catch (error) {
      console.error(error);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0A0414] border border-[#301C5E] w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        {/* 🌟 แก้ไขตรงนี้ให้มีเครื่องหมาย < นำหน้า */}
        <div className="bg-gradient-to-r from-[#1C0D33] to-[#0A0414] border-b border-[#301C5E] p-6 flex justify-between items-start">
          
          {/* 🌟 ฝั่งซ้าย: โซนข้อมูลงาน และคนทำงาน */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-white">{taskDetail.title}</h2>
              
              {/* ป้ายสถานะ */}
              <span className={`px-3 py-1 text-[10px] rounded-full uppercase tracking-wider font-bold border ${
                taskDetail.status === 'todo' ? 'bg-red-900 text-red-300 border-red-500/50' :
                taskDetail.status === 'doing' ? 'bg-yellow-900 text-yellow-300 border-yellow-500/50' :
                'bg-green-900 text-green-300 border-green-500/50'
              }`}>
                {taskDetail.status === 'todo' ? 'UNPROCESS' : taskDetail.status === 'doing' ? 'ON-PROCESS' : 'FINISH'}
              </span>

              {/* ปุ่มเริ่มทำ (โชว์ฝั่งนี้ให้คนรับผิดชอบ หรือ หัวหน้า กด) */}
              {taskDetail.status === 'todo' && (isOwnerOrViceHead || taskDetail.assignees?.some(a => a.userId === currentUserId)) && (
                <button 
                  onClick={() => handleStatusChange('doing')}
                  className="text-xs border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black px-3 py-1.5 rounded-lg font-bold transition-all ml-2"
                >
                  ▶️ เริ่มทำ (ON-PROCESS)
                </button>
              )}
              {taskDetail.status === 'doing' && (isOwnerOrViceHead || taskDetail.assignees?.some(a => a.userId === currentUserId)) && (
                <button 
                  onClick={() => handleStatusChange('todo')}
                  className="text-xs border border-gray-500/50 text-gray-400 hover:bg-gray-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all ml-2 shrink-0"
                >
                  ⏸️ ยกเลิกการทำ (UNPROCESS)
                </button>
              )}
              {taskDetail.status === 'doing' && isOwnerOrViceHead && (
              <button 
                onClick={() => handleStatusChange('done')}
                className="bg-green-600 hover:bg-green-500 text-white px-5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center gap-2 whitespace-nowrap"
              >
                ✅ อนุมัติจบงาน (FINISH)
              </button>
              )}
              {taskDetail.status === 'done' && isOwnerOrViceHead && (
                <button 
                  onClick={() => handleStatusChange('doing')}
                  className="border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  🔄 สั่งแก้
                </button>
              )}
            </div>
            {/* กล่องโชว์บรีฟงาน */}
            {(taskDetail.description || taskDetail.fileUrl) && (
              <div className="mt-4 bg-[#0A0414] border border-[#301C5E] p-4 rounded-xl max-w-3xl shadow-inner">
                {taskDetail.description && (
                  <div className="text-sm text-gray-300 whitespace-pre-wrap break-words mb-3 leading-relaxed">
                    <span className="text-xs font-bold text-gray-500 block mb-1">รายละเอียดงาน:</span>
                    {taskDetail.description}
                  </div>
                )}
                
                {taskDetail.fileUrl && (
                  <div className="pt-2 border-t border-[#301C5E]/50">
                    <a 
                      href={taskDetail.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-xs text-[#00FFD1] bg-[#00FFD1]/10 px-3 py-2 rounded-lg border border-[#00FFD1]/20 hover:bg-[#00FFD1]/20 hover:scale-105 transition-all"
                    >
                      📎 ไฟล์อ้างอิง: {taskDetail.fileName || 'ดาวน์โหลดไฟล์'}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 🌟 ฝั่งขวา: โซนอำนาจหัวหน้า (Approve / Delete) */}
          <div className="flex items-center gap-4 pl-4 border-l border-[#301C5E]/50 ml-4">

            {/* ปุ่มลบงาน (เฉพาะหัวหน้าเห็นอยู่แล้วตามที่เราทำไว้) */}
            {isOwnerOrViceHead && (
              <button 
                onClick={handleDelete}
                className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                title="ลบงานนี้"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            {/* ปุ่มปิด Modal */}
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition-colors ml-2">&times;</button>
          </div>
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
                              {msg.fileName || 'โหลดไฟล์แนบ'}
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
                    className="hidden" 
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
                    <div key={a.id} className="flex justify-between items-center gap-2 text-sm text-gray-300 bg-[#1C0D33] p-2 rounded-lg border border-[#301C5E] group transition-colors hover:border-[#7B5CFF]/50">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 shrink-0 rounded-full bg-[#7B5CFF] flex items-center justify-center text-xs text-white font-bold">
                          {a.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate" title={a.user.name}>{a.user.name}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveAssignee(a.user.id)}
                        className="text-red-500 hover:text-white hover:bg-red-500 w-6 h-6 shrink-0 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="เตะออกจากงาน"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      
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