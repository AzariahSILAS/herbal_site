"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  is_published: boolean;
  created_at: string;
};

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) {
        console.error(error);
        setPost(null);
      } else {
        setPost(data);
      }

      setLoading(false);
    }

    getPost();
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-12">
        <p>Loading post...</p>
      </section>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto  px-6 py-12 bg-green-100 ">
      <a
        href="/catalog"
        className="mb-6 inline-block text-sm font-semibold text-green-700 hover:text-green-500"
      >
        ← Back to Catalog
      </a>

      <h1 className="text-4xl font-bold tracking-tight text-stone-600">
        {post.title}
      </h1>
      {post.video_url ? (
        <video
          src={post.video_url}
          controls
          className="mt-8 aspect-video w-full rounded-2xl bg-black shadow-sm"
        />
      ) : post.thumbnail_url ? (
        <img
          src={post.thumbnail_url}
          alt={post.title}
          className="mt-8 aspect-video w-full rounded-2xl object-cover shadow-sm"
        />
      ) : (
        <div className="mt-8 flex aspect-video items-center justify-center rounded-2xl bg-green-100 text-green-900">
          No media uploaded
        </div>
      )}

      {post.description && (
        <p className="mt-4 text-lg leading-8 text-stone-700">
          {post.description}
        </p>
      )}

      <p className="mt-4 text-sm text-stone-500">
        Posted {new Date(post.created_at).toLocaleDateString()}
      </p>

      

      {post.content && (
        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 leading-8 text-stone-700 shadow-sm">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}