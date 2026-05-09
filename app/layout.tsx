import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Herbal Wellness Library",
  description: "Premium herbal tea tutorials, wellness recipes, and natural living education.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900">
        <header className="border-b border-stone-200 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="/" className="text-xl font-bold">
              Herbal Wellness
            </a>

            <div className="flex items-center gap-6 text-sm font-medium">
              <a href="/catalog" className="hover:text-green-700">
                Catalog
              </a>
              <a href="/login" className="hover:text-green-700">
                Login
              </a>
              <a
                href="/signup"
                className="rounded-full bg-green-700 px-4 py-2 text-white hover:bg-green-800"
              >
                Get Started
              </a>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-stone-600">
            © {new Date().getFullYear()} Herbal Wellness Library. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}