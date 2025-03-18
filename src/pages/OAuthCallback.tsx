import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      // Handle the error case
      window.opener.postMessage(
        { type: 'GOOGLE_ADS_OAUTH_ERROR', error },
        window.location.origin
      );
      window.close();
      return;
    }
    
    if (code) {
      // Send the code back to the opener window
      window.opener.postMessage(
        { type: 'GOOGLE_ADS_OAUTH_SUCCESS', code },
        window.location.origin
      );
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication in progress...</h1>
        <p>This window should close automatically. If it doesn't, you can close it manually.</p>
      </div>
    </div>
  );
} 