import React from 'react';

// Auth form deprecated in anonymous mode. This stub prevents import errors.
export default function AuthForm() {
  React.useEffect(() => {
    console.warn('AuthForm rendered but authentication is disabled in anonymous mode');
  }, []);
  return null;
}
