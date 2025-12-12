

"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Cube from "@/components/Cube";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cubeImages = [
  "/cube1.png",
  "/cube2.png",
  "/cube3.png",
  "/cube4.png",
  "/cube5.png",
  "/cube1.png",
  "/cube2.png",
  "/cube3.png",
];

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  // Store refs for the 6 desktop cubes
  const cubeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {}); // Initialize empty context

    const initAnimation = () => {
      // Revert previous context if any
      if (ctx) ctx.revert();
      
      ctx = gsap.context(() => {
        if (!mainRef.current || !containerRef.current || !logoRef.current) return;

        const logo = logoRef.current;
        const logoRect = logo.getBoundingClientRect();
        // Calculate center relative to the viewport (which matches the pinned container initially)
        const logoCenterX = logoRect.left + logoRect.width / 2;
        const logoCenterY = logoRect.top + logoRect.height / 2;

        const cubes = cubeRefs.current.filter(Boolean);
        
        // Calculate start offsets strictly
        const moves = cubes.map((cube) => {
          if (!cube) return { x: 0, y: 0 };
          // Get natural position of the cube in the document flow
          const rect = cube.getBoundingClientRect();
          const cubeCenterX = rect.left + rect.width / 2;
          const cubeCenterY = rect.top + rect.height / 2;
          
          return {
            x: logoCenterX - cubeCenterX,
            y: logoCenterY - cubeCenterY
          };
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            end: "+=200%", 
            scrub: 1, // Smooth interaction
            pin: true,
            invalidateOnRefresh: true, // Recalculate on resize
          }
        });

        // 1. Move Page Up
        tl.to(containerRef.current, {
          y: "-100vh",
          ease: "none",
          duration: 10
        }, 0);

        // 2. Animate Cubes
        cubes.forEach((cube, i) => {
          if (!cube) return;
          const start = moves[i];
          
          const midX = start.x * 0.5 + (Math.random() * 300 - 150); 
          const midY = start.y * 0.5 + (Math.random() * 300 - 150);

          // Start EXACTLY at logo
          gsap.set(cube, { 
            x: start.x, 
            y: start.y, 
            scale: 0.05, // Start as a dot
            opacity: 1,  // Visible immediately
            rotationX: Math.random() * 360, 
            rotationY: Math.random() * 360 
          });

          // Fly out
          tl.to(cube, {
            x: midX,
            y: midY,
            scale: 0.6,
            rotationX: "+=180",
            rotationY: "+=180",
            ease: "power1.inOut",
            duration: 4
          }, 0);

          // Land
          tl.to(cube, {
            x: 0, 
            y: 0,
            scale: 1,
            rotationX: 0, 
            rotationY: 0,
            rotationZ: 0,
            ease: "power2.out",
            duration: 6
          }, 4);
        });

      }, mainRef);
    };

    // Initial load
    initAnimation();

    // Force refresh after short delay to catch layout shifts (e.g. image loads)
    const timer = setTimeout(() => {
        initAnimation();
        ScrollTrigger.refresh();
    }, 200);

    return () => {
        if (ctx) ctx.revert();
        clearTimeout(timer);
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    cubeRefs.current[index] = el;
  };

  return (
    <main ref={mainRef} className="h-screen w-full overflow-hidden bg-[#1E1E1E]"> 
      {/* Container for pinned scrolling - removed h-full to allow natural height */}
      <div ref={containerRef} className="w-full relative will-change-transform">
        
        {/* Hero Section */}
        <section className="hero relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden bg-[#2b1810]">
          
          {/* 1. Header Logo Section */}
          <div ref={logoRef} id="hero-logo" className="mb-8 relative w-[120px] h-[75px] md:w-[154px] md:h-[96px] z-20">
             <Image 
               src="/logo.png" 
               alt="Logo" 
               fill
               className="object-contain"
               priority
             />
          </div>

          {/* 2. Main Heading */}
          <h1 className="font-heading text-[32px] sm:text-[40px] md:text-[64px] leading-[105%] tracking-[0%] text-center text-[#EADDCD] font-normal w-full max-w-[692px] md:max-w-[1057px] mx-auto z-10">
            The First Media Company crafted For the Digital First generation
          </h1>
        </section>

        {/* 5. Bottom Section */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#2b1810]">
          
          {/* Desktop Cubes (Absolute) - Only visible on MD+ */}
          {/* Left Side */}
          <div className="hidden md:block absolute left-[22%] top-[18%] -translate-x-1/2 -translate-y-1/2 z-30">
            <Cube ref={(el) => addToRefs(el, 0)} size={120} images={cubeImages} />
          </div>
          <div className="hidden md:block absolute left-[10%] top-[42%] -translate-x-1/2 -translate-y-1/2 z-30">
            <Cube ref={(el) => addToRefs(el, 1)} size={120} images={cubeImages} />
          </div>
          <div className="hidden md:block absolute left-[22%] top-[68%] -translate-x-1/2 -translate-y-1/2 z-30">
            <Cube ref={(el) => addToRefs(el, 2)} size={120} images={cubeImages} />
          </div>

          {/* Right Side */}
          <div className="hidden md:block absolute right-[22%] top-[18%] translate-x-1/2 -translate-y-1/2 z-30">
            <Cube ref={(el) => addToRefs(el, 3)} size={120} images={cubeImages} />
          </div>
          <div className="hidden md:block absolute right-[10%] top-[42%] translate-x-1/2 -translate-y-1/2 z-30">
            <Cube ref={(el) => addToRefs(el, 4)} size={120} images={cubeImages} />
          </div>
          <div className="hidden md:block absolute right-[22%] top-[68%] translate-x-1/2 -translate-y-1/2 z-30">
            <Cube ref={(el) => addToRefs(el, 5)} size={120} images={cubeImages} />
          </div>

          {/* Center Content Container */}
          <div className="relative w-full max-w-6xl flex-1 flex flex-col justify-center items-center mt-10 md:mt-0 z-20">
            
            {/* 4. Center Subheading + Paragraph */}
            <div className="text-center md:max-w-[500px] z-10 px-4">
              <h2 className="font-body font-bold text-[20.81px] leading-[100%] text-[#EADDCD] mb-4">
                Where innovation meets precision.
              </h2>
              <p className="font-body font-normal text-[17.81px] leading-[130%] text-[#EADDCD] opacity-90">
                Symphonia unites visionary thinkers, creative architects, and analytical experts, collaborating seamlessly to transform challenges into opportunities. Together, we deliver tailored solutions that drive impact and inspire growth.
              </p>
            </div>

            {/* Mobile View: Cubes below text (Static, no scroll trigger logic applied here for now) */}
             <div className="md:hidden grid grid-cols-2 gap-6 mt-12">
               <div className="flex justify-center"><Cube size={80} images={cubeImages} /></div>
               <div className="flex justify-center"><Cube size={80} images={cubeImages} /></div>
               <div className="flex justify-center"><Cube size={80} images={cubeImages} /></div>
               <div className="flex justify-center"><Cube size={80} images={cubeImages} /></div>
               <div className="flex justify-center"><Cube size={80} images={cubeImages} /></div>
               <div className="flex justify-center"><Cube size={80} images={cubeImages} /></div>
             </div>

          </div>
        </section>
      </div>
    </main>
  );
}
