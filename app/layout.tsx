import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WebVitals from "./components/WebVitals";

// Optimize font loading with display: swap and preload
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Better font loading performance
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: true,
});

// Enhanced metadata for better SEO and performance
export const metadata: Metadata = {
  title: {
    default: "My Vinyl Collection | Discogs",
    template: "%s | My Vinyl Collection"
  },
  description: "Browse my personal vinyl record collection from Discogs. Discover albums across various genres and eras.",
  keywords: ["vinyl", "records", "music", "collection", "discogs", "albums"],
  authors: [{ name: "Justin Slack" }],
  creator: "Justin Slack",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "My Vinyl Collection",
    description: "Browse my personal vinyl record collection from Discogs",
    siteName: "My Vinyl Collection",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Vinyl Collection",
    description: "Browse my personal vinyl record collection from Discogs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Add viewport for better mobile performance
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <WebVitals />
      </body>
    </html>
  );
}
