"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadFile(bucket: string, file: File) {
    const filePath = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let thumbnailUrl = "";
      let videoUrl = "";

      if (thumbnail) {
        thumbnailUrl = await uploadFile("post-images", thumbnail);
      }

      if (video) {
        videoUrl = await uploadFile("post-videos", video);
      }

      const slug = createSlug(title);

      const { error } = await supabase.from("posts").insert({
        title,
        slug,
        description,
        content,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        is_published: isPublished,
      });

      if (error) throw error;

      router.push("/admin");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong creating the post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Create New Post</h1>
      <p className="mt-2 text-stone-600">
        Add a video, thumbnail, and written tutorial content.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="mb-2 block font-semibold">Title</label>
          <input
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Calming Evening Tea Blend"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">Description</label>
          <textarea
            className="min-h-24 w-full rounded-xl border border-stone-300 px-4 py-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short summary of this tutorial..."
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">Written Content</label>
          <textarea
            className="min-h-48 w-full rounded-xl border border-stone-300 px-4 py-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ingredients, steps, notes, etc..."
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <span>Publish this post</span>
        </label>

        {message && <p className="text-red-600">{message}</p>}

        <button
          disabled={loading}
          className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </section>
  );
}