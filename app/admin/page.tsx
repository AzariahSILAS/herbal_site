"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingUser, setCheckingUser] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function checkUserAndGetPosts() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");
      setCheckingUser(false);

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

    checkUserAndGetPosts();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (checkingUser) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p>Checking login...</p>
      </section>
    );
  }

  async function handleDeletePost(postId: string) {
    const confirmed = confirm("Are you sure you want to delete this post?");

    if (!confirmed) return;

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error(error);
      alert("Could not delete post.");
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId)
    );
  }

  if (checkingUser) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p>Checking login...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-stone-600">
            Logged in as {userEmail}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="rounded-full bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            Create Post
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-full border border-stone-300 px-5 py-3 font-semibold hover:bg-white"
          >
            Log Out
          </button>
        </div>
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
              className="rounded-2xl border border-stone-500 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-500">{post.title}</h2>
                  <p className="mt-3 text-stone-600">{post.description}</p>
                </div>
                <div className=" flex w-3xs justify-between">
                  <span className="rounded-full bg-stone-500 px-3 py-1 text-sm content-center ">
                  {post.is_published ? "Published" : "Draft"}
                </span>
                <button
                    onClick={() => handleDeletePost(post.id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}