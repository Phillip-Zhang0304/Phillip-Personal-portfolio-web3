"use client";

import { motion } from "framer-motion";
import { CurvedLoop } from "@/components/ui/curved-loop";
import { ScrollTitleReveal } from "@/components/ui/title-reveal";
import { useEffect, useRef, useState } from "react";

const strengths = [
  {
    id: "01",
    title: "Versatile Multidisciplinary Designer",
    description: "Visual / UI / Motion / 3D / AI — end-to-end design coverage"
  },
  {
    id: "02",
    title: "Strong AI Implementation",
    description: "Campaign pages / Landing pages / Multi-platform adaptation"
  },
  {
    id: "03",
    title: "Project Execution Excellence",
    description: "After Effects motion / Video production & packaging"
  },
  {
    id: "04",
    title: "Web3 Experience",
    description: "Deep understanding of industry design trends / International design aesthetics"
  },
  {
    id: "05",
    title: "System Thinking",
    description: "Contributed to design systems and component libraries, driving efficiency and consistency"
  }
];

export function CoreStrengthsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [revealedRows, setRevealedRows] = useState(0);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    let secondTimeout = 0;
    let thirdTimeout = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }

        setRevealedRows(1);
        secondTimeout = window.setTimeout(() => setRevealedRows(2), 140);
        thirdTimeout = window.setTimeout(() => setRevealedRows(3), 280);
        observer.disconnect();
      },
      {
        threshold: 0.18
      }
    );

    observer.observe(content);

    return () => {
      observer.disconnect();
      window.clearTimeout(secondTimeout);
      window.clearTimeout(thirdTimeout);
    };
  }, []);

  const rows = [strengths.slice(0, 2), strengths.slice(2, 4), strengths.slice(4, 5)];

  return (
    <section
      className="relative overflow-hidden bg-black px-4 pb-16 pt-[196px] text-white md:px-6 md:pb-[168px] md:pt-[240px]"
      ref={sectionRef}
    >
      <div className="pointer-events-none absolute left-4 right-4 top-4 z-0 md:left-6 md:right-6 md:top-6">
        <div className="mx-auto max-w-[1872px]">
          <ScrollTitleReveal distance={180} finishProgress={0.7} smooth={false} startOffset={240} targetRef={sectionRef}>
            <div className="relative hidden w-full md:block" style={{ aspectRatio: "1872 / 267" }}>
              <img
                alt="Core Strengths"
                className="absolute inset-0 h-full w-full object-contain"
                src="/section-titles/core-strengths-title.svg"
              />
            </div>
            <div className="w-full md:hidden">
              <img
                alt="Core Strengths"
                className="block h-auto w-full"
                src="/section-titles/core-strengths-title-mobile.svg"
              />
            </div>
          </ScrollTitleReveal>
        </div>
      </div>

      <div className="relative mx-auto mt-5 flex max-w-[1200px] flex-col gap-8 md:mt-0 md:gap-12" ref={contentRef}>
        <div className="flex flex-col gap-y-8 md:gap-y-12">
          {rows.map((row, rowIndex) => (
            <div
              className={`grid gap-x-[72px] gap-y-8 ${row.length > 1 ? "md:grid-cols-2" : "md:grid-cols-[564px]"} md:gap-y-12`}
              key={rowIndex}
            >
              {row.map((item, itemIndex) => (
                <div
                  className={`transition-[transform,opacity] duration-700 ease-out ${
                    revealedRows >= rowIndex + 1
                      ? "translate-y-0 opacity-100"
                      : "translate-y-[144px] opacity-0"
                  }`}
                  key={item.id}
                  style={{ transitionDelay: `${rowIndex * 140 + itemIndex * 120}ms` }}
                >
                  <div className="border-b border-[#494949] py-4">
                    <h3 className="text-[20px] font-bold leading-none text-white md:text-[30px]">
                      <span className="mr-2 text-[#d2ff03]">{item.id}</span>
                      <span>{item.title}</span>
                    </h3>
                  </div>
                  <p className="mt-3 max-w-[564px] text-[13px] leading-[1.35] text-[#c6d7e8] md:mt-4 md:text-[16px] md:leading-none">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-20 flex justify-center overflow-hidden py-4 md:mt-12 md:py-6"
        initial={{ opacity: 0, y: 40 }}
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)"
        }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <CurvedLoop
          curveAmount={220}
          interactive
          marqueeText="Thanks ✦ For ✦ Watch ✦"
          speed={1.08}
        />
      </motion.div>
    </section>
  );
}
