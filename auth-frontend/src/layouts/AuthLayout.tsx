import { Outlet } from "react-router-dom";
import { Shield } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-20">
        <div className="absolute w-150 h-150 bg-primary/20 rounded-full blur-3xl -top-32 -left-32 animate-pulse" />
        <div className="absolute w-100 h-100 bg-sky-500/20 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse" />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4 ring-1 ring-primary/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Vault</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}