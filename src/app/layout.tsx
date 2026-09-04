import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aarav Dosanjh — Portfolio (Windows 7 Edition)",
  description:
    "Full-stack developer portfolio built as a Windows 7 desktop — nostalgic, interactive and fully functional. About, Projects, Skills, Resume and Contact — sab ek desktop pe.",
  keywords: ["portfolio", "Windows 7", "developer", "full-stack", "React", "Next.js", "nostalgia"],
  authors: [{ name: "Aarav Dosanjh" }],
  icons: {
    icon: "/avatar.png",
  },
  openGraph: {
    title: "Aarav Dosanjh — Portfolio (Windows 7 Edition)",
    description: "My portfolio, served fresh out of 2009. Click the icons. Nostalgia guaranteed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
