"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
};

export default function CatalogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, description, thumbnail_url, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    }

    getPosts();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
          Member Library
        </p>
        <h1 className="mt-2 text-4xl font-bold">Catalog</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Browse herbal tutorials, tea recipes, videos, and written guides.
        </p>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-8">
          <p>No published posts yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {post.thumbnail_url ? (
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-green-100 text-sm font-semibold text-green-900">
                  No thumbnail
                </div>
              )}

              <div className="p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                  Tutorial
                </p>

                <h2 className="text-xl font-bold group-hover:text-green-700">
                  {post.title}
                </h2>

                {post.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                    {post.description}
                  </p>
                )}

                <p className="mt-5 text-sm font-semibold text-green-700">
                  View post →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}