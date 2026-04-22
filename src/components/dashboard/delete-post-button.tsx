// src/components/dashboard/delete-post-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa bài viết "${postTitle}"?\n\nHành động này không thể hoàn tác.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn btn-outline-coral"
      style={{ padding: "6px 14px", minHeight: "36px", fontSize: "0.85rem" }}
    >
      {loading ? "Xóa..." : "🗑️ Xóa"}
    </button>
  );
}
