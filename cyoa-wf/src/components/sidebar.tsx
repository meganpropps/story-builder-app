'use client';

import type { StoryNode } from '../types';

type Props = {
  nodes: StoryNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
};

export default function Sidebar({ nodes, selectedId, onSelect, onAdd, onDelete }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Scenes</h3>
        <button onClick={onAdd}>+</button>
      </div>
      <ul className="node-list">
        {nodes.map(n => (
          <li key={n.id} className={`node-item ${selectedId === n.id ? 'selected' : ''}`}>
            <button className="node-title" onClick={() => onSelect(n.id)}>
              {n.title}
            </button>
            <button className="delete-small" onClick={() => onDelete(n.id)}>×</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
