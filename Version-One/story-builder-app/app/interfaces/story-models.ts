import React from 'react';

export type AnimationStyle = 
  | 'fadeIn' 
  | 'sparkle' 
  | 'float' 
  | 'slideUp' 
  | 'magicAppear'
  | 'none';

export type EdgeAnimation = 
  | 'glowing' 
  | 'sparkle' 
  | 'bounce' 
  | 'rainbow'
  | 'none';

export interface Condition {
  variable: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: string | number | boolean;
}

export interface Choice {
  id: string;
  text: string;
  targetNodeId: string;
  animation?: EdgeAnimation;
  condition?: Condition | null;
  hoverText?: string; // Tooltip on hover
}

export interface StoryNodeData {
  title: string;
  text: string;
  backgroundImage?: string;
  characterImage?: string;
  music?: string;
  soundEffect?: string;
  animationStyle: AnimationStyle;
  choices: Choice[];
  // Optional metadata
  tags?: string[];
  notes?: string; // Author notes, not shown to player
  emotionalTone?: 'happy' | 'sad' | 'mysterious' | 'scary' | 'peaceful';
}

export interface StoryNode {
  id: string;
  type: 'storyNode';
  position: { x: number; y: number };
  data: StoryNodeData;
}

export interface StoryEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'default' | 'smoothstep' | 'step' | 'straight';
  animated?: boolean;
  style?: React.CSSProperties;
  data?: {
    animation?: EdgeAnimation;
    condition?: Condition | null;
  };
}

export interface Story {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  nodes: StoryNode[];
  edges: StoryEdge[];
  startNodeId: string | null;
  variables?: Record<string, any>; // For conditional branching
  settings?: {
    theme: 'light' | 'dark' | 'twilight';
    fontFamily: string;
    musicEnabled: boolean;
    autoSave: boolean;
  };
}

export interface StoryMetadata {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  publishedAt?: string;
}

// React Flow node type with proper typing
export type StoryFlowNode = StoryNode;
export type StoryFlowEdge = StoryEdge;