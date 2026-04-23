import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin Pages
import AdminLogin from "./pages/admin/Login.tsx";
import AdminLayout from "./pages/admin/Layout.tsx";
import DashboardOverview from "./pages/admin/Dashboard.tsx";
import EnquiryManager from "./pages/admin/Enquiries.tsx";
import BlogManager from "./pages/admin/Blogs.tsx";
import UserManager from "./pages/admin/Users.tsx";
import ProgramManager from "./pages/admin/Programs.tsx";
import PublicBlogs from "./pages/Blogs.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import ProgramDetail from "./pages/ProgramDetail.tsx";

import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("adminToken");
  console.log("Protected Route Token Check:", !!token);
  
  if (!token || token === "undefined") {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blogs" element={<PublicBlogs />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/program/:slug" element={<ProgramDetail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="enquiries" element={<EnquiryManager />} />
            <Route path="programs" element={<ProgramManager />} />
            <Route path="blogs" element={<BlogManager />} />
            <Route path="users" element={<UserManager />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
