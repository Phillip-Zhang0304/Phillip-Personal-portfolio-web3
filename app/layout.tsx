import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

const aeonik = localFont({
  src: [
    {
      path: "./fonts/AeonikPro-Regular400.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/AeonikPro-Medium500.otf",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/AeonikPro-SemiBold600.otf",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/AeonikPro-Bold700.otf",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-aeonik",
  display: "swap"
});

const anton = localFont({
  src: "./fonts/Anton.ttf",
  variable: "--font-anton",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Astra Portfolio",
  description: "Advanced designer portfolio with AI, 3D and motion-driven storytelling."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${aeonik.variable} ${anton.variable} bg-ink text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
