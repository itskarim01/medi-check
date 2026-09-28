import {ArrowRight, Bell, Users, ShieldHalf, UserPlus, Quote, CheckCircle} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Header & Navbar */}
      <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
        <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-md max-w-300 mx-auto">
          <div className="font-headline-md text-headline-md text-primary">MediCheck</div>
          <div className="hidden md:flex items-center gap-xl">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#features">Features</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
          </div>
          <div className="flex items-center gap-md">
            <Link href="/login">
              <button className="hidden sm:block font-body-md text-body-md text-primary hover:opacity-80 transition-all">Sign In</button>
            </Link>
            <Link href="/register">
              <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-bold hover:opacity-90 transition-all">Get Started</button>
            </Link>
          </div>
        </nav>
      </header>
      
      {/* HERO */}
      <section className="relative overflow-hidden clinical-gradient py-20 md:py-32">
        <div className="max-w-300 mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 items-center gap-xl">
          <div className="z-10 text-center lg:text-left">
            <h1 className="font-headline-lg text-headline-lg md:text-5xl lg:text-6xl mb-md text-on-surface leading-tight">
              Stay on track with your health
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl mx-auto lg:mx-0">
              Never miss a dose again. Our intelligent tracking system ensures your treatment plan stays organized, manageable, and precise.
            </p>
            <div className="flex flex-col sm:flex-row gap-md justify-center lg:justify-start">
              <Link href="/register">
                <button className="bg-primary text-on-primary px-xl py-md rounded-lg font-headline-md flex items-center justify-center gap-sm hover:opacity-90 transition-all">
                  Get Started for Free
                  <ArrowRight className="text-on-primary text-lg" />
                </button>
              </Link>
              <a href="#features">
                <button className="bg-surface border border-outline-variant text-on-surface px-xl py-md rounded-lg font-headline-md hover:bg-surface-container-low transition-all">
                  Learn More
                </button>
              </a>
            </div>
          </div>
          <div className="relative mt-12 lg:mt-0">
            <div className="relative z-10 bg-white p-2 rounded-2xl border border-outline-variant shadow-xl rotate-2 md:rotate-3">
              <img src="/hero.svg" alt="" className="w-full h-full object-cover"/>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-surface" id="features">
        <div className="max-w-300 mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <span className="text-primary font-label-bold tracking-widest uppercase mb-sm block">Precision Care</span>
            <h2 className="font-headline-lg text-headline-lg mb-md text-on-surface">Designed for Reliability</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* <!-- Feature 1 --> */}
            <div className="bg-white p-lg rounded-xl border border-outline-variant card-hover">
              <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-md">
                <Bell className="text-on-surface-variant text-3xl" />
              </div>
              <h3 className="font-headline-md text-headline-md mb-sm text-on-surface">Smart Reminders</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Get notified at the exact right time with intelligent alerts that adapt to your daily routine.
              </p>
            </div>
            {/* <!-- Feature 2 --> */}
            <div className="bg-white p-lg rounded-xl border border-outline-variant card-hover">
              <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-md">
                <Users className="text-on-surface-variant text-3xl"/>
              </div>
              <h3 className="font-headline-md text-headline-md mb-sm text-on-surface">Family Care</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Easily manage and monitor medications for your loved ones from a single, unified dashboard.
              </p>
            </div>
            {/* <!-- Feature 3 --> */}
            <div className="bg-white p-lg rounded-xl border border-outline-variant card-hover">
              <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center mb-md">
                <ShieldHalf className="text-on-surface-variant text-3xl"/>
              </div>
              <h3 className="font-headline-md text-headline-md mb-sm text-on-surface">Secure Data</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Your health information is protected by industry-leading encryption and HIPAA-compliant standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background overflow-hidden" id="how-it-works">
        <div className="max-w-300 mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col lg:flex-row items-center gap-xl">
            <div className="lg:w-1/2">
              <h2 className="font-headline-lg text-headline-lg mb-xl text-on-surface">Start your journey to better health management in minutes.</h2>
              <div className="space-y-lg relative">
                {/* <!-- Step 1 --> */}
                <div className="flex gap-md relative">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-bold z-10">1</div>
                  <div className="pb-12 border-l-2 border-primary-fixed -ml-7.25 pl-12">
                    <h4 className="font-headline-md text-headline-md text-on-surface">Add your meds</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">Scan your prescription or type in your medication details manually.</p>
                  </div>
                </div>
                {/* <!-- Step 2 --> */}
                <div className="flex gap-md relative">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-bold z-10">2</div>
                  <div className="pb-12 border-l-2 border-primary-fixed -ml-7.25 pl-12">
                    <h4 className="font-headline-md text-headline-md text-on-surface">Set your schedule</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">Define times, dosages, and frequency tailored to your treatment plan.</p>
                  </div>
                </div>
                {/* <!-- Step 3 --> */}
                <div className="flex gap-md relative">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-bold z-10">3</div>
                  <div className="pl-5">
                    <h4 className="font-headline-md text-headline-md text-on-surface">Receive notifications</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">Get timely reminders and confirm when you've taken your dose.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="bg-surface-container rounded-3xl p-md border border-outline-variant">
                <img 
                  alt="Medication schedule" 
                  className="rounded-2xl shadow-lg w-full h-100 object-cover" 
                  data-alt="A clean clinical close-up of a organized medication schedule displayed on a high-end tablet screen. The scene includes professional medical tools like a stethoscope and a modern glass water bottle in the blurred background. The lighting is crisp and cool, emphasizing a professional healthcare environment with a dominant palette of soft blues, whites, and teals." 
                  src="/doctor.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Testimonial Section --> */}
      <section className="py-24 bg-primary text-on-primary">
        <div className="max-w-200 mx-auto px-margin-mobile text-center">
          <Quote className="mx-auto size-7 mb-md opacity-30"/>
          <blockquote className="font-headline-lg text-headline-lg mb-xl italic leading-relaxed">
            "Since using MedTracker, I haven't missed a single dose of my blood pressure medication. It's made my life so much easier and my doctor is thrilled with my consistency."
          </blockquote>
          <div className="flex items-center justify-center gap-md">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-on-primary/20">
              <img 
                alt="Satisfied Patient" 
                className="w-full h-full object-cover"
                data-alt="A professional headshot of a middle-aged woman smiling warmly at the camera. She looks healthy and relieved, set against a blurred background of a modern, well-lit medical office. The color palette is bright and trustworthy, with accents of clinical blue and soft neutrals." 
                src="/images/pfp.jpg"
              />
            </div>
            <div className="text-left">
              <p className="font-label-bold text-lg">Sarah Jenkins</p>
              <p className="font-label-sm opacity-80">Patient for 14 months</p>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Secondary CTA Section --> */}
      <section className="py-20 bg-surface">
        <div className="max-w-250 mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <div className="bg-white rounded-4xl p-xl md:p-32 border border-outline-variant shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-secondary"></div>
            <h2 className="font-headline-lg text-headline-lg md:text-5xl mb-md text-on-surface">Ready to simplify your health routine?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl mx-auto">
              Join over 50,000 patients who trust MedTracker to manage their treatment plans with confidence and ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-md justify-center">
              <Link href="/register">
                <button className="bg-primary text-on-primary px-xl py-md rounded-lg font-headline-md hover:opacity-90 transition-all flex items-center justify-center gap-sm">
                  Sign Up Today
                  <UserPlus className="text-on-primary text-lg" />
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-secondary text-on-secondary px-xl py-md rounded-lg font-headline-md hover:opacity-90 transition-all flex items-center justify-center gap-sm">
                  <CheckCircle className="text-on-secondary text-lg" />
                  Mark as Taken
                </button>
              </Link>
            </div>
          </div>
        </div>  
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-300 mx-auto px-margin-mobile md:px-margin-desktop py-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex flex-col items-center md:items-start gap-xs">
            <div className="font-headline-md text-headline-md text-primary">MediCheck</div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">©{new Date().getFullYear()} MediCheck. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-lg">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors" href="#">Privacy Policy</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors" href="#">Cookie Policy</a>
          </div>
          <div className="flex gap-md">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">language</span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">help</span>
          </div>
        </div>
      </footer>
    </>
  );
}
