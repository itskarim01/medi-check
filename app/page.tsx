export default function Home() {
  return (
    <>
      <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
        <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-md max-w-300 mx-auto">
          <div className="font-headline-md text-headline-md text-xl text-primary">MediCheck</div>
          <div className="hidden md:flex items-center gap-xl">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#features">Features</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
          </div>
          <div className="flex items-center gap-md">
            <button className="hidden sm:block font-body-md text-body-md text-primary hover:opacity-80 transition-all">Sign In</button>
            <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-bold hover:opacity-90 transition-all">Get Started</button>
          </div>
        </nav>
      </header>
      
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
              <button className="bg-primary text-on-primary px-xl py-md rounded-lg font-headline-md flex items-center justify-center gap-sm hover:opacity-90 transition-all">
                Get Started for Free

              </button>
              <button className="bg-surface border border-outline-variant text-on-surface px-xl py-md rounded-lg font-headline-md hover:bg-surface-container-low transition-all">
                View Demo
              </button>
            </div>
          </div>
          <div className="relative mt-12 lg:mt-0">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-container opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10 bg-white p-2 rounded-2xl border border-outline-variant shadow-xl rotate-2 md:rotate-3">

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
