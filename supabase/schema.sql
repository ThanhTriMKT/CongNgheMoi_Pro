-- ============================================================
-- SIMPLE BLOG — DATABASE SCHEMA
-- Bài thực hành 4: Supabase BaaS & Authentication
-- ============================================================
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor
-- ============================================================


-- ============================================================
-- PHẦN 1: BẢNG PROFILES
-- ============================================================

-- Tạo bảng profiles (mở rộng auth.users)
CREATE TABLE public.profiles (
  id          UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  PRIMARY KEY (id)
);

COMMENT ON TABLE public.profiles IS 'User profiles — extends auth.users';

-- Index tìm kiếm theo tên
CREATE INDEX profiles_display_name_idx ON public.profiles (display_name);


-- ============================================================
-- PHẦN 2: TRIGGER TỰ ĐỘNG TẠO PROFILE KHI CÓ USER MỚI
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Trigger: chạy sau khi insert vào auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================================================
-- PHẦN 3: BẢNG POSTS
-- ============================================================

-- Enum cho trạng thái bài viết
CREATE TYPE post_status AS ENUM ('draft', 'published');

-- Tạo bảng posts
CREATE TABLE public.posts (
  id           UUID        NOT NULL DEFAULT gen_random_uuid(),
  author_id    UUID        NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  slug         TEXT        NOT NULL,
  content      TEXT,
  excerpt      TEXT,
  status       post_status NOT NULL DEFAULT 'draft',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  published_at TIMESTAMPTZ,

  PRIMARY KEY (id),
  UNIQUE (slug)
);

COMMENT ON TABLE public.posts IS 'Blog posts';

-- Indexes để tối ưu query
CREATE INDEX posts_author_id_idx    ON public.posts (author_id);
CREATE INDEX posts_status_idx       ON public.posts (status);
CREATE INDEX posts_published_at_idx ON public.posts (published_at DESC);
CREATE INDEX posts_slug_idx         ON public.posts (slug);


-- ============================================================
-- PHẦN 4: FUNCTION & TRIGGER AUTO-GENERATE SLUG
-- ============================================================

-- Function tạo slug từ title
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug  TEXT;
  final_slug TEXT;
  counter    INTEGER := 0;
BEGIN
  -- Chuyển về lowercase, thay ký tự không hợp lệ bằng dấu gạch ngang
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Xóa dấu gạch ngang ở đầu/cuối
  base_slug := trim(both '-' FROM base_slug);

  final_slug := base_slug;

  -- Nếu slug đã tồn tại → thêm số phía sau
  WHILE EXISTS (SELECT 1 FROM public.posts WHERE slug = final_slug) LOOP
    counter    := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$;

-- Function set slug trước khi insert
CREATE OR REPLACE FUNCTION public.set_post_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger tự động set slug khi tạo bài mới
CREATE TRIGGER posts_set_slug
  BEFORE INSERT ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.set_post_slug();


-- ============================================================
-- PHẦN 5: BẢNG COMMENTS
-- ============================================================

CREATE TABLE public.comments (
  id         UUID        NOT NULL DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES public.posts    ON DELETE CASCADE,
  author_id  UUID        NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  PRIMARY KEY (id)
);

COMMENT ON TABLE public.comments IS 'Comments on blog posts';

CREATE INDEX comments_post_id_idx    ON public.comments (post_id);
CREATE INDEX comments_author_id_idx  ON public.comments (author_id);
CREATE INDEX comments_created_at_idx ON public.comments (created_at DESC);


-- ============================================================
-- PHẦN 6: BẢNG LIKES (Bài tập 7.2)
-- ============================================================

CREATE TABLE public.likes (
  id         UUID        NOT NULL DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES public.posts    ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

  PRIMARY KEY (id),
  UNIQUE (post_id, user_id)  -- Mỗi user chỉ like 1 lần
);

COMMENT ON TABLE public.likes IS 'Post likes';

CREATE INDEX likes_post_id_idx ON public.likes (post_id);
CREATE INDEX likes_user_id_idx ON public.likes (user_id);


-- ============================================================
-- PHẦN 7: FUNCTION CẬP NHẬT updated_at TỰ ĐỘNG
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Áp dụng cho profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

-- Áp dụng cho posts
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();


-- ============================================================
-- PHẦN 8: BẬT ROW LEVEL SECURITY (RLS)
-- ============================================================
-- QUAN TRỌNG: Sau khi bật RLS, KHÔNG có dữ liệu nào truy cập
-- được cho đến khi tạo policies → "secure by default"

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes    ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PHẦN 9: RLS POLICIES — PROFILES
-- ============================================================

-- Ai cũng có thể xem profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Users chỉ có thể update profile của chính mình
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING      ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);


-- ============================================================
-- PHẦN 10: RLS POLICIES — POSTS
-- ============================================================

-- Ai cũng có thể xem bài đã published
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Author có thể xem tất cả bài của mình (kể cả draft)
CREATE POLICY "Authors can view all their own posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = author_id);

-- Authenticated users có thể tạo bài viết
CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = author_id);

-- Author có thể update bài của mình
CREATE POLICY "Authors can update their own posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING      ((SELECT auth.uid()) = author_id)
  WITH CHECK ((SELECT auth.uid()) = author_id);

-- Author có thể xóa bài của mình
CREATE POLICY "Authors can delete their own posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = author_id);


-- ============================================================
-- PHẦN 11: RLS POLICIES — COMMENTS
-- ============================================================

-- Ai cũng có thể xem comments của bài đã published
CREATE POLICY "Comments on published posts are viewable"
  ON public.comments FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id     = comments.post_id
        AND posts.status = 'published'
    )
  );

-- Post author có thể xem TẤT CẢ comments trên bài của mình
-- (kể cả bài đang là draft) — Bài tập 3.1
CREATE POLICY "Post authors can view all comments on their posts"
  ON public.comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id        = comments.post_id
        AND posts.author_id = (SELECT auth.uid())
    )
  );

-- Authenticated users có thể tạo comments
CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = author_id);

-- Users có thể xóa comments của mình
CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = author_id);


-- ============================================================
-- PHẦN 12: RLS POLICIES — LIKES
-- ============================================================

-- Ai cũng có thể xem likes
CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users có thể like
CREATE POLICY "Authenticated users can like posts"
  ON public.likes FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users chỉ có thể unlike (xóa) của chính mình
CREATE POLICY "Users can delete their own likes"
  ON public.likes FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);


-- ============================================================
-- PHẦN 13: TEST RLS (Chạy để xác nhận)
-- ============================================================

-- Test như anonymous user (chỉ thấy bài published)
-- SET ROLE anon;
-- SELECT id, title, status FROM public.posts;
-- RESET ROLE;

-- Kiểm tra xem các bảng đã tồn tại
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'posts', 'comments', 'likes')
ORDER BY table_name;
