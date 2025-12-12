import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export const metadata: Metadata = {
  title: "Symphonia - Digital First",
  description:
    "The First Media Company crafted For the Digital First generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Script
          src="https://unpkg.com/lenis@1.1.19/dist/lenis.min.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
