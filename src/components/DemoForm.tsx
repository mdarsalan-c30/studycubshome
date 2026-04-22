import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const DemoForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ parent_name: "", phone_number: "", child_age: "", city: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/enquiries", formData);
      setSubmitted(true);
      toast.success("Enquiry submitted!");
    } catch (error) { toast.error("Error submitting enquiry"); }
    finally { setLoading(false); }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.id]: e.target.value });

  return (
    <section id="demo" className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-center mb-2">Request a Free Demo</h2>
        {submitted ? (
          <div className="text-center py-12 bg-muted rounded-2xl"><p className="font-bold text-primary">Thank You! 🎉</p></div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-5">
            <input id="parent_name" required placeholder="Name" className="w-full p-2 border rounded-xl" onChange={handleChange} />
            <input id="phone_number" required placeholder="Phone" className="w-full p-2 border rounded-xl" onChange={handleChange} />
            <select id="child_age" required className="w-full p-2 border rounded-xl" onChange={handleChange}>
              <option value="">Age</option>
              {Array.from({ length: 11 }, (_, i) => i + 5).map(age => <option key={age} value={age}>{age}</option>)}
            </select>
            <input id="city" placeholder="City" className="w-full p-2 border rounded-xl" onChange={handleChange} />
            <textarea id="message" placeholder="Message" className="w-full p-2 border rounded-xl" onChange={handleChange} />
            <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-primary text-white">{loading ? "Submitting..." : "Submit"}</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default DemoForm;
