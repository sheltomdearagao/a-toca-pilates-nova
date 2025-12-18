import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SessionProvider } from "./contexts/SessionProvider";
import { OrganizationProvider } from "./contexts/OrganizationProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import React from "react";
import { Loader2 } from "lucide-react";

// Páginas existentes
const Login = lazy(() => import("./pages/Login"));
const OrganizationSignup = lazy(() => import("./pages/OrganizationSignup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Financial = lazy(() => import("./pages/Financial"));
const Students = lazy(() => import("./pages/Students"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Welcome = lazy(() => import("./pages/Welcome"));

// Novas páginas do SIGADesk
const Landing = lazy(() => import("./pages/Landing"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrganizationSettings = lazy(() => import("./pages/OrganizationSettings"));

const queryClient = new QueryClient();

const App = () => (
  <Suspense fallback={
    <div className="flex items-center justify-center h-screen bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  }>
    <SessionProvider>
      <OrganizationProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/signup" element={<OrganizationSignup />} />
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<Layout />}>
                  <Route index element={<Welcome />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="agenda" element={<Schedule />} />
                  <Route path="financeiro" element={<Financial />} />
                  <Route path="alunos" element={<Students />} />
                  <Route path="alunos/:studentId" element={<StudentProfile />} />
                  <Route path="configuracoes" element={<OrganizationSettings />} />
                </Route>
              </Route>
              
              {/* Redirecionamentos */}
              <Route path="/app/*" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </OrganizationProvider>
    </SessionProvider>
  </Suspense>
);

export default App;