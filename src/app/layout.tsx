import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acadence — AI-Powered Course Scheduling",
  description:
    "Schedule smarter. AI-powered course scheduling that understands what you need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
