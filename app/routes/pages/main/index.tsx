import React from 'react';

const SereneRetreatPage = () => {
  return (
    <div className="bg-[#b5bfa5] font-sans text-[#2d2d2d]">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#e6e4d5] px-8 py-4 shadow-md">
        <div className="text-3xl font-semibold">Refine</div>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#">HOME</a>
          <a href="#">RETREATS</a>
          <a href="#">SHOP</a>
          <a href="#">CONTACT</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-[#e6e4d5] py-12 text-center">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 md:grid-cols-3">
          <img src="/beach.jpg" alt="Beach" className="rounded-lg" />
          <img src="/group.jpg" alt="Group" className="rounded-lg" />
          <img src="/field.jpg" alt="Field" className="rounded-lg" />
        </div>
        <p className="mx-auto mt-6 max-w-xl text-sm">
          Embrace self-discovery and connection at Serene, a transformative wellness
          retreat designed exclusively for women...
        </p>
        <button className="mt-6 rounded-full bg-[#d6d3c3] px-6 py-2 text-[#2d2d2d] hover:bg-[#c8c5b5]">
          START NOW
        </button>
      </section>

      {/* Features Section */}
      <section
        className="relative bg-cover bg-center py-16 text-white"
        style={{ backgroundImage: "url('/waves.jpg')" }}
      >
        <div className="mb-6 text-center text-2xl font-semibold">
          Spark Divine Moments
        </div>
        <div className="flex flex-col justify-center gap-6 px-6 md:flex-row">
          {[
            { title: 'Connection', text: 'Surround yourself with supportive women...' },
            { title: 'Healing', text: 'Embark on a transformative journey...' },
            { title: 'Joy', text: 'Reconnect with your inner spark and joy...' },
          ].map((item, idx) => (
            <div key={idx} className="max-w-xs rounded-lg bg-white p-4 text-[#2d2d2d]">
              <h3 className="mb-2 font-bold">{item.title}</h3>
              <p className="text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Retreat Highlight Section */}
      <section className="bg-[#f5f3ea] py-16 text-center">
        <h2 className="mb-8 text-xl font-semibold">Which Serene Retreat calls you?</h2>
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-6 md:flex-row">
          <img
            src="/bali.jpg"
            alt="Full Moon Bali"
            className="w-full rounded-lg md:w-1/2"
          />
          <div className="max-w-md text-left">
            <h3 className="text-lg font-bold">Full Moon Bali</h3>
            <p className="mt-2 text-sm">
              Unleash your inner light under the transformative glow of Bali’s full
              moon...
            </p>
            <button className="mt-4 rounded-full bg-yellow-300 px-5 py-2 hover:bg-yellow-400">
              BOOK NOW
            </button>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-[#b5bfa5] py-12 text-center text-white">
        <h2 className="mb-6 text-xl font-semibold">What's Included in Your Retreat</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {[
            { title: 'DAILY YOGA & MEDITATION', img: '/yoga.jpg' },
            { title: 'SOUND HEALING CEREMONY', img: '/sound.jpg' },
            { title: 'SISTERHOOD CIRCLES', img: '/sisterhood.jpg' },
            { title: 'CULTURAL IMMERSIONS', img: '/culture.jpg' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <img src={item.img} alt={item.title} className="rounded-lg" />
              <h4 className="text-sm font-medium">{item.title}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SereneRetreatPage;
