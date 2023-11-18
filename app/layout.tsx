import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next-Shop",
  description: "Nextjs 로 만든 shopping-mall",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <h1 className="text-3xl">NAV BAR</h1>
        {children}
      </body>
    </html>
  );
}
