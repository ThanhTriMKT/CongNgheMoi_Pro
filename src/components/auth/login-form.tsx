// src/components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Email hoặc mật khẩu không đúng 😢"
            : error.message
        );
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setError(null);
    setOauthLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setOauthLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* GitHub OAuth */}
      <button
        type="button"
        id="github-login-btn"
        onClick={handleGitHubLogin}
        disabled={oauthLoading}
        className="btn btn-secondary btn-full"
        style={{ gap: "10px" }}
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        {oauthLoading ? "Đang chuyển hướng..." : "Đăng nhập với GitHub"}
      </button>

      <div className="clay-divider">Hoặc</div>

      {/* Email/Password Form */}
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div>
          <label htmlFor="email" className="clay-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="clay-input"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <label htmlFor="password" className="clay-label" style={{ margin: 0 }}>Mật khẩu</label>
            <Link
              href="/forgot-password"
              style={{
                fontSize: "0.8rem",
                color: "var(--clr-sky)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Quên mật khẩu?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="clay-input"
            placeholder="••••••••"
          />
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-full"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập 🚀"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          style={{ color: "var(--clr-coral)", fontWeight: 800, textDecoration: "none" }}
        >
          Đăng ký ngay 🎉
        </Link>
      </p>
    </div>
  );
}
