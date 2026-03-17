import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import CreateTaskModal from '../components/sub-project/CreateTaskModal';
import InviteMemberModal from '../components/sub-project/InviteMemberModal';

export default function ProjectDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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

  // ระหว่างรอข้อมูลโหลด ให้ขึ้นข้อความนี้ไปก่อน
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
          <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {/* วนลูปโชว์รูปโปรไฟล์คนในทีม */}
                {members.map((member) => (
                  <div 
                    key={member.id} 
                    className="w-10 h-10 rounded-full border-2 border-[#1C0D33] bg-[#7B5CFF] flex items-center justify-center text-sm font-bold text-white shadow-md cursor-pointer hover:-translate-y-1 transition-transform" 
                    title={member.user.email} // เอาเมาส์ชี้แล้วขึ้น Email
                  >
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              
              {/* ปุ่ม + เชิญเพื่อน */}
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="w-10 h-10 rounded-full border-2 border-dashed border-[#7B5CFF] text-[#7B5CFF] hover:bg-[#7B5CFF] hover:text-white flex items-center justify-center text-xl transition-colors ml-1"
                title="เชิญสมาชิกเพิ่ม"
              >
                +
              </button>
            </div>
          

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-wide">งานย่อย (Tasks)</h2>
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="bg-[#7B5CFF] hover:bg-[#6A4BE5] text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all"
            >
              + สร้างงานย่อย
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="bg-[#0A0714] border border-[#1C1438] hover:border-[#301C5E] transition-colors rounded-xl p-5 flex justify-between items-center shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#FFB800]"></div> {/* จุดสีส้มบอกสถานะ todo */}
                    <h3 className="text-lg font-medium text-gray-200">{task.title}</h3>
                  </div>
                  <span className="bg-[#2A1B66] text-[#A68CFF] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {task.status}
                  </span>
                </div>
              ))
          ) : (
          <div className="bg-[#0A0714] border border-[#1C1438] rounded-2xl p-8 text-center text-gray-500">
                ยังไม่มีงานย่อยในโปรเจคนี้ กดปุ่มสร้างเพื่อเริ่มต้นได้เลย!
              </div>
            )}
          </div>
          <CreateTaskModal 
            isOpen={isTaskModalOpen} 
            onClose={() => setIsTaskModalOpen(false)} 
            onSuccess={fetchTasks} // ถ้าสร้างเสร็จ ให้เรียกฟังก์ชันดึงข้อมูลใหม่
            projectId={id} // ส่ง ID โปรเจคเข้าไปด้วย
          />
          <InviteMemberModal 
            isOpen={isInviteModalOpen} 
            onClose={() => setIsInviteModalOpen(false)} 
            onSuccess={fetchMembers} // ถ้าเชิญเสร็จ ให้โหลดรูปลูกทีมมาใหม่
            projectId={id}
          />
      </div>
    </div>
  </div>
  );
}