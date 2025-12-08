'use client';

import React from 'react';
import { useStoryStore } from '../../store/useStoryStore';
import { Button } from '../ui/Button';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Undo2, 
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Star
} from 'lucide-react';
import { useReactFlow } from 'reactflow';
import { cn } from '../../lib/utils';

export const StoryToolbar: React.FC = () => {
  const reactFlowInstance = useReactFlow();
  const { 
    addNode, 
    deleteNode, 
    duplicateNode,
    selectedNodeId,
    undo,
    redo,
    canUndo,
    canRedo,
    setStartNode,
    nodes
  } = useStoryStore();

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handleAddNode = () => {
    const center = reactFlowInstance.getViewport();
    const position = reactFlowInstance.project({
      x: window.innerWidth / 2 - center.x,
      y: window.innerHeight / 2 - center.y,
    });
    addNode(position);
  };

  const handleDelete = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  };

  const handleDuplicate = () => {
    if (selectedNodeId) {
      duplicateNode(selectedNodeId);
    }
  };

  const handleSetStartNode = () => {
    if (selectedNodeId) {
      setStartNode(selectedNodeId);
    }
  };

  const handleZoomIn = () => {
    reactFlowInstance.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    reactFlowInstance.zoomOut({ duration: 300 });
  };

  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 animate-slide-up">
      <div className="glass rounded-2xl p-3 shadow-magic border border-white/30">
        <div className="flex items-center gap-2">
          {/* Add Node */}
          <Button
            variant="magic"
            size="icon"
            onClick={handleAddNode}
            className="sparkle"
            title="Add New Scene"
          >
            <Plus className="w-5 h-5" />
          </Button>

          <div className="w-px h-8 bg-white/30" />

          {/* Node Actions (only show when node is selected) */}
          {selectedNodeId && (
            <>
              <Button
                variant="glass"
                size="icon"
                onClick={handleSetStartNode}
                disabled={selectedNode?.data.isStartNode}
                title="Set as Start Node"
              >
                <Star className={cn(
                  "w-5 h-5",
                  selectedNode?.data.isStartNode && "fill-yellow-400 text-yellow-400"
                )} />
              </Button>

              <Button
                variant="glass"
                size="icon"
                onClick={handleDuplicate}
                title="Duplicate Node"
              >
                <Copy className="w-5 h-5" />
              </Button>

              <Button
                variant="glass"
                size="icon"
                onClick={handleDelete}
                title="Delete Node"
                className="hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </Button>

              <div className="w-px h-8 bg-white/30" />
            </>
          )}

          {/* History */}
          <Button
            variant="glass"
            size="icon"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </Button>

          <Button
            variant="glass"
            size="icon"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo"
          >
            <Redo2 className="w-5 h-5" />
          </Button>

          <div className="w-px h-8 bg-white/30" />

          {/* Zoom Controls */}
          <Button
            variant="glass"
            size="icon"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>

          <Button
            variant="glass"
            size="icon"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </Button>

          <Button
            variant="glass"
            size="icon"
            onClick={handleFitView}
            title="Fit View"
          >
            <Maximize className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};