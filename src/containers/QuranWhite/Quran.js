import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import AppNavigation from './navigation';
import { Provider } from 'react-redux';
import store from './redux/reduxToolkit/store';
const Quran = () => {
  useEffect(() => {
    LogBox.ignoreLogs([
      'Warning: ...',
      'Deprecation warning: ...',
    ]);

    LogBox.ignoreAllLogs(true);
  }, []);

  
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
};

export default Quran;
