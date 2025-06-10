import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Albums from "./pages/Albums";
import AlbumDetails from "./pages/AlbumDetails";
import NotFound from "./pages/NotFound";
import RejectedAlbums from "./pages/RejectedAlbums";
import LiveAlbums from "./pages/LiveAlbums";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/album/:id" element={<AlbumDetails />} />
          <Route path="/rejected-albums" element={<RejectedAlbums />} />
          <Route path="/live-albums" element={<LiveAlbums />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
