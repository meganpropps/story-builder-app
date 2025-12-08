import { createClient } from '@supabase/supabase-js';
import type { Story, StoryMetadata } from '../interfaces/story-models';

// Initialize Supabase client
const supabaseUrl = 'https://kwqjauemtkdtxlqhsbsk.supabase.co';
// Use publishable key for client-side access (public, safe to expose)
// Use secret key only for server-side operations (never expose to client)
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Database Schema (for reference):
 * 
 * Table: stories
 * - id: uuid (primary key)
 * - title: text
 * - description: text
 * - coverImage: text (nullable)
 * - author: uuid (foreign key to auth.users)
 * - createdAt: timestamp
 * - updatedAt: timestamp
 * - publishedAt: timestamp (nullable)
 * - nodes: jsonb
 * - edges: jsonb
 * - startNodeId: text (nullable)
 * - variables: jsonb (nullable)
 * - settings: jsonb (nullable)
 * - plays: integer (default 0)
 * - likes: integer (default 0)
 * 
 * Table: user_profiles
 * - id: uuid (primary key, foreign key to auth.users)
 * - username: text (unique)
 * - displayName: text
 * - avatar: text (nullable)
 * - bio: text (nullable)
 * - createdAt: timestamp
 * 
 * Table: story_plays
 * - id: uuid (primary key)
 * - storyId: uuid (foreign key to stories)
 * - userId: uuid (foreign key to auth.users, nullable)
 * - completedAt: timestamp
 * - choicesMade: jsonb
 */

/**
 * API Error Handler
 */
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleSupabaseError = (error: any): never => {
  console.error('Supabase Error:', error);
  throw new ApiError(
    error.message || 'An unexpected error occurred',
    error.code,
    error.details
  );
};

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) handleSupabaseError(error);

    // Create user profile
    if (data.user) {
      await supabase.from('user_profiles').insert([
        {
          id: data.user.id,
          username,
          displayName: username,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    return data;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) handleSupabaseError(error);
    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) handleSupabaseError(error);
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) handleSupabaseError(error);
    return user;
  },

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) handleSupabaseError(error);
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) handleSupabaseError(error);
  },
};

/**
 * Story CRUD API
 */
export const storyApi = {
  /**
   * Get all published stories
   */
  async getAllStories(limit = 50, offset = 0): Promise<StoryMetadata[]> {
    const { data, error } = await supabase
      .from('stories')
      .select('id, title, description, coverImage, author, createdAt, updatedAt, publishedAt, plays, likes')
      .not('publishedAt', 'is', null)
      .order('updatedAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) handleSupabaseError(error);
    
    return (data || []).map(story => ({
      ...story,
      nodeCount: 0, // Will be calculated if needed
    }));
  },

  /**
   * Get story by ID
   */
  async getStoryById(id: string): Promise<Story | null> {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      handleSupabaseError(error);
    }

    return data;
  },

  /**
   * Create new story
   */
  async createStory(story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Promise<Story> {
    const user = await authApi.getCurrentUser();
    if (!user) throw new ApiError('User must be authenticated', 401);

    const newStory: any = {
      ...story,
      author: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('stories')
      .insert([newStory])
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  /**
   * Update story
   */
  async updateStory(id: string, updates: Partial<Story>): Promise<Story> {
    const user = await authApi.getCurrentUser();
    if (!user) throw new ApiError('User must be authenticated', 401);

    // Verify ownership
    const existing = await this.getStoryById(id);
    if (!existing) throw new ApiError('Story not found', 404);
    if (existing.author !== user.id) throw new ApiError('Unauthorized', 403);

    const { data, error } = await supabase
      .from('stories')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  /**
   * Delete story
   */
  async deleteStory(id: string): Promise<void> {
    const user = await authApi.getCurrentUser();
    if (!user) throw new ApiError('User must be authenticated', 401);

    // Verify ownership
    const existing = await this.getStoryById(id);
    if (!existing) throw new ApiError('Story not found', 404);
    if (existing.author !== user.id) throw new ApiError('Unauthorized', 403);

    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) handleSupabaseError(error);
  },

  /**
   * Publish story
   */
  async publishStory(id: string): Promise<Story> {
    return this.updateStory(id, {
      publishedAt: new Date().toISOString(),
    });
  },

  /**
   * Unpublish story
   */
  async unpublishStory(id: string): Promise<Story> {
    return this.updateStory(id, {
      publishedAt: undefined,
    });
  },

  /**
   * Duplicate story
   */
  async duplicateStory(id: string): Promise<Story> {
    const original = await this.getStoryById(id);
    if (!original) throw new ApiError('Story not found', 404);

    const duplicate: Omit<Story, 'id' | 'createdAt' | 'updatedAt'> = {
      ...original,
      title: `${original.title} (Copy)`,
      publishedAt: undefined,
    };

    return this.createStory(duplicate);
  },

  /**
   * Get user's stories
   */
  async getUserStories(userId?: string): Promise<StoryMetadata[]> {
    const user = userId || (await authApi.getCurrentUser())?.id;
    if (!user) throw new ApiError('User must be authenticated', 401);

    const { data, error } = await supabase
      .from('stories')
      .select('id, title, description, coverImage, author, createdAt, updatedAt, publishedAt, plays, likes')
      .eq('author', user)
      .order('updatedAt', { ascending: false });

    if (error) handleSupabaseError(error);

    return (data || []).map(story => ({
      ...story,
      nodeCount: 0,
    }));
  },

  /**
   * Search stories
   */
  async searchStories(query: string, limit = 20): Promise<StoryMetadata[]> {
    const { data, error } = await supabase
      .from('stories')
      .select('id, title, description, coverImage, author, createdAt, updatedAt, publishedAt, plays, likes')
      .not('publishedAt', 'is', null)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('plays', { ascending: false })
      .limit(limit);

    if (error) handleSupabaseError(error);

    return (data || []).map(story => ({
      ...story,
      nodeCount: 0,
    }));
  },

  /**
   * Get featured/popular stories
   */
  async getFeaturedStories(limit = 10): Promise<StoryMetadata[]> {
    const { data, error } = await supabase
      .from('stories')
      .select('id, title, description, coverImage, author, createdAt, updatedAt, publishedAt, plays, likes')
      .not('publishedAt', 'is', null)
      .order('plays', { ascending: false })
      .limit(limit);

    if (error) handleSupabaseError(error);

    return (data || []).map(story => ({
      ...story,
      nodeCount: 0,
    }));
  },

  /**
   * Increment play count
   */
  async incrementPlayCount(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_play_count', {
      story_id: id,
    });

    if (error) {
      // Fallback if RPC doesn't exist
      const story = await this.getStoryById(id);
      if (story) {
        await supabase
          .from('stories')
          .update({ plays: (story.plays || 0) + 1 })
          .eq('id', id);
      }
    }
  },

  /**
   * Like story
   */
  async likeStory(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_like_count', {
      story_id: id,
    });

    if (error) {
      // Fallback if RPC doesn't exist
      const story = await this.getStoryById(id);
      if (story) {
        await supabase
          .from('stories')
          .update({ likes: (story.likes || 0) + 1 })
          .eq('id', id);
      }
    }
  },
};

/**
 * User Profile API
 */
export const userApi = {
  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      handleSupabaseError(error);
    }

    return data;
  },

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  },

  /**
   * Get user stats
   */
  async getUserStats(userId: string) {
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select('plays, likes, publishedAt')
      .eq('author', userId);

    if (storiesError) handleSupabaseError(storiesError);

    const totalPlays = stories?.reduce((sum, s) => sum + (s.plays || 0), 0) || 0;
    const totalLikes = stories?.reduce((sum, s) => sum + (s.likes || 0), 0) || 0;

    return {
      totalStories: stories?.length || 0,
      totalPlays,
      totalLikes,
      publishedStories: stories?.filter(s => s.publishedAt).length || 0,
    };
  },
};

/**
 * Storage API (for images/media)
 */
export const storageApi = {
  /**
   * Upload file to storage
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { cacheControl?: string; upsert?: boolean }
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false,
      });

    if (error) handleSupabaseError(error);
    if (!data) throw new ApiError('Upload failed: no data returned');

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  /**
   * Delete file from storage
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) handleSupabaseError(error);
  },

  /**
   * Upload image and get URL
   */
  async uploadImage(file: File, folder = 'story-images'): Promise<string> {
    const user = await authApi.getCurrentUser();
    if (!user) throw new ApiError('User must be authenticated', 401);

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

    return this.uploadFile('public', fileName, file);
  },

  /**
   * Upload cover image
   */
  async uploadCoverImage(file: File): Promise<string> {
    return this.uploadImage(file, 'covers');
  },

  /**
   * Upload character image
   */
  async uploadCharacterImage(file: File): Promise<string> {
    return this.uploadImage(file, 'characters');
  },

  /**
   * Upload background image
   */
  async uploadBackgroundImage(file: File): Promise<string> {
    return this.uploadImage(file, 'backgrounds');
  },
};

/**
 * Analytics API
 */
export const analyticsApi = {
  /**
   * Track story play
   */
  async trackStoryPlay(storyId: string, choicesMade: any[]) {
    const user = await authApi.getCurrentUser();

    const { error } = await supabase
      .from('story_plays')
      .insert([
        {
          storyId,
          userId: user?.id || null,
          completedAt: new Date().toISOString(),
          choicesMade: JSON.stringify(choicesMade),
        },
      ]);

    if (error) console.error('Error tracking play:', error);
  },

  /**
   * Get story analytics
   */
  async getStoryAnalytics(storyId: string) {
    const { data: plays, error: playsError } = await supabase
      .from('story_plays')
      .select('*')
      .eq('storyId', storyId);

    if (playsError) handleSupabaseError(playsError);

    const totalPlays = plays?.length || 0;
    const uniquePlayers = new Set(plays?.map(p => p.userId).filter(Boolean)).size;

    return {
      totalPlays,
      uniquePlayers,
      completionRate: 100, // Calculate based on your logic
    };
  },
};

/**
 * Local Storage Helpers (for offline support)
 */
export const localStorageApi = {
  STORAGE_KEY: 'fairytale_stories',

  /**
   * Save story to localStorage
   */
  saveStory(story: Story): void {
    try {
      const stories = this.getAllStories();
      const index = stories.findIndex(s => s.id === story.id);
      
      if (index >= 0) {
        stories[index] = story;
      } else {
        stories.push(story);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Get all stories from localStorage
   */
  getAllStories(): Story[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  /**
   * Get story by ID from localStorage
   */
  getStoryById(id: string): Story | null {
    const stories = this.getAllStories();
    return stories.find(s => s.id === id) || null;
  },

  /**
   * Delete story from localStorage
   */
  deleteStory(id: string): void {
    try {
      const stories = this.getAllStories();
      const filtered = stories.filter(s => s.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
    }
  },

  /**
   * Clear all stories from localStorage
   */
  clearAll(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Export all stories as JSON
   */
  exportAllStories(): string {
    const stories = this.getAllStories();
    return JSON.stringify(stories, null, 2);
  },

  /**
   * Import stories from JSON
   */
  importStories(json: string): void {
    try {
      const imported = JSON.parse(json);
      if (Array.isArray(imported)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(imported));
      } else if (imported.id) {
        // Single story
        this.saveStory(imported);
      }
    } catch (error) {
      console.error('Error importing stories:', error);
      throw new Error('Invalid JSON format');
    }
  },
};

/**
 * Export default API object
 */
export default {
  auth: authApi,
  story: storyApi,
  user: userApi,
  storage: storageApi,
  analytics: analyticsApi,
  localStorage: localStorageApi,
};