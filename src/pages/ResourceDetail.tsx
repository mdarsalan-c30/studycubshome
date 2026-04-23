import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Share2, ArrowLeft, Calendar, User, Tag, ChevronRight, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoForm from "@/components/DemoForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AnimatedSection from "@/components/AnimatedSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Material {
  id: number;
  title: string;
  slug: string;
  description: string;
  content_type: string;
  file_url: string;
  thumbnail_url: string;
  category: string;
  author_name: string;
  view_count: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
}

const ResourceDetail = () => {
  const { slug } = useParams();
  const [showFullPreview, setShowFullPreview] = useState(false);

  const { data: material, isLoading, error } = useQuery({
    queryKey: ["material", slug],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/public/materials/${slug}`);
      return response.data as Material;
    },
  });

  useEffect(() => {
    if (material) {
      document.title = material.seo_title || `${material.title} | StudyCubs Resources`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", material.seo_description || material.description);
      }
    }
  }, [material]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !material) return <div className="min-h-screen flex items-center justify-center">Resource not found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/resources" className="hover:text-primary">Resources</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium truncate">{material.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Preview & Content */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                  {material.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(material.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {material.author_name || "StudyCubs Team"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {material.category}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {material.view_count || 0} Views
                  </div>
                </div>

                {/* Preview Window */}
                <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl mb-10 aspect-[4/3] md:aspect-video">
                  <iframe 
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(material.file_url)}&embedded=true`}
                    className="w-full h-full border-none"
                    title="Material Preview"
                  />
                  
                  {!showFullPreview && (
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent flex flex-col items-center justify-end pb-12 px-6 text-center">
                      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-primary/20 shadow-2xl max-w-sm">
                        <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Want the full resource?</h3>
                        <p className="text-slate-600 mb-6">Register your interest to download high-quality PPTs and PDFs for free!</p>
                        <Button 
                          onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                          className="w-full rounded-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                        >
                          Request Access
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="prose prose-slate max-w-none">
                  <h2 className="text-2xl font-bold mb-4">About this resource</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {material.description}
                  </p>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Column: Lead Gen & Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Download Card */}
                <div className="bg-primary text-white rounded-3xl p-8 shadow-xl shadow-primary/20 overflow-hidden relative">
                  <div className="relative z-10">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none mb-4">
                      {material.content_type.toUpperCase()}
                    </Badge>
                    <h3 className="text-2xl font-bold mb-4">Ready to excel?</h3>
                    <p className="text-primary-foreground/80 mb-6">
                      Download this material and get access to our complete library of educational content.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button 
                        variant="secondary" 
                        className="w-full h-12 rounded-xl font-bold text-primary hover:bg-white"
                        onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Now
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 rounded-xl font-bold border-white/30 text-white hover:bg-white/10"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" /> Share with Friends
                      </Button>
                    </div>
                  </div>
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                </div>

                {/* Lead Form */}
                <div id="demo-section" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold mb-4">Get Expert Guidance</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Fill the form below and our team will guide you on how to make the most of these resources.
                  </p>
                  <DemoForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourceDetail;
