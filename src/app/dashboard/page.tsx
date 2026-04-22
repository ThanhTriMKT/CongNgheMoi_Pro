// src/app/dashboard/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PostList } from "@/components/dashboard/post-list";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  const published = posts?.filter((p) => p.status === "published").length ?? 0;
  const drafts = posts?.filter((p) => p.status === "draft").length ?? 0;
  const total = posts?.length ?? 0;

  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container">

        {/* Page header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}>
          <div>
            <h1 style={{
              fontSize: "var(--fs-h1)",
              fontWeight: 800,
              color: "var(--clr-text)",
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}>
              ✍️ Bài viết của tôi
            </h1>
            <p style={{ color: "var(--clr-text-muted)", fontWeight: 600, margin: 0 }}>
              Quản lý và theo dõi tất cả bài viết của bạn
            </p>
          </div>

          <Link href="/dashboard/new" className="btn btn-primary" style={{ flexShrink: 0 }}>
            ✦ Viết bài mới
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}>
          {[
            { label: "Tổng bài", value: total, color: "var(--clr-lavender)", shadow: "var(--shadow-lavender)", border: "#b09dd4", emoji: "📚" },
            { label: "Đã xuất bản", value: published, color: "var(--clr-sky)", shadow: "var(--shadow-sky)", border: "#3ab5ac", emoji: "🌐" },
            { label: "Bản nháp", value: drafts, color: "var(--clr-yellow)", shadow: "var(--shadow-yellow)", border: "#e8d000", emoji: "📝" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#fff",
                borderRadius: "var(--radius-lg)",
                border: `3px solid ${stat.border}`,
                padding: "24px 20px",
                boxShadow: stat.shadow,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "2rem" }}>{stat.emoji}</span>
              <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--clr-text)", lineHeight: 1 }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--clr-text-muted)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Posts list */}
        {posts && posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon">✍️</span>
            <p style={{
              fontWeight: 800,
              fontSize: "var(--fs-h2)",
              color: "var(--clr-text)",
              margin: "0 0 8px",
            }}>
              Chưa có bài viết nào!
            </p>
            <p style={{ color: "var(--clr-text-muted)", margin: "0 0 28px" }}>
              Hãy bắt đầu viết bài đầu tiên của bạn 🚀
            </p>
            <Link href="/dashboard/new" className="btn btn-primary">
              ✦ Viết bài đầu tiên
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
