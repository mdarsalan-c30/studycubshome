import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { 
  BookOpen, Mic, Users, Trophy, Sparkles, 
  ChevronRight, Clock, Users as UsersIcon, Calendar, Phone,
  CheckCircle2, ArrowRight, Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const iconMap: any = {
  Mic: Mic,
  Users: Users,
  Trophy: Trophy,
  Sparkles: Sparkles,
  Book: BookOpen
};

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/programs`);
        setPrograms(response.data);
      } catch (error) { console.error("Error fetching programs", error); }
      finally { setLoading(false); }
    };
    fetchPrograms();
  }, []);

  return (
    <section id="programs" className="py-24 bg-[#f8fafc] overflow-hidden relative">
      {/* Decorative BG */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full font-bold text-xs mb-6 tracking-widest uppercase">
            <Star size={14} className="fill-current" /> Premium Learning Paths
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Our Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Course Packages</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">
            Choose a specialized package designed by global educators to fast-track your child's growth.
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="relative group">
          <div className="flex gap-8 overflow-x-auto pb-12 pt-4 px-2 no-scrollbar snap-x snap-mandatory scroll-smooth">
            {loading ? (
               [1, 2, 3].map(i => <div key={i} className="min-w-[350px] lg:min-w-[calc(33.33%-22px)] h-[550px] bg-card animate-pulse rounded-[2.5rem]" />)
            ) : (Array.isArray(programs) ? programs : []).length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-20 font-display text-xl italic w-full">Curating new packages. Check back soon!</p>
            ) : (Array.isArray(programs) ? programs : []).map((p: any) => {
              const Icon = iconMap[p.icon_name] || BookOpen;
              return (
                <div key={p.id} className="min-w-[320px] md:min-w-[380px] lg:min-w-[calc(33.33%-22px)] snap-center">
                  <div className="group bg-white rounded-[2.5rem] border border-border shadow-card hover:shadow-[0_40px_80px_-24px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 flex flex-col relative overflow-hidden h-full">
                    {/* Popular Ribbon */}
                    <div className="absolute top-5 right-[-35px] bg-orange-500 text-white text-[10px] font-bold py-1 px-10 rotate-45 z-20 shadow-md">
                      POPULAR
                    </div>

                    {/* Package Preview Image */}
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img 
                        src={p.image_url || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800"} 
                        alt={p.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                           <Icon size={14} /> {p.level || 'Foundational'}
                        </div>
                        <h3 className="font-display font-bold text-2xl">{p.title}</h3>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-4xl font-display font-extrabold text-primary">₹{p.price || '0'}</span>
                        <span className="text-sm text-muted-foreground font-medium">/ full course</span>
                      </div>

                      <div className="space-y-4 mb-8">
                         <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                            <CheckCircle2 size={18} className="text-green-500" /> {p.duration || '6 Months Duration'}
                         </div>
                         <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                            <CheckCircle2 size={18} className="text-green-500" /> {p.batch_size || 'Max 12 Students/Batch'}
                         </div>
                         <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                            <CheckCircle2 size={18} className="text-green-500" /> {p.timing || 'Flexible Evening Batches'}
                         </div>
                      </div>

                      <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-8">
                        {p.description}
                      </p>

                      <div className="mt-auto flex flex-col gap-3">
                        <Link to={`/program/${p.slug}`} className="w-full">
                           <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2 hover:bg-primary/5">
                             View Curriculum
                           </Button>
                        </Link>
                        <a href="#demo" className="w-full">
                           <Button className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                             Enroll Now <ArrowRight size={18} className="ml-2" />
                           </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Subtle scroll indicator for desktop */}
          <div className="hidden lg:flex justify-center gap-2 mt-4">
             <div className="w-8 h-1 bg-primary rounded-full" />
             <div className="w-2 h-1 bg-border rounded-full" />
             <div className="w-2 h-1 bg-border rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
