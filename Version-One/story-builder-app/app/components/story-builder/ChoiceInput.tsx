'use client';

import React, { useState, useEffect } from 'react';
import { useStoryStore } from '../../store/useStoryStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/TextArea';
import type { EdgeAnimation } from '../../interfaces/story-models';
import { Sparkles, Zap, TrendingUp, Rainbow } from 'lucide-react';

export const ChoiceInput: React.FC = () => {
  const { 
    isChoiceModalOpen, 
    closeChoiceModal, 
    pendingConnection,
    addChoice,
    nodes 
  } = useStoryStore();

  const [formData, setFormData] = useState({
    text: '',
    targetNodeId: '',
    animation: 'glowing' as EdgeAnimation,
    hoverText: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill target node when modal opens with pending connection
  useEffect(() => {
    if (isChoiceModalOpen && pendingConnection?.targetNodeId) {
      setFormData(prev => ({
        ...prev,
        targetNodeId: pendingConnection.targetNodeId || '',
      }));
    } else if (!isChoiceModalOpen) {
      // Reset form when modal closes
      setFormData({
        text: '',
        targetNodeId: '',
        animation: 'glowing',
        hoverText: '',
      });
      setErrors({});
    }
  }, [isChoiceModalOpen, pendingConnection]);

  const handleSubmit = () => {
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.text.trim()) {
      newErrors.text = 'Choice text is required';
    }
    
    if (!formData.targetNodeId) {
      newErrors.targetNodeId = 'Please select a target node';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add the choice
    if (pendingConnection?.sourceNodeId) {
      addChoice(pendingConnection.sourceNodeId, {
        text: formData.text,
        targetNodeId: formData.targetNodeId,
        animation: formData.animation,
        hoverText: formData.hoverText || undefined,
      });

      // Reset and close
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      text: '',
      targetNodeId: '',
      animation: 'glowing',
      hoverText: '',
    });
    setErrors({});
    closeChoiceModal();
  };

  const animationOptions = [
    { 
      value: 'glowing', 
      label: '✨ Glowing',
      icon: <Sparkles className="w-4 h-4" />
    },
    { 
      value: 'sparkle', 
      label: '⭐ Sparkle',
      icon: <Sparkles className="w-4 h-4" />
    },
    { 
      value: 'bounce', 
      label: '🎈 Bounce',
      icon: <TrendingUp className="w-4 h-4" />
    },
    { 
      value: 'rainbow', 
      label: '🌈 Rainbow',
      icon: <Rainbow className="w-4 h-4" />
    },
    { 
      value: 'pulse', 
      label: '💫 Pulse',
      icon: <Zap className="w-4 h-4" />
    },
    { 
      value: 'none', 
      label: '⚪ None',
      icon: <span className="w-4 h-4" />
    },
  ];

  const targetNodeOptions = nodes
    .filter(node => node.id !== pendingConnection?.sourceNodeId)
    .map(node => ({
      value: node.id,
      label: node.data.title,
    }));

  return (
    <Modal
      isOpen={isChoiceModalOpen}
      onClose={handleClose}
      title="✨ Add New Choice"
      description="Create a magical path for your story to follow"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="magic" onClick={handleSubmit}>
            Create Choice
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Choice Text */}
        <Input
          label="Choice Text"
          placeholder="What should the player see?"
          value={formData.text}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, text: e.target.value }));
            if (errors.text) setErrors(prev => ({ ...prev, text: '' }));
          }}
          error={errors.text}
          maxLength={100}
        />

        {/* Target Node */}
        <Select
          label="Target Scene"
          placeholder="Where does this choice lead?"
          options={targetNodeOptions}
          value={formData.targetNodeId}
          onChange={(value) => {
            setFormData(prev => ({ ...prev, targetNodeId: value }));
            if (errors.targetNodeId) setErrors(prev => ({ ...prev, targetNodeId: '' }));
          }}
          error={errors.targetNodeId}
        />

        {/* Animation */}
        <Select
          label="Animation Effect"
          options={animationOptions}
          value={formData.animation}
          onChange={(value) => setFormData(prev => ({ ...prev, animation: value as EdgeAnimation }))}
        />

        {/* Hover Text (Optional) */}
        <Textarea
          label="Hover Text (Optional)"
          placeholder="Additional hint that appears on hover..."
          value={formData.hoverText}
          onChange={(e) => setFormData(prev => ({ ...prev, hoverText: e.target.value }))}
          rows={2}
          maxLength={150}
        />

        {/* Preview */}
        <div className="mt-4 p-4 glass rounded-xl">
          <p className="text-xs font-semibold text-purple-600 mb-2">Preview:</p>
          <div className="btn-magic text-center py-2 cursor-pointer">
            {formData.text || 'Your choice text here...'}
          </div>
        </div>
      </div>
    </Modal>
  );
};