import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ProjectCard from '../components/project/ProjectCard';
import CreateProjectModal from '../components/sub-project/CreateProjectModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleProjectCreated = () => {
    window.location.reload(); 
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
                <ProjectCard />
            </div>
            <CreateProjectModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={handleProjectCreated} 
          />
        </div>
      </div>
    </div>
  );
}