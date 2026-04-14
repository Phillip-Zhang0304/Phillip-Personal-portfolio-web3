"use client";

import { useEffect, useRef } from "react";

type InteractiveDotGridProps = {
  className?: string;
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
};

type Dot = {
  x: number;
  y: number;
  intensity: number;
  velocity: number;
};

type PointerState = {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  speed: number;
  active: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const numeric = Number.parseInt(value, 16);
  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255
  };
}

function mixColor(baseHex: string, activeHex: string, amount: number) {
  const base = hexToRgb(baseHex);
  const active = hexToRgb(activeHex);

  return `rgb(${Math.round(base.r + (active.r - base.r) * amount)}, ${Math.round(
    base.g + (active.g - base.g) * amount
  )}, ${Math.round(base.b + (active.b - base.b) * amount)})`;
}

export function InteractiveDotGrid({
  className = "",
  dotSize = 4,
  gap = 10,
  baseColor = "#0f0c1d",
  activeColor = "#a9ff29",
  proximity = 160,
  speedTrigger = 190,
  shockRadius = 140,
  shockStrength = 7.5,
  maxSpeed = 8000,
  resistance = 2000,
  returnDuration = 2.5
}: InteractiveDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let lastTime = performance.now();
    const eventTarget = container.parentElement ?? container;
    const pointer: PointerState = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      speed: 0,
      active: false
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const step = dotSize + gap;
      for (let y = dotSize / 2; y < height + step; y += step) {
        for (let x = dotSize / 2; x < width + step; x += step) {
          dots.push({ x, y, intensity: 0, velocity: 0 });
        }
      }
    };

    const draw = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      context.clearRect(0, 0, width, height);

      for (const dot of dots) {
        let target = 0;

        if (pointer.active) {
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < proximity) {
            target = 1 - distance / proximity;
          }

          if (pointer.speed > speedTrigger && distance < shockRadius) {
            const shock =
              (1 - distance / shockRadius) *
              (pointer.speed / maxSpeed) *
              shockStrength;
            target = Math.max(target, Math.min(1, shock));
          }
        }

        // Damped interpolation with a little overshoot from velocity.
        const spring = resistance * delta * 0.0008;
        dot.velocity += (target - dot.intensity) * spring;
        dot.velocity *= 1 - delta / Math.max(returnDuration, 0.001);
        dot.intensity = clamp(dot.intensity + dot.velocity, 0, 1);

        const sizeBoost = dotSize + dot.intensity * dotSize * 0.9;
        context.fillStyle = mixColor(baseColor, activeColor, dot.intensity);
        context.beginPath();
        context.arc(dot.x, dot.y, sizeBoost / 2, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dx = x - pointer.lastX;
      const dy = y - pointer.lastY;
      const distance = Math.hypot(dx, dy);
      const dt = Math.max((performance.now() - lastTime) / 1000, 0.001);

      pointer.lastX = x;
      pointer.lastY = y;
      pointer.x = x;
      pointer.y = y;
      pointer.speed = clamp(distance / dt, 0, maxSpeed);
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
      pointer.speed = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    animationFrame = window.requestAnimationFrame(draw);

    eventTarget.addEventListener("pointermove", onMove);
    eventTarget.addEventListener("pointerleave", onLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      eventTarget.removeEventListener("pointermove", onMove);
      eventTarget.removeEventListener("pointerleave", onLeave);
    };
  }, [
    activeColor,
    baseColor,
    dotSize,
    gap,
    maxSpeed,
    proximity,
    resistance,
    returnDuration,
    shockRadius,
    shockStrength,
    speedTrigger
  ]);

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} ref={containerRef}>
      <canvas className="absolute inset-0 h-full w-full" ref={canvasRef} />
    </div>
  );
}
