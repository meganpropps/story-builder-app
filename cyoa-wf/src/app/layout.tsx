import "./globals.css";
import React, { ReactNode } from "react";

export const metadata = { title: "CYOA Builder", description: "Next.js + Supabase starter" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">{children}</body>
    </html>
  );
}
