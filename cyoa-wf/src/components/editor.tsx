"use client";
import React from "react";
import { useTheme } from "./ThemeContext";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import type { StoryNode } from "../types";

type Props = {
  node: StoryNode | null;
  allNodes: StoryNode[];
  onUpdateNode: (n: StoryNode) => void;
  onAddChoice: (nodeId: string) => void;
  onUpdateChoice: (nodeId: string, choiceId: string, patch: Partial<{ text: string; targetId: string | null }>) => void;
  onDeleteChoice: (nodeId: string, choiceId: string) => void;
  onDeleteNode: (nodeId: string) => void;
};

export default function Editor({
  node,
  allNodes,
  onUpdateNode,
  onAddChoice,
  onUpdateChoice,
  onDeleteChoice,
  onDeleteNode
}: Props) {
  const { isDark } = useTheme();

  if (!node) {
    return (
      <div className={`flex-1 overflow-y-auto ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="p-6">
          <div className="text-center py-20">
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isDark
                ? 'bg-slate-800 border border-purple-500'
                : 'bg-purple-50 border border-purple-200'
            } comic-border`}>
              <Plus className={`w-16 h-16 ${
                isDark ? 'text-purple-400' : 'text-purple-500'
              }`} />
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              Select a Scene to Edit
            </h2>
            <p className={`text-lg mb-8 max-w-md mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Choose a scene from the sidebar to start editing, or create a new one to begin your story!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Scene Editor */}
          <div className={`rounded-xl border-3 p-6 ${
            isDark
              ? 'bg-slate-800 border-purple-500'
              : 'bg-white border-purple-300'
          } comic-border comic-shadow`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>
                Scene Editor
              </h2>
              <button
                onClick={() => onDeleteNode(node.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 comic-border ${
                  isDark
                    ? 'bg-red-600 hover:bg-red-500 border-red-400 text-white'
                    : 'bg-red-500 hover:bg-red-600 border-red-700 text-white'
                }`}
              >
                <Trash2 className="w-4 h-4 mr-2 inline" />
                Delete Scene
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  Scene Title
                </label>
                <input
                  type="text"
                  value={node.title}
                  onChange={e => onUpdateNode({ ...node, title: e.target.value })}
                  placeholder="Enter scene title..."
                  className={`w-full p-3 rounded-lg border-3 transition-all duration-300 ${
                    isDark
                      ? 'bg-slate-700 border-purple-500 text-white placeholder-slate-400'
                      : 'bg-white border-purple-300 text-slate-800 placeholder-slate-500'
                  } comic-border focus:ring-2 focus:ring-purple-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  Scene Description
                </label>
                <textarea
                  value={node.text}
                  onChange={e => onUpdateNode({ ...node, text: e.target.value })}
                  placeholder="Write the scene description here..."
                  rows={6}
                  className={`w-full p-3 rounded-lg border-3 transition-all duration-300 resize-none ${
                    isDark
                      ? 'bg-slate-700 border-purple-500 text-white placeholder-slate-400'
                      : 'bg-white border-purple-300 text-slate-800 placeholder-slate-500'
                  } comic-border focus:ring-2 focus:ring-purple-500`}
                />
              </div>
            </div>
          </div>

          {/* Choices Section */}
          <div className={`rounded-xl border-3 p-6 ${
            isDark
              ? 'bg-slate-800 border-purple-500'
              : 'bg-white border-purple-300'
          } comic-border comic-shadow`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>
                Scene Choices
              </h3>
              <button
                onClick={() => onAddChoice(node.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 comic-border comic-shadow ${
                  isDark
                    ? 'bg-purple-600 hover:bg-purple-500 border-purple-400 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 border-purple-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Choice
              </button>
            </div>

            <div className="space-y-4">
              {node.choices.map((choice, index) => (
                <div
                  key={choice.id}
                  className={`p-4 rounded-lg border-3 ${
                    isDark
                      ? 'bg-slate-700 border-slate-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                      isDark ? 'bg-purple-600' : 'bg-purple-500'
                    }`}>
                      <span className="text-white font-bold text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        value={choice.text}
                        onChange={e => onUpdateChoice(node.id, choice.id, { text: e.target.value })}
                        placeholder="What choice will the reader make?"
                        className={`w-full p-3 rounded-lg border-3 transition-all duration-300 ${
                          isDark
                            ? 'bg-slate-600 border-purple-500 text-white placeholder-slate-400'
                            : 'bg-white border-purple-300 text-slate-800 placeholder-slate-500'
                        } comic-border focus:ring-2 focus:ring-purple-500`}
                      />
                      <div className="flex items-center gap-3">
                        <ArrowRight className={`w-4 h-4 ${
                          isDark ? 'text-purple-400' : 'text-purple-500'
                        }`} />
                        <select
                          value={choice.targetId ?? ''}
                          onChange={e => onUpdateChoice(node.id, choice.id, { targetId: e.target.value || null })}
                          className={`flex-1 p-2 rounded-lg border-3 transition-all duration-300 ${
                            isDark
                              ? 'bg-slate-600 border-purple-500 text-white'
                              : 'bg-white border-purple-300 text-slate-800'
                          } comic-border focus:ring-2 focus:ring-purple-500`}
                        >
                          <option value="">-- Choose target scene (or leave blank) --</option>
                          {allNodes.filter(n => n.id !== node.id).map(n => (
                            <option key={n.id} value={n.id}>
                              {n.title}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => onDeleteChoice(node.id, choice.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark
                              ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/20'
                              : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {node.choices.length === 0 && (
                <div className="text-center py-8">
                  <p className={`text-sm ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    No choices yet. Add some choices to make this scene interactive!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}