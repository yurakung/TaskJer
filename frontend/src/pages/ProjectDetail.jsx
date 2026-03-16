import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import TaskCard from '../components/project/TaskCard';
import MemberSection from '../components/project/MemberSection';

export default function ProjectDetail() {
  const currentUser = { id: 1, name: 'USER 1', role: 'head' };

  const members = [
    { id: 1, name: 'USER 1', role: 'head', isMe: true },
    { id: 2, name: 'USER 2', role: 'vice head', isMe: false },
    { id: 3, name: 'USER 3', role: 'user', isMe: false },
  ];

  const [tasks, setTasks] = useState([
    { id: 1, name: 'ออกแบบ UX/UI', status: 'finish', assignees: [1], assigneeNames: ['User 1'] },
    { id: 2, name: 'ออกแบบ UX/UI', status: 'on-process', assignees: [1], assigneeNames: ['User 1'] },
    { id: 3, name: 'ออกแบบ UX/UI', status: 'unprocess', assignees: [1], assigneeNames: ['User 1'] },
    { id: 4, name: 'ออกแบบ UX/UI', status: 'finish', assignees: [2], assigneeNames: ['User 2'] },
  ]);

  return (
    <div className="flex min-h-screen bg-[#060411] text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative h-screen">
        <Topbar />
        <div className="p-10 flex-1 overflow-y-auto">
          
          {/* 2. เรียกใช้ Component พร้อมส่งข้อมูลให้มัน (Props) */}
          <MemberSection members={members} currentUser={currentUser} />

          {/* ---------------- Section: โปรเจคย่อย (Sub-Projects) ---------------- */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[15px] font-medium tracking-wide text-gray-200">
                โปรเจคย่อย (Sub-Projects)
              </h2>
              
              {(currentUser.role === 'head' || currentUser.role === 'vice head') && (
                <button className="bg-[#1C00D6] hover:bg-[#2A00FF] transition-colors text-white px-5 py-2 rounded-full text-sm font-medium tracking-wider shadow-lg flex items-center gap-1">
                  <span className="text-lg leading-none mb-0.5">+</span> New Task
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-5">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  currentUserId={currentUser.id} 
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}