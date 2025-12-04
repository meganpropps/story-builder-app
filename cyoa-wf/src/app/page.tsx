"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "../components/ThemeContext";
import { 
  BookOpen, 
  Sparkles, 
  Users, 
  Zap, 
  Heart,
  Star,
  ArrowRight,
  Play,
  PenTool,
  Image as ImageIcon,
  Share2
} from "lucide-react";

export default function HomePage() {
  const { isDark } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in via Supabase
    const checkUser = async () => {
      try {
        const { supabase } = await import("../lib/supabaseClient");
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        setUser(null);
      }
    };
    checkUser();
  }, []);
  const features = [
    {
      icon: PenTool,
      title: "Visual Story Builder",
      description: "Create branching narratives with our intuitive drag-and-drop editor",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: ImageIcon,
      title: "AI-Powered Illustrations",
      description: "Generate beautiful artwork for your scenes or upload your own images",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Play,
      title: "Interactive Player",
      description: "Test your stories in real-time with our comic-style story player",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Share2,
      title: "Share & Discover",
      description: "Publish your stories and explore adventures created by others",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const storyExamples = [
    {
      title: "The Magical Forest Adventure",
      description: "Help Luna the fairy find her lost wand in an enchanted forest filled with talking animals and mystical creatures.",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
      color: "from-green-400 to-emerald-500"
    },
    {
      title: "Space Explorer's Journey",
      description: "Join Captain Cosmos as they navigate through distant galaxies, meet alien friends, and solve cosmic puzzles.",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop",
      color: "from-purple-400 to-indigo-500"
    },
    {
      title: "The Underwater Kingdom",
      description: "Dive deep with Marina the mermaid to save her underwater city from the mysterious dark current.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      color: "from-cyan-400 to-blue-500"
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 opacity-20">
          <div className={`w-full h-full ${
            isDark 
              ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600' 
              : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
          }`} />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-8">
              <Sparkles className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
              <span className={`text-sm font-semibold tracking-widest uppercase ${
                isDark ? 'text-purple-300' : 'text-purple-600'
              }`}>
                Create • Play • Share
              </span>
              <Sparkles className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
            
            <h1 className={`text-7xl md:text-9xl font-black mb-8 leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Weave Your Own
              <span className={`block bg-gradient-to-r ${
                isDark 
                  ? 'from-purple-400 to-pink-400' 
                  : 'from-purple-600 to-pink-600'
              } bg-clip-text text-transparent`}>
                Story Magic
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Create interactive bedtime stories and adventures with branching paths, 
              beautiful illustrations, and endless possibilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {!user ? (
                <>
                  <Link
                    href="/auth"
                    className={`inline-flex items-center px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                      isDark 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <BookOpen className="w-6 h-6 mr-3" />
                    Start Creating
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Link>
                  <button 
                    className={`inline-flex items-center px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 border-2 ${
                      isDark 
                        ? 'bg-transparent hover:bg-slate-800 border-slate-600 text-slate-300 hover:text-white' 
                        : 'bg-transparent hover:bg-purple-50 border-purple-300 text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    <Play className="w-6 h-6 mr-3" />
                    View Examples
                  </button>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                    isDark 
                      ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <BookOpen className="w-6 h-6 mr-3" />
                  Go to My Stories
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Everything You Need to
              <span className={`block bg-gradient-to-r ${
                isDark 
                  ? 'from-cyan-400 to-purple-400' 
                  : 'from-cyan-600 to-purple-600'
              } bg-clip-text text-transparent`}>
                Tell Amazing Stories
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  isDark 
                    ? 'bg-slate-800 border border-slate-700' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-base leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Examples Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Story Examples
              <span className={`block bg-gradient-to-r ${
                isDark 
                  ? 'from-pink-400 to-yellow-400' 
                  : 'from-pink-600 to-orange-600'
              } bg-clip-text text-transparent`}>
                Get Inspired
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {storyExamples.map((story, index) => (
              <div 
                key={index}
                className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
                  isDark 
                    ? 'bg-slate-800 border border-slate-700' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="relative h-56">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${story.color} opacity-10`} />
                </div>
                <div className="p-8">
                  <h3 className={`text-xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {story.title}
                  </h3>
                  <p className={`text-base leading-relaxed mb-6 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {story.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <button 
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        isDark 
                          ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-900 to-pink-900' 
          : 'bg-gradient-to-r from-purple-600 to-pink-600'
      }`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Start Your
            <span className="block">Story Adventure?</span>
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of storytellers creating magical adventures with StoryWeaver.
            Your imagination is the only limit!
          </p>
          
          {!user && (
            <Link
              href="/auth"
              className="inline-flex items-center px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 bg-white text-purple-600 hover:bg-purple-50"
            >
              <Heart className="w-6 h-6 mr-3" />
              Join the Magic
              <Sparkles className="w-5 h-5 ml-3" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
