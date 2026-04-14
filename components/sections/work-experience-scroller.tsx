"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollTitleReveal } from "@/components/ui/title-reveal";

type Experience = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  highlight: string;
};

type WorkExperienceScrollerProps = {
  titleImage: string;
  mobileTitleImage?: string;
  experiences: Experience[];
  enabled?: boolean;
};

const figmaWorkExperienceCarImage =
  "https://www.figma.com/api/mcp/asset/22d80eba-98fa-461d-8137-c0596ce0587e";
const timelineLineImage =
  "https://www.figma.com/api/mcp/asset/911a4695-fcf9-46dd-8e97-ec5748c6ef31";

function useTiltCard() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, {
    stiffness: 220,
    damping: 20,
    mass: 0.8
  });
  const springRotateY = useSpring(rotateY, {
    stiffness: 220,
    damping: 20,
    mass: 0.8
  });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 10);
    rotateX.set((0.5 - py) * 10);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    style: {
      rotateX: springRotateX,
      rotateY: springRotateY,
      transformPerspective: 1200
    },
    handleMove,
    handleLeave
  };
}

function WorkExperienceCard({
  experience,
  width
}: {
  experience: Experience;
  width: number;
}) {
  const tilt = useTiltCard();

  return (
    <div
      className="flex shrink-0 flex-col items-center gap-8"
      style={{ width }}
    >
      <div className="flex flex-col items-center gap-2 text-center not-italic whitespace-nowrap">
        <h3
          className="text-[32px] uppercase leading-none text-white md:text-[48px]"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          <span className="text-[#d2ff03]">{experience.highlight}</span>
          <span>{` | ${experience.role}`}</span>
        </h3>
        <p className="text-[22px] font-bold leading-[1.2] text-[#d2ff03] md:text-[26px]">
          {experience.period}
        </p>
      </div>
      <div className="h-4 w-4 rounded-full bg-[#d2ff03]" />
      <motion.div
        className="flex h-[240px] w-full items-center rounded-[32px] border border-[rgba(204,226,255,0.22)] bg-[rgba(204,226,255,0.08)] px-12 py-12 text-[#8fbfff] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[24px] transition-transform duration-200 ease-out hover:scale-100"
        onMouseLeave={tilt.handleLeave}
        onMouseMove={tilt.handleMove}
        style={tilt.style}
      >
        <ul className="space-y-1 text-[16px] leading-[1.6] md:text-[18px]">
          {experience.bullets.map((bullet) => (
            <li key={bullet} className="list-disc ms-[27px]">
              {bullet}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export function WorkExperienceScroller({
  titleImage,
  mobileTitleImage,
  experiences,
  enabled = true
}: WorkExperienceScrollerProps) {
  const desktopSectionRef = useRef<HTMLElement | null>(null);
  const mobileSectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [gestureOffset, setGestureOffset] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [mobileScrollLeft, setMobileScrollLeft] = useState(0);
  const mobileCardMeasureRefs = useRef<Array<HTMLUListElement | null>>([]);
  const [mobileCardHeight, setMobileCardHeight] = useState(472);
  const gap = 108;
  const frameWidth = useMemo(
    () => Math.min(1200, Math.max(viewportWidth - 48, 280)),
    [viewportWidth]
  );
  const totalShift = frameWidth + gap;

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
    };

    const updateProgress = () => {
      const section = desktopSectionRef.current;
      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const travelled = clamp(-rect.top, 0, totalShift);
      setVerticalOffset(travelled);
    };

    updateViewport();
    updateProgress();

    window.addEventListener("resize", updateViewport);
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("scroll", updateProgress);
    };
  }, [totalShift]);

  useEffect(() => {
    if (viewportWidth >= 768) {
      return;
    }

    const measure = () => {
      const heights = mobileCardMeasureRefs.current
        .map((node) => node?.getBoundingClientRect().height ?? 0)
        .filter((value) => value > 0);

      if (heights.length === 0) {
        return;
      }

      const nextHeight = Math.ceil(Math.max(...heights) + 36);
      setMobileCardHeight(nextHeight);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [experiences, viewportWidth]);

  useEffect(() => {
    const sticky = stickyRef.current;
    const section = desktopSectionRef.current;
    if (!sticky || !section) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const isActive = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (!isActive) {
        return;
      }

      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
        return;
      }

      event.preventDefault();
      setGestureOffset((current) => clamp(current + event.deltaX, -verticalOffset, totalShift - verticalOffset));
    };

    sticky.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      sticky.removeEventListener("wheel", onWheel);
    };
  }, [totalShift]);

  useEffect(() => {
    setGestureOffset((current) =>
      clamp(current, -verticalOffset, totalShift - verticalOffset)
    );
  }, [totalShift, verticalOffset]);

  const initialOffset = viewportWidth > 0 ? (viewportWidth - frameWidth) / 2 : 0;
  const x = initialOffset - (verticalOffset + gestureOffset);
  const carShiftProgress =
    totalShift > 0 ? (verticalOffset + gestureOffset) / totalShift : 0;
  const carX = clamp(carShiftProgress, 0, 1) * -64;
  const sectionHeight = 896;

  return (
    <>
      <section
        className="relative hidden md:block"
        ref={desktopSectionRef}
        style={{ height: `${sectionHeight + totalShift}px` }}
      >
        <div
          className="sticky top-0 overflow-hidden bg-[#002fff]"
          ref={stickyRef}
          style={{ height: sectionHeight }}
        >
          <div
            className="absolute bottom-0 left-1/2 z-10 h-[420px] w-[1078px] -translate-x-1/2"
            style={{
              transform: `translateX(calc(-50% + ${carX}px))`
            }}
          >
            <img
              alt=""
              className="block h-full w-full object-contain"
              src={figmaWorkExperienceCarImage}
            />
          </div>

          <div className="absolute left-6 right-6 top-6 z-0">
            <div className="mx-auto max-w-[1872px]">
              <ScrollTitleReveal targetRef={desktopSectionRef}>
                <div className="relative w-full" style={{ aspectRatio: "1872 / 247" }}>
                  <img
                    alt="Work Experience"
                    className="absolute inset-0 h-full w-full object-contain"
                    src={titleImage}
                  />
                </div>
              </ScrollTitleReveal>
            </div>
          </div>

          <div className="absolute left-1/2 top-[399px] z-20 h-px w-screen max-w-[1920px] -translate-x-1/2">
            <img
              alt=""
              className="block h-full w-full object-fill"
              src={timelineLineImage}
            />
          </div>

          <div className="absolute left-0 right-0 top-[272px] z-30 overflow-visible">
            <div
              className={`flex items-start gap-[108px] will-change-transform transition-opacity duration-300 ${
                enabled ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{ transform: `translate3d(${x}px, 0, 0)` }}
            >
              {experiences.map((experience) => (
                <WorkExperienceCard
                  experience={experience}
                  key={experience.company}
                  width={frameWidth}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#002fff] px-4 pb-0 pt-4 md:hidden" ref={mobileSectionRef}>
        <div className="pointer-events-none absolute left-4 right-4 top-4">
          <ScrollTitleReveal distance={180} finishProgress={0.7} smooth={false} startOffset={240} targetRef={mobileSectionRef}>
            <div className="w-full">
              <img
                alt="Work Experience"
                className="block h-auto w-full"
                src={mobileTitleImage ?? titleImage}
              />
            </div>
          </ScrollTitleReveal>
        </div>
        <div className={`relative mt-[200px] pb-[200px] transition-opacity duration-300 ${enabled ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <div className="pointer-events-none absolute left-0 right-0 top-[104px] z-10 h-px">
            <img
              alt=""
              className="block h-full w-full object-fill"
              src={timelineLineImage}
            />
          </div>
          <div
            className="relative z-20 -mx-4 overflow-x-auto overflow-y-hidden px-4 pb-2 [scrollbar-width:none]"
            onScroll={(event) => {
              const element = event.currentTarget;
              setMobileScrollLeft(element.scrollLeft);
            }}
          >
            <div className="flex w-max gap-8 pr-4">
              {experiences.map((experience, index) => (
                <div className="flex w-[300px] shrink-0 flex-col items-center gap-3" key={experience.company}>
                  <div className="flex w-[300px] flex-col items-center justify-start text-center">
                    <h3
                      className="text-[23px] uppercase leading-[0.95] text-white"
                      style={{ fontFamily: "var(--font-anton)" }}
                    >
                      <span className="block text-[#d2ff03]">{experience.highlight}</span>
                      <span className="mt-1 block text-white">{experience.role}</span>
                    </h3>
                    <p className="mt-2 text-[18px] font-bold text-[#d2ff03]">
                      {experience.period}
                    </p>
                  </div>
                  <div className="h-4 w-4 rounded-full bg-[#d2ff03]" />
                  <div
                    className="flex w-[300px] rounded-[20px] border border-[rgba(204,226,255,0.22)] bg-[rgba(204,226,255,0.08)] px-4 py-4 text-[#8fbfff] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-[24px]"
                    style={{ height: mobileCardHeight }}
                  >
                    <ul
                      className="space-y-2 text-[14px] leading-[1.6]"
                      ref={(node) => {
                        mobileCardMeasureRefs.current[index] = node;
                      }}
                    >
                      {experience.bullets.map((bullet) => (
                        <li className="list-disc ms-5" key={bullet}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="pointer-events-none absolute bottom-0 left-0 z-0 h-[360px] w-[920px]"
            style={{
              transform: `translate3d(${(viewportWidth - 920) / 2 - mobileScrollLeft / 3}px, 0, 0)`
            }}
          >
            <img
              alt=""
              className="block h-full w-full object-contain"
              style={{ objectPosition: "left bottom" }}
              src={figmaWorkExperienceCarImage}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
