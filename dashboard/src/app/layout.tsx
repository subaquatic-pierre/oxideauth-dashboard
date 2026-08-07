import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OxideAuth Dashboard",
  description: "Admin dashboard for managing the OxideAuth IAM platform",
};

const flashScript = `(function(){try{var e=localStorage.getItem("theme");e||(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");"dark"===e&&document.documentElement.classList.add("dark")}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <script
          id="theme-flash-prevention"
          dangerouslySetInnerHTML={{ __html: flashScript }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
