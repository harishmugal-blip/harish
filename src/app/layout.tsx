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
  title: "Harish — Website Designer & Backend Developer • POS Software (Windows 7 Edition)",
  description:
    "Harish ka portfolio — Windows 7 desktop style, fully interactive. Website Designer & Backend Developer (POS Software), IIT Roorkee bootcamp trained. 151 songs music library + J.A.R.V.I.S AI assistant.",
  keywords: ["Harish", "portfolio", "website designer", "backend developer", "POS software", "Windows 7", "JARVIS", "Muzaffarnagar"],
  authors: [{ name: "Harish" }],
  icons: {
    icon: "/win7-logo.svg",
  },
  openGraph: {
    title: "Harish — Portfolio (Windows 7 Edition)",
    description: "Windows 7 desktop portfolio with J.A.R.V.I.S AI assistant and 151-song music library. Click 'Activate Windows' 😉",
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
