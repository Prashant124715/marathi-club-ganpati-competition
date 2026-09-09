import type { Metadata, Viewport } from "next";
import { Inter, Rozha_One } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const rozhaOne = Rozha_One({
  variable: "--font-rozha-one",
  weight: "400",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Ganpati Agman | Marathi Club",
  description: "Ganesh Chaturthi competition by Marathi Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${rozhaOne.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col pt-16 sm:pt-20 bg-background text-foreground antialiased selection:bg-saffron selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
