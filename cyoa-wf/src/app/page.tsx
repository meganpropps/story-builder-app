{/*import React, { useEffect, useState } from 'react';
import { StoryNode, Choice } from '../types';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import Player from '../components/Player';

"use client"
import { supabase } from "../lib/supabaseClient";

type StoryNode = {
  id: string;
  title: string;
  text: string;
  choices: Choice[];
};

function Home() {
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
  );
}*/}





import AuthWrapper from "../components/AuthWrapper";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <AuthWrapper />
    </main>
  );
}








{/*const STORAGE_KEY = 'cyoa_nodes_v1';

const sample: StoryNode[] = [
  {
    id: 'start',
    title: 'Start',
    text: 'You wake up in a small clearing. Paths go north and east.',
    choices: [
      { id: 'c_start_1', text: 'Go north', targetId: 'north' },
      { id: 'c_start_2', text: 'Go east', targetId: 'east' }
    ]
  },
  {
    id: 'north',
    title: 'Old Oak',
    text: 'A huge oak tree stands here; something glitters in the roots.',
    choices: [{ id: 'c_north_1', text: 'Inspect the roots', targetId: null }]
  },
  {
    id: 'east',
    title: 'Riverbank',
    text: 'A river runs fast. A rickety bridge crosses it.',
    choices: []
  }
];

function makeId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [nodes, setNodes] = useState<StoryNode[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as StoryNode[] : sample;
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id ?? null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
    if (!selectedNodeId && nodes.length > 0) setSelectedNodeId(nodes[0].id);
  }, [nodes, selectedNodeId]);

  // helpers
  const addNode = () => {
    const id = makeId('node');
    const newNode: StoryNode = { id, title: 'New Scene', text: 'Describe this scene...', choices: [] };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(id);
  };

  const deleteNode = (id: string) => {
    // remove node and any choice targets that pointed to it
    setNodes(prev =>
      prev
        .filter(n => n.id !== id)
        .map(n => ({ ...n, choices: n.choices.map(c => (c.targetId === id ? { ...c, targetId: null } : c)) }))
    );
    if (selectedNodeId === id) setSelectedNodeId(nodes[0]?.id ?? null);
  };

  const updateNode = (updated: StoryNode) => {
    setNodes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
  };

  const addChoice = (nodeId: string) => {
    const newId = makeId('choice');
    setNodes(prev =>
      prev.map(n => (n.id === nodeId ? { ...n, choices: [...n.choices, { id: newId, text: 'New choice', targetId: null }] } : n))
    );
  };

  const updateChoice = (nodeId: string, choiceId: string, patch: Partial<Choice>) => {
    setNodes(prev =>
      prev.map(n =>
        n.id === nodeId
          ? {
              ...n,
              choices: n.choices.map(c => (c.id === choiceId ? { ...c, ...patch } : c))
            }
          : n
      )
    );
  };

  const deleteChoice = (nodeId: string, choiceId: string) => {
    setNodes(prev => prev.map(n => (n.id === nodeId ? { ...n, choices: n.choices.filter(c => c.id !== choiceId) } : n)));
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Adventure Builder — Wireframe</h1>
        <div className="header-actions">
          <button onClick={addNode}>+ Add Node</button>
          <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setNodes(sample); }}>Reset sample</button>
        </div>
      </header>

      <div className="main-grid">
        <Sidebar
          nodes={nodes}
          selectedId={selectedNodeId}
          onSelect={setSelectedNodeId}
          onAdd={addNode}
          onDelete={deleteNode}
        />

        <Editor
          node={nodes.find(n => n.id === selectedNodeId) ?? null}
          allNodes={nodes}
          onUpdateNode={updateNode}
          onAddChoice={addChoice}
          onUpdateChoice={updateChoice}
          onDeleteChoice={deleteChoice}
          onDeleteNode={deleteNode}
        />

        <Player nodes={nodes} />
      </div>
    </div>
  );
}*/}
