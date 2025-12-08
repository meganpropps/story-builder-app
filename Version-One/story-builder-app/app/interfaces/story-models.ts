// Animation types
export type AnimationStyle = 
  | 'fadeIn' 
  | 'sparkle' 
  | 'float' 
  | 'slideUp' 
  | 'magicAppear'
  | 'slideDown'
  | 'none';

export type EdgeAnimation = 
  | 'glowing' 
  | 'sparkle' 
  | 'bounce' 
  | 'rainbow'
  | 'pulse'
  | 'none';

// Conditional branching
export interface Condition {
  variable: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: string | number | boolean;
}

// Choice represents a player decision/edge
export interface Choice {
  id: string;
  text: string;
  targetNodeId: string;
  animation?: EdgeAnimation;
  condition?: Condition | null;
  hoverText?: string;
  emotionalImpact?: 'positive' | 'negative' | 'neutral';
}

// Node data structure
export interface StoryNodeData {
  title: string;
  text: string;
  backgroundImage?: string;
  characterImage?: string;
  music?: string;
  soundEffect?: string;
  animationStyle: AnimationStyle;
  choices: Choice[];
  tags?: string[];
  notes?: string;
  emotionalTone?: 'happy' | 'sad' | 'mysterious' | 'scary' | 'peaceful' | 'exciting';
  isStartNode?: boolean;
  isEndNode?: boolean;
}

// React Flow Node
export interface StoryNode {
  id: string;
  type: 'storyNode';
  position: { x: number; y: number };
  data: StoryNodeData;
}

// React Flow Edge
export interface StoryEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'default' | 'smoothstep' | 'step' | 'straight' | 'bezier';
  animated?: boolean;
  style?: React.CSSProperties;
  data?: {
    animation?: EdgeAnimation;
    condition?: Condition | null;
    choiceId?: string;
  };
}

// Complete Story structure
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
  variables?: Record<string, any>;
  settings?: StorySettings;
}

export interface StorySettings {
  theme: 'light' | 'dark' | 'twilight' | 'enchanted';
  fontFamily: string;
  musicEnabled: boolean;
  autoSave: boolean;
  showMinimap: boolean;
  snapToGrid: boolean;
}

// Story metadata for lists
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
  plays?: number;
}

// Play mode state
export interface PlayState {
  currentNodeId: string;
  variables: Record<string, any>;
  history: string[];
  visitedNodes: Set<string>;
}