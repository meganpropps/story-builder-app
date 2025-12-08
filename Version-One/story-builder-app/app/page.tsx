'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/Card';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';
import { Badge } from './components/ui/Badge';
import { useStoryStore } from './store/useStoryStore';
import { localStorageApi } from './lib/api';
import type { Story } from './interfaces/story-models';
import { 
  Sparkles, 
  Plus, 
  Play, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { cn } from './lib/utils';
import { formatDate } from './lib/utils';

export default function HomePage() {
  const router = useRouter();
  const { createNewStory, setCurrentStory } = useStoryStore();
  
  const [stories, setStories] = useState<Story[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStoryData, setNewStoryData] = useState({
    title: '',
    author: 'Anonymous',
  });

  // Load stories from localStorage on mount
  useEffect(() => {
    const loadedStories = localStorageApi.getAllStories();
    setStories(loadedStories);
  }, []);

  const handleCreateStory = () => {
    if (!newStoryData.title.trim()) return;

    createNewStory(newStoryData.title, newStoryData.author);
    setIsCreateModalOpen(false);
    setNewStoryData({ title: '', author: 'Anonymous' });
    router.push('/builder');
  };

  const handleEditStory = (story: Story) => {
    setCurrentStory(story);
    router.push('/builder');
  };

  const handlePlayStory = (story: Story) => {
    setCurrentStory(story);
    useStoryStore.setState({ isPlayMode: true });
    router.push('/builder');
  };

  const handleDeleteStory = (storyId: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      localStorageApi.deleteStory(storyId);
      setStories(stories.filter(s => s.id !== storyId));
    }
  };

  const handleExportStory = (story: Story) => {
    const json = JSON.stringify(story, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportStory = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          const imported = JSON.parse(json);
          localStorageApi.saveStory(imported);
          setStories([...stories, imported]);
        } catch (error) {
          alert('Error importing story. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentStories = [...stories].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-500/10" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6 animate-float">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-magic">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 animate-magic-appear">
            Fairytale Story Builder
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-600/80 mb-8 max-w-3xl mx-auto animate-slide-up">
            Create magical, branching interactive stories with our enchanting visual editor
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center animate-slide-up">
            <Button
              variant="magic"
              size="lg"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setIsCreateModalOpen(true)}
              className="sparkle"
            >
              Create New Story
            </Button>
            
            <Button
              variant="glass"
              size="lg"
              icon={<Upload className="w-5 h-5" />}
              onClick={handleImportStory}
            >
              Import Story
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card variant="glass" hoverable animated>
              <CardContent className="text-center py-6">
                <BookOpen className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                <p className="text-3xl font-bold text-gradient">{stories.length}</p>
                <p className="text-sm text-purple-600/70">Stories Created</p>
              </CardContent>
            </Card>
            
            <Card variant="glass" hoverable animated>
              <CardContent className="text-center py-6">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-pink-500" />
                <p className="text-3xl font-bold text-gradient">
                  {stories.reduce((sum, s) => sum + s.nodes.length, 0)}
                </p>
                <p className="text-sm text-purple-600/70">Total Scenes</p>
              </CardContent>
            </Card>
            
            <Card variant="glass" hoverable animated>
              <CardContent className="text-center py-6">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <p className="text-3xl font-bold text-gradient">∞</p>
                <p className="text-sm text-purple-600/70">Possibilities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gradient mb-2">
                Your Stories
              </h2>
              <p className="text-purple-600/70">
                {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-96">
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                variant="glass"
              />
            </div>
          </div>

          {/* Recent Stories Quick Access */}
          {searchQuery === '' && recentStories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recently Updated
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentStories.map((story) => (
                  <Card
                    key={story.id}
                    variant="magic"
                    hoverable
                    className="cursor-pointer"
                    onClick={() => handleEditStory(story)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-purple-900 flex-1">
                          {story.title}
                        </h4>
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-purple-600/70">
                        {formatDate(story.updatedAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Story Grid */}
          {filteredStories.length === 0 ? (
            <Card variant="glass" className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center animate-float">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-3">
                  {searchQuery ? 'No stories found' : 'No stories yet'}
                </h3>
                <p className="text-purple-600/70 mb-6">
                  {searchQuery 
                    ? 'Try a different search term' 
                    : 'Start your magical storytelling journey by creating your first story!'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="magic"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create Your First Story
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <Card
                  key={story.id}
                  variant="glass"
                  hoverable
                  animated
                  className="group"
                >
                  {/* Cover Image */}
                  <div
                    className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden"
                    style={
                      story.coverImage
                        ? {
                            backgroundImage: `url(${story.coverImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }
                        : undefined
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Quick Actions - Show on Hover */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="glassDark"
                        size="iconSm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayStory(story);
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="glassDark"
                        size="iconSm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportStory(story);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Start Node Badge */}
                    {story.startNodeId && (
                      <Badge
                        variant="success"
                        className="absolute top-2 left-2"
                      >
                        <Star className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-1">{story.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {story.description || 'No description'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-purple-600/70 mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {story.nodes.length} scene{story.nodes.length !== 1 ? 's' : ''}
                      </span>
                      <span>{formatDate(story.updatedAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="magic"
                        size="sm"
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() => handleEditStory(story)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      
                      <Button
                        variant="glass"
                        size="sm"
                        icon={<Play className="w-4 h-4" />}
                        onClick={() => handlePlayStory(story)}
                        className="flex-1"
                      >
                        Play
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => handleDeleteStory(story.id)}
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Story Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="✨ Create New Story"
        description="Start your magical storytelling journey"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="magic"
              onClick={handleCreateStory}
              disabled={!newStoryData.title.trim()}
            >
              Create Story
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Story Title"
            placeholder="Enter a magical title..."
            value={newStoryData.title}
            onChange={(e) =>
              setNewStoryData((prev) => ({ ...prev, title: e.target.value }))
            }
            maxLength={50}
            autoFocus
          />

          <Input
            label="Author Name"
            placeholder="Your name"
            value={newStoryData.author}
            onChange={(e) =>
              setNewStoryData((prev) => ({ ...prev, author: e.target.value }))
            }
            maxLength={30}
          />

          <Card variant="glass" padding="sm">
            <p className="text-sm text-purple-600/70">
              💡 <strong>Tip:</strong> You can add a description, cover image, and customize settings after creating your story.
            </p>
          </Card>
        </div>
      </Modal>
    </div>
  );
}