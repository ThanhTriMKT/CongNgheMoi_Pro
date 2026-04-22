// src/components/dashboard/post-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Post, PostStatus } from "@/types/database";

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [status, setStatus] = useState<PostStatus>(post?.status || "draft");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Bạn cần đăng nhập để thực hiện thao tác này");
        return;
      }

      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || null,
        status,
        author_id: user.id,
        published_at:
          status === "published"
            ? post?.published_at || new Date().toISOString()
            : null,
      };

      if (isEditing) {
        const { error } = await supabase.from("posts").update(postData).eq("id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(postData);
        if (error) throw error;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="post-title" className="clay-label">
          Tiêu đề <span style={{ color: "var(--clr-coral)" }}>*</span>
        </label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="clay-input"
          style={{ fontSize: "1.1rem", fontWeight: 700 }}
          placeholder="Nhập tiêu đề bài viết..."
        />
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="post-excerpt" className="clay-label">
          Tóm tắt{" "}
          <span style={{ color: "var(--clr-text-muted)", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
            (hiển thị ở trang chủ)
          </span>
        </label>
        <input
          id="post-excerpt"
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="clay-input"
          placeholder="Mô tả ngắn về nội dung bài viết..."
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="post-content" className="clay-label">
          Nội dung{" "}
          <span style={{ color: "var(--clr-text-muted)", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
            (hỗ trợ Markdown)
          </span>
        </label>
        <textarea
          id="post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={18}
          className="clay-input"
          style={{ fontFamily: "'Courier New', monospace", fontSize: "0.9rem", resize: "vertical", lineHeight: 1.7 }}
          placeholder={`# Tiêu đề\n\nNội dung bài viết của bạn...\n\n## Mục 1\n\nViết nội dung ở đây...`}
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="post-status" className="clay-label">Trạng thái</label>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {([
            { value: "draft", label: "📝 Bản nháp", desc: "Chỉ mình tôi thấy" },
            { value: "published", label: "🌐 Xuất bản", desc: "Công khai cho mọi người" },
          ] as const).map((opt) => (
            <label
              key={opt.value}
              htmlFor={`status-${opt.value}`}
              style={{
                flex: 1,
                minWidth: "160px",
                cursor: "pointer",
                border: `3px solid ${status === opt.value ? (opt.value === "published" ? "var(--clr-sky)" : "var(--clr-yellow)") : "var(--clr-border)"}`,
                borderRadius: "var(--radius-md)",
                padding: "14px 18px",
                background: status === opt.value ? (opt.value === "published" ? "#f0fffe" : "#fffcf0") : "#fff",
                boxShadow: status === opt.value ? (opt.value === "published" ? "var(--shadow-sky)" : "var(--shadow-yellow)") : "none",
                transition: "all 200ms var(--ease)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <input
                type="radio"
                id={`status-${opt.value}`}
                name="post-status"
                value={opt.value}
                checked={status === opt.value}
                onChange={() => setStatus(opt.value)}
                style={{ width: "18px", height: "18px", accentColor: opt.value === "published" ? "var(--clr-sky)" : "var(--clr-yellow)" }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--clr-text)" }}>{opt.label}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--clr-text-muted)", fontWeight: 500 }}>{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "8px" }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost"
        >
          Hủy
        </button>
        <button
          id="post-submit-btn"
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading
            ? "Đang lưu..."
            : isEditing
            ? "💾 Cập nhật bài viết"
            : "✦ Tạo bài viết"}
        </button>
      </div>
    </form>
  );
}
