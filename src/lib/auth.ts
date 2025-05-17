
import { User } from "@/types";

// Mock auth functionality - would be replaced by Firebase/Auth0 or other provider
const STORAGE_KEY = 'interview_app_user';
const SESSION_EXPIRY = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(STORAGE_KEY);
  if (!userJson) return null;
  
  const userData = JSON.parse(userJson);
  const loginTime = userData.loginTime || 0;
  
  // Check if session expired (4 hours)
  if (Date.now() - loginTime > SESSION_EXPIRY) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
  
  return userData.user;
}

export function setCurrentUser(user: User): void {
  const userData = {
    user,
    loginTime: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = "/";
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
