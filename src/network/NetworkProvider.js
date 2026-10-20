import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';

import NetInfo from '@react-native-community/netinfo';

const NetworkContext = createContext({
  isConnected: true,
  isInternetReachable: true,
  isSlow: false,
});

export const NetworkProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const [isSlow, setIsSlow] = useState(false);

  // Prevent an old internet check from overwriting a newer result
  const checkIdRef = useRef(0);

  const checkInternetSpeed = useCallback(async () => {
    const currentCheckId = ++checkIdRef.current;

    const startTime = Date.now();

    let timeoutId = null;

    try {
      const controller = new AbortController();

      timeoutId = setTimeout(() => {
        controller.abort();
      }, 8000);

      const response = await fetch(
        'https://www.google.com/generate_204',
        {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        },
      );

      clearTimeout(timeoutId);

      // Ignore result if another check has already started
      if (currentCheckId !== checkIdRef.current) {
        return;
      }

      const responseTime = Date.now() - startTime;

      console.log(
        'Internet response time:',
        responseTime,
        'ms',
      );

      if (response.ok) {
        setIsInternetReachable(true);

        if (responseTime >= 5000) {
          setIsSlow(true);
        } else {
          setIsSlow(false);
        }
      } else {
        setIsInternetReachable(false);
        setIsSlow(false);
      }

    } catch (error) {

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Ignore old request result
      if (currentCheckId !== checkIdRef.current) {
        return;
      }

      console.log(
        'Internet check error:',
        error?.message || error,
      );

      setIsInternetReachable(false);
      setIsSlow(false);
    }

  }, []);


  useEffect(() => {

    // Get initial network state
    NetInfo.fetch().then(state => {

      console.log(
        'Initial Network State:',
        state,
      );

      setIsConnected(
        state.isConnected,
      );

      if (state.isConnected === false) {

        setIsInternetReachable(false);
        setIsSlow(false);

      } else {

        // Always perform real internet check
        checkInternetSpeed();

      }

    });


    // Listen for network changes
    const unsubscribe = NetInfo.addEventListener(
      state => {

        console.log(
          'Network changed:',
          state,
        );

        setIsConnected(
          state.isConnected,
        );


        // Completely disconnected
        if (state.isConnected === false) {

          setIsInternetReachable(false);
          setIsSlow(false);

          return;
        }


        // IMPORTANT:
        // Do NOT return when isInternetReachable === false.
        //
        // Android can temporarily report false/null
        // while the connection is coming back.
        //
        // Instead, actually test the internet.

        checkInternetSpeed();

      },
    );


    // Check every 30 seconds
    const interval = setInterval(() => {

      NetInfo.fetch().then(state => {

        setIsConnected(
          state.isConnected,
        );

        if (state.isConnected === false) {

          setIsInternetReachable(false);
          setIsSlow(false);

          return;
        }

        checkInternetSpeed();

      });

    }, 30000);


    return () => {

      unsubscribe();

      clearInterval(interval);

    };

  }, [checkInternetSpeed]);


  return (
   <NetworkContext.Provider
  value={{
    isConnected,
    isInternetReachable,
    isSlow,
    checkInternetSpeed,
  }}>

      {children}

    </NetworkContext.Provider>
  );
};


export const useNetwork = () => {
  return useContext(NetworkContext);
};