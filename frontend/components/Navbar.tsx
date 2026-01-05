'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Simple Icons component to replace external dependency if needed, or keep if it exists
import { Icons } from '@/components/icons';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
}

interface NavbarProps {
  user?: User | null;
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    // Check system preference or localStorage
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-lg shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110">
            {/* Fallback icon if Icons.task is missing */}
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            TaskMaster
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-accent transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </Button>

          <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-background ring-indigo-500/50 hover:ring-indigo-500 transition-all">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'user'}`} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 glass" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.name && <p className="font-medium">{user.name}</p>}
                  {user?.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                </div>
              </div>
              <div className="h-px bg-border my-2" />
              <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground" onClick={onLogout}>
                 <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
                 <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}