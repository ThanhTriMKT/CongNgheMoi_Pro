// src/components/posts/like-button.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
}

export function LikeButton({ postId, initialLikeCount }: LikeButtonProps) {
  const supabase = createClient();
  const [likes, setLikes] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLikeStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      setIsLiked(!!data);
      setLoading(false);
    };

    checkLikeStatus();
  }, [postId, supabase]);

  const toggleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Bạn cần đăng nhập để like bài viết! ❤️");
      return;
    }

    if (isLiked) {
      // Unlike
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (!error) {
        setIsLiked(false);
        setLikes(prev => prev - 1);
      }
    } else {
      // Like
      const { error } = await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: user.id });

      if (!error) {
        setIsLiked(true);
        setLikes(prev => prev + 1);
      }
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`btn ${isLiked ? "btn-primary" : "btn-outline-coral"}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 20px",
        minHeight: "44px",
        borderRadius: "999px",
        fontSize: "1rem",
        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      }}
    >
      <span style={{ fontSize: "1.2rem", transform: isLiked ? "scale(1.2)" : "scale(1)", transition: "transform 0.2s" }}>
        {isLiked ? "❤️" : "🤍"}
      </span>
      <span style={{ fontWeight: 800 }}>{likes} Likes</span>
    </button>
  );
}
