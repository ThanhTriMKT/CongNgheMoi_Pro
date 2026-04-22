// src/components/layout/header.tsx
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header style={{
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "3px solid var(--clr-border)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 4px 24px rgba(200,184,232,0.15)",
    }}>
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "76px",
          gap: "16px",
        }}>
          {/* Logo */}
          <Link href="/" style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span style={{
              width: "40px",
              height: "40px",
              borderRadius: "14px",
              background: "var(--clr-coral)",
              border: "3px solid #e05555",
              boxShadow: "3px 4px 0px var(--clr-coral-shadow)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              flexShrink: 0,
            }}>✍️</span>
            <span style={{
              fontWeight: 800,
              fontSize: "1.2rem",
              color: "var(--clr-text)",
              letterSpacing: "-0.02em",
            }}>
              Simple Blog
            </span>
          </Link>

          {/* Navigation */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <Link href="/" className="btn btn-ghost" style={{ padding: "8px 18px", minHeight: "40px", fontSize: "0.9rem" }}>
              Trang chủ
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="btn btn-ghost"
                  style={{ padding: "8px 18px", minHeight: "40px", fontSize: "0.9rem" }}
                >
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                    padding: "6px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "3px solid var(--clr-lavender)",
                    background: "var(--clr-surface)",
                    boxShadow: "3px 4px 0px var(--clr-lavender-shadow)",
                  }}
                >
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="Avatar"
                      width={28}
                      height={28}
                      className="clay-avatar"
                      style={{ width: 28, height: 28 }}
                    />
                  ) : (
                    <span className="clay-avatar-placeholder" style={{ width: 28, height: 28, flexShrink: 0 }}>
                      {(profile?.display_name || user.email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--clr-text)" }}>
                    {profile?.display_name || user.email?.split("@")[0]}
                  </span>
                </Link>

                <form action={logout}>
                  <button
                    type="submit"
                    className="btn btn-outline-coral"
                    style={{ padding: "8px 18px", minHeight: "40px", fontSize: "0.9rem" }}
                  >
                    Đăng xuất
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost" style={{ padding: "8px 18px", minHeight: "40px", fontSize: "0.9rem" }}>
                  Đăng nhập
                </Link>
                <Link href="/register" className="btn btn-primary" style={{ padding: "8px 20px", minHeight: "40px", fontSize: "0.9rem" }}>
                  Đăng ký 🎉
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
