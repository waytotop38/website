import React from 'react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="bg-white font-sans text-gray-900">
      {/* Navbar */}
      <header className="bg-opacity-80 fixed top-0 left-0 z-50 w-full bg-white shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Refine</h1>
          <nav className="hidden space-x-6 text-sm font-medium md:flex">
            <a href="#" className="hover:text-blue-500">
              Home
            </a>
            <a href="#" className="hover:text-blue-500">
              About
            </a>
            <a href="#" className="hover:text-blue-500">
              Projects
            </a>
            <a href="#" className="hover:text-blue-500">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 h-full w-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="bg-opacity-30 absolute inset-0 flex flex-col items-center justify-center bg-black px-6 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold drop-shadow-md md:text-6xl"
          >
            Powering Brands Through People.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="mt-4 text-lg text-gray-200 md:text-xl"
          >
            사람을 통해 브랜드를 성장시킵니다.
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.h3
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-3xl font-semibold"
          >
            Who We Are
          </motion.h3>
          <motion.p
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-gray-600"
          >
            저희는 제조사와 소비자를 잇는 신뢰 기반의 벤더사입니다. 검증된 인플루언서
            네트워크와 데이터 기반 마케팅 전략을 통해, 제품의 가치를 극대화하고 브랜드의
            성장을 지원합니다. 다양한 유통 채널과 협업을 통해 안정적인 판매망을 구축하며,
            제조사의 니즈에 최적화된 솔루션을 제공합니다.
          </motion.p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-gray-50 py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.h3
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center text-3xl font-semibold"
          >
            Featured Projects
          </motion.h3>
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="overflow-hidden rounded-xl bg-white shadow-md"
              >
                <img
                  src={`/balls/ball${i + 1}.png`}
                  alt={`Project ${i + 1}`}
                  className="h-60 w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="mb-2 font-semibold">Project Title {i + 1}</h4>
                  <p className="text-sm text-gray-600">
                    Brief description of the project goes here. Something sleek and
                    modern.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 text-center text-white">
        <p className="text-sm text-gray-400">© 2025 Refine. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
