// src/components/dashboard/post-list.tsx
import Link from "next/link";
import { Post } from "@/types/database";
import { DeletePostButton } from "./delete-post-button";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const borderColors = ["var(--clr-lavender)", "var(--clr-coral)", "var(--clr-sky)"];
  const shadowVars = ["var(--shadow-lavender)", "var(--shadow-coral)", "var(--shadow-sky)"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {posts.map((post, index) => {
        const isPublished = post.status === "published";
        const border = borderColors[index % 3];
        const shadow = shadowVars[index % 3];

        return (
          <div
            key={post.id}
            className="clay-card"
            style={{
              borderColor: border === "var(--clr-lavender)" ? "#C8B8E8" : border === "var(--clr-coral)" ? "#FF6B6B" : "#4ECDC4",
              boxShadow: shadow,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              padding: "20px 24px",
            }}
          >
            {/* Left: Info */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--clr-text)", margin: 0, lineHeight: 1.3, wordBreak: "break-word" }}>
                  {post.title}
                </h2>
                <span style={{
                  flexShrink: 0,
                  padding: "3px 12px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: `2px solid ${isPublished ? "#3ab5ac" : "#e8d000"}`,
                  background: isPublished ? "#f0fffe" : "#fffcf0",
                  color: isPublished ? "#2aada3" : "#a08c00",
                }}>
                  {isPublished ? "🌐 Đã xuất bản" : "📝 Bản nháp"}
                </span>
              </div>

              {post.excerpt && (
                <p style={{
                  color: "var(--clr-text-muted)",
                  fontSize: "0.875rem",
                  margin: 0,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                } as React.CSSProperties}>
                  {post.excerpt}
                </p>
              )}

              <p style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", fontWeight: 600, margin: 0 }}>
                {isPublished && post.published_at
                  ? `Xuất bản: ${new Date(post.published_at).toLocaleDateString("vi-VN")}`
                  : `Tạo: ${new Date(post.created_at).toLocaleDateString("vi-VN")}`}
                {" · "}Cập nhật: {new Date(post.updated_at).toLocaleDateString("vi-VN")}
              </p>
            </div>

            {/* Right: Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              {isPublished && (
                <Link
                  href={`/posts/${post.slug}`}
                  target="_blank"
                  className="btn btn-ghost"
                  style={{ padding: "6px 14px", minHeight: "36px", fontSize: "0.85rem" }}
                >
                  Xem
                </Link>
              )}
              <Link
                href={`/dashboard/edit/${post.id}`}
                className="btn btn-secondary"
                style={{ padding: "6px 14px", minHeight: "36px", fontSize: "0.85rem" }}
              >
                ✏️ Sửa
              </Link>
              <DeletePostButton postId={post.id} postTitle={post.title} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
