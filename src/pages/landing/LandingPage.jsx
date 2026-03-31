import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Star, Users, Building2, ChevronRight,
  CheckCircle, ArrowRight, Sparkles, HeartHandshake, Clock,
  BarChart3, BookOpen, Zap, Lock, MessageCircle,
} from 'lucide-react';

/* ─── Animated floating dots background ─── */
function FloatingDots() {
  const [dots] = useState(() => 
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      duration: Math.random() * 8 + 6,
      color: ['#00A3FF', '#20C997', '#8B5CF6'][i % 3],
    }))
  );

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {dots.map(dot => (
        <div
          key={dot.id}
          style={{
            position: 'absolute',
            width: dot.size,
            height: dot.size,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            borderRadius: '50%',
            background: dot.color,
            opacity: 0.3,
            animation: `ldFloatDot ${dot.duration}s ${dot.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated stat counter ─── */
function StatCounter({ value, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTs = null;
          const duration = 1800;
          const animate = (ts) => {
            if (!startTs) startTs = ts;
            const progress = Math.min((ts - startTs) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* ─── Main Landing Page ─── */
const BG = '#0D0E1A';
const BLUE = '#00A3FF';
const GREEN = '#20C997';
const PURPLE = '#8B5CF6';
const ORANGE = '#FF8C00';
const RED = '#FF4757';

export default function LandingPage() {
  const navigate = useNavigate();
  const [navScrolled, setNavScrolled] = useState(false);

  /* Force dark background on body while on this page */
  useEffect(() => {
    const prev = document.body.style.background;
    const prevBg = document.body.style.backgroundColor;
    document.body.style.background = BG;
    document.body.style.backgroundColor = BG;
    return () => {
      document.body.style.background = prev;
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* — Data — */
  const features = [
    { icon: Brain,         color: BLUE,   title: 'AI-Powered Matching',    desc: "Our intelligent engine analyses your child's age, needs, and schedule to recommend the perfect daycare or preschool." },
    { icon: BarChart3,     color: GREEN,  title: 'Transparent Metrics',    desc: 'Real-time dashboards show occupancy rates, staff ratios, meal plans, and daily activity reports — all in one place.' },
    { icon: Lock,          color: PURPLE, title: 'Secure & Trusted',       desc: "Every care centre is vetted and verified. Your family's data is end-to-end encrypted and never shared with third parties." },
    { icon: MessageCircle, color: ORANGE, title: 'Direct Messaging',       desc: 'Stay connected with providers through in-app messaging. Get instant daily reports, photos, and milestone updates.' },
    { icon: Clock,         color: RED,    title: 'Flexible Bookings',      desc: 'Book full-time, part-time, or drop-in care in seconds. Manage schedules and payments with zero paperwork.' },
    { icon: HeartHandshake,color: GREEN,  title: 'Community Reviews',      desc: "Read authentic reviews from parents in your community. Make confident decisions backed by real experiences." },
  ];

  const steps = [
    { number: '01', title: 'Create Your Profile',   desc: "Register and tell us about your child — age, dietary needs, learning preferences, and availability." },
    { number: '02', title: 'Explore & Match',        desc: 'Browse AI-curated care centres near you. Compare ratings, capacities, and real-time availability instantly.' },
    { number: '03', title: 'Book with Confidence',  desc: 'Secure a spot in a few taps. Receive daily updates and communicate directly with your provider.' },
  ];

  const userTypes = [
    {
      id: 'parent', icon: Users, color: BLUE,
      title: 'For Parents', subtitle: 'Find & book trusted childcare',
      points: ['AI-curated recommendations', 'Real-time daily reports', 'Direct provider messaging', 'Flexible booking options'],
      cta: 'Get Started as Parent', route: '/login/parent',
    },
    {
      id: 'provider', icon: Building2, color: GREEN,
      title: 'For Providers', subtitle: 'Daycares & Preschools',
      points: ['Manage enrolments at scale', 'AI-driven capacity insights', 'Staff & parent communication', 'Analytics & financial reports'],
      cta: 'Join as Provider', route: '/roles',
    },
  ];

  const testimonials = [
    { text: "ChildCare AI found us the perfect preschool within 10 minutes. The daily reports keep me informed without the constant phone calls.", name: 'Sarah M.', role: 'Parent of 2' },
    { text: "Managing our daycare's enrolments used to take hours. Now it's automated and our parents love the transparency.", name: 'James K.', role: 'Daycare Director' },
    { text: "The AI recommendations were spot-on. It factored in my son's dietary needs and suggested centres with certified nutritionists.", name: 'Priya R.', role: 'Parent of 1' },
  ];

  /* — Shared inline styles — */
  const S = {
    page: {
      minHeight: '100vh',
      background: BG,
      color: '#fff',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflowX: 'hidden',
    },
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: navScrolled ? 'rgba(13,14,26,0.92)' : 'transparent',
      backdropFilter: navScrolled ? 'blur(16px)' : 'none',
      borderBottom: navScrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      transition: 'all 0.3s ease',
    },
    navInner: { maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg, ${BLUE}, #006FDB)`, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logoText: { color: '#fff', fontWeight: 900, fontSize: 16 },
    navLinks: { display: 'flex', alignItems: 'center', gap: 32 },
    navLink: { color: '#cbd5e1', fontSize: 14, fontWeight: 500, textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s' },
    btnPrimary: { background: `linear-gradient(135deg, ${BLUE}, #006FDB)`, color: '#fff', border: 'none', borderRadius: 999, fontWeight: 600, fontSize: 14, padding: '10px 20px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' },
    btnPrimaryLg: { background: `linear-gradient(135deg, ${BLUE}, #006FDB)`, color: '#fff', border: 'none', borderRadius: 999, fontWeight: 700, fontSize: 16, padding: '16px 36px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.2s, box-shadow 0.2s' },
    btnOutlineLg: { background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 999, fontWeight: 700, fontSize: 16, padding: '16px 36px', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: `${BLUE}22`, border: `1px solid ${BLUE}55`, borderRadius: 999, padding: '6px 14px', color: BLUE, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 },
    badgeGreen: { display: 'inline-flex', alignItems: 'center', gap: 6, background: `${GREEN}22`, border: `1px solid ${GREEN}55`, borderRadius: 999, padding: '6px 14px', color: GREEN, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 },
    glassCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 },
    divider: { height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)', margin: '0 64px' },
    gradientText: { background: `linear-gradient(90deg, ${BLUE}, ${GREEN})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
    sectionWrap: { maxWidth: 1280, margin: '0 auto', padding: '96px 24px' },
    sectionTitle: { fontSize: 44, fontWeight: 900, lineHeight: 1.1, marginBottom: 16 },
    sectionSub: { color: '#94a3b8', fontSize: 18, maxWidth: 560, margin: '0 auto 64px', lineHeight: 1.7 },
  };

  return (
    <div style={S.page}>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes ldFloatDot {
          from { transform: translateY(0px) scale(1); opacity: 0.2; }
          to   { transform: translateY(-18px) scale(1.4); opacity: 0.45; }
        }
        @keyframes ldFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ld-fade-up { animation: ldFadeUp 0.7s ease both; }
        .ld-d1 { animation-delay: 0.1s; }
        .ld-d2 { animation-delay: 0.2s; }
        .ld-d3 { animation-delay: 0.3s; }
        .ld-d4 { animation-delay: 0.4s; }
        .ld-card:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 40px rgba(0,163,255,0.12) !important; }
        .ld-navlink:hover { color: #00A3FF !important; }
        .ld-btn-primary:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 25px rgba(0,163,255,0.35) !important; }
        .ld-btn-outline:hover { border-color: rgba(255,255,255,0.5) !important; background: rgba(255,255,255,0.05) !important; }
      `}</style>

      {/* ───────── NAVBAR ───────── */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={S.logo}><span style={S.logoText}>B</span></div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>ChildCare AI</span>
          </div>

          {/* Nav links */}
          <div style={S.navLinks} className="hidden-mobile">
            {[['Features','features'],['How It Works','how-it-works'],['For Providers','for-providers']].map(([label, id]) => (
              <button key={id} onClick={() => scroll(id)} className="ld-navlink" style={S.navLink}>{label}</button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/roles')} className="ld-navlink" style={{ ...S.navLink, padding: '8px 12px' }}>Log in</button>
            <button onClick={() => navigate('/register/parent')} className="ld-btn-primary" style={S.btnPrimary}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ───────── HERO ───────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 80px' }}>
        <FloatingDots />

        {/* Radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${BLUE}1A 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 860, width: '100%' }}>
          {/* Badge */}
          <div className="ld-fade-up" style={S.badge}>
            <Sparkles size={11} /> Now Powered by AI · Trusted by 5,000+ Families
          </div>

          {/* Headline */}
          <h1 className="ld-fade-up ld-d1" style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24 }}>
            Find. Book.<br />
            <span style={S.gradientText}>Trust ChildCare.</span>
          </h1>

          {/* Subheadline */}
          <p className="ld-fade-up ld-d2" style={{ color: '#94a3b8', fontSize: 'clamp(16px, 2vw, 20px)', maxWidth: 600, margin: '0 auto 44px', lineHeight: 1.7 }}>
            A comprehensive AI-powered platform to discover trusted daycares and preschools,
            track your child's daily milestones, and stay connected with providers — all in one place.
          </p>

          {/* CTAs */}
          <div className="ld-fade-up ld-d3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <button onClick={() => navigate('/register/parent')} className="ld-btn-primary" style={S.btnPrimaryLg}>
              Start for Free <ArrowRight size={18} />
            </button>
            <button onClick={() => scroll('how-it-works')} className="ld-btn-outline" style={S.btnOutlineLg}>
              Explore the Platform
            </button>
          </div>

          {/* Trust pills */}
          <div className="ld-fade-up ld-d4" style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap', color: '#64748b', fontSize: 13 }}>
            {['No credit card required', 'Free 30-day trial', 'Cancel anytime'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={13} color={GREEN} /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4 }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6))' }} />
          <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff' }}>Scroll</span>
        </div>
      </section>

      {/* ───────── STATS ───────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', ...S.glassCard, padding: '48px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32 }}>
            <StatCounter value={5000}  suffix="+" label="Families Enrolled" />
            <StatCounter value={320}   suffix="+" label="Verified Care Centres" />
            <StatCounter value={98}    suffix="%" label="Parent Satisfaction" />
            <StatCounter value={12000} suffix="+" label="Bookings Completed" />
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ───────── FEATURES ───────── */}
      <section id="features" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={S.badge}><Zap size={11} /> Platform Features</div>
            <h2 style={S.sectionTitle}>
              Everything You Need,<br /><span style={S.gradientText}>Built in.</span>
            </h2>
            <p style={S.sectionSub}>
              Every feature is built around clarity and trust, giving families unparalleled visibility into their child's care experience.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="ld-card" style={{ ...S.glassCard, padding: 28, transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}22`, border: `1px solid ${f.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Icon size={22} color={f.color} />
                  </div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ───────── HOW IT WORKS ───────── */}
      <section id="how-it-works" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <div style={S.badgeGreen}><BookOpen size={11} /> How It Works</div>
          <h2 style={S.sectionTitle}>
            Getting Started is <span style={S.gradientText}>Simple.</span>
          </h2>
          <p style={{ ...S.sectionSub }}>
            Follow our guided onboarding, find your perfect care match, and see your child thrive.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ fontSize: 72, fontWeight: 900, color: `${BLUE}2A`, lineHeight: 1, marginBottom: 16 }}>{step.number}</div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ───────── FOR EVERY ROLE ───────── */}
      <section id="for-providers" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={S.sectionTitle}>
            One Platform. <span style={S.gradientText}>Every Role.</span>
          </h2>
          <p style={S.sectionSub}>
            Whether you're a parent searching for care, or a provider managing your centre — ChildCare AI is built for you.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {userTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="ld-card" style={{ background: `linear-gradient(135deg, rgba(13,14,26,1) 0%, ${type.color}0D 100%)`, border: `1px solid ${type.color}44`, borderRadius: 28, padding: 36, textAlign: 'left', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: `${type.color}22`, border: `1px solid ${type.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <Icon size={26} color={type.color} />
                  </div>
                  <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 24, marginBottom: 6 }}>{type.title}</h3>
                  <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>{type.subtitle}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {type.points.map((pt, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#cbd5e1', fontSize: 14 }}>
                        <CheckCircle size={14} color={type.color} style={{ flexShrink: 0 }} /> {pt}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate(type.route)}
                    style={{ width: '100%', padding: '14px 20px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg, ${type.color}, ${type.color}CC)`, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {type.cta} <ChevronRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ───────── TESTIMONIALS ───────── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={S.sectionTitle}>
            Trusted by <span style={S.gradientText}>Families</span> Nationwide
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 48 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ ...S.glassCard, padding: 28, textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} fill="#FBBF24" color="#FBBF24" />
                  ))}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${BLUE}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', borderRadius: 32, padding: '80px 40px', background: `linear-gradient(135deg, ${BLUE}22 0%, ${PURPLE}22 100%)`, border: `1px solid ${BLUE}3A`, overflow: 'hidden' }}>
          {/* Glow blobs */}
          <div style={{ position: 'absolute', top: -80, left: -80, width: 240, height: 240, borderRadius: '50%', background: BLUE, opacity: 0.15, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: PURPLE, opacity: 0.15, filter: 'blur(60px)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
              Ready to find the <span style={S.gradientText}>perfect care?</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 17, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
              Join thousands of families who have discovered trusted, verified childcare through ChildCare AI.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register/parent')} className="ld-btn-primary" style={S.btnPrimaryLg}>
                Sign Up Free <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/roles')} className="ld-btn-outline" style={S.btnOutlineLg}>
                Log In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ ...S.logo, width: 32, height: 32 }}><span style={{ ...S.logoText, fontSize: 13 }}>B</span></div>
            <span style={{ color: '#fff', fontWeight: 700 }}>ChildCare AI</span>
          </div>
          <div style={{ display: 'flex', gap: 24, color: '#64748b', fontSize: 13 }}>
            <button onClick={() => navigate('/settings/terms')}   style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>Terms & Conditions</button>
            <button onClick={() => navigate('/settings/privacy')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>Privacy Policy</button>
            <button onClick={() => navigate('/settings/support')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>Help & Support</button>
          </div>
          <div style={{ color: '#334155', fontSize: 13 }}>© {new Date().getFullYear()} ChildCare AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
