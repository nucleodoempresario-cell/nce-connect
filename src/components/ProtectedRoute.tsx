import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireApproved?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, requireApproved = false }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading, profile } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/painel" replace />;
  }

  // Check if profile is pending approval (only when requireApproved is true)
  if (requireApproved && profile?.status === 'pendente' && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Aguardando Aprovação</h1>
          <p className="text-muted-foreground">
            Sua conta está pendente de aprovação. Você receberá acesso assim que 
            um administrador aprovar seu cadastro.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
