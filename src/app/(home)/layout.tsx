import { Cinzel, Inter } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export default function HomeLandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${cinzel.variable} ${inter.variable} min-h-svh text-zinc-100 [font-family:var(--font-inter),ui-sans-serif,system-ui]`}
    >
      {children}
    </div>
  );
}
