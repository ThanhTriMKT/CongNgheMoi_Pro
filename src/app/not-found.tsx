// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      textAlign: "center",
      gap: "20px",
      position: "relative",
      zIndex: 1,
    }}>
      {/* Giant 404 number */}
      <div style={{
        fontSize: "clamp(6rem,20vw,12rem)",
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: "-0.05em",
        background: "linear-gradient(135deg, var(--clr-coral), var(--clr-lavender))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(4px 6px 0px rgba(255,107,107,0.25))",
        animation: "float 3s ease-in-out infinite",
      }}>
        404
      </div>

      <div style={{
        background: "#fff",
        borderRadius: "var(--radius-xl)",
        border: "3px solid var(--clr-coral)",
        padding: "36px 48px",
        boxShadow: "var(--shadow-coral)",
        maxWidth: "480px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}>
        <span style={{ fontSize: "3rem" }}>🔍</span>
        <h1 style={{
          fontSize: "var(--fs-h2)",
          fontWeight: 800,
          color: "var(--clr-text)",
          margin: 0,
        }}>
          Trang không tồn tại!
        </h1>
        <p style={{
          color: "var(--clr-text-muted)",
          fontWeight: 500,
          margin: 0,
          lineHeight: 1.6,
        }}>
          Nội dung bạn tìm kiếm có thể đã bị xóa hoặc chưa bao giờ tồn tại.
        </p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: "8px" }}>
          🏠 Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
