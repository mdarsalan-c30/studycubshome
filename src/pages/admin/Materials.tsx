import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { 
  Plus, Edit, Trash2, Search, Eye, 
  Settings, Globe, BarChart, FileText,
  Save, X, Check, Upload, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const MaterialManager = () => {
  const [materials, setMaterials] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState({ 
    id: null,
    title: "", 
    slug: "", 
    description: "", 
    content_type: "pdf",
    file_url: "",
    thumbnail_url: "",
    category: "",
    seo_title: "", 
    seo_description: "", 
    seo_keywords: "", 
    status: "draft"
  });

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/materials`);
      setMaterials(response.data);
    } catch (error) { console.error("Error fetching materials", error); }
  };

  useEffect(() => { fetchMaterials(); }, []);

  useEffect(() => {
    if (!currentMaterial.id && currentMaterial.title) {
      const slug = currentMaterial.title.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setCurrentMaterial(prev => ({ ...prev, slug }));
    }
  }, [currentMaterial.title]);

  const handleSave = async () => {
    if (!currentMaterial.title || !currentMaterial.slug || !currentMaterial.file_url) {
      return toast.error("Title, Slug, and File URL are required");
    }
    try {
      const user = JSON.parse(localStorage.getItem("adminUser") || "{}");
      await axios.post(`${API_URL}/api/materials`, {
        ...currentMaterial,
        author_id: user.id
      });
      toast.success("Material saved successfully!");
      setIsEditing(false);
      fetchMaterials();
      setCurrentMaterial({
        id: null,
        title: "", slug: "", description: "", content_type: "pdf",
        file_url: "", thumbnail_url: "", category: "",
        seo_title: "", seo_description: "", seo_keywords: "", status: "draft"
      });
    } catch (error) { toast.error("Save failed"); }
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/api/upload-material`, formData);
      setCurrentMaterial({ ...currentMaterial, file_url: res.data.url });
      toast.success("File uploaded successfully!");
    } catch (error) { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleThumbnailUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`${API_URL}/api/upload`, formData);
      setCurrentMaterial({ ...currentMaterial, thumbnail_url: res.data.url });
      toast.success("Thumbnail uploaded!");
    } catch (error) { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const startEdit = (material: any) => {
    setCurrentMaterial(material);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    try {
      await axios.delete(`${API_URL}/api/materials/${id}`);
      toast.success("Deleted");
      fetchMaterials();
    } catch (error) { toast.error("Delete failed"); }
  };

  if (isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}><X size={18} /></Button>
            <div>
              <h2 className="font-bold text-lg">{currentMaterial.id ? 'Edit Resource' : 'Add New Resource'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 capitalize">{currentMaterial.status}</Badge>
            <Button onClick={handleSave} className="rounded-full px-6 bg-primary hover:bg-primary/90">
              <Save size={18} className="mr-2" /> Save Resource
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4 bg-card p-6 rounded-2xl border border-border">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resource Title</label>
                <Input 
                  value={currentMaterial.title} 
                  onChange={(e) => setCurrentMaterial({...currentMaterial, title: e.target.value})} 
                  placeholder="Enter Title (e.g. 5cs of communication)" 
                  className="text-xl font-bold h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="w-full p-3 border rounded-xl min-h-[150px] text-sm"
                  placeholder="What is this material about? (SEO friendly)"
                  value={currentMaterial.description}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, description: e.target.value})}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-bold text-sm flex items-center gap-2"><Upload size={16} /> Asset Files</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground uppercase font-bold">PDF/PPT File</label>
                    <div className="flex gap-2">
                      <Input value={currentMaterial.file_url} readOnly className="bg-muted text-xs" />
                      <Button variant="outline" onClick={() => document.getElementById('fileInput')?.click()}>
                        {uploading ? '...' : <Upload size={16} />}
                      </Button>
                      <input id="fileInput" type="file" className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={handleFileUpload} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground uppercase font-bold">Thumbnail (Optional)</label>
                    <div className="flex gap-2">
                      <Input value={currentMaterial.thumbnail_url} readOnly className="bg-muted text-xs" />
                      <Button variant="outline" onClick={() => document.getElementById('thumbInput')?.click()}>
                        {uploading ? '...' : <ImageIcon size={16} />}
                      </Button>
                      <input id="thumbInput" type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="w-full bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="settings" className="flex-1 rounded-lg">Details</TabsTrigger>
                <TabsTrigger value="seo" className="flex-1 rounded-lg">SEO</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="space-y-6 mt-4">
                <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Category</label>
                    <Input placeholder="e.g. Communication Skills" value={currentMaterial.category} onChange={(e) => setCurrentMaterial({...currentMaterial, category: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Content Type</label>
                    <select 
                      className="w-full p-2 border rounded-lg text-sm"
                      value={currentMaterial.content_type}
                      onChange={(e) => setCurrentMaterial({...currentMaterial, content_type: e.target.value})}
                    >
                      <option value="pdf">PDF</option>
                      <option value="ppt">PPT</option>
                      <option value="video">Video</option>
                      <option value="notes">Notes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant={currentMaterial.status === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentMaterial({...currentMaterial, status: 'draft'})}>Draft</Button>
                      <Button variant={currentMaterial.status === 'published' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentMaterial({...currentMaterial, status: 'published'})}>Public</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Slug</label>
                    <Input value={currentMaterial.slug} onChange={(e) => setCurrentMaterial({...currentMaterial, slug: e.target.value})} className="h-8 font-mono text-[10px]" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6 mt-4">
                <div className="bg-card p-5 rounded-2xl border border-border space-y-4">
                  <h3 className="font-bold text-sm">Search Engine Optimization</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">SEO Title</label>
                    <Input placeholder="Meta Title" value={currentMaterial.seo_title} onChange={(e) => setCurrentMaterial({...currentMaterial, seo_title: e.target.value})} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">SEO Description</label>
                    <textarea placeholder="Meta Description" className="w-full p-2 border rounded-lg text-xs min-h-[80px]" value={currentMaterial.seo_description} onChange={(e) => setCurrentMaterial({...currentMaterial, seo_description: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Keywords</label>
                    <Input placeholder="Keywords (comma separated)" value={currentMaterial.seo_keywords} onChange={(e) => setCurrentMaterial({...currentMaterial, seo_keywords: e.target.value})} className="h-9 text-xs" />
                  </div>
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
          <h1 className="font-display text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">Resources Library</h1>
          <p className="text-muted-foreground mt-1">Manage educational PPTs, PDFs and study materials.</p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="rounded-full shadow-lg h-12 px-8">
          <Plus size={20} className="mr-2" /> Add New Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m: any) => (
          <div key={m.id} className="group bg-card rounded-3xl border border-border shadow-card hover:shadow-card-hover transition-all overflow-hidden flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center">
              {m.thumbnail_url ? (
                <img src={m.thumbnail_url} className="w-full h-full object-cover" />
              ) : (
                <FileText className="w-12 h-12 text-primary/30" />
              )}
              <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-md uppercase text-[10px]">{m.content_type}</Badge>
              <Badge variant={m.status === 'published' ? 'default' : 'secondary'} className="absolute top-4 left-4">{m.status}</Badge>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{m.title}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{m.description}</p>
              <div className="mt-auto pt-4 flex justify-between items-center border-t border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">{m.category || 'General'}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(m)}><Edit size={14} /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(m.id)}><Trash2 size={14} /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialManager;
