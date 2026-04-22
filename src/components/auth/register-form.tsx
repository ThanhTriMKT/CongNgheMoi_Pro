// src/components/auth/register-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push(
          "/login?message=" +
            encodeURIComponent(
              "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
            )
        );
      }
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div>
        <label htmlFor="displayName" className="clay-label">
          Tên hiển thị <span style={{ color: "var(--clr-coral)" }}>*</span>
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="clay-input"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="clay-label">
          Email <span style={{ color: "var(--clr-coral)" }}>*</span>
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="clay-input"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="clay-label">
          Mật khẩu <span style={{ color: "var(--clr-coral)" }}>*</span>
        </label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="clay-input"
          placeholder="••••••••"
        />
        <p style={{
          marginTop: "6px",
          fontSize: "0.8rem",
          color: "var(--clr-text-muted)",
          fontWeight: 500,
        }}>
          Tối thiểu 6 ký tự
        </p>
      </div>

      <button
        id="register-submit-btn"
        type="submit"
        disabled={loading}
        className="btn btn-sky btn-full"
      >
        {loading ? "Đang xử lý..." : "Tạo tài khoản 🚀"}
      </button>

      <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
        Đã có tài khoản?{" "}
        <Link href="/login" style={{ color: "var(--clr-coral)", fontWeight: 800, textDecoration: "none" }}>
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
