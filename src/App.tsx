
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Scheduler from "./pages/Scheduler";
import Tracker from "./pages/Tracker";
import PrepPage from "./pages/PrepPage";
import NewsPage from "./pages/NewsPage";
import Auth from "./pages/auth/Auth";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import JobDetails from "./pages/JobDetails";
import EditJob from "./pages/EditJob";
import RatingPage from "./pages/RatingPage";
import RatingsPage from "./pages/RatingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scheduler" element={<Scheduler />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/prep" element={<PrepPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/edit-job/:id" element={<EditJob />} />
              <Route path="/rate-interview/:id" element={<RatingPage />} />
              <Route path="/ratings" element={<RatingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
