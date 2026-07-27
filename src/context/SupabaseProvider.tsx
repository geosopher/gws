import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, verifySupabaseConnection } from '../lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  supabase: SupabaseClient;
  isConnected: boolean;
  connectionMessage: string;
  isChecking: boolean;
  verifyConnection: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionMessage, setConnectionMessage] = useState<string>('Initializing Supabase connection...');
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const verifyConnection = async () => {
    setIsChecking(true);
    const result = await verifySupabaseConnection();
    setIsConnected(result.success);
    setConnectionMessage(result.message);
    setIsChecking(false);
  };

  useEffect(() => {
    verifyConnection();
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        isConnected,
        connectionMessage,
        isChecking,
        verifyConnection,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
