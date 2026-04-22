# 📝 Simple Blog

Ứng dụng blog cá nhân full-stack xây dựng với **Next.JS 15** và **Supabase**.  
Đây là project thực hành cho môn **Các công nghệ mới trong phát triển phần mềm** — Buổi 4/8.

---

## ✨ Tính năng

| Tính năng | Mô tả | Công nghệ |
|---|---|---|
| **Trang chủ** | Danh sách bài viết công khai | Server-side Fetching, ISR |
| **Chi tiết bài viết** | Nội dung Markdown + bình luận | Dynamic Routes, ReactMarkdown |
| **Đăng ký / Đăng nhập** | Email/Password | Supabase Auth |
| **OAuth** | Đăng nhập bằng GitHub | OAuth 2.0 |
| **Quên mật khẩu** | Gửi link reset qua email | Supabase Auth |
| **Dashboard** | Quản lý bài viết cá nhân | Protected Routes, CRUD |
| **Viết / Sửa bài** | Form tạo và chỉnh sửa bài | Server Actions, RLS |
| **Slug tự động** | URL-friendly từ tiêu đề | PostgreSQL trigger |
| **Bình luận** | Realtime comments | Supabase Realtime |
| **Hồ sơ cá nhân** | Xem và sửa profile | RLS, Supabase |
| **Like bài viết** | Thích / bỏ thích | RLS Policies |
| **Row Level Security** | Phân quyền cấp database | PostgreSQL RLS |
| **Bảo vệ routes** | Redirect khi chưa đăng nhập | Next.JS Middleware |

---

## 🛠 Tech Stack

- **Framework**: [Next.JS 15](https://nextjs.org) (App Router, TypeScript)
- **Backend**: [Supabase](https://supabase.com) (PostgreSQL, Auth, Realtime)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown)
- **Typography**: [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)

---

## 📁 Cấu trúc project

```
simple-blog/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts          # OAuth callback handler
│   │   ├── dashboard/
│   │   │   ├── edit/[id]/
│   │   │   │   └── page.tsx          # Trang chỉnh sửa bài viết
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Trang viết bài mới
│   │   │   └── page.tsx              # Dashboard — danh sách bài
│   │   ├── forgot-password/
│   │   │   └── page.tsx              # Quên mật khẩu
│   │   ├── login/
│   │   │   └── page.tsx              # Đăng nhập
│   │   ├── posts/[slug]/
│   │   │   └── page.tsx              # Chi tiết bài viết + comments
│   │   ├── profile/
│   │   │   └── page.tsx              # Hồ sơ cá nhân
│   │   ├── register/
│   │   │   └── page.tsx              # Đăng ký
│   │   ├── actions/
│   │   │   └── auth.ts               # Server Actions: logout, resetPassword
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout + Header
│   │   ├── not-found.tsx             # Trang 404
│   │   └── page.tsx                  # Trang chủ
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login-form.tsx        # Form đăng nhập + GitHub OAuth
│   │   │   └── register-form.tsx     # Form đăng ký
│   │   ├── dashboard/
│   │   │   ├── delete-post-button.tsx
│   │   │   ├── post-form.tsx         # Form tạo/sửa bài (dùng chung)
│   │   │   └── post-list.tsx
│   │   ├── layout/
│   │   │   └── header.tsx            # Header với auth state
│   │   └── posts/
│   │       ├── comment-form.tsx
│   │       ├── comment-list.tsx
│   │       └── realtime-comments.tsx # Subscribe Supabase Realtime
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts             # createBrowserClient
│   │       ├── middleware.ts         # updateSession + route protection
│   │       └── server.ts             # createServerClient
│   └── types/
│       └── database.ts               # TypeScript interfaces
├── supabase/
│   ├── schema.sql                    # ⭐ Toàn bộ schema + RLS policies
│   └── seed.sql                      # Dữ liệu mẫu
├── middleware.ts                     # Next.JS Middleware entry
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu

- Node.js 18+
- Tài khoản [Supabase](https://supabase.com) (miễn phí)
- Tài khoản [GitHub](https://github.com) (để dùng OAuth)

---

### Bước 1 — Clone & cài đặt dependencies

```bash
git clone <your-repo-url>
cd simple-blog
npm install
```

---

### Bước 2 — Tạo project Supabase

1. Vào [supabase.com](https://supabase.com) → **New Project**
2. Điền thông tin:
   - **Project name**: `simple-blog`
   - **Database Password**: Tạo password mạnh (lưu lại)
   - **Region**: Southeast Asia (Singapore)
3. Chờ 1-2 phút để provision xong

---

### Bước 3 — Chạy SQL schema

1. Vào **Supabase Dashboard → SQL Editor → New query**
2. Paste toàn bộ nội dung file `supabase/schema.sql`
3. Click **Run**
4. Xác nhận thành công: sẽ thấy 4 bảng `profiles`, `posts`, `comments`, `likes`

---

### Bước 4 — Cấu hình biến môi trường

```bash
cp .env.local.example .env.local
```

Mở `.env.local` và điền:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Cách lấy credentials:**  
> Supabase Dashboard → Project Settings (⚙️) → API → copy **Project URL** và **anon public** key

---

### Bước 5 — Cấu hình GitHub OAuth

1. Vào [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**
2. Điền:
   - **Application name**: Simple Blog
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
3. Copy **Client ID** và **Client Secret**
4. Vào Supabase Dashboard → **Authentication → Providers → GitHub**
5. Bật GitHub, dán Client ID và Secret → Save

---

### Bước 6 — Bật Realtime cho bảng comments

1. Supabase Dashboard → **Database → Replication**
2. Bật replication cho bảng `comments`

---

### Bước 7 — Chạy ứng dụng

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000)

---

## 🔐 Row Level Security — Bảng phân quyền

### Bảng `posts`

| Người dùng | Xem published | Xem draft | Tạo | Sửa | Xóa |
|---|:---:|:---:|:---:|:---:|:---:|
| Anonymous | ✅ | ❌ | ❌ | ❌ | ❌ |
| User (không phải author) | ✅ | ❌ | ✅ | ❌ | ❌ |
| Author (chủ bài viết) | ✅ | ✅ | ✅ | ✅ | ✅ |

### Bảng `comments`

| Người dùng | Xem | Tạo | Xóa |
|---|:---:|:---:|:---:|
| Anonymous | ✅ (bài published) | ❌ | ❌ |
| Authenticated user | ✅ | ✅ | ✅ (của mình) |
| Post author | ✅ (kể cả draft) | ✅ | ✅ (của mình) |

### Bảng `profiles`

| Người dùng | Xem | Sửa |
|---|:---:|:---:|
| Tất cả | ✅ | ❌ |
| Chủ profile | ✅ | ✅ |

---

## 🗺 Cấu trúc URL

| URL | Mô tả | Bảo vệ |
|---|---|:---:|
| `/` | Trang chủ — danh sách bài published | Public |
| `/posts/[slug]` | Chi tiết bài viết + bình luận | Public |
| `/register` | Đăng ký tài khoản | Public |
| `/login` | Đăng nhập | Public |
| `/forgot-password` | Quên mật khẩu | Public |
| `/auth/callback` | OAuth callback | Public |
| `/dashboard` | Quản lý bài viết của tôi | 🔒 Auth |
| `/dashboard/new` | Viết bài mới | 🔒 Auth |
| `/dashboard/edit/[id]` | Chỉnh sửa bài viết | 🔒 Auth |
| `/profile` | Hồ sơ cá nhân | 🔒 Auth |

---

## 🏗 Kiến trúc Supabase

```
┌─────────────────────────────────────────────────┐
│                SUPABASE PLATFORM                │
├──────────────┬──────────────┬───────────────────┤
│   GoTrue     │  PostgREST   │     Realtime      │
│   (Auth)     │    (API)     │   (WebSocket)     │
├──────────────┼──────────────┼───────────────────┤
│   Storage    │    Edge      │     pgvector      │
│    (S3)      │  Functions   │  (AI Embeddings)  │
├──────────────┴──────────────┴───────────────────┤
│        PostgreSQL + Row Level Security          │
└─────────────────────────────────────────────────┘
```

---

## 📚 Kiến thức áp dụng

- **Backend-as-a-Service (BaaS)**: So sánh Supabase vs Firebase vs Appwrite
- **PostgreSQL**: Thiết kế schema, indexes, triggers, functions
- **Row Level Security**: Policies cho SELECT / INSERT / UPDATE / DELETE
- **Supabase Auth**: Email/Password + OAuth (GitHub), JWT session
- **Next.JS App Router**: Server Components, Client Components, Middleware
- **Server Actions**: logout, reset password
- **Realtime**: Supabase channel subscriptions (postgres_changes)
- **TypeScript**: Interfaces, strict typing cho database schema

---

## 📝 Bài tập tự làm

- [x] **Bài 1.1** — Khởi tạo project và kết nối Supabase thành công
- [x] **Bài 2.1** — Tạo schema đầy đủ 3 bảng + bảng likes
- [x] **Bài 3.1** — Policy cho post author xem comments kể cả trên bài draft
- [x] **Bài 4.1** — Tính năng "Quên mật khẩu" (`/forgot-password`)
- [x] **Bài 7.1** — Trang Profile (`/profile`) — xem và sửa display_name, avatar
- [x] **Bài 7.2** — Bảng `likes` với RLS policies đầy đủ (schema đã tạo)
- [ ] **Bài 5.1** — Phân trang (pagination) cho trang chủ
- [ ] **Bài 7.3** — Upload hình ảnh với Supabase Storage
- [ ] **Bài 7.4** — Tìm kiếm full-text với PostgreSQL

---

## 🔧 Scripts

```bash
npm run dev      # Chạy development server (Turbopack)
npm run build    # Build production
npm run start    # Chạy production server
npm run lint     # Kiểm tra lỗi ESLint
```

---

## 📖 Tài liệu tham khảo

| Tài liệu | Link |
|---|---|
| Supabase Docs | [supabase.com/docs](https://supabase.com/docs) |
| Supabase Auth + Next.JS | [supabase.com/docs/guides/auth/server-side/nextjs](https://supabase.com/docs/guides/auth/server-side/nextjs) |
| Row Level Security | [supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security) |
| Supabase Realtime | [supabase.com/docs/guides/realtime](https://supabase.com/docs/guides/realtime) |
| Next.JS App Router | [nextjs.org/docs/app](https://nextjs.org/docs/app) |
| Tailwind CSS | [tailwindcss.com/docs](https://tailwindcss.com/docs) |

---

## ✅ Checklist hoàn thành

- [x] Tạo project Supabase và lấy credentials
- [x] Khởi tạo project Next.JS với Supabase packages
- [x] Tạo đầy đủ schema: `profiles`, `posts`, `comments`, `likes`
- [x] Cấu hình RLS cho tất cả bảng
- [x] Implement Authentication (Email/Password + GitHub OAuth)
- [x] Implement CRUD cho posts (Create, Read, Update, Delete)
- [x] Bảo vệ routes cần authentication (Middleware)
- [x] Tính năng bình luận với Realtime
- [x] Trang Profile cá nhân
- [x] Quên mật khẩu
- [x] README đầy đủ
- [ ] Commit code lên GitHub

---

> Bài thực hành 4 — Môn: Các công nghệ mới trong phát triển phần mềm
