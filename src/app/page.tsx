// src/app/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
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
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  const cardVariants = [
    { borderColor: "#FF6B6B", badgeClass: "badge-coral", badgeLabel: "Mới" },
    { borderColor: "#4ECDC4", badgeClass: "badge-sky",   badgeLabel: "Hot" },
    { borderColor: "#C8B8E8", badgeClass: "badge-lavender", badgeLabel: "Featured" },
  ];

  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section style={{ padding: "80px 0 64px" }}>
        <div className="container">
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "24px",
            maxWidth: "720px",
            margin: "0 auto",
          }}>
            <span className="badge badge-coral" style={{ fontSize: "0.85rem", padding: "6px 20px" }}>
              🎉 Chào mừng bạn đến với Simple Blog
            </span>

            <h1 style={{
              fontSize: "var(--fs-display)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "var(--clr-text)",
              margin: 0,
            }}>
              Bài viết{" "}
              <span style={{ color: "var(--clr-coral)", position: "relative", display: "inline-block" }}>
                mới nhất
                {/* Wavy underline via SVG */}
                <svg viewBox="0 0 200 14" style={{ position: "absolute", bottom: "-4px", left: 0, width: "100%", height: "14px", overflow: "visible" }} aria-hidden="true">
                  <path d="M2 9 Q50 2 100 9 Q150 16 198 9" stroke="#FFE66D" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p style={{ fontSize: "var(--fs-h3)", color: "var(--clr-text-muted)", maxWidth: "480px", fontWeight: 500, margin: 0 }}>
              Khám phá các bài viết từ cộng đồng của chúng tôi 🌟
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              {["✍️ Viết blog", "💬 Bình luận", "❤️ Like bài"].map((item) => (
                <span key={item} style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  background: "var(--clr-surface)",
                  border: "3px solid var(--clr-border)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "var(--clr-text-muted)",
                  boxShadow: "var(--shadow-sm)",
                }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section style={{ paddingBottom: "96px" }}>
        <div className="container">
          {posts && posts.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "28px",
            }}>
              {posts.map((post, index) => {
                const v = cardVariants[index % cardVariants.length];
                return (
                  <article
                    key={post.id}
                    className="clay-card"
                    style={{ borderColor: v.borderColor }}
                  >
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                      <span className={`badge ${v.badgeClass}`}>{v.badgeLabel}</span>
                      <time style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString("vi-VN", {
                              year: "numeric", month: "long", day: "numeric",
                            })
                          : ""}
                      </time>
                    </div>

                    {/* Title */}
                    <Link href={`/posts/${post.slug}`} style={{ textDecoration: "none" }}>
                      <h2 className="post-card-title" style={{ marginBottom: "10px" }}>
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p style={{
                        color: "var(--clr-text-muted)",
                        lineHeight: 1.6,
                        fontSize: "0.925rem",
                        marginBottom: "16px",
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      } as React.CSSProperties}>
                        {post.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "2px solid rgba(0,0,0,0.06)",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="clay-avatar-placeholder" style={{ width: 28, height: 28, fontSize: "0.75rem" }}>
                          {(post.profiles?.display_name || "?").charAt(0).toUpperCase()}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--clr-text)" }}>
                          {post.profiles?.display_name || "Ẩn danh"}
                        </span>
                      </div>

                      <Link
                        href={`/posts/${post.slug}`}
                        className="btn btn-ghost"
                        style={{ padding: "6px 16px", minHeight: "36px", fontSize: "0.85rem", borderColor: v.borderColor, color: v.borderColor }}
                      >
                        Đọc tiếp →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="empty-state" style={{ maxWidth: "500px", margin: "0 auto" }}>
              <span className="empty-state-icon">📝</span>
              <p style={{ fontWeight: 800, fontSize: "var(--fs-h2)", color: "var(--clr-text)", margin: "0 0 8px" }}>
                Chưa có bài viết nào!
              </p>
              <p style={{ color: "var(--clr-text-muted)", margin: "0 0 28px" }}>
                Hãy là người đầu tiên chia sẻ ý tưởng với cộng đồng 🌟
              </p>
              <Link href="/register" className="btn btn-primary">
                Đăng ký &amp; viết bài đầu tiên 🚀
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
