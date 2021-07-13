import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {AuthProvider} from './AuthProvider';
import Routes from './Routes';

/**
 * Wrap all providers here
 */
// Provider from the PaperProvider has to cover AuthProvider
// so that its components can be used everywherre in the application

export default function Providers() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  );
}
