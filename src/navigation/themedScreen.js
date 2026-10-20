import React from 'react';
import { useTheme } from '../theme';

// Wraps per-theme variants of a screen behind a single route component.
// Once a module is merged into one theme-aware screen, register it directly instead.
export default function themedScreen(variants) {
  const Screen = (props) => {
    const { theme } = useTheme();
    const Component = variants[theme] || variants.white;
    return <Component {...props} />;
  };
  return Screen;
}
