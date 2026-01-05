'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Profile page component
export default function ProfilePage() {
  const { session, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (!session.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Please log in to view your profile</h1>
          <Button onClick={() => router.push('/auth/login')} variant="gradient">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <Navbar user={session.data.user} onLogout={handleLogout} />
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Profile Settings
            </h1>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* User Card */}
            <div className="md:col-span-1">
              <Card className="p-6 text-center space-y-4 h-full glass border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-1 mb-4 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-background overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.data.user?.email || 'user'}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{session.data.user?.name}</h2>
                  <p className="text-muted-foreground text-sm">{session.data.user?.email}</p>
                  
                  <div className="pt-6">
                    <Button 
                      variant="outline" 
                      className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Details Card */}
            <div className="md:col-span-2">
              <Card className="p-8 h-full glass border-white/10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
                
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Full Name</Label>
                      <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 font-medium">
                        {session.data.user?.name || 'Not set'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Email Address</Label>
                      <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 font-medium">
                        {session.data.user?.email}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">User ID</Label>
                      <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 font-mono text-sm text-muted-foreground">
                        {session.data.user?.id}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Account Status</Label>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/50">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Account Statistics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                        <div className="text-2xl font-bold text-primary">0</div>
                        <div className="text-xs text-muted-foreground mt-1">Total Tasks</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
                        <div className="text-xs text-muted-foreground mt-1">Completed</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-orange-500/5 hover:bg-orange-500/10 transition-colors">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">0</div>
                        <div className="text-xs text-muted-foreground mt-1">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}