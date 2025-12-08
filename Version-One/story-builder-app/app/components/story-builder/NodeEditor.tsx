'use client';

import React, { useEffect, useState } from 'react';
import { useStoryStore } from '../../store/useStoryStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import type { AnimationStyle } from '../../interfaces/story-models';
import { 
  X, 
  Image as ImageIcon, 
  Music, 
  Wand2,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';

export const NodeEditor: React.FC = () => {
  const { 
    selectedNodeId, 
    nodes, 
    updateNode, 
    selectNode,
    deleteChoice,
    openChoiceModal
  } = useStoryStore();

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    backgroundImage: '',
    characterImage: '',
    music: '',
    animationStyle: 'fadeIn' as AnimationStyle,
    emotionalTone: 'mysterious' as any,
  });

  useEffect(() => {
    if (selectedNode) {
      setFormData({
        title: selectedNode.data.title,
        text: selectedNode.data.text,
        backgroundImage: selectedNode.data.backgroundImage || '',
        characterImage: selectedNode.data.characterImage || '',
        music: selectedNode.data.music || '',
        animationStyle: selectedNode.data.animationStyle,
        emotionalTone: selectedNode.data.emotionalTone || 'mysterious',
      });
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="fixed right-6 top-24 w-96 glass rounded-3xl p-6 shadow-magic animate-slide-up">
        <div className="text-center text-purple-400/70">
          <Edit2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a node to edit</p>
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    updateNode(selectedNodeId!, { [field]: value });
  };

  const animationOptions = [
    { value: 'fadeIn', label: '✨ Fade In', icon: <Wand2 className="w-4 h-4" /> },
    { value: 'sparkle', label: '⭐ Sparkle', icon: <Wand2 className="w-4 h-4" /> },
    { value: 'float', label: '🎈 Float', icon: <Wand2 className="w-4 h-4" /> },
    { value: 'slideUp', label: '⬆️ Slide Up', icon: <Wand2 className="w-4 h-4" /> },
    { value: 'magicAppear', label: '🪄 Magic Appear', icon: <Wand2 className="w-4 h-4" /> },
    { value: 'none', label: '⚪ None', icon: <Wand2 className="w-4 h-4" /> },
  ];

  const emotionalToneOptions = [
    { value: 'happy', label: '😊 Happy' },
    { value: 'sad', label: '😢 Sad' },
    { value: 'mysterious', label: '🔮 Mysterious' },
    { value: 'scary', label: '👻 Scary' },
    { value: 'peaceful', label: '🕊️ Peaceful' },
    { value: 'exciting', label: '⚡ Exciting' },
  ];

  return (
    <div className="fixed right-6 top-24 w-96 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col glass rounded-3xl shadow-magic animate-slide-up z-30">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/30">
        <h3 className="font-bold text-lg text-gradient">Edit Scene</h3>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => selectNode(null)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {/* Title */}
        <Input
          label="Scene Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter scene title..."
          maxLength={50}
        />

        {/* Text Content */}
        <Textarea
          label="Scene Text"
          value={formData.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Once upon a time..."
          maxLength={500}
          showCount
          rows={6}
        />

        {/* Animation Style */}
        <Select
          label="Animation Style"
          options={animationOptions}
          value={formData.animationStyle}
          onChange={(value) => handleChange('animationStyle', value)}
        />

        {/* Emotional Tone */}
        <Select
          label="Emotional Tone"
          options={emotionalToneOptions}
          value={formData.emotionalTone}
          onChange={(value) => handleChange('emotionalTone', value)}
        />

        {/* Media Section */}
        <Card variant="glass" padding="sm">
          <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Media Assets
          </h4>
          
          <div className="space-y-3">
            <Input
              label="Background Image URL"
              value={formData.backgroundImage}
              onChange={(e) => handleChange('backgroundImage', e.target.value)}
              placeholder="https://..."
              inputSize="sm"
            />

            <Input
              label="Character Image URL"
              value={formData.characterImage}
              onChange={(e) => handleChange('characterImage', e.target.value)}
              placeholder="https://..."
              inputSize="sm"
            />

            <Input
              label="Background Music URL"
              value={formData.music}
              onChange={(e) => handleChange('music', e.target.value)}
              placeholder="https://..."
              inputSize="sm"
              icon={<Music className="w-4 h-4" />}
            />
          </div>
        </Card>

        {/* Choices Section */}
        <Card variant="glass" padding="sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-purple-900 flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Choices ({selectedNode.data.choices.length})
            </h4>
            <Button
              variant="magic"
              size="sm"
              icon={<Plus className="w-3 h-3" />}
              onClick={() => selectedNodeId && openChoiceModal(selectedNodeId)}
            >
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {selectedNode.data.choices.length === 0 ? (
              <p className="text-xs text-purple-400/70 text-center py-4">
                No choices yet. Add one to create a branch!
              </p>
            ) : (
              selectedNode.data.choices.map((choice) => {
                const targetNode = nodes.find(n => n.id === choice.targetNodeId);
                return (
                  <div
                    key={choice.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-purple-50/50 hover:bg-purple-100/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-purple-900 truncate">
                        {choice.text}
                      </p>
                      <p className="text-xs text-purple-600/70">
                        → {targetNode?.data.title || 'Unknown Node'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={() => selectedNodeId && deleteChoice(selectedNodeId, choice.id)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};