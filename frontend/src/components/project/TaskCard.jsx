import React from 'react';

export default function TaskCard({ task, currentUserId, onClick, isOwnerOrViceHead }) {
  // 🌟 แก้ 1: เปลี่ยนมาใช้ currentUserId แทน currentUser.id
  const isAssigned = task.assignees?.some(a => a.userId === currentUserId || a.id === currentUserId);
  const canAccess = isOwnerOrViceHead || isAssigned;

  // ตั้งค่าสีตามสถานะ
  let dotColor = 'bg-gray-600';
  let statusBg = 'bg-[#1C0D33]';
  let statusTextClass = 'text-gray-500';
  let statusLabel = task.status;

  if (task.status === 'done' || task.status === 'finish') {
    dotColor = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
    statusBg = 'bg-green-900 border border-green-500/50';
    statusTextClass = 'text-green-300';
    statusLabel = 'FINISH';
  } else if (task.status === 'doing' || task.status === 'on-process') {
    dotColor = 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]';
    statusBg = 'bg-yellow-900 border border-yellow-500/50';
    statusTextClass = 'text-yellow-300';
    statusLabel = 'ON-PROCESS';
  } else if (task.status === 'todo' || task.status === 'unprocess') {
    dotColor = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    statusBg = 'bg-red-900 border border-red-500/50';
    statusTextClass = 'text-red-300';
    statusLabel = 'UNPROCESS';
  }

  // ถ้าไม่มีสิทธิ์เข้าถึง ดรอปสีป้ายให้เป็นสีเทา
  if (!canAccess) {
    dotColor = 'bg-gray-600';
    statusBg = 'bg-[#1C0D33] border border-[#301C5E]';
    statusTextClass = 'text-gray-500';
  }

  return (
    <div 
      // 🌟 แก้ 2: ใช้ onClick จาก Props ไม่ต้องเขียนฟังก์ชันยาวๆ ในนี้
      onClick={canAccess ? onClick : undefined} 
      // 🌟 แก้ 3: ลบ key={task.id} ออกไป เพราะไม่ต้องใช้ใน Component 
      className={`bg-[#0A0714] border border-[#1C1438] transition-all rounded-2xl p-6 flex flex-col min-h-[160px] shadow-lg
        ${canAccess ? 'hover:border-[#7B5CFF]/50 cursor-pointer hover:-translate-y-1' : 'opacity-40 cursor-not-allowed grayscale'}
      `}
    >
      {/* Header ของการ์ด: จุดสี (ซ้าย) + ป้ายสถานะ (ขวา) */}
      <div className="flex justify-between items-center mb-4">
        <div className={`w-5 h-5 rounded-full ${dotColor}`}></div>
        <span className={`${statusBg} ${statusTextClass} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
          {statusLabel}
        </span>
      </div>
      
      {/* ชื่อ Task ตรงกลาง */}
      <div className="flex-1 mt-2">
        <h3 className="text-xl font-bold text-gray-200 line-clamp-2 break-words">{task.title || task.name}</h3>
        {isAssigned && (
          <span className="inline-block mt-3 text-[10px] bg-[#7B5CFF]/20 text-[#D1C4FF] px-2 py-1 rounded border border-[#7B5CFF]/30">
            ได้รับมอบหมาย
          </span>
        )}
      </div>
      
      {/* 🌟 แก้ 4: Footer ของการ์ด ให้เป็นรูปแบบวงกลมซ้อนกัน */}
      <div className="mt-6 pt-4 border-t border-[#1C1438]/50 flex justify-end items-center gap-2">
        <span className="text-xs text-gray-400">Assigned to:</span>
        
        <div className="flex items-center -space-x-2"> 
          {task.assignees && task.assignees.length > 0 ? (
            task.assignees.map((assignee, index) => {
              const userObj = assignee.user || assignee; 
              return (
                <div 
                  key={assignee.id || index} 
                  className="w-7 h-7 rounded-full bg-[#301C5E] border-2 border-[#0A0714] flex items-center justify-center text-[10px] text-white font-bold overflow-hidden shadow-sm z-10 hover:z-20 transition-all"
                  title={userObj.name} // เอาเมาส์ชี้แล้วโชว์ชื่อ
                >
                  {userObj.avatarUrl ? (
                    <img 
                      src={userObj.avatarUrl} 
                      alt={userObj.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    userObj.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
              );
            })
          ) : (
            <span className="text-[11px] text-[#5A5A5A]">None</span>
          )}
        </div>
      </div>
    </div>
  );
}