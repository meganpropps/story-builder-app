"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Check your email for a magic link!");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-slate-900 rounded-xl shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Sign in</h1>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-2 rounded bg-slate-800 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-700"
        >
          Send Magic Link
        </button>
      </div>
    </div>
  );
}
