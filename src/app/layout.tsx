// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: {
    default: "Simple Blog ✍️",
    template: "%s | Simple Blog",
  },
  description: "Ứng dụng blog cá nhân xây dựng với Next.JS và Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <div style={{ minHeight: "calc(100vh - 76px)", position: "relative", zIndex: 1 }}>
          {children}
        </div>
        <footer style={{
          borderTop: "3px solid var(--clr-border)",
          marginTop: "96px",
          padding: "40px 24px",
          textAlign: "center",
          background: "var(--clr-surface)",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "1.5rem" }}>✍️</span>
            <span style={{ fontWeight: 700, color: "var(--clr-text-muted)", fontSize: "var(--fs-small)" }}>
              Simple Blog — Xây dựng với{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--clr-coral)", fontWeight: 800, textDecoration: "none" }}
              >
                Next.JS
              </a>
              {" "}&{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--clr-sky)", fontWeight: 800, textDecoration: "none" }}
              >
                Supabase
              </a>
            </span>
            <span style={{ fontSize: "1.2rem" }}>🚀</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
