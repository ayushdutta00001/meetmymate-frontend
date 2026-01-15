import React from 'react';
import MainLauncher from './MainLauncher';
import { AuthProvider } from './lib/auth-context';

export default function App() {
  return (
    <AuthProvider>
      <MainLauncher />
    </AuthProvider>
  );
}