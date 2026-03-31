import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Career Map - CakeAI",
  description: "AI Career Map Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="h-screen flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
