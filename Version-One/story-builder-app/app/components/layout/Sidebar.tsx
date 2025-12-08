'use client';

import React, { useState } from 'react';
import { useStoryStore } from '../../store/useStoryStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  Layers,
  List,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';

type SidebarTab = 'layers' | 'inspector' | 'info';

export const Sidebar: React.FC = () => {
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    nodes,
    selectedNodeId,
    selectNode 
  } = useStoryStore();
  
  const [activeTab, setActiveTab] = useState<SidebarTab>('layers');
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!isSidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className={cn(
          'fixed left-0 top-1/2 -translate-y-1/2 z-30',
          'glass rounded-r-2xl p-2 shadow-glass',
          'hover:bg-white/30 transition-all duration-300',
          'animate-slide-up'
        )}
      >
        <ChevronRight className="w-5 h-5 text-purple-600" />
      </button>
    );
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 bottom-0 z-30 w-80',
        'glass border-r border-white/30 shadow-glass',
        'flex flex-col animate-slide-up'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/30">
        <h2 className="text-lg font-bold text-gradient">Story Inspector</h2>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={toggleSidebar}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/30">
        <button
          onClick={() => setActiveTab('layers')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 transition-all',
            activeTab === 'layers' 
              ? 'bg-white/20 text-purple-700 font-semibold border-b-2 border-purple-500' 
              : 'text-purple-600/70 hover:bg-white/10'
          )}
        >
          <Layers className="w-4 h-4" />
          <span className="text-sm">Layers</span>
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 transition-all',
            activeTab === 'inspector' 
              ? 'bg-white/20 text-purple-700 font-semibold border-b-2 border-purple-500' 
              : 'text-purple-600/70 hover:bg-white/10'
          )}
        >
          <List className="w-4 h-4" />
          <span className="text-sm">Inspector</span>
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 transition-all',
            activeTab === 'info' 
              ? 'bg-white/20 text-purple-700 font-semibold border-b-2 border-purple-500' 
              : 'text-purple-600/70 hover:bg-white/10'
          )}
        >
          <Info className="w-4 h-4" />
          <span className="text-sm">Info</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {activeTab === 'layers' && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-purple-900 mb-3">
              Story Nodes ({nodes.length})
            </h3>
            {nodes.map((node) => (
              <Card
                key={node.id}
                variant={node.id === selectedNodeId ? 'magic' : 'glass'}
                padding="sm"
                hoverable
                onClick={() => selectNode(node.id)}
                className={cn(
                  'cursor-pointer',
                  node.id === selectedNodeId && 'ring-2 ring-purple-400'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-purple-900 truncate">
                      {node.data.title}
                    </p>
                    <p className="text-xs text-purple-600/70 truncate">
                      {node.data.choices.length} choice(s)
                    </p>
                  </div>
                  {node.data.isStartNode && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Start
                    </span>
                  )}
                </div>
              </Card>
            ))}
            {nodes.length === 0 && (
              <div className="text-center py-8 text-purple-400/70">
                <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No nodes yet</p>
                <p className="text-xs mt-1">Click the canvas to add one!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inspector' && (
          <div className="space-y-4">
            {selectedNode ? (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-purple-900 mb-2">
                    Node Properties
                  </h3>
                  <Card variant="glass" padding="sm">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-purple-600/70">ID:</span>
                        <span className="ml-2 font-mono text-xs">{selectedNode.id}</span>
                      </div>
                      <div>
                        <span className="text-purple-600/70">Title:</span>
                        <span className="ml-2">{selectedNode.data.title}</span>
                      </div>
                      <div>
                        <span className="text-purple-600/70">Choices:</span>
                        <span className="ml-2">{selectedNode.data.choices.length}</span>
                      </div>
                      <div>
                        <span className="text-purple-600/70">Animation:</span>
                        <span className="ml-2">{selectedNode.data.animationStyle}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {selectedNode.data.choices.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-purple-900 mb-2">
                      Choices
                    </h3>
                    <div className="space-y-2">
                      {selectedNode.data.choices.map((choice) => (
                        <Card key={choice.id} variant="glass" padding="sm">
                          <p className="text-sm font-medium text-purple-900">
                            {choice.text}
                          </p>
                          <p className="text-xs text-purple-600/70 mt-1">
                            → {nodes.find(n => n.id === choice.targetNodeId)?.data.title || 'Unknown'}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-purple-400/70">
                <List className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No node selected</p>
                <p className="text-xs mt-1">Click a node to inspect it</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-4">
            <Card variant="glass" padding="md">
              <h3 className="text-sm font-semibold text-purple-900 mb-2">
                Story Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-600/70">Total Nodes:</span>
                  <span className="font-semibold">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600/70">Total Connections:</span>
                  <span className="font-semibold">
                    {nodes.reduce((sum, node) => sum + node.data.choices.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-600/70">Start Node:</span>
                  <span className="font-semibold">
                    {nodes.find(n => n.data.isStartNode)?.data.title || 'None'}
                  </span>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="md">
              <h3 className="text-sm font-semibold text-purple-900 mb-2">
                Quick Tips ✨
              </h3>
              <ul className="space-y-2 text-xs text-purple-600/70">
                <li>• Double-click a node to edit it</li>
                <li>• Drag from handles to create connections</li>
                <li>• Right-click nodes for more options</li>
                <li>• Use the Play button to test your story</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </aside>
  );
};