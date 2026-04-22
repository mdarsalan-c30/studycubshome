import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { MoreHorizontal, Phone, CheckCircle2, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const EnquiryManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = [
    "new", "contacted", "ringed bell", "no answer", 
    "not interested", "soch ke batayega", "follow up 1", 
    "follow up 2", "others"
  ];

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/enquiries");
      setEnquiries(response.data);
    } catch (error) { console.error("Error fetching enquiries", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("adminUser") || "{}");
      await axios.patch(`http://localhost:5000/api/enquiries/${id}`, { 
        status: newStatus,
        updated_by: user.id 
      });
      toast.success("Status updated");
      fetchEnquiries();
    } catch (error) { toast.error("Failed to update status"); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">New</Badge>;
      case 'contacted': return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Contacted</Badge>;
      case 'not interested': return <Badge variant="destructive">Not Interested</Badge>;
      default: return <Badge variant="outline" className="capitalize">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Leads & Enquiries</h1>
        <p className="font-body text-muted-foreground mt-1 text-sm">Manage student admissions and follow-ups.</p>
      </div>
      
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Parent Details</TableHead>
              <TableHead>Child Info</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead className="w-[200px]">Update Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20">Loading leads...</TableCell></TableRow>
            ) : enquiries.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground">No leads found yet.</TableCell></TableRow>
            ) : (
              enquiries.map((enq: any) => (
                <TableRow key={enq.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {format(new Date(enq.created_at), "dd MMM, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{enq.parent_name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone size={10} /> {enq.phone_number}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">{enq.child_age} Yrs</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{enq.city}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(enq.status)}
                      {enq.updated_by_name && (
                        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                          Updated by: {enq.updated_by_name}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={enq.status} onValueChange={(val) => handleStatusUpdate(enq.id, val)}>
                      <SelectTrigger className="h-8 text-xs rounded-lg">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => (
                          <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EnquiryManager;
