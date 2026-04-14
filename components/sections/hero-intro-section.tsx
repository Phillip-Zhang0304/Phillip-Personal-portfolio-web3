"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type ContactItem = {
  label: string;
  icon: string;
};

type HeroIntroSectionProps = {
  titleImage: string;
  mobileTitleImage?: string;
  contactItems: ContactItem[];
  onIntroComplete?: () => void;
};

const AVATAR_SIZE = 540;
const AVATAR_TOP = 240;
const CONTACT_FRAME_TOP = 432;
const MAX_DRIFT = 12;
const FINAL_SECTION_HEIGHT = 916;
const INITIAL_AVATAR_TOP = "calc(50svh - 270px)";
const INITIAL_INFO_TOP = "calc(50svh - 116px)";
const LOADING_BACKGROUND = "linear-gradient(180deg, #000000 0%, #030034 100%)";
const FINAL_BACKGROUND = "linear-gradient(180deg, #000000 0%, #0d00b2 100%)";
const LOOP_BACKGROUND = "linear-gradient(180deg, #000000 0%, #0024D9 100%)";

function FullBleedTitle({
  src,
  alt,
  ratio
}: {
  src: string;
  alt: string;
  ratio: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <div className="relative w-full" style={{ aspectRatio: ratio }}>
        <img
          alt={alt}
          className="absolute inset-0 block h-full w-full object-contain"
          src={src}
        />
      </div>
    </div>
  );
}

declare global {
  interface Window {
    lottie?: {
      loadAnimation: (config: {
        container: HTMLElement;
        renderer: "svg" | "canvas" | "html";
        loop: boolean | number;
        autoplay: boolean;
        path?: string;
      }) => {
        play: () => void;
        destroy: () => void;
      };
    };
  }
}

type LottieApi = NonNullable<Window["lottie"]>;

const LOTTIE_SCRIPT_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";

async function loadLottieScript() {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.lottie) {
    return window.lottie;
  }

  return new Promise<LottieApi | null>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-lottie="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(window.lottie ?? null),
        { once: true }
      );
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load lottie-web")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = LOTTIE_SCRIPT_SRC;
    script.async = true;
    script.dataset.lottie = "true";
    script.addEventListener("load", () => resolve(window.lottie ?? null), {
      once: true
    });
    script.addEventListener(
      "error",
      () => reject(new Error("Failed to load lottie-web")),
      { once: true }
    );
    document.head.appendChild(script);
  });
}

function SkillTagsLottie({ play }: { play: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<ReturnType<NonNullable<typeof window.lottie>["loadAnimation"]> | null>(null);
  const hasPlayedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const lottie = await loadLottieScript();
        if (!lottie || !containerRef.current || cancelled) {
          return;
        }

        if (animationRef.current) {
          return;
        }

        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: false,
          autoplay: false,
          path: "/skill-tags-lottie.json"
        });
        setReady(true);
      } catch {}
    };

    void init();

    return () => {
      cancelled = true;
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!play || hasPlayedRef.current || !animationRef.current) {
      return;
    }

    hasPlayedRef.current = true;
    animationRef.current.play();
  }, [play, ready]);

  return <div className="h-[116px] w-[130px] md:h-[232px] md:w-[260px]" ref={containerRef} />;
}

function useAvatarDrift() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.8 });

  useEffect(() => {
    const updateOffset = (clientX: number, clientY: number) => {
      const offsetX = ((clientX / window.innerWidth) * 2 - 1) * MAX_DRIFT;
      const offsetY = ((clientY / window.innerHeight) * 2 - 1) * MAX_DRIFT;
      x.set(Math.max(-MAX_DRIFT, Math.min(MAX_DRIFT, offsetX)));
      y.set(Math.max(-MAX_DRIFT, Math.min(MAX_DRIFT, offsetY)));
    };

    const handleMove = (event: PointerEvent) => {
      updateOffset(event.clientX, event.clientY);
    };

    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, [x, y]);

  return { x: springX, y: springY };
}

type AvatarPhase = "black" | "bright" | "static";

function HeroAvatarSequence({
  onBrightStart,
  floatingY,
  settling,
  top,
  size
}: {
  onBrightStart: () => void;
  floatingY: ReturnType<typeof useSpring>;
  settling: boolean;
  top: number | string;
  size: number;
}) {
  const drift = useAvatarDrift();
  const blackVideoRef = useRef<HTMLVideoElement | null>(null);
  const brightVideoRef = useRef<HTMLVideoElement | null>(null);
  const [phase, setPhase] = useState<AvatarPhase>("black");
  const [brightRequested, setBrightRequested] = useState(false);

  const beginBrightSequence = () => {
    const brightVideo = brightVideoRef.current;
    if (!brightVideo || brightRequested || phase === "bright" || phase === "static") {
      return;
    }

    setBrightRequested(true);
    brightVideo.currentTime = 0;
    void brightVideo.play().catch(() => {});
  };

  useEffect(() => {
    const blackVideo = blackVideoRef.current;
    if (!blackVideo) {
      return;
    }

    void blackVideo.play().catch(() => {});
    return;
  }, [phase]);

  return (
    <motion.div
      animate={{ top }}
      className="pointer-events-none absolute left-1/2 z-[2] -translate-x-1/2"
      initial={false}
      style={{
        top,
        width: size,
        height: size
      }}
      transition={{
        duration: settling ? 1.4 : 0,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <motion.div className="relative h-full w-full" style={{ y: floatingY }}>
        <motion.div
          className="relative h-full w-full"
          style={{
            x: drift.x,
            y: drift.y
          }}
        >
          <video
            autoPlay
            className={`absolute inset-0 h-full w-full object-contain ${
              phase === "black" ? "opacity-100" : "opacity-0"
            }`}
            loop={false}
            muted
            onEnded={() => {
              beginBrightSequence();
            }}
            playsInline
            preload="auto"
            ref={blackVideoRef}
            src="/avatar-sequence/black.webm"
          />
          <video
            className={`absolute inset-0 h-full w-full object-contain ${
              phase === "bright" ? "opacity-100" : "opacity-0"
            }`}
            muted
            onEnded={() => {
              setPhase("static");
            }}
            onPlaying={() => {
              onBrightStart();
              setPhase("bright");
            }}
            playsInline
            preload="auto"
            ref={brightVideoRef}
            src="/avatar-sequence/black-light.webm"
          />
          <img
            alt="Phillip avatar"
            className={`absolute inset-0 h-full w-full object-contain ${
              phase === "static" ? "opacity-100" : "opacity-0"
            }`}
            src="/avatar-sequence/touxiang.png"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function HeroIntroSection({
  titleImage,
  mobileTitleImage,
  contactItems,
  onIntroComplete
}: HeroIntroSectionProps) {
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [showFinalBackground, setShowFinalBackground] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [settling, setSettling] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [loopBackground, setLoopBackground] = useState(false);
  const [skillTagsPlay, setSkillTagsPlay] = useState(false);
  const hasTriggeredLayoutShiftRef = useRef(false);
  const avatarFloatingOffset = useMotionValue(0);
  const infoFloatingOffset = useMotionValue(0);
  const avatarFloatingY = useSpring(avatarFloatingOffset, {
    stiffness: 120,
    damping: 24,
    mass: 0.8
  });
  const infoFloatingY = useSpring(infoFloatingOffset, {
    stiffness: 120,
    damping: 24,
    mass: 0.8
  });

  useLayoutEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const isMobile = viewportWidth > 0 && viewportWidth < 768;
  const avatarSize = isMobile ? 320 : AVATAR_SIZE;
  const finalAvatarTop = isMobile ? 218 : AVATAR_TOP;
  const finalContactTop = isMobile ? 514 : CONTACT_FRAME_TOP;
  const finalSectionHeight = isMobile ? 738 : FINAL_SECTION_HEIGHT;
  const initialAvatarTop = isMobile ? "calc(50svh - 160px)" : INITIAL_AVATAR_TOP;
  const initialInfoTop = isMobile ? "calc(50svh + 146px)" : INITIAL_INFO_TOP;

  useEffect(() => {
    if (!introStarted) {
      return;
    }

    const settleTimeout = window.setTimeout(() => {
      setSettling(true);
      if (!hasTriggeredLayoutShiftRef.current) {
        hasTriggeredLayoutShiftRef.current = true;
        onIntroComplete?.();
      }
    }, 4400);
    const completeTimeout = window.setTimeout(() => {
      setIntroComplete(true);
      setLoopBackground(true);
    }, 5800);

    return () => {
      window.clearTimeout(settleTimeout);
      window.clearTimeout(completeTimeout);
    };
  }, [introStarted, onIntroComplete]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    if (!settling) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [settling]);

  useEffect(() => {
    if (!introStarted) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSkillTagsPlay(true);
    }, 2000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [introStarted]);

  useEffect(() => {
    if (!settling) {
      avatarFloatingOffset.set(0);
      infoFloatingOffset.set(0);
      return;
    }

    const updateFloatingOffset = () => {
      const scroll = window.scrollY;
      const avatarNext = Math.max(-144, Math.min(0, (-scroll / 800) * 144));
      const infoNext = Math.max(-96, Math.min(0, (-scroll / 800) * 96));
      avatarFloatingOffset.set(avatarNext);
      infoFloatingOffset.set(infoNext);
    };

    updateFloatingOffset();
    window.addEventListener("scroll", updateFloatingOffset, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateFloatingOffset);
    };
  }, [avatarFloatingOffset, infoFloatingOffset, settling]);

  return (
      <motion.section
        animate={{
          height:
            settling || introComplete
              ? finalSectionHeight
              : viewportHeight || finalSectionHeight
        }}
        className="relative overflow-hidden px-4 pb-10 pt-4 md:px-6 md:pb-24 md:pt-6"
        initial={false}
        transition={{
          duration: settling && !introComplete ? 1.4 : 0,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-[2000ms] ${
            showFinalBackground ? "opacity-0" : "opacity-100"
          }`}
          style={{ background: LOADING_BACKGROUND }}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-[2000ms] ${
            showFinalBackground ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: FINAL_BACKGROUND }}
        />
        <motion.div
          animate={loopBackground ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          className="absolute inset-0"
          initial={false}
          style={{ background: LOOP_BACKGROUND }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: loopBackground ? Infinity : 0,
            repeatType: "loop"
          }}
        />
        <div
          className="relative mx-auto w-full max-w-[1920px]"
          style={{
            minHeight:
              introComplete
                ? (isMobile ? 658 : 796)
                : Math.max(isMobile ? 658 : 796, (viewportHeight || finalSectionHeight) - (isMobile ? 48 : 120))
          }}
        >
          <motion.div
            animate={
              introStarted
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 144 }
            }
            initial={false}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hidden md:block">
              <FullBleedTitle
                alt="Hi, I'm Phillip"
                ratio="1872 / 445"
                src={titleImage}
              />
            </div>
            <div className="md:hidden">
              <img
                alt="Hi, I'm Phillip"
                className="block h-auto w-full"
                src={mobileTitleImage ?? titleImage}
              />
            </div>
          </motion.div>

          <HeroAvatarSequence
            floatingY={avatarFloatingY}
            onBrightStart={() => {
              setShowFinalBackground(true);
              setIntroStarted(true);
            }}
            settling={settling}
            size={avatarSize}
            top={settling || introComplete ? finalAvatarTop : initialAvatarTop}
          />

          <motion.div
            animate={{
              top: settling || introComplete ? finalContactTop : initialInfoTop
            }}
            className="absolute left-4 right-4 grid gap-6 md:left-1/2 md:right-auto md:mt-10 md:flex md:w-[1200px] md:max-w-[calc(100vw-48px)] md:-translate-x-1/2 md:items-center md:justify-between md:gap-10"
            style={{ top: initialInfoTop }}
            initial={false}
            transition={{
              duration: introComplete ? 0 : 1.4,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <motion.div
              className="grid w-full grid-cols-[minmax(0,1fr)_130px] items-start gap-x-4 gap-y-0 md:flex md:items-center md:justify-between"
              style={{ y: infoFloatingY }}
            >
              <motion.div
                className="w-full space-y-3 text-[12px] leading-[1.25] text-[#c6d7e8] md:w-[313px] md:space-y-10 md:text-[20px]"
                initial={false}
              >
                {contactItems.map((item) => (
                  <motion.div
                    animate={
                      introStarted
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 16 }
                    }
                    className="flex items-center gap-2.5 md:gap-4"
                    initial={false}
                    key={item.label}
                    transition={{
                      duration: 0.5,
                      delay: introStarted
                        ? 2 + 0.1 * contactItems.indexOf(item)
                        : 0,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <img
                      alt=""
                      className="h-5 w-5 shrink-0 object-contain md:h-7 md:w-7"
                      src={item.icon}
                    />
                    <span>{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              <div className="flex flex-col items-end">
                <SkillTagsLottie play={skillTagsPlay} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

  );
}
