// src/app/dashboard/new/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PostForm } from "@/components/dashboard/post-form";

export const metadata: Metadata = {
  title: "Viết bài mới",
};

export default function NewPostPage() {
  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px", fontSize: "0.875rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
          <Link href="/dashboard" style={{ color: "var(--clr-coral)", textDecoration: "none", fontWeight: 700 }}>Dashboard</Link>
          <span>→</span>
          <span>Viết bài mới</span>
        </div>

        <h1 style={{
          fontSize: "var(--fs-h1)",
          fontWeight: 800,
          color: "var(--clr-text)",
          margin: "0 0 32px",
          letterSpacing: "-0.02em",
        }}>
          ✦ Viết bài mới
        </h1>

        <div style={{
          background: "#fff",
          borderRadius: "var(--radius-xl)",
          border: "3px solid var(--clr-lavender)",
          padding: "36px",
          boxShadow: "var(--shadow-lavender)",
        }}>
          <PostForm />
        </div>
      </div>
    </main>
  );
}
