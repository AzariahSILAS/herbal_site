"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
};

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, description, is_published, created_at")
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-stone-600">Manage your tutorial posts.</p>
        </div>

        <Link
          href="/admin/posts/new"
          className="rounded-full bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
        >
          Create Post
        </Link>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-8">
          <p>No posts yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="mt-1 text-sm text-stone-500">/{post.slug}</p>
                  <p className="mt-3 text-stone-600">{post.description}</p>
                </div>

                <span className="rounded-full bg-stone-100 px-3 py-1 text-sm">
                  {post.is_published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}