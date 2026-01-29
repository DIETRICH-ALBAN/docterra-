import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocTerra | Quantum Academic Document Factory",
  description: "Automated high-end reports and strategic presentations by WebTerra Agency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <div className="nebula-bg" />
        {children}
      </body>

    </html>


  );
}
