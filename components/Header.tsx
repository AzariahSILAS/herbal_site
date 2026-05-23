"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type Profile = {
  role: "user" | "admin";
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"user" | "admin" | null>(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoggedIn(false);
        setRole(null);
        return;
      }

      setLoggedIn(true);

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single<Profile>();

      setRole(data?.role || "user");
    }

    checkUser();
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setRole(null);
    router.push("/");
    router.refresh();
  }

  function getButtonText() {
    if (!loggedIn) return "Get Started";

    if (role === "admin") {
      return pathname === "/admin" ? "Log Out" : "Dashboard";
    }

    return "Log Out";
  }

  function handleButtonClick() {
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    if (role === "admin" && pathname !== "/admin") {
      router.push("/admin");
      return;
    }

    handleLogout();
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-gray-700">
        <Link href="/" className="text-xl font-bold">
          Herbal Wellness
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/catalog" className="hover:text-green-700">
            Catalog
          </Link>

          <button
            onClick={handleButtonClick}
            className="rounded-full bg-green-700 px-4 py-2 text-white hover:bg-green-800"
          >
            {getButtonText()}
          </button>
        </div>
      </nav>
    </header>
  );
}