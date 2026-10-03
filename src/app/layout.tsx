import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ai-ternary | AI Travel Route Optimization Engine",
  description: "AI-based travel itinerary route planner using Genetic Algorithms, Nearest Neighbor Heuristic Search, and OpenStreetMap GIS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#09090B] text-zinc-100">{children}</body>
    </html>
  );
}
