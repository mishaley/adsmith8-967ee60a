import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type GoogleAdsAccount = Database['public']['Tables']['google_ads_accounts']['Row'];

export function useGoogleAdsAccounts() {
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isLoading: isLoadingUser } = useAuth();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get the current user's organization ID
        const { data: orgData, error: orgError } = await supabase
          .from('a1organization_users')
          .select('organization_id')
          .eq('user_id', user.id)
          .single();

        if (orgError) throw orgError;

        // Fetch Google Ads accounts for the organization
        const { data: accountsData, error: accountsError } = await supabase
          .from('google_ads_accounts')
          .select('*')
          .eq('organization_id', orgData.organization_id);

        if (accountsError) throw accountsError;

        setAccounts(accountsData || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch Google Ads accounts'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

  const addAccount = async (account: Omit<GoogleAdsAccount, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('google_ads_accounts')
        .insert(account)
        .select()
        .single();

      if (error) throw error;

      setAccounts(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add Google Ads account');
    }
  };

  return {
    accounts,
    isLoading: isLoading || isLoadingUser,
    error,
    addAccount,
  };
} 