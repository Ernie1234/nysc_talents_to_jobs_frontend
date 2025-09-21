import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../../hooks/useAuth';

export default function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleAuthSuccess, handleGoogleAuthError } = useGoogleAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (token) {
      handleGoogleAuthSuccess(token);
    } else if (error) {
      handleGoogleAuthError(error);
      navigate('/auth/login', { replace: true });
    } else {
      handleGoogleAuthError('oauth_failed');
      navigate('/auth/login', { replace: true });
    }
  }, [searchParams, navigate, handleGoogleAuthSuccess, handleGoogleAuthError]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing login...</p>
      </div>
    </div>
  );
}
