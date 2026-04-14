"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollTitleReveal } from "@/components/ui/title-reveal";
import styles from "./project-showcase-section.module.css";

export type ProjectCardData = {
  id: string;
  title: string[];
  image: string;
  tone: "dark" | "purple" | "light";
  layout?: "hero";
  titleClass: string;
  imageClass: string;
  paddingClass: string;
  goClass: string;
  imageStyle: {
    width: string;
    height: string;
  };
  imageFrameClass: string;
  titleColorClass?: string;
  idColorClass?: string;
  cardClassName?: string;
  backgroundColor?: string;
};

type ProjectShowcaseSectionProps = {
  titleImage: string;
  mobileTitleImage?: string;
  goIconImage: string;
  cards: ProjectCardData[];
  enabled?: boolean;
};

type PopupContent = {
  projectName: string;
  projectTime: string;
  designTools: string;
  coverImage?: string;
  webm?: string;
  images?: string[];
  layout?:
    | "default"
    | "otherCampaignDesigns"
    | "videoShowreel"
    | "legacyProjects"
    | "additionalDesignWork";
  assetUrls?: string[];
};

const popupCloseIcon = "/project-popup/icon_close.svg";
const playerPlayIcon = "/project-popup/CEX_play.svg";
const playerPauseIcon = "/project-popup/CEX_pause.svg";
const playerMuteIcon = "/project-popup/CEX_Mute.svg";
const playerSoundIcon = "/project-popup/CEX_Sound.svg";

type RegisteredPlayer = {
  pause: () => void;
  setSharedVolume: (volume: number, muted: boolean) => void;
};

const registeredPlayers = new Map<string, RegisteredPlayer>();
let activePlayerId: string | null = null;
let sharedPlayerVolume = 0;
let sharedPlayerMuted = true;
let additionalLottieLoaderPromise: Promise<any> | null = null;

const popupContentById: Record<string, PopupContent> = {
  "01": {
    projectName: "WCTC S7 Trading Grand Prix",
    projectTime: "2024",
    designTools: "Figma / Photoshop / After Effects",
    coverImage: "/project-popup/wctc-00.webp",
    webm: "/project-popup/wctc-01.webm",
    images: [
      "/project-popup/wctc-02.webp",
      "/project-popup/wctc-03.webp",
      "/project-popup/wctc-04.webp"
    ]
  },
  "02": {
    projectName: "Other Campaign Designs",
    projectTime: "2024 - 2025",
    designTools: "Figma / Photoshop / C4D / Ae",
    layout: "otherCampaignDesigns",
    assetUrls: [
      "/project-popup/other-campaign-01.mp4",
      "/project-popup/other-campaign-02.webp",
      "/project-popup/other-campaign-03.webp",
      "/project-popup/other-campaign-04.mp4",
      "/project-popup/other-campaign-05.webp",
      "/project-popup/other-campaign-06.mp4",
      "/project-popup/other-campaign-07.mp4",
      "/project-popup/other-campaign-08.webp",
      "/project-popup/other-campaign-09.webp"
    ]
  },
  "03": {
    projectName: "Branding & Video Projects",
    projectTime: "2025",
    designTools: "Figma / Photoshop / C4D / After Effects / AIGC",
    layout: "videoShowreel",
    assetUrls: [
      "/project-popup/video_01.mp4",
      "/project-popup/video_02.mp4",
      "/project-popup/video_03.mp4",
      "/project-popup/video_04.mp4"
    ]
  },
  "04": {
    projectName: "Additional Design Work",
    projectTime: "April 2025-2026",
    designTools: "AIGC, V3D, Figma, Ae, Photoshop",
    layout: "additionalDesignWork",
    assetUrls: [
      "/project-popup/additional-design-work/04_01.webp",
      "/project-popup/additional-design-work/04_02_web_star.json",
      "/project-popup/additional-design-work/04_02_web_cycle.json",
      "/project-popup/additional-design-work/04_02_h5_star.mp4",
      "/project-popup/additional-design-work/04_02_h5_cycle.mp4",
      "/project-popup/additional-design-work/04_03.webp",
      "/project-popup/additional-design-work/04_04.webp"
    ]
  },
  "05": {
    projectName: "Domestic Internet Projects",
    projectTime: "April 2020-2024",
    designTools: "Photoshop, C4D, Ae, Sketch",
    layout: "legacyProjects",
    assetUrls: [
      "/project-popup/legacy-projects/01cefang/04%E7%AD%96%E6%96%B9%E9%A1%B9%E7%9B%AE%E8%83%8C%E6%99%AF%201.webp",
      "/project-popup/legacy-projects/01cefang/05%E4%BA%A7%E5%93%81%E5%BB%BA%E8%AE%BE%E6%B5%81%E7%A8%8B%201.webp",
      "/project-popup/legacy-projects/01cefang/06%E4%B8%9A%E5%8A%A1%E7%8E%B0%E7%8A%B6%E8%B0%83%E7%A0%94%201.webp",
      "/project-popup/legacy-projects/01cefang/07%E4%B8%9A%E5%8A%A1%E9%9C%80%E6%B1%82%E5%88%86%E6%9E%90%201.webp",
      "/project-popup/legacy-projects/01cefang/08%E7%94%A8%E6%88%B7%E7%94%BB%E5%83%8F%201.webp",
      "/project-popup/legacy-projects/01cefang/09%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E5%9C%B0%E5%9B%BE%201.webp",
      "/project-popup/legacy-projects/01cefang/10%E8%AE%BE%E8%AE%A1%E7%9B%AE%E6%A0%87%E7%AD%96%E7%95%A5%201.webp",
      "/project-popup/legacy-projects/01cefang/11%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83%201.webp",
      "/project-popup/legacy-projects/01cefang/12%E6%96%B0%E6%89%8B%E5%BC%95%E5%AF%BC%E4%BC%98%E5%8C%96%201.webp",
      "/project-popup/legacy-projects/01cefang/13%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96%201.webp",
      "/project-popup/legacy-projects/01cefang/14%E4%BB%BB%E5%8A%A1%E5%AE%9D%E5%88%9B%E5%BB%BA%E6%B4%BB%E5%8A%A8%E6%B5%81%E7%A8%8B%201.webp",
      "/project-popup/legacy-projects/01cefang/15%E6%B5%B7%E6%8A%A5%E6%A8%A1%E7%89%88%E5%BA%93%201.webp",
      "/project-popup/legacy-projects/01cefang/16%E4%BC%9A%E5%91%98%E4%BD%93%E7%B3%BB%201.webp",
      "/project-popup/legacy-projects/01cefang/17%E4%BA%91%E5%95%86%E5%9F%8E%E5%8A%9F%E8%83%BD%201.webp",
      "/project-popup/legacy-projects/01cefang/18%E5%93%81%E7%89%8C%E8%AE%BE%E8%AE%A1%201.webp",
      "/project-popup/legacy-projects/01cefang/19VI%E8%AE%BE%E8%AE%A1%201.webp",
      "/project-popup/legacy-projects/01cefang/20%E5%AE%98%E7%BD%91%E8%AE%BE%E8%AE%A1%201.webp",
      "/project-popup/legacy-projects/01cefang/21%E4%BB%98%E8%B4%B9%E6%B5%81%E7%A8%8B%E4%BC%98%E5%8C%96%201.webp",
      "/project-popup/legacy-projects/01cefang/22%E9%A1%B9%E7%9B%AE%E6%80%BB%E7%BB%93%201.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C01.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C02.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C03.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C04.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C05.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C06.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C07.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C08.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C09.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C10.webp",
      "/project-popup/legacy-projects/03jinli/%E9%94%A6%E9%B2%A401.webp",
      "/project-popup/legacy-projects/03jinli/%E9%94%A6%E9%B2%A402.webp",
      "/project-popup/legacy-projects/03jinli/%E9%94%A6%E9%B2%A403.webp",
      "/project-popup/legacy-projects/04hagic/hagic01%201.webp",
      "/project-popup/legacy-projects/04hagic/hagic02%201.webp",
      "/project-popup/legacy-projects/04hagic/hagic03%201.webp"
    ]
  }
};

const videoShowreelItems = [
  {
    id: "01",
    title: "Gate Global Design Center Design Showreel 2025",
    src: "/project-popup/video_01.mp4"
  },
  {
    id: "02",
    title: "Gate Brand Upgrade – Creative Video",
    src: "/project-popup/video_02.mp4"
  },
  {
    id: "03",
    title: "Gate Travel – Creative Video",
    src: "/project-popup/video_03.mp4"
  },
  {
    id: "04",
    title: "Gate Singapore Music Festival – Promotional Video",
    src: "/project-popup/video_04.mp4"
  }
] as const;

const additionalDesignItems = [
  {
    id: "01",
    title: "Daily Social Media Visuals",
    image: "/project-popup/additional-design-work/04_01.webp"
  },
  {
    id: "02",
    title: "Gate 2025 Annual Event – Key Visual",
    webStar: "/project-popup/additional-design-work/04_02_web_star.json",
    webCycle: "/project-popup/additional-design-work/04_02_web_cycle.json",
    h5Star: "/project-popup/additional-design-work/04_02_h5_star.mp4",
    h5Cycle: "/project-popup/additional-design-work/04_02_h5_cycle.mp4"
  },
  {
    id: "03",
    title: "Scalable Web3 Asset Generation",
    image: "/project-popup/additional-design-work/04_03.webp"
  },
  {
    id: "04",
    title: "IP Character Design & Development",
    image: "/project-popup/additional-design-work/04_04.webp"
  }
] as const;

async function loadAdditionalLottieScript() {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.lottie) {
    return window.lottie;
  }

  if (additionalLottieLoaderPromise) {
    return additionalLottieLoaderPromise;
  }

  additionalLottieLoaderPromise = new Promise((resolve, reject) => {
    const lottieWindow = window as Window & { lottie?: any };
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-popup-lottie="true"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(lottieWindow.lottie ?? null), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load lottie-web")), {
        once: true
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
    script.async = true;
    script.dataset.popupLottie = "true";
    script.addEventListener("load", () => resolve(lottieWindow.lottie ?? null), { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load lottie-web")), { once: true });
    document.body.appendChild(script);
  });

  return additionalLottieLoaderPromise;
}

const legacyProjectItems = [
  {
    id: "01",
    title: "Cefang - Third-Party SCRM Software",
    images: [
      "/project-popup/legacy-projects/01cefang/04%E7%AD%96%E6%96%B9%E9%A1%B9%E7%9B%AE%E8%83%8C%E6%99%AF%201.webp",
      "/project-popup/legacy-projects/01cefang/05%E4%BA%A7%E5%93%81%E5%BB%BA%E8%AE%BE%E6%B5%81%E7%A8%8B%201.webp",
      "/project-popup/legacy-projects/01cefang/06%E4%B8%9A%E5%8A%A1%E7%8E%B0%E7%8A%B6%E8%B0%83%E7%A0%94%201.webp",
      "/project-popup/legacy-projects/01cefang/07%E4%B8%9A%E5%8A%A1%E9%9C%80%E6%B1%82%E5%88%86%E6%9E%90%201.webp",
      "/project-popup/legacy-projects/01cefang/08%E7%94%A8%E6%88%B7%E7%94%BB%E5%83%8F%201.webp",
      "/project-popup/legacy-projects/01cefang/09%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E5%9C%B0%E5%9B%BE%201.webp",
      "/project-popup/legacy-projects/01cefang/10%E8%AE%BE%E8%AE%A1%E7%9B%AE%E6%A0%87%E7%AD%96%E7%95%A5%201.webp",
      "/project-popup/legacy-projects/01cefang/11%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83%201.webp",
      "/project-popup/legacy-projects/01cefang/12%E6%96%B0%E6%89%8B%E5%BC%95%E5%AF%BC%E4%BC%98%E5%8C%96%201.webp",
      "/project-popup/legacy-projects/01cefang/13%E9%A6%96%E9%A1%B5%E4%BC%98%E5%8C%96%201.webp",
      "/project-popup/legacy-projects/01cefang/14%E4%BB%BB%E5%8A%A1%E5%AE%9D%E5%88%9B%E5%BB%BA%E6%B4%BB%E5%8A%A8%E6%B5%81%E7%A8%8B%201.webp",
      "/project-popup/legacy-projects/01cefang/15%E6%B5%B7%E6%8A%A5%E6%A8%A1%E7%89%88%E5%BA%93%201.webp",
      "/project-popup/legacy-projects/01cefang/16%E4%BC%9A%E5%91%98%E4%BD%93%E7%B3%BB%201.webp",
      "/project-popup/legacy-projects/01cefang/17%E4%BA%91%E5%95%86%E5%9F%8E%E5%8A%9F%E8%83%BD%201.webp",
      "/project-popup/legacy-projects/01cefang/18%E5%93%81%E7%89%8C%E8%AE%BE%E8%AE%A1%201.webp",
      "/project-popup/legacy-projects/01cefang/19VI%E8%AE%BE%E8%AE%A1%201.webp",
      "/project-popup/legacy-projects/01cefang/20%E5%AE%98%E7%BD%91%E8%AE%BE%E8%AE%A1%201.webp",
      "/project-popup/legacy-projects/01cefang/21%E4%BB%98%E8%B4%B9%E6%B5%81%E7%A8%8B%E4%BC%98%E5%8C%96%201.webp",
      "/project-popup/legacy-projects/01cefang/22%E9%A1%B9%E7%9B%AE%E6%80%BB%E7%BB%93%201.webp"
    ]
  },
  {
    id: "02",
    title: "Weipaitang App – Auction Channel Redesign",
    images: [
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C01.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C02.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C03.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C04.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C05.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C06.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C07.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C08.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C09.webp",
      "/project-popup/legacy-projects/02paimaihang/%E6%8B%8D%E5%8D%96%E8%A1%8C10.webp"
    ]
  },
  {
    id: "03",
    title: "Weipaitang App – Koi Growth Campaign",
    images: [
      "/project-popup/legacy-projects/03jinli/%E9%94%A6%E9%B2%A401.webp",
      "/project-popup/legacy-projects/03jinli/%E9%94%A6%E9%B2%A402.webp",
      "/project-popup/legacy-projects/03jinli/%E9%94%A6%E9%B2%A403.webp"
    ]
  },
  {
    id: "04",
    title: "HAGIC Smartwatch – End-to-End Design",
    images: [
      "/project-popup/legacy-projects/04hagic/hagic01%201.webp",
      "/project-popup/legacy-projects/04hagic/hagic02%201.webp",
      "/project-popup/legacy-projects/04hagic/hagic03%201.webp"
    ]
  }
] as const;

function formatVideoTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function MinimalVideoPlayer({
  src,
  onAssetLoad
}: {
  src: string;
  onAssetLoad: () => void;
}) {
  const playerIdRef = useRef(`video-player-${Math.random().toString(36).slice(2)}`);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const tapTimeoutRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(sharedPlayerMuted);
  const [volume, setVolume] = useState(sharedPlayerVolume);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateMobile();
    window.addEventListener("resize", updateMobile);

    return () => {
      window.removeEventListener("resize", updateMobile);
    };
  }, []);

  useEffect(() => {
    setControlsVisible(!isMobile);
    setVolumeVisible(false);

    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (isMobile) {
      video.muted = false;
      setIsMuted(false);
      if (sharedPlayerVolume === 0) {
        video.volume = 0.6;
        setVolume(0.6);
        sharedPlayerVolume = 0.6;
      }
    } else {
      video.muted = sharedPlayerMuted;
      setIsMuted(sharedPlayerMuted);
      video.volume = sharedPlayerVolume;
      setVolume(sharedPlayerVolume);
    }
  }, [isMobile]);

  useEffect(() => {
    const playerId = playerIdRef.current;

    const pause = () => {
      const video = videoRef.current;
      if (!video || video.paused) {
        return;
      }

      video.pause();
      setIsPlaying(false);
    };

    const setSharedVolume = (nextVolume: number, nextMuted: boolean) => {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      video.volume = nextVolume;
      video.muted = nextMuted;
      setVolume(nextVolume);
      setIsMuted(nextMuted);
    };

    registeredPlayers.set(playerId, { pause, setSharedVolume });

    return () => {
      pause();
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
      if (tapTimeoutRef.current) {
        window.clearTimeout(tapTimeoutRef.current);
      }
      registeredPlayers.delete(playerId);
      if (activePlayerId === playerId) {
        activePlayerId = null;
      }
    };
  }, []);

  const syncSharedVolume = (nextVolume: number, nextMuted: boolean) => {
    sharedPlayerVolume = nextVolume;
    sharedPlayerMuted = nextMuted;
    registeredPlayers.forEach((player) => {
      player.setSharedVolume(nextVolume, nextMuted);
    });
  };

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      registeredPlayers.forEach((player, playerId) => {
        if (playerId !== playerIdRef.current) {
          player.pause();
        }
      });
      activePlayerId = playerIdRef.current;
      await video.play();
      setIsPlaying(true);
      if (isMobile) {
        setControlsVisible(false);
        setVolumeVisible(false);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
    if (activePlayerId === playerIdRef.current) {
      activePlayerId = null;
    }
  };

  const toggleMuted = () => {
    if (isMobile) {
      setVolumeVisible((current) => !current);
      if (!controlsVisible) {
        setControlsVisible(true);
      }
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    const nextVolume = !nextMuted && volume === 0 ? 0.6 : volume;
    if (!nextMuted && volume === 0) {
      video.volume = 0.6;
    }
    syncSharedVolume(nextVolume, nextMuted);
  };

  const handleVolumeChange = (nextVolume: number) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.volume = nextVolume;
    syncSharedVolume(nextVolume, isMobile ? false : nextVolume === 0);
  };

  const handleProgressChange = (nextProgress: number) => {
    const video = videoRef.current;
    if (!video || duration === 0) {
      return;
    }

    video.currentTime = nextProgress;
    setProgress(nextProgress);
  };

  const showControls = () => {
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    setControlsVisible(true);
    if (isMobile) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setControlsVisible(false);
        setVolumeVisible(false);
      }, 2000);
    }
  };

  const hideControlsWithDelay = () => {
    if (isMobile) {
      return;
    }
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 1000);
  };

  const toggleControlsVisibility = () => {
    if (!isMobile) {
      return;
    }

    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }

    setControlsVisible((current) => {
      const next = !current;
      if (next) {
        controlsTimeoutRef.current = window.setTimeout(() => {
          setControlsVisible(false);
          setVolumeVisible(false);
        }, 2000);
      } else {
        setVolumeVisible(false);
      }
      return next;
    });
  };

  const refreshMobileControlsTimeout = () => {
    if (!isMobile) {
      return;
    }

    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = window.setTimeout(() => {
      setControlsVisible(false);
      setVolumeVisible(false);
    }, 2000);
  };

  const handleVideoTap = () => {
    if (!isMobile) {
      void togglePlayback();
      return;
    }

    if (tapTimeoutRef.current) {
      window.clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
      void togglePlayback();
      return;
    }

    tapTimeoutRef.current = window.setTimeout(() => {
      toggleControlsVisibility();
      tapTimeoutRef.current = null;
    }, 220);
  };

  const playPauseMask = isPlaying ? playerPauseIcon : playerPlayIcon;
  const soundMask = isMobile ? playerSoundIcon : isMuted ? playerMuteIcon : playerSoundIcon;

  return (
    <div className="overflow-hidden rounded-[16px] bg-[#11131b]">
      <div
        className="relative aspect-video overflow-hidden rounded-[16px] bg-black"
        onMouseEnter={!isMobile ? showControls : undefined}
        onMouseLeave={!isMobile ? hideControlsWithDelay : undefined}
      >
        <video
          className="h-full w-full cursor-pointer object-cover"
          onClick={handleVideoTap}
          muted={isMuted}
          onEnded={() => setIsPlaying(false)}
          onLoadedData={onAssetLoad}
          onLoadedMetadata={() => {
            const video = videoRef.current;
            if (!video) {
              return;
            }
            video.volume = sharedPlayerVolume;
            video.muted = sharedPlayerMuted;
            setDuration(video.duration);
            setProgress(video.currentTime);
          }}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (!video) {
              return;
            }
            setProgress(video.currentTime);
          }}
          playsInline
          preload="metadata"
          ref={videoRef}
          src={src}
        />

        {!isPlaying && (
          <button
            aria-label="Play video"
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#D2FF03] text-black transition-transform duration-200 hover:scale-105 ${
              isMobile ? "h-[60px] w-[60px]" : "h-[120px] w-[120px]"
            }`}
            onClick={() => {
              refreshMobileControlsTimeout();
              void togglePlayback();
            }}
            type="button"
          >
            <span
              className={`${styles.playerIconMask} ${styles.playerIconMaskLarge}`}
              style={{
                width: isMobile ? "24px" : "48px",
                height: isMobile ? "24px" : "48px",
                maskImage: `url(${playerPlayIcon})`,
                WebkitMaskImage: `url(${playerPlayIcon})`
              }}
            />
          </button>
        )}
        <div
          aria-hidden="true"
          className={`${styles.playerControlsGradient} ${controlsVisible ? styles.playerControlsGradientVisible : ""}`}
        />
        <div
          className={`${styles.playerControls} ${controlsVisible ? styles.playerControlsVisible : ""}`}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className={styles.playerIconButton}
            onClick={() => {
              showControls();
              refreshMobileControlsTimeout();
              void togglePlayback();
            }}
            type="button"
          >
            <span
              className={styles.playerIconMask}
              style={{
                maskImage: `url(${playPauseMask})`,
                WebkitMaskImage: `url(${playPauseMask})`
              }}
            />
          </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
            <input
              aria-label="Video progress"
              className={styles.mediaSlider}
              max={duration || 0}
              min={0}
              onChange={(event) => handleProgressChange(Number(event.target.value))}
              onInput={(event) =>
                handleProgressChange(Number((event.target as HTMLInputElement).value))
              }
              onPointerDown={() => refreshMobileControlsTimeout()}
              onPointerMove={() => refreshMobileControlsTimeout()}
              step={0.01}
              style={
                {
                  ["--range-progress" as string]:
                    duration > 0 ? `${(progress / duration) * 100}%` : "0%"
                } as CSSProperties
              }
              type="range"
              value={progress}
            />
            <span className="shrink-0 text-[12px] text-[#d5d8e2]">
              {formatVideoTime(progress)} / {formatVideoTime(duration)}
            </span>
          </div>

          <div
            className={styles.volumeControl}
            onMouseEnter={!isMobile ? () => setVolumeVisible(true) : undefined}
            onMouseLeave={!isMobile ? () => setVolumeVisible(false) : undefined}
          >
            <div
              className={`${styles.volumePopover} ${volumeVisible ? styles.volumePopoverVisible : ""}`}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerMove={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onTouchMove={(event) => event.stopPropagation()}
            >
              <input
                aria-label="Video volume"
                className={styles.volumeSlider}
                max={1}
                min={0}
                onChange={(event) => handleVolumeChange(Number(event.target.value))}
                onInput={(event) =>
                  handleVolumeChange(Number((event.target as HTMLInputElement).value))
                }
                onPointerDown={(event) => {
                  event.stopPropagation();
                  refreshMobileControlsTimeout();
                }}
                onPointerMove={(event) => {
                  event.stopPropagation();
                  refreshMobileControlsTimeout();
                }}
                onTouchStart={(event) => event.stopPropagation()}
                onTouchMove={(event) => event.stopPropagation()}
                step={0.01}
                style={
                  {
                    ["--range-progress" as string]: `${(isMobile ? volume : isMuted ? 0 : volume) * 100}%`
                  } as CSSProperties
                }
                type="range"
                value={isMobile ? volume : isMuted ? 0 : volume}
              />
            </div>
            <button
              aria-label={isMobile ? "Show volume controls" : isMuted ? "Unmute video" : "Mute video"}
              className={styles.playerIconButton}
              onClick={() => {
                showControls();
                refreshMobileControlsTimeout();
                toggleMuted();
              }}
              type="button"
            >
              <span
                className={styles.playerIconMask}
                style={{
                  maskImage: `url(${soundMask})`,
                  WebkitMaskImage: `url(${soundMask})`
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoShowreelContent({
  onAssetLoad
}: {
  onAssetLoad: () => void;
}) {
  return (
    <div className="flex flex-col gap-10 pb-4 md:gap-16 md:pb-8">
      {videoShowreelItems.map((item) => (
        <section className="flex flex-col gap-3 md:gap-5" key={item.id}>
          <h4
            className="text-[16px] leading-none text-white md:text-[32px]"
            style={{ fontFamily: "var(--font-aeonik)" }}
          >
            <span className="text-[#d2ff03]">{item.id} </span>
            <span>{item.title}</span>
          </h4>
          <MinimalVideoPlayer onAssetLoad={onAssetLoad} src={item.src} />
        </section>
      ))}
    </div>
  );
}

function LegacyProjectsContent({
  onAssetLoad
}: {
  onAssetLoad: () => void;
}) {
  return (
    <div className="flex flex-col gap-10 pb-4 md:gap-16 md:pb-8">
      {legacyProjectItems.map((item) => (
        <section className="flex flex-col gap-3 md:gap-5" key={item.id}>
          <h4
            className="text-[16px] leading-none text-white md:text-[32px]"
            style={{ fontFamily: "var(--font-aeonik)" }}
          >
            <span className="text-[#d2ff03]">{item.id}. </span>
            <span>{item.title}</span>
          </h4>
          <div className="flex flex-col gap-2">
            {item.images.map((image) => (
              <img
                alt=""
                className="block w-full rounded-[8px] object-cover md:rounded-[16px]"
                key={image}
                onLoad={onAssetLoad}
                src={image}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function AdditionalSequenceLottie({
  starPath,
  cyclePath,
  onAssetLoad
}: {
  starPath: string;
  cyclePath: string;
  onAssetLoad: () => void;
}) {
  const starContainerRef = useRef<HTMLDivElement | null>(null);
  const cycleContainerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<"star" | "cycle">("star");
  const cycleCountRef = useRef(0);
  const animationsRef = useRef<{
    star: any | null;
    cycle: any | null;
  }>({ star: null, cycle: null });
  const [activeStage, setActiveStage] = useState<"star" | "cycle">("star");

  useEffect(() => {
    let cancelled = false;
    const mountAnimations = async () => {
      const lottieApi = await loadAdditionalLottieScript();
      const lottieWindow = (window as Window & { lottie?: any }).lottie ?? lottieApi;

      if (
        !lottieWindow ||
        !starContainerRef.current ||
        !cycleContainerRef.current ||
        cancelled
      ) {
        return;
      }

      const starAnimation = lottieWindow.loadAnimation({
        container: starContainerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: starPath,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet"
        }
      });

      const cycleAnimation = lottieWindow.loadAnimation({
        container: cycleContainerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: cyclePath,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet"
        }
      });

      animationsRef.current = {
        star: starAnimation,
        cycle: cycleAnimation
      };

      starAnimation.goToAndStop?.(0, true);
      cycleAnimation.goToAndStop?.(0, true);

      onAssetLoad();

      starAnimation.addEventListener("complete", () => {
        if (cancelled) {
          return;
        }

        stageRef.current = "cycle";
        cycleCountRef.current = 0;
        setActiveStage("cycle");
        cycleAnimation.goToAndStop?.(0, true);
        requestAnimationFrame(() => {
          if (!cancelled) {
            cycleAnimation.play?.();
          }
        });
      });

      cycleAnimation.addEventListener("complete", () => {
        if (cancelled) {
          return;
        }

        cycleCountRef.current += 1;
        if (cycleCountRef.current < 2) {
          cycleAnimation.goToAndStop?.(0, true);
          requestAnimationFrame(() => {
            if (!cancelled) {
              cycleAnimation.play?.();
            }
          });
          return;
        }

        stageRef.current = "star";
        setActiveStage("star");
        starAnimation.goToAndStop?.(0, true);
        requestAnimationFrame(() => {
          if (!cancelled) {
            starAnimation.play?.();
          }
        });
      });

      requestAnimationFrame(() => {
        if (!cancelled) {
          starAnimation.play?.();
        }
      });
    };

    void mountAnimations();

    return () => {
      cancelled = true;
      animationsRef.current.star?.destroy();
      animationsRef.current.cycle?.destroy();
    };
  }, [cyclePath, onAssetLoad, starPath]);

  return (
    <div className={`relative h-full w-full ${styles.additionalSequenceFill}`}>
      <div
        className={`absolute inset-0 ${
          activeStage === "star" ? "opacity-100" : "opacity-0"
        }`}
        ref={starContainerRef}
      />
      <div
        className={`absolute inset-0 ${
          activeStage === "cycle" ? "opacity-100" : "opacity-0"
        }`}
        ref={cycleContainerRef}
      />
    </div>
  );
}

function AdditionalSequenceVideo({
  starSrc,
  cycleSrc,
  onAssetLoad,
  onAspectRatioReady
}: {
  starSrc: string;
  cycleSrc: string;
  onAssetLoad: () => void;
  onAspectRatioReady?: (ratio: number) => void;
}) {
  const starVideoRef = useRef<HTMLVideoElement | null>(null);
  const cycleVideoRef = useRef<HTMLVideoElement | null>(null);
  const cycleCountRef = useRef(0);
  const [activeStage, setActiveStage] = useState<"star" | "cycle">("star");

  useEffect(() => {
    const starVideo = starVideoRef.current;
    const cycleVideo = cycleVideoRef.current;
    if (!starVideo || !cycleVideo) {
      return;
    }

    starVideo.currentTime = 0;
    cycleVideo.currentTime = 0;
    starVideo.pause();
    cycleVideo.pause();
    void starVideo.play().catch(() => {});
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <video
        autoPlay
        className={`absolute inset-0 h-full w-full object-contain ${
          activeStage === "star" ? "opacity-100" : "opacity-0"
        }`}
        muted
        onEnded={() => {
          const cycleVideo = cycleVideoRef.current;
          if (!cycleVideo) {
            return;
          }
          cycleCountRef.current = 0;
          setActiveStage("cycle");
          cycleVideo.currentTime = 0;
          requestAnimationFrame(() => {
            void cycleVideo.play().catch(() => {});
          });
        }}
        onLoadedData={onAssetLoad}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          if (video.videoWidth && video.videoHeight) {
            onAspectRatioReady?.(video.videoWidth / video.videoHeight);
          }
        }}
        playsInline
        preload="auto"
        ref={starVideoRef}
        src={starSrc}
      />
      <video
        className={`absolute inset-0 h-full w-full object-contain ${
          activeStage === "cycle" ? "opacity-100" : "opacity-0"
        }`}
        muted
        onEnded={() => {
          const cycleVideo = cycleVideoRef.current;
          const starVideo = starVideoRef.current;
          if (!cycleVideo || !starVideo) {
            return;
          }

          cycleCountRef.current += 1;
          if (cycleCountRef.current < 2) {
            cycleVideo.currentTime = 0;
            requestAnimationFrame(() => {
              void cycleVideo.play().catch(() => {});
            });
            return;
          }

          setActiveStage("star");
          starVideo.currentTime = 0;
          requestAnimationFrame(() => {
            void starVideo.play().catch(() => {});
          });
        }}
        onLoadedData={onAssetLoad}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          if (video.videoWidth && video.videoHeight) {
            onAspectRatioReady?.(video.videoWidth / video.videoHeight);
          }
        }}
        playsInline
        preload="auto"
        ref={cycleVideoRef}
        src={cycleSrc}
      />
    </div>
  );
}

function AdditionalKeyVisualPair({
  item,
  onAssetLoad
}: {
  item: (typeof additionalDesignItems)[1];
  onAssetLoad: () => void;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const leftAspectRatio = 1920 / 704;
  const [rightAspectRatio, setRightAspectRatio] = useState(0.72);
  const [rowHeight, setRowHeight] = useState(300);
  const gap = 16;

  useEffect(() => {
    const row = rowRef.current;
    if (!row) {
      return;
    }

    const updateSize = () => {
      const width = row.clientWidth;
      if (!width) {
        return;
      }

      const nextHeight = (width - gap) / (leftAspectRatio + rightAspectRatio);
      setRowHeight(nextHeight);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(row);

    return () => {
      observer.disconnect();
    };
  }, [rightAspectRatio]);

  return (
    <div className="flex gap-4" ref={rowRef}>
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#0f1118]"
        style={{ width: `${leftAspectRatio * rowHeight}px`, height: `${rowHeight}px` }}
      >
        <AdditionalSequenceLottie
          cyclePath={item.webCycle}
          onAssetLoad={onAssetLoad}
          starPath={item.webStar}
        />
      </div>
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#0f1118]"
        style={{ width: `${rightAspectRatio * rowHeight}px`, height: `${rowHeight}px` }}
      >
        <AdditionalSequenceVideo
          cycleSrc={item.h5Cycle}
          onAspectRatioReady={setRightAspectRatio}
          onAssetLoad={onAssetLoad}
          starSrc={item.h5Star}
        />
      </div>
    </div>
  );
}

function AdditionalDesignWorkContent({
  onAssetLoad
}: {
  onAssetLoad: () => void;
}) {
  return (
    <div className="flex flex-col gap-10 pb-4 md:gap-16 md:pb-8">
      {additionalDesignItems.map((item) => (
        <section className="flex flex-col gap-3 md:gap-5" key={item.id}>
          <h4
            className="text-[16px] leading-none text-white md:text-[32px]"
            style={{ fontFamily: "var(--font-aeonik)" }}
          >
            <span className="text-[#d2ff03]">{item.id}. </span>
            <span>{item.title}</span>
          </h4>

          {"image" in item ? (
            <img
              alt=""
              className="block w-full rounded-[8px] object-cover md:rounded-[16px]"
              onLoad={onAssetLoad}
              src={item.image}
            />
          ) : (
            <AdditionalKeyVisualPair item={item} onAssetLoad={onAssetLoad} />
          )}
        </section>
      ))}
    </div>
  );
}

function OtherCampaignDesignsContent({
  onAssetLoad
}: {
  onAssetLoad: () => void;
}) {
  return (
    <div className="flex flex-col gap-10 pb-4 md:gap-16 md:pb-8">
      <section className="flex flex-col gap-3 md:gap-4">
        <h4
          className="text-[16px] leading-none text-white md:text-[32px]"
          style={{ fontFamily: "var(--font-aeonik)" }}
        >
          <span className="text-[#d2ff03]">01</span>
          <span>{` Wishful Adventures`}</span>
        </h4>
        <video
          autoPlay
          className="block w-full rounded-[8px] object-cover md:rounded-[16px]"
          loop
          muted
          onLoadedData={onAssetLoad}
          playsInline
          preload="auto"
        >
          <source src="/project-popup/other-campaign-01.mp4" type="video/mp4" />
        </video>
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <div className="min-w-0 flex-1 overflow-hidden rounded-[8px] md:rounded-[16px]">
            <img
              alt=""
              className="block h-full w-full object-cover"
              onLoad={onAssetLoad}
              src="/project-popup/other-campaign-02.webp"
            />
          </div>
          <div className="w-full overflow-hidden rounded-[8px] md:w-[210px] md:rounded-[16px]">
            <img
              alt=""
              className="block h-full w-full object-cover"
              onLoad={onAssetLoad}
              src="/project-popup/other-campaign-03.webp"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 md:gap-4">
        <h4
          className="text-[16px] leading-none text-white md:text-[32px]"
          style={{ fontFamily: "var(--font-aeonik)" }}
        >
          <span className="text-[#d2ff03]">02 </span>
          <span>Gate P2P Fortune Points Fiesta</span>
        </h4>
        <video
          autoPlay
          className="block w-full rounded-[8px] object-cover md:rounded-[16px]"
          loop
          muted
          onLoadedData={onAssetLoad}
          playsInline
          preload="auto"
        >
          <source src="/project-popup/other-campaign-04.mp4" type="video/mp4" />
        </video>
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <div className="w-full overflow-hidden rounded-[8px] md:w-[347px] md:rounded-[16px]">
            <img
              alt=""
              className="block h-full w-full object-cover"
              onLoad={onAssetLoad}
              src="/project-popup/other-campaign-05.webp"
            />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden rounded-[8px] md:rounded-[16px]">
            <video
              autoPlay
              className="block h-full w-full object-cover"
              loop
              muted
              onLoadedData={onAssetLoad}
              playsInline
              preload="auto"
            >
              <source src="/project-popup/other-campaign-06.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 md:gap-4">
        <h4
          className="text-[16px] leading-none text-white md:text-[32px]"
          style={{ fontFamily: "var(--font-aeonik)" }}
        >
          <span className="text-[#d2ff03]">03 </span>
          <span>Countdown to win 1BTC</span>
        </h4>
        <video
          autoPlay
          className="block w-full rounded-[8px] object-cover md:rounded-[16px]"
          loop
          muted
          onLoadedData={onAssetLoad}
          playsInline
          preload="auto"
        >
          <source src="/project-popup/other-campaign-07.mp4" type="video/mp4" />
        </video>
      </section>

      <section className="flex flex-col gap-3 md:gap-4">
        <h4
          className="text-[16px] leading-none text-white md:text-[32px]"
          style={{ fontFamily: "var(--font-aeonik)" }}
        >
          <span className="text-[#d2ff03]">04 </span>
          <span>BRC20 Token Trading League</span>
        </h4>
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <div className="w-full overflow-hidden rounded-[8px] md:w-[819px] md:rounded-[16px]">
            <img
              alt=""
              className="block h-full w-full object-cover"
              onLoad={onAssetLoad}
              src="/project-popup/other-campaign-08.webp"
            />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden rounded-[8px] md:rounded-[16px]">
            <img
              alt=""
              className="block h-full w-full object-cover"
              onLoad={onAssetLoad}
              src="/project-popup/other-campaign-09.webp"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ProjectPopup({
  content,
  onClose
}: {
  content: PopupContent;
  onClose: () => void;
}) {
  const totalAssets =
    content.layout === "otherCampaignDesigns" ||
    content.layout === "videoShowreel" ||
    content.layout === "legacyProjects" ||
    content.layout === "additionalDesignWork"
      ? content.assetUrls?.length ?? 0
      : (content.coverImage ? 1 : 0) +
        (content.images?.length ?? 0) +
        (content.webm ? 1 : 0);
  const [loadedAssets, setLoadedAssets] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleAssetLoaded = () => {
    setLoadedAssets((current) => Math.min(totalAssets, current + 1));
  };

  const isLoading = loadedAssets < totalAssets;

  return (
    <motion.div
      animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
      className="fixed inset-0 z-[120] bg-black/85 px-0 md:px-6"
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
        <div className="absolute inset-x-4 top-4 md:inset-x-6 md:top-8">
          <div className="mx-auto w-full max-w-[1152px]">
            <div className="flex items-start justify-between gap-4 md:gap-8">
              <div className="space-y-3 text-white">
                <h3
                  className="max-w-[260px] text-[16px] font-bold leading-none tracking-[-0.02em] md:max-w-none md:text-[40px]"
                  style={{ fontFamily: "var(--font-aeonik)" }}
                >
                  {content.projectName}
                </h3>
                <div className="flex w-[calc(100vw-72px)] flex-col gap-y-1 text-[12px] leading-none text-white md:w-auto md:max-w-none md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:gap-y-1 md:text-[16px] md:leading-[1.4] md:text-[#9ba7c3]">
                  <p>Project Time: {content.projectTime}</p>
                  <p className="whitespace-nowrap md:whitespace-normal">Design Tools: {content.designTools}</p>
                </div>
              </div>
              <button
                aria-label="Close popup"
                className="flex h-6 w-6 shrink-0 items-center justify-center opacity-90 transition-opacity duration-200 md:h-12 md:w-12 md:opacity-70 md:hover:opacity-100"
                onClick={onClose}
                type="button"
              >
                <img
                  alt=""
                  className="h-6 w-6 object-contain md:h-12 md:w-12"
                  src={popupCloseIcon}
                />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 20px)"
          }}
          className="absolute inset-x-0 bottom-0 top-[84px] md:inset-x-6 md:bottom-8 md:top-[132px]"
          exit={{
            opacity: 0,
            y: 32,
            scale: 0.975,
            clipPath: "inset(6% 0% 0% 0% round 20px)"
          }}
          initial={{
            opacity: 0,
            y: 32,
            scale: 0.975,
            clipPath: "inset(8% 0% 0% 0% round 20px)"
          }}
          onClick={(event) => event.stopPropagation()}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto h-full w-full max-w-[1152px] overflow-hidden rounded-t-[20px] bg-[#0d0d14] md:rounded-[32px]">
            <div className="relative flex h-full flex-col px-3 pt-3 md:px-8 md:pt-8">
              <div className="popup-scrollbar min-h-0 flex-1 overflow-y-auto pr-0 md:-mr-4 md:pr-4">
                {content.layout === "otherCampaignDesigns" ? (
                  <OtherCampaignDesignsContent onAssetLoad={handleAssetLoaded} />
                ) : content.layout === "videoShowreel" ? (
                  <VideoShowreelContent onAssetLoad={handleAssetLoaded} />
                ) : content.layout === "legacyProjects" ? (
                  <LegacyProjectsContent onAssetLoad={handleAssetLoaded} />
                ) : content.layout === "additionalDesignWork" ? (
                  <AdditionalDesignWorkContent onAssetLoad={handleAssetLoaded} />
                ) : (
                  <div className="pb-8">
                    {content.coverImage && (
                      <img
                        alt=""
                        className="block w-full rounded-[8px] object-cover md:rounded-[16px]"
                        onLoad={handleAssetLoaded}
                        src={content.coverImage}
                      />
                    )}
                    {content.webm && (
                      <video
                        autoPlay
                        className="mt-3 block w-full rounded-t-[8px] object-cover md:mt-4 md:rounded-t-[16px]"
                        loop
                        muted
                        onLoadedData={handleAssetLoaded}
                        playsInline
                        preload="auto"
                        src={content.webm}
                      />
                    )}
                    {content.images?.map((image, index) => (
                        <img
                          alt=""
                          className={`block w-full object-cover ${
                            index === (content.images?.length ?? 1) - 1
                            ? "rounded-b-[8px] md:rounded-b-[16px]"
                            : ""
                        }`}
                        key={image}
                        onLoad={handleAssetLoaded}
                        src={image}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
}

function ProjectCard({
  card,
  goIconImage,
  revealed,
  delayMs = 0,
  onClick
}: {
  card: ProjectCardData;
  goIconImage: string;
  revealed: boolean;
  delayMs?: number;
  onClick?: () => void;
}) {
  const {
    id,
    title,
    image,
    tone,
    layout,
  titleClass,
  imageClass,
  paddingClass,
    goClass,
    imageStyle,
    imageFrameClass,
    titleColorClass,
    idColorClass,
    cardClassName,
    backgroundColor
  } = card;

  const toneClasses =
    tone === "dark"
      ? "bg-black text-white"
      : tone === "purple"
        ? "bg-[linear-gradient(180deg,#4f17df_0%,#8f64ff_42%,#dbe0ff_100%)] text-white"
        : "bg-[#F5F4F9] text-black";
  const frameClass = imageFrameClass.replace("overflow-hidden", "overflow-visible");
  const mobileTitleText =
    id === "02"
      ? "Other Campaign Designs"
      : id === "04"
        ? "Additional AI-Generated Work"
        : title.join(" ");
  const mobileGoClass = id === "02" ? "brightness-0" : goClass;
  const mobileImageClass = "absolute bottom-0 right-0 h-full w-auto object-contain object-right";
  const desktopImageClass =
    id === "02" || id === "03" || id === "04"
      ? "md:inset-0 md:h-full md:w-full md:object-cover"
      : "md:right-0 md:top-0 md:h-full md:w-auto md:object-contain md:object-right";
  return (
    <div
      className={`transition-[transform,opacity] duration-500 ease-out will-change-transform ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-[144px] opacity-0"
      }`}
      style={{
        transitionDelay: revealed ? `${delayMs}ms` : "0ms"
      }}
    >
      <article
        onClick={onClick}
        className={`group ${styles.card} relative h-[124px] cursor-pointer overflow-hidden rounded-[16px] transition-transform duration-300 ease-out will-change-transform md:h-[400px] md:rounded-[28px] md:hover:z-10 md:hover:scale-105 ${toneClasses} ${cardClassName ?? ""}`}
        style={
          {
            backgroundColor,
            ["--gh-rgba" as string]:
              tone === "light" ? "rgba(255, 255, 255, 0.65)" : "rgba(255, 255, 255, 0.42)"
          } as CSSProperties
        }
      >
        <div aria-hidden="true" className={styles.glareOverlay} />
        <div className={`relative z-10 hidden h-full flex-col justify-between ${paddingClass} md:flex`}>
          <div className="hidden md:block">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`text-[48px] leading-none tracking-[0px] md:text-[80px] ${idColorClass ?? ""}`}
                  style={{ fontFamily: "var(--font-anton)" }}
                >
                  {id}
                </div>
                {layout !== "hero" && (
                  <img
                    alt=""
                    className={`h-8 w-8 shrink-0 object-contain md:h-16 md:w-16 ${goClass}`}
                    src={goIconImage}
                  />
                )}
              </div>
              <div className={`font-bold leading-none ${titleColorClass ?? ""} ${titleClass}`}>
                {title.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>
          </div>
          {layout === "hero" && (
            <img
              alt=""
              className={`hidden h-16 w-16 object-contain md:block ${goClass}`}
              src={goIconImage}
            />
          )}
        </div>
        <div className="absolute inset-y-0 left-0 z-10 flex w-[52%] min-w-0 flex-col items-start justify-between p-3 md:hidden">
          <div className="min-w-0">
            <div
              className={`text-[24px] leading-none tracking-[0px] ${idColorClass ?? ""}`}
              style={{ fontFamily: "var(--font-anton)" }}
            >
              {id}
            </div>
            <div
              className={`mt-1 whitespace-nowrap text-[14px] font-bold leading-none tracking-[-0.03em] ${titleColorClass ?? ""}`}
            >
              {mobileTitleText}
            </div>
          </div>
          <img
            alt=""
            className={`h-8 w-8 shrink-0 object-contain ${mobileGoClass}`}
            src={goIconImage}
          />
        </div>
        <div className="absolute inset-0 overflow-visible">
          <div
            className={`${frameClass} h-full scale-[1.08] md:scale-100 ${
              layout === "hero" || id === "05" ? "origin-center" : ""
            }`}
          >
            <img
              alt=""
              className={`pointer-events-none absolute select-none transition-transform duration-300 ease-out ${mobileImageClass} md:group-hover:scale-110 ${desktopImageClass}`}
              src={image}
              style={
                {
                  width: "auto",
                  height: "100%",
                  transform:
                    id === "01"
                      ? "translateX(44px)"
                      : id === "05"
                        ? "translateX(32px)"
                        : undefined
                }
              }
            />
          </div>
        </div>
      </article>
    </div>
  );
}

export function ProjectShowcaseSection({
  titleImage,
  mobileTitleImage,
  goIconImage,
  cards,
  enabled = true
}: ProjectShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const middleRowRef = useRef<HTMLDivElement | null>(null);
  const lastCardRef = useRef<HTMLDivElement | null>(null);
  const [firstRevealed, setFirstRevealed] = useState(false);
  const [middleRevealed, setMiddleRevealed] = useState(false);
  const [lastRevealed, setLastRevealed] = useState(false);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const targets = [
      {
        element: firstCardRef.current,
        revealed: firstRevealed,
        setter: setFirstRevealed
      },
      {
        element: middleRowRef.current,
        revealed: middleRevealed,
        setter: setMiddleRevealed
      },
      {
        element: lastCardRef.current,
        revealed: lastRevealed,
        setter: setLastRevealed
      }
    ];

    const observers = targets
      .filter((target) => target.element && !target.revealed)
      .map((target) => {
        const observer = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;
            if (entry?.isIntersecting) {
              target.setter(true);
              observer.disconnect();
            }
          },
          {
            threshold: 0.18
          }
        );

        if (target.element) {
          observer.observe(target.element);
        }

        return observer;
      });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [enabled, firstRevealed, middleRevealed, lastRevealed]);

  return (
    <>
      <section
        className="relative overflow-hidden bg-[#eaeff7] px-4 pb-20 pt-4 text-black md:min-h-[1656px] md:px-6 md:pb-[136px] md:pt-6"
        ref={sectionRef}
      >
        <div className="mx-auto w-full max-w-[1872px] md:relative md:static">
          <ScrollTitleReveal
            className="pointer-events-none hidden md:block md:pointer-events-auto"
            distance={180}
            enabled={enabled}
            finishProgress={0.7}
            startOffset={220}
            targetRef={sectionRef}
          >
            <div className="relative w-full" style={{ aspectRatio: "1872 / 222" }}>
              <img
                alt="Project Showcase"
                className="absolute inset-0 h-full w-full object-contain"
                src={titleImage}
              />
            </div>
          </ScrollTitleReveal>
          <div className="absolute left-4 right-4 top-4 md:hidden">
            <ScrollTitleReveal
            className="pointer-events-none"
            distance={180}
            enabled={enabled}
            finishProgress={0.7}
            smooth={false}
            startOffset={240}
            targetRef={sectionRef}
          >
              <img
                alt="Project Showcase"
                className="block h-auto w-full"
                src={mobileTitleImage ?? titleImage}
              />
            </ScrollTitleReveal>
          </div>
        </div>
        <div
          className={`mx-auto mt-[196px] w-full max-w-[1200px] transition-opacity duration-300 md:absolute md:left-1/2 md:top-[200px] md:mt-0 md:w-[1200px] md:max-w-[calc(100vw-48px)] md:-translate-x-1/2 ${
            enabled ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="space-y-[10px] md:space-y-6">
            <div ref={firstCardRef}>
              <ProjectCard
                card={cards[0]}
                goIconImage={goIconImage}
                onClick={() => setActivePopupId("01")}
                revealed={enabled && firstRevealed}
              />
            </div>
            <div className="grid gap-[10px] md:grid-cols-3 md:gap-6" ref={middleRowRef}>
              {cards.slice(1, 4).map((card, index) => (
                <ProjectCard
                  card={card}
                  delayMs={index * 100}
                  goIconImage={goIconImage}
                  key={card.id}
                  onClick={
                    card.id === "02"
                      ? () => setActivePopupId("02")
                      : card.id === "03"
                        ? () => setActivePopupId("03")
                        : card.id === "04"
                          ? () => setActivePopupId("04")
                        : undefined
                  }
                  revealed={enabled && middleRevealed}
                />
              ))}
            </div>
            <div ref={lastCardRef}>
              <ProjectCard
                card={cards[4]}
                goIconImage={goIconImage}
                onClick={() => setActivePopupId("05")}
                revealed={enabled && lastRevealed}
              />
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activePopupId && popupContentById[activePopupId] && (
          <ProjectPopup
            content={popupContentById[activePopupId]}
            onClose={() => setActivePopupId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
