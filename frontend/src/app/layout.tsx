import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Nav from "@/components/layout/Nav";
import { PROFILE } from "@/content/site";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "WONK", "opsz"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

// Used for link previews. On Vercel the production domain is provided automatically.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
const DESCRIPTION = `${PROFILE.fullName}: Computer Science student, software developer, AI automation builder and content creator based in ${PROFILE.location}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${PROFILE.name} · Developer, AI Automation & Content Creator`, template: `%s · ${PROFILE.name}` },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: `${PROFILE.name} · Developer, AI Automation & Content Creator`,
    description: DESCRIPTION,
    images: [{ url: PROFILE.headshot, width: 800, height: 1000, alt: `Portrait of ${PROFILE.name}` }],
  },
  twitter: { card: "summary_large_image", title: PROFILE.name, description: DESCRIPTION, images: [PROFILE.headshot] },
};

export const viewport: Viewport = { themeColor: "#f7f2ea", colorScheme: "light" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${mono.variable}`}>
      <body className="grain min-h-screen">
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
