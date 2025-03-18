import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';

type GoogleAdsAccount = Database['public']['Tables']['google_ads_accounts']['Row'];

interface GoogleAdsOAuthProps {
  onAccountConnected: (account: Omit<GoogleAdsAccount, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  accountType: 'agency' | 'client';
  managerCustomerId: string;
}

export function GoogleAdsOAuth({ onAccountConnected, accountType, managerCustomerId }: GoogleAdsOAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);

      const clientId = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID;
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const scope = [
        'https://www.googleapis.com/auth/adwords',
        'https://www.googleapis.com/auth/adwords.manager'
      ].join(' ');

      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.append('client_id', clientId);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', scope);
      authUrl.searchParams.append('access_type', 'offline');
      authUrl.searchParams.append('prompt', 'consent');
      authUrl.searchParams.append('include_granted_scopes', 'true');

      // Open popup for OAuth
      const popup = window.open(
        authUrl.toString(),
        'Google Ads OAuth',
        'width=600,height=700'
      );

      if (!popup) {
        throw new Error('Failed to open OAuth popup');
      }

      // Listen for message from popup
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_ADS_OAUTH_SUCCESS') {
          const { code } = event.data;
          window.removeEventListener('message', handleMessage);
          popup.close();

          // Exchange code for tokens
          const response = await fetch('/api/google-ads-oauth-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              accountType,
              managerCustomerId,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to exchange OAuth code');
          }

          const account = await response.json();
          await onAccountConnected(account);
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Failed to connect Google Ads account:', error);
      // Handle error appropriately
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="w-full"
    >
      {isConnecting ? 'Connecting...' : 'Connect Google Ads Account'}
    </Button>
  );
} 