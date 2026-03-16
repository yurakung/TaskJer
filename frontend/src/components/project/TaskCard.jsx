import React from 'react';

export default function TaskCard({ task, currentUserId }) {
  // เช็คว่า User ที่ล็อกอินอยู่ ได้รับผิดชอบงานนี้ไหม (ถ้าไม่ จะทำให้กล่องใส)
  const isAssigned = task.assignees.includes(currentUserId);

  // ฟังก์ชันกำหนดสีตามสถานะ
  const getStatusStyle = (status) => {
    switch (status) {
      case 'finish': 
        return { dot: 'bg-[#00FF00]', badge: 'bg-[#00FF00]/20 text-[#00FF00]', text: 'FINISH' };
      case 'on-process': 
        return { dot: 'bg-[#FFB800]', badge: 'bg-[#FFB800]/20 text-[#FFB800]', text: 'ON-PROCESS' };
      case 'unprocess': 
        return { dot: 'bg-[#FF0000]', badge: 'bg-[#FF0000]/20 text-[#FF0000]', text: 'UNPROCESS' };
      default: 
        return { dot: 'bg-gray-500', badge: 'bg-gray-500/20 text-gray-500', text: 'UNKNOWN' };
    }
  };

  const style = getStatusStyle(task.status);

  return (
    <div 
      className={`w-[260px] h-40 bg-[#0C0822] rounded-xl p-5 flex flex-col justify-between border border-[#1C1438] transition-all
        /* เงื่อนไขกล่องใส: ถ้าไม่ได้ถูก Assign ให้ลด Opacity ลงเหลือ 30% และกดไม่ได้ */
        ${!isAssigned ? 'opacity-30 pointer-events-none' : 'hover:border-[#6B4BFF] cursor-pointer shadow-lg hover:-translate-y-1'}
      `}
    >
      {/* จุดสี และ ป้ายสถานะ มุมขวาบน */}
      <div className="flex justify-between items-start">
        <div className={`w-3.5 h-3.5 rounded-full ${style.dot} shadow-[0_0_8px_currentColor]`} style={{ color: style.dot.replace('bg-', '') }}></div>
        <div className={`text-[9px] px-3 py-1 rounded-full font-bold tracking-widest ${style.badge}`}>
          {style.text}
        </div>
      </div>

      {/* ชื่อ Sub-project */}
      <div className="mt-2">
        <h3 className="text-white text-[17px] font-medium tracking-wide">{task.name}</h3>
      </div>

      {/* ผู้รับผิดชอบ (มุมขวาล่าง) */}
      <div className="text-right text-[11px] text-[#5A5A5A] mt-auto font-medium tracking-wider">
        Assigned to:{task.assigneeNames.join(', ')}
      </div>
    </div>
  );
}