// src/components/posts/comment-list.tsx
import { Comment } from "@/types/database";

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "48px 24px",
        background: "#fff",
        borderRadius: "var(--radius-lg)",
        border: "3px dashed var(--clr-border)",
        color: "var(--clr-text-muted)",
        fontWeight: 600,
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "8px" }}>💬</div>
        Chưa có bình luận nào. Hãy là người đầu tiên!
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {comments.map((comment, index) => (
        <div
          key={comment.id}
          style={{
            background: "#fff",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            border: `3px solid ${index % 2 === 0 ? "var(--clr-lavender)" : "var(--clr-sky)"}`,
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="clay-avatar-placeholder" style={{ width: 32, height: 32, fontSize: "0.8rem" }}>
              {(comment.profiles?.display_name || "?").charAt(0).toUpperCase()}
            </span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 800, color: "var(--clr-text)", fontSize: "0.9rem" }}>
                {comment.profiles?.display_name || "Ẩn danh"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", fontWeight: 500 }}>
                {new Date(comment.created_at).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
          </div>
          <p style={{
            margin: 0,
            fontSize: "0.95rem",
            color: "var(--clr-text)",
            lineHeight: 1.6,
            paddingLeft: "42px"
          }}>
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}
