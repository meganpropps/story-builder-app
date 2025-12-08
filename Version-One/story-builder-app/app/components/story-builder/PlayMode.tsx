'use client';

import React, { useEffect, useState } from 'react';
import { useStoryStore } from '../../store/useStoryStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X, ArrowLeft, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import gsap from 'gsap';

export const PlayMode: React.FC = () => {
  const { 
    isPlayMode, 
    togglePlayMode,
    playState,
    makeChoice,
    resetPlay,
    nodes,
  } = useStoryStore();

  const [isAnimating, setIsAnimating] = useState(false);
  const currentNode = nodes.find(n => n.id === playState?.currentNodeId);

  useEffect(() => {
    if (isPlayMode && currentNode) {
      setIsAnimating(true);
      
      const timeline = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      });

      timeline
        .from('.play-content', {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
        })
        .from('.play-choice', {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        }, '-=0.3');
    }
  }, [isPlayMode, currentNode]);

  if (!isPlayMode || !currentNode) return null;

  const handleChoiceClick = (choiceId: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    gsap.to('.play-content', {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => {
        makeChoice(choiceId);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Background Image */}
      {currentNode.data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${currentNode.data.backgroundImage})` }}
        />
      )}

      {/* Top Controls */}
      <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10">
        <Button
          variant="glassDark"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => {
            if (playState && playState.history.length > 0) {
              // Go back functionality
            }
          }}
          disabled={!playState || playState.history.length === 0}
        >
          Back
        </Button>

        <div className="glass-dark px-4 py-2 rounded-full">
          <p className="text-white text-sm font-semibold">
            Scene {playState?.visitedNodes.size || 1}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="glassDark"
            size="iconSm"
            onClick={resetPlay}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<X className="w-4 h-4" />}
            onClick={togglePlayMode}
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl play-content">
          <Card
            variant="glassDark"
            padding="xl"
            className="animate-magic-appear"
          >
            {/* Character Image */}
            {currentNode.data.characterImage && (
              <div className="flex justify-center mb-6">
                <img
                  src={currentNode.data.characterImage}
                  alt="Character"
                  className="w-32 h-32 rounded-full border-4 border-white/30 shadow-magic animate-float"
                />
              </div>
            )}

            {/* Scene Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6 animate-sparkle">
              {currentNode.data.title}
            </h1>

            {/* Scene Text */}
            <div className="prose prose-lg prose-invert max-w-none mb-8">
              <p className="text-white/90 text-lg leading-relaxed text-center">
                {currentNode.data.text}
              </p>
            </div>

            {/* Choices */}
            {currentNode.data.choices.length > 0 ? (
              <div className="space-y-3">
                <p className="text-white/70 text-center text-sm mb-4">
                  What will you do?
                </p>
                {currentNode.data.choices.map((choice, index) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice.id)}
                    disabled={isAnimating}
                    className={cn(
                      'play-choice w-full glass-dark p-4 rounded-2xl',
                      'text-white font-semibold text-lg',
                      'hover:bg-white/20 hover:scale-105',
                      'transition-all duration-300',
                      'border-2 border-white/30 hover:border-purple-400',
                      'shadow-glow hover:shadow-magic',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <span className="mr-2">✨</span>
                    {choice.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-lg shadow-magic">
                  🎉 The End 🎉
                </div>
                <p className="mt-4 text-white/70">
                  Thank you for experiencing this story!
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="glass-dark px-4 py-2 rounded-full">
          <p className="text-white text-xs">
            Visited: {playState?.visitedNodes.size || 0} / {nodes.length} scenes
          </p>
        </div>
      </div>
    </div>
  );
};