import React from 'react';

// HERO SECTION
const HeroSection = () => (
  <section
    id="hero"
    className="relative flex min-h-screen flex-col items-center justify-center border-b bg-white px-6 text-center"
  >
    <div className="absolute inset-0 flex">
      <div className="w-full bg-gradient-to-r from-indigo-50 to-white opacity-70"></div>
    </div>
    <div className="relative z-10 mx-auto max-w-2xl">
      <h1 className="mb-6 text-5xl leading-tight font-extrabold tracking-tight text-gray-900 md:text-6xl">
        We discover value <span className="text-indigo-600">&+ We deliver them</span>
      </h1>
      <p className="mx-auto mb-10 max-w-xl text-lg font-medium text-gray-700 md:text-xl">
        Refine은 가치를 발굴하고 전달합니다람쥐.
      </p>
      <a
        href="#how-it-works"
        className="inline-block rounded-full bg-indigo-700 px-8 py-3 text-lg font-bold text-white shadow-md transition hover:bg-indigo-800"
      >
        Get Started
      </a>
    </div>
  </section>
);

// HOW IT WORKS
const HowItWorks = () => (
  <section
    id="how-it-works"
    className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-16 text-center"
  >
    <h2 className="mb-10 text-3xl font-bold md:text-4xl">How It Works</h2>
    <div className="flex w-full max-w-5xl flex-col justify-center gap-10 md:flex-row md:gap-24">
      <div className="flex-1">
        <div className="mb-4 text-5xl font-bold text-indigo-600">1</div>
        <h3 className="mb-3 text-xl font-semibold">물건 내놔</h3>
        <p className="text-gray-600">
          수수료 많이
        </p>
      </div>
      <div className="flex-1">
        <div className="mb-4 text-5xl font-bold text-indigo-600">2</div>
        <h3 className="mb-3 text-xl font-semibold">우리가 연결</h3>
        <p className="text-gray-600">
          우리재량
        </p>
      </div>
      <div className="flex-1">
        <div className="mb-4 text-5xl font-bold text-indigo-600">3</div>
        <h3 className="mb-3 text-xl font-semibold">인플루언서 팜</h3>
        <p className="text-gray-600">
          제발많이팔아줘
        </p>
      </div>
    </div>
  </section>
);

// PROJECT SHOWCASE
const ProjectShowcase = () => (
  <section
    id="projects"
    className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16"
  >
    <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
      Partners
    </h2>
    <div className="grid w-full max-w-5xl gap-8 md:grid-cols-3">
      <div className="flex flex-col items-start rounded-xl bg-gray-50 p-8 shadow-lg">
        <div className="mb-4 rounded-lg bg-indigo-100 p-6 text-3xl font-black text-indigo-600">
          Dr.PawPaw
        </div>
        <h4 className="mb-2 text-lg font-semibold">All-in-one Shampoo</h4>
        <p className="mb-3 text-gray-600">
          Made for all. Organic, healthy, fun.
        </p>
      </div>
      <div className="flex flex-col items-start rounded-xl bg-gray-50 p-8 shadow-lg">
        <div className="mb-4 rounded-lg bg-indigo-100 p-6 text-3xl font-black text-indigo-600">
          Folax
        </div>
        <h4 className="mb-2 text-lg font-semibold">Tech Meets Creator</h4>
        <p className="mb-3 text-gray-600">
          Influencer-led contests boosting engagement across channels.
        </p>
      </div>
      <div className="flex flex-col items-start rounded-xl bg-gray-50 p-8 shadow-lg">
        <div className="mb-4 rounded-lg bg-indigo-100 p-6 text-3xl font-black text-indigo-600">
          K9
        </div>
        <h4 className="mb-2 text-lg font-semibold">Wellness Launch</h4>
        <p className="mb-3 text-gray-600">
          Strategic partnership for a new fitness product line—measurable crowd response.
        </p>
      </div>
    </div>
  </section>
);

// FOOTER
const Footer = () => (
  <footer className="flex flex-col items-center border-t bg-white pt-8 pb-4 text-sm text-gray-500">
    <nav className="mb-4">
      <ul className="flex gap-6">
        <li className="cursor-pointer hover:text-indigo-600">
          <a href="#hero">Home</a>
        </li>
        <li className="cursor-pointer hover:text-indigo-600">
          <a href="#how-it-works">How it Works</a>
        </li>
        <li className="cursor-pointer hover:text-indigo-600">
          <a href="#projects">Projects</a>
        </li>
        <li className="cursor-pointer hover:text-indigo-600">Contact</li>
      </ul>
    </nav>
    <div>&copy; {new Date().getFullYear()} VendorConnect. All rights reserved.</div>
  </footer>
);

// MAIN HOME COMPONENT
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white font-sans">
      {/* Fixed Navbar and Spacer */}
      <header>
        <nav className="fixed top-0 left-0 z-40 w-full border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6 md:py-8">
            <span className="text-2xl font-extrabold tracking-tight text-indigo-900 md:text-3xl">
              Refine
            </span>
            <ul className="flex gap-8 text-lg">
              <li className="transition hover:text-indigo-600">
                <a href="#hero">Home</a>
              </li>
              <li className="transition hover:text-indigo-600">
                <a href="#how-it-works">How it Works</a>
              </li>
              <li className="transition hover:text-indigo-600">
                <a href="#projects">Projects</a>
              </li>
              <li className="transition hover:text-indigo-600">Contact</li>
            </ul>
          </div>
        </nav>
        {/* Spacer: adjust h-20/h-24/h-28 to match nav height */}
        <div className="h-20 md:h-24"></div>
      </header>
      {/* Main Sections */}
      <HeroSection />
      <HowItWorks />
      <ProjectShowcase />
      <Footer />
    </main>
  );
}
