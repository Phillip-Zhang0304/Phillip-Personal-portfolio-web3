"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./curved-loop.module.css";

type CurvedLoopProps = {
  marqueeText: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
};

export function CurvedLoop({
  marqueeText,
  speed = 2,
  className,
  curveAmount = 400,
  direction = "left",
  interactive = true
}: CurvedLoopProps) {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0";
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId().replace(/:/g, "");
  const pathId = `curve-${uid}`;
  const pathD = `M-240,60 Q720,${60 + curveAmount} 1680,60`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join("")
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength());
    }
  }, [text, className]);

  useEffect(() => {
    if (!spacing || !textPathRef.current) {
      return;
    }

    const initial = -spacing;
    textPathRef.current.setAttribute("startOffset", `${initial}px`);
    setOffset(initial);
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready || !textPathRef.current) {
      return;
    }

    let frame = 0;

    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const currentOffset = Number.parseFloat(
          textPathRef.current.getAttribute("startOffset") || "0"
        );
        let nextOffset = currentOffset + delta;

        const wrapPoint = spacing;
        if (nextOffset <= -wrapPoint) {
          nextOffset += wrapPoint;
        }
        if (nextOffset > 0) {
          nextOffset -= wrapPoint;
        }

        textPathRef.current.setAttribute("startOffset", `${nextOffset}px`);
        setOffset(nextOffset);
      }

      frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [ready, spacing, speed]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    dragRef.current = true;
    lastXRef.current = event.clientX;
    velRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragRef.current || !textPathRef.current) {
      return;
    }

    const dx = event.clientX - lastXRef.current;
    lastXRef.current = event.clientX;
    velRef.current = dx;

    const currentOffset = Number.parseFloat(
      textPathRef.current.getAttribute("startOffset") || "0"
    );
    let nextOffset = currentOffset + dx;

    const wrapPoint = spacing;
    if (nextOffset <= -wrapPoint) {
      nextOffset += wrapPoint;
    }
    if (nextOffset > 0) {
      nextOffset -= wrapPoint;
    }

    textPathRef.current.setAttribute("startOffset", `${nextOffset}px`);
    setOffset(nextOffset);
  };

  const endDrag = () => {
    if (!interactive) {
      return;
    }

    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  const cursorStyle = interactive ? (dragRef.current ? "grabbing" : "grab") : "auto";

  return (
    <div
      className={styles.jacket}
      onPointerDown={onPointerDown}
      onPointerLeave={endDrag}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      style={{ cursor: cursorStyle, visibility: ready ? "visible" : "hidden" }}
    >
      <svg className={styles.svg} viewBox="0 0 1440 160">
        <text className={`${styles.loopText} ${styles.measure}`} ref={measureRef} xmlSpace="preserve">
          {text}
        </text>
        <defs>
          <path d={pathD} fill="none" id={pathId} stroke="transparent" />
        </defs>
        {ready && (
          <text
            className={`${styles.loopText}${className ? ` ${className}` : ""}`}
            fontWeight="bold"
            xmlSpace="preserve"
          >
            <textPath href={`#${pathId}`} ref={textPathRef} startOffset={`${offset}px`} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}
