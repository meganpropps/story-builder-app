'use client';

import React from 'react';
import type { StoryNode } from '../types';

type Props = {
  node: StoryNode | null;
  allNodes: StoryNode[];
  onUpdateNode: (n: StoryNode) => void;
  onAddChoice: (nodeId: string) => void;
  onUpdateChoice: (nodeId: string, choiceId: string, patch: Partial<{ text: string; targetId: string | null }>) => void;
  onDeleteChoice: (nodeId: string, choiceId: string) => void;
  onDeleteNode: (nodeId: string) => void;
};

export default function Editor({
  node,
  allNodes,
  onUpdateNode,
  onAddChoice,
  onUpdateChoice,
  onDeleteChoice,
  onDeleteNode
}: Props) {
  if (!node) {
    return (
      <main className="editor empty">
        <p>Select a scene to edit (or create a new one).</p>
      </main>
    );
  }

  return (
    <main className="editor">
      <div className="editor-top">
        <input
          className="title-input"
          value={node.title}
          onChange={e => onUpdateNode({ ...node, title: e.target.value })}
          placeholder="Scene title"
        />
        <button className="danger" onClick={() => onDeleteNode(node.id)}>Delete Scene</button>
      </div>

      <textarea
        className="body-input"
        value={node.text}
        onChange={e => onUpdateNode({ ...node, text: e.target.value })}
        placeholder="Write the scene description here..."
      />

      <section className="choices">
        <h3>Choices</h3>
        {node.choices.map(c => (
          <div key={c.id} className="choice-row">
            <input
              value={c.text}
              onChange={e => onUpdateChoice(node.id, c.id, { text: e.target.value })}
              placeholder="Choice text (what player sees)"
            />
            <select
              value={c.targetId ?? ''}
              onChange={e => onUpdateChoice(node.id, c.id, { targetId: e.target.value || null })}
            >
              <option value="">-- choose target (or leave blank) --</option>
              {allNodes.map(n => (
                <option key={n.id} value={n.id}>
                  {n.title}
                </option>
              ))}
            </select>
            <button className="delete-small" onClick={() => onDeleteChoice(node.id, c.id)}>×</button>
          </div>
        ))}

        <div className="choices-actions">
          <button onClick={() => onAddChoice(node.id)}>+ Add choice</button>
        </div>
      </section>
    </main>
  );
}
