
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
  // Ensure that the user ID is a valid UUID if it's a string
  if (user && typeof user.id === 'string' && !isValidUUID(user.id)) {
    // Generate a proper UUID for the user
    user.id = generateUUID();
  }

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

// Helper function to check if a string is a valid UUID
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Helper function to generate a UUID
function generateUUID(): string {
  // Simple UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
