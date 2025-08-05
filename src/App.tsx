import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, loading, signIn, signUp } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  const handleAuth = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const { error } = authMode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setAuthError(error.message);
      } else if (authMode === 'signup') {
        setAuthError('Account created successfully! Please check your email to verify your account.');
      }
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setAuthError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuth}
        loading={authLoading}
        onToggleMode={toggleAuthMode}
        error={authError}
      />
    );
  }

  return <Dashboard />;
}

export default App;