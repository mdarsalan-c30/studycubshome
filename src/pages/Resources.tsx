import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, FileText, Download, Eye, Filter, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
  view_count: number;
  created_at: string;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: materials, isLoading } = useQuery({
    queryKey: ["public-materials"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/public/materials`);
      return response.data as Material[];
    },
  });

  const categories = ["All", ...new Set(materials?.map((m) => m.category) || [])];

  const filteredMaterials = materials?.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Study <span className="text-primary">Resources</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Explore our collection of PPTs, PDFs, and study notes designed to help you excel in your learning journey.
          </motion.p>

          <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="Search for topics (e.g. 5cs of communication)" 
                className="pl-10 h-12 bg-white border-slate-200 focus:ring-primary shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="whitespace-nowrap rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredMaterials?.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700">No resources found</h3>
              <p className="text-slate-500">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMaterials?.map((m, index) => (
                <AnimatedSection key={m.id} delay={index * 0.1}>
                  <Link to={`/resource/${m.slug}`} className="group block h-full">
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                      <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                        {m.thumbnail_url ? (
                          <img 
                            src={m.thumbnail_url} 
                            alt={m.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <FileText className="w-16 h-16 text-primary/40" />
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-primary font-semibold">
                            {m.content_type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-slate-400">{m.category}</span>
                          <span className="text-slate-200">•</span>
                          <span className="text-xs font-medium text-slate-400">
                            {new Date(m.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {m.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
                          {m.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-4 text-slate-400 text-sm">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" /> {m.view_count || 0}
                            </span>
                          </div>
                          <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                            View Resource <Eye className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
