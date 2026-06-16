import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import PageTransition from "@/components/page-transition";

export const metadata: Metadata = {
  title: "Avika Mind Hub - Where Technology Meets Therapy",
  description:
    "Reflect and reset in a private, supportive space with professionals using tools to deepen therapy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-screen w-screen antialiased"
      suppressHydrationWarning
    >
      <body className="h-full w-full flex flex-col overflow-hidden">
        {/* Note: added overflow-hidden to body to prevent scrollbars during slides/spins */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="grid min-h-screen w-full">
            {/* Try changing these props! */}
            {/* type: "fade" | "scale" | "slide" | "flip" | "blur" | "zoom-spin" */}
            {/* direction: "up" | "down" | "left" | "right" | "none" */}
            <PageTransition type="blur" duration={0.5}>
              {children}
            </PageTransition>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
