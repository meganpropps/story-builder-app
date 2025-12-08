'use client';

import React, { useState } from 'react';
import { useStoryStore } from '../../store/useStoryStore';
import { Button } from '../ui/Button';
import { 
  Sparkles, 
  Save, 
  Play, 
  Download, 
  Upload, 
  Settings,
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRouter } from 'next/navigation';

export const Header: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { 
    currentStory, 
    togglePlayMode, 
    isPlayMode,
    saveToLocalStorage,
    exportStory,
  } = useStoryStore();

  const handleSave = () => {
    saveToLocalStorage();
    // Show success toast (you can add a toast component)
    console.log('Story saved! ✨');
  };

  const handleExport = () => {
    if (!currentStory) return;
    const json = exportStory();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentStory.title.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        useStoryStore.getState().importStory(json);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/30 shadow-glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:block">
                Fairytale Builder
              </span>
            </button>

            {currentStory && (
              <div className="hidden md:flex items-center gap-2 ml-4">
                <span className="text-sm text-purple-600/70">|</span>
                <span className="text-sm font-semibold text-purple-900">
                  {currentStory.title}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {!isPlayMode && (
              <>
                <Button
                  variant="glass"
                  size="sm"
                  icon={<Save className="w-4 h-4" />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                
                <Button
                  variant="glass"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={handleExport}
                >
                  Export
                </Button>

                <Button
                  variant="glass"
                  size="sm"
                  icon={<Upload className="w-4 h-4" />}
                  onClick={handleImport}
                >
                  Import
                </Button>
              </>
            )}

            <Button
              variant={isPlayMode ? 'danger' : 'magic'}
              size="sm"
              icon={isPlayMode ? <X className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              onClick={togglePlayMode}
              className="sparkle"
            >
              {isPlayMode ? 'Exit Play' : 'Play Story'}
            </Button>

            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => router.push('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => router.push('/')}
            >
              <Home className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="iconSm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 pt-16 md:hidden animate-slide-down">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative glass border-t border-white/30 p-4 space-y-2">
            {!isPlayMode && (
              <>
                <Button
                  variant="glass"
                  size="md"
                  icon={<Save className="w-4 h-4" />}
                  onClick={() => {
                    handleSave();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  Save Story
                </Button>
                
                <Button
                  variant="glass"
                  size="md"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => {
                    handleExport();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  Export Story
                </Button>

                <Button
                  variant="glass"
                  size="md"
                  icon={<Upload className="w-4 h-4" />}
                  onClick={() => {
                    handleImport();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  Import Story
                </Button>
              </>
            )}

            <Button
              variant={isPlayMode ? 'danger' : 'magic'}
              size="md"
              icon={isPlayMode ? <X className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              onClick={() => {
                togglePlayMode();
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start"
            >
              {isPlayMode ? 'Exit Play Mode' : 'Play Story'}
            </Button>

            <Button
              variant="ghost"
              size="md"
              icon={<Settings className="w-5 h-5" />}
              onClick={() => {
                router.push('/settings');
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start"
            >
              Settings
            </Button>

            <Button
              variant="ghost"
              size="md"
              icon={<Home className="w-5 h-5" />}
              onClick={() => {
                router.push('/');
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start"
            >
              Home
            </Button>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};