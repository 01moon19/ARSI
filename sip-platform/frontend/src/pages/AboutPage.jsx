import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Custom Hook for the Scrolling Number Counters (KPIs)
const AnimatedCounter = ({ from = 0, to, duration = 2, prefix = "", suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (isInView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
      {prefix}{count}{suffix}
    </span>
  );
};

export default function AboutSIP() {
  const { scrollYProgress } = useScroll();
  
  // Parallax effects tied directly to scroll position
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Background Reactive Grid */}
      <motion.div 
        style={{ y: yBg }}
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
      />

      {/* HERO SECTION */}
      <motion.section 
        style={{ opacity: opacityHero, scale: scaleHero }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">SIP.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The Agentic RAG-based Sales Intelligence Platform that turns raw data into closing strategies.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto rounded-full" />
        </motion.div>
      </motion.section>

      {/* DUAL FOCUS SECTION: VALUE VS ARCHITECTURE */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 space-y-40">
        
        {/* Value Proposition (For Sales Teams) */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-200px" }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-sm font-bold tracking-widest text-teal-400 uppercase mb-3">The Sales Advantage</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">Sell Smarter, Not Harder.</h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Empower your sales force with hyper-personalized outreach, real-time objection handling, and predictive deal scoring. SIP acts as an autonomous research assistant for every account executive on your team.
            </p>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-teal-400 rounded-full" /> Automated Lead Enrichment
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-teal-400 rounded-full" /> Contextual Email Drafting
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-teal-400 rounded-full" /> Real-time Call Insights
              </li>
            </ul>
          </div>
          <div className="h-[400px] rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl flex items-center justify-center p-8 relative overflow-hidden group">
            {/* Hover reactive element */}
            <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-slate-500 font-mono text-center">
              [ Insert Value Proposition / Dashboard UI Mockup Here ]
            </p>
          </div>
        </motion.div>

        {/* Technical Architecture (Under the Hood) */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-200px" }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div className="order-2 md:order-1 h-[400px] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center p-8 relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <p className="text-slate-500 font-mono text-center">
              [ Insert ARSI System Architecture Diagram Here ]
            </p>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-3">Under The Hood</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">The ARSI Framework.</h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Built on our proprietary Agentic Retrieval-Augmented Generation for Sales Intelligence (ARSI) framework. SIP doesn't just search data; it reasons, plans, and executes multi-step research workflows autonomously.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h4 className="text-white font-bold mb-2">Semantic Routing</h4>
                <p className="text-sm text-slate-400">Intelligent query classification for precise data retrieval.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h4 className="text-white font-bold mb-2">Agentic Planning</h4>
                <p className="text-sm text-slate-400">LLM-driven orchestration of complex sales pipelines.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </section>

      {/* KPI / ODOMETER SECTION */}
      <section className="relative z-10 py-32 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Quantifiable Impact</h2>
            <p className="text-slate-400 text-xl">Watch the metrics scale as organizations adopt SIP.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Metric 1 */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <AnimatedCounter from={0} to={45} duration={2.5} prefix="+" suffix="%" />
              <p className="text-xl font-medium text-slate-300">Increase in Win Rates</p>
            </div>
            
            {/* Metric 2 */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <AnimatedCounter from={0} to={12} duration={3} prefix="$" suffix="M+" />
              <p className="text-xl font-medium text-slate-300">Pipeline Generated</p>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <AnimatedCounter from={0} to={20} duration={2} suffix=" hrs" />
              <p className="text-xl font-medium text-slate-300">Saved per Rep / Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANIES SECTION (Scroll Reactive Cards) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Who Needs SIP?</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "B2B SaaS", desc: "For navigating complex, multi-stakeholder enterprise deals." },
            { title: "Financial Services", desc: "For deep, compliant research into institutional accounts." },
            { title: "Consulting Firms", desc: "For rapid market mapping and competitive intelligence." }
          ].map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 cursor-pointer"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{company.title}</h3>
              <p className="text-slate-400">{company.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER PADDING */}
      <div className="h-32" />
    </div>
  );
}