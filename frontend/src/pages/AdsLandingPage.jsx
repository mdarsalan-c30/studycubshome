import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import useSEO from '../hooks/useSEO';
import './AdsLandingPage.css';

const AdsLandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    city: '',
    notes: ''
  });
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  useSEO({
    title: 'StudyCubs - India\'s Best Public Speaking Platform',
    description: 'StudyCubs empowers children and students aged 5-18+ with expert-led public speaking sessions. Build confidence, communication skills & leadership. Book a free demo today!',
    canonical: 'https://www.studycubs.com/adslanding'
  });

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animated').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToForm = (e) => {
    if (e) e.preventDefault();
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsApp = (e) => {
    if (e) e.preventDefault();
    const phoneNumber = "8147434014"; 
    const message = encodeURIComponent("Hi StudyCubs! I want to enquire about your public speaking classes.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await axios.post('/api/api.php?action=submit_lead', {
        ...formData,
        source: 'Ads Landing Page',
        message: `Age: ${formData.age}, City: ${formData.city}. Notes: ${formData.notes}`
      });
      if (res.data.success) {
        setStatus('success');
        setFormData({ name: '', phone: '', age: '', city: '', notes: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="ads-landing-wrapper">
      
      {/* HERO SECTION */}
      <section id="home" className="hero">
        <div className="blob blob-a"></div>
        <div className="blob blob-b"></div>
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="trust">
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.2 5.26a.56.56 0 0 0 .47.34l5.68.45a.56.56 0 0 1 .32.98l-4.33 3.7a.56.56 0 0 0-.18.55l1.32 5.54a.56.56 0 0 1-.84.61l-4.86-2.97a.56.56 0 0 0-.58 0l-4.86 2.97a.56.56 0 0 1-.84-.61l1.32-5.54a.56.56 0 0 0-.18-.55l-4.33-3.7a.56.56 0 0 1 .32-.98l5.68-.45a.56.56 0 0 0 .47-.34z" fill="currentColor"/>
              </svg>
              <span>4.9★ Rated · Trusted by 1,000+ Parents Across India</span>
            </div>
            <h1>India's <span className="yellow">#1 Platform</span> for Online <span className="yellow">Public Speaking</span> Classes</h1>
            <ul className="checks">
              <li>
                <svg className="icon" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21.8 10.44a10 10 0 1 1-5.35-7.8"/><path d="m9 11 3 3L22 4"/>
                </svg>
                Expert Communication Coaches
              </li>
              <li>
                <svg className="icon" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21.8 10.44a10 10 0 1 1-5.35-7.8"/><path d="m9 11 3 3L22 4"/>
                </svg>
                Small Batches — Max 6 Kids
              </li>
              <li>
                <svg className="icon" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21.8 10.44a10 10 0 1 1-5.35-7.8"/><path d="m9 11 3 3L22 4"/>
                </svg>
                Online Classes, Pan India
              </li>
            </ul>
            <div className="hero-actions">
              <button onClick={scrollToForm} className="btn btn-primary">Book a Free Demo →</button>
              <button onClick={handleWhatsApp} className="btn btn-outline">Chat with StudyCubs Team</button>
            </div>
          </div>
          <div className="hero-visual">
            {/* Right column for visual balance, can add an image here later */}
          </div>
        </div>
      </section>

      <div className="divider-line"><span></span><b></b><span></span></div>

      {/* HOW TO GET STARTED */}
      <div className="animated">
        <section className="how">
          <div className="container">
            <h2 className="section-title">How Would You Like to <span className="yellow">Get Started?</span></h2>
            <div className="start-grid">
              <a href="#demo" onClick={scrollToForm} className="card start-card">
                <div className="start-left">
                  <div className="icon-box icon-primary">
                    <svg className="icon" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46L12 10h8a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46L12 14z"/>
                    </svg>
                  </div>
                  <div>
                    <h3>Book Instantly</h3>
                    <p>Choose a batch, pick a date & start</p>
                  </div>
                </div>
                <span className="pill pill-primary">Start</span>
              </a>
              <a href="#" onClick={handleWhatsApp} className="card start-card">
                <div className="start-left">
                  <div className="icon-box icon-secondary">
                    <svg className="icon" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13.83 16.57a1 1 0 0 0 1.1-.21l1.56-1.56a2 2 0 0 1 2.83 0l2.13 2.13a2 2 0 0 1 0 2.83l-.95.95c-.96.96-2.35 1.34-3.68.98a20 20 0 0 1-14.5-14.5c-.36-1.33.02-2.72.98-3.68l.95-.95a2 2 0 0 1 2.83 0L9.2 4.68a2 2 0 0 1 0 2.83L7.64 9.07a1 1 0 0 0-.21 1.1 12 12 0 0 0 6.4 6.4Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3>Help Me Choose</h3>
                    <p>Our team will guide you to the right program</p>
                  </div>
                </div>
                <span className="pill pill-outline">Callback</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <div className="divider-dots"><span></span><b></b><span></span></div>

      {/* HOW IT WORKS */}
      <div className="animated">
        <section className="steps">
          <div className="container">
            <span className="eyebrow">How It Works</span>
            <h2 className="section-title">Start Speaking in <span className="yellow">Minutes</span></h2>
            <div className="steps-grid">
              <div className="step">
                <div className="num">1</div>
                <h4>Choose Age Group</h4>
                <p>5–12 or 13–18+ years</p>
              </div>
              <div className="step">
                <div className="num">2</div>
                <h4>Pick a Program</h4>
                <p>Loco, Debate, or Custom</p>
              </div>
              <div className="step">
                <div className="num">3</div>
                <h4>Book & Pay</h4>
                <p>Secure checkout</p>
              </div>
              <div className="step">
                <div className="num">4</div>
                <h4>Start Speaking!</h4>
                <p>First class within 48hrs</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="divider-wave">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path d="M0 48h1440V24c-240 20-480-20-720 0S240 4 0 24v24z" fill="hsl(195, 15%, 95%)"/>
        </svg>
      </div>

      {/* PROGRAMS */}
      <div className="animated">
        <section id="programs" className="programs">
          <div className="container">
            <h2 className="section-title">Which Program Is Right for <span className="yellow">Your Child?</span></h2>
            <p style={{textAlign: 'center', color: 'hsl(var(--muted-foreground))', marginBottom: '2.5rem'}}>Browse by category or talk to our program advisors</p>
            <div className="program-grid">
              {[
                { title: 'Storytelling & Narration', desc: 'Build vocabulary, expression, and creative confidence', age: 'Ages 5–9', level: 'Beginner' },
                { title: 'Debates & Discussions', desc: 'Develop critical thinking and persuasive speaking skills', age: 'Ages 10–18', level: 'Intermediate' },
                { title: 'MUN & Competition Prep', desc: 'Intensive training for Model UN, elocution, and oratory contests', age: 'Ages 12–18+', level: 'Advanced' },
                { title: 'Creative Expression', desc: 'Poetry recitation, role-play, and dramatic performances', age: 'All Ages', level: 'Fun' },
              ].map((p, idx) => (
                <div key={idx} className="card program-card">
                  <div className="program-top">
                    <div className="program-icon">
                      <svg className="icon" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>
                      </svg>
                    </div>
                  </div>
                  <div className="program-body">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <div className="tags">
                      <span className="tag">{p.age}</span>
                      <span className="tag">{p.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="advisor">
              <div>
                <h4>Not sure which program?</h4>
                <p>Our advisors can guide you — free consultation</p>
              </div>
              <div className="advisor-actions">
                <a href="tel:+918147434014" className="pill pill-primary">Call Us</a>
                <a href="https://wa.me/8147434014?text=Hi%20StudyCubs!%20I%20want%20to%20enquire%20about%20your%20public%20speaking%20classes." target="_blank" rel="noopener noreferrer" className="pill pill-outline">WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ABOUT SECTION */}
      <div className="animated">
        <section className="super">
          <div className="container">
            <div className="super-grid">
              <div className="super-copy">
                <span className="eyebrow" style={{textAlign: 'left'}}>About StudyCubs</span>
                <h2 className="section-title" style={{textAlign: 'left', marginBottom: '1.5rem'}}>You Focus on Parenting. <span className="yellow">We'll Handle the Speaking Skills.</span></h2>
                <p style={{marginBottom: '1.5rem', fontSize: '1.125rem'}}>StudyCubs is India's leading public speaking and communication platform for children. Our unique methodology blends storytelling, impromptu speaking, debates, and creative expression.</p>
                <div className="points-grid">
                  <div className="point"><b>•</b> 1,000+ Students Trained</div>
                  <div className="point"><b>•</b> 50+ Expert Coaches</div>
                  <div className="point"><b>•</b> 10,000+ Sessions Delivered</div>
                  <div className="point"><b>•</b> Pan India (Online)</div>
                  <div className="point"><b>•</b> 4.9★ Parent Rating</div>
                  <div className="point"><b>•</b> Small Batches (Max 6)</div>
                  <div className="point"><b>•</b> Certificate Included</div>
                </div>
              </div>
              <div className="super-img">
                <div className="img-placeholder">
                  {/* Image: StudyCubs mascot and student */}
                  <div className="blob blob-c"></div>
                  <div className="visual-card">
                    <div className="visual-top">🏆</div>
                    <div className="visual-body">
                      <strong>10k+ Sessions</strong>
                      <p>Completed Successfully</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* TESTIMONIALS */}
      <div className="animated">
        <section className="reviews">
          <div className="container">
            <span className="eyebrow">Testimonials</span>
            <h2 className="section-title">What <span className="yellow">Families Say</span> About Us</h2>
            <p style={{textAlign: 'center', marginBottom: '3rem'}}>Don't just take our word for it — hear from parents who've seen the magic.</p>
            <div className="testimonial-grid">
              {[
                { name: 'Priya Sharma', city: 'Delhi', quote: '"My daughter was extremely shy. After just 12 sessions, she won the inter-school debate competition! The transformation is unbelievable."' },
                { name: 'Rajesh Patel', city: 'Mumbai', quote: '"The coaches are phenomenal. My son looks forward to every session. His vocabulary and confidence have grown tremendously."' },
                { name: 'Anita Verma', city: 'Bangalore', quote: '"I tried multiple platforms before StudyCubs. The small batch size and personal attention make all the difference. Highly recommend!"' },
                { name: 'Suresh Nair', city: 'Chennai', quote: '"Professional service. The coach arrived on time for every session and engaged my son beautifully. His storytelling has improved so much!"' }
              ].map((t, idx) => (
                <div key={idx} className="card testimonial">
                  <div className="stars">★★★★★</div>
                  <p className="quote">{t.quote}</p>
                  <div>
                    <div className="name">{t.name}</div>
                    <div className="city">{t.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* SUPERCUBS ARCHIVE */}
      <div className="animated">
        <section className="archive">
          <div className="container">
            <span className="eyebrow">Archives</span>
            <h2 className="section-title">Meet Our <span className="yellow">SuperCubs 🏆</span></h2>
            <p style={{textAlign: 'center', marginBottom: '3rem'}}>Celebrating our star students who shine bright on every stage</p>
            <div className="program-grid">
              {[
                { name: 'Saadgee Patodee', role: 'Public Speaking' },
                { name: 'Hraday Waykos', role: 'Public Speaking' },
                { name: 'Shivani Kulkarni', role: 'Public Speaking' },
                { name: 'Swarit', role: 'Public Speaking' }
              ].map((s, idx) => (
                <div key={idx} className="card program-card">
                  <div className="program-top" style={{height: '12rem'}}>
                    <div className="program-icon" style={{fontSize: '3rem'}}>🎓</div>
                  </div>
                  <div className="program-body" style={{textAlign: 'center'}}>
                    <h3>{s.name}</h3>
                    <p className="yellow" style={{fontWeight: '700'}}>{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* DEMO FORM SECTION */}
      <div className="animated">
        <section id="demo" className="demo" ref={formRef}>
          <div className="container">
            <h2 className="section-title">Book Your <span className="yellow">Free Demo</span></h2>
            <p style={{textAlign: 'center', color: 'hsl(var(--muted-foreground))', marginBottom: '2.5rem'}}>Experience our unique methodology firsthand</p>
            
            <div className="form-wrap">
              {status === 'success' ? (
                <div style={{textAlign: 'center', padding: '3rem', background: 'hsl(var(--muted))', borderRadius: '1rem'}}>
                  <strong style={{display: 'block', fontSize: '1.5rem', color: 'hsl(var(--primary))', marginBottom: '0.5rem'}}>Success!</strong>
                  <p>Your demo request has been received. We'll contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div>
                      <label>Parent's Name</label>
                      <input required type="text" placeholder="e.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label>Phone Number</label>
                      <input required type="tel" placeholder="e.g. 9876543210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div>
                      <label>Child's Age</label>
                      <select required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}>
                        <option value="">Select Age</option>
                        <option value="5-8">5 - 8 years</option>
                        <option value="9-12">9 - 12 years</option>
                        <option value="13-15">13 - 15 years</option>
                        <option value="16-18">16 - 18 years</option>
                        <option value="College">College Student</option>
                      </select>
                    </div>
                    <div>
                      <label>City</label>
                      <input required type="text" placeholder="e.g. Pune" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label>Additional Notes (Optional)</label>
                    <textarea rows="3" placeholder="Tell us about your child's speaking goals..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                  </div>
                  <button disabled={status === 'loading'} className="btn btn-primary" style={{width: '100%'}}>
                    {status === 'loading' ? 'Sending...' : 'Request Free Demo Now'}
                  </button>
                  <p className="fine center">We respect your privacy. No spam, ever.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div style={{textAlign: 'center'}}>
            <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Study<span className="yellow">Cubs</span></h3>
            <p>© 2024 StudyCubs Education. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* STICKY CTA */}
      <div className="sticky">
        <div className="container sticky-inner">
          <button onClick={scrollToForm} className="btn btn-primary">Book Demo</button>
          <a href="https://wa.me/8147434014?text=Hi%20StudyCubs!%20I%20want%20to%20enquire%20about%20your%20public%20speaking%20classes." target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>
        </div>
      </div>

    </div>
  );
};

export default AdsLandingPage;
