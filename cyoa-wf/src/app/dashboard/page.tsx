"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/"); // if logged out, send back to login
      }
    });
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Your Story Nodes</h1>
      <p className="text-gray-600 mt-2">This is where your content will live.</p>
      <button
        onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
