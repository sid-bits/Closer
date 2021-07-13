import React, {useEffect} from 'react';
import Providers from './src/navigation';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  });
  // UseEffect from react used to hide the 'Splash Screen'

  return <Providers />;
}
