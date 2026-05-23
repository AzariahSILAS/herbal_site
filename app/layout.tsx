import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Herbal Wellness Library",
  description:
    "Premium herbal tea tutorials, wellness recipes, and natural living education.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900">
        <Header />

        <main>{children}</main>

        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-stone-600">
            © {new Date().getFullYear()} Herbal Wellness Library. All rights
            reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}