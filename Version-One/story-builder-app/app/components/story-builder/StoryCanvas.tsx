'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStoryStore } from '../../store/useStoryStore';
import { CustomNode } from './CustomNode';
import { StoryToolbar } from './StoryToolbar';
import { NodeEditor } from './NodeEditor';
import { ChoiceInput } from './ChoiceInput';
import { Sidebar } from '../layout/Sidebar';
import gsap from 'gsap';
import { cn } from '../../lib/utils';

const nodeTypes = {
  storyNode: CustomNode,
};

const StoryCanvasInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    selectNode,
    selectedNodeId,
    openChoiceModal,
    isSidebarOpen,
    isPlayMode,
  } = useStoryStore();

  const reactFlowInstance = useReactFlow();

  // Handle canvas click (deselect nodes)
  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  // Handle node click
  const handleNodeClick = useCallback((_: any, node: any) => {
    selectNode(node.id);
  }, [selectNode]);

  // Handle connection (edge creation)
  const handleConnect = useCallback((connection: any) => {
    if (connection.source && connection.target) {
      // Open modal to configure the choice with both source and target
      openChoiceModal(connection.source, connection.target);
    }
  }, [openChoiceModal]);

  // Handle node context menu (right-click)
  const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
    event.preventDefault();
    selectNode(node.id);
    // Could add context menu here
  }, [selectNode]);

  // Fit view on mount and when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
      }, 100);
    }
  }, [nodes.length, reactFlowInstance]);

  // Add sparkle effects floating around
  useEffect(() => {
    const createSparkle = () => {
      const canvas = reactFlowWrapper.current;
      if (!canvas) return;

      const sparkle = document.createElement('div');
      sparkle.className = 'absolute w-2 h-2 rounded-full bg-yellow-300 pointer-events-none z-10';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.boxShadow = '0 0 10px rgba(253, 224, 71, 0.8)';
      
      canvas.appendChild(sparkle);

      gsap.to(sparkle, {
        opacity: 0,
        scale: 2,
        y: -50,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => sparkle.remove(),
      });
    };

    const interval = setInterval(createSparkle, 3000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        useStoryStore.getState().deleteNode(selectedNodeId);
      }
      
      // Undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useStoryStore.getState().undo();
      }
      
      // Redo
      if (e.ctrlKey && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        useStoryStore.getState().redo();
      }
      
      // Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        useStoryStore.getState().saveToLocalStorage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId]);

  return (
    <div 
      ref={reactFlowWrapper}
      className={cn(
        "w-full h-screen relative transition-all duration-300",
        isSidebarOpen ? "pl-80" : "pl-0"
      )}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
        className="bg-gradient-to-br from-purple-50/30 via-pink-50/30 to-blue-50/30"
        defaultEdgeOptions={{
          animated: true,
          style: { 
            strokeWidth: 3,
            stroke: 'url(#magic-gradient)',
          },
          type: 'smoothstep',
        }}
        minZoom={0.1}
        maxZoom={4}
      >
        {/* Background with magical pattern */}
        <Background 
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#a855f7"
          className="opacity-20"
        />

        {/* Controls */}
        <Controls 
          className="glass !border-white/30 !shadow-glass"
          showInteractive={false}
        />

        {/* Minimap */}
        <MiniMap
          className="glass !border-white/30 !shadow-glass !bg-white/10"
          nodeColor={(node: any) => {
            if (node.id === selectedNodeId) return '#a855f7';
            if (node.data?.isStartNode) return '#22c55e';
            if (node.data?.isEndNode) return '#ef4444';
            return '#c084fc';
          }}
          maskColor="rgba(168, 85, 247, 0.1)"
        />

        {/* Custom Panel - Instructions */}
        {!isPlayMode && (
          <Panel position="top-center" className="glass rounded-2xl px-4 py-2 mt-2 shadow-glass">
            <p className="text-sm text-purple-900 font-semibold">
              ✨ Double-click nodes to edit • Drag from handles to connect scenes • Press Delete to remove
            </p>
          </Panel>
        )}

        {/* Empty State */}
        {nodes.length === 0 && (
          <Panel position="top-center" className="mt-32">
            <div className="glass rounded-3xl p-8 text-center shadow-magic max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center animate-float">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gradient mb-2">
                Start Your Magical Story
              </h3>
              <p className="text-purple-600/70 mb-6">
                Click the <strong>+ button</strong> below to create your first scene
              </p>
            </div>
          </Panel>
        )}

        {/* SVG Gradient Definitions for edges */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <linearGradient id="magic-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="magic-gradient-selected" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
            </linearGradient>
            
            {/* Animated gradient for glowing edges */}
            <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#667eea">
                <animate attributeName="stop-color" values="#667eea; #764ba2; #f093fb; #667eea" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#764ba2">
                <animate attributeName="stop-color" values="#764ba2; #f093fb; #667eea; #764ba2" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#f093fb">
                <animate attributeName="stop-color" values="#f093fb; #667eea; #764ba2; #f093fb" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            {/* Drop shadow for edges */}
            <filter id="edge-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </ReactFlow>

      {/* Toolbar */}
      {!isPlayMode && <StoryToolbar />}

      {/* Node Editor Sidebar */}
      {!isPlayMode && selectedNodeId && <NodeEditor />}

      {/* Choice Modal */}
      <ChoiceInput />
    </div>
  );
};

// Wrapper component with ReactFlowProvider
export const StoryCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <Sidebar />
      <StoryCanvasInner />
    </ReactFlowProvider>
  );
};