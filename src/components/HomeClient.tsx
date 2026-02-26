"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParisClock from "@/components/ParisClock";
import LogoSpinner from "@/components/LogoSpinner";
import MiniContactForm from "@/components/MiniContactForm";
import ProjectsSection from "@/components/ProjectsSection";
import PageTransition from "@/components/PageTransition";
import Skills from "@/components/Skills";


export default function HomeClient({ highlightImages }: { highlightImages: { src: string; slug: string; title: string }[] }) {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const busteSection = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    
  }, []);

  return (
    <>
    <PageTransition>
      <Header isUnlocked={isUnlocked} />
      <main className="relative h-screen">
        <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden">
          <div className="text-left hidden md:block">
            <ParisClock />
          </div>
          <div className="z-10">
            <LogoSpinner onUnlock={() => setIsUnlocked(true)} />            
          </div>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
              <div className="md:w-8 md:h-8 w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                <motion.div
                  className="md:w-3 md:h-3 w-2 h-2 rounded-full bg-primary"
                  animate={{ y: [0, window.innerWidth < 768 ? 7 : 9, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
        </section>

        <section className="lg:min-h-screen bg-secondary relative overflow-hidden">

          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="relative z-10 md:pt-14 pt-0">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="lg:mb-15"
            >
              <svg
                className="w-full hidden lg:block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
              >
                <path
                  fill="#212120"
                  fillOpacity="1"
                  d="M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,85.3C672,64,768,64,864,85.3C960,107,1056,149,1152,149.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>

              <div className="bg-primary text-white px-8 md:px-16 py-20 relative overflow-hidden lg:-mt-35">
                <div className="relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl lg:text-7xl mb-8 font-white font-neue-semibold"
                  >
                    I&apos;m Mathys,
                    <br />
                    <span className="font-white font-neue">
                      Junior Developer
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl mb-6 font-white font-neue"
                  >
                    Based in Paris, France
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg max-w-4xl font-white font-neue"
                  >
                    Passionate about web development, internet, and IT in general. Modern, functional, and streamlined design to bring your unique projects to life.                  </motion.p>
                </div>
              </div>
              <svg
                className="w-full hidden lg:block lg:-mt-25" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 1440 320"
              >
                <path 
                  fill="#212120"
                  fillOpacity="1"
                  d="M0,192L48,192C96,192,192,192,288,197.3C384,203,480,213,576,202.7C672,192,768,160,864,138.7C960,117,1056,107,1152,101.3C1248,96,1344,96,1392,96L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                />
              </svg>
            </motion.div>
            </div>
        </section>
        <ProjectsSection images={highlightImages} />
        <Skills />
        <section className="lg:py-20 py-15" id="contact">
            <MiniContactForm />
        </section>

        <Footer />
      </main>
      </PageTransition>
    </>
  );
}
