"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Admin Login</h1>
      <p className="mt-2 text-stone-600">Log in to manage posts.</p>

      <form onSubmit={handleLogin} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block font-semibold">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {message && <p className="text-sm text-red-600">{message}</p>}

        <button
          disabled={loading}
          className="w-full rounded-full bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </section>
  );
}