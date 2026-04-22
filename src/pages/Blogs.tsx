import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, User } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const PublicBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/public/blogs");
        setBlogs(response.data);
      } catch (error) { console.error("Error fetching blogs", error); }
      finally { setLoading(false); }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      
      {/* Hero Header */}
      <header className="pt-32 pb-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <Badge className="bg-white/20 text-white mb-4 border-none px-4 py-1">Education & Growth</Badge>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">Our Cub's Journal</h1>
          <p className="max-w-2xl mx-auto text-white/80 font-body text-lg">
            Insights, tips, and stories from our expert educators to help your child thrive in their learning journey.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-card animate-pulse rounded-3xl" />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-muted-foreground">Coming Soon!</h2>
            <p>Our writers are busy creating amazing content for you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: any) => (
              <AnimatedSection key={blog.id}>
                <Link to={`/blog/${blog.slug}`} className="group block">
                  <Card className="rounded-3xl overflow-hidden border-border shadow-card hover:shadow-card-hover transition-all h-full flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                      {blog.featured_image ? (
                        <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20 bg-primary/5 font-display text-4xl">SC</div>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><User size={12} /> {blog.author_name}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                        {blog.title}
                      </h3>
                      <div className="mt-auto flex items-center text-primary font-bold text-sm">
                        Read Full Story <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PublicBlogs;
