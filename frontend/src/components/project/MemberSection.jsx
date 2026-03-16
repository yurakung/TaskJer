import React from 'react';

export default function MemberSection({ members, currentUser }) {
  return (
    <div className="bg-[#0D081E] border border-[#1C1438] rounded-2xl p-6 mb-10 shadow-lg relative overflow-hidden">
      
      {/* ส่วนหัว: หัวข้อ Member และปุ่ม INVITE */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h2 className="text-xl font-medium tracking-wide text-white">Member</h2>
        </div>
        
        {/* เช็คสิทธิ์: ถ้าเป็น head หรือ vice head ถึงจะเห็นปุ่ม INVITE */}
        {(currentUser.role === 'head' || currentUser.role === 'vice head') && (
          <button className="flex items-center gap-2 text-white hover:text-[#A68CFF] transition-colors font-medium tracking-wide">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            INVITE
          </button>
        )}
      </div>

      {/* กล่องรายชื่อสมาชิก */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {members.map(member => (
          <div key={member.id} className="min-w-[160px] bg-[#221B4A] rounded-xl p-4 flex flex-col border border-[#302660]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#D9D9D9] rounded-full flex items-center justify-center text-black">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium tracking-wide text-white">{member.name}</span>
            </div>
            <div className="text-[#A68CFF] text-sm tracking-widest lowercase">
              {member.role}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}