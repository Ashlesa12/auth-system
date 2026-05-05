
import { LogOut, User as UserIcon, LayoutDashboard, Key, ShieldCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ModeToggle } from "../components/ModeToggle";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <LayoutDashboard className="h-6 w-6" />
            <span className="font-semibold text-lg tracking-tight text-foreground">Vault Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground mt-2">Manage your account and view your security details below.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-2">
                  <UserIcon className="h-5 w-5" />
                </div>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Your personal account information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <p className="font-medium bg-secondary/50 px-3 py-2 rounded-md border border-border">
                    {user?.email || "No email available"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm bg-secondary/50 px-3 py-2 rounded-md border border-border text-muted-foreground break-all">
                    {user?.id || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center mb-2">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Your current authentication status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md border border-border">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] relative">
                    <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                  </div>
                  <p className="text-sm font-medium">Session Active</p>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md border border-border">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">JWT Token Secured</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}