"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { InteractiveDotGrid } from "@/components/ui/interactive-dot-grid";
import { HeroIntroSection } from "@/components/sections/hero-intro-section";
import { ProjectShowcaseSection } from "@/components/sections/project-showcase-section";
import type { ProjectCardData } from "@/components/sections/project-showcase-section";
import { WorkExperienceScroller } from "@/components/sections/work-experience-scroller";
import { CoreStrengthsSection } from "@/components/sections/core-strengths-section";

const heroTitleImage = "/hero-title.svg";
const heroTitleMobileImage = "/section-titles/hero-title-mobile.svg";
const projectShowcaseTitleImage =
  "https://www.figma.com/api/mcp/asset/a47ad95b-e77e-4fef-8beb-5f6f6aa0289a";
const projectShowcaseTitleMobileImage = "/section-titles/project-showcase-title-mobile.svg";
const workExperienceTitleImage =
  "https://www.figma.com/api/mcp/asset/1cd26bbd-fbea-4404-8c6a-ad338e5adca3";
const workExperienceTitleMobileImage = "/section-titles/work-experience-title-mobile.svg";
const nameIconImage = "/icons/icon_name.svg";
const locationIconImage = "/icons/icon_add.svg";
const phoneIconImage = "/icons/icon_phone.svg";
const mailIconImage = "/icons/icon_mail.svg";
const projectHeroImage = "/project-showcase/image_03.webp";
const projectPurpleImage = "/project-showcase/image_02.webp";
const projectBrandImage = "/project-showcase/image_01.webp";
const projectAdditionalImage = "/project-showcase/image_04.webp";
const projectAiImage = "/project-showcase/image_05.webp";
const goIconImage = "/project-showcase/go.svg";

const contactItems = [
  {
    label: "Pengfei Zhang / Phillip",
    icon: nameIconImage
  },
  {
    label: "Hangzhou, China",
    icon: locationIconImage
  },
  {
    label: "+86 166-5710-2468",
    icon: phoneIconImage
  },
  {
    label: "505235740zhang@gmail.com",
    icon: mailIconImage
  }
];

const projectCards: ProjectCardData[] = [
  {
    id: "01",
    title: ["WCTC S7", "Trading Grand Prix"],
    image: projectBrandImage,
    tone: "dark",
    layout: "hero",
    titleClass: "text-[18px] tracking-[-0.02em] md:text-[40px]",
    imageClass: "absolute right-0 top-0 h-full w-auto object-contain object-right",
    paddingClass: "p-4 md:p-10",
    goClass: "",
    imageStyle: {
      width: "auto",
      height: "100%"
    },
    imageFrameClass: "absolute inset-y-0 right-0 h-full w-full overflow-hidden"
  },
  {
    id: "02",
    title: ["Other Campaign", "Designs (Selected)"],
    image: projectPurpleImage,
    tone: "purple",
    titleClass: "w-full text-[16px] tracking-[-0.02em] md:text-[24px]",
    imageClass: "absolute inset-0 object-cover",
    paddingClass: "p-4 md:p-6",
    goClass: "",
    imageStyle: {
      width: "100%",
      height: "100%"
    },
    imageFrameClass: "absolute bottom-0 right-0 h-[112px] md:h-[240px] w-full overflow-hidden"
  },
  {
    id: "03",
    title: ["Branding &", "Video Projects"],
    image: projectHeroImage,
    tone: "light",
    titleClass: "w-full text-[16px] tracking-[-0.02em] md:text-[24px]",
    imageClass: "absolute inset-0 object-cover",
    paddingClass: "p-4 md:p-6",
    goClass: "brightness-0",
    imageStyle: {
      width: "100%",
      height: "100%"
    },
    imageFrameClass: "absolute bottom-0 right-0 h-[112px] md:h-[240px] w-full overflow-hidden"
  },
  {
    id: "04",
    title: ["Additional", "Design Work"],
    image: projectAdditionalImage,
    tone: "dark",
    titleClass: "w-full text-[16px] tracking-[-0.02em] md:text-[24px]",
    imageClass: "absolute inset-0 object-cover",
    paddingClass: "p-4 md:p-6",
    goClass: "brightness-0 invert",
    imageStyle: {
      width: "100%",
      height: "100%"
    },
    imageFrameClass: "absolute bottom-0 right-0 h-[112px] md:h-[240px] w-full overflow-hidden",
    titleColorClass: "text-white",
    idColorClass: "text-white",
    cardClassName: "bg-[#000000]"
  },
  {
    id: "05",
    title: ["Domestic Internet", "Projects"],
    image: projectAiImage,
    tone: "light",
    layout: "hero",
    titleClass: "text-[18px] tracking-[-0.02em] md:text-[40px]",
    imageClass: "absolute right-0 top-0 h-full w-auto object-contain object-right",
    paddingClass: "p-4 md:p-10",
    goClass: "brightness-0",
    imageStyle: {
      width: "auto",
      height: "100%"
    },
    imageFrameClass: "absolute inset-y-0 right-0 h-full w-full overflow-hidden",
    cardClassName: "bg-[#D5E5F4]",
    backgroundColor: "#D5E5F4"
  }
];

const competencies = [
  {
    label: "Visual Design",
    value: "Campaign key visuals / Marketing visuals / Brand visuals"
  },
  {
    label: "UI Design",
    value: "Campaign pages / Landing pages / Multi-end adaptation"
  },
  {
    label: "Motion Design",
    value: "After Effects animations / Video packaging"
  },
  {
    label: "3D Design",
    value: "Cinema 4D modeling / Rendering / 3D animation"
  },
  {
    label: "AI Design",
    value:
      "Midjourney, Freepik, and other tools/platforms, plus AI style training, character generation, and AI-assisted 3D output"
  }
];

const summaryLines = [
  {
    label: "Visual Design:",
    value: "Campaign key visuals / Marketing visuals / Brand visuals"
  },
  {
    label: "UI Design:",
    value: "Campaign pages / Landing pages / Multi-end adaptation"
  },
  {
    label: "Motion Design:",
    value: "After Effects animations / Video packaging"
  },
  {
    label: "3D Design:",
    value: "Cinema 4D modeling / Rendering / 3D animation"
  }
];

const experiences = [
  {
    company: "Gate",
    highlight: "Gate",
    role: "Visual / Campaign Designer",
    period: "2024 - 2026",
    bullets: [
      "Led visual design for platform campaigns (60%), including key visuals, campaign landing pages, and motion design",
      "Produced operational visuals (20%) and brand video projects (20%)",
      "Supported a wide range of business scenarios, including trading campaigns, token promotions, and seasonal events",
      "Independently managed the full design workflow: from requirement analysis → visual concept → final delivery"
    ]
  },
  {
    company: "Internet Companies (China)",
    highlight: "Internet Companies (China)",
    role: "Visual / Campaign / UI Designer",
    period: "2015 - 2024",
    bullets: [
      "Designed UI interfaces, operational visuals, and campaign creatives for multiple internet products across Web and mobile platforms",
      "Collaborated across both product and marketing teams, with strong cross-functional design capabilities",
      "Contributed to large-scale campaigns and branding projects, delivering key visuals and promotional assets",
      "Worked closely with product managers and developers to ensure feasible, consistent, and high-quality implementation",
      "Built a solid foundation in visual design and UI design, with strong awareness of layout systems and design standards"
    ]
  }
];

export default function Home() {
  const [postHeroReady, setPostHeroReady] = useState(false);
  const summarySectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: summaryProgress } = useScroll({
    target: summarySectionRef,
    offset: ["start end", "end start"]
  });
  const summaryTopLeftX = useTransform(summaryProgress, [0.12, 0.38], [-200, 0]);
  const summaryTopRightX = useTransform(summaryProgress, [0.12, 0.38], [200, 0]);
  const summaryTopOpacity = useTransform(summaryProgress, [0.12, 0.38], [0, 1]);
  const summaryBottomLeftX = useTransform(summaryProgress, [0.28, 0.56], [-200, 0]);
  const summaryBottomRightX = useTransform(summaryProgress, [0.28, 0.56], [200, 0]);
  const summaryBottomOpacity = useTransform(summaryProgress, [0.28, 0.56], [0, 1]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <main className="bg-black text-white">
      <HeroIntroSection
        contactItems={contactItems}
        mobileTitleImage={heroTitleMobileImage}
        onIntroComplete={() => setPostHeroReady(true)}
        titleImage={heroTitleImage}
      />

      <div>
        <ProjectShowcaseSection
          cards={projectCards}
          enabled={postHeroReady}
          goIconImage={goIconImage}
          mobileTitleImage={projectShowcaseTitleMobileImage}
          titleImage={projectShowcaseTitleImage}
        />

        <section
          className="relative overflow-hidden bg-black px-6 py-20 md:min-h-[764px] md:px-6 md:py-[168px]"
          ref={(node) => {
            summarySectionRef.current = node;
          }}
        >
          <InteractiveDotGrid
            activeColor="#a9ff29"
            baseColor="#0f0c1d"
            className="opacity-95"
            dotSize={4}
            gap={10}
            maxSpeed={8000}
            proximity={160}
            resistance={2000}
            returnDuration={2.5}
            shockRadius={140}
            shockStrength={7.5}
            speedTrigger={190}
          />
          <div className="relative mx-auto hidden max-w-[1200px] flex-col gap-32 md:flex">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-center md:gap-[88px]">
              <motion.div
                className="shrink-0 text-[80px] uppercase leading-[0.9] text-white"
                style={{
                  x: summaryTopLeftX,
                  opacity: summaryTopOpacity,
                  fontFamily: "var(--font-anton)"
                }}
              >
                <div className="text-[#d2ff03]">Professional</div>
                <div>Summary</div>
              </motion.div>
              <motion.p
                className="max-w-[691px] text-right text-[18px] leading-[1.4] text-[#c6d7e8]"
                style={{ x: summaryTopRightX, opacity: summaryTopOpacity }}
              >
                Visual &amp; UI Designer with 10 years of experience in Web3,
                specializing in campaign design, motion, 3D, and AI-driven
                workflows. Focused on creating scalable and high-impact visual
                solutions.
              </motion.p>
            </div>
            <div className="flex flex-row items-start justify-center gap-[88px]">
              <motion.div
                className="flex-1 space-y-2 text-[18px] leading-[1.2] md:max-w-[674px]"
                style={{ x: summaryBottomLeftX, opacity: summaryBottomOpacity }}
              >
                {summaryLines.map((item) => (
                  <div className="flex gap-2" key={item.label}>
                    <span className="shrink-0 font-bold text-[#d2ff03]">
                      {item.label}
                    </span>
                    <span className="text-[#c6d7e8]">{item.value}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <span className="shrink-0 font-bold text-[#d2ff03]">AI Design:</span>
                  <div className="text-[#c6d7e8]">
                    <p className="leading-[1.4]">
                      Midjourney, Freepik, and other tools/platforms (multi-model
                      image &amp; video generation)
                    </p>
                    <div className="pl-[27px] leading-[1.4]">
                      <p>AI style training / Character generation</p>
                      <p>AI-assisted 3D and motion output</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="shrink-0 text-right text-[80px] uppercase leading-[0.9] text-white md:w-[438px]"
                style={{
                  x: summaryBottomRightX,
                  opacity: summaryBottomOpacity,
                  fontFamily: "var(--font-anton)"
                }}
              >
                <div>Core</div>
                <div className="text-[#d2ff03]">Competencies</div>
              </motion.div>
            </div>
          </div>

          <div className="relative mx-auto flex max-w-[398px] flex-col gap-10 md:hidden">
            <motion.div
              className="ml-auto text-right text-[40px] uppercase leading-none text-white"
              style={{
                x: summaryTopRightX,
                opacity: summaryTopOpacity,
                fontFamily: "var(--font-anton)"
              }}
            >
              <div className="text-[#d2ff03]">Professional</div>
              <div>Summary</div>
            </motion.div>
            <motion.p
              className="px-2 text-right text-[13px] leading-[1.55] text-[#c6d7e8]"
              style={{ opacity: summaryTopOpacity }}
            >
              Visual &amp; UI Designer with 10 years of experience in Web3,
              specializing in campaign design, motion, 3D, and AI-driven
              workflows. Focused on creating scalable and high-impact visual
              solutions.
            </motion.p>
            <motion.div
              className="text-left text-[40px] uppercase leading-none text-white"
              style={{
                x: summaryBottomLeftX,
                opacity: summaryBottomOpacity,
                fontFamily: "var(--font-anton)"
              }}
            >
              <div>Core</div>
              <div className="text-[#d2ff03]">Competencies</div>
            </motion.div>
            <motion.div
              className="space-y-3 text-[13px] leading-[1.45]"
              style={{ opacity: summaryBottomOpacity }}
            >
              {summaryLines.map((item) => (
                <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2.5" key={item.label}>
                  <span className="whitespace-nowrap font-bold text-[#d2ff03]">{item.label}</span>
                  <span className="text-[#c6d7e8]">{item.value}</span>
                </div>
              ))}
              <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-2.5">
                <span className="whitespace-nowrap font-bold text-[#d2ff03]">AI Design:</span>
                <div className="text-[#c6d7e8]">
                  <p className="leading-[1.45]">
                    Midjourney, Freepik, and other tools/platforms (multi-model image &amp; video generation)
                  </p>
                  <div className="mt-1 pl-4 leading-[1.45]">
                    <p>AI style training / Character generation</p>
                    <p>AI-assisted 3D and motion output</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <WorkExperienceScroller
          enabled={postHeroReady}
          experiences={experiences}
          mobileTitleImage={workExperienceTitleMobileImage}
          titleImage={workExperienceTitleImage}
        />

        <CoreStrengthsSection />
      </div>
    </main>
  );
}
