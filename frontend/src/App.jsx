import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ProgramsPage from './pages/ProgramsPage';
import ProgramDetailPage from './pages/ProgramDetailPage';
import MaterialsPage from './pages/MaterialsPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import MaterialViewerPage from './pages/MaterialViewerPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import BlogEditor from './pages/admin/BlogEditor';
import ProgramEditor from './pages/admin/ProgramEditor';
import LegalPage from './pages/LegalPage';

function App() {
  return (
    <div className="min-h-screen bg-white font-fredoka">
      {/* Hide Navbar on Admin pages */}
      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/program/:slug" element={<ProgramDetailPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/material/:slug" element={<MaterialViewerPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/blog-editor" element={<BlogEditor />} />
        <Route path="/admin/program-editor" element={<ProgramEditor />} />
        <Route path="/page/:slug" element={<LegalPage />} />
      </Routes>
    </div>
  );
}

export default App;
