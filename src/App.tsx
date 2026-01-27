import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import BecomeNucleado from "./pages/BecomeNucleado";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Member Pages
import MemberPanel from "./pages/MemberPanel";
import MemberCompanyPage from "./pages/MemberCompanyPage";

// Admin Pages
import AdminPanel from "./pages/AdminPanel";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminCompaniesPage from "./pages/AdminCompaniesPage";
import AdminNewsPage from "./pages/AdminNewsPage";
import AdminFormPage from "./pages/AdminFormPage";
import AdminApplicationsPage from "./pages/AdminApplicationsPage";
import AdminReportsPage from "./pages/AdminReportsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/empresas" element={<Companies />} />
            <Route path="/empresas/:id" element={<CompanyDetail />} />
            <Route path="/membros" element={<Members />} />
            <Route path="/membros/:id" element={<MemberDetail />} />
            <Route path="/noticias" element={<News />} />
            <Route path="/noticias/:id" element={<NewsDetail />} />
            <Route path="/seja-nucleado" element={<BecomeNucleado />} />
            <Route path="/auth" element={<Auth />} />

            {/* Member Routes */}
            <Route path="/painel" element={<ProtectedRoute requireApproved><MemberPanel /></ProtectedRoute>} />
            <Route path="/painel/perfil" element={<ProtectedRoute requireApproved><MemberPanel /></ProtectedRoute>} />
            <Route path="/painel/empresa" element={<ProtectedRoute requireApproved><MemberCompanyPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminPanel /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute requireAdmin><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/empresas" element={<ProtectedRoute requireAdmin><AdminCompaniesPage /></ProtectedRoute>} />
            <Route path="/admin/noticias" element={<ProtectedRoute requireAdmin><AdminNewsPage /></ProtectedRoute>} />
            <Route path="/admin/formulario" element={<ProtectedRoute requireAdmin><AdminFormPage /></ProtectedRoute>} />
            <Route path="/admin/inscricoes" element={<ProtectedRoute requireAdmin><AdminApplicationsPage /></ProtectedRoute>} />
            <Route path="/admin/relatorios" element={<ProtectedRoute requireAdmin><AdminReportsPage /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
