// src/app/posts/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { CommentForm } from "@/components/posts/comment-form";
import { RealtimeComments } from "@/components/posts/realtime-comments";
import { LikeButton } from "@/components/posts/like-button";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return {
    title: post?.title || "Bài viết",
    description: post?.excerpt || "",
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Lấy bài viết
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles (
        display_name,
        avatar_url
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    notFound();
  }

  // Lấy comments kèm profile
  const { data: comments } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles (
        display_name,
        avatar_url
      )
    `
    )
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  // Kiểm tra user đã đăng nhập chưa
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lấy likes
  const { count: likeCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id);

  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Back Link */}
        <Link
          href="/"
          className="btn btn-ghost"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            padding: "8px 16px",
            fontSize: "0.9rem",
            textDecoration: "none"
          }}
        >
          ← Quay lại trang chủ
        </Link>

        {/* Article Card */}
        <article style={{
          background: "#fff",
          borderRadius: "var(--radius-xl)",
          border: "3px solid var(--clr-lavender)",
          padding: "48px",
          boxShadow: "var(--shadow-lavender)",
          marginBottom: "48px"
        }}>
          <header style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span className="badge badge-coral">Blog Post</span>
              <time style={{ fontSize: "0.9rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
                 {post.published_at && new Date(post.published_at).toLocaleDateString("vi-VN", {
                    year: "numeric", month: "long", day: "numeric",
                 })}
              </time>
            </div>

            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "var(--clr-text)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              margin: "0 0 16px"
            }}>
              {post.title}
            </h1>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 0",
              borderBottom: "2px dashed var(--clr-border)"
            }}>
              <span className="clay-avatar-placeholder" style={{ width: 40, height: 40, fontSize: "1rem" }}>
                {(post.profiles?.display_name || "?").charAt(0).toUpperCase()}
              </span>
              <div>
                <div style={{ fontWeight: 800, color: "var(--clr-text)" }}>
                  {post.profiles?.display_name || "Ẩn danh"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", fontWeight: 500 }}>
                  Tác giả bài viết
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose" style={{
            fontSize: "1.1rem",
            lineHeight: 1.8,
            color: "var(--clr-text)",
            marginBottom: "40px"
          }}>
            <ReactMarkdown>{post.content || ""}</ReactMarkdown>
          </div>

          {/* Like Button area */}
          <div style={{ display: "flex", justifyContent: "center", borderTop: "2px dashed var(--clr-border)", paddingTop: "32px" }}>
             <LikeButton postId={post.id} initialLikeCount={likeCount || 0} />
          </div>
        </article>

        {/* Comments Section */}
        <section style={{
          background: "var(--clr-surface)",
          borderRadius: "var(--radius-xl)",
          border: "3px solid var(--clr-sky)",
          padding: "40px",
          boxShadow: "var(--shadow-sky)"
        }}>
          <h2 style={{
            fontSize: "var(--fs-h2)",
            fontWeight: 800,
            color: "var(--clr-text)",
            margin: "0 0 24px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <span>💬 Bình luận</span>
            <span style={{
              fontSize: "1rem",
              background: "var(--clr-sky)",
              color: "#fff",
              padding: "2px 12px",
              borderRadius: "999px",
              border: "2px solid #3ab5ac"
            }}>
              {comments?.length || 0}
            </span>
          </h2>

          {/* Comment form */}
          {user ? (
            <div style={{ marginBottom: "40px" }}>
              <CommentForm postId={post.id} />
            </div>
          ) : (
            <div style={{
              background: "#fff",
              borderRadius: "var(--radius-lg)",
              border: "3px solid var(--clr-yellow)",
              padding: "20px",
              marginBottom: "32px",
              textAlign: "center",
              boxShadow: "var(--shadow-yellow)"
            }}>
              <p style={{ margin: 0, fontWeight: 700, color: "var(--clr-text)" }}>
                👋 Bạn cần{" "}
                <Link href="/login" style={{ color: "var(--clr-coral)", textDecoration: "none", borderBottom: "2px solid" }}>
                  đăng nhập
                </Link>
                {" "}để để lại bình luận.
              </p>
            </div>
          )}

          {/* Realtime comments list */}
          <RealtimeComments
            postId={post.id}
            initialComments={comments || []}
          />
        </section>
      </div>
    </main>
  );
}
