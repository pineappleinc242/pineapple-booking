import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Pineapple Inc. Studios - Real Estate Media",
  description: "Cinematic property media that sells faster. Professional photography, videography, drone services, and visual marketing for real estate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="relative min-h-screen flex flex-col bg-black font-sans text-white">
        
        {/* Global Cinematic Film Overlay */}
        <div className="pointer-events-none fixed inset-0 z-40 max-w-[100vw] overflow-hidden">
          <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/10 backdrop-contrast-125 backdrop-saturate-50"></div>
        </div>

        <Navbar />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </body>
    </html>
  );
}
