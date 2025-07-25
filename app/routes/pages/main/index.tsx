import React from 'react';

export default function Home() {
  return (
    <div className="bg-black font-sans text-white">
      {/* Navbar */}
      <header className="bg-opacity-70 fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-black px-8 py-4">
        <div className="text-2xl font-bold">황보찬</div>
        <nav className="space-x-6 text-sm uppercase">
          <a href="#home" className="hover:underline">
            Home
          </a>
          <a href="#about" className="hover:underline">
            About
          </a>
          <a href="#services" className="hover:underline">
            Services
          </a>
          <a href="#contact" className="hover:underline">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex h-screen items-center justify-center bg-black text-center"
        style={{
          backgroundImage: 'url(/balls/ball5.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-opacity-60 rounded bg-black p-6">
          <h1 className="mb-4 text-5xl font-bold">
            황보찬 is 테토남.
          </h1>
          <p className="text-lg text-gray-200">Driven · Focused · Relentless</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-900 px-8 py-24">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h2 className="text-3xl font-semibold">About Me</h2>
          <p className="text-gray-300">
            I'm on a mission to help others break boundaries and thrive. Whether in
            business, life, or personal transformation—your journey starts here.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-800 px-8 py-24">
        <div className="mx-auto max-w-4xl space-y-12 text-center">
          <h2 className="text-3xl font-semibold">What I Offer</h2>
          <div className="grid grid-cols-1 gap-8 text-left text-gray-200 sm:grid-cols-3">
            {['Mindset Coaching', 'Business Strategy', 'Speaking'].map((title, i) => (
              <div
                key={i}
                className="rounded border border-gray-600 p-4 transition hover:border-white"
              >
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-900 px-8 py-24">
        <div className="mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-3xl font-semibold">Let's Connect</h2>
          <p className="text-gray-300">Reach out and let's make magic happen.</p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded border border-gray-600 bg-black px-4 py-2 text-white focus:border-white focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded border border-gray-600 bg-black px-4 py-2 text-white focus:border-white focus:outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full rounded border border-gray-600 bg-black px-4 py-2 text-white focus:border-white focus:outline-none"
            />
            <button className="w-full rounded bg-white py-2 font-semibold text-black transition hover:bg-gray-300">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6 text-center text-sm text-gray-500">
        <p>© 2025 Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
}
