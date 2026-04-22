// src/app/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

interface HomePageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { query = "", page = "1" } = await searchParams;
  const supabase = await createClient();
  
  const pageSize = 6;
  const currentPage = parseInt(page);
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build query
  let postsQuery = supabase
    .from("posts")
    .select(
      `
      *,
      profiles (
        display_name,
        avatar_url
      )
    `,
      { count: "exact" }
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // Add search if query exists
  if (query) {
    postsQuery = postsQuery.ilike("title", `%${query}%`);
  }

  // Add pagination
  postsQuery = postsQuery.range(from, to);

  const { data: posts, count, error } = await postsQuery;

  if (error) {
    console.error("Error fetching posts:", error);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  const cardVariants = [
    { borderColor: "#FF6B6B", badgeClass: "badge-coral", badgeLabel: "Mới" },
    { borderColor: "#4ECDC4", badgeClass: "badge-sky", badgeLabel: "Hot" },
    { borderColor: "#C8B8E8", badgeClass: "badge-lavender", badgeLabel: "Featured" },
  ];

  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section style={{ padding: "64px 0 48px" }}>
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
              {query ? (
                <>Kết quả tìm kiếm cho <span style={{ color: "var(--clr-coral)" }}>"{query}"</span></>
              ) : (
                <>
                  Bài viết{" "}
                  <span style={{ color: "var(--clr-coral)", position: "relative", display: "inline-block" }}>
                    mới nhất
                    <svg viewBox="0 0 200 14" style={{ position: "absolute", bottom: "-4px", left: 0, width: "100%", height: "14px", overflow: "visible" }} aria-hidden="true">
                      <path d="M2 9 Q50 2 100 9 Q150 16 198 9" stroke="#FFE66D" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                </>
              )}
            </h1>

            {/* Search Bar */}
            <form action="/" method="GET" style={{ width: "100%", maxWidth: "500px", marginTop: "12px" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  name="query"
                  defaultValue={query}
                  placeholder="Tìm kiếm bài viết..."
                  className="clay-input"
                  style={{ paddingRight: "100px", boxShadow: "var(--shadow-sm)" }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "6px",
                    padding: "6px 16px",
                    minHeight: "auto",
                    height: "calc(100% - 12px)",
                    fontSize: "0.8rem"
                  }}
                >
                  🔍 Tìm
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section style={{ paddingBottom: "96px" }}>
        <div className="container">
          {posts && posts.length > 0 ? (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                gap: "28px",
                marginBottom: "48px"
              }}>
                {posts.map((post, index) => {
                  const v = cardVariants[index % cardVariants.length];
                  return (
                    <article
                      key={post.id}
                      className="clay-card"
                      style={{ borderColor: v.borderColor, height: "100%", display: "flex", flexDirection: "column" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                        <span className={`badge ${v.badgeClass}`}>{v.badgeLabel}</span>
                        <time style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
                          {post.published_at ? new Date(post.published_at).toLocaleDateString("vi-VN") : ""}
                        </time>
                      </div>

                      <Link href={`/posts/${post.slug}`} style={{ textDecoration: "none" }}>
                        <h2 className="post-card-title" style={{ marginBottom: "10px" }}>
                          {post.title}
                        </h2>
                      </Link>

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

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "12px",
                        borderTop: "2px solid rgba(0,0,0,0.06)",
                        gap: "8px",
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
                          style={{ padding: "6px 12px", minHeight: "32px", fontSize: "0.8rem" }}
                        >
                          Đọc →
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                  {currentPage > 1 && (
                    <Link
                      href={`/?query=${query}&page=${currentPage - 1}`}
                      className="btn btn-ghost"
                      style={{ padding: "8px 16px" }}
                    >
                      ← Trước
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/?query=${query}&page=${p}`}
                      className={`btn ${p === currentPage ? "btn-primary" : "btn-ghost"}`}
                      style={{ minWidth: "44px", padding: "8px" }}
                    >
                      {p}
                    </Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link
                      href={`/?query=${query}&page=${currentPage + 1}`}
                      className="btn btn-ghost"
                      style={{ padding: "8px 16px" }}
                    >
                      Sau →
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ maxWidth: "500px", margin: "0 auto" }}>
              <span className="empty-state-icon">🔍</span>
              <p style={{ fontWeight: 800, fontSize: "var(--fs-h2)", color: "var(--clr-text)", margin: "0 0 8px" }}>
                {query ? "Không tìm thấy bài viết!" : "Chưa có bài viết nào!"}
              </p>
              <p style={{ color: "var(--clr-text-muted)", margin: "0 0 28px" }}>
                {query ? "Thử lại với từ khóa khác nhé 🌟" : "Hãy là người đầu tiên chia sẻ ý tưởng 🚀"}
              </p>
              <Link href={query ? "/" : "/register"} className="btn btn-primary">
                {query ? "Xem tất cả bài viết" : "Đăng ký & viết bài"}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
