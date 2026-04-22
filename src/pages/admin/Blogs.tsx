import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, Edit, Trash2, Search, Eye, 
  Settings, Globe, BarChart, Image as ImageIcon,
  Save, X, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogEditor from "@/components/admin/BlogEditor";
import { toast } from "sonner";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ 
    id: null,
    title: "", 
    slug: "", 
    content: "", 
    seo_title: "", 
    seo_description: "", 
    seo_keywords: "", 
    status: "draft",
    featured_image: ""
  });

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(response.data);
    } catch (error) { console.error("Error fetching blogs", error); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  useEffect(() => {
    if (!currentBlog.id && currentBlog.title) {
      const slug = currentBlog.title.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setCurrentBlog(prev => ({ ...prev, slug }));
    }
  }, [currentBlog.title]);

  const handleSave = async () => {
    if (!currentBlog.title || !currentBlog.slug) return toast.error("Title and Slug are required");
    try {
      const user = JSON.parse(localStorage.getItem("adminUser") || "{}");
      await axios.post("http://localhost:5000/api/blogs", {
        ...currentBlog,
        author_id: user.id
      });
      toast.success("Blog post saved successfully!");
      setIsEditing(false);
      fetchBlogs();
    } catch (error) { toast.error("Save failed"); }
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      setCurrentBlog({ ...currentBlog, featured_image: res.data.url });
      toast.success("Image uploaded!");
    } catch (error) { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const startEdit = (blog: any) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}><X size={18} /></Button>
            <div>
              <h2 className="font-bold text-lg">{currentBlog.id ? 'Edit Article' : 'Create New Article'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 capitalize">{currentBlog.status}</Badge>
            <Button onClick={handleSave} className="rounded-full px-6 bg-primary hover:bg-primary/90">
              <Save size={18} className="mr-2" /> Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4 bg-card p-6 rounded-2xl border border-border">
              <Input 
                value={currentBlog.title} 
                onChange={(e) => setCurrentBlog({...currentBlog, title: e.target.value})} 
                placeholder="Article Title" 
                className="text-2xl font-bold h-14 border-none focus-visible:ring-0 px-0"
              />
              <BlogEditor 
                content={currentBlog.content} 
                onChange={(html: string) => setCurrentBlog({...currentBlog, content: html})} 
              />
            </div>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="w-full bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="settings" className="flex-1 rounded-lg">General</TabsTrigger>
                <TabsTrigger value="seo" className="flex-1 rounded-lg">SEO</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="space-y-6 mt-4">
                <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
                  <h3 className="font-bold text-sm flex items-center gap-2"><ImageIcon size={16} /> Featured Image</h3>
                  <div 
                    onClick={() => document.getElementById('imageInput')?.click()}
                    className="aspect-video bg-muted rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-all relative overflow-hidden"
                  >
                    {currentBlog.featured_image ? (
                      <img src={currentBlog.featured_image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <Plus size={24} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">{uploading ? 'Uploading...' : 'Upload Image'}</p>
                      </div>
                    )}
                    <input id="imageInput" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>

                <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
                  <h3 className="font-bold text-sm">Publishing</h3>
                  <Input placeholder="Slug" value={currentBlog.slug} onChange={(e) => setCurrentBlog({...currentBlog, slug: e.target.value})} className="h-8 text-xs font-mono" />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant={currentBlog.status === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentBlog({...currentBlog, status: 'draft'})}>Draft</Button>
                    <Button variant={currentBlog.status === 'published' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentBlog({...currentBlog, status: 'published'})}>Public</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6 mt-4">
                <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
                  <h3 className="font-bold text-sm">SEO Tags</h3>
                  <Input placeholder="Meta Title" value={currentBlog.seo_title} onChange={(e) => setCurrentBlog({...currentBlog, seo_title: e.target.value})} className="h-9 text-xs" />
                  <textarea placeholder="Meta Description" className="w-full p-2 border rounded-lg text-xs min-h-[80px]" value={currentBlog.seo_description} onChange={(e) => setCurrentBlog({...currentBlog, seo_description: e.target.value})} />
                  <Input placeholder="Keywords" value={currentBlog.seo_keywords} onChange={(e) => setCurrentBlog({...currentBlog, seo_keywords: e.target.value})} className="h-9 text-xs" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">Blog Library</h1>
        </div>
        <Button onClick={() => setIsEditing(true)} className="rounded-full shadow-lg h-12 px-8">
          <Plus size={20} className="mr-2" /> Write New Article
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog: any) => (
          <div key={blog.id} className="group bg-card rounded-3xl border border-border shadow-card hover:shadow-card-hover transition-all overflow-hidden flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-muted">
              {blog.featured_image && <img src={blog.featured_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
              <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-md">{blog.status}</Badge>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-xl leading-tight mb-4 group-hover:text-primary transition-colors">{blog.title}</h3>
              <div className="mt-auto pt-6 flex justify-between items-center border-t border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">{blog.author_name} • {new Date(blog.created_at).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(blog)}><Edit size={16} /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;
