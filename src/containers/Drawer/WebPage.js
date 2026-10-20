import React, { useMemo, useState } from 'react';
import { View, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../theme';
import { ScreenState } from '../../components';

// A wasil.io page shown inside the app with loading and offline states.
export default function WebPage({ uri }) {
  const { Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Colors.statusBar} backgroundColor={Colors.headerBg} />
      {failed ? (
        <ScreenState
          status="error"
          title="This page couldn't load"
          onRetry={() => {
            setFailed(false);
            setLoading(true);
            setAttempt((a) => a + 1);
          }}
        />
      ) : (
        <WebView
          key={attempt}
          source={{ uri }}
          style={styles.web}
          onLoadEnd={() => setLoading(false)}
          onError={() => setFailed(true)}
          onHttpError={(e) => e.nativeEvent.statusCode >= 500 && setFailed(true)}
        />
      )}
      {loading && !failed ? (
        <View style={styles.loader} pointerEvents="none">
          <ActivityIndicator size="large" color={Colors.textPrimary} />
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    web: { flex: 1, backgroundColor: Colors.background },
    loader: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  });
