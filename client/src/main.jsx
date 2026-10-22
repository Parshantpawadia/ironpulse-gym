import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDownRight, ArrowRight, Menu, X, Dumbbell, Zap, HeartPulse, MoveUpRight, Check, Instagram, Facebook, Clock3, Users, Flame } from "lucide-react";
import "./styles.css";

const programs = [
  { number: "01", title: "Strength training", tag: "BUILD POWER", text: "Progressive coaching and proven programming to build real-world strength.", icon: Dumbbell, cls: "program-one" },
  { number: "02", title: "HIIT & conditioning", tag: "FIND YOUR EDGE", text: "High-energy sessions that build stamina, speed and mental grit.", icon: Zap, cls: "program-two" },
  { number: "03", title: "Mobility & recovery", tag: "MOVE BETTER", text: "Move freely, recover smarter and stay ready for your next session.", icon: HeartPulse, cls: "program-three" }
];
const trainers = [
  { name: "Marcus Reed", role: "STRENGTH COACH", image: "photo-1567013127542-490d757e51fc", exp: "8 YEARS COACHING" },
  { name: "Ava Mitchell", role: "PERFORMANCE COACH", image: "photo-1534438327276-14e5300c3a48", exp: "HIIT SPECIALIST" },
  { name: "Nina Patel", role: "MOBILITY COACH", image: "photo-1571019613454-1cb2f99b2d8b", exp: "MOVEMENT EXPERT" }
];
const plans = [
  { name: "STARTER", price: "₹1,499", period: "/ month", text: "For building a consistent routine", features: ["Gym floor access", "1 fitness assessment", "Locker access"], featured: false },
  { name: "UNLIMITED", price: "₹2,499", period: "/ month", text: "For the all-in athlete", features: ["Everything in Starter", "Unlimited group classes", "Monthly coach check-in", "Recovery zone access"], featured: true },
  { name: "ELITE", price: "₹4,499", period: "/ month", text: "Personalised progress, faster", features: ["Everything in Unlimited", "2 PT sessions / month", "Custom training roadmap"], featured: false }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", goal: "Build strength", plan: "UNLIMITED" });
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [classes, setClasses] = useState([]);
  const [booking, setBooking] = useState({ name: "", email: "", classId: "strength" });
  const [bookingNotice, setBookingNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetch("/api/classes").then(r => r.ok ? r.json() : []).then(setClasses).catch(() => {}); }, []);
  const updateForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submitEnquiry(e) {
    e.preventDefault(); setBusy(true); setNotice({ type: "", text: "" });
    try {
      const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setNotice({ type: "success", text: data.message }); setForm({ name: "", email: "", goal: "Build strength", plan: "UNLIMITED" });
    } catch (err) { setNotice({ type: "error", text: err.message || "Could not connect to the server. Is the API running?" }); }
    finally { setBusy(false); }
  }
  async function submitBooking(e) {
    e.preventDefault(); setBookingNotice("");
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(booking) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Could not book class.");
      setBookingNotice(data.message); setBooking({ ...booking, name: "", email: "" });
    } catch (err) { setBookingNotice(err.message); }
  }
  const closeMenu = () => setMenuOpen(false);

  return <div className="app">
    <div className="topline"><span><span className="live-dot"></span> NOW ACCEPTING NEW MEMBERS</span><span className="topline-right">YOUR NEXT LEVEL STARTS HERE <ArrowRight size={13}/></span></div>
    <header className="nav wrap">
      <a className="brand" href="#home" onClick={closeMenu}><span className="brand-mark"><Dumbbell size={22}/></span><span>IRON<span className="brand-accent">PULSE</span><small>FITNESS CLUB</small></span></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        <a href="#programs" onClick={closeMenu}>Programs</a><a href="#coaches" onClick={closeMenu}>Our coaches</a><a href="#schedule" onClick={closeMenu}>Class schedule</a><a href="#membership" onClick={closeMenu}>Membership</a>
        <a className="nav-cta" href="#join" onClick={closeMenu}>GET STARTED <ArrowUpRightIcon/></a>
      </nav>
    </header>

    <main>
      <section className="hero wrap" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"></span> MORE THAN A WORKOUT</div>
          <h1>BUILT BY<br/> <span>DISCIPLINE.</span><br/>DEFINED BY <em>YOU.</em></h1>
          <p className="hero-text">A stronger you isn't a someday thing. It's built one rep, one choice, one day at a time. Let's get to work.</p>
          <div className="hero-actions"><a href="#join" className="btn btn-primary">START YOUR JOURNEY <ArrowRight size={17}/></a><a href="#programs" className="text-link">EXPLORE THE CLUB <ArrowDownRight size={16}/></a></div>
          <div className="hero-proof"><div className="avatar-stack"><span>M</span><span>A</span><span>N</span><b>+</b></div><div><strong>1,200+ MEMBERS</strong><small>And counting. Come meet your people.</small></div><div className="proof-divider"></div><div className="rating"><strong>4.9<span> ★★★★★</span></strong><small>MEMBER RATING</small></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo"></div><div className="photo-shade"></div>
          <div className="hero-stamp"><span>NO</span><strong>EXCUSES.</strong><small>JUST PROGRESS.</small></div>
          <div className="vertical-label">TRAIN HARD · LIVE WELL · REPEAT</div>
          <div className="hero-bottom-card"><div className="card-icon"><Flame size={19}/></div><div><strong>SHOW UP. LEVEL UP.</strong><small>Your future self will thank you.</small></div><ArrowDownRight size={21}/></div>
          <div className="hero-number">01 <span>/ 04</span></div>
        </div>
        <div className="hero-bg-word">STRONGER</div>
      </section>

      <section className="ticker" aria-label="Gym values"><div className="ticker-track">{["TRAIN WITH PURPOSE","GET 1% BETTER","NO SHORTCUTS","BUILT TOGETHER","TRAIN WITH PURPOSE","GET 1% BETTER","NO SHORTCUTS","BUILT TOGETHER"].map((t,i)=><span key={i}>{t}<b>✳</b></span>)}</div></section>

      <section className="section wrap" id="programs">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"></span> FIND YOUR FOCUS</div><h2>YOUR GOALS.<br/><span>OUR GAME PLAN.</span></h2></div><p>Whatever your starting point, there's a path forward. Expert coaching, good people and a plan that actually works.</p></div>
        <div className="program-grid">{programs.map(p=><article className={`program-card ${p.cls}`} key={p.number}><div className="program-top"><span>{p.number} / PROGRAM</span><p.icon size={24}/></div><div className="program-art"><div className="art-ring"></div><p.icon size={64} strokeWidth={1.15}/><span className="art-tag">{p.tag}</span></div><div className="program-info"><h3>{p.title}</h3><p>{p.text}</p><a href="#join" aria-label={`Explore ${p.title}`}><ArrowUpRightIcon/></a></div></article>)}</div>
      </section>

      <section className="stats-band"><div className="wrap stats-grid"><div><strong>12<span>+</span></strong><small>EXPERT COACHES</small></div><div><strong>40<span>+</span></strong><small>WEEKLY CLASSES</small></div><div><strong>1.2<span>k</span></strong><small>STRONG COMMUNITY</small></div><div><strong>98<span>%</span></strong><small>WOULD RECOMMEND</small></div></div></section>

      <section className="section wrap coaches-section" id="coaches">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"></span> GOOD PEOPLE. GREAT COACHES.</div><h2>MEET YOUR<br/><span>NEW CORNER.</span></h2></div><p>Real coaching. No ego. Just people who care about helping you get stronger, safer and more confident.</p></div>
        <div className="trainer-grid">{trainers.map((t,i)=><article className="trainer-card" key={t.name}><div className={`trainer-photo trainer-${i}`} style={{backgroundImage:`url(https://images.unsplash.com/${t.image}?auto=format&fit=crop&w=900&q=85)`}}><span className="trainer-index">0{i+1}</span><a href="#join" className="trainer-arrow" aria-label={`Train with ${t.name}`}><ArrowUpRightIcon/></a></div><div className="trainer-info"><div><h3>{t.name}</h3><span>{t.role}</span></div><small>{t.exp}</small></div></article>)}</div>
      </section>

      <section className="schedule-section" id="schedule"><div className="wrap schedule-layout"><div className="schedule-intro"><div className="eyebrow"><span className="eyebrow-line"></span> GET IN THE ROOM</div><h2>YOUR SPOT.<br/><span>YOUR SESSION.</span></h2><p>Good energy is contagious. Book your first class and feel the difference for yourself.</p><div className="schedule-note"><Clock3 size={18}/><span>Arrive 10 minutes early for your first session.</span></div></div><div className="class-list">{(classes.length ? classes : [{id:"strength",name:"Strength Lab",coach:"Marcus Reed",time:"Mon / Wed / Fri · 7:00 AM",level:"All levels",category:"STRENGTH"},{id:"hiit",name:"HIIT & Burn",coach:"Ava Mitchell",time:"Tue / Thu · 6:30 PM",level:"Intermediate",category:"CONDITIONING"},{id:"flow",name:"Mobility Flow",coach:"Nina Patel",time:"Saturday · 9:00 AM",level:"All levels",category:"RECOVERY"}]).map((c,i)=><div className="class-row" key={c.id}><div className="class-index">0{i+1}</div><div className="class-details"><span>{c.category}</span><h3>{c.name}</h3><small>{c.time} · Coach {c.coach}</small></div><div className="class-level">{c.level}</div><button onClick={()=>{setBooking({...booking,classId:c.id});document.getElementById("class-booking").scrollIntoView({behavior:"smooth"});}} className="circle-arrow" aria-label={`Book ${c.name}`}><ArrowRight size={19}/></button></div>)}</div></div>
        <div className="wrap booking-wrap" id="class-booking"><form className="booking-form" onSubmit={submitBooking}><div><span className="mini-label">BOOK A CLASS</span><h3>Save your spot.</h3></div><input required minLength="2" placeholder="Your name" value={booking.name} onChange={e=>setBooking({...booking,name:e.target.value})}/><input required type="email" placeholder="Email address" value={booking.email} onChange={e=>setBooking({...booking,email:e.target.value})}/><select value={booking.classId} onChange={e=>setBooking({...booking,classId:e.target.value})}>{(classes.length ? classes : [{id:"strength",name:"Strength Lab"},{id:"hiit",name:"HIIT & Burn"},{id:"flow",name:"Mobility Flow"}]).map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select><button className="btn btn-primary" type="submit">BOOK MY CLASS <ArrowRight size={16}/></button>{bookingNotice && <p className="form-notice">{bookingNotice}</p>}</form></div>
      </section>

      <section className="section wrap membership-section" id="membership"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"></span> INVEST IN YOURSELF</div><h2>MAKE ROOM<br/><span>FOR STRONG.</span></h2></div><p>No confusing contracts. No pressure. Pick your pace, find your people and start building a routine you love.</p></div>
        <div className="pricing-grid">{plans.map(p=><article className={`price-card ${p.featured ? "featured" : ""}`} key={p.name}>{p.featured && <div className="popular-label">MEMBER FAVOURITE <span>✳</span></div>}<div className="price-head"><span>{p.name} PLAN</span><div className="price">{p.price}<small>{p.period}</small></div><p>{p.text}</p></div><div className="price-features">{p.features.map(f=><div key={f}><Check size={16}/>{f}</div>)}</div><a href="#join" onClick={()=>setForm({...form,plan:p.name})} className={p.featured ? "btn btn-primary full" : "btn btn-outline full"}>CHOOSE {p.name} <ArrowRight size={16}/></a></article>)}</div><p className="pricing-footnote">All plans are illustrative project pricing. Ask our team about student and annual options.</p>
      </section>

      <section className="join-section" id="join"><div className="join-image"></div><div className="join-overlay"></div><div className="wrap join-layout"><div className="join-copy"><div className="eyebrow"><span className="eyebrow-line"></span> YOUR MOVE</div><h2>READY TO<br/>FEEL <em>STRONGER?</em></h2><p>Tell us what you're working toward. We'll help you figure out the best place to start.</p><div className="join-points"><span><Check size={15}/> No-pressure intro</span><span><Check size={15}/> Coach-led guidance</span><span><Check size={15}/> A plan built around you</span></div></div><form className="join-form" onSubmit={submitEnquiry}><div className="form-heading"><span>LET'S MAKE IT HAPPEN</span><h3>Start your story.</h3><p>Drop your details and our team will reach out.</p></div><label>FULL NAME<input required minLength="2" name="name" value={form.name} onChange={updateForm} placeholder="e.g. Alex Sharma"/></label><label>EMAIL ADDRESS<input required type="email" name="email" value={form.email} onChange={updateForm} placeholder="you@example.com"/></label><div className="form-row"><label>YOUR MAIN GOAL<select name="goal" value={form.goal} onChange={updateForm}><option>Build strength</option><option>Improve fitness</option><option>Lose fat sustainably</option><option>Move and recover better</option><option>Build confidence</option></select></label><label>PLAN INTERESTED IN<select name="plan" value={form.plan} onChange={updateForm}>{plans.map(p=><option key={p.name}>{p.name}</option>)}</select></label></div><button className="btn btn-primary full" disabled={busy}>{busy ? "SENDING..." : "REQUEST A FREE INTRO"} <ArrowRight size={17}/></button>{notice.text && <p className={`form-notice ${notice.type}`}>{notice.text}</p>}<small className="privacy-note">By submitting, you agree to be contacted about your enquiry. Demo form only.</small></form></div></section>
    </main>

    <footer className="footer"><div className="wrap footer-top"><a className="brand" href="#home"><span className="brand-mark"><Dumbbell size={22}/></span><span>IRON<span className="brand-accent">PULSE</span><small>FITNESS CLUB</small></span></a><p>Stronger is a direction.<br/>Let's keep moving.</p><div className="socials"><a href="#home" aria-label="Instagram"><Instagram/></a><a href="#home" aria-label="Facebook"><Facebook/></a><a href="#home" aria-label="Back to top"><MoveUpRight/></a></div></div><div className="wrap footer-bottom"><span>© 2026 IRONPULSE FITNESS CLUB</span><span>MADE FOR THE WORK.</span><a href="#home">BACK TO TOP ↑</a></div></footer>
  </div>;
}
function ArrowUpRightIcon(){return <MoveUpRight size={17}/>}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
