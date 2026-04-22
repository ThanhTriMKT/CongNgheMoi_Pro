// src/app/dashboard/edit/[id]/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { PostForm } from "@/components/dashboard/post-form";
import Link from "next/link";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Chỉnh sửa bài viết",
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RLS đảm bảo chỉ author mới có thể lấy bài của mình
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("author_id", user.id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px", fontSize: "0.875rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
          <Link href="/dashboard" style={{ color: "var(--clr-coral)", textDecoration: "none", fontWeight: 700 }}>Dashboard</Link>
          <span>→</span>
          <span>Chỉnh sửa bài viết</span>
        </div>

        <h1 style={{
          fontSize: "var(--fs-h1)",
          fontWeight: 800,
          color: "var(--clr-text)",
          margin: "0 0 32px",
          letterSpacing: "-0.02em",
        }}>
          ✏️ Chỉnh sửa bài viết
        </h1>

        <div style={{
          background: "#fff",
          borderRadius: "var(--radius-xl)",
          border: "3px solid var(--clr-sky)",
          padding: "36px",
          boxShadow: "var(--shadow-sky)",
        }}>
          <PostForm post={post} />
        </div>
      </div>
    </main>
  );
}
