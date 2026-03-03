import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Download, RefreshCw, Shield, Zap, Globe, ArrowRight,
  CheckCircle2, Maximize2, Palette, Type, Layout, Image as ImageIcon,
  AlertCircle, CheckCircle, BarChart3, Users, Rocket, BookOpen,
  Search, Filter, Plus, Send, ChevronRight,
  ExternalLink, TrendingUp, Award, Briefcase
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GEMINI_MODEL_IMAGE = "gemini-2.5-flash-image";
const GEMINI_MODEL_TEXT = "gemini-3-flash-preview";

type View = 'identity' | 'impact' | 'showcase' | 'hub';

// Mock Data for Impact Dashboard
const IMPACT_DATA = [
  { month: 'Jan', trained: 45, funded: 12, projects: 8 },
  { month: 'Feb', trained: 52, funded: 15, projects: 10 },
  { month: 'Mar', trained: 61, funded: 18, projects: 14 },
  { month: 'Apr', trained: 58, funded: 22, projects: 18 },
  { month: 'May', trained: 75, funded: 28, projects: 22 },
  { month: 'Jun', trained: 89, funded: 35, projects: 30 },
];

const SECTOR_DATA = [
  { name: 'AgriTech', value: 35, color: '#2D1B69' },
  { name: 'FinTech', value: 25, color: '#C5A059' },
  { name: 'Health', value: 20, color: '#008080' },
  { name: 'EdTech', value: 20, color: '#5A5A40' },
];

// Mock Data for Showcase
const LEADERS = [
  { id: 1, name: "Dr. Amina Yusuf", role: "Founder, SolarPath", location: "Lagos, Nigeria", bio: "Revolutionizing rural energy access through modular solar grids.", image: "https://picsum.photos/seed/amina/400/500" },
  { id: 2, name: "Sarah Chen", role: "CEO, AquaPure", location: "Nairobi, Kenya", bio: "AI-driven water purification systems for urban settlements.", image: "https://picsum.photos/seed/sarah/400/500" },
  { id: 3, name: "Elena Rodriguez", role: "CTO, FarmConnect", location: "Accra, Ghana", bio: "Blockchain supply chain solutions for smallholder cocoa farmers.", image: "https://picsum.photos/seed/elena/400/500" },
  { id: 4, name: "Zainab Mbeki", role: "Director, EduFuture", location: "Johannesburg, SA", bio: "Scaling digital literacy for girls in underserved communities.", image: "https://picsum.photos/seed/zainab/400/500" },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('identity');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-brand-purple flex overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="h-screen bg-white border-r border-brand-purple/5 flex flex-col z-50 relative"
      >
        <div className="p-6 flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-purple/20">
            <span className="text-white font-display font-bold text-sm">WW</span>
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display font-bold tracking-tight text-xl whitespace-nowrap"
            >
              Wonder Women
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            icon={Shield} 
            label="Brand Identity" 
            active={currentView === 'identity'} 
            onClick={() => setCurrentView('identity')} 
            isOpen={isSidebarOpen}
          />
          <NavItem 
            icon={BarChart3} 
            label="Impact Dashboard" 
            active={currentView === 'impact'} 
            onClick={() => setCurrentView('impact')} 
            isOpen={isSidebarOpen}
          />
          <NavItem 
            icon={Users} 
            label="Community Showcase" 
            active={currentView === 'showcase'} 
            onClick={() => setCurrentView('showcase')} 
            isOpen={isSidebarOpen}
          />
          <NavItem 
            icon={Rocket} 
            label="Innovation Hub" 
            active={currentView === 'hub'} 
            onClick={() => setCurrentView('hub')} 
            isOpen={isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-brand-purple/5">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full p-3 rounded-xl hover:bg-brand-purple/5 flex items-center justify-center transition-colors"
          >
            <RefreshCw className={cn("w-5 h-5 text-brand-purple/40 transition-transform", !isSidebarOpen && "rotate-180")} />
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {currentView === 'identity' && <IdentityView key="identity" />}
          {currentView === 'impact' && <ImpactView key="impact" />}
          {currentView === 'showcase' && <ShowcaseView key="showcase" />}
          {currentView === 'hub' && <HubView key="hub" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-Views ---

function IdentityView() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subView, setSubView] = useState<'generator' | 'styleguide'>('generator');

  const generateLogo = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `Design a sleek, modern, professional logo for a women-led social impact initiative named "Wonder Women". Style: minimalist, tech-forward, premium. Symbol: interlocking W letters forming an abstract rising shape. Colors: deep royal purple (#2D1B69), elegant gold (#C5A059). White background. Vector style, flat design.`;
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL_IMAGE,
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } },
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
      else throw new Error("Generation failed");
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (!imageUrl) generateLogo(); }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 md:p-12 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-purple/40 mb-2">Brand Identity System</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Visual Foundation</h1>
        </div>
        <div className="flex bg-white rounded-full p-1 border border-brand-purple/5 premium-shadow">
          <button 
            onClick={() => setSubView('generator')}
            className={cn("px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all", subView === 'generator' ? "bg-brand-purple text-white" : "text-brand-purple/40 hover:text-brand-purple")}
          >
            Generator
          </button>
          <button 
            onClick={() => setSubView('styleguide')}
            className={cn("px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all", subView === 'styleguide' ? "bg-brand-purple text-white" : "text-brand-purple/40 hover:text-brand-purple")}
          >
            Style Guide
          </button>
        </div>
      </div>

      {subView === 'generator' ? (
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-6xl font-display font-bold leading-[0.9] tracking-tighter">
              Crafting <br /> <span className="text-brand-gold italic font-serif font-normal">Excellence.</span>
            </h2>
            <p className="text-brand-purple/60 leading-relaxed max-w-md">
              Our identity is built on the intersection of technology and human impact. Use the AI generator to explore variations of our core visual mark.
            </p>
            <button 
              onClick={generateLogo}
              disabled={loading}
              className="bg-brand-purple text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-brand-purple/90 transition-all disabled:opacity-50 shadow-xl shadow-brand-purple/20"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Synthesizing..." : "Regenerate Identity"}
            </button>
          </div>

          <div className="aspect-square bg-white rounded-[40px] premium-shadow border border-brand-purple/5 flex items-center justify-center overflow-hidden relative group">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-brand-gold/20 border-t-brand-purple rounded-full animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-purple/40">Processing...</p>
                </motion.div>
              ) : (
                <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full p-12">
                  {imageUrl && <img src={imageUrl} className="w-full h-full object-contain" alt="Logo" />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl premium-shadow border border-brand-purple/5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40 mb-6">Primary Palette</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-purple" />
                  <div className="font-mono text-[10px]">#2D1B69</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-gold" />
                  <div className="font-mono text-[10px]">#C5A059</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 p-8 bg-white rounded-3xl premium-shadow border border-brand-purple/5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40 mb-6">Typography</h3>
              <div className="space-y-4">
                <p className="text-4xl font-display font-bold tracking-tight">Space Grotesk Bold</p>
                <p className="text-2xl font-sans text-brand-purple/60">Inter Regular Body</p>
                <p className="font-mono text-xs text-brand-purple/40 uppercase tracking-widest">JetBrains Mono Utility</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ImpactView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 max-w-7xl mx-auto"
    >
      <div className="mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-purple/40 mb-2">Real-Time Metrics</h2>
        <h1 className="text-4xl font-display font-bold tracking-tight">Impact Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={Users} label="Women Trained" value="2,482" trend="+12%" />
        <StatCard icon={Briefcase} label="Funding Raised" value="$4.2M" trend="+24%" />
        <StatCard icon={Rocket} label="Projects Launched" value="156" trend="+8%" />
        <StatCard icon={Globe} label="Countries Reached" value="18" trend="+2" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] premium-shadow border border-brand-purple/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display font-bold text-xl">Growth Trajectory</h3>
            <select className="bg-brand-purple/5 border-none text-[10px] font-bold uppercase tracking-widest rounded-full px-4 py-2">
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={IMPACT_DATA}>
                <defs>
                  <linearGradient id="colorTrained" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D1B69" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2D1B69" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="trained" stroke="#2D1B69" strokeWidth={3} fillOpacity={1} fill="url(#colorTrained)" />
                <Area type="monotone" dataKey="funded" stroke="#C5A059" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] premium-shadow border border-brand-purple/5">
          <h3 className="font-display font-bold text-xl mb-8">Sector Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SECTOR_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SECTOR_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-4">
            {SECTOR_DATA.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-brand-purple/60">{item.name}</span>
                </div>
                <span className="text-xs font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ShowcaseView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-purple/40 mb-2">Community</h2>
          <h1 className="text-4xl font-display font-bold tracking-tight">Leader Showcase</h1>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-purple/30" />
            <input 
              type="text" 
              placeholder="Search leaders..." 
              className="pl-11 pr-6 py-3 bg-white border border-brand-purple/5 rounded-full text-xs premium-shadow focus:ring-2 ring-brand-purple/10 outline-none w-64"
            />
          </div>
          <button className="p-3 bg-white border border-brand-purple/5 rounded-full premium-shadow hover:bg-brand-purple hover:text-white transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {LEADERS.map((leader) => (
          <motion.div 
            key={leader.id}
            whileHover={{ y: -10 }}
            className="bg-white rounded-[32px] overflow-hidden premium-shadow border border-brand-purple/5 group"
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <img src={leader.image} alt={leader.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                <button className="w-full py-3 bg-white/90 backdrop-blur rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  View Profile <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">{leader.role}</div>
              <h3 className="font-display font-bold text-lg mb-2">{leader.name}</h3>
              <p className="text-xs text-brand-purple/50 leading-relaxed line-clamp-2">{leader.bio}</p>
              <div className="mt-4 pt-4 border-t border-brand-purple/5 flex items-center gap-2 text-[10px] font-bold text-brand-purple/30 uppercase tracking-widest">
                <Globe className="w-3 h-3" /> {leader.location}
              </div>
            </div>
          </motion.div>
        ))}
        <button className="aspect-[4/5] rounded-[32px] border-2 border-dashed border-brand-purple/10 flex flex-col items-center justify-center gap-4 hover:bg-brand-purple/5 transition-all group">
          <div className="w-12 h-12 rounded-full bg-brand-purple/5 flex items-center justify-center group-hover:bg-brand-purple group-hover:text-white transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40">Nominate Leader</span>
        </button>
      </div>
    </motion.div>
  );
}

function HubView() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePitch = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: "Draft a professional 1-minute elevator pitch for this social impact project: " + prompt,
        config: { systemInstruction: "You are a professional venture capital advisor for women entrepreneurs. Your tone is empowering, strategic, and concise." }
      });
      setResult(response.text || "Failed to generate pitch.");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 md:p-12 max-w-5xl mx-auto"
    >
      <div className="mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-purple/40 mb-2">AI Innovation</h2>
        <h1 className="text-4xl font-display font-bold tracking-tight">Innovation Hub</h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-purple text-white p-8 rounded-[40px] shadow-2xl shadow-brand-purple/20 relative overflow-hidden">
            <div className="relative z-10">
              <Award className="w-10 h-10 text-brand-gold mb-6" />
              <h3 className="text-2xl font-display font-bold mb-4">Pitch Assistant</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-8">
                Use our AI-powered advisor to refine your project proposal and craft a globally competitive elevator pitch.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Strategic Framing
                </div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" /> Impact Metrics
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="p-8 bg-white rounded-[40px] premium-shadow border border-brand-purple/5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40 mb-6">Resource Library</h4>
            <div className="space-y-4">
              <ResourceItem icon={BookOpen} title="Funding Guide 2026" />
              <ResourceItem icon={TrendingUp} title="Scaling in Emerging Markets" />
              <ResourceItem icon={Shield} title="Legal for Social Impact" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-[40px] premium-shadow border border-brand-purple/5 h-full flex flex-col">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40">Describe your project</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A mobile app that connects rural female farmers to urban markets in West Africa..."
                  className="w-full h-32 p-6 bg-brand-purple/5 rounded-3xl text-sm outline-none focus:ring-2 ring-brand-purple/10 transition-all resize-none"
                />
              </div>

              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-6 bg-brand-gold/5 border border-brand-gold/20 rounded-3xl"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-4">
                      <Sparkles className="w-3 h-3" /> AI Generated Pitch
                    </div>
                    <p className="text-sm text-brand-purple/80 leading-relaxed italic">"{result}"</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-8 flex gap-4">
              <button 
                onClick={generatePitch}
                disabled={loading || !prompt}
                className="flex-1 bg-brand-purple text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-purple/90 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Refining..." : "Generate Pitch"}
              </button>
              <button className="p-4 bg-brand-purple/5 rounded-2xl hover:bg-brand-purple/10 transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Helper Components ---

function NavItem({ icon: Icon, label, active, onClick, isOpen }: { icon: any, label: string, active: boolean, onClick: () => void, isOpen: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
        active ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" : "text-brand-purple/40 hover:bg-brand-purple/5 hover:text-brand-purple"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", active ? "text-brand-gold" : "group-hover:text-brand-purple")} />
      {isOpen && (
        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">{label}</span>
      )}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, trend }: { icon: any, label: string, value: string, trend: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl premium-shadow border border-brand-purple/5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl bg-brand-purple/5 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-purple" />
        </div>
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/30">{label}</p>
        <p className="text-3xl font-display font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function ResourceItem({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-brand-purple/5 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-brand-purple/40 group-hover:text-brand-purple" />
        <span className="text-xs font-medium">{title}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-brand-purple/20" />
    </div>
  );
}
