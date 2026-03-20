import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CreateTaskModal from '../components/sub-project/CreateTaskModal';
import InviteMemberModal from '../components/sub-project/InviteMemberModal';
import ManageTeamModal from '../components/sub-project/ManageTeamModal';
import TaskWorkspaceModal from '../components/sub-project/TaskWorkspaceModal';
import ProjectSettingsModal from '../components/project/ProjectSettingsModal';
import TaskCard from '../components/project/TaskCard';

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
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = project?.userId === currentUser.id;
  const currentUserMember = members.find(m => m.userId === currentUser.id);
  const isViceHead = currentUserMember?.role === 'vice-head';
  const isOwnerOrViceHead = isOwner || isViceHead;
  const currentUserRole = isOwner ? 'owner' : (currentUserMember?.role || 'member');

  const allMembersWithOwner = [...members];
  if (project && !allMembersWithOwner.some(m => m.userId === project.userId)) {
    allMembersWithOwner.unshift({
      userId: project.userId,
      role: 'Owner',
      user: { 
        name: isOwner ? `${currentUser.name} (ฉัน)` : 'Project Owner',
        avatarUrl: isOwner ? currentUser.avatarUrl : null 
      }
    });
  }

  const filteredAndSortedTasks = [...tasks]
    .filter(task => {
      // 1. กรองสถานะ
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }
      // 2. กรองคนรับผิดชอบ
      if (assigneeFilter !== 'all') {
        const isAssigned = task.assignees?.some(a => a.userId.toString() === assigneeFilter);
        if (!isAssigned) return false;
      }
      return true; // ถ้าผ่านเงื่อนไขให้แสดงผล
    })
    .sort((a, b) => {
      // ลอจิกการเรียงลำดับ (เหมือนเดิมของคุณ)
      const isAAssigned = a.assignees?.some(assignee => assignee.userId === currentUser.id);
      const isBAssigned = b.assignees?.some(assignee => assignee.userId === currentUser.id);

      if (isAAssigned && !isBAssigned) return -1;
      if (!isAAssigned && isBAssigned) return 1;

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
                    className="w-10 h-10 rounded-full border-2 border-[#1C0D33] bg-[#7B5CFF] flex items-center justify-center text-sm font-bold text-white shadow-md cursor-pointer hover:-translate-y-1 transition-transform overflow-hidden" 
                    title={member.user.email} 
                  >
                    {member.user.avatarUrl ?(
                      <img src={member.user.avatarUrl} alt={member.user.name} className='w-full h-full object-cover'/>
                    ) :(
                      member.user.name.charAt(0).toUpperCase()
                    )}
                    
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
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-[#1C0D33] text-gray-200 border border-[#301C5E] hover:border-[#7B5CFF] px-4 py-2 pr-10 rounded-xl focus:outline-none transition-colors cursor-pointer text-sm font-medium"
                >
                  <option value="all">ALLSTATE</option>
                  <option value="todo">UNPROCESS</option>
                  <option value="doing">ON-PROCESS</option>
                  <option value="done">FINISH</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* 🌟 Dropdown 2: ตัวกรองคนรับผิดชอบ */}
              <div className="relative">
                <select 
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="appearance-none bg-[#1C0D33] text-gray-200 border border-[#301C5E] hover:border-[#7B5CFF] px-4 py-2 pr-10 rounded-xl focus:outline-none transition-colors cursor-pointer text-sm font-medium"
                >
                  <option value="all">👥 ทุกคน</option>
                  <option value={currentUser.id.toString()}>👤 งานของฉัน</option>
                  {/* ดึงรายชื่อคนในโปรเจคมาแสดง */}
                  {allMembersWithOwner
                    .filter(m => m.userId !== currentUser.id) // ซ่อนชื่อเราออกไป เพราะมีปุ่ม "งานของฉัน" แล้ว
                    .map(m => (
                      <option key={m.userId} value={m.userId.toString()}>
                        {m.user.name}
                      </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
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
            {filteredAndSortedTasks.length > 0 ? (
              filteredAndSortedTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  currentUserId={currentUser.id} 
                  isOwnerOrViceHead={isOwnerOrViceHead}
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setIsWorkspaceOpen(true);
                  }}
                />
              ))
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
            projectMembers={allMembersWithOwner}
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