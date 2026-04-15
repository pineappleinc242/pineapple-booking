export default function About() {
  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Intro Section */}
        <div className="mb-16 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading tracking-tight">About Us</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We are media professionals dedicated to creating compelling visual content that drives results for your brand.
          </p>
        </div>

        {/* Who We Are Section */}
        <div className="bg-neutral-900 rounded-3xl p-8 md:p-16 shadow-xl border border-neutral-800/60 mb-16 animate-fade-in-scale">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8 font-heading">Who We Are</h2>
            <div className="text-left space-y-6">
              <p className="text-white/70 leading-relaxed text-lg">
                Pineapple Inc. Studios is a premium property media studio focused on photography, video, drone, and floor plans for residential property campaigns.
              </p>
              <p className="text-white/70 leading-relaxed text-lg">
                We exist for agents and vendors who value both presentation and momentum.
              </p>
              <p className="text-white/70 leading-relaxed text-lg">
                Our approach is deliberate: refined visual output, efficient execution, and a service experience designed to feel calm, professional, and dependable from beginning to end.
              </p>
              <p className="text-white/70 leading-relaxed text-lg">
                We believe a property should never feel rushed in how it is presented—but it should never be held back by avoidable delay.
              </p>
            </div>
          </div>
        </div>

        {/* Why Pineapple Inc. Studios Section */}
        <div className="bg-neutral-900 rounded-3xl p-8 md:p-16 shadow-xl border border-neutral-800/60 mb-16 animate-fade-in-scale">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8 font-heading">Why Pineapple Inc. Studios</h2>
            <div className="text-left space-y-6 mb-12">
              <p className="text-white/70 leading-relaxed text-lg">
                Because quality should not come at the cost of accessibility.
              </p>
              <p className="text-white/70 leading-relaxed text-lg">
                Because timing matters.
              </p>
              <p className="text-white/70 leading-relaxed text-lg">
                Because homes deserve to be presented properly.
              </p>
              <p className="text-white/70 leading-relaxed text-lg">
                Because agents and vendors need a media partner who can respond with professionalism, move with efficiency, and deliver with care.
              </p>
              <p className="text-white/70 leading-relaxed text-lg font-medium">
                Pineapple Inc. Studios was designed to be that partner.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-white mb-8 font-heading">Pillars</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <h4 className="text-xl font-bold text-white mb-3">Responsiveness</h4>
                <p className="text-white/70 leading-relaxed">We are structured to move when the property is ready.</p>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-bold text-white mb-3">Refined Presentation</h4>
                <p className="text-white/70 leading-relaxed">Our work is built to elevate perception and support stronger market presence.</p>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-bold text-white mb-3">Professional Process</h4>
                <p className="text-white/70 leading-relaxed">Clear communication, efficient workflow, dependable delivery.</p>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-bold text-white mb-3">Emotional Intelligence</h4>
                <p className="text-white/70 leading-relaxed">We understand that behind every campaign is a person, a family, an investment, or a transition.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <h2 className="text-3xl font-bold text-center text-white mb-10 font-heading">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: '⚡', title: 'Speed', desc: 'Responsive availability and fast market readiness.' },
            { icon: '🎯', title: 'Precision', desc: 'Technical mastery combined with vision.' },
            { icon: '🤝', title: 'Professionalism', desc: 'Calm under pressure, trustworthy partnership.' },
            { icon: '✨', title: 'Premium', desc: 'Elevated presentation that stands out.' }
          ].map((val, idx) => (
            <div key={idx} className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-700">
                <span className="text-2xl">{val.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{val.title}</h3>
              <p className="text-white/70 text-sm">{val.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
