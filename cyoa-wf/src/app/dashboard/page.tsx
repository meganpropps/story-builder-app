"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabaseClient";
import ProtectedRoute from "../../components/ProtectedRoute";
import Editor from "../../components/Editor";
import Player from "../../components/Player";
import Sidebar from "../../components/Sidebar";
import { useTheme } from "../../components/ThemeContext";
import { Plus } from "lucide-react";
import type { StoryNode, Choice } from "../../types";

export default function DashboardPage() {
  const { isDark } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Story management state
  const [nodes, setNodes] = useState<StoryNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [stories, setStories] = useState<any[]>([]);

  // Load story nodes
  useEffect(() => {
    async function loadNodes() {
      const { data, error } = await supabase
        .from("story_nodes")
        .select(`
          *,
          choices (*)
        `)
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        const formattedNodes: StoryNode[] = data.map(node => ({
          id: node.id,
          title: node.title,
          text: node.text,
          choices: node.choices || []
        }));
        setNodes(formattedNodes);
        if (formattedNodes.length > 0 && !selectedNodeId) {
          setSelectedNodeId(formattedNodes[0].id);
        }
      }
    }
    loadNodes();
  }, []);

  // Load stories (keeping existing functionality)
  useEffect(() => {
    async function loadStories() {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setStories(data);
    }
    loadStories();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (!data.session) {
        router.push("/auth");
      }
    });
  }, [router]);

  // Handler functions for the components
  const handleUpdateNode = async (updatedNode: StoryNode) => {
    try {
      const { error } = await supabase
        .from("story_nodes")
        .update({ title: updatedNode.title, text: updatedNode.text })
        .eq("id", updatedNode.id);

      if (error) throw error;

      setNodes(prev => prev.map(node => 
        node.id === updatedNode.id ? updatedNode : node
      ));
    } catch (error) {
      console.error("Error updating node:", error);
    }
  };

  const handleAddChoice = async (nodeId: string) => {
    try {
      const { data, error } = await supabase
        .from("choices")
        .insert({
          node_id: nodeId,
          text: "New choice",
          target_id: null
        })
        .select()
        .single();

      if (error) throw error;

      const newChoice: Choice = {
        id: data.id,
        text: data.text,
        targetId: data.target_id
      };

      setNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? { ...node, choices: [...node.choices, newChoice] }
          : node
      ));
    } catch (error) {
      console.error("Error adding choice:", error);
    }
  };

  const handleUpdateChoice = async (nodeId: string, choiceId: string, patch: Partial<{ text: string; targetId: string | null }>) => {
    try {
      const { error } = await supabase
        .from("choices")
        .update(patch)
        .eq("id", choiceId);

      if (error) throw error;

      setNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? {
              ...node,
              choices: node.choices.map(choice =>
                choice.id === choiceId ? { ...choice, ...patch } : choice
              )
            }
          : node
      ));
    } catch (error) {
      console.error("Error updating choice:", error);
    }
  };

  const handleDeleteChoice = async (nodeId: string, choiceId: string) => {
    try {
      const { error } = await supabase
        .from("choices")
        .delete()
        .eq("id", choiceId);

      if (error) throw error;

      setNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? { ...node, choices: node.choices.filter(choice => choice.id !== choiceId) }
          : node
      ));
    } catch (error) {
      console.error("Error deleting choice:", error);
    }
  };

  const handleDeleteNode = async (nodeId: string) => {
    try {
      const { error } = await supabase
        .from("story_nodes")
        .delete()
        .eq("id", nodeId);

      if (error) throw error;

      setNodes(prev => prev.filter(node => node.id !== nodeId));
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(nodes.length > 1 ? nodes.find(n => n.id !== nodeId)?.id || null : null);
      }
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  const handleAddNode = async () => {
    try {
      const { data, error } = await supabase
        .from("story_nodes")
        .insert({
          user_id: session?.user?.id,
          title: "New Scene",
          text: "Write your scene here..."
        })
        .select()
        .single();

      if (error) throw error;

      const newNode: StoryNode = {
        id: data.id,
        title: data.title,
        text: data.text,
        choices: []
      };

      setNodes(prev => [newNode, ...prev]);
      setSelectedNodeId(newNode.id);
    } catch (error) {
      console.error("Error adding node:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!session) return null;

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <ProtectedRoute>
      <main className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              Welcome back, {session.user?.email?.split('@')[0]}!
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Ready to create your next adventure?
            </p>
          </div>
          <button 
            onClick={() => router.push("/stories/new")}
            className={`inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg transition-all duration-300 comic-border comic-shadow ${
              isDark 
                ? 'bg-green-600 hover:bg-green-500 border-green-400 text-white' 
                : 'bg-green-500 hover:bg-green-600 border-green-700 text-white'
            }`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Story
          </button>
        </div>

        {/* Story Builder Interface */}
        <div className={`rounded-xl border-3 p-6 mb-8 ${
          isDark 
            ? 'bg-slate-800 border-purple-500' 
            : 'bg-white border-purple-300'
        } comic-border comic-shadow`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}>
            Story Builder
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar
                nodes={nodes}
                selectedId={selectedNodeId}
                onSelect={setSelectedNodeId}
                onAdd={handleAddNode}
                onDelete={handleDeleteNode}
              />
            </div>

            {/* Editor */}
            <div className="lg:col-span-2">
              <Editor
                node={selectedNode || null}
                allNodes={nodes}
                onUpdateNode={handleUpdateNode}
                onAddChoice={handleAddChoice}
                onUpdateChoice={handleUpdateChoice}
                onDeleteChoice={handleDeleteChoice}
                onDeleteNode={handleDeleteNode}
              />
            </div>

            {/* Player */}
            <div className="lg:col-span-1">
              <Player nodes={nodes} />
            </div>
          </div>
        </div>

        {/* Existing Stories Section */}
        <section>
          <h2 className={`text-3xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}>
            Your Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className={`p-6 rounded-xl border-3 shadow-lg hover:scale-105 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-800 border-purple-500' 
                    : 'bg-white border-purple-300'
                } comic-border comic-shadow`}
              >
                <h3 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  {story.title}
                </h3>
                <p className={`text-sm mb-4 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {story.content?.text?.slice(0, 100) || "No content yet"}
                </p>
                <div className="flex gap-2">
                  <button className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    isDark 
                      ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}>
                    Edit
                  </button>
                  <button className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    isDark 
                      ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-slate-800'
                  }`}>
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}