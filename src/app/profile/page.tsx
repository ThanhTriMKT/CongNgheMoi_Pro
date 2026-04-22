// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
        setAvatarUrl(data.avatar_url || "");
      }
      setLoading(false);
    };

    loadProfile();
  }, [supabase, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        })
        .eq("id", user.id);

      if (error) throw error;
      setMessage("Cập nhật profile thành công! 🎉");
      
      // Update local state to reflect changes in preview immediately
      setProfile(prev => prev ? { ...prev, display_name: displayName, avatar_url: avatarUrl } : null);
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--clr-text-muted)" }}>Đang tải hồ sơ... ⏳</div>
      </div>
    );
  }

  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container" style={{ maxWidth: "640px" }}>
        
        {/* Breadcrumb */}
        <div style={{ marginBottom: "32px" }}>
            <Link href="/dashboard" className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "0.9rem", textDecoration: "none" }}>
                ← Quay lại Dashboard
            </Link>
        </div>

        <h1 style={{
          fontSize: "var(--fs-h1)",
          fontWeight: 800,
          color: "var(--clr-text)",
          margin: "0 0 32px",
          letterSpacing: "-0.02em",
        }}>
          👤 Hồ sơ cá nhân
        </h1>

        <div style={{
          background: "#fff",
          borderRadius: "var(--radius-xl)",
          border: "3px solid var(--clr-lavender)",
          padding: "40px",
          boxShadow: "var(--shadow-lavender)",
          position: "relative",
          overflow: "hidden"
        }}>
          
          {/* Decorative Blob */}
          <div style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            background: "rgba(200,184,232,0.15)",
            borderRadius: "50%",
            zIndex: 0
          }} />

          {/* Avatar Preview Section */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "24px", 
            marginBottom: "40px", 
            position: "relative",
            zIndex: 1,
            padding: "20px",
            background: "var(--clr-surface)",
            borderRadius: "var(--radius-lg)",
            border: "3px dashed var(--clr-border)"
          }}>
            <div style={{ position: "relative" }}>
                 {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        style={{ 
                            width: "80px", 
                            height: "80px", 
                            borderRadius: "24px", 
                            objectCover: "cover",
                            border: "3px solid var(--clr-lavender)",
                            boxShadow: "var(--shadow-sm)"
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "U")}&background=C8B8E8&color=fff&size=128`;
                        }}
                    />
                ) : (
                    <div className="clay-avatar-placeholder" style={{ width: 80, height: 80, fontSize: "2rem" }}>
                        {(displayName || "?").charAt(0).toUpperCase()}
                    </div>
                )}
                <div style={{
                    position: "absolute",
                    bottom: "-5px",
                    right: "-5px",
                    background: "var(--clr-coral)",
                    color: "white",
                    width: "28px",
                    height: "28px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>✨</div>
            </div>
            
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--clr-text)", margin: "0 0 4px" }}>
                {displayName || "Chưa đặt tên"}
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--clr-text-muted)", fontWeight: 600, margin: 0 }}>
                {profile?.id ? "Thành viên Cộng đồng" : "Đang cập nhật..."}
              </p>
            </div>
          </div>

          {/* Alerts */}
          {message && (
            <div className="alert alert-success" style={{ marginBottom: "24px" }}>{message}</div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: "24px" }}>{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 1 }}>
            <div>
              <label htmlFor="displayName" className="clay-label">Tên hiển thị</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="clay-input"
                placeholder="Nguyễn Văn A"
                style={{ fontSize: "1rem", fontWeight: 600 }}
              />
            </div>

            <div>
              <label htmlFor="avatarUrl" className="clay-label">URL ảnh đại diện</label>
              <input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="clay-input"
                placeholder="https://example.com/avatar.jpg"
              />
              <p style={{ marginTop: "8px", fontSize: "0.8rem", color: "var(--clr-text-muted)", fontWeight: 500 }}>
                Nhập URL ảnh từ internet. Bạn có thể dùng URL avatar GitHub của mình.
              </p>
            </div>

            <div style={{ paddingTop: "8px" }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-full"
                style={{ padding: "14px" }}
              >
                {saving ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
              </button>
            </div>
          </form>

          {/* Meta Info */}
          <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "2px dashed var(--clr-border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
               🗓️ Tham gia: {profile ? new Date(profile.created_at).toLocaleDateString("vi-VN") : "—"}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
               🔄 Cập nhật: {profile ? new Date(profile.updated_at).toLocaleDateString("vi-VN") : "—"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
