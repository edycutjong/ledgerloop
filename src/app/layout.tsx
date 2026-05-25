import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ledgerloop.edycu.dev"),
  title: "LedgerLoop — AI-Orchestrated Trustless Rotating Savings Circles",
  description:
    "AI-orchestrated rotating savings circles backed by Solidity smart contract escrows and dynamic Graph Neural Network credit-risk scoring.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "LedgerLoop — AI-Orchestrated Trustless Rotating Savings Circles",
    description:
      "Replace human organizers with on-chain escrow and GNN trust scoring.",
    url: "https://ledgerloop.edycu.dev",
    siteName: "LedgerLoop",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LedgerLoop" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LedgerLoop — AI-Orchestrated Trustless Rotating Savings Circles",
    description:
      "Replace human organizers with on-chain escrow and GNN trust scoring.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
