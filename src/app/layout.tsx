import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Elliot Anderson",
    template: "%s · Elliot Anderson",
  },
  description:
    "Software engineer building things at the intersection of systems programming, developer tooling, and the web.",
  authors: [{ name: "Elliot Anderson" }],
  creator: "Elliot Anderson",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Elliot Anderson",
    title: "Elliot Anderson",
    description:
      "Software engineer building things at the intersection of systems programming, developer tooling, and the web.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
