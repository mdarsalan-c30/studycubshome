import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { Plus, Edit, Trash2, BookOpen, MoveUp, MoveDown, Image as ImageIcon, Layout, ListChecks, Clock, Zap, Wallet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProgramManager = () => {
  const [programs, setPrograms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProgram, setCurrentProgram] = useState({ 
    id: null, title: "", description: "", icon_name: "Book", 
    display_order: 0, image_url: "", full_description: "", 
    overview_points: "", duration: "", level: "", timing: "", 
    price: "", slug: "", batch_size: "" 
  });

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/programs`);
      setPrograms(response.data);
    } catch (error) { console.error("Error fetching programs", error); }
  };

  useEffect(() => { fetchPrograms(); }, []);

  // Auto-slug
  useEffect(() => {
    if (!currentProgram.id && currentProgram.title) {
      const slug = currentProgram.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setCurrentProgram(prev => ({ ...prev, slug }));
    }
  }, [currentProgram.title]);

  const handleSave = async () => {
    try {
      if (currentProgram.id) {
        await axios.put(`${API_URL}/api/programs/${currentProgram.id}`, currentProgram);
      } else {
        await axios.post(`${API_URL}/api/programs`, currentProgram);
      }
      toast.success("Program details updated successfully!");
      setIsEditing(false);
      fetchPrograms();
    } catch (error) { toast.error("Save failed"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this program? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/api/programs/${id}`);
      toast.success("Program removed");
      fetchPrograms();
    } catch (error) { toast.error("Delete failed"); }
  };

  if (isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}><Edit size={18} /></Button>
            <h2 className="font-bold text-lg">{currentProgram.id ? "Edit Sales Page" : "Setup New Program"}</h2>
          </div>
          <Button onClick={handleSave} className="rounded-full px-8">Save All Details</Button>
        </div>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="basics" className="rounded-lg">Basics</TabsTrigger>
            <TabsTrigger value="content" className="rounded-lg">Detailed Content</TabsTrigger>
            <TabsTrigger value="stats" className="rounded-lg">Course Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Course Title</label>
                <Input value={currentProgram.title} onChange={e => setCurrentProgram({...currentProgram, title: e.target.value})} placeholder="e.g. Early Explorers" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">URL Slug</label>
                <Input value={currentProgram.slug} onChange={e => setCurrentProgram({...currentProgram, slug: e.target.value})} placeholder="early-explorers" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Icon (Lucide Name)</label>
                <Input value={currentProgram.icon_name} onChange={e => setCurrentProgram({...currentProgram, icon_name: e.target.value})} placeholder="Book, GraduationCap, etc." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Display Order</label>
                <Input type="number" value={currentProgram.display_order} onChange={e => setCurrentProgram({...currentProgram, display_order: parseInt(e.target.value)})} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Short Card Description</label>
                <Input value={currentProgram.description} onChange={e => setCurrentProgram({...currentProgram, description: e.target.value})} placeholder="Appears on cards..." />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 mt-6">
            <div className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><ImageIcon size={14}/> Hero Image URL</label>
                <Input value={currentProgram.image_url} onChange={e => setCurrentProgram({...currentProgram, image_url: e.target.value})} placeholder="https://cloudinary.com/..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Layout size={14}/> Detailed Hero Description</label>
                <textarea className="w-full p-4 border rounded-xl min-h-[120px]" value={currentProgram.full_description} onChange={e => setCurrentProgram({...currentProgram, full_description: e.target.value})} placeholder="Long description for the detail page..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><ListChecks size={14}/> Course Overview (Bullet Points)</label>
                <textarea className="w-full p-4 border rounded-xl min-h-[120px]" value={currentProgram.overview_points} onChange={e => setCurrentProgram({...currentProgram, overview_points: e.target.value})} placeholder="Enter points separated by new lines..." />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Clock size={14}/> Duration</label>
                <Input value={currentProgram.duration} onChange={e => setCurrentProgram({...currentProgram, duration: e.target.value})} placeholder="e.g. 6 Months" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Zap size={14}/> Difficulty Level</label>
                <Input value={currentProgram.level} onChange={e => setCurrentProgram({...currentProgram, level: e.target.value})} placeholder="e.g. Beginner to Intermediate" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Clock size={14}/> Class Timing</label>
                <Input value={currentProgram.timing} onChange={e => setCurrentProgram({...currentProgram, timing: e.target.value})} placeholder="e.g. Mon-Fri (4 PM - 6 PM)" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Users size={14}/> Batch Size</label>
                <Input value={currentProgram.batch_size} onChange={e => setCurrentProgram({...currentProgram, batch_size: e.target.value})} placeholder="e.g. 10 Students Max" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Wallet size={14}/> Course Price / Fees</label>
                <Input value={currentProgram.price} onChange={e => setCurrentProgram({...currentProgram, price: e.target.value})} placeholder="e.g. ₹2,999 / Monthly" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Programs & Courses</h1>
          <p className="text-muted-foreground text-sm">Design and manage your curriculum landing pages.</p>
        </div>
        <Button onClick={() => { setCurrentProgram({ id: null, title: "", description: "", icon_name: "Book", display_order: programs.length, image_url: "", full_description: "", overview_points: "", duration: "", level: "", timing: "", price: "", slug: "", batch_size: "" }); setIsEditing(true); }}>
          <Plus size={18} className="mr-2" /> New Course
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Order</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((prog: any) => (
              <TableRow key={prog.id} className="hover:bg-muted/30">
                <TableCell className="font-bold">#{prog.display_order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">{prog.title[0]}</div>
                    <div>
                      <p className="font-bold">{prog.title}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{prog.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium">{prog.price || 'N/A'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{prog.duration || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setCurrentProgram(prog); setIsEditing(true); }}><Edit size={16} /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(prog.id)}><Trash2 size={16} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProgramManager;
