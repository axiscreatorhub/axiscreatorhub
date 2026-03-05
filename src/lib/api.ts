import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

// Mock Auth Hook for Preview Environment without Clerk Keys
const useMockAuth = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoaded(true);
      setUserId('mock_user_123'); // Auto-login as mock user
    }, 500);
  }, []);

  return {
    isLoaded,
    userId,
    sessionId: 'mock_session',
    getToken: async () => 'mock_token_jwt',
    signOut: async () => {
      setUserId(null);
      window.location.href = '/';
    }
  } as any;
};

// Unified Auth Hook
export const useAppAuth = () => {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (clerkKey) {
    return useAuth();
  }
  
  return useMockAuth();
};

// API Client Wrapper
export const apiClient = async (
  endpoint: string, 
  options: RequestInit = {}, 
  getToken: () => Promise<string | null>
) => {
  const token = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API Error: ${response.statusText}`);
  }

  return response.json();
};
