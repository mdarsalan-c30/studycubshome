import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, MessageSquare, LogOut, Search, Users, FileText } from "lucide-react";
import { toast } from "sonner";

const AdminLayout = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("adminUser");
  let user = { role: 'admin', full_name: 'Admin' };
  
  try {
    if (userStr && userStr !== "undefined") {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error("Layout User Parse Error", e);
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", roles: ["admin", "writer", "sales"] },
    { label: "Enquiries", icon: MessageSquare, path: "/admin/enquiries", roles: ["admin", "sales"] },
    { label: "Programs", icon: BookOpen, path: "/admin/programs", roles: ["admin"] },
    { label: "Blogs", icon: Search, path: "/admin/blogs", roles: ["admin", "writer"] },
    { label: "Materials", icon: FileText, path: "/admin/materials", roles: ["admin", "writer"] },
    { label: "Users", icon: Users, path: "/admin/users", roles: ["admin"] }, // NEW: User Manager for Super Admin
  ];

  const userRole = user?.role || 'admin';
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="w-64 bg-card border-r border-border p-6 hidden md:block">
        <div className="mb-10">
          <Link to="/" className="font-display text-2xl font-bold text-primary">StudyCubs</Link>
          <p className="text-xs text-muted-foreground font-body mt-1 uppercase tracking-wider">Admin Panel</p>
        </div>
        <nav className="space-y-2">
          {filteredNavItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all font-body font-medium text-muted-foreground">
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-10">
          <div className="p-4 bg-muted rounded-2xl mb-4">
            <p className="text-sm font-bold font-body">{user.full_name || "Admin"}</p>
            <p className="text-xs text-muted-foreground font-body capitalize">{user.role}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-destructive hover:bg-destructive/5 transition-all font-body font-medium">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
