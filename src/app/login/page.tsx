// src/app/login/page.tsx
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

interface LoginPageProps {
  searchParams: Promise<{ message?: string; redirectTo?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div style={{
      minHeight: "calc(100vh - 76px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      {/* Decorative blob */}
      <div aria-hidden="true" style={{
        position: "fixed",
        top: "20%",
        left: "5%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "fixed",
        bottom: "20%",
        right: "5%",
        width: "250px",
        height: "250px",
        background: "radial-gradient(circle, rgba(78,205,196,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "#fff",
        borderRadius: "var(--radius-xl)",
        border: "3px solid var(--clr-lavender)",
        padding: "40px 36px",
        boxShadow: "var(--shadow-lavender)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header card */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            background: "var(--clr-coral)",
            border: "3px solid #e05555",
            boxShadow: "var(--shadow-coral)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 20px",
          }}>
            🔑
          </div>
          <h1 style={{
            fontSize: "var(--fs-h1)",
            fontWeight: 800,
            color: "var(--clr-text)",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}>
            Đăng nhập
          </h1>
          <p style={{
            color: "var(--clr-text-muted)",
            fontWeight: 500,
            margin: 0,
          }}>
            Quản lý blog của bạn
          </p>
        </div>

        {params.message && (
          <div className="alert alert-success" style={{ marginTop: "24px" }}>
            ✅ {params.message}
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
