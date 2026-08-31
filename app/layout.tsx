import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Blog | Zeecomedia",
    template: "%s | Zeecomedia Blog",
  },
  description:
    "Insights on web, mobile, API, cloud, and AI development from the Zeecomedia team.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link
              href="https://zeecomedia.net"
              className="font-semibold text-lg text-[var(--dark)]"
            >
              Zeecomedia
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-[var(--dark)] hover:text-[var(--primary)]">
                Blog
              </Link>
              <Link
                href="https://zeecomedia.net/#services"
                className="text-[var(--dark)] hover:text-[var(--primary)]"
              >
                Services
              </Link>
              <Link
                href="https://zeecomedia.net/#contact"
                className="text-[var(--white)] bg-[var(--primary)] px-4 py-2 rounded-full hover:bg-[var(--primary-dark)] transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 mt-16">
          <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-[var(--gray)] flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} Zeecomedia</span>
            <Link href="https://zeecomedia.net" className="hover:text-[var(--primary)]">
              zeecomedia.net
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
