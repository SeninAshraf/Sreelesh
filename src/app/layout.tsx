import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google"; // Import Cinzel
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "Sreelesh C. | Visual Content Creator",
  description: "Portfolio of Sreelesh C., a Visual Content Creator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/videos/senin.mp4" as="video" type="video/mp4" />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} font-sans bg-[#121212] text-white antialiased`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
