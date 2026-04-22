-- ============================================================
-- SIMPLE BLOG — SEED DATA (Dữ liệu mẫu)
-- Chạy sau khi đã tạo ít nhất 1 tài khoản qua /register
-- ============================================================
-- Bước 1: Đăng ký tài khoản tại http://localhost:3000/register
-- Bước 2: Lấy user id từ: Authentication → Users trong Dashboard
-- Bước 3: Thay thế 'YOUR_USER_ID_HERE' bằng UUID thực của bạn
-- ============================================================

-- Ví dụ chèn bài viết mẫu (thay YOUR_USER_ID_HERE)
/*
INSERT INTO public.posts (author_id, title, slug, content, excerpt, status, published_at)
VALUES
  (
    'YOUR_USER_ID_HERE',
    'Giới thiệu về Supabase',
    'gioi-thieu-ve-supabase',
    '# Supabase là gì?

Supabase là nền tảng Backend-as-a-Service (BaaS) mã nguồn mở, được xây dựng trên PostgreSQL.

## Các tính năng chính

- **Database**: PostgreSQL với Row Level Security
- **Authentication**: Email/Password, OAuth (GitHub, Google...)
- **Realtime**: Cập nhật dữ liệu theo thời gian thực
- **Storage**: Lưu trữ files, images
- **Edge Functions**: Serverless functions với Deno

## Tại sao nên dùng Supabase?

Supabase giúp developer xây dựng ứng dụng full-stack nhanh hơn mà không cần lo về infrastructure.',
    'Tìm hiểu Supabase — nền tảng BaaS mạnh mẽ dành cho developer hiện đại.',
    'published',
    NOW()
  ),
  (
    'YOUR_USER_ID_HERE',
    'Next.JS App Router — Những điều cần biết',
    'nextjs-app-router',
    '# Next.JS App Router

App Router là kiến trúc routing mới trong Next.JS 13+.

## Server Components vs Client Components

- **Server Components**: Render trên server, không có state/hooks
- **Client Components**: Render trên client, có thể dùng hooks

## Khi nào dùng cái nào?

Dùng Server Component khi:
- Fetch data trực tiếp từ database
- Không cần interactivity

Dùng Client Component khi:
- Có state (useState, useReducer)
- Có event handlers (onClick, onChange)
- Dùng browser APIs',
    'Tìm hiểu sự khác biệt giữa Server Components và Client Components trong Next.JS App Router.',
    'published',
    NOW() - INTERVAL '1 day'
  ),
  (
    'YOUR_USER_ID_HERE',
    'Bài viết nháp — chưa xuất bản',
    'bai-viet-nhap',
    'Đây là bản nháp, chỉ mình tôi thấy.',
    'Bản nháp chưa xuất bản.',
    'draft',
    NULL
  );
*/

-- Xác nhận dữ liệu
SELECT id, title, status, published_at FROM public.posts ORDER BY created_at DESC;
