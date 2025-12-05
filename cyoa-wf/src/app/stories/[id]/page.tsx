"use client";
// pages/stories/[id].tsx
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import ProtectedRoute from "../../../components/ProtectedRoute";

type StoryNode = {
  id: string;
  title: string;
  text: string;
  created_at: string;
};

type Choice = {
  id: string;
  text: string;
  target_id: string | null;
};

export default function StoryEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // story node id

  const [node, setNode] = useState<StoryNode | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for editing node
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // Form states for adding new choice
  const [choiceText, setChoiceText] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchNodeAndChoices() {
      try {
        setLoading(true);

        // Fetch node
        const { data: nodeData, error: nodeError } = await supabase
          .from("story_nodes")
          .select("*")
          .eq("id", id)
          .single();

        if (nodeError) throw nodeError;

        setNode(nodeData);
        setTitle(nodeData.title);
        setText(nodeData.text);

        // Fetch choices
        const { data: choiceData, error: choiceError } = await supabase
          .from("choices")
          .select("*")
          .eq("node_id", id);

        if (choiceError) throw choiceError;

        setChoices(choiceData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNodeAndChoices();
  }, [id]);

  async function handleUpdateNode(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("story_nodes")
        .update({ title, text })
        .eq("id", id);

      if (error) throw error;

      alert("Node updated!");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleAddChoice(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Create a new node as the target of this choice
      const { data: newNode, error: nodeError } = await supabase
        .from("story_nodes")
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          title: "New Node",
          text: "Write this part of the story...",
        })
        .select()
        .single();

      if (nodeError) throw nodeError;

      // Link current node → new node
      const { error: choiceError } = await supabase.from("choices").insert({
        node_id: id,
        text: choiceText,
        target_id: newNode.id,
      });

      if (choiceError) throw choiceError;

      setChoiceText("");
      router.push(`/stories/${newNode.id}`); // jump to new node
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!node) return <p className="p-6">Node not found.</p>;

  return (
    <ProtectedRoute>
      <section className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Editing Node</h1>

        {/* Edit Node Form */}
        <form onSubmit={handleUpdateNode} className="space-y-4 mb-8">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium">Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Node
          </button>
        </form>

        {/* Choices */}
        <h2 className="text-2xl font-semibold mb-4">Choices</h2>
        <ul className="space-y-2 mb-6">
          {choices.map((choice) => (
            <li key={choice.id}>
              <button
                onClick={() => router.push(`/stories/${choice.target_id}`)}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                {choice.text}
              </button>
            </li>
          ))}
        </ul>

        {/* Add New Choice */}
        <form onSubmit={handleAddChoice} className="flex gap-2">
          <input
            type="text"
            value={choiceText}
            onChange={(e) => setChoiceText(e.target.value)}
            placeholder="Enter choice text"
            required
            className="flex-1 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Choice
          </button>
        </form>
      </section>
    </ProtectedRoute>
  );
}
