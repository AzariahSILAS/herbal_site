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

export default function HomePage() {
  const [newestPosts, setNewestPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function getNewestPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, description, thumbnail_url, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error(error);
        return;
      }

      setNewestPosts(data || []);
    }

    getNewestPosts();
  }, []);
  return (
    <div>
      <section className="bg-gradient-to-b from-green-50 to-stone-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-green-700">
              Herbal tutorials and wellness education
            </p>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-stone-950 md:text-6xl">
              Learn natural herbal recipes from someone who lives it.
            </h1>

            <p className="mb-8 text-lg leading-8 text-stone-700">
              Get access to step-by-step videos, photos, and written tutorials
              teaching you how to prepare teas, herbal blends, and wellness
              recipes at home.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="/signup"
                className="rounded-full bg-green-700 px-6 py-3 text-center font-semibold text-white hover:bg-green-800"
              >
                Get Started
              </a>

              <a
                href="/catalog"
                className="rounded-full border border-stone-300 px-6 py-3 text-center font-semibold hover:bg-white text-gray-700"
              >
                View Catalog
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="aspect-video rounded-2xl bg-green-100"></div>
            <div className="mt-6">
              <h2 className="text-2xl text-gray-700 font-bold">
                Meet your teacher
              </h2>
              <p className="mt-3 leading-7 text-stone-700">
                This library is built around practical knowledge, simple
                ingredients, and easy-to-follow tutorials for people who want to
                learn herbal wellness at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 bg-green-100">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              Newest posts
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-700">
              Latest tutorials
            </h2>
          </div>

          <Link
            href="/catalog"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            See all posts →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {newestPosts.map((post) => (
            <Link
              href={`/post/${post.slug}`}
              key={post.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-lg/30 transition hover:-translate-y-1 hover:shadow-lg"
            >
              {post.thumbnail_url ? (
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="aspect-video bg-green-100"></div>
              )}

              <div className="p-5">
                <h3 className="text-xl font-bold">{post.title}</h3>

                {post.description && (
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {post.description}
                  </p>
                )}

                <p className="mt-4 text-sm font-semibold text-green-700">
                  View tutorial →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-green-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Start learning herbal wellness today.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-green-50">
            Subscribe to unlock the full catalog of video, photo, and written
            tutorials.
          </p>

          <a
            href="/signup"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-green-900 hover:bg-green-50"
          >
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
}
