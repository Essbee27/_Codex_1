import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Compare",
  description: "Compare and estimate cost for large language models using mock provider data."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
