import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { Plus, UserPlus, Shield, User as UserIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "", full_name: "", role: "writer" });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (error) { console.error("Error fetching users", error); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!newUser.username || !newUser.password) return toast.error("Fill all fields");
    try {
      await axios.post(`${API_URL}/api/users`, newUser);
      toast.success("Staff account created!");
      setIsAdding(false);
      setNewUser({ username: "", password: "", full_name: "", role: "writer" });
      fetchUsers();
    } catch (error) { toast.error("Creation failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm font-body">Create and manage access for Interns and Sales teams.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="rounded-full shadow-lg">
          <UserPlus size={18} className="mr-2" /> Add Staff Member
        </Button>
      </div>

      {isAdding && (
        <div className="bg-card p-6 rounded-2xl border border-primary/20 shadow-playful space-y-4 animate-in fade-in slide-in-from-top-4">
          <h2 className="font-bold text-lg flex items-center gap-2"><Shield className="text-primary" size={20} /> Create New Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Full Name" value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})} />
            <Input placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
            <Input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <Select onValueChange={val => setNewUser({...newUser, role: val})} defaultValue="writer">
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="writer">Content Writer (Intern)</SelectItem>
                <SelectItem value="sales">Sales Team</SelectItem>
                <SelectItem value="admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Generate Credentials</Button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Staff Member</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><UserIcon size={16} /></div>
                    <span className="font-bold">{user.full_name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{user.username}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-destructive"><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManager;
