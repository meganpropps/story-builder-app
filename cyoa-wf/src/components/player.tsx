'use client';

import React, { useState } from 'react';
import type { StoryNode } from '../types';

type Props = {
  nodes: StoryNode[];
};

export default function Player({ nodes }: Props) {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(nodes[0]?.id ?? null);
  const currentNode = nodes.find(n => n.id === currentNodeId);

  const handleChoice = (targetId: string | null) => {
    if (targetId) {
      setCurrentNodeId(targetId);
    }
  };

  const reset = () => {
    setCurrentNodeId(nodes[0]?.id ?? null);
  };

  return (
    <aside className="player">
      <div className="player-controls">
        <label>
          <span>Current Scene:</span>
          <select value={currentNodeId ?? ''} onChange={e => setCurrentNodeId(e.target.value || null)}>
            <option value="">-- select scene --</option>
            {nodes.map(n => (
              <option key={n.id} value={n.id}>
                {n.title}
              </option>
            ))}
          </select>
        </label>
        <button onClick={reset}>Reset to Start</button>
      </div>

      <div className="play-area">
        {currentNode ? (
          <>
            <h3>{currentNode.title}</h3>
            <p className="scene-text">{currentNode.text}</p>
            {currentNode.choices.length > 0 ? (
              <div className="choice-buttons">
                {currentNode.choices.map(c => (
                  <button
                    key={c.id}
                    className="choice-btn"
                    onClick={() => handleChoice(c.targetId)}
                    disabled={!c.targetId}
                  >
                    {c.text}
                  </button>
                ))}
              </div>
            ) : (
              <p className="muted">No choices available. This might be an ending.</p>
            )}
          </>
        ) : (
          <p className="muted">No scene selected.</p>
        )}
      </div>
    </aside>
  );
}
