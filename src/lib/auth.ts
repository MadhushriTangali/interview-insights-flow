
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Updated auth functionality to work with Supabase
export function getCurrentUser(): User | null {
  // This function should be used with auth state management
  // For immediate access, use the session from auth state
  return null;
}

export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  window.location.href = "/";
}

export function isAuthenticated(): boolean {
  // This should be used with auth state management
  // For immediate access, check if session exists
  return false;
}

// Helper function to get user ID from session
export function getUserId(session: Session | null): string | null {
  return session?.user?.id || null;
}

// Helper function to get user data from session
export function getUserData(session: Session | null): { name?: string; email?: string } | null {
  if (!session?.user) return null;
  
  return {
    name: session.user.user_metadata?.name || session.user.email,
    email: session.user.email || '',
  };
}
