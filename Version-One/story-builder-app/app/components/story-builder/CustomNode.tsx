'use client';

import React, { memo, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useStoryStore } from '../../store/useStoryStore';
import type { StoryNodeData } from '../../interfaces/story-models';
import { cn } from '../../lib/utils';
import { Sparkles, Star, Edit } from 'lucide-react';
import gsap from 'gsap';

export const CustomNode = memo(({ id, data, selected }: NodeProps<StoryNodeData>) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { selectNode } = useStoryStore();

  // GSAP entrance animation
  useEffect(() => {
    if (nodeRef.current) {
      gsap.fromTo(
        nodeRef.current,
        {
          scale: 0.8,
          opacity: 0,
          rotateZ: -5,
        },
        {
          scale: 1,
          opacity: 1,
          rotateZ: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }
      );
    }
  }, []);

  // Floating animation on selection
  useEffect(() => {
    if (selected && nodeRef.current) {
      gsap.to(nodeRef.current, {
        y: -5,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else if (nodeRef.current) {
      gsap.to(nodeRef.current, {
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [selected]);

  const handleDoubleClick = () => {
    selectNode(id);
  };

  return (
    <div
      ref={nodeRef}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'relative group transition-all duration-300',
        selected && 'z-10'
      )}
    >
      {/* Target Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          'w-3 h-3 !bg-gradient-to-br from-purple-400 to-pink-400',
          '!border-2 !border-white shadow-glow',
          'transition-all duration-300',
          'hover:scale-150'
        )}
      />

      {/* Main Node Card */}
      <div
        className={cn(
          'w-64 glass rounded-3xl shadow-glass overflow-hidden',
          'border-2 transition-all duration-300',
          selected 
            ? 'border-purple-400 shadow-magic' 
            : 'border-white/30 hover:border-purple-300',
          data.isStartNode && 'ring-2 ring-green-400 ring-offset-2'
        )}
      >
        {/* Header */}
        <div
          className="relative h-24 overflow-hidden"
          style={{
            background: data.backgroundImage 
              ? `url(${data.backgroundImage})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          
          {/* Character Image */}
          {data.characterImage && (
            <img
              src={data.characterImage}
              alt="Character"
              className="absolute right-2 bottom-2 w-16 h-16 rounded-full border-2 border-white shadow-lg"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {data.isStartNode && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-semibold shadow-lg">
                <Star className="w-3 h-3 fill-current" />
                Start
              </span>
            )}
            {data.isEndNode && (
              <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold shadow-lg">
                End
              </span>
            )}
          </div>

          {/* Edit Icon */}
          <button
            onClick={() => selectNode(id)}
            className="absolute top-2 right-2 glass-dark p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <Edit className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg text-purple-900 mb-2 truncate">
            {data.title}
          </h3>

          {/* Text Preview */}
          <p className="text-sm text-purple-600/70 line-clamp-3 mb-3">
            {data.text}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-purple-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {data.animationStyle}
            </span>
            <span>
              {data.choices.length} choice{data.choices.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Choice Preview */}
        {data.choices.length > 0 && (
          <div className="px-4 pb-4 space-y-1">
            {data.choices.slice(0, 2).map((choice) => (
              <div
                key={choice.id}
                className="text-xs px-3 py-1.5 rounded-lg bg-purple-100/50 text-purple-700 truncate"
              >
                → {choice.text}
              </div>
            ))}
            {data.choices.length > 2 && (
              <div className="text-xs px-3 py-1.5 text-center text-purple-500">
                +{data.choices.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>

      {/* Source Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          'w-3 h-3 !bg-gradient-to-br from-pink-400 to-purple-400',
          '!border-2 !border-white shadow-glow',
          'transition-all duration-300',
          'hover:scale-150'
        )}
      />

      {/* Glow effect on hover */}
      <div
        className={cn(
          'absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300',
          'bg-gradient-to-br from-purple-400/0 to-pink-400/0',
          selected && 'opacity-100 blur-xl',
          !selected && 'opacity-0 group-hover:opacity-50'
        )}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';