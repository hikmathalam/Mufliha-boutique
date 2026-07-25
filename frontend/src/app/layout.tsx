import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import PublicLayout from "@/components/PublicLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mufliha Boutique | Warranty Gold Jewellery & Bridal Rental",
  description: "Premium warranty gold jewellery showroom and bridal rental boutique offering gold-plated designs with up to 6 months warranty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-brown-900 text-gold-50 dark:bg-brown-900 dark:text-gold-50">
        <AuthProvider>
          <PublicLayout>
            {children}
          </PublicLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
