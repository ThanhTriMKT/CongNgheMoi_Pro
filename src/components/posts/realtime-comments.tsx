// src/components/posts/realtime-comments.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Comment } from "@/types/database";
import { CommentList } from "./comment-list";

interface RealtimeCommentsProps {
  postId: string;
  initialComments: Comment[];
}

export function RealtimeComments({
  postId,
  initialComments,
}: RealtimeCommentsProps) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>(initialComments);

  useEffect(() => {
    // Subscribe nhận bình luận mới theo thời gian thực
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        async (payload) => {
          // Fetch bình luận mới kèm thông tin profile
          const { data: newComment } = await supabase
            .from("comments")
            .select(
              `
              *,
              profiles (
                display_name,
                avatar_url
              )
            `
            )
            .eq("id", payload.new.id)
            .single();

          if (newComment) {
            setComments((prev) => [...prev, newComment]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          setComments((prev) =>
            prev.filter((c) => c.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, supabase]);

  return <CommentList comments={comments} />;
}
