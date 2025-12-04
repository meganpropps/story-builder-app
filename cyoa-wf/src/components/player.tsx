"use client";
import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import { Play, RotateCcw, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import type { StoryNode } from "../types";

type Props = {
  nodes: StoryNode[];
};

export default function Player({ nodes }: Props) {
  const { isDark } = useTheme();
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
    <div className={`w-full border-l-3 overflow-y-auto ${
      isDark 
        ? 'bg-slate-800 border-purple-500' 
        : 'bg-gray-50 border-purple-300'
    }`}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            isDark ? 'bg-purple-600' : 'bg-purple-500'
          }`}>
            <Play className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              Story Player
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Test your story
            </p>
          </div>
        </div>

        {nodes.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDark 
                ? 'bg-slate-700 border border-purple-500' 
                : 'bg-purple-50 border border-purple-200'
            } comic-border`}>
              <BookOpen className={`w-8 h-8 ${
                isDark ? 'text-purple-400' : 'text-purple-500'
              }`} />
            </div>
            <p className={`text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Create some scenes to test your story!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Scene Selector */}
            <div className={`rounded-lg border-3 p-4 ${
              isDark 
                ? 'bg-slate-700 border-purple-500' 
                : 'bg-white border-purple-300'
            } comic-border`}>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>
                Current Scene:
              </label>
              <select 
                value={currentNodeId ?? ''} 
                onChange={e => setCurrentNodeId(e.target.value || null)}
                className={`w-full p-2 rounded-lg border-3 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-600 border-purple-500 text-white' 
                    : 'bg-white border-purple-300 text-slate-800'
                } comic-border focus:ring-2 focus:ring-purple-500`}
              >
                <option value="">-- select scene --</option>
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.title}
                  </option>
                ))}
              </select>
              <button 
                onClick={reset}
                className={`w-full mt-3 px-3 py-2 rounded-lg font-medium transition-all duration-300 comic-border ${
                  isDark 
                    ? 'bg-slate-600 hover:bg-slate-500 border-purple-500 text-white' 
                    : 'bg-white hover:bg-purple-50 border-purple-300 text-slate-800'
                }`}
              >
                <RotateCcw className="w-4 h-4 mr-2 inline" />
                Reset to Start
              </button>
            </div>

            {/* Current Scene Display */}
            {currentNode ? (
              <div className={`rounded-lg border-3 p-4 ${
                isDark 
                  ? 'bg-slate-700 border-purple-500' 
                  : 'bg-white border-purple-300'
              } comic-border comic-shadow`}>
                <h4 className={`text-lg font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  {currentNode.title}
                </h4>
                <p className={`text-sm leading-relaxed mb-4 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {currentNode.text}
                </p>

                {/* Choices */}
                {currentNode.choices.length > 0 ? (
                  <div className="space-y-2">
                    <h5 className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}>
                      What do you choose?
                    </h5>
                    {currentNode.choices.map((choice, index) => (
                      <button
                        key={choice.id}
                        className={`w-full p-3 rounded-lg border-3 text-left transition-all duration-200 ${
                          choice.targetId
                            ? (isDark 
                                ? 'bg-purple-600 hover:bg-purple-500 border-purple-400 text-white' 
                                : 'bg-purple-500 hover:bg-purple-600 border-purple-700 text-white')
                            : (isDark 
                                ? 'bg-slate-600 border-slate-500 text-slate-400 cursor-not-allowed' 
                                : 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed')
                        } comic-border`}
                        onClick={() => handleChoice(choice.targetId)}
                        disabled={!choice.targetId}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            choice.targetId
                              ? (isDark ? 'bg-purple-500' : 'bg-purple-400')
                              : (isDark ? 'bg-slate-500' : 'bg-gray-300')
                          }`}>
                            <span className="text-white font-bold text-xs">
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                          <span className="flex-1">{choice.text}</span>
                          {choice.targetId && (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-6 rounded-lg border-3 ${
                    isDark 
                      ? 'bg-yellow-900/20 border-yellow-500' 
                      : 'bg-yellow-50 border-yellow-300'
                  }`}>
                    <Sparkles className={`w-8 h-8 mx-auto mb-2 ${
                      isDark ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                    <p className={`text-sm font-medium ${
                      isDark ? 'text-yellow-300' : 'text-yellow-700'
                    }`}>
                      The End!
                    </p>
                    <p className={`text-xs ${
                      isDark ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      This scene has no choices. Add some to continue the adventure!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className={`text-center py-8 rounded-lg border-3 ${
                isDark 
                  ? 'bg-slate-700 border-purple-500' 
                  : 'bg-white border-purple-300'
              } comic-border`}>
                <p className={`text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Select a scene to start playing
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}