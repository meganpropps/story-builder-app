"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { Moon, Sun, BookOpen, Palette, Sparkles } from "lucide-react";

type LayoutProps = {
  children: ReactNode;
};

function AppLayout({ children }: LayoutProps) {
  const { isDark, toggleTheme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
  
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800' 
        : 'bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50'
    }`}>
      <style>{`
        :root {
          --primary: ${isDark ? '255 255 255' : '124 58 237'};
          --primary-foreground: ${isDark ? '0 0 0' : '255 255 255'};
          --background: ${isDark ? '15 23 42' : '255 255 255'};
          --foreground: ${isDark ? '248 250 252' : '15 23 42'};
          --muted: ${isDark ? '51 65 85' : '248 250 252'};
          --muted-foreground: ${isDark ? '148 163 184' : '100 116 139'};
          --border: ${isDark ? '51 65 85' : '226 232 240'};
          --card: ${isDark ? '30 41 59' : '255 255 255'};
          --card-foreground: ${isDark ? '248 250 252' : '15 23 42'};
        }
        
        .comic-shadow {
          box-shadow: ${isDark 
            ? '0 8px 0 rgb(124 58 237 / 0.3), 0 0 20px rgb(124 58 237 / 0.2)' 
            : '0 8px 0 rgb(124 58 237 / 0.3), 0 12px 24px rgb(124 58 237 / 0.2)'
          };
        }
        
        .comic-border {
          border: 3px solid ${isDark ? 'rgb(139 92 246)' : 'rgb(124 58 237)'};
        }
      `}</style>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
        isDark 
          ? 'bg-slate-900/90 border-slate-700' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-4 group"
            >
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'bg-purple-600 hover:bg-purple-500' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  StoryWeaver
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Craft magical adventures
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-slate-600'
                }`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {session?.user ? (
                <>
                  <Link href="/dashboard">
                    <button className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isDark 
                        ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}>
                      <Palette className="w-4 h-4 mr-2" />
                      My Stories
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600' 
                        : 'bg-gray-100 hover:bg-gray-200 text-slate-600 border border-gray-300'
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth">
                  <button className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isDark 
                      ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className={`py-12 text-center ${
        isDark ? 'bg-slate-900/50' : 'bg-gray-50/50'
      } backdrop-blur-sm border-t ${
        isDark ? 'border-slate-700' : 'border-gray-200'
      }`}>
        <p className={`text-sm ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          © {new Date().getFullYear()} StoryWeaver — Create. Share. Inspire.
        </p>
      </footer>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  );
}