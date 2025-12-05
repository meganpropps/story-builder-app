"use client";
import React from "react";
import { useTheme } from "./ThemeContext";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import type { StoryNode } from "../types";

type Props = {
  nodes: StoryNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
};

export default function Sidebar({ nodes, selectedId, onSelect, onAdd, onDelete }: Props) {
  const { isDark } = useTheme();

  return (
    <div className={`w-full border-r-3 overflow-y-auto ${
      isDark 
        ? 'bg-slate-800 border-purple-500' 
        : 'bg-gray-50 border-purple-300'
    }`}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            isDark ? 'bg-purple-600' : 'bg-purple-500'
          }`}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              Story Scenes
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {nodes.length} scenes
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {nodes.length === 0 ? (
            <div className="text-center py-8">
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
                No scenes yet. Create your first scene to get started!
              </p>
            </div>
          ) : (
            nodes.map((node, index) => {
              const isSelected = selectedId === node.id;
              
              return (
                <div 
                  key={node.id}
                  className={`p-4 rounded-lg border-3 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? (isDark 
                          ? 'bg-purple-900 border-purple-400 shadow-lg' 
                          : 'bg-purple-50 border-purple-500 shadow-lg')
                      : (isDark 
                          ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' 
                          : 'bg-white border-purple-200 hover:bg-purple-25')
                  } comic-border`}
                  onClick={() => onSelect(node.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}>
                        {node.title}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Scene {index + 1}
                      </p>
                      <p className={`text-xs mt-2 line-clamp-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {node.text.slice(0, 60)}...
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(node.id);
                      }}
                      className={`p-1 rounded hover:bg-red-500 hover:text-white transition-colors ${
                        isDark ? 'text-slate-400 hover:bg-red-500' : 'text-slate-500 hover:bg-red-500'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onAdd}
          className={`w-full mt-4 p-3 rounded-lg border-3 font-medium transition-all duration-300 ${
            isDark
              ? 'bg-purple-600 hover:bg-purple-500 border-purple-400 text-white'
              : 'bg-purple-500 hover:bg-purple-600 border-purple-700 text-white'
          } comic-border comic-shadow`}
        >
          <Plus className="w-5 h-5 mr-2 inline" />
          Add Scene
        </button>
      </div>
    </div>
  );
}