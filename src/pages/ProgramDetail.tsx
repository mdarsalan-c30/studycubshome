import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Clock, Zap, Wallet, Calendar, 
  ArrowRight, CheckCircle2,
  Sparkles, GraduationCap, ShieldCheck, Download,
  Users, BookOpen, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ProgramDetail = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/public/programs/${slug}`);
        setProgram(response.data);
        document.title = `${response.data.title} | StudyCubs Programs`;
      } catch (error) { console.error("Error fetching program", error); }
      finally { setLoading(false); }
    };
    fetchProgram();
  }, [slug]);

  const handleDownloadSyllabus = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="mt-6 font-display text-2xl text-primary font-bold animate-pulse">Designing Your Future...</p>
    </div>
  );

  if (!program) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4 font-display">Program not found</h2>
      <Link to="/"><Button className="rounded-full px-8">Back to Home</Button></Link>
    </div>
  );

  const points = program.overview_points ? program.overview_points.split('\n').filter((p: string) => p.trim() !== '') : [];

  return (
    <div className="min-h-screen bg-background print:bg-white selection:bg-primary/20">
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* Premium Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden print:pt-0 print:pb-10">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-400/5 rounded-full blur-[80px] -z-10" />

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left: Text Content */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="print:hidden flex justify-center lg:justify-start">
                <Link to="/#programs" className="inline-flex items-center text-xs font-bold text-primary bg-primary/10 px-5 py-2 rounded-full hover:bg-primary/20 transition-all border border-primary/20 tracking-widest uppercase">
                  <Star size={14} className="mr-2 fill-current" /> Featured Package
                </Link>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.1] text-balance">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">{program.title}</span> Experience
              </h1>
              
              <p className="text-xl text-muted-foreground font-body leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {program.full_description || program.description}
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-6 print:hidden">
                <Link to="/#demo">
                  <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] bg-primary hover:bg-primary/90 hover:-translate-y-1 transition-all">
                    Enroll Your Child <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-10 h-16 text-lg font-bold border-2 hover:bg-muted"
                  onClick={handleDownloadSyllabus}
                >
                  <Download size={20} className="mr-2" /> Syllabus PDF
                </Button>
              </div>
            </div>

            {/* Right: Premium Image Container */}
            <div className="flex-1 relative print:hidden group">
              <div className="absolute -inset-6 bg-gradient-to-tr from-primary/20 to-orange-400/20 rounded-[4rem] blur-3xl -z-10 animate-bounce-slow" />
              <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white/50 backdrop-blur-sm rotate-1 group-hover:rotate-0 transition-transform duration-700">
                <img 
                  src={program.image_url || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800"} 
                  alt={program.title} 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
              </div>
              {/* Floating Success Card */}
              <div className="absolute -bottom-10 -right-4 bg-white p-6 rounded-[2rem] shadow-2xl border border-border animate-float max-w-[200px] hidden md:block">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"><CheckCircle2 size={16} /></div>
                    <span className="text-xs font-bold uppercase text-muted-foreground">Certified</span>
                 </div>
                 <p className="font-display font-bold text-sm leading-tight">Global Curriculum Standards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glassmorphic Stats Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {[
              { icon: Clock, label: "Duration", val: program.duration || '6 Months', color: "blue" },
              { icon: Zap, label: "Skill Level", val: program.level || 'Beginner', color: "purple" },
              { icon: Users, label: "Batch Size", val: program.batch_size || 'Max 12', color: "orange" },
              { icon: Wallet, label: "Course Fee", val: `₹${program.price}` || '₹2,999', color: "green", highlight: true },
            ].map((stat, i) => (
              <div key={i} className="group relative bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-5 group-hover:scale-110 transition-transform print:hidden`}>
                  <stat.icon size={28} />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <p className={`font-display font-extrabold text-xl md:text-2xl ${stat.highlight ? 'text-primary' : 'text-foreground'}`}>
                  {stat.val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum & Roadmap Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Inside the Package</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">What Your Child <span className="underline decoration-orange-400">Will Master</span></h2>
            </div>

            <div className="relative space-y-12 before:absolute before:left-[31px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary before:to-orange-400 before:hidden md:before:block">
              {points.length > 0 ? points.map((point: string, idx: number) => (
                <div key={idx} className="relative pl-0 md:pl-20 group">
                  {/* Numbering Circle */}
                  <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-2xl bg-white border-4 border-primary/20 items-center justify-center text-xl font-display font-extrabold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-shadow group-hover:border-primary/30">
                    <p className="font-body text-xl font-semibold text-foreground/80 leading-relaxed">
                      {point.trim()}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-muted-foreground italic py-10">Loading curriculum roadmap...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary via-primary to-orange-600 rounded-[3.5rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
           <div className="max-w-2xl mx-auto relative z-10 space-y-8">
              <h3 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">Ready to start the journey?</h3>
              <p className="text-lg text-white/80 font-medium">Join hundreds of happy parents and gift your child the future they deserve.</p>
              <div className="flex flex-wrap justify-center gap-4">
                 <Link to="/#demo">
                   <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-12 h-16 font-bold text-lg shadow-xl">
                      Book A Free Demo
                   </Button>
                 </Link>
                 <a href="tel:+919876543210">
                   <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-12 h-16 font-bold text-lg">
                      Speak To Advisor
                   </Button>
                 </a>
              </div>
           </div>
        </div>
      </section>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default ProgramDetail;
