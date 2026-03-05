/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  Maximize2,
  Users,
  Award,
  MapPin,
  Mail,
  ExternalLink,
  PlusCircle,
  Search,
  Filter
} from "lucide-react";

const GEMINI_MODEL = "gemini-2.5-flash-image";

interface Leader {
  id: string;
  name: string;
  role: string;
  category: 'Ambassador' | 'MP' | 'Aspiring';
  location: string;
  bio: string;
  fullBio: string;
  image: string;
  impact: string[];
  socials: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface CommunityProject {
  id: string;
  title: string;
  description: string;
  category: 'Environment' | 'Infrastructure' | 'Employment';
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  impactMetric: string;
  impactValue: string;
  image: string;
  date?: string;
}

const PROJECTS: CommunityProject[] = [
  {
    id: 'street-cleaning',
    title: 'Chingola Clean Streets Initiative',
    description: 'Weekly community-led street cleaning sessions to maintain hygiene and pride in our local neighborhoods.',
    category: 'Environment',
    status: 'Ongoing',
    impactMetric: 'Streets Cleaned',
    impactValue: '42',
    image: 'https://picsum.photos/seed/cleaning/800/600',
    date: 'Every Saturday'
  },
  {
    id: 'paver-roads',
    title: 'Women-Led Paver Road Construction',
    description: 'Empowering local women with masonry and engineering skills to build durable paver roads in residential areas.',
    category: 'Infrastructure',
    status: 'Ongoing',
    impactMetric: 'Meters Built',
    impactValue: '850m',
    image: 'https://picsum.photos/seed/roads/800/600',
    date: 'Mon - Fri'
  },
  {
    id: 'plastic-recycling',
    title: 'Keep Zambia Clean: Plastic Recycling',
    description: 'A district-wide campaign focused on collecting and upcycling plastic waste into useful community products.',
    category: 'Environment',
    status: 'Ongoing',
    impactMetric: 'Plastic Recycled',
    impactValue: '12 Tons',
    image: 'https://picsum.photos/seed/recycling/800/600',
    date: 'Daily Collection'
  },
  {
    id: 'street-jobs',
    title: 'Community Street Jobs Program',
    description: 'Creating immediate employment opportunities for women in street maintenance, landscaping, and public safety.',
    category: 'Employment',
    status: 'Upcoming',
    impactMetric: 'Jobs Created',
    impactValue: '150+',
    image: 'https://picsum.photos/seed/jobs/800/600',
    date: 'Launching April 2026'
  }
];

const LEADERS: Leader[] = [
  {
    id: 'bnell',
    name: 'Bnell',
    role: 'Lead Ambassador & Social Entrepreneur',
    category: 'Ambassador',
    location: 'Chingola, Zambia',
    bio: 'A visionary leader dedicated to grassroots empowerment and sustainable development in the Copperbelt region.',
    fullBio: 'Bnell is a trailblazing social entrepreneur based in Chingola, Zambia. With over a decade of experience in community development, she has spearheaded numerous initiatives aimed at empowering women and youth. Her work focuses on creating sustainable economic models that allow local communities to thrive independently. As the Lead Ambassador for Wonder Women, she serves as a bridge between policy makers and the grassroots, ensuring that the voices of Chingola\'s women are heard at the highest levels.',
    image: 'https://picsum.photos/seed/bnell/800/800',
    impact: ['Community Outreach', 'Youth Mentorship', 'Economic Empowerment', 'Sustainable Development'],
    socials: {
      twitter: 'https://twitter.com/bnell',
      linkedin: 'https://linkedin.com/in/bnell',
      instagram: 'https://instagram.com/bnell_impact'
    }
  },
  {
    id: 'mp-1',
    name: 'Hon. Sarah Mwansa',
    role: 'Member of Parliament',
    category: 'MP',
    location: 'Chingola Central',
    bio: 'Advocating for legislative changes that support women in business and education across the district.',
    fullBio: 'Hon. Sarah Mwansa is a dedicated public servant representing Chingola Central. Her legislative agenda is centered on economic reform and educational equity. She has been instrumental in passing bills that provide micro-grants to women-led startups and has consistently advocated for increased funding for vocational training centers in the Copperbelt. Her leadership is characterized by transparency and a deep commitment to her constituents.',
    image: 'https://picsum.photos/seed/mp1/800/800',
    impact: ['Policy Reform', 'Education Advocacy', 'Infrastructure', 'Economic Equity'],
    socials: {
      facebook: 'https://facebook.com/HonSarahMwansa',
      linkedin: 'https://linkedin.com/in/sarahmwansa'
    }
  },
  {
    id: 'mp-2',
    name: 'Hon. Grace Chilufya',
    role: 'Member of Parliament',
    category: 'MP',
    location: 'Nchanga',
    bio: 'Focused on healthcare accessibility and maternal health initiatives for the women of Chingola.',
    fullBio: 'Hon. Grace Chilufya represents the Nchanga constituency with a focus on social welfare and public health. A former healthcare professional herself, she understands the challenges facing the medical system in Zambia. She has successfully lobbied for the renovation of several local clinics and the implementation of a district-wide maternal health awareness program. Her goal is to ensure that no woman in Chingola lacks access to quality healthcare.',
    image: 'https://picsum.photos/seed/mp2/800/800',
    impact: ['Healthcare', 'Maternal Rights', 'Social Welfare', 'Public Health'],
    socials: {
      twitter: 'https://twitter.com/GraceChilufyaMP',
      facebook: 'https://facebook.com/GraceChilufya'
    }
  },
  {
    id: 'aspiring-1',
    name: 'Chileshe Kapwepwe',
    role: 'Aspiring Community Leader',
    category: 'Aspiring',
    location: 'Chingola',
    bio: 'A dynamic young professional working to bridge the digital divide for rural women in the Copperbelt.',
    fullBio: 'Chileshe Kapwepwe is a rising star in the Chingola community. With a background in Information Technology, she recognized early on that digital literacy is the key to modern economic participation. She founded "TechWomen Chingola," a non-profit that provides free coding and digital marketing workshops to young women. Her ambition is to represent her community in local government and drive a digital-first development agenda.',
    image: 'https://picsum.photos/seed/aspiring1/800/800',
    impact: ['Digital Literacy', 'Rural Development', 'Tech Empowerment'],
    socials: {
      linkedin: 'https://linkedin.com/in/chileshekapwepwe',
      instagram: 'https://instagram.com/chileshe_tech'
    }
  },
  {
    id: 'aspiring-2',
    name: 'Mutale Nkonde',
    role: 'Environmental Advocate',
    category: 'Aspiring',
    location: 'Chingola',
    bio: 'Leading local initiatives for clean water and sustainable mining practices in our community.',
    fullBio: 'Mutale Nkonde is a passionate environmentalist who grew up in the heart of the Copperbelt. Witnessing the environmental impact of mining first-hand, she dedicated her career to advocating for sustainable practices. She works closely with local mining companies to implement better waste management systems and leads community-driven reforestation projects. She believes that Chingola can be both a mining hub and an environmental leader.',
    image: 'https://picsum.photos/seed/aspiring2/800/800',
    impact: ['Sustainability', 'Water Rights', 'Environmental Justice'],
    socials: {
      twitter: 'https://twitter.com/MutaleEco',
      linkedin: 'https://linkedin.com/in/mutalenkonde'
    }
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'hub' | 'projects' | 'brand' | 'profile'>('hub');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const generateLogo = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const prompt = `
        Design a sleek, modern, professional logo for a women-led social impact initiative named "Wonder Women".
        Style: minimalist, tech-forward, premium, corporate-meets-social-impact.
        Symbol: two interlocking W letters forming an abstract rising shape (suggesting growth, empowerment, and collaboration). The mark should subtly resemble wings or an upward graph without being literal.
        Color palette: deep royal purple as primary (#2D1B69), elegant gold accents (#C5A059), clean white background. 
        Typography: The words "WONDER WOMEN" in a bold geometric sans-serif, highly legible, wide tracking, professional NGO/impact funder aesthetic.
        Composition: centered logo on pure white background, strong negative space, vector style, flat design, no gradients, no shadows, no mockups.
        High-end, scalable, brand-ready.
      `;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setImageUrl(`data:image/png;base64,${base64Data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("No image was generated. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while generating the logo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'brand' && !imageUrl) {
      generateLogo();
    }
  }, [activeTab]);

  const handleLeaderClick = (leader: Leader) => {
    setSelectedLeader(leader);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
  };

  const filteredLeaders = filter === 'All' 
    ? LEADERS 
    : LEADERS.filter(l => l.category === filter);

  return (
    <div className="min-h-screen font-sans selection:bg-brand-gold/30">
      {/* Navigation */}
      <nav className="border-b border-brand-purple/5 px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('hub')}>
          <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">WW</span>
          </div>
          <span className="font-display font-bold tracking-tight text-lg">Wonder Women</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6 p-1 bg-brand-purple/5 rounded-full">
          <button 
            onClick={() => setActiveTab('hub')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'hub' ? 'bg-brand-purple text-white shadow-lg' : 'text-brand-purple/60 hover:text-brand-purple'}`}
          >
            Leadership Hub
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'projects' ? 'bg-brand-purple text-white shadow-lg' : 'text-brand-purple/60 hover:text-brand-purple'}`}
          >
            Community Projects
          </button>
          <button 
            onClick={() => setActiveTab('brand')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'brand' ? 'bg-brand-purple text-white shadow-lg' : 'text-brand-purple/60 hover:text-brand-purple'}`}
          >
            Brand Identity
          </button>
        </div>

        <button 
          className="bg-brand-gold text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold/90 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-3 h-3" />
          Join Initiative
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'hub' ? (
            <motion.div 
              key="hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hub Header */}
              <div className="mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/5 border border-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                  <Globe className="w-3 h-3" />
                  Chingola Leadership Network
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold leading-[0.9] tracking-tighter mb-8">
                  The Women Shaping <br />
                  <span className="text-brand-gold italic font-serif font-normal">our Future.</span>
                </h1>
                <p className="text-lg text-brand-purple/70 max-w-2xl leading-relaxed">
                  Connecting Members of Parliament, lead ambassadors, and aspiring changemakers in Chingola to drive collective social impact.
                </p>
              </div>

              {/* Impact Dashboard - Minimalist */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                {[
                  { label: 'Plastic Recycled', value: '12T', icon: RefreshCw },
                  { label: 'Roads Built', value: '850m', icon: MapPin },
                  { label: 'Women Employed', value: '150+', icon: Users },
                  { label: 'Streets Cleaned', value: '42', icon: CheckCircle2 },
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-white rounded-2xl border border-brand-purple/5 premium-shadow">
                    <stat.icon className="w-5 h-5 text-brand-gold mb-4" />
                    <p className="text-3xl font-display font-bold text-brand-purple">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                {['All', 'Ambassador', 'MP', 'Aspiring'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${filter === cat ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white text-brand-purple/60 border-brand-purple/10 hover:border-brand-purple/30'}`}
                  >
                    {cat === 'All' ? 'All Leaders' : cat === 'MP' ? 'Members of Parliament' : `${cat}s`}
                  </button>
                ))}
              </div>

              {/* Leaders Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLeaders.map((leader) => (
                  <motion.div
                    layout
                    key={leader.id}
                    onClick={() => handleLeaderClick(leader)}
                    className="group bg-white rounded-[32px] p-6 premium-shadow border border-brand-purple/5 cursor-pointer hover:border-brand-gold/30 transition-all"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                      <img 
                        src={leader.image} 
                        alt={leader.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[8px] font-bold uppercase tracking-widest text-brand-purple">
                        {leader.category}
                      </div>
                    </div>
                    <h3 className="text-xl font-display font-bold mb-1 group-hover:text-brand-gold transition-colors">{leader.name}</h3>
                    <p className="text-xs font-bold text-brand-purple/40 uppercase tracking-widest mb-4">{leader.role}</p>
                    <div className="flex items-center gap-2 text-xs text-brand-purple/60 mb-6">
                      <MapPin className="w-3 h-3 text-brand-gold" />
                      {leader.location}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {leader.impact.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-brand-purple/5 rounded-md text-[8px] font-bold uppercase tracking-widest text-brand-purple/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="mt-24 p-12 rounded-[40px] bg-brand-purple text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-4xl font-display font-bold mb-6">Are you an aspiring leader in Chingola?</h2>
                  <p className="text-brand-gold/80 mb-8 leading-relaxed">
                    We are looking for passionate women to join our mentorship program and lead local initiatives. Connect with our ambassadors and start your journey today.
                  </p>
                  <button className="bg-white text-brand-purple px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all flex items-center gap-3">
                    Apply to Join
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                  <Users className="w-full h-full" />
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'projects' ? (
            <motion.div 
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Projects Header */}
              <div className="mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/5 border border-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                  <Zap className="w-3 h-3" />
                  Community Action Hub
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold leading-[0.9] tracking-tighter mb-8">
                  Direct Impact <br />
                  <span className="text-brand-gold italic font-serif font-normal">on the Ground.</span>
                </h1>
                <p className="text-lg text-brand-purple/70 max-w-2xl leading-relaxed">
                  Our community projects are designed for and with the female community of Chingola. From infrastructure to environmental preservation, we are building a better city together.
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid md:grid-cols-2 gap-12">
                {PROJECTS.map((project) => (
                  <div key={project.id} className="group bg-white rounded-[40px] overflow-hidden premium-shadow border border-brand-purple/5">
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-purple">
                        {project.category}
                      </div>
                      <div className="absolute bottom-6 right-6 px-4 py-2 bg-brand-purple text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {project.status}
                      </div>
                    </div>
                    <div className="p-10">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-display font-bold mb-2">{project.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-brand-purple/40 font-bold uppercase tracking-widest">
                            <Globe className="w-3 h-3" />
                            {project.date}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-display font-bold text-brand-gold">{project.impactValue}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40">{project.impactMetric}</p>
                        </div>
                      </div>
                      <p className="text-brand-purple/60 leading-relaxed mb-8">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="flex-1 bg-brand-purple text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">
                          Volunteer Now
                        </button>
                        <button className="px-6 py-4 border border-brand-purple/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-brand-purple hover:bg-brand-purple/5 transition-all">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Keep Zambia Clean Campaign Spotlight */}
              <div className="mt-24 p-12 rounded-[40px] bg-brand-gold/5 border border-brand-gold/20 relative overflow-hidden">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-4xl font-display font-bold text-brand-purple mb-6">Keep Zambia Clean Campaign</h2>
                    <p className="text-brand-purple/70 mb-8 leading-relaxed">
                      Our flagship environmental initiative focuses on plastic recycling and waste management education. We believe a clean Chingola is a prosperous Chingola.
                    </p>
                    <div className="space-y-4 mb-8">
                      {[
                        'Daily plastic collection points across Chingola',
                        'Workshops on upcycling plastic into pavers',
                        'Community education on waste segregation',
                        'Partnerships with local recycling centers'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                          <span className="text-sm font-medium text-brand-purple/80">{item}</span>
                        </div>
                      ))}
                    </div>
                    <button className="bg-brand-purple text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">
                      Join the Campaign
                    </button>
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden premium-shadow">
                    <img 
                      src="https://picsum.photos/seed/clean-zambia/800/800" 
                      alt="Keep Zambia Clean" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed - Minimalist */}
              <div className="mt-24">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-purple/40 mb-12">Recent Community Activity</h3>
                <div className="space-y-4">
                  {[
                    { event: 'Street Cleaning Day', location: 'Chingola Central', time: '2 hours ago', icon: CheckCircle2 },
                    { event: 'Paver Training Workshop', location: 'Nchanga Hub', time: '5 hours ago', icon: Users },
                    { event: 'Plastic Collection Drive', location: 'Riverside', time: 'Yesterday', icon: RefreshCw },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-brand-purple/5 premium-shadow">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-brand-purple/5 rounded-xl flex items-center justify-center">
                          <activity.icon className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-purple">{activity.event}</h4>
                          <p className="text-xs text-brand-purple/40">{activity.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/30">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'profile' && selectedLeader ? (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="pb-24"
            >
              {/* Back Button */}
              <button 
                onClick={() => setActiveTab('hub')}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-purple/40 hover:text-brand-purple mb-12 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Leadership Hub
              </button>

              <div className="grid lg:grid-cols-12 gap-16">
                {/* Profile Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="aspect-square rounded-[40px] overflow-hidden premium-shadow border border-brand-purple/5">
                    <img 
                      src={selectedLeader.image} 
                      alt={selectedLeader.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="p-8 bg-white rounded-[32px] premium-shadow border border-brand-purple/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-purple/40 mb-6">Connect</h4>
                    <div className="flex gap-4">
                      {selectedLeader.socials.twitter && (
                        <a href={selectedLeader.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-brand-purple/5 rounded-full hover:bg-brand-purple hover:text-white transition-all">
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {selectedLeader.socials.linkedin && (
                        <a href={selectedLeader.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-brand-purple/5 rounded-full hover:bg-brand-purple hover:text-white transition-all">
                          <Users className="w-4 h-4" />
                        </a>
                      )}
                      {selectedLeader.socials.facebook && (
                        <a href={selectedLeader.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-brand-purple/5 rounded-full hover:bg-brand-purple hover:text-white transition-all">
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {selectedLeader.socials.instagram && (
                        <a href={selectedLeader.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-brand-purple/5 rounded-full hover:bg-brand-purple hover:text-white transition-all">
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-8 bg-brand-purple text-white rounded-[32px] premium-shadow">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold mb-6">Impact Statistics</h4>
                    <div className="space-y-6">
                      <div>
                        <p className="text-3xl font-display font-bold">12+</p>
                        <p className="text-[10px] uppercase tracking-widest opacity-60">Projects Led</p>
                      </div>
                      <div>
                        <p className="text-3xl font-display font-bold">500+</p>
                        <p className="text-[10px] uppercase tracking-widest opacity-60">Women Mentored</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="lg:col-span-8 space-y-16">
                  <section>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                      {selectedLeader.category}
                    </div>
                    <h1 className="text-6xl font-display font-bold tracking-tighter mb-4">{selectedLeader.name}</h1>
                    <p className="text-xl font-bold text-brand-purple/40 uppercase tracking-[0.2em] mb-8">{selectedLeader.role}</p>
                    <div className="flex items-center gap-4 text-sm text-brand-purple/60 mb-12">
                      <MapPin className="w-4 h-4 text-brand-gold" />
                      {selectedLeader.location}
                    </div>
                    
                    <div className="prose prose-brand max-w-none">
                      <h3 className="text-2xl font-display font-bold mb-6">Biography</h3>
                      <p className="text-lg text-brand-purple/70 leading-relaxed mb-8">
                        {selectedLeader.fullBio}
                      </p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-display font-bold mb-8">Key Impact Areas</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {selectedLeader.impact.map((area, i) => (
                        <div key={i} className="p-6 bg-white rounded-2xl border border-brand-purple/5 premium-shadow flex items-start gap-4">
                          <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-purple mb-1">{area}</h4>
                            <p className="text-xs text-brand-purple/50 leading-relaxed">Driving sustainable change through dedicated {area.toLowerCase()} initiatives in the Copperbelt.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="p-10 bg-white rounded-[40px] premium-shadow border border-brand-purple/5">
                    <h3 className="text-2xl font-display font-bold mb-8">Contact {selectedLeader.name.split(' ')[0]}</h3>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40 ml-1">Full Name</label>
                          <input required type="text" className="w-full px-6 py-4 bg-brand-purple/5 border border-transparent rounded-2xl focus:border-brand-gold focus:bg-white transition-all outline-none text-sm" placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40 ml-1">Email Address</label>
                          <input required type="email" className="w-full px-6 py-4 bg-brand-purple/5 border border-transparent rounded-2xl focus:border-brand-gold focus:bg-white transition-all outline-none text-sm" placeholder="jane@example.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-purple/40 ml-1">Message</label>
                        <textarea required rows={4} className="w-full px-6 py-4 bg-brand-purple/5 border border-transparent rounded-2xl focus:border-brand-gold focus:bg-white transition-all outline-none text-sm resize-none" placeholder="How can we collaborate?"></textarea>
                      </div>
                      <button 
                        disabled={formStatus !== 'idle'}
                        className="w-full bg-brand-purple text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {formStatus === 'idle' && (
                          <>
                            <Mail className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                        {formStatus === 'sending' && (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        )}
                        {formStatus === 'sent' && (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Message Sent Successfully
                          </>
                        )}
                      </button>
                    </form>
                  </section>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="brand"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Brand Identity View (Original Content) */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/5 border border-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                    <Shield className="w-3 h-3" />
                    Brand Identity System v1.0
                  </div>
                  <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter mb-8">
                    Empowering <br />
                    <span className="text-brand-gold italic font-serif font-normal">the Future.</span>
                  </h1>
                  <p className="text-lg text-brand-purple/70 max-w-md leading-relaxed mb-10">
                    A minimalist, tech-forward visual identity designed for the next generation of African innovation and global social impact.
                  </p>
                  <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="p-4 rounded-2xl border border-brand-purple/5 bg-white premium-shadow">
                      <Zap className="w-5 h-5 text-brand-gold mb-3" />
                      <h3 className="font-bold text-sm mb-1">Tech-Forward</h3>
                      <p className="text-xs text-brand-purple/50">Clean geometric lines for a digital-first world.</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-brand-purple/5 bg-white premium-shadow">
                      <Globe className="w-5 h-5 text-brand-teal mb-3" />
                      <h3 className="font-bold text-sm mb-1">Global Impact</h3>
                      <p className="text-xs text-brand-purple/50">Universal symbolism of growth and rising.</p>
                    </div>
                  </div>
                  <button 
                    onClick={generateLogo}
                    disabled={loading}
                    className="group flex items-center gap-2 text-sm font-bold border-b-2 border-brand-purple pb-1 hover:border-brand-gold transition-all disabled:opacity-50"
                  >
                    {loading ? "Regenerating..." : "Regenerate Brand Mark"}
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </motion.div>

                <div className="relative">
                  <div className="aspect-square bg-white rounded-[40px] premium-shadow border border-brand-purple/5 flex items-center justify-center overflow-hidden relative group">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div key="loading" className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-brand-gold/20 border-t-brand-purple rounded-full animate-spin" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-purple/40">Synthesizing Identity</p>
                        </motion.div>
                      ) : (
                        <motion.div key="logo" className="w-full h-full p-12 flex flex-col items-center justify-center">
                          {imageUrl && <img src={imageUrl} alt="Logo" className="w-full h-full object-contain" />}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-brand-purple/5 px-6 py-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-purple/40">
            © 2026 Wonder Women Initiative. Chingola Hub.
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-purple/40">
            <a href="#" className="hover:text-brand-purple transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-purple transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-purple transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
