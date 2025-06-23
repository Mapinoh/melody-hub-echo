
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AudioProvider } from "@/hooks/useAudioPlayer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Artist from "./pages/Artist";
import Playlists from "./pages/Playlists";
import TrackDetail from "./pages/TrackDetail";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Discover from "./pages/Discover";
import Podcasts from "./pages/Podcasts";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AudioProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/playlists" element={
                <ProtectedRoute>
                  <Playlists />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />
              <Route path="/library" element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              } />
              <Route path="/discover" element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              } />
              <Route path="/podcasts" element={
                <ProtectedRoute>
                  <Podcasts />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/artist-dashboard" element={
                <ProtectedRoute>
                  <ArtistDashboard />
                </ProtectedRoute>
              } />
              <Route path="/artist/:artistId" element={
                <ProtectedRoute>
                  <Artist />
                </ProtectedRoute>
              } />
              <Route path="/track/:trackId" element={
                <ProtectedRoute>
                  <TrackDetail />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AudioProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
