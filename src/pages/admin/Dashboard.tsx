import { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, BookOpen, Search, TrendingUp } from "lucide-react";

const DashboardOverview = () => {
  const [stats, setStats] = useState({ enquiries: 0, programs: 0, blogs: 0 });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
    setUser(loggedInUser);

    const fetchStats = async () => {
      try {
        const blogUrl = loggedInUser.role === 'admin' 
          ? "http://localhost:5000/api/blogs" 
          : `http://localhost:5000/api/blogs?author_id=${loggedInUser.id}`;

        const [enquiriesRes, blogsRes, programsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/enquiries"),
          axios.get(blogUrl),
          axios.get("http://localhost:5000/api/programs")
        ]);
        
        setStats({ 
          enquiries: enquiriesRes.data.length, 
          blogs: blogsRes.data.length,
          programs: programsRes.data.length 
        });
      } catch (error) { console.error("Error fetching stats", error); }
    };
    fetchStats();
  }, []);

  const isAdmin = user?.role === 'admin';

  const statCards = isAdmin ? [
    { label: "Total Enquiries", value: stats.enquiries, icon: MessageSquare, color: "bg-blue-500" },
    { label: "Active Programs", value: stats.programs, icon: BookOpen, color: "bg-orange-500" },
    { label: "Total Blog Posts", value: stats.blogs, icon: Search, color: "bg-green-500" },
    { label: "Success Rate", value: "98%", icon: TrendingUp, color: "bg-purple-500" },
  ] : [
    { label: "My Articles", value: stats.blogs, icon: BookOpen, color: "bg-green-500" },
    { label: "Total Enquiries", value: stats.enquiries, icon: MessageSquare, color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard Overview</h1>
        <p className="font-body text-muted-foreground mt-1">Welcome back to StudyCubs admin panel.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card p-6 rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all">
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg`}><card.icon size={24} /></div>
            <p className="text-sm font-body text-muted-foreground font-semibold">{card.label}</p>
            <p className="text-3xl font-display font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
