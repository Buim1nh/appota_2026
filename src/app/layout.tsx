import type { Metadata } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import Link from "next/link";
import Button from "../components/Button";
import "./globals.css";

const press = Press_Start_2P({
  variable: "--font-press",
  weight: ["400"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dungeons & Dragons — Character Builder",
  description: "D&D inspired character builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${press.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="w-full border-b border-b-(--border) bg-transparent backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="h-10 w-10 flex-none rounded-sm bg-parchment/5 ornate-border flex items-center justify-center">
                <span className="text-xs text-gold">⚔️</span>
              </div>
              <span className="text-sm font-medium tracking-wide text-bright">
                D&D Builder
              </span>
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="dossier-subtle hover:text-bright no-underline"
              >
                Home
              </Link>
              <Link
                href="/builds"
                className="dossier-subtle hover:text-bright no-underline"
              >
                All Builds
              </Link>
              <Button href="/build" variant="primary" className="ml-3">
                Create Character
              </Button>
            </nav>
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8">
          {children}
        </main>

        <footer className="border-t border-t-(--border) bg-transparent py-6">
          <div className="mx-auto max-w-6xl px-6 text-sm dossier-subtle">
            © {new Date().getFullYear()} D&D Builder
          </div>
        </footer>
      </body>
    </html>
  );
}
