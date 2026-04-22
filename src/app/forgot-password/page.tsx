// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await resetPassword(email);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage("Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư của bạn.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 76px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      <div aria-hidden="true" style={{
        position: "fixed", top: "20%", left: "10%",
        width: "250px", height: "250px",
        background: "radial-gradient(circle, rgba(255,230,109,0.2) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "#fff",
        borderRadius: "var(--radius-xl)",
        border: "3px solid var(--clr-yellow)",
        padding: "40px 36px",
        boxShadow: "var(--shadow-yellow)",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "64px", height: "64px",
            borderRadius: "20px",
            background: "var(--clr-yellow)",
            border: "3px solid #e8d000",
            boxShadow: "var(--shadow-yellow)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 20px",
          }}>
            🔒
          </div>
          <h1 style={{
            fontSize: "var(--fs-h1)",
            fontWeight: 800,
            color: "var(--clr-text)",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}>
            Quên mật khẩu?
          </h1>
          <p style={{ color: "var(--clr-text-muted)", fontWeight: 500, margin: 0 }}>
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        {message && (
          <div className="alert alert-success" style={{ marginBottom: "20px" }}>
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: "20px" }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label htmlFor="fp-email" className="clay-label">Email</label>
            <input
              id="fp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="clay-input"
              placeholder="email@example.com"
            />
          </div>

          <button
            id="reset-password-btn"
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ background: "var(--clr-yellow)", borderColor: "#e8d000", color: "#5a4800" }}
          >
            {loading ? "Đang gửi..." : "📧 Gửi link đặt lại mật khẩu"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "0.9rem",
          color: "var(--clr-text-muted)",
          fontWeight: 600,
        }}>
          <Link href="/login" style={{ color: "var(--clr-sky)", fontWeight: 800, textDecoration: "none" }}>
            ← Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
