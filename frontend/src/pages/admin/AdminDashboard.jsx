import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
   LayoutDashboard, Users, BookOpen, MessageSquare,
   Plus, Settings, LogOut, Search, Filter,
   MoreVertical, CheckCircle, Clock, XCircle, AlertCircle,
   Eye, Edit, Trash2, Shield, UserPlus, Power, Loader2, ChevronRight, Phone, Mail, FileText, Sparkles, FolderOpen, Upload, Download, File, Image as ImageIcon
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const AdminDashboard = () => {
   const [activeTab, setActiveTab] = useState('overview');
   const [stats, setStats] = useState({ total_leads: 0, new_leads: 0, converted: 0, conversion_rate: '0%' });
   const [leads, setLeads] = useState([]);
   const [blogs, setBlogs] = useState([]);
   const [users, setUsers] = useState([]);
   const [programs, setPrograms] = useState([]);
   const [materials, setMaterials] = useState([]);
   const [pages, setPages] = useState([]);
   const [onboardingDocs, setOnboardingDocs] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedLead, setSelectedLead] = useState(null);
   const [selectedPage, setSelectedPage] = useState(null);
   const [showUserModal, setShowUserModal] = useState(false);
   const [showMaterialModal, setShowMaterialModal] = useState(false);
   const [showPageModal, setShowPageModal] = useState(false);
   const [showAddPageModal, setShowAddPageModal] = useState(false);
   const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'sales' });
   const [newMaterialData, setNewMaterialData] = useState({ title: '', description: '', type: 'pdf', file_url: '', thumbnail_url: '' });
   const [newPageData, setNewPageData] = useState({ title: '', content: '' });
   const [onboardingData, setOnboardingData] = useState({
      type: 'offer_letter',
      teacher_name: '',
      teacher_address: '',
      teacher_email: '',
      teacher_phone: '',
      subject: '',
      batch_name: '',
      batch_code: '',
      classes_per_month: '12',
      duration: '1 Hour 15 Mins',
      schedule: '',
      timing: '',
      compensation: '',
      payment_day: '22nd',
      admin_name: 'Aditi Patodee',
      admin_designation: 'Director',
      notice_period: '30',
      non_compete_months: '12'
   });
   const [uploading, setUploading] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
         navigate('/admin/login');
         return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
         const statsRes = await axios.get('/api/api.php?action=get_stats', config);
         if (statsRes.data.success) setStats(statsRes.data.data);

         const leadsRes = await axios.get('/api/api.php?action=get_leads', config);
         if (leadsRes.data.success) setLeads(leadsRes.data.data);

         const progsRes = await axios.get('/api/api.php?action=get_programs', config);
         if (progsRes.data.success) setPrograms(progsRes.data.data);

         const materialsRes = await axios.get('/api/api.php?action=get_materials', config);
         if (materialsRes.data.success) setMaterials(materialsRes.data.data);

         const pagesRes = await axios.get('/api/api.php?action=get_pages', config);
         if (pagesRes.data.success) setPages(pagesRes.data.data);

         const onboardingRes = await axios.get('/api/api.php?action=get_onboarding_docs', config);
         if (onboardingRes.data.success) setOnboardingDocs(onboardingRes.data.data);

         const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
         if (user.role === 'admin') {
            const usersRes = await axios.get('/api/api.php?action=get_users', config);
            if (usersRes.data.success) setUsers(usersRes.data.data);
         }

         if (['admin', 'writer'].includes(user.role)) {
            const blogsRes = await axios.get('/api/api.php?action=get_all_blogs', config);
            if (blogsRes.data.success) setBlogs(blogsRes.data.data);
         }
      } catch (err) {
         if (err.response?.status === 401) navigate('/admin/login');
         else alert("System Error: " + (err.response?.data?.error || err.message));
      } finally {
         setLoading(false);
      }
   };

   const updateLeadStatus = async (id, status) => {
      try {
         const token = localStorage.getItem('adminToken');
         await axios.post('/api/api.php?action=update_lead_status', { id, status }, {
            headers: { Authorization: `Bearer ${token}` }
         });
         fetchData();
      } catch (err) { alert("Failed to update status"); }
   };

   const addUser = async (e) => {
      e.preventDefault();
      try {
         const token = localStorage.getItem('adminToken');
         const res = await axios.post('/api/api.php?action=add_user', newUserData, {
            headers: { Authorization: `Bearer ${token}` }
         });
         if (res.data.success) {
            setShowUserModal(false);
            setNewUserData({ name: '', email: '', password: '', role: 'sales' });
            fetchData();
         }
      } catch (err) { alert("Failed to add member"); }
   };

   const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      try {
         const url = await uploadToCloudinary(file);
         setNewMaterialData({ ...newMaterialData, file_url: url });
      } catch (err) { alert("Upload failed"); }
      finally { setUploading(false); }
   };

   const addMaterial = async (e) => {
      e.preventDefault();
      try {
         const token = localStorage.getItem('adminToken');
         const res = await axios.post('/api/api.php?action=add_material', newMaterialData, {
            headers: { Authorization: `Bearer ${token}` }
         });
         if (res.data.success) {
            setShowMaterialModal(false);
            setNewMaterialData({ title: '', description: '', type: 'pdf', file_url: '', thumbnail_url: '' });
            fetchData();
         } else {
            alert("Failed to save: " + (res.data.error || "Unknown Error"));
         }
      } catch (err) {
         console.error("Add Material Error:", err);
         alert("Failed to add material: " + (err.response?.data?.error || err.message));
      }
   };

   const deleteMaterial = async (id) => {
      if (!window.confirm("Are you sure?")) return;
      try {
         const token = localStorage.getItem('adminToken');
         await axios.post('/api/api.php?action=delete_material', { id }, {
            headers: { Authorization: `Bearer ${token}` }
         });
         fetchData();
      } catch (err) { alert("Delete failed"); }
   };

   const updatePage = async (e) => {
      e.preventDefault();
      try {
         const token = localStorage.getItem('adminToken');
         const res = await axios.post('/api/api.php?action=update_page', selectedPage, {
            headers: { Authorization: `Bearer ${token}` }
         });
         if (res.data.success) {
            setShowPageModal(false);
            fetchData();
         }
      } catch (err) { alert("Failed to update page"); }
   };

   const addPage = async (e) => {
      e.preventDefault();
      try {
         const token = localStorage.getItem('adminToken');
         const res = await axios.post('/api/api.php?action=add_page', newPageData, {
            headers: { Authorization: `Bearer ${token}` }
         });
         if (res.data.success) {
            setShowAddPageModal(false);
            setNewPageData({ title: '', content: '' });
            fetchData();
         }
      } catch (err) { alert("Failed to add page"); }
   };

   const deletePage = async (id) => {
      if (!window.confirm("Are you sure? This will delete the page forever.")) return;
      try {
         const token = localStorage.getItem('adminToken');
         await axios.post('/api/api.php?action=delete_page', { id }, {
            headers: { Authorization: `Bearer ${token}` }
         });
         fetchData();
      } catch (err) { alert("Delete failed"); }
   };

   const generateOnboardingDoc = async () => {
      setUploading(true);
      const element = document.getElementById('doc-preview');
      if (!element) return;

      try {
         const canvas = await html2canvas(element, { scale: 2 });
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF('p', 'mm', 'a4');
         const imgProps = pdf.getImageProperties(imgData);
         const pdfWidth = pdf.internal.pageSize.getWidth();
         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

         // Trigger Local Download Only
         pdf.save(`StudyCubs_${onboardingData.type}_${onboardingData.teacher_name.replace(/\s+/g, '_')}.pdf`);

         alert("Document Generated and Downloaded Successfully!");
      } catch (err) {
         console.error(err);
         alert("Failed to generate document");
      } finally {
         setUploading(false);
      }
   };

   const handleLogout = () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
   };

   if (loading) return (
      <div className="h-screen flex flex-col items-center justify-center bg-white font-inter">
         <Loader2 className="w-12 h-12 animate-spin text-[hsl(190,70%,42%)] mb-4" />
         <p className="text-gray-400 font-medium">Securing Workspace...</p>
      </div>
   );

   const currentUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

   return (
      <div className="flex min-h-screen bg-[#F8FAFC] font-inter text-slate-900">
         {/* Sidebar */}
         <aside className="w-72 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 z-50">
            <div className="p-8">
               <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-[hsl(190,70%,42%)] rounded-xl flex items-center justify-center shadow-lg shadow-[hsl(190,70%,42%)]/20">
                     <Shield className="text-white w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">Study<span className="text-[hsl(190,70%,42%)]">Admin</span></span>
               </div>

               <nav className="space-y-2">
                  <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                  <SidebarItem icon={<Users size={20} />} label="Enquiries" active={activeTab === 'enquiries'} onClick={() => setActiveTab('enquiries')} badge={stats.new_leads} />
                  <SidebarItem icon={<BookOpen size={20} />} label="Curriculum" active={activeTab === 'programs'} onClick={() => setActiveTab('programs')} />
                  <SidebarItem icon={<FileText size={20} />} label="Journal" active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} />
                  <SidebarItem icon={<FolderOpen size={20} />} label="Materials" active={activeTab === 'materials'} onClick={() => setActiveTab('materials')} />
                  {currentUser.role === 'admin' && (
                     <>
                        <SidebarItem icon={<FileText size={20} />} label="Pages" active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} />
                        <SidebarItem icon={<Sparkles size={20} />} label="Onboarding" active={activeTab === 'onboarding'} onClick={() => setActiveTab('onboarding')} />
                        <SidebarItem icon={<UserPlus size={20} />} label="Team" active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
                     </>
                  )}
               </nav>
            </div>

            <div className="mt-auto p-8 border-t border-slate-50">
               <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[hsl(190,70%,42%)] shadow-sm">{currentUser?.name?.[0] || 'A'}</div>
                  <div className="overflow-hidden">
                     <p className="font-bold text-sm truncate">{currentUser?.name || 'Admin User'}</p>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{currentUser?.role || 'Staff'}</p>
                  </div>
               </div>
               <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-500 font-bold transition-all w-full px-4">
                  <LogOut size={20} /> Logout
               </button>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 ml-72 p-12">
            <header className="flex justify-between items-center mb-12">
               <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2 capitalize">{activeTab}</h2>
                  <p className="text-slate-400 font-medium">Welcome back, {currentUser?.name?.split(' ')[0] || 'Admin'}!</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                     <input type="text" placeholder="Search anything..." className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium w-64 focus:outline-none focus:ring-2 focus:ring-[hsl(190,70%,42%)]/20 transition-all" />
                  </div>
                  <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[hsl(190,70%,42%)] transition-all"><Settings size={20} /></button>
               </div>
            </header>

            {activeTab === 'overview' && (
               <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     <StatsCard label="Total Enquiries" value={stats.total_leads} trend="+12%" icon={<Users className="text-blue-500" />} />
                     <StatsCard label="Fresh Leads" value={stats.new_leads} trend="Active" icon={<AlertCircle className="text-orange-500" />} />
                     <StatsCard label="Conversions" value={stats.converted} trend={stats.conversion_rate} icon={<CheckCircle className="text-emerald-500" />} />
                     <StatsCard label="Materials" value={materials.length} trend="Library" icon={<FolderOpen className="text-purple-500" />} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                           <h3 className="font-bold text-lg">Recent Enquiries</h3>
                           <button onClick={() => setActiveTab('enquiries')} className="text-[hsl(190,70%,42%)] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">View All <ChevronRight size={16} /></button>
                        </div>
                        <div className="space-y-6">
                           {leads.slice(0, 5).map(lead => (
                              <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 group-hover:bg-[hsl(190,70%,42%)] group-hover:text-white transition-all">{lead.name[0]}</div>
                                    <div>
                                       <p className="font-bold text-sm">{lead.name}</p>
                                       <p className="text-xs text-slate-400">{lead.phone}</p>
                                    </div>
                                 </div>
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(lead.status)}`}>{lead.status}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-8">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <ActionBtn icon={<Plus size={20} />} label="New Program" color="bg-blue-50 text-blue-600" onClick={() => navigate('/admin/program-editor')} />
                           <ActionBtn icon={<Plus size={20} />} label="New Material" color="bg-purple-50 text-purple-600" onClick={() => setActiveTab('materials')} />
                           <ActionBtn icon={<UserPlus size={20} />} label="Add Member" color="bg-orange-50 text-orange-600" onClick={() => setActiveTab('team')} />
                           <ActionBtn icon={<Settings size={20} />} label="Settings" color="bg-slate-50 text-slate-600" />
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'enquiries' && (
               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                     <h3 className="font-bold text-lg">Sales Pipeline</h3>
                     <div className="flex gap-4">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"><Filter size={16} /> Filter</button>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                              <th className="px-8 py-6">Prospect Name</th>
                              <th className="px-8 py-6">Contact Details</th>
                              <th className="px-8 py-6">Source</th>
                              <th className="px-8 py-6">Status</th>
                              <th className="px-8 py-6 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {leads.map(lead => (
                              <tr key={lead.id} className="hover:bg-slate-50/50 transition-all">
                                 <td className="px-8 py-6">
                                    <p className="font-bold text-slate-800">{lead.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">ID: #LD-{lead.id}</p>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="space-y-1">
                                       <div className="flex items-center gap-2 text-sm font-medium text-slate-600"><Phone size={14} className="text-slate-300" /> {lead.phone}</div>
                                       <div className="flex items-center gap-2 text-sm font-medium text-slate-600"><Mail size={14} className="text-slate-300" /> {lead.email || 'N/A'}</div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">{lead.source}</span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="relative group">
                                       <select
                                          value={lead.status}
                                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                          className={`appearance-none w-full pl-4 pr-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-transparent focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer ${getStatusColor(lead.status)} shadow-sm`}
                                       >
                                          <option value="new">New Lead</option>
                                          <option value="contacted">Contacted</option>
                                          <option value="follow-up-1">Follow up 1</option>
                                          <option value="follow-up-2">Follow up 2</option>
                                          <option value="demo-scheduled">Demo Scheduled</option>
                                          <option value="converted">Converted</option>
                                          <option value="rejected">Rejected</option>
                                       </select>
                                       <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-current opacity-50 pointer-events-none w-4 h-4" />
                                    </div>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <button onClick={() => setSelectedLead(lead)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[hsl(190,70%,42%)] hover:shadow-md transition-all"><Eye size={18} /></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'materials' && (
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h3 className="font-bold text-xl">Study Materials</h3>
                     <button onClick={() => setShowMaterialModal(true)} className="px-6 py-3 bg-[hsl(190,70%,42%)] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[hsl(190,70%,42%)]/20 hover:scale-105 transition-all"><Upload size={18} /> Add Material</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {materials.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-[hsl(190,70%,42%)] transition-all">
                           <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:bg-[hsl(190,70%,42%)]/10 group-hover:text-[hsl(190,70%,42%)] transition-all">
                              {item.type === 'pdf' ? <File size={28} /> : <ImageIcon size={28} />}
                           </div>
                           <h4 className="font-bold text-sm mb-2 line-clamp-1">{item.title}</h4>
                           <p className="text-xs text-slate-400 font-medium mb-6 line-clamp-2">{item.description}</p>
                           <div className="flex gap-2">
                              <a href={item.file_url} target="_blank" className="flex-1 py-2 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"><Download size={14} /> View</a>
                              <button onClick={() => deleteMaterial(item.id)} className="p-2 border border-slate-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'programs' && (
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <div>
                        <h3 className="font-bold text-xl">Manage Curriculum</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">Updates reflect instantly on the public Curriculum page.</p>
                     </div>
                     <button onClick={() => navigate('/admin/program-editor')} className="px-6 py-3 bg-[hsl(190,70%,42%)] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[hsl(190,70%,42%)]/20 hover:scale-105 transition-all"><Plus size={18} /> New Program</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {programs.map(prog => (
                        <div key={prog.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:border-[hsl(190,70%,42%)] transition-all">
                           <div className="aspect-video relative overflow-hidden bg-slate-100">
                              <img src={prog.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prog.title} />
                              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-widest text-[hsl(190,70%,42%)]">{prog.age_group}</div>
                           </div>
                           <div className="p-8">
                              <h4 className="font-bold text-lg mb-4 line-clamp-1">{prog.title}</h4>
                              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                                 <span className="flex items-center gap-1"><Clock size={14} /> {prog.duration}</span>
                                 <span className="flex items-center gap-1"><Users size={14} /> {prog.batch_size}</span>
                              </div>
                              <div className="flex gap-3">
                                 <button onClick={() => navigate(`/admin/program-editor?id=${prog.id}`)} className="flex-1 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-[hsl(190,70%,42%)] hover:text-white transition-all flex items-center justify-center gap-2"><Edit size={16} /> Edit</button>
                                 <button className="p-3 border border-slate-100 text-slate-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all"><Trash2 size={16} /></button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'team' && (
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h3 className="font-bold text-xl">Team Management</h3>
                     <button onClick={() => setShowUserModal(true)} className="px-6 py-3 bg-[hsl(190,70%,42%)] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[hsl(190,70%,42%)]/20 hover:scale-105 transition-all"><Plus size={18} /> Add Member</button>
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                              <th className="px-8 py-6">Member Name</th>
                              <th className="px-8 py-6">Role</th>
                              <th className="px-8 py-6">Email Address</th>
                              <th className="px-8 py-6 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {users.map(u => (
                              <tr key={u.id} className="hover:bg-slate-50/50">
                                 <td className="px-8 py-6 font-bold">{u.name}</td>
                                 <td className="px-8 py-6"><span className="px-2 py-1 bg-slate-100 text-[10px] font-black uppercase tracking-widest rounded text-slate-400">{u.role}</span></td>
                                 <td className="px-8 py-6 font-medium text-slate-500">{u.email}</td>
                                 <td className="px-8 py-6 text-right"><button className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'blogs' && (
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h3 className="font-bold text-xl">Article Management</h3>
                     <button onClick={() => navigate('/admin/blog-editor')} className="px-6 py-3 bg-[hsl(190,70%,42%)] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[hsl(190,70%,42%)]/20 hover:scale-105 transition-all"><Plus size={18} /> Write New Article</button>
                  </div>
                  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm font-medium">
                           <thead>
                              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                                 <th className="px-8 py-6">Article Info</th>
                                 <th className="px-8 py-6">Author</th>
                                 <th className="px-8 py-6">Status</th>
                                 <th className="px-8 py-6">Date</th>
                                 <th className="px-8 py-6 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {blogs.map(blog => (
                                 <tr key={blog.id} className="hover:bg-slate-50/50 transition-all">
                                    <td className="px-8 py-6">
                                       <div className="flex items-center gap-4">
                                          <img src={blog.thumbnail || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                          <p className="font-bold text-slate-800 line-clamp-1">{blog.title}</p>
                                       </div>
                                    </td>
                                    <td className="px-8 py-6 text-slate-400 uppercase tracking-widest text-[10px] font-black">{blog.author_name}</td>
                                    <td className="px-8 py-6">
                                       <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${blog.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{blog.status}</span>
                                    </td>
                                    <td className="px-8 py-6 text-slate-400">{new Date(blog.created_at).toLocaleDateString()}</td>
                                    <td className="px-8 py-6 text-right space-x-2">
                                       <button onClick={() => navigate(`/admin/blog-editor?id=${blog.id}`)} className="p-2 text-slate-400 hover:text-[hsl(190,70%,42%)] transition-all"><Edit size={18} /></button>
                                       <button className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'pages' && (
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-bold">Managed Pages</h3>
                     <button onClick={() => setShowAddPageModal(true)} className="px-6 py-3 bg-[hsl(190,70%,42%)] text-white font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[hsl(190,70%,42%)]/20">
                        <Plus size={18} /> Create New Page
                     </button>
                  </div>
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-slate-50">
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Page Title</th>
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Slug</th>
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Updated</th>
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody>
                              {pages.map(page => (
                                 <tr key={page.id} className="border-b border-slate-50 last:border-0 group hover:bg-slate-50 transition-all">
                                    <td className="px-8 py-6 font-bold text-slate-800">{page.title}</td>
                                    <td className="px-8 py-6 text-slate-400 font-medium">/page/{page.slug}</td>
                                    <td className="px-8 py-6 text-slate-400">{new Date(page.updated_at).toLocaleString()}</td>
                                    <td className="px-8 py-6 text-right space-x-2">
                                       <button onClick={() => { setSelectedPage(page); setShowPageModal(true); }} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-[hsl(190,70%,42%)] hover:text-white transition-all">
                                          <Edit size={18} />
                                       </button>
                                       <button onClick={() => deletePage(page.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                          <Trash2 size={18} />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'onboarding' && (
               <div className="space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                     {/* Form */}
                     <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold mb-4">Document Generator</h3>

                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Template</label>
                           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={onboardingData.type} onChange={(e) => setOnboardingData({ ...onboardingData, type: e.target.value })}>
                              <option value="offer_letter">Teacher Offer Letter</option>
                              <option value="mou">Instructor MOU</option>
                              <option value="batch_allocation">Batch Allocation Letter</option>
                           </select>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pt-4">Variable Details</h4>
                           <input type="text" placeholder="Teacher Full Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.teacher_name} onChange={(e) => setOnboardingData({ ...onboardingData, teacher_name: e.target.value })} />
                           <input type="text" placeholder="Teacher Address" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.teacher_address} onChange={(e) => setOnboardingData({ ...onboardingData, teacher_address: e.target.value })} />
                           <div className="grid grid-cols-2 gap-4">
                              <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.teacher_email} onChange={(e) => setOnboardingData({ ...onboardingData, teacher_email: e.target.value })} />
                              <input type="text" placeholder="Phone" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.teacher_phone} onChange={(e) => setOnboardingData({ ...onboardingData, teacher_phone: e.target.value })} />
                           </div>
                           <input type="text" placeholder="Subject / Course" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.subject} onChange={(e) => setOnboardingData({ ...onboardingData, subject: e.target.value })} />
                           <div className="grid grid-cols-2 gap-4">
                              <input type="text" placeholder="Batch Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.batch_name} onChange={(e) => setOnboardingData({ ...onboardingData, batch_name: e.target.value })} />
                              <input type="text" placeholder="Batch Code" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.batch_code} onChange={(e) => setOnboardingData({ ...onboardingData, batch_code: e.target.value })} />
                           </div>
                           <input type="text" placeholder="Compensation (e.g. â‚¹500/hr)" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.compensation} onChange={(e) => setOnboardingData({ ...onboardingData, compensation: e.target.value })} />

                           {onboardingData.type === 'mou' && (
                              <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Notice (Days)</label>
                                    <input type="text" placeholder="30" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.notice_period} onChange={(e) => setOnboardingData({ ...onboardingData, notice_period: e.target.value })} />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Non-Compete (M)</label>
                                    <input type="text" placeholder="12" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" value={onboardingData.non_compete_months} onChange={(e) => setOnboardingData({ ...onboardingData, non_compete_months: e.target.value })} />
                                 </div>
                              </div>
                           )}
                        </div>

                        <button
                           onClick={generateOnboardingDoc}
                           disabled={uploading || !onboardingData.teacher_name}
                           className="w-full py-4 bg-[hsl(190,70%,42%)] text-white font-bold rounded-2xl shadow-lg shadow-[hsl(190,70%,42%)]/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                           {uploading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                           {uploading ? 'Processing...' : 'Generate & Save PDF'}
                        </button>
                     </div>

                     {/* History */}
                     <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50">
                           <h3 className="font-bold text-lg">Onboarding History</h3>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="border-b border-slate-50">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Teacher</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {onboardingDocs.map(doc => (
                                    <tr key={doc.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all">
                                       <td className="px-8 py-6 font-bold text-slate-800">{doc.teacher_name}</td>
                                       <td className="px-8 py-6">
                                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">{doc.type.replace('_', ' ')}</span>
                                       </td>
                                       <td className="px-8 py-6 text-slate-400 text-sm">{new Date(doc.created_at).toLocaleDateString()}</td>
                                       <td className="px-8 py-6 text-right">
                                          <a href={doc.file_url} target="_blank" className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-[hsl(190,70%,42%)] hover:text-white transition-all inline-block">
                                             <Download size={18} />
                                          </a>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>               {/* Hidden Document Preview Area (Used for PDF Generation) */}
                  <div className="fixed -left-[2000px] top-0">
                     <div id="doc-preview" style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#ffffff', padding: '20mm', color: '#1e293b', fontFamily: 'serif', boxSizing: 'border-box' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #2096a6', paddingBottom: '32px', marginBottom: '40px' }}>
                           <div>
                              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#2096a6', margin: '0 0 4px 0' }}>StudyCubs</h1>
                              <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Education Pvt. Ltd.</p>
                           </div>
                           <div style={{ textAlign: 'right', fontSize: '10px', color: '#94a3b8' }}>
                              <p style={{ margin: 0 }}>Office: Pune, India</p>
                              <p style={{ margin: 0 }}>Email: support@studycubs.com</p>
                              <p style={{ margin: 0 }}>Web: www.studycubs.com</p>
                           </div>
                        </div>

                        {/* Content based on Type */}
                        {onboardingData.type === 'offer_letter' && (
                           <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                              <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline', textTransform: 'uppercase', marginBottom: '32px' }}>Teacher Offer Letter</h2>
                              <p style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '24px' }}>Date: {new Date().toLocaleDateString()}</p>
                              <div style={{ marginBottom: '24px' }}>
                                 <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>To,</p>
                                 <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>{onboardingData.teacher_name}</p>
                                 <p style={{ margin: '0 0 4px 0' }}>{onboardingData.teacher_address}</p>
                                 <p style={{ margin: '0 0 4px 0' }}>Email: {onboardingData.teacher_email}</p>
                                 <p style={{ margin: '0 0 4px 0' }}>Phone: {onboardingData.teacher_phone}</p>
                              </div>
                              <p style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '16px' }}>Subject: Offer of Engagement as Instructor at StudyCubs</p>
                              <p style={{ marginBottom: '24px' }}>We are pleased to offer you the position of Instructor with StudyCubs Pvt. Ltd., Pune, India. This engagement is for conducting online classes for students enrolled in StudyCubs programs.</p>

                              <div style={{ marginBottom: '24px' }}>
                                 <p style={{ margin: '0 0 12px 0' }}><span style={{ fontWeight: 'bold' }}>1. Position:</span> You will be engaged as a Part-Time Instructor for the subject/course: {onboardingData.subject}.</p>
                                 <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>2. Batch Details:</p>
                                 <ul style={{ paddingLeft: '32px', margin: '0 0 16px 0', listStyleType: 'disc' }}>
                                    <li>Batch Name: {onboardingData.batch_name}</li>
                                    <li>Batch Code: {onboardingData.batch_code}</li>
                                    <li>Classes per Month: {onboardingData.classes_per_month}</li>
                                    <li>Class Duration: {onboardingData.duration}</li>
                                 </ul>
                                 <p style={{ margin: '0 0 12px 0' }}><span style={{ fontWeight: 'bold' }}>3. Compensation:</span> You will receive a compensation of {onboardingData.compensation} for the assigned batch.</p>
                                 <p style={{ margin: '0 0 12px 0' }}><span style={{ fontWeight: 'bold' }}>4. Payment Cycle:</span> Payments will be processed on or around the {onboardingData.payment_day} day of each month.</p>
                              </div>

                              <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between' }}>
                                 <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '48px' }}>For StudyCubs Pvt. Ltd.</p>
                                    <p style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px', fontSize: '12px' }}>Authorized Signatory</p>
                                 </div>
                                 <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '48px' }}>Accepted By</p>
                                    <p style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px', fontSize: '12px' }}>{onboardingData.teacher_name}</p>
                                 </div>
                              </div>
                           </div>
                        )}

                        {onboardingData.type === 'mou' && (
                           <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
                              <h2 style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline', textTransform: 'uppercase', marginBottom: '20px' }}>MEMORANDUM OF UNDERSTANDING (MOU)</h2>
                              <p style={{ marginBottom: '12px' }}>This Memorandum of Understanding (â€œMOUâ€) is entered into between Studycubs Pvt. Ltd., Pune, India (hereinafter referred to as â€œStudycubsâ€ or â€œthe Companyâ€), represented by {onboardingData.admin_name} ({onboardingData.admin_designation}), and {onboardingData.teacher_name} (hereinafter referred to as â€œInstructorâ€).</p>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', border: '1px solid #f1f5f9', padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc', marginBottom: '16px' }}>
                                 <div>
                                    <p style={{ fontWeight: 'bold', color: '#2096a6', marginBottom: '4px' }}>Instructor Details</p>
                                    <p style={{ fontWeight: 'bold', margin: '0 0 2px 0' }}>{onboardingData.teacher_name}</p>
                                    <p style={{ margin: '0 0 2px 0' }}>{onboardingData.teacher_address}</p>
                                    <p style={{ margin: 0 }}>{onboardingData.teacher_email} | {onboardingData.teacher_phone}</p>
                                 </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                 <p><span style={{ fontWeight: 'bold' }}>1. Role and Responsibilities:</span> The Instructor agrees to conduct online classes for students enrolled in Studycubs programs and follow the academic structure, policies, and guidelines established by the Company.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>2. Batch Allocation and Class Structure:</span> Each batch typically consists of {onboardingData.classes_per_month} classes per month. Each class duration will generally be approximately {onboardingData.duration} unless otherwise specified.</p>
                                 <div style={{ paddingLeft: '15px', margin: '2px 0' }}>
                                    <p style={{ margin: 0 }}>â€¢ Batch Name: {onboardingData.batch_name}</p>
                                    <p style={{ margin: 0 }}>â€¢ Schedule: {onboardingData.schedule}</p>
                                    <p style={{ margin: 0 }}>â€¢ Class Time: {onboardingData.timing}</p>
                                 </div>
                                 <p><span style={{ fontWeight: 'bold' }}>3. Compensation:</span> For the assigned batch, the Instructor will receive a monthly compensation of {onboardingData.compensation} for conducting the scheduled classes.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>4. Payment Cycle:</span> Payments will be processed on or around the {onboardingData.payment_day} day of each month.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>5. Payment Method:</span> Payments will generally be made via UPI or bank transfer. Payment will only be made for successfully completed classes.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>6. Leave and Class Cancellation Policy:</span> If the Instructor is unable to conduct a scheduled class, at least 24 hours prior notice must be provided. A make-up class must be scheduled in coordination with Studycubs.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>7. Notice Period and Termination:</span> Either party may terminate this arrangement with {onboardingData.notice_period} days written notice. The Company reserves the right to terminate immediately in cases of misconduct.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>8. Intellectual Property:</span> All teaching materials, curriculum, presentations, worksheets, or content developed or used for Studycubs classes shall remain the property of Studycubs Pvt. Ltd.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>9. Non-Solicitation:</span> The Instructor agrees not to directly or indirectly solicit Studycubs students or parents for private tutoring outside the platform.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>10. Non-Compete:</span> For a period of {onboardingData.non_compete_months} months after the end of this engagement, the Instructor agrees not to start or promote any competing class that enrolls Studycubs students.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>11. Professional Conduct:</span> The Instructor is expected to join classes on time and maintain professional standards.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>12. Platform Communication:</span> All communication with students and parents should occur through approved Studycubs channels.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>13. Confidentiality:</span> The Instructor agrees to maintain confidentiality regarding student information and internal processes.</p>
                                 <p><span style={{ fontWeight: 'bold' }}>14. Acceptance:</span> By signing below, both parties acknowledge that they have read and agreed to the terms outlined in this MOU.</p>
                              </div>

                              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                                 <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '25px' }}>For StudyCubs Pvt. Ltd.</p>
                                    <p style={{ fontSize: '8px', color: '#94a3b8' }}>Authorized Signature</p>
                                 </div>
                                 <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '25px' }}>Instructor Signature</p>
                                    <p style={{ fontSize: '8px', color: '#94a3b8' }}>{onboardingData.teacher_name}</p>
                                 </div>
                              </div>
                           </div>
                        )}

                        {onboardingData.type === 'batch_allocation' && (
                           <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                              <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline', textTransform: 'uppercase', marginBottom: '32px' }}>Batch Allocation Letter</h2>
                              <p style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '32px' }}>Date: {new Date().toLocaleDateString()}</p>
                              <p style={{ marginBottom: '16px' }}>To, <br /><span style={{ fontWeight: 'bold' }}>{onboardingData.teacher_name}</span></p>
                              <p style={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '16px' }}>Subject: Batch Allocation for StudyCubs Program</p>
                              <p style={{ marginBottom: '24px' }}>This letter confirms the allocation of the following teaching batch to you:</p>

                              <div style={{ backgroundColor: '#f8fafc', padding: '32px', borderRadius: '32px', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: '16px' }}>
                                    <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Batch Name</p>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>{onboardingData.batch_name}</p>

                                    <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Course</p>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>{onboardingData.subject}</p>

                                    <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Batch Code</p>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>{onboardingData.batch_code}</p>

                                    <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Schedule</p>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>{onboardingData.schedule || 'TBD'}</p>
                                 </div>
                              </div>

                              <p style={{ marginTop: '24px' }}>Please ensure all materials are prepared before the batch start date. We wish you a successful teaching journey with this batch.</p>

                              <div style={{ marginTop: '48px', textAlign: 'right' }}>
                                 <p style={{ fontWeight: 'bold', marginBottom: '48px' }}>For StudyCubs Pvt. Ltd.</p>
                                 <p style={{ fontSize: '14px' }}>Authorized Representative</p>
                              </div>
                           </div>
                        )}

                        {/* Footer Branding */}
                        <div style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '8px', color: '#cbd5e1', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                           This is an electronically generated document by StudyCubs Administration System.
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Page Editor Modal */}
            {showPageModal && selectedPage && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-sm">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl rounded-[2.5rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold">Edit {selectedPage.title}</h3>
                        <button onClick={() => setShowPageModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><XCircle className="text-slate-300" /></button>
                     </div>
                     <form onSubmit={updatePage} className="space-y-6">
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Title</label>
                           <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={selectedPage.title} onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })} />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Page Content (HTML Supported)</label>
                           <textarea required rows="15" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium font-mono text-sm" value={selectedPage.content} onChange={(e) => setSelectedPage({ ...selectedPage, content: e.target.value })} />
                        </div>
                        <div className="flex gap-4 pt-4">
                           <button type="submit" className="flex-1 py-4 bg-[hsl(190,70%,42%)] text-white font-bold rounded-2xl shadow-lg shadow-[hsl(190,70%,42%)]/20 hover:scale-[1.02] transition-all">Save Changes</button>
                           <button type="button" onClick={() => setShowPageModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Discard</button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}

            {/* User Modal */}
            {showUserModal && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-sm">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
                     <h3 className="text-2xl font-bold mb-8">Add Team Member</h3>
                     <form onSubmit={addUser} className="space-y-6">
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                           <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={newUserData.name} onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })} />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                           <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Initial Password</label>
                           <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={newUserData.password} onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })} />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Access Role</label>
                           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={newUserData.role} onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}>
                              <option value="sales">Sales / CRM</option>
                              <option value="writer">Content Writer</option>
                              <option value="admin">Administrator</option>
                           </select>
                        </div>
                        <div className="flex gap-4 pt-4">
                           <button type="submit" className="flex-1 py-4 bg-[hsl(190,70%,42%)] text-white font-bold rounded-2xl">Save Member</button>
                           <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}

            {/* Material Modal */}
            {showMaterialModal && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-sm">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
                     <h3 className="text-2xl font-bold mb-8">Add New Material</h3>
                     <form onSubmit={addMaterial} className="space-y-6">
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Material Title</label>
                           <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={newMaterialData.title} onChange={(e) => setNewMaterialData({ ...newMaterialData, title: e.target.value })} />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Resource Type</label>
                           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={newMaterialData.type} onChange={(e) => setNewMaterialData({ ...newMaterialData, type: e.target.value })}>
                              <option value="pdf">PDF Document</option>
                              <option value="image">Image / Graphic</option>
                              <option value="video">Video Lecture</option>
                              <option value="link">External Link</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Brief Description</label>
                           <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium" rows="3" value={newMaterialData.description} onChange={(e) => setNewMaterialData({ ...newMaterialData, description: e.target.value })} />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Upload Asset</label>
                           <div className="relative">
                              <input type="file" onChange={handleFileUpload} className="hidden" id="material-file" />
                              <label htmlFor="material-file" className="w-full py-6 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                                 {uploading ? <Loader2 className="animate-spin text-[hsl(190,70%,42%)]" /> : (
                                    <>
                                       <Upload size={24} className="text-slate-300 mb-2" />
                                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{newMaterialData.file_url ? 'File Ready!' : 'Select File'}</p>
                                    </>
                                 )}
                              </label>
                           </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                           <button type="submit" disabled={uploading || !newMaterialData.file_url} className="flex-1 py-4 bg-[hsl(190,70%,42%)] text-white font-bold rounded-2xl disabled:opacity-50">Publish Material</button>
                           <button type="button" onClick={() => setShowMaterialModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}

            {/* Add Page Modal */}
            {showAddPageModal && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-sm">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl rounded-[2.5rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold">Create New Page</h3>
                        <button onClick={() => setShowAddPageModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><XCircle className="text-slate-300" /></button>
                     </div>
                     <form onSubmit={addPage} className="space-y-6">
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Page Title</label>
                           <input required type="text" placeholder="e.g. Cookie Policy" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={newPageData.title} onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value })} />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Initial Content (HTML Supported)</label>
                           <textarea required rows="10" placeholder="<h1>Title</h1><p>Start writing...</p>" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium font-mono text-sm" value={newPageData.content} onChange={(e) => setNewPageData({ ...newPageData, content: e.target.value })} />
                        </div>
                        <div className="flex gap-4 pt-4">
                           <button type="submit" className="flex-1 py-4 bg-[hsl(190,70%,42%)] text-white font-bold rounded-2xl shadow-lg shadow-[hsl(190,70%,42%)]/20 hover:scale-[1.02] transition-all">Create Page</button>
                           <button type="button" onClick={() => setShowAddPageModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}
         </main>
      </div>
   );
};

const SidebarItem = ({ icon, label, active, onClick, badge }) => (
   <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${active ? 'bg-[hsl(190,70%,42%)] text-white shadow-lg shadow-[hsl(190,70%,42%)]/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
   >
      <div className="flex items-center gap-3">
         {icon} <span>{label}</span>
      </div>
      {badge > 0 && <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${active ? 'bg-white text-[hsl(190,70%,42%)]' : 'bg-orange-100 text-orange-600'}`}>{badge}</span>}
   </button>
);

const StatsCard = ({ label, value, trend, icon }) => (
   <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-6">
         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl">{icon}</div>
         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${trend?.includes('%') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{trend}</span>
      </div>
      <p className="text-slate-400 text-sm font-bold tracking-tight mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
   </div>
);

const ActionBtn = ({ icon, label, color, onClick }) => (
   <button onClick={onClick} className={`${color} p-6 rounded-3xl flex flex-col items-center gap-3 font-bold transition-all hover:scale-105 hover:shadow-lg`}>
      {icon}
      <span className="text-xs">{label}</span>
   </button>
);

const getStatusColor = (status) => {
   switch (status) {
      case 'new': return 'bg-blue-50 text-blue-600';
      case 'contacted': return 'bg-purple-50 text-purple-600';
      case 'follow-up-1': return 'bg-orange-50 text-orange-600';
      case 'follow-up-2': return 'bg-amber-50 text-amber-600';
      case 'demo-scheduled': return 'bg-indigo-50 text-indigo-600';
      case 'converted': return 'bg-emerald-50 text-emerald-600';
      case 'rejected': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-100 text-slate-500';
   }
};

export default AdminDashboard;
