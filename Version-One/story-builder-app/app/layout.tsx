import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './styles/globals.css';
import { cn } from './lib/utils';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Fairytale Story Builder | Create Magical Interactive Stories',
  description: 'Build beautiful, branching interactive fairytale stories with our magical visual editor. Create, share, and play enchanting narratives.',
  keywords: ['interactive fiction', 'story builder', 'choose your own adventure', 'fairytale', 'storytelling'],
  authors: [{ name: 'Fairytale Builder' }],
  openGraph: {
    title: 'Fairytale Story Builder',
    description: 'Create magical interactive stories',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          inter.variable,
          poppins.variable,
          'font-sans antialiased min-h-screen'
        )}
      >
        {/* Starfield background effect */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" />
          {/* Animated stars */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="star absolute rounded-full bg-white"
              style={{
                width: Math.random() > 0.5 ? '2px' : '1px',
                height: Math.random() > 0.5 ? '2px' : '1px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Portal for modals */}
        <div id="modal-root" />
      </body>
    </html>
  );
}