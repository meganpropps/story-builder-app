"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AuthUI from "../components/AuthUI";


type StoryNode = {
  id: string;
  title: string;
  text: string;
};

export default function Home() {
  const [nodes, setNodes] = useState<StoryNode[]>([]);

  useEffect(() => {
    const fetchNodes = async () => {
      const { data, error } = await supabase.from("story_nodes").select("*");
      if (error) console.error(error);
      else setNodes(data || []);
    };
    fetchNodes();
  }, []);

  return (
    <main><AuthUI />
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Story Nodes</h1>
      <ul className="space-y-2">
        {nodes.map((n) => (
          <li key={n.id} className="p-3 rounded bg-slate-800">
            <h2 className="font-semibold">{n.title}</h2>
            <p className="text-sm text-slate-400">{n.text}</p>
          </li>
        ))}
      </ul>
    </div>
    </main>
  );
}
