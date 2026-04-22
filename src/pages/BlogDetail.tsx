import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Calendar, User, Share2, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/public/blogs/${slug}`);
        setBlog(response.data);
        document.title = `${response.data.seo_title || response.data.title} | StudyCubs`;
        
        // Fetch related blogs
        const allRes = await axios.get("http://localhost:5000/api/public/blogs");
        setRelatedBlogs(allRes.data.filter((b: any) => b.slug !== slug).slice(0, 3));
      } catch (error) { console.error("Error fetching blog", error); }
      finally { setLoading(false); }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-display text-xl text-primary animate-pulse">Loading Story...</p>
    </div>
  );
  if (!blog) return <div className="min-h-screen flex items-center justify-center">Post not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="pt-24 pb-16">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 h-1 bg-primary z-[60] transition-all" style={{ width: '0%' }} id="reading-progress" />

        {/* Post Header */}
        <header className="container mx-auto px-4 max-w-4xl py-12 text-center">
          <Link to="/blogs" className="inline-flex items-center text-sm font-bold text-primary/60 hover:text-primary transition-all mb-8 group">
            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Journal
          </Link>
          <div className="mb-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              {blog.seo_keywords?.split(',')[0] || 'Education'}
            </Badge>
          </div>
          <h1 className="font-display text-4xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight text-balance">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground font-body bg-muted/30 w-fit mx-auto px-8 py-3 rounded-full border border-border/50">
            <span className="flex items-center gap-2 font-bold text-foreground/80"><User size={16} className="text-primary" /> {blog.author_name}</span>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-2 font-medium"><Calendar size={16} className="text-primary" /> {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Featured Image */}
        {blog.featured_image && (
          <div className="container mx-auto px-4 max-w-6xl mb-20">
            <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-border group">
              <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="container mx-auto px-4 max-w-3xl mb-24">
          <div 
            className="prose prose-xl prose-orange max-w-none font-body text-foreground/80 leading-[1.8]
              prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-tight
              prose-p:mb-8 prose-img:rounded-[2rem] prose-img:shadow-xl
              prose-blockquote:border-l-8 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-8 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic
              prose-strong:text-foreground prose-strong:font-extrabold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          
          <div className="mt-20 pt-12 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {blog.seo_keywords?.split(',').map((tag: string) => (
                <Badge key={tag} variant="outline" className="rounded-full px-5 py-2 border-border/50 bg-muted/20 text-muted-foreground hover:text-primary transition-colors cursor-default">#{tag.trim()}</Badge>
              ))}
            </div>
            <div className="flex gap-4">
               <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-all"><Share2 size={20} /></Button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Stories */}
      {relatedBlogs.length > 0 && (
        <section className="bg-muted/30 py-24 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex justify-between items-end mb-12">
              <div className="text-left">
                <h2 className="font-display text-4xl font-bold mb-2">More Stories</h2>
                <p className="text-muted-foreground font-body">Keep reading about education and growth.</p>
              </div>
              <Link to="/blogs">
                <Button variant="ghost" className="font-bold group">View All <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((b: any) => (
                <Link key={b.id} to={`/blog/${b.slug}`} className="group">
                  <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all h-full">
                    <div className="aspect-video overflow-hidden">
                      <img src={b.featured_image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">{b.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-body">{b.seo_description}</p>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center">Read More <ChevronRight size={14} className="ml-1" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommended Section Placeholder */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="font-display text-3xl font-bold mb-4 text-primary">Join the StudyCubs Community</h2>
          <p className="font-body text-muted-foreground mb-8">Get the latest updates and educational tips delivered to your inbox.</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input placeholder="Enter your email" className="flex-1 p-3 rounded-full border border-border bg-white" />
            <Button className="rounded-full px-8">Subscribe</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogDetail;
