'use client';

import React from 'react';
import { StoryCanvas } from '../components/story-builder/StoryCanvas';
import { PlayMode } from '../components/story-builder/PlayMode';
import { useStoryStore } from '../store/useStoryStore';

export default function BuilderPage() {
  const { isPlayMode } = useStoryStore();

  return (
    <>
      {isPlayMode ? <PlayMode /> : <StoryCanvas />}
    </>
  );
}

