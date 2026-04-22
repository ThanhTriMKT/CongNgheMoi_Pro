# 📝 Simple Blog

Ứng dụng blog cá nhân full-stack xây dựng với **Next.JS 15** và **Supabase**.  
Đây là project thực hành cho môn **Các công nghệ mới trong phát triển phần mềm** — Buổi 4/8.

---

## ✨ Tính năng & Thiết kế Độc bản
Project đã được cập nhật với thiết kế **Playful Claymorphism** — kết hợp màu sắc pastel, hiệu ứng đổ bóng mềm mại và bo góc kiểu đất sét (clay-morphism) mang lại cảm giác cao cấp và hiện đại.

| Tính năng | Mô tả | Công nghệ |
|---|---|---|
| **Trang chủ** | Danh sách bài viết + **Tìm kiếm & Phân trang** | Next.js ISR, Supabase, ilike |
| **Chi tiết bài viết** | Nội dung Markdown + **Hệ thống Like** | ReactMarkdown, Like system |
| **Bình luận** | **Realtime comments** (hiện ngay lập tức) | Supabase Realtime Channels |
| **OAuth** | Đăng nhập bằng GitHub | Supabase Auth OAuth |
| **Hồ sơ cá nhân** | Trang cá nhân với xem trước Avatar | Supabase Storage & Profiles |
| **Dashboard** | Quản lý toàn bộ bài viết của bạn | CRUD, RLS protection |

---

## 🛠 Hướng dẫn Cấu hình Quan trọng (Database sẳn sàng)

Để ứng dụng hoạt động 100%, bạn cần thực hiện 3 bước tại **Supabase Dashboard**:

1.  **Chạy SQL Schema**: Copy nội dung file `supabase/schema.sql` dán vào SQL Editor và nhấn **Run**.
2.  **Bật Realtime**: Vào **Database -> Publications**, edit `supabase_realtime` và tích chọn bảng `comments`.
3.  **Cấu hình Redirect**: Vào **Authentication -> URL Configuration**, thêm `http://localhost:3000/**` vào Redirect URLs.

---

## 🚀 Hoàn thành toàn bộ Bài tập (8/8)

- [x] **Bài 1.1** — Khởi tạo project và kết nối Supabase thành công.
- [x] **Bài 2.1** — Tạo schema đầy đủ các bảng (`profiles`, `posts`, `comments`, `likes`).
- [x] **Bài 3.1** — Cấu hình RLS Policies bảo mật cấp database.
- [x] **Bài 4.1** — Tính năng "Quên mật khẩu" hoạt động ổn định.
- [x] **Bài 7.1** — Trang Profile cá nhân với thiết kế Claymorphism.
- [x] **Bài 7.2** — Hệ thống Like bài viết với real-time feedback.
- [x] **Bài 5.1** — **Phân trang (pagination)** cho trang chủ.
- [x] **Bài 7.4** — **Tìm kiếm full-text** bài viết theo tiêu đề.

---

## 📁 Cấu trúc Project (Highlight các components mới)

```text
simple-blog/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Trang chủ (đã có Search & Pagination)
│   │   ├── posts/[slug]/page.tsx  # Chi tiết bài + Like Button
│   │   └── profile/page.tsx       # Trang cá nhân cao cấp
│   ├── components/
│   │   ├── posts/
│   │   │   ├── like-button.tsx    # Component Like mượt mà
│   │   │   └── comment-list.tsx   # Danh sách comment đồng bộ Clay
│   │   └── auth/                  # Form đăng nhập/ký kiểu Clay
│   └── globals.css                # Design System: Bubbly & Soft
└── supabase/
    └── schema.sql                 # File SQL để khởi tạo Database
```

---

> Bài thực hành 4 — Môn: Các công nghệ mới trong phát triển phần mềm
