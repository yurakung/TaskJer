import React from 'react';

export default function ManageTeamModal({ isOpen, onClose, members, project, onSuccess }) {
  if (!isOpen || !project) return null;

  // 1. ดึงข้อมูลว่าใครกำลังใช้งานหน้าเว็บอยู่ตอนนี้
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // 2. เช็คสิทธิ์ของคนที่กำลังใช้งาน
  const isOwner = currentUser.id === project.userId;
  const currentUserMember = members.find(m => m.userId === currentUser.id);
  const isViceHead = currentUserMember?.role === 'vice-head';

  // ฟังก์ชันเปลี่ยนตำแหน่ง
  const handleRoleChange = async (targetUserId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${project.id}/members/${targetUserId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, requesterId: currentUser.id }),
      });
      const data = await response.json();
      if (data.success) {
        onSuccess(); // รีเฟรชข้อมูล
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ฟังก์ชันเตะออก
  const handleKick = async (targetUserId, targetName) => {
    if (!window.confirm(`แน่ใจหรือไม่ที่จะเตะคุณ ${targetName} ออกจากโปรเจค?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${project.id}/members/${targetUserId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId: currentUser.id }),
      });
      const data = await response.json();
      if (data.success) {
        onSuccess(); // รีเฟรชข้อมูล
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#1C0D33] to-[#0A0414] p-8 rounded-2xl border border-[#301C5E] shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#A68CFF] tracking-wide">จัดการสมาชิกทีม</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
          
          {/* ส่วนแสดงข้อมูล Owner (คนสร้างโปรเจค) จะโชว์อยู่บนสุดเสมอ */}
          <div className="bg-[#120B24] border border-[#301C5E] rounded-xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] flex items-center justify-center text-black font-bold text-lg">
                👑
              </div>
              <div>
                <p className="text-white font-bold">{project.user?.name || 'Owner'}</p>
                <p className="text-xs text-gray-400">เจ้าของโปรเจค (Owner)</p>
              </div>
            </div>
            <span className="text-[#FFD700] text-sm font-bold bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#FFD700]/30">
              สิทธิ์สูงสุด
            </span>
          </div>

          {/* วนลูปโชว์รายชื่อสมาชิกที่ถูกเชิญเข้ามา */}
          {members.length === 0 ? (
            <p className="text-center text-gray-500 my-4">ยังไม่มีสมาชิกคนอื่นในโปรเจคนี้</p>
          ) : (
            members.map((member) => {
              const isTargetViceHead = member.role === 'vice-head';
              // เช็คสิทธิ์ว่าคนใช้งานตอนนี้ มีสิทธิ์เตะเป้าหมายคนนี้ไหม?
              const canKick = isOwner || (isViceHead && !isTargetViceHead);

              return (
                <div key={member.id} className="bg-[#0A0714] border border-[#1C1438] rounded-xl p-4 flex justify-between items-center hover:border-[#301C5E] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#7B5CFF] flex items-center justify-center text-white font-bold">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold">{member.user.name}</p>
                      <p className="text-xs text-gray-400">{member.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* ปุ่มเลือกตำแหน่ง (โชว์เฉพาะถ้าเราเป็น Owner) */}
                    {isOwner ? (
                      <select 
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                        className="bg-[#1C0D33] text-[#A68CFF] border border-[#301C5E] rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#7B5CFF]"
                      >
                        <option value="member">Member</option>
                        <option value="vice-head">Vice-Head</option>
                      </select>
                    ) : (
                      <span className={`text-sm px-3 py-1 rounded-full ${isTargetViceHead ? 'text-[#00FFD1] bg-[#00FFD1]/10 border border-[#00FFD1]/30' : 'text-gray-400 bg-gray-800'}`}>
                        {member.role === 'vice-head' ? '🛡️ Vice-Head' : 'Member'}
                      </span>
                    )}

                    {/* ปุ่มเตะออก (โชว์เฉพาะถ้ามีสิทธิ์) */}
                    {canKick && (
                      <button 
                        onClick={() => handleKick(member.userId, member.user.name)}
                        className="text-red-500 hover:text-white hover:bg-red-600 border border-red-900/50 hover:border-red-500 px-3 py-1 rounded-lg transition-colors text-sm font-medium"
                      >
                        เตะออก
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}