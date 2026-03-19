import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CreateTaskModal from '../components/sub-project/CreateTaskModal';
import InviteMemberModal from '../components/sub-project/InviteMemberModal';
import ManageTeamModal from '../components/sub-project/ManageTeamModal';
import TaskWorkspaceModal from '../components/sub-project/TaskWorkspaceModal';
import ProjectSettingsModal from '../components/project/ProjectSettingsModal';

export default function ProjectDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = project?.userId === currentUser.id;
  const currentUserMember = members.find(m => m.userId === currentUser.id);
  const isViceHead = currentUserMember?.role === 'vice-head';
  const isOwnerOrViceHead = isOwner || isViceHead;
  const currentUserRole = isOwner ? 'owner' : (currentUserMember?.role || 'member');

  const sortedTasks = [...tasks].sort((a, b) => {
    // 1. เช็คว่างานนี้เป็นของเราไหม
    const isAAssigned = a.assignees?.some(assignee => assignee.userId === currentUser.id);
    const isBAssigned = b.assignees?.some(assignee => assignee.userId === currentUser.id);

    // ดันงานของเราขึ้นบนสุด
    if (isAAssigned && !isBAssigned) return -1;
    if (!isAAssigned && isBAssigned) return 1;

    // 2. เรียงตามสถานะ: doing (1) -> todo (2) -> done (3)
    const statusPriority = { doing: 1, todo: 2, done: 3 };
    const priorityA = statusPriority[a.status] || 99;
    const priorityB = statusPriority[b.status] || 99;

    return priorityA - priorityB;
  });
  
  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/project/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    if (!id || id === 'undefined') {
      console.error('ไม่พบ ID ของโปรเจค');
      return; 
    }

    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProjectDetails();
    fetchTasks();
    fetchMembers();
  }, [id]);

  if (!project) {
    return (
      <div className="flex min-h-screen bg-[#060411] text-white items-center justify-center">
        กำลังโหลดข้อมูลโปรเจค...
      </div>
    );
  }

  // 🌟 ส่วนประกอบการ์ดงาน (TaskCard) สำหรับใช้ในแต่ละคอลัมน์
  const TaskCard = ({ task }) => {
    // ลอจิกการเข้าถึงของคุณ
    const isAssigned = task.assignees?.some(a => a.userId === currentUser.id);
    const canAccess = isOwnerOrViceHead || isAssigned;

    return (
      <div 
        onClick={() => {
          if (canAccess) {
            setSelectedTaskId(task.id);
            setIsWorkspaceOpen(true);
          }
        }}
        className={`bg-[#1C0D33] p-6 rounded-xl border border-[#301C5E] transition-all flex flex-col min-h-[160px] 
          ${canAccess ? 'group cursor-pointer hover:border-[#7B5CFF]/50 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.4)]' : 'opacity-40 cursor-not-allowed grayscale'}
        `}
      >
        <div className="flex justify-between items-start mb-4">
          <p className="text-lg font-bold text-white group-hover:text-[#A68CFF] break-words line-clamp-3 leading-snug">
            {task.title}
          </p>
          {/* ป้ายได้รับมอบหมาย */}
          {isAssigned && (
            <span className="text-[10px] bg-[#7B5CFF]/20 text-[#D1C4FF] px-2 py-1 rounded border border-[#7B5CFF]/30 shrink-0 ml-2">
              ได้รับมอบหมาย
            </span>
          )}
        </div>
        
        {/* ชื่อคนรับผิดชอบ */}
        <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-[#301C5E]/50">
          <span>Assigned to: {task.assignees?.[0]?.user?.name || 'None'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#060411] text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Topbar />
        
        <div className="p-10 flex-1 overflow-y-auto">
          {/* ปุ่มย้อนกลับ */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
          >
            ← กลับไปหน้า Dashboard
          </button>

          {/* หัวข้อโปรเจค */}
          <div className="bg-gradient-to-r from-[#1C0D33] to-[#0A0414] border border-[#301C5E] p-8 rounded-2xl shadow-lg mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7B5CFF] to-[#D1C4FF] mb-2">
              {project.name}
            </h1>
            <p className="text-gray-400 text-lg">
              {project.description || 'ไม่มีคำอธิบายโปรเจค'}
            </p>
          </div>

          <div className="flex items-center gap-3 mb-10">
              <div className="flex -space-x-3">
                {members.map((member) => (
                  <div 
                    key={member.id} 
                    className="w-10 h-10 rounded-full border-2 border-[#1C0D33] bg-[#7B5CFF] flex items-center justify-center text-sm font-bold text-white shadow-md cursor-pointer hover:-translate-y-1 transition-transform" 
                    title={member.user.email} 
                  >
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="w-10 h-10 rounded-full border-2 border-dashed border-[#7B5CFF] text-[#7B5CFF] hover:bg-[#7B5CFF] hover:text-white flex items-center justify-center text-xl transition-colors ml-1"
                title="เชิญสมาชิกเพิ่ม"
              >
                +
              </button>
              <button 
                onClick={() => setIsManageTeamModalOpen(true)}
                className="ml-3 px-4 py-2 bg-[#1C0D33] border border-[#301C5E] hover:border-[#7B5CFF] text-[#A68CFF] hover:text-white rounded-xl text-sm font-bold transition-colors shadow-md"
              >
                ⚙️ จัดการทีม
              </button>
              {isOwnerOrViceHead && (
                <button 
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="ml-2 px-4 py-2 bg-[#1C0D33] border border-[#301C5E] hover:border-gray-400 text-gray-300 hover:text-white rounded-xl text-sm font-bold transition-colors shadow-md"
                >
                  ⚙️ ตั้งค่าโปรเจค
                </button>
              )}
            </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-wide">Sub-Project</h2>
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="bg-[#7B5CFF] hover:bg-[#6A4BE5] text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all"
            >
              + สร้างงานย่อย
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => {
                const isAssigned = task.assignees?.some(a => a.userId === currentUser.id);
                const canAccess = isOwnerOrViceHead || isAssigned;

                // ตั้งค่าสีตามสถานะ
                let dotColor = 'bg-gray-600';
                let statusBg = 'bg-[#1C0D33]';
                let statusTextClass = 'text-gray-500';
                let statusLabel = task.status;

                if (task.status === 'done') {
                  dotColor = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
                  statusBg = 'bg-green-900 border border-green-500/50';
                  statusTextClass = 'text-green-300';
                  statusLabel = 'FINISH';
                } else if (task.status === 'doing') {
                  dotColor = 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]';
                  statusBg = 'bg-yellow-900 border border-yellow-500/50';
                  statusTextClass = 'text-yellow-300';
                  statusLabel = 'ON-PROCESS';
                } else if (task.status === 'todo') {
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
                    key={task.id} 
                    onClick={() => {
                      if (canAccess) {
                        setSelectedTaskId(task.id);
                        setIsWorkspaceOpen(true);
                      }
                    }}
                    className={`bg-[#0A0714] border border-[#1C1438] transition-all rounded-2xl p-6 flex flex-col min-h-[160px] shadow-lg
                      ${canAccess ? 'hover:border-[#301C5E] cursor-pointer hover:-translate-y-1' : 'opacity-40 cursor-not-allowed grayscale'}
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
                      <h3 className="text-xl font-bold text-gray-200 line-clamp-2 break-words">{task.title}</h3>
                      {isAssigned && (
                        <span className="inline-block mt-3 text-[10px] bg-[#7B5CFF]/20 text-[#D1C4FF] px-2 py-1 rounded border border-[#7B5CFF]/30">
                          ได้รับมอบหมาย
                        </span>
                      )}
                    </div>
                    
                    {/* Footer ของการ์ด: ผู้รับผิดชอบ (ขวาล่าง) */}
                    <div className="mt-6 pt-4 border-t border-[#1C1438]/50 text-right">
                       <span className="text-xs text-gray-400">
                         Assigned to: {task.assignees?.[0]?.user?.name || 'None'}
                       </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-[#0A0714] border border-[#1C1438] rounded-2xl p-8 text-center text-gray-500">
                ยังไม่มีงานย่อยในโปรเจคนี้ กดปุ่มสร้างเพื่อเริ่มต้นได้เลย!
              </div>
            )}
          </div>

          <CreateTaskModal 
            isOpen={isTaskModalOpen} 
            onClose={() => setIsTaskModalOpen(false)} 
            onSuccess={fetchTasks} 
            projectId={id} 
          />
          <InviteMemberModal 
            isOpen={isInviteModalOpen} 
            onClose={() => setIsInviteModalOpen(false)} 
            onSuccess={fetchMembers} 
            projectId={id}
          />
          <ManageTeamModal 
            isOpen={isManageTeamModalOpen} 
            onClose={() => setIsManageTeamModalOpen(false)} 
            members={members}
            project={project}
            onSuccess={fetchMembers} 
          />
          <TaskWorkspaceModal
            isOpen={isWorkspaceOpen}
            onClose={() => setIsWorkspaceOpen(false)}
            taskId={selectedTaskId}
            projectMembers={members}
            currentUserRole={currentUserRole}
            currentUserId={currentUser.id}
            onSuccess={fetchTasks}
          />
          <ProjectSettingsModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            project={project}
            onSuccess={() => {
              // สมมติว่าใน useEffect คุณดึงข้อมูลด้วย fetchProjectDetails เราจะเรียกมันอีกรอบเพื่ออัปเดตชื่อ
              window.location.reload(); // หรือง่ายสุดคือสั่งให้หน้าเว็บโหลดใหม่เพื่อดึงชื่อล่าสุดมาโชว์
            }}
          />
        </div>
      </div>
    </div>
  );
}