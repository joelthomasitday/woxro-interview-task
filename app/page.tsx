"use client";

import React, { useLayoutEffect, useRef, useEffect } from "react";
import Cube from "@/components/Cube";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cubesData } from "@/data/cubesData";


gsap.registerPlugin(ScrollTrigger);

const interpolate = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress;
};

export default function Home() {
  const stickySectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cubesContainerRef = useRef<HTMLDivElement>(null);
  const header1Ref = useRef<HTMLDivElement>(null);
  const header2Ref = useRef<HTMLDivElement>(null);
  const cubeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initialize Lenis - wait for script to load
    const initLenis = () => {
      if (typeof window !== "undefined" && (window as any).Lenis) {
        const Lenis = (window as any).Lenis;
        const lenis = new Lenis();
        
        lenis.on("scroll", ScrollTrigger.update);
        
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        
        gsap.ticker.lagSmoothing(0);

        return () => {
          lenis.destroy();
        };
      }
      return null;
    };

    // Try immediately, then retry after a short delay if needed
    let cleanup = initLenis();
    if (!cleanup) {
      const timer = setTimeout(() => {
        cleanup = initLenis();
      }, 100);
      return () => {
        clearTimeout(timer);
        if (cleanup) cleanup();
      };
    }

    return cleanup || undefined;
  }, []);

  useLayoutEffect(() => {
    if (!stickySectionRef.current || !logoRef.current || !cubesContainerRef.current || !header1Ref.current || !header2Ref.current) return;

    const stickySection = stickySectionRef.current;
    const logo = logoRef.current;
    const cubesContainer = cubesContainerRef.current;
    const header1 = header1Ref.current;
    const header2 = header2Ref.current;

    // Load images into cube faces using available cube images
    const cubesFaces = cubesContainer.querySelectorAll(".cube > div");
    const cubeImages = ["/cube1.png", "/cube2.png", "/cube3.png", "/cube4.png", "/cube5.png"];
    let imageIndex = 0;
    cubesFaces.forEach((face) => {
      // Only add image if one doesn't already exist
      if (!face.querySelector("img")) {
        const img = document.createElement("img");
        // Cycle through the 5 available images
        img.src = cubeImages[imageIndex % cubeImages.length];
        img.alt = `Cube Image ${imageIndex + 1}`;
        face.appendChild(img);
        imageIndex++;
      }
    });

    const stickyHeight = window.innerHeight * 4;

    ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeight}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        // Logo blur and opacity
        const initialProgress = Math.min(self.progress * 20, 1);
        logo.style.filter = `blur(${interpolate(0, 20, initialProgress)}px)`;
        const logoOpacityProgress = self.progress >= 0.02 ? Math.min((self.progress - 0.02) * 100, 1) : 0;
        logo.style.opacity = String(1 - logoOpacityProgress);

        // Cubes container opacity
        const cubesOpacityProgress = self.progress > 0.01 ? Math.min((self.progress - 0.01) * 100, 1) : 0;
        cubesContainer.style.opacity = String(cubesOpacityProgress);

        // Header 1 animations
        const header1Progress = Math.min(self.progress * 2.5, 1);
        header1.style.transform = `translate(-50%, -50%) scale(${interpolate(1, 1.5, header1Progress)})`;
        header1.style.filter = `blur(${interpolate(0, 20, header1Progress)}px)`;
        header1.style.opacity = String(1 - header1Progress);

        // Header 2 animations
        const header2StartProgress = (self.progress - 0.4) * 10;
        const header2Progress = Math.max(0, Math.min(header2StartProgress, 1));
        const header2scale = interpolate(0.75, 1, header2Progress);
        const header2Blur = interpolate(10, 0, header2Progress);

        header2.style.transform = `translate(-50%, -50%) scale(${header2scale})`;
        header2.style.filter = `blur(${header2Blur}px)`;
        header2.style.opacity = String(header2Progress);

        // Cube animations
        const firstPhaseProgress = Math.min(self.progress * 2, 1);
        const secondPhaseProgress = self.progress >= 0.5 ? (self.progress - 0.5) * 2 : 0;

        Object.entries(cubesData).forEach(([cubeClass, data], index) => {
          const cube = cubeRefs.current[index];
          if (!cube) return;

          const { initial, final } = data;

          const currentTop = interpolate(initial.top, final.top, firstPhaseProgress);
          const currentLeft = interpolate(initial.left, final.left, firstPhaseProgress);
          const currentRotateX = interpolate(initial.rotateX, final.rotateX, firstPhaseProgress);
          const currentRotateY = interpolate(initial.rotateY, final.rotateY, firstPhaseProgress);
          const currentRotateZ = interpolate(initial.rotateZ, final.rotateZ, firstPhaseProgress);
          const currentZ = interpolate(initial.z, final.z, firstPhaseProgress);

          let additionalRotation = 0;
          if (cubeClass === "cube-2") {
            additionalRotation = interpolate(0, 180, secondPhaseProgress);
          } else if (cubeClass === "cube-4") {
            additionalRotation = interpolate(0, -180, secondPhaseProgress);
          }

          cube.style.top = `${currentTop}%`;
          cube.style.left = `${currentLeft}%`;
          cube.style.transform = `
            translate3d(-50%, -50%, ${currentZ}px)
            rotateX(${currentRotateX}deg)
            rotateY(${currentRotateY + additionalRotation}deg)
            rotateZ(${currentRotateZ}deg)
          `;
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    cubeRefs.current[index] = el;
  };

  return (
    <>
      <section ref={stickySectionRef} className="sticky">
        <div ref={logoRef} className="logo">
          <div className="col">
            <div className="block block-1"></div>
            <div className="block block-2"></div>
          </div>
          <div className="col">
            <div className="block block-3"></div>
            <div className="block block-4"></div>
          </div>
          <div className="col">
            <div className="block block-5"></div>
            <div className="block block-6"></div>
          </div>
        </div>
        <div ref={cubesContainerRef} className="cubes">
          <Cube ref={(el) => addToRefs(el, 0)} cubeClass="cube-1" />
          <Cube ref={(el) => addToRefs(el, 1)} cubeClass="cube-2" />
          <Cube ref={(el) => addToRefs(el, 2)} cubeClass="cube-3" />
          <Cube ref={(el) => addToRefs(el, 3)} cubeClass="cube-4" />
          <Cube ref={(el) => addToRefs(el, 4)} cubeClass="cube-5" />
          <Cube ref={(el) => addToRefs(el, 5)} cubeClass="cube-6" />
        </div>
        <div ref={header1Ref} className="header-1">
          <h1>
            The first media company crafted for the digital first generation.
          </h1>
        </div>
        <div ref={header2Ref} className="header-2">
          <h2>Where innovation meets precision.</h2>
          <p>
            Symphonia unites visionary thinkers, creative architects, and
            analytical experts, collaborating seamlessly to transform challenges
            into oppurtunities. Together, we deliver tailored solutions that drive
            impact and inspire growth.
          </p>
        </div>
      </section>
      <section className="about">
        <h2>Your next section goes here.</h2>
      </section>
    </>
  );
}