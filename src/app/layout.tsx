import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ai-ternary | AI Multi-Algorithm Travel Route Optimization Engine",
  description: "AI travel itinerary route planner and benchmark arena using A* Search (MST Heuristic), Genetic Algorithms, Greedy Search, BFS, DFS, and OpenStreetMap GIS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FFF5F8] text-zinc-800">
        {children}
      </body>
    </html>
  );
}
