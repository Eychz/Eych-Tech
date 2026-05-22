import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/Toast";

import { Footer } from "@/components/layout/Footer";
import { FloatingChatHead } from "@/components/chat/FloatingChatHead";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Eych Tech | Premium Gadgets",
  description: "The premium destination for your tech needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased pt-14 flex flex-col min-h-screen`}>
        <ToastProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingChatHead />
        </ToastProvider>
      </body>
    </html>
  );
}
