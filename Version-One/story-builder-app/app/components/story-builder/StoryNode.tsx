'use client';

import React, { useEffect, useRef } from 'react';
import {
  Handle,
  Position,
  NodeProps,
  NodeResizer,
} from 'reactflow';
import { StoryNodeData } from '../../interfaces/story-models';
import { cn } from '../../lib/utils';
import { Sparkles, Edit3 } from 'lucide-react';
import { useStoryStore } from '../../store/useStoryStore';
import { motion } from 'framer-motion';
import gsap from 'gsap';

type StoryNodeProps = NodeProps<StoryNodeData>;

export const StoryNode: React.FC<StoryNodeProps> = (props) => {
  const { data, selected } = props;
  const { selectNode } = useStoryStore();
  const nodeRef = useRef<HTMLDivElement | null>(null);

  // GSAP entrance
  useEffect(() => {
    if (nodeRef.current) {
      gsap.fromTo(
        nodeRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  // Animation style mapping
  const animationClass = {
    fadeIn: 'animate-magic-appear',
    sparkle: 'animate-sparkle',
    float: 'animate-float',
    slideUp: 'animate-slide-up',
    magicAppear: 'animate-magic-appear',
    slideDown: 'animate-slide-down',
    none: '',
  }[data.animationStyle];

  const handleDoubleClick = () => {
    selectNode(props.id);
    // Additional behavior like opening side editor is handled by Sidebar/NodeEditor
  };

  return (
    <>
      {/* React Flow resizer - optional */}
      <NodeResizer
        isVisible={selected}
        minWidth={220}
        minHeight={140}
      />

      <motion.div
        ref={nodeRef}
        className={cn(
          'magic-card w-[260px] min-h-[140px] select-none cursor-pointer',
          'relative overflow-hidden node-float',
          selected && 'glow-selected'
        )}
        onClick={() => selectNode(props.id)}
        onDoubleClick={handleDoubleClick}
        whileHover={{ scale: 1.02 }}
      >
        {/* Background image */}
        {data.backgroundImage && (
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: `url(${data.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'saturate(1.1) contrast(1.05)',
            }}
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/40" />

        {/* Content */}
        <div className={cn('relative z-10 flex flex-col h-full', animationClass)}>
          {/* Header */}
          <div className="flex items-center justify-between px-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/30 text-white/90">
                Scene
              </span>
              {data.isStartNode && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/80 text-black font-semibold">
                  START
                </span>
              )}
              {data.isEndNode && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-300/90 text-black font-semibold">
                  END
                </span>
              )}
            </div>
            <Edit3 className="w-4 h-4 text-white/70" />
          </div>

          {/* Title */}
          <div className="px-3 mt-2">
            <h3 className="text-sm font-semibold text-white line-clamp-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              {data.title}
            </h3>
          </div>

          {/* Text preview */}
          <p className="text-xs text-white/80 px-3 mt-1 line-clamp-3">
            {data.text}
          </p>

          {/* Character image */}
          {data.characterImage && (
            <div className="absolute -bottom-6 -right-4 w-20 h-20 rounded-full overflow-hidden border-2 border-white/70 shadow-glow">
              <img
                src={data.characterImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Footer with choices count */}
          <div className="mt-auto px-3 pb-2 pt-1 flex items-center justify-between">
            <span className="text-[11px] text-white/80">
              {data.choices.length} choice
              {data.choices.length === 1 ? '' : 's'}
            </span>
            <span className="text-[10px] text-white/70">
              {data.emotionalTone || 'mysterious'}
            </span>
          </div>
        </div>

        {/* Handles */}
        {/* Top (incoming) */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-purple-400 border-2 border-white shadow-glow"
        />
        {/* Bottom (outgoing) */}
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-pink-400 border-2 border-white shadow-glow"
        />
      </motion.div>
    </>
  );
};