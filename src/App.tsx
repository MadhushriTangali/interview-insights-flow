
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Scheduler from "./pages/Scheduler";
import Tracker from "./pages/Tracker";
import PrepPage from "./pages/PrepPage";
import Auth from "./pages/auth/Auth";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import EditJob from "./pages/EditJob";
import JobDetails from "./pages/JobDetails";
import RatingPage from "./pages/RatingPage";
import ProfilePage from "./pages/ProfilePage";
import NewsPage from "./pages/NewsPage";
import FeedbackPage from "./pages/FeedbackPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/prep" element={<PrepPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/edit-job/:id" element={<EditJob />} />
            <Route path="/job-details/:id" element={<JobDetails />} />
            <Route path="/rate/:id" element={<RatingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
