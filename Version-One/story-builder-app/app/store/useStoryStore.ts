import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  Node, 
  NodeChange, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges 
} from 'reactflow';
import { nanoid } from 'nanoid';
import type { 
  Story, 
  StoryNode, 
  StoryEdge, 
  StoryNodeData, 
  Choice,
  PlayState
} from '../interfaces/story-models';

interface StoryState {
  // Current story
  currentStory: Story | null;
  nodes: StoryNode[];
  edges: StoryEdge[];
  
  // UI state
  selectedNodeId: string | null;
  isPlayMode: boolean;
  currentPlayNodeId: string | null;
  playState: PlayState | null;
  isSidebarOpen: boolean;
  isChoiceModalOpen: boolean;
  pendingConnection: { sourceNodeId: string; targetNodeId?: string } | null;
  
  // History for undo/redo
  history: { nodes: StoryNode[]; edges: StoryEdge[] }[];
  historyIndex: number;
  
  // Actions
  setCurrentStory: (story: Story) => void;
  createNewStory: (title: string, author: string) => void;
  
  // Node CRUD
  addNode: (position: { x: number; y: number }) => void;
  updateNode: (nodeId: string, data: Partial<StoryNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  setStartNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  
  // Edge/Choice CRUD
  addChoice: (sourceNodeId: string, choice: Omit<Choice, 'id'>) => void;
  updateChoice: (sourceNodeId: string, choiceId: string, updates: Partial<Choice>) => void;
  deleteChoice: (sourceNodeId: string, choiceId: string) => void;
  
  // React Flow handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Play mode
  togglePlayMode: () => void;
  setCurrentPlayNode: (nodeId: string | null) => void;
  makeChoice: (choiceId: string) => void;
  resetPlay: () => void;
  
  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  exportStory: () => string;
  importStory: (json: string) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // UI Actions
  openChoiceModal: (sourceNodeId: string, targetNodeId?: string) => void;
  closeChoiceModal: () => void;
  toggleSidebar: () => void;
}

const createDefaultNode = (position: { x: number; y: number }): StoryNode => ({
  id: nanoid(),
  type: 'storyNode',
  position,
  data: {
    title: '✨ New Scene',
    text: 'Once upon a time...',
    animationStyle: 'fadeIn',
    choices: [],
    emotionalTone: 'mysterious',
  },
});

const createDefaultStory = (title: string, author: string): Story => {
  const startNode = createDefaultNode({ x: 250, y: 100 });
  startNode.data.title = '🌟 Beginning';
  startNode.data.text = 'Your magical story begins here...';
  startNode.data.isStartNode = true;
  
  return {
    id: nanoid(),
    title,
    description: '',
    author,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [startNode],
    edges: [],
    startNodeId: startNode.id,
    settings: {
      theme: 'light',
      fontFamily: 'Inter',
      musicEnabled: true,
      autoSave: true,
      showMinimap: true,
      snapToGrid: true,
    },
  };
};

export const useStoryStore = create<StoryState>()(
  devtools(
    persist(
      (set, get) => ({
        currentStory: null,
        nodes: [],
        edges: [],
        selectedNodeId: null,
        isPlayMode: false,
        currentPlayNodeId: null,
        playState: null,
        isSidebarOpen: true,
        isChoiceModalOpen: false,
        pendingConnection: null,
        history: [],
        historyIndex: -1,

        setCurrentStory: (story) => {
          // Ensure the start node has isStartNode flag set
          const nodes = story.nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isStartNode: node.id === story.startNodeId,
            },
          }));
          
          set({
            currentStory: {
              ...story,
              nodes,
            },
            nodes,
            edges: story.edges,
            currentPlayNodeId: story.startNodeId,
          });
        },

        createNewStory: (title, author) => {
          const newStory = createDefaultStory(title, author);
          set({
            currentStory: newStory,
            nodes: newStory.nodes,
            edges: newStory.edges,
            currentPlayNodeId: newStory.startNodeId,
            history: [],
            historyIndex: -1,
          });
        },

        addNode: (position) => {
          const newNode = createDefaultNode(position);
          
          set((state) => {
            const newNodes = [...state.nodes, newNode];
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ nodes: newNodes, edges: state.edges });
            
            return {
              nodes: newNodes,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                nodes: newNodes,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        updateNode: (nodeId, data) => {
          set((state) => {
            const newNodes = state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, ...data } }
                : node
            );
            
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ nodes: newNodes, edges: state.edges });
            
            return {
              nodes: newNodes,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                nodes: newNodes,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        deleteNode: (nodeId) => {
          set((state) => {
            const newNodes = state.nodes.filter((node) => node.id !== nodeId);
            const newEdges = state.edges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId
            );
            
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ nodes: newNodes, edges: newEdges });
            
            return {
              nodes: newNodes,
              edges: newEdges,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                nodes: newNodes,
                edges: newEdges,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        duplicateNode: (nodeId) => {
          set((state) => {
            const nodeToDuplicate = state.nodes.find((node) => node.id === nodeId);
            if (!nodeToDuplicate) return state;

            const newId = nanoid();
            const duplicatedNode: StoryNode = {
              ...nodeToDuplicate,
              id: newId,
              position: {
                x: nodeToDuplicate.position.x + 100,
                y: nodeToDuplicate.position.y + 100,
              },
              data: {
                ...nodeToDuplicate.data,
                choices: nodeToDuplicate.data.choices.map((choice) => ({
                  ...choice,
                  id: nanoid(),
                  // Note: targetNodeId will need to be updated manually or we could create a mapping
                })),
              },
            };

            const newNodes = [...state.nodes, duplicatedNode];
            
            // Duplicate edges that originate from this node
            const edgesToDuplicate = state.edges.filter((edge) => edge.source === nodeId);
            const newEdges = [
              ...state.edges,
              ...edgesToDuplicate.map((edge) => {
                // Find the corresponding choice in the duplicated node
                const originalChoiceIndex = nodeToDuplicate.data.choices.findIndex(
                  (choice) => edge.id.includes(choice.id)
                );
                const duplicatedChoice = duplicatedNode.data.choices[originalChoiceIndex];
                
                return {
                  ...edge,
                  id: `edge-${newId}-${edge.target}-${duplicatedChoice?.id || nanoid()}`,
                  source: newId,
                };
              }),
            ];

            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ nodes: newNodes, edges: newEdges });
            
            return {
              nodes: newNodes,
              edges: newEdges,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              selectedNodeId: newId,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                nodes: newNodes,
                edges: newEdges,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        setStartNode: (nodeId) => {
          set((state) => {
            if (!state.currentStory) return state;
            
            // Update nodes to reflect the new start node
            const newNodes = state.nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                isStartNode: node.id === nodeId,
              },
            }));
            
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ nodes: newNodes, edges: state.edges });
            
            return {
              nodes: newNodes,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              currentStory: {
                ...state.currentStory,
                startNodeId: nodeId,
                nodes: newNodes,
                updatedAt: new Date().toISOString(),
              },
            };
          });
        },

        selectNode: (nodeId) => {
          set({ selectedNodeId: nodeId });
        },

        addChoice: (sourceNodeId, choice) => {
          const choiceId = nanoid();
          const newChoice: Choice = { ...choice, id: choiceId };
          
          set((state) => {
            const newNodes = state.nodes.map((node) => {
              if (node.id === sourceNodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    choices: [...node.data.choices, newChoice],
                  },
                };
              }
              return node;
            });
            
            const newEdge: StoryEdge = {
              id: `edge-${sourceNodeId}-${choice.targetNodeId}-${choiceId}`,
              source: sourceNodeId,
              target: choice.targetNodeId,
              label: choice.text,
              animated: true,
              type: 'smoothstep',
              data: {
                animation: choice.animation,
                condition: choice.condition,
              },
            };
            
            const newEdges = [...state.edges, newEdge];
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ nodes: newNodes, edges: newEdges });
            
            return {
              nodes: newNodes,
              edges: newEdges,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                nodes: newNodes,
                edges: newEdges,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        updateChoice: (sourceNodeId, choiceId, updates) => {
          set((state) => {
            const newNodes = state.nodes.map((node) => {
              if (node.id === sourceNodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    choices: node.data.choices.map((choice) =>
                      choice.id === choiceId ? { ...choice, ...updates } : choice
                    ),
                  },
                };
              }
              return node;
            });
            
            // Update corresponding edge
            const updatedChoice = newNodes
              .find((node) => node.id === sourceNodeId)
              ?.data.choices.find((choice) => choice.id === choiceId);
            
            const newEdges = state.edges.map((edge) => {
              if (edge.id.includes(choiceId)) {
                return {
                  ...edge,
                  label: updatedChoice?.text || edge.label,
                  data: {
                    animation: updatedChoice?.animation,
                    condition: updatedChoice?.condition,
                  },
                };
              }
              return edge;
            });
            
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ nodes: newNodes, edges: newEdges });
            
            return {
              nodes: newNodes,
              edges: newEdges,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                nodes: newNodes,
                edges: newEdges,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        deleteChoice: (sourceNodeId, choiceId) => {
          set((state) => {
            const newNodes = state.nodes.map((node) => {
              if (node.id === sourceNodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    choices: node.data.choices.filter((choice) => choice.id !== choiceId),
                  },
                };
              }
              return node;
            });
            
            // Remove corresponding edge
            const newEdges = state.edges.filter((edge) => !edge.id.includes(choiceId));
            
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ nodes: newNodes, edges: newEdges });
            
            return {
              nodes: newNodes,
              edges: newEdges,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                nodes: newNodes,
                edges: newEdges,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        onNodesChange: (changes) => {
          set((state) => {
            const newNodes = applyNodeChanges(changes, state.nodes) as StoryNode[];
            return { nodes: newNodes };
          });
        },

        onEdgesChange: (changes) => {
          set((state) => {
            const newEdges = applyEdgeChanges(changes, state.edges) as StoryEdge[];
            return { edges: newEdges };
          });
        },

        onConnect: (connection) => {
          if (!connection.source || !connection.target) return;
          
          const newEdge: StoryEdge = {
            id: `edge-${connection.source}-${connection.target}-${nanoid()}`,
            source: connection.source,
            target: connection.target,
            type: 'smoothstep',
            animated: true,
          };
          
          set((state) => {
            const newEdges = addEdge(newEdge, state.edges) as StoryEdge[];
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push({ nodes: state.nodes, edges: newEdges });
            
            return {
              edges: newEdges,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                edges: newEdges,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        togglePlayMode: () => {
          set((state) => {
            const enteringPlayMode = !state.isPlayMode;
            const startNodeId = state.currentStory?.startNodeId;
            
            if (enteringPlayMode && startNodeId) {
              // Initialize play state when entering play mode
              const playState: PlayState = {
                currentNodeId: startNodeId,
                variables: state.currentStory?.variables || {},
                history: [],
                visitedNodes: new Set([startNodeId]),
              };
              
              return {
                isPlayMode: true,
                currentPlayNodeId: startNodeId,
                playState,
              };
            } else {
              // Exit play mode
              return {
                isPlayMode: false,
                currentPlayNodeId: null,
                playState: null,
              };
            }
          });
        },

        setCurrentPlayNode: (nodeId) => {
          set({ currentPlayNodeId: nodeId });
        },

        makeChoice: (choiceId) => {
          set((state) => {
            if (!state.currentPlayNodeId || !state.playState) return state;
            
            const currentNode = state.nodes.find((node) => node.id === state.currentPlayNodeId);
            if (!currentNode) return state;
            
            const choice = currentNode.data.choices.find((c) => c.id === choiceId);
            if (!choice) return state;
            
            // Update play state
            const newHistory = [...state.playState.history, state.currentPlayNodeId];
            const newVisitedNodes = new Set(state.playState.visitedNodes);
            newVisitedNodes.add(choice.targetNodeId);
            
            const updatedPlayState: PlayState = {
              currentNodeId: choice.targetNodeId,
              variables: state.playState.variables,
              history: newHistory,
              visitedNodes: newVisitedNodes,
            };
            
            return {
              currentPlayNodeId: choice.targetNodeId,
              playState: updatedPlayState,
            };
          });
        },

        resetPlay: () => {
          set((state) => {
            const startNodeId = state.currentStory?.startNodeId;
            
            if (!startNodeId) return state;
            
            const playState: PlayState = {
              currentNodeId: startNodeId,
              variables: state.currentStory?.variables || {},
              history: [],
              visitedNodes: new Set([startNodeId]),
            };
            
            return {
              currentPlayNodeId: startNodeId,
              playState,
            };
          });
        },

        saveToLocalStorage: () => {
          const state = get();
          if (state.currentStory) {
            localStorage.setItem('currentStory', JSON.stringify(state.currentStory));
          }
        },

        loadFromLocalStorage: () => {
          const stored = localStorage.getItem('currentStory');
          if (stored) {
            try {
              const story: Story = JSON.parse(stored);
              set({
                currentStory: story,
                nodes: story.nodes,
                edges: story.edges,
                currentPlayNodeId: story.startNodeId,
              });
            } catch (error) {
              console.error('Failed to load story from localStorage:', error);
            }
          }
        },

        exportStory: () => {
          const state = get();
          if (!state.currentStory) {
            throw new Error('No story to export');
          }
          return JSON.stringify(state.currentStory, null, 2);
        },

        importStory: (json) => {
          try {
            const story: Story = JSON.parse(json);
            set({
              currentStory: story,
              nodes: story.nodes,
              edges: story.edges,
              currentPlayNodeId: story.startNodeId,
              history: [],
              historyIndex: -1,
            });
          } catch (error) {
            console.error('Failed to import story:', error);
            throw new Error('Invalid story format');
          }
        },

        undo: () => {
          set((state) => {
            if (state.historyIndex <= 0) return state;
            
            const previousState = state.history[state.historyIndex - 1];
            return {
              nodes: previousState.nodes,
              edges: previousState.edges,
              historyIndex: state.historyIndex - 1,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                nodes: previousState.nodes,
                edges: previousState.edges,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        redo: () => {
          set((state) => {
            if (state.historyIndex >= state.history.length - 1) return state;
            
            const nextState = state.history[state.historyIndex + 1];
            return {
              nodes: nextState.nodes,
              edges: nextState.edges,
              historyIndex: state.historyIndex + 1,
              currentStory: state.currentStory ? {
                ...state.currentStory,
                nodes: nextState.nodes,
                edges: nextState.edges,
                updatedAt: new Date().toISOString(),
              } : null,
            };
          });
        },

        canUndo: () => {
          return get().historyIndex > 0;
        },

        canRedo: () => {
          const state = get();
          return state.historyIndex < state.history.length - 1;
        },

        openChoiceModal: (sourceNodeId, targetNodeId) => {
          set({
            isChoiceModalOpen: true,
            pendingConnection: {
              sourceNodeId,
              targetNodeId,
            },
          });
        },

        closeChoiceModal: () => {
          set({ 
            isChoiceModalOpen: false,
            pendingConnection: null 
          });
        },

        toggleSidebar: () => {
          set((state) => ({
            isSidebarOpen: !state.isSidebarOpen,
          }));
        },
      }),
      {
        name: 'story-store',
      }
    ),
    { name: 'StoryStore' }
  )
);