import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ProjectCard from '../components/project/ProjectCard';
import CreateProjectModal from '../components/sub-project/CreateProjectModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  //ฟังก์ชันสำหรับไปดึงข้อมูลโปรเจคจากหลังบ้าน
  const fetchProjects = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    
    const user = JSON.parse(storedUser);

    try {
      const response = await fetch(`http://localhost:5000/api/projects/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("ข้อมูลโปรเจคที่ดึงได้:", data);
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);
//ดึงข้อมู,มาแสดงหน้าเว็บเลย
  const handleProjectCreated = () => {
    fetchProjects(); 
  };
  return (
    <div className="flex min-h-screen bg-[#060411] text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Topbar />
        <div className="p-10 flex-1 overflow-y-auto">
          <div className="flex justify-end mb-8">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#D9D9D9] hover:bg-white text-black px-4 py-1.5 rounded-full font-bold flex items-center gap-1 transition-transform hover:scale-105"
              >
                สร้าง Project ใหม่ +
              </button>
            </div>
            <div className="flex flex-wrap gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                // ส่งข้อมูลโปรเจคแต่ละอัน เข้าไปใน Component ProjectCard
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              // ถ้ายังไม่มีโปรเจคเลย ให้โชว์ข้อความนี้
              <div className="w-full text-center text-gray-500 mt-10">
                ยังไม่มีโปรเจคเลยครับ กดปุ่ม "สร้าง Project ใหม่ +" เพื่อเริ่มต้นได้เลย!
              </div>
            )}
          </div>
            <CreateProjectModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => fetchProjectData()}
          />
        </div>
      </div>
    </div>
  );
}