// src/app/register/page.tsx
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Đăng ký",
};

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: "calc(100vh - 76px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      <div aria-hidden="true" style={{
        position: "fixed", top: "15%", right: "8%",
        width: "280px", height: "280px",
        background: "radial-gradient(circle, rgba(255,230,109,0.18) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "fixed", bottom: "15%", left: "8%",
        width: "220px", height: "220px",
        background: "radial-gradient(circle, rgba(200,184,232,0.18) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "460px",
        background: "#fff",
        borderRadius: "var(--radius-xl)",
        border: "3px solid var(--clr-sky)",
        padding: "40px 36px",
        boxShadow: "var(--shadow-sky)",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div style={{
            width: "64px", height: "64px",
            borderRadius: "20px",
            background: "var(--clr-sky)",
            border: "3px solid #3ab5ac",
            boxShadow: "var(--shadow-sky)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 20px",
          }}>
            🎉
          </div>
          <h1 style={{
            fontSize: "var(--fs-h1)",
            fontWeight: 800,
            color: "var(--clr-text)",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}>
            Tạo tài khoản
          </h1>
          <p style={{ color: "var(--clr-text-muted)", fontWeight: 500, margin: 0 }}>
            Bắt đầu hành trình viết lách của bạn 🌟
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
